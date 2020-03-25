const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }
}, { timestamps: true, static: false });

const RoleModel = mongoose.model('Role', roleSchema);

class Role {
  /**
   * Get all Roles from database
   * @returns {Array} Array of Roles
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      RoleModel.find({}).sort({ name: 1 }).exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get a Role by it's id
   * @param {string} id - Role Id
   * @returns {Object} - Role Document Data
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      RoleModel.findById(id).exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Create a new Role
   * @param {Object} Role - Role Document Data
   * @returns {string} - New Role Id
   */
  static create(role) {
    return new Promise((resolve, reject) => {
      RoleModel.create(role).then((result) => {
        resolve(result._id);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Update a Role
   * @param {string} id - Role Id
   * @param {Object} Role - Role Document Data
   * @returns {null}
   */
  static update(id, role) {
    return new Promise((resolve, reject) => {
      RoleModel.findByIdAndUpdate(id, role).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Delete a Role
   * @param {string} id - Role Id
   * @returns {null}
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      RoleModel.findByIdAndDelete(id).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get all Roles that match the desired query
   * @param {Object} query - Object that defines the filter
   * @param {Object} sort - Object that defines the sort method
   * @returns {Object} Role Document Data
   */
  static getByQuerySorted(query, sort) {
    return new Promise((resolve, reject) => {
      RoleModel.find(query).sort(sort).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = Role;
