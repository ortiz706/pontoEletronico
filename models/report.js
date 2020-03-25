const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  weekStart: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  delays: [{}],
  present: [{}],
  skipped: [{}],
  minutes: Number
}, { timestamps: true, static: false });

const ReportModel = mongoose.model('Report', reportSchema);

class Report {
  /**
   * Get all Reports from database
   * @returns {Array} Array of Reports
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      ReportModel.find({}).populate('user').exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get a Report by it's id
   * @param {string} id - Report Id
   * @returns {Object} - Report Document Data
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      ReportModel.findById(id).populate('user').exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Create a new Report
   * @param {Object} Report - Report Document Data
   * @returns {string} - New Report Id
   */
  static create(report) {
    return new Promise((resolve, reject) => {
      ReportModel.create(report).then((result) => {
        resolve(result._id);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Update a Report
   * @param {string} id - Report Id
   * @param {Object} Report - Report Document Data
   * @returns {null}
   */
  static update(id, report) {
    return new Promise((resolve, reject) => {
      ReportModel.findByIdAndUpdate(id, report).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Delete a Report
   * @param {string} id - Report Id
   * @returns {null}
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      ReportModel.findByIdAndDelete(id).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get all Reports that match the desired query
   * @param {Object} query - Object that defines the filter
   * @param {Object} sort - Object that defines the sort method
   * @returns {Object} Report Document Data
   */
  static getByQuerySorted(query, sort) {
    return new Promise((resolve, reject) => {
      ReportModel.find(query).sort(sort).populate('user').exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get the first Report that match the desired query
   * @param {Object} query - Object that defines the filter
   * @returns {Object} Report Document Data
   */
  static getOneByQuery(query) {
    return new Promise((resolve, reject) => {
      ReportModel.findOne(query).populate('user').exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Add a delay
   * @param {string} id - User Id
   * @param {string} delay - Delay object
   * @returns {null}
   */
  static addDelay(id, delay) {
    return new Promise((resolve, reject) => {
      ReportModel.findByIdAndUpdate(id, { $push: { delays: delay } }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Remove a delay
   * @param {string} id - User Id
   * @param {string} delay - Delay object
   * @returns {null}
   */
  static removeDelay(id, delay) {
    return new Promise((resolve, reject) => {
      ReportModel.findByIdAndUpdate(id, { $pull: { delays: delay } }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Add a present schedule
   * @param {string} id - User Id
   * @param {string} present - present object
   * @returns {null}
   */
  static addPresent(id, present) {
    return new Promise((resolve, reject) => {
      ReportModel.findByIdAndUpdate(id, { $push: { present } }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Remove a present schedule
   * @param {string} id - User Id
   * @param {string} present - present object
   * @returns {null}
   */
  static removePresent(id, present) {
    return new Promise((resolve, reject) => {
      ReportModel.findByIdAndUpdate(id, { $pull: { present } }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Add a skipped schedule
   * @param {string} id - User Id
   * @param {string} skipped - skipped object
   * @returns {null}
   */
  static addSkipped(id, skipped) {
    return new Promise((resolve, reject) => {
      ReportModel.findByIdAndUpdate(id, { $push: { skipped } }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Remove a skipped schedule
   * @param {string} id - User Id
   * @param {string} skipped - skipped object
   * @returns {null}
   */
  static removeSkipped(id, skipped) {
    return new Promise((resolve, reject) => {
      ReportModel.findByIdAndUpdate(id, { $pull: { skipped } }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Delete all the Reports
   * @returns {null}
   */
  static deleteAll() {
    return new Promise((resolve, reject) => {
      ReportModel.deleteMany({}).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = Report;
