const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  config_id: String,
  sheets: {
    read: Object,
    write: Object
  }
}, { timestamps: true, static: false });

const ConfigModel = mongoose.model('Config', configSchema);

class Config {
  /**
   * Get a Config by it's id
   * @returns {Object} - Config Document Data
   */
  static get() {
    return new Promise((resolve, reject) => {
      ConfigModel.findOne({}).exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Create a new Config
   * @param {Object} Config - Config Document Data
   * @returns {string} - New Config Id
   */
  static create(config) {
    return new Promise((resolve, reject) => {
      ConfigModel.create(config).then((result) => {
        resolve(result._id);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Update a Config
   * @param {string} id - Config Id
   * @param {Object} Config - Config Document Data
   * @returns {null}
   */
  static update(id, config) {
    return new Promise((resolve, reject) => {
      ConfigModel.findByIdAndUpdate(id, config).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Delete a Config
   * @param {string} id - Config Id
   * @returns {null}
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      ConfigModel.findByIdAndDelete(id).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get the first Config that match the desired query
   * @param {Object} query - Object that defines the filter
   * @returns {Object} Config Document Data
   */
  static getOneByQuery(query) {
    return new Promise((resolve, reject) => {
      ConfigModel.findOne(query).exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Delete all the Configs
   * @returns {null}
   */
  static deleteAll() {
    return new Promise((resolve, reject) => {
      ConfigModel.deleteMany({}).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = Config;
