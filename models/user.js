const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  schedules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule'
  }],
  entries: [{
    type: String
  }]
}, { timestamps: true, static: false });

const UserModel = mongoose.model('User', userSchema);

class User {
  /**
   * Get all Users from database
   * @returns {Array} Array of Users
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      UserModel.find({}).sort({ name: 1 }).populate('role schedules reports').exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get a User by it's id
   * @param {string} id - User Id
   * @returns {Object} - User Document Data
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      UserModel.findById(id).populate('role schedules reports').exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Create a new User
   * @param {Object} user - User Document Data
   * @returns {string} - New User Id
   */
  static create(user) {
    return new Promise((resolve, reject) => {
      UserModel.create(user).then((result) => {
        resolve(result._id);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Update a User
   * @param {string} id - User Id
   * @param {Object} User - User Document Data
   * @returns {null}
   */
  static update(id, user) {
    return new Promise((resolve, reject) => {
      UserModel.findByIdAndUpdate(id, user).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Delete a User
   * @param {string} id - User Id
   * @returns {null}
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      UserModel.findByIdAndDelete(id).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Add a schedule
   * @param {string} id - User Id
   * @param {string} schedule - Schedule ID
   * @returns {null}
   */
  static addSchedule(id, schedule) {
    return new Promise((resolve, reject) => {
      UserModel.findByIdAndUpdate(id, { $push: { schedules: schedule } }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Remove a schedule
   * @param {string} id - User Id
   * @param {string} schedule - Schedule ID
   * @returns {null}
   */
  static removeSchedule(id, schedule) {
    return new Promise((resolve, reject) => {
      UserModel.findByIdAndUpdate(id, { $pull: { schedules: schedule } }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Add a entry
   * @param {string} id - User Id
   * @param {string} entry - Day and time
   * @returns {null}
   */
  static addEntry(id, entry) {
    return new Promise((resolve, reject) => {
      UserModel.findByIdAndUpdate(id, { $push: { entries: entry } }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Remove a entry
   * @param {string} id - User Id
   * @param {string} entry - Day and time
   * @returns {null}
   */
  static removeEntry(id, entry) {
    return new Promise((resolve, reject) => {
      UserModel.findByIdAndUpdate(id, { $pull: { entries: entry } }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  // /**
  //  * Add a report
  //  * @param {string} id - User id
  //  * @param {string} report - Report id
  //  * @returns {null}
  //  */
  // static addReport(id, report) {
  //   return new Promise((resolve, reject) => {
  //     UserModel.findByIdAndUpdate(id, { $push: { reports: report } }).then(() => {
  //       resolve();
  //     }).catch((err) => {
  //       reject(err);
  //     });
  //   });
  // }
  //
  // /**
  //  * Remove a report
  //  * @param {string} id - User id
  //  * @param {string} report - Report id
  //  * @returns {null}
  //  */
  // static removeReport(id, report) {
  //   return new Promise((resolve, reject) => {
  //     UserModel.findByIdAndUpdate(id, { $pull: { reports: report } }).then(() => {
  //       resolve();
  //     }).catch((err) => {
  //       reject(err);
  //     });
  //   });
  // }

  /**
   * Get all users that match the desired query
   * @param {Object} query - Object that defines the filter
   * @param {Object} sort - Object that defines the sort method
   * @returns {Object} User Document Data
   */
  static getByQuerySorted(query, sort) {
    return new Promise((resolve, reject) => {
      UserModel.find(query).sort(sort).populate('role schedules reports').exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get a user that match the desired query
   * @param {Object} query - Object that defines the filter
   * @returns {Object} User Document Data
   */
  static getOneByQuery(query) {
    return new Promise((resolve, reject) => {
      UserModel.findOne(query).populate('role schedules reports').exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Delete all schedules
   * @returns {null}
   */
  static deleteAllSchedules() {
    return new Promise((resolve, reject) => {
      UserModel.find({}).exec().then((results) => {
        results.forEach((user) => {
          UserModel.findByIdAndUpdate(user._id, { $set: { schedules: [] } }).catch((err) => {
            reject(err);
          });
        });
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Delete all entries
   * @returns {null}
   */
  static deleteAllEntries() {
    return new Promise((resolve, reject) => {
      UserModel.find({}).exec().then((results) => {
        results.forEach((user) => {
          UserModel.findByIdAndUpdate(user._id, { $set: { entries: [] } }).catch((err) => {
            reject(err);
          });
        });
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = User;
