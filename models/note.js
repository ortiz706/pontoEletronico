const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: String
}, { timestamps: true });

const NoteModel = mongoose.model('Note', noteSchema);

class Note {
  /**
   * Get the Note
   * @returns {Object} - Note Document Data
   */
  static get() {
    return new Promise((resolve, reject) => {
      NoteModel.findOne({}).exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Create a new Note
   * @param {Object} Note - Note Document Data
   * @returns {string} - New Note Id
   */
  static create(note) {
    return new Promise((resolve, reject) => {
      NoteModel.create(note).then((result) => {
        resolve(result._id);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Update a Note
   * @param {string} id - Note Id
   * @param {Object} Note - Note Document Data
   * @returns {null}
   */
  static update(id, note) {
    return new Promise((resolve, reject) => {
      NoteModel.findByIdAndUpdate(id, note).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Delete a Note
   * @param {string} id - Note Id
   * @returns {null}
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      NoteModel.findByIdAndDelete(id).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = Note;
