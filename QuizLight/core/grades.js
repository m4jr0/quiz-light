export class Grade {
  static Unknown = new Grade(-1, 'Unknown');
  static All = new Grade(0, 'All');
  static Miss = new Grade(1, 'Miss');
  static Serf = new Grade(2, 'Serf');
  static Knight = new Grade(3, 'Knight');
  static Wizard = new Grade(4, 'Wizard');
  static God = new Grade(5, 'God');

  static Grades = [this.Miss, this.Serf, this.Knight, this.Wizard, this.God];

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  static getGradeFromId(id) {
    for (const grade of this.Grades) {
      if (grade.id === id) {
        return grade;
      }
    }

    return null;
  }

  static getGradeFromName(name) {
    for (const grade of this.Grades) {
      if (grade.name === name) {
        return grade;
      }
    }

    return null;
  }
}
