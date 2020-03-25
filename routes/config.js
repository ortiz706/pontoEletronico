/**
 * npm modules
 */
const express = require('express');
const fs = require('fs');

/**
 * Models
 */
const Config = require('../models/config');

/**
 * Middlewares
 */
const auth = require('./middleware/auth');

const router = express.Router();

/**
 * POST Create - Add new config to DB
 */
// router.post('/', auth.isAuthenticated, auth.isAdmin, (req, res) => {
//   const { config } = global;
//   Config.create(config).then((id) => {
//     console.log(`Created new config with id: ${id}`);
//     res.redirect(`/config/${id}`);
//   }).catch((error) => {
//     req.flash('danger', error.message);
//     res.redirect('/config');
//   });
// });

/**
 * GET Show - Show details of a config
 */
router.get('/', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  Config.get().then((config) => {
    if (config) {
      res.render('config/show', { title: 'Configuração', id: req.params.id, ...config });
    }
    else {
      req.flash('danger', 'Arquivo de configuração não encontrado.');
      res.redirect('/admin');
    }
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/admin');
  });
});

/**
 * GET Edit - Show the config edit form
 */
router.get('/:id/edit', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  Config.getOneByQuery({ _id: req.params.id }).then((config) => {
    if (config) {
      res.render('config/edit', { title: `Editar ${config.name}`, id: req.params.id, ...config });
    }
    else {
      req.flash('danger', 'Arquivo de configuração não encontrado.');
      res.redirect('/admin');
    }
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/config');
  });
});

/**
 * PUT Update - Update a config in the database
 */
router.put('/:id', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  const { config } = req.body;
  Config.update(req.params.id, config).then(() => {
    fs.writeFile('./config/config.json', JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
      }
      console.log('The config file has been updated!');
      res.redirect('/config');
    });
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/admin');
  });
});

/**
 * DELETE Destroy - Removes a config from the databse
 */
router.delete('/:id', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  Config.delete(req.params.id).catch((error) => {
    req.flash('danger', error.message);
  });
  res.redirect('/config');
});

module.exports = router;
