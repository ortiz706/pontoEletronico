/**
 * npm modules
 */
const express = require('express');

/**
 * Models
 */
const Role = require('../models/role');

/**
 * Middlewares
 */
const auth = require('./middleware/auth');

const router = express.Router();

/**
 * GET Index - Show all Role
 */
router.get('/', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  Role.getAll().then((roles) => {
    res.render('roles/index', { title: 'Cargos', roles });
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/admin');
  });
});

/**
 * GET New - Show form to create new role
 */
router.get('/new', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  res.render('roles/new', { title: 'Novo cargo' });
});

/**
 * POST Create - Add new role to DB
 */
router.post('/', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  const { role } = req.body;
  Role.create(role).then((id) => {
    req.flash('success', `"${role.name}" criado com sucesso.`);
    console.log(`Created new role with id: ${id}`);
    res.redirect(`/roles/${id}`);
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/roles');
  });
});

/**
 * GET Show - Show details of a role
 */
router.get('/:id', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  Role.getById(req.params.id).then((role) => {
    if (role) {
      res.render('roles/show', { title: role.name, id: req.params.id, ...role });
    }
    else {
      req.flash('danger', 'Cargo não encontrado.');
      res.redirect('/roles');
    }
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/roles');
  });
});

/**
 * GET Edit - Show the role edit form
 */
router.get('/:id/edit', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  Role.getById(req.params.id).then((role) => {
    if (role) {
      res.render('roles/edit', { title: `Editar ${role.name}`, id: req.params.id, ...role });
    }
    else {
      req.flash('danger', 'Cargo não encontrado.');
      res.redirect('/');
    }
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/roles');
  });
});

/**
 * PUT Update - Update a role in the database
 */
router.put('/:id', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  const { role } = req.body;
  Role.update(req.params.id, role).then(() => {
    res.redirect(`/roles/${req.params.id}`);
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/roles');
  });
});

/**
 * DELETE Destroy - Removes a role from the databse
 */
router.delete('/:id', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  Role.delete(req.params.id).catch((error) => {
    req.flash('danger', error.message);
  });
  res.redirect('/roles');
});

module.exports = router;
