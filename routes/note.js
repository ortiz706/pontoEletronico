/**
 * npm modules
 */
const express = require('express');
const fs = require('fs');

/**
 * Models
 */
const Note = require('../models/note');

const router = express.Router();

/**
 * POST Create - Add new config to DB
 */
// router.post('/', (req, res) => {
//   const note = 'Coloque data e hora no recado  (:';
//   Note.create(note).then((id) => {
//     console.log(`Created new note with id: ${id}`);
//     res.redirect(`/notes/${id}`);
//   }).catch((error) => {
//     req.flash('danger', error.message);
//     res.redirect('/notes');
//   });
// });

/**
 * GET Show - Show notes
 */
router.get('/', (req, res) => {
  Note.get().then((note) => {
    if (note) {
      const { text } = note;
      res.render('notes/index', { title: 'Recado', layout: 'layoutHome', text });
    }
    else {
      req.flash('danger', 'Recado não encontrado.');
      res.redirect('/');
    }
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/');
  });
});

/**
 * PUT Update - Update notes in the database
 */
router.put('/', (req, res) => {
  const note = {
    text: req.body.note
  };
  Note.get().then((notes) => {
    Note.update(notes._id, note).then(() => {
      fs.writeFile('./docs/notes.txt', note.text, (err) => {
        if (err) {
          console.log(err.message);
        }
        else {
          req.flash('success', 'O recado foi atualizado.');
          res.redirect('/');
        }
      });
    }).catch((error) => {
      req.flash('danger', error.message);
      res.redirect('/');
    });
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/');
  });
});

module.exports = router;
