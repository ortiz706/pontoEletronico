/**
 * npm modules
 */
const { DateTime } = require('luxon');
const { Interval } = require('luxon');

/**
 * Models
 */
const Report = require('../models/report');
const Schedule = require('../models/schedule');
const User = require('../models/user');

/**
* Functions
*/
const Sheets = require('../functions/sheets');

function findUserAndAddSchedule(name, startTime, endTime, weekday) {
  return new Promise((resolve, reject) => {
    Schedule.getOneByQuery({ startTime, endTime, weekday }).then((schedule) => {
      User.getOneByQuery({ name }).then((user) => {
        if (user) {
          User.addSchedule(user._id, schedule._id).then(() => {
            resolve();
          }).catch((error) => {
            reject(error);
          });
        }
        else {
          const error = {
            code: 'user-not-found',
            message: `Usuário "${name}" não encontrado.`
          };
          reject(error);
        }
      }).catch((error) => {
        reject(error);
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

class Mandatory {
  /**
   * Create all the schedules
   */
  static createSchedules() {
    return new Promise((resolve, reject) => {
      Schedule.deleteAll().then(() => {
        Sheets.getMandatoryGoogleSheets((result) => {
          let startTime;
          let endTime;
          for (let i = 1; i < result.length; i++) {
            if (result[i][0] !== '' && result[i][0] !== undefined) {
              startTime = result[i][0].slice(0, 5);
              endTime = result[i][0].slice(8);
              for (let j = 1; j < result[0].length; j++) {
                const schedule = {
                  weekday: j,
                  startTime,
                  endTime
                };
                Schedule.create(schedule).then(() => {
                  resolve();
                }).catch((error) => {
                  reject(error);
                });
              }
            }
          }
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * Updates all the users with their respective schedules taken from google sheets
   */
  static scheduleUpdateGoogleSheets() {
    return new Promise((resolve, reject) => {
      const promises = [];
      Mandatory.createSchedules().then(() => {
        Sheets.getMandatoryGoogleSheets((result) => {
          let startTime;
          let endTime;
          for (let j = 1; j < result[0].length; j++) {
            for (let i = 1; i < result.length; i++) {
              if (result[i][0] !== '' && result[i][0] !== undefined) {
                startTime = result[i][0].slice(0, 5);
                endTime = result[i][0].slice(8);
              }
              if (result[i][j] !== '' && result[i][j] !== undefined) {
                const name = result[i][j];
                const promise = findUserAndAddSchedule(name, startTime, endTime, j);
                promises.push(promise);
              }
            }
          }
          Promise.all(promises).then(() => {
            resolve();
          }).catch((error) => {
            reject(error);
          });
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * Compiles the last week
   * @returns {Array} Array of Users
   */
  static getLastWeekReport() {
    return new Promise((resolve, reject) => {
      const now = DateTime.local();
      const sunday = now.set({ weekday: 0 });
      const lastWeek = Interval.fromDateTimes(sunday, now);
      const report = [[now.plus({ days: -6 }).toFormat("dd'/'LL'/'yyyy")]];
      User.getByQuerySorted({}, { name: 1 }).then((users) => {
        users.forEach((user) => {
          const delays = [];
          const present = [];
          const skipped = [];
          const schedules = [];
          const entries = [];
          let minutes = 0;
          let delay = 0;
          let startTime;
          let endTime;
          user.schedules.forEach((schedule) => {
            startTime = DateTime.local().set({
              hour: parseInt(schedule.startTime.slice(0, 2), 10),
              minute: parseInt(schedule.startTime.slice(3), 10),
              weekday: schedule.weekday
            });
            endTime = DateTime.local().set({
              hour: parseInt(schedule.endTime.slice(0, 2), 10),
              minute: parseInt(schedule.endTime.slice(3), 10),
              weekday: schedule.weekday
            });
            schedules.push({ startTime, endTime, weekday: schedule.weekday });
          });
          user.entries.forEach((entry) => {
            if (lastWeek.contains(DateTime.fromISO(entry))) {
              entries.push(DateTime.fromISO(entry));
            }
          });
          for (let i = 1; i < entries.length; i += 2) {
            minutes += parseFloat(Interval.fromDateTimes(entries[i - 1], entries[i]).length('minutes').toFixed(2));
            schedules.forEach((schedule) => {
              if (entries[i - 1].weekday === schedule.weekday) {
                const interval = Interval.fromDateTimes(entries[i - 1], entries[i]);
                const mandatorySchedule = Interval.fromDateTimes(schedule.startTime, schedule.endTime);
                if (!interval.contains(DateTime.fromISO(schedule.startTime)) && interval.contains(DateTime.fromISO(schedule.endTime))) {
                  const entry = {
                    entrance: entries[i - 1],
                    departure: entries[i]
                  };
                  delay = {
                    time: parseFloat(Interval.fromDateTimes(schedule.startTime, entries[i - 1]).length('minutes').toFixed(2)),
                    schedule,
                    entry
                  };
                  const element = present.find(o => +o.startTime.valueOf() === +schedule.startTime.valueOf());
                  if (element === undefined) {
                    present.push(schedule);
                  }
                  delays.push(delay);
                  let index = -1;
                  for (let j = 0; j < skipped.length; j++) {
                    if (+skipped[j].startTime.valueOf() === +schedule.startTime.valueOf()) {
                      index = j;
                    }
                  }
                  if (index > -1) {
                    skipped.splice(index, 1);
                  }
                }
                else if (interval.contains(DateTime.fromISO(schedule.startTime)) && !interval.contains(DateTime.fromISO(schedule.endTime))) {
                  const entry = {
                    entrance: entries[i - 1],
                    departure: entries[i]
                  };
                  delay = {
                    time: parseFloat(Interval.fromDateTimes(entries[i], schedule.endTime).length('minutes').toFixed(2)),
                    schedule,
                    entry
                  };
                  const element = present.find(o => +o.startTime.valueOf() === +schedule.startTime.valueOf());
                  if (element === undefined) {
                    present.push(schedule);
                  }
                  delays.push(delay);
                  let index = -1;
                  for (let j = 0; j < skipped.length; j++) {
                    if (+skipped[j].startTime.valueOf() === +schedule.startTime.valueOf()) {
                      index = j;
                    }
                  }
                  if (index > -1) {
                    skipped.splice(index, 1);
                  }
                }
                else if (mandatorySchedule.contains(DateTime.fromISO(entries[i - 1])) && mandatorySchedule.contains(DateTime.fromISO(entries[i]))) {
                  const entry = {
                    entrance: entries[i - 1],
                    departure: entries[i]
                  };
                  delay = {
                    time: parseFloat(Interval.fromDateTimes(schedule.startTime, entries[i - 1]).length('minutes').toFixed(2)) + parseFloat(Interval.fromDateTimes(entries[i], schedule.endTime).length('minutes').toFixed(2)),
                    schedule,
                    entry
                  };
                  const element = present.find(o => +o.startTime.valueOf() === +schedule.startTime.valueOf());
                  if (element === undefined) {
                    present.push(schedule);
                  }
                  delays.push(delay);
                  let index = -1;
                  for (let j = 0; j < skipped.length; j++) {
                    if (+skipped[j].startTime.valueOf() === +schedule.startTime.valueOf()) {
                      index = j;
                    }
                  }
                  if (index > -1) {
                    skipped.splice(index, 1);
                  }
                }
                else if (interval.contains(DateTime.fromISO(schedule.startTime)) && interval.contains(DateTime.fromISO(schedule.endTime))) {
                  const element = present.find(o => +o.startTime.valueOf() === +schedule.startTime.valueOf());
                  if (element === undefined) {
                    present.push(schedule);
                  }
                  let index = -1;
                  for (let j = 0; j < skipped.length; j++) {
                    if (+skipped[j].startTime.valueOf() === +schedule.startTime.valueOf()) {
                      index = j;
                    }
                  }
                  if (index > -1) {
                    skipped.splice(index, 1);
                  }
                }
                else {
                  const elementPresent = present.find(o => +o.startTime.valueOf() === +schedule.startTime.valueOf());
                  const elementSkipped = skipped.find(o => +o.startTime.valueOf() === +schedule.startTime.valueOf());
                  if (elementPresent === undefined && elementSkipped === undefined) {
                    skipped.push(schedule);
                  }
                }
              }
            });
          }
          schedules.forEach((schedule) => {
            const elementPresent = present.find(o => +o.startTime.valueOf() === +schedule.startTime.valueOf());
            const elementSkipped = skipped.find(o => +o.startTime.valueOf() === +schedule.startTime.valueOf());
            if (elementPresent === undefined && elementSkipped === undefined) {
              skipped.push(schedule);
            }
          });
          let minute = parseInt(minutes % 60, 10);
          if (minute < 10) {
            minute = `0${minute}`;
          }
          let hour = parseInt((minutes - minute) / 60, 10);
          if (hour < 10) {
            hour = `0${hour}`;
          }
          const time = `${hour}:${minute}`;
          report.push([time]);
          Report.create({
            weekStart: sunday.toISO().slice(0, 10),
            user: user._id,
            delays,
            present,
            skipped,
            minutes
          }).then((id) => {
            // User.addReport(user._id, id).catch((error) => {
            //   reject(error);
            // });
          }).catch((error) => {
            console.log(error);
            reject(error);
          });
        });
        resolve(report);
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  }
}

module.exports = Mandatory;
