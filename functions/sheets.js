const { DateTime } = require('luxon');
const fs = require('fs');
const { google } = require('googleapis');
// const querystring = require('querystring');
const readline = require('readline');
const schedule = require('node-schedule');
const email = require('./email');

const Config = require('../models/config');

Config.get().then((config) => {


});

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = './config/token.json';

/**
* Create an OAuth2 client with the given credentials, and then execute the
* given callback function.
* @param {Object} credentials The authorization client credentials.
* @param {function} callback The callback to call with the authorized client.
* @param {function} anotherCallback The callback to call to get the returned object
*/
function authorize(credentials, callback, anotherCallback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, (response) => anotherCallback(response));
  });
}

/**
* Get and store new token after prompting for user authorization, and then
* execute the given callback with the authorized OAuth2 client.
* @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
* @param {getEventsCallback} callback The callback for the authorized client.
*/
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error('Error while trying to retrieve access token', err);
        throw err;
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) {
          console.error(err);
          throw err;
        }
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
* Prints the names and majors of students in a sample spreadsheet:
* @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
* @param {function} callback The callback to call to return the object.
*/
function getMandatory(auth, callback) {
  const sheets = google.sheets({ version: 'v4', auth });
  const SPREADSHEET_ID_READ = global.config.sheets.read.id;
  const RANGE_READ = global.config.sheets.read.range;
  sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID_READ,
    range: RANGE_READ
  }, (err, res) => {
    if (err) {
      console.log(`The API returned an error: ${err}`);
      throw err;
    }
    const rows = res.data.values;
    if (rows.length) {
      return callback(rows);
    }
    console.log('No data found.');
  });
}

/**
* Prints the names and majors of students in a sample spreadsheet:
* @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
*/
function writeReport(auth) {
  const SPREADSHEET_ID_WRITE = global.config.sheets.write.id;
  const RANGE_WRITE = global.config.sheets.write.range;
  const INCLUDE_VALUE_IN_RESPONSE = global.config.sheets.write.includeValuesInResponse;
  const INSERT_DATA_OPTION = global.config.sheets.write.insertDataOption;
  const RESPONSE_DATE_TIME_RENDER_OPTION = global.config.sheets.write.responseDateTimeRenderOption;
  const RESPONSE_VALUE_RENDER_OPTION = global.config.sheets.write.responseValueRenderOption;
  const VALUE_INPUT_OUTPUT = global.config.sheets.write.valueInputOption;
  const values = this.report;
  const resource = {
    range: RANGE_WRITE,
    values
  };
  const sheets = google.sheets({ version: 'v4', auth });

  const data = {
    to: 'viniciusfontes@cpejr.com.br',
    subject: 'Tentativa de escrever relatório',
    text: 'A aplicação iniciou a escrita do relatório na planilha',
    attachments: []
  };
  email.sendEmail(data);

  sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID_WRITE,
    range: RANGE_WRITE,
    includeValuesInResponse: INCLUDE_VALUE_IN_RESPONSE,
    insertDataOption: INSERT_DATA_OPTION,
    responseDateTimeRenderOption: RESPONSE_DATE_TIME_RENDER_OPTION,
    responseValueRenderOption: RESPONSE_VALUE_RENDER_OPTION,
    valueInputOption: VALUE_INPUT_OUTPUT,
    resource
  }, (err, res) => {
    if (err) {
      const now = DateTime.local();
      now.plus({ minutes: 2 });
      const job = schedule.scheduleJob(now, () => {
        Sheets.writeReportGoogleSheets(this.report);
      });
      const data = {
        to: 'viniciusfontes@cpejr.com.br',
        subject: 'Erro ao escrever relatório',
        text: `Ocorreu um erro ao tentar escrever o relatório na planilha:
        ${err}`,
        attachments: []
      };
      email.sendEmail(data);
      console.log(`The API returned an error: ${err}`);
      throw err;
    }
    const range = RANGE_WRITE.slice(RANGE_WRITE.indexOf('!') + 1);
    const newRange = RANGE_WRITE.slice(0, RANGE_WRITE.indexOf('!') + 1) + String.fromCharCode(range.slice(0, 1).charCodeAt() + 1) + range.slice(1);
    updateRange(newRange);
    return console.log(`${res.data.updates.updatedCells} cells appended.`);
  });
}

function updateRange(range) {
  Config.getOneByQuery({ config_id: 'production' }).then((object) => {
    const configuration = global.config;
    configuration.sheets.write.range = range;
    Config.update(object._id, configuration).catch(error => console.log(error));
  });
}

class Sheets {
  /**
  * Load client secrets from a local file.
  * @param {function} callback The callback to call to return the object.
  */
  static getMandatoryGoogleSheets(callback) {
    fs.readFile('./config/credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Sheets API.
      authorize(JSON.parse(content), getMandatory, response => callback(response));
    });
  }

  /**
  * Load client secrets from a local file.
  * @param {function} callback The callback to call to return the object.
  */
  static writeReportGoogleSheets(report, callback) {
    fs.readFile('./config/credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Sheets API.
      authorize(JSON.parse(content), writeReport.bind({ report }), response => callback(response));
    });
  }
}

module.exports = Sheets;
