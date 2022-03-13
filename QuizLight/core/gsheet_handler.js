import sign from 'react-native-jwt-rsa';

export class GSheetHandler {
  constructor(clientEmail, clientPrivateKey, scopes) {
    this.authUrl = 'https://oauth2.googleapis.com/token';
    this.clientEmail = clientEmail;
    this.clientPrivateKey = clientPrivateKey;
    this.scopes = scopes;
    this.tokenDescr = null;
  }

  getFormBody(body) {
    if (!body) {
      return '';
    }

    return Object.keys(body)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key]))
      .join('&');
  }

  getSignedJwt() {
    const now = parseInt(Date.now() / 1000, 10);

    const payload = {
      iss: this.clientEmail,
      scope: this.scopes,
      aud: this.authUrl,
      exp: now + 3600,
      iat: now,
    };

    return sign(this.clientPrivateKey, payload);
  }

  async getGoogleAccessToken() {
    if (
      this.tokenDescr !== null &&
      this.tokenDescr.expirationDate > new Date().getTime()
    ) {
      return this.tokenDescr;
    }

    const signedJwt = this.getSignedJwt();

    const body = {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: signedJwt,
    };

    try {
      const response = await fetch(this.authUrl, {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: this.getFormBody(body),
      });

      const responseJson = await response.json();

      this.tokenDescr = {
        token: responseJson.access_token,
        expirationDate: new Date().getTime() + responseJson.expires_in - 10,
        type: responseJson.token_type,
      };

      if (response.status >= 300 || response.status < 200) {
        console.error(
          `An error occurred while getting the token. Status code: ${response.status}.`,
        );

        return null;
      }
    } catch (error) {
      console.error(
        `An error occurred while getting the token. Error: ${error}.`,
      );

      this.tokenDescr = null;
    }

    return this.tokenDescr;
  }

  async getValues(spreadsheetId, sheetName, sheetRange) {
    const tokenDescr = await this.getGoogleAccessToken();

    if (tokenDescr === null) {
      return null;
    }

    try {
      const fullRange = `${sheetName}!${sheetRange}`;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${fullRange}`;

      const response = await fetch(url, {
        method: 'get',
        headers: {
          Authorization: `${tokenDescr.type} ${tokenDescr.token}`,
        },
      });

      if (response.status >= 300 || response.status < 200) {
        console.error(
          `An error occurred while getting the values. Status code: ${response.status}.`,
        );

        return null;
      }

      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(
        `An error occurred while getting the values. Error: ${error}.`,
      );

      return null;
    }
  }

  async updateValues(
    spreadsheetId,
    sheetName,
    sheetRange,
    valueInputOption,
    values,
  ) {
    const tokenDescr = await this.getGoogleAccessToken();

    if (tokenDescr === null) {
      return false;
    }

    const body = {
      values: values,
    };

    const fullRange = `${sheetName}!${sheetRange}`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${fullRange}?valueInputOption=${valueInputOption}`;

    const response = await fetch(url, {
      method: 'put',
      headers: {
        Authorization: `${tokenDescr.type} ${tokenDescr.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.status >= 300 || response.status < 200) {
      console.error(
        `Something wrong happened while updating the values. Status code: ${response.status}.`,
      );

      return false;
    }

    return true;
  }
}
