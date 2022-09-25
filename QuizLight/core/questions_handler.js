import Config from 'react-native-config';
import SQLite from 'react-native-sqlite-storage';

import {Grade} from './grades';
import {GSheetHandler} from './gsheet_handler';

export const QuestionsHandler = (() => {
  let instance = null;

  function createInstance() {
    return new PrivateQuestionsHandler();
  }

  return {
    getInstance: () => {
      if (instance === null) {
        instance = createInstance();
      }

      return instance;
    },
  };
})();

class PrivateQuestionsHandler {
  constructor() {
    this.handler = new GSheetHandler(
      Config.GOOGLE_SERVICE_CLIENT_EMAIL,
      Config.GOOGLE_SERVICE_PRIVATE_KEY,
      Config.GOOGLE_API_SCOPES,
    );

    this.db = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    this.db = SQLite.openDatabase(
      {
        name: 'database',
        location: 'default',
        createFromLocation: '~database.db',
      },
      () => {},
      error => {
        console.error(`Error while connecting to the database: ${error}`);
      },
    );

    this.isInitialized = true;
    await this.initQuestions();
  }

  async executeQuery(query, params = []) {
    if (!this.isInitialized) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.db.transaction(trans => {
        trans.executeSql(
          query,
          params,
          (transaction, results) => {
            resolve(results);
          },
          error => {
            console.error(error);
            reject(error);
          },
        );
      });
    });
  }

  async getData(query, params = []) {
    const result = await this.executeQuery(query, params);
    const rows = result.rows;

    if (rows.length <= 0) {
      return null;
    }

    return rows.item;
  }

  sanitizeStr(str) {
    if (!str) {
      return '';
    }

    return str.replace(/'/g, "''");
  }

  async emptyQuestions() {
    if (!this.isInitialized) {
      return;
    }

    await this.executeQuery(`
      DROP TABLE IF EXISTS data_items;
    `);

    await this.executeQuery(`
      DROP TABLE IF EXISTS questions;
    `);

    await this.executeQuery(`
      DROP TABLE IF EXISTS grades;
    `);
  }

  async initQuestions() {
    if (!this.isInitialized) {
      return;
    }

    await this.executeQuery(
      `CREATE TABLE IF NOT EXISTS grades (
        id INTEGER PRIMARY KEY NOT NULL, 
        name VARCHAR(16) UNIQUE
      )`,
      [],
    );

    await this.executeQuery(
      `CREATE TABLE IF NOT EXISTS questions (
        quiz_id VARCHAR(16),
        id INTEGER PRIMARY KEY NOT NULL, 
        grade_id INTEGER,
        question VARCHAR(16), 
        answer VARCHAR(16), 
        notes VARCHAR(16),
        CONSTRAINT fk_grades FOREIGN KEY (grade_id) REFERENCES grades(id)
      )`,
      [],
    );

    const grades = Grade.Grades;
    const count = Grade.Grades.length;

    if (count <= 0) {
      return;
    }

    let sqlValues = '';

    for (let i = 0; i < count; i++) {
      const grade = grades[i];

      sqlValues += `(${grade.id}, '${this.sanitizeStr(grade.name)}'), `;
    }

    if (sqlValues) {
      sqlValues = sqlValues.slice(0, -2) + ';';
    }

    await this.executeQuery(
      `REPLACE INTO grades (id, name) VALUES ${sqlValues}`,
    );
  }

  async reloadQuestions(quizDescr) {
    if (!this.isInitialized) {
      return;
    }

    await this.emptyQuestions();
    await this.initQuestions();
    return await this.getQuestions(quizDescr);
  }

  async getQuestions(quizDescr) {
    if (!this.isInitialized) {
      return false;
    }

    const response = await this.handler.getValues(
      quizDescr.spreadsheetId,
      quizDescr.sheetName,
      quizDescr.sheetRange,
    );

    if (response === null) {
      return false;
    }

    const count = response.values.length;
    let sqlValues = '';

    for (let i = 0; i < count; i++) {
      const row = response.values[i];

      if (!row || row.length < 4) {
        continue;
      }

      const quizId = quizDescr.quizId;
      const id = parseInt(row[0], 10);
      const gradeName = row[1].trim();
      const question = row[2].trim();
      const answer = row[3].trim();
      const grade = Grade.getGradeFromName(gradeName);

      if (isNaN(id) || grade === null || !question || !answer) {
        continue;
      }

      const notes = row.length > 4 ? row[4].trim() : '';

      sqlValues += `(
        '${quizId}',
        ${id},
        '${grade.id}',
        '${this.sanitizeStr(question)}',
        '${this.sanitizeStr(answer)}',
        '${this.sanitizeStr(notes)}'
      ), `;
    }

    if (sqlValues) {
      sqlValues = sqlValues.slice(0, -2) + ';';
    }

    await this.executeQuery(
      `REPLACE INTO questions (quiz_id, id, grade_id, question, answer, notes) VALUES ${sqlValues}`,
    );

    return true;
  }

  async getQuestion(quizDescr, id) {
    const questions = await this.getData(
      `SELECT * FROM questions WHERE quiz_id = '${quizDescr.quizId}' AND id = ${id}`,
    );

    if (questions === null) {
      return null;
    }

    return this.getFormattedQuestion(questions(0));
  }

  generateGradeFilter(gradeIds) {
    if (gradeIds === null) {
      return null;
    }

    const count = gradeIds.length;

    if (count <= 0) {
      return null;
    }

    let gradeFilter = '(';

    for (let i = 0; i < count; i++) {
      const gradeId = gradeIds[i];

      gradeFilter += `grade_id = '${gradeId}'`;

      if (i >= count - 1) {
        continue;
      }

      gradeFilter += ' OR ';
    }

    gradeFilter += ')';

    return gradeFilter;
  }

  generateIdFilter(ids) {
    if (ids === null) {
      return null;
    }

    const count = ids.length;

    if (count <= 0) {
      return null;
    }

    let idFilter = '';

    for (let i = 0; i < count; i++) {
      idFilter += `id != ${ids[i]}`;

      if (i === count - 1) {
        continue;
      }

      idFilter += ' AND ';
    }

    return idFilter;
  }

  getFormattedQuestion(question) {
    return {
      id: question.id,
      grade: Grade.getGradeFromId(question.grade_id).name,
      question: question.question,
      answer: question.answer,
      notes: question.notes ? question.notes : null,
    };
  }

  async getRandomQuestion(quizDescr, gradeIds = null, idsToFilter = null) {
    if (!this.isInitialized) {
      return null;
    }

    const gradeFilter = this.generateGradeFilter(gradeIds);
    const idFilter = this.generateIdFilter(idsToFilter);
    let filter = '';

    if (gradeFilter !== null) {
      filter += ` WHERE ${gradeFilter}`;

      if (idFilter !== null) {
        filter += ` AND ${idFilter}`;
      }
    } else if (idFilter !== null) {
      filter += ` WHERE ${idFilter}`;
    }

    if (!filter) {
      filter += ' WHERE ';
    } else {
      filter += ' AND ';
    }

    filter += `quiz_id = '${quizDescr.quizId}'`;

    const questions = await this.getData(`SELECT * FROM questions 
      ${filter} 
      ORDER BY RANDOM()
      LIMIT 1`);

    if (questions === null) {
      return null;
    }

    return this.getFormattedQuestion(questions(0));
  }

  async getQuestionCount(quizDescr, grades = null) {
    if (!this.isInitialized) {
      return;
    }

    const questionsTable = await this.getData(`
      SELECT name FROM sqlite_master 
        WHERE type='table' AND name='questions';
    `);

    if (questionsTable === null) {
      return 0;
    }

    let filter;
    const gradeFilter = this.generateGradeFilter(grades);

    if (gradeFilter !== null) {
      filter = ` WHERE ${gradeFilter} AND quiz_id = '${quizDescr.quizId}'`;
    } else {
      filter = '';
    }

    const selectExpr = 'COUNT(*)';

    const countResult = await this.getData(
      `SELECT ${selectExpr} FROM questions${filter};`,
    );

    if (countResult === null) {
      return 0;
    }

    const countDescr = countResult(0);

    if (!countDescr.hasOwnProperty(selectExpr)) {
      return 0;
    }

    return countDescr[selectExpr];
  }

  async updateQuestion(quizDescr, id, newGrade) {
    if (!this.isInitialized) {
      return {
        isUpdated: false,
        message: 'QuestionsHandler is not initialized!',
      };
    }

    const rowIndex = id + 1;
    const localQuestion = await this.getQuestion(quizDescr, id);

    if (localQuestion === null) {
      return {
        isUpdated: false,
        message:
          'Local question does not seem to exist. This is super weird, sorry.',
      };
    }

    const remoteQuestions = await this.handler.getValues(
      quizDescr.spreadsheetId,
      quizDescr.sheetName,
      `${rowIndex}:${rowIndex}`,
    );

    const remoteQuestionDoesNotExistError =
      'Remote question does not seem to exist. Check your network connectivity and be sure your questions are up to date?';

    if (remoteQuestions === null || remoteQuestions.values.length <= 0) {
      return {
        isUpdated: false,
        message: remoteQuestionDoesNotExistError,
      };
    }

    const remoteQuestion = remoteQuestions.values[0];

    if (remoteQuestion === null) {
      return {
        isUpdated: false,
        message: remoteQuestionDoesNotExistError,
      };
    } else if (remoteQuestion.length < 4) {
      return {
        isUpdated: false,
        message:
          'The remote question seems to be malformed. Are you sure your questions are up to date?',
      };
    }

    if (
      localQuestion.id !== parseInt(remoteQuestion[0], 10) ||
      localQuestion.grade !== remoteQuestion[1].trim() ||
      localQuestion.question !== remoteQuestion[2].trim() ||
      localQuestion.answer !== remoteQuestion[3].trim() ||
      (localQuestion.notes !== null && remoteQuestion.length < 5) ||
      (localQuestion.notes !== null &&
        localQuestion.notes !== remoteQuestion[4].trim())
    ) {
      return {
        isUpdated: false,
        message:
          'Remote question does not seem to match. Are you sure your questions are up to date?',
      };
    }

    const isUpdated = await this.handler.updateValues(
      quizDescr.spreadsheetId,
      quizDescr.sheetName,
      `B${rowIndex}`,
      'RAW',
      [[newGrade.name]],
    );

    if (isUpdated) {
      this.executeQuery(`UPDATE questions
      SET grade_id = '${newGrade.id}'
      WHERE quiz_id = '${quizDescr.quizId}' AND id = ${id}`);
    }

    return {
      isUpdated: isUpdated,
      message: isUpdated
        ? null
        : 'Something went wrong while trying to update. Are you connected to the internet?',
    };
  }
}
