/**
 * npm modules
 */
const express = require('express');

/**
 * Models
 */
const User = require('../models/user');

/**
 * Functions
 */
const Mandatory = require('../functions/mandatory');

/**
 * Middlewares
 */
const auth = require('./middleware/auth');

const router = express.Router();

/**
 * GET Home page
 */
router.get('/', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  res.render('admin/index', { title: 'Dashboard' });
});

/**
 * POST google - Updates all the users with their respective schedules taken from google sheets
 */
router.post('/google', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  Mandatory.scheduleUpdateGoogleSheets().then(() => {
    req.flash('success', 'HOs atualizados com sucesso');
    res.redirect('/admin');
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/admin');
  });
});

/**
 * GET Full report page
 */
router.get('/reports', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  User.getByQuerySorted({}, { name: 1 }).then((users) => {
    res.render('reports/index', { title: 'Relatórios', users });
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/admin');
  });
});

/**
 * GET Entries report page
 */
router.get('/entries', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  User.getByQuerySorted({}, { name: 1 }).then((users) => {
    res.render('reports/entries', { title: 'Entradas', users });
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/admin');
  });
});

/**
 * GET schedules page
 */
router.get('/schedules', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  User.getByQuerySorted({}, { name: 1 }).then((users) => {
    res.render('admin/schedules', { title: 'Horários Obrigatórios', users });
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/admin');
  });
});

/**
 * GET change-password
 */
router.get('/change-password', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  res.render('users/change-password', { title: 'Alterar senha' });
});

/**
 * POST change-password
 */
router.post('/change-password', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  const { user } = req.body;
  User.getById(req.session.user.id).then((result) => {
    if (user.password !== result.password) {
      req.flash('danger', 'Senha incorreta.');
      res.redirect('/admin/change-password');
    }
    else {
      User.update(req.session.user.id, { password: user.newPassword }).then(() => {
        req.flash('success', 'Senha alterada com sucesso.');
        res.redirect('/admin');
      }).catch((error) => {
        req.flash('danger', error.message);
        res.redirect('/admin/change-password');
      });
    }
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/admin/change-password');
  });
});

module.exports = router;
