/**
 * npm modules
 */
const { DateTime } = require('luxon');
const express = require('express');

/**
 * Models
 */
const Report = require('../models/report');
const Role = require('../models/role');
const User = require('../models/user');

/**
 * Middlewares
 */
const auth = require('./middleware/auth');

const router = express.Router();

/**
 * GET Index - Show all user
 */
router.get('/', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  User.getAll().then((users) => {
    res.render('users/index', { title: 'Membros', users });
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/admin');
  });
});

/**
 * GET New - Show form to create new user
 */
router.get('/new', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  Role.getAll().then((roles) => {
    res.render('users/new', { title: 'Novo membro', roles });
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/admin');
  });
});

/**
 * POST Create - Add new user to DB
 */
router.post('/', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  const { user } = req.body;
  User.create(user).then((id) => {
    req.flash('success', `"${user.name}" criado com sucesso.`);
    console.log(`Created new user with id: ${id}`);
    res.redirect('/users/new');
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/users');
  });
});

/**
 * GET Show - Show details of a user
 */
router.get('/:id', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  User.getById(req.params.id).then((user) => {
    if (user) {
      res.render('users/show', { title: user.name, id: req.params.id, ...user });
    }
    else {
      req.flash('danger', 'Membro não encontrado.');
      res.redirect('/users');
    }
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/users');
  });
});

/**
 * GET Edit - Show the user edit form
 */
router.get('/:id/edit', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  User.getById(req.params.id).then((user) => {
    if (user) {
      Role.getAll().then((roles) => {
        res.render('users/edit', { title: `Editar ${user.name}`, id: req.params.id, ...user, roles });
      }).catch((error) => {
        req.flash('danger', error.message);
        res.redirect('/users');
      });
    }
    else {
      req.flash('danger', 'Membro não encontrado.');
      res.redirect('/');
    }
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/users');
  });
});

/**
 * PUT Update - Update a user in the database
 */
router.put('/:id', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  const { user } = req.body;
  User.update(req.params.id, user).then(() => {
    res.redirect(`/users/${req.params.id}`);
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/admin');
  });
});

/**
 * DELETE Destroy - Removes a user from the databse
 */
router.delete('/:id', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  User.delete(req.params.id).catch((error) => {
    console.log(error);
  });
  res.redirect('/users');
});

/**
 * POST Entries - Get the entries of a user
 */
router.post('/entries', (req, res) => {
  const userID = req.body.user;
  const sunday = DateTime.fromISO(req.body.sunday);
  const nextSunday = DateTime.fromISO(req.body.nextSunday);
  const entries = [];
  User.getById(userID).then((user) => {
    user.entries.forEach((entry) => {
      let entryDate = DateTime.fromISO(entry);
      if (entryDate.valueOf() >= sunday.valueOf() && entryDate.valueOf() <= nextSunday.valueOf()) {
        entries.push(entry);
      }
    });
    res.send(entries);
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/admin');
  });
});

/**
 * POST Reports - Get the reports of a user
 */
router.post('/reports', (req, res) => {
  Report.getOneByQuery({ user: req.body.user, weekStart: req.body.date }).then((report) => {
    res.send(report);
  }).catch((error) => {
    req.flash('danger', error.message);
    console.log(error);
  });
});

/**
 * POST schedules - Get the schedules of a user
 */
router.post('/schedules', (req, res) => {
  console.log(req.body);
  User.getById(req.body.user).then((user) => {
    res.send(user.schedules);
  }).catch((error) => {
    req.flash('danger', error.message);
    console.log(error);
  });
});

module.exports = router;
