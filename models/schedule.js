const mongoose = require('mongoose');
const User = require('./user');

const scheduleSchema = new mongoose.Schema({
  weekday: {
    type: Number,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }
}, { timestamps: true, static: false });

scheduleSchema.pre('deleteMany', (next) => {
  User.deleteAllSchedules();
  next();
});

const ScheduleModel = mongoose.model('Schedule', scheduleSchema);

class Schedule {
  /**
   * Get all Schedules from database
   * @returns {Array} Array of Schedules
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      ScheduleModel.find({}).exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get a Schedule by it's id
   * @param {string} id - Schedule Id
   * @returns {Object} - Schedule Document Data
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      ScheduleModel.findById(id).exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Create a new Schedule
   * @param {Object} Schedule - Schedule Document Data
   * @returns {string} - New Schedule Id
   */
  static create(schedule) {
    return new Promise((resolve, reject) => {
      ScheduleModel.create(schedule).then((result) => {
        resolve(result._id);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Update a Schedule
   * @param {string} id - Schedule Id
   * @param {Object} Schedule - Schedule Document Data
   * @returns {null}
   */
  static update(id, schedule) {
    return new Promise((resolve, reject) => {
      ScheduleModel.findByIdAndUpdate(id, schedule).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Delete a Schedule
   * @param {string} id - Schedule Id
   * @returns {null}
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      ScheduleModel.findByIdAndDelete(id).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get all Schedules that match the desired query
   * @param {Object} query - Object that defines the filter
   * @param {Object} sort - Object that defines the sort method
   * @returns {Object} Schedule Document Data
   */
  static getByQuerySorted(query, sort) {
    return new Promise((resolve, reject) => {
      ScheduleModel.find(query).sort(sort).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get the first Schedule that match the desired query
   * @param {Object} query - Object that defines the filter
   * @returns {Object} Schedule Document Data
   */
  static getOneByQuery(query) {
    return new Promise((resolve, reject) => {
      ScheduleModel.findOne(query).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Delete all the schedules
   * @returns {null}
   */
  static deleteAll() {
    return new Promise((resolve, reject) => {
      ScheduleModel.deleteMany({}).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = Schedule;
