/**
 * npm modules
 */
const { DateTime } = require('luxon');
const express = require('express');
const fs = require('fs');
const { insidePolygon } = require('geolocation-utils');

/**
 * Models
 */
const User = require('../models/user');

const router = express.Router();

/**
 * GET Home page
 */
router.get('/', (req, res) => {
  const users = [];
  User.getByQuerySorted({}, { name: 1 }).then((results) => {
    results.forEach((result) => {
      if (result.entries.length % 2 === 1) {
        let user = {
          name: result.name,
          arriveISO: result.entries[result.entries.length - 1]
        };
        users.push(user);
      }
    });
    fs.readFile('./docs/notes.txt', 'utf-8', (err, note) => {
      if (err) {
        req.flash('danger', err.message);
      }
      res.render('index', { title: 'Home', layout: 'layoutHome', users, note });
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

/**
 * GET Login page
 */
router.get('/login', (req, res) => {
  fs.readFile('./docs/notes.txt', 'utf-8', (err, note) => {
    if (err) {
      req.flash('danger', err.message);
    }
    res.render('login', { title: 'Login', layout: 'layoutHome', note });
  });
});

/**
 * GET Restrict Login page
 */
router.get('/restrict', (req, res) => {
  fs.readFile('./docs/notes.txt', 'utf-8', (err, note) => {
    if (err) {
      req.flash('danger', err.message);
    }
    res.render('restrict', { title: 'Login', layout: 'layoutHome', note });
  });
});

/**
 * POST Login
 */
router.post('/login', (req, res) => {
  const { user } = req.body;
  if (req.body.error) {
    const { error } = req.body;
    switch (error) {
      case 'PERMISSION_DENIED':
      User.getOneByQuery({ name: user.name }).then((result) => {
        if (result) {
          const today = DateTime.local();
          User.addEntry(result._id, today.toISO()).then(() => {
            res.redirect('/');
          }).catch((error) => {
            console.log(error);
            res.redirect('/error');
          });
        }
        else {
          req.flash('danger', 'Usuário incorreto. Tente novamente.');
          res.redirect('/login');
        }
      }).catch((error) => {
        console.log(error);
        res.redirect('/error');
      });
        break;
      case 'POSITION_UNAVAILABLE':
      User.getOneByQuery({ name: user.name }).then((result) => {
        if (result) {
          const today = DateTime.local();
          User.addEntry(result._id, today.toISO()).then(() => {
            res.redirect('/');
          }).catch((error) => {
            console.log(error);
            res.redirect('/error');
          });
        }
        else {
          req.flash('danger', 'Usuário incorreto. Tente novamente.');
          res.redirect('/login');
        }
      }).catch((error) => {
        console.log(error);
        res.redirect('/error');
      });
        break;
      case 'TIMEOUT':
        // 'The request to get user location timed out.'
        req.flash('danger', 'Tempo esgotado para a requisição.');
        res.redirect('/login');
        break;
      case 'UNKNOWN_ERROR':
        // 'An unknown error occurred.'
        req.flash('danger', 'Ocorreu um erro desconhecido.');
        res.redirect('/login');
        break;
      case 'NOT_SUPPORTED':
        // 'Geolocation is not supported'
        req.flash('danger', 'O serviço de Geolocalização não é suportado.');
        res.redirect('/login');
        break;
      default:
        // 'Error not handled'
        req.flash('danger', 'Ocorreu um erro não tratado.');
        res.redirect('/login');
    }
  }
  else if (req.body.location === 'true') {
    User.getOneByQuery({ name: user.name }).then((result) => {
      if (result) {
        const today = DateTime.local();
        User.addEntry(result._id, today.toISO()).then(() => {
          res.redirect('/');
        }).catch((error) => {
          console.log(error);
          res.redirect('/error');
        });
      }
      else {
        req.flash('danger', 'Usuário incorreto. Tente novamente.');
        res.redirect('/login');
      }
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
  }
  else {
    User.getOneByQuery({ name: user.name }).then((result) => {
      if (result) {
        const today = DateTime.local();
        User.addEntry(result._id, today.toISO()).then(() => {
          res.redirect('/');
        }).catch((error) => {
          console.log(error);
          res.redirect('/error');
        });
      }
      else {
        req.flash('danger', 'Usuário incorreto. Tente novamente.');
        res.redirect('/login');
      }
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
  }
});

/**
 * POST Restrict Login
 */
router.post('/restrict', (req, res) => {
  const { user } = req.body;
  User.getOneByQuery({ name: user.name }).then((result) => {
    if (result) {
      if (result.password === user.password) {
        if (result.role.name === 'Diretor(a) de Desenvolvimento' || result.role.name === 'Gerente de Desenvolvimento' || result.role.name === 'Assessor(a) de Desenvolvimento') {
          req.session.user = {
            role: result.role.name,
            name: result.name,
            id: result._id
          };      
          res.redirect('/admin');
        }
        else {
          req.flash('danger', 'Você não tem permissão para acessar essa área.');
          res.redirect('/');
        }
      }
      else {
        req.flash('danger', 'Senha incorreta.');
        res.redirect('/restrict');
      }
    }
    else {
      req.flash('danger', 'Usuário incorreto. Tente novamente.');
      res.redirect('/restrict');
    }
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

/**
 * POST Yellow Beach
 */
router.post('/yellow-beach', (req, res) => {
  const users = [];
  const promises = [];
  User.getByQuerySorted({}, { name: 1 }).then((results) => {
    results.forEach((result) => {
      if (result.entries.length % 2 === 1) {
        let user = {
          name: result.name,
          id: result._id,
          schedules: result.schedules
        };
        users.push(user);
      }
    });
    users.forEach((user) => {
      let today = DateTime.local()
      let promise = User.addEntry(user.id, today.toISO());
      promises.push(promise);
    });
    Promise.all(promises).then(() => {
      res.redirect('/');
    }).catch((error) => {
      console.log(error);
      req.flash('danger', error.message);
      res.redirect('/');
    });
  }).catch((error) => {
    console.log(error);
    req.flash('danger', error.message);
    res.redirect('/error');
  });
});

/**
 * GET Restrict Logout
 */
router.get('/logout', (req, res) => {
  delete req.session.user;
  res.redirect('/');
});

/**
 * POST Logout
 */
router.post('/logout', (req, res) => {
  const { user } = req.body;
  User.getOneByQuery({ name: user.name }).then((result) => {
    if (result) {
      const today = DateTime.local();
      if (result.entries.length % 2 === 1) {
        User.addEntry(result._id, today.toISO()).then(() => {
          res.redirect('/');
        }).catch((error) => {
          console.log(error);
          res.redirect('/error');
        });
      }
      else {
        req.flash('danger', 'Você não está logado, não tente enganar o Ponto  (:');
        res.redirect('/');
      }
    }
    else {
      req.flash('danger', 'Usuário incorreto. Tente novamente.');
      res.redirect('/');
    }
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

/**
 * POST location - Check if the user's location is contained in the allowed area
 */
router.post('/location', (req, res) => {
  /**
   * CPE
   */
  // const polygon = [
  //   [-19.872530, -43.963515],
  //   [-19.871279, -43.964636],
  //   [-19.872210, -43.965968],
  //   [-19.872210, -43.965968]
  // ];

  /**
   * UFMG central area
   */
   const polygon = [
      [-19.88096, -43.96197],
      [-19.87434, -43.95498],
      [-19.86590,-43.95481],
      [-19.86351, -43.96879],
      [-19.86752, -43.97470],
      [-19.87680, -43.97242]
      ];

  console.log(req.body.location);
  if (req.body.location) {
    const latitude = parseFloat(req.body.location.coords.latitude);
    const longitude = parseFloat(req.body.location.coords.longitude);
    res.send(insidePolygon([latitude, longitude], polygon));
  }
  else if (req.body.error) {
    const { error } = req.body;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        // 'User denied the request for Geolocation.'
        res.send('PERMISSION_DENIED');
        break;
      case error.POSITION_UNAVAILABLE:
        // 'Location information is unavailable.'
        res.send('POSITION_UNAVAILABLE');
        break;
      case error.TIMEOUT:
        // 'The request to get user location timed out.'
        res.send('TIMEOUT');
        break;
      case error.UNKNOWN_ERROR:
        // 'An unknown error occurred.'
        res.send('UNKNOWN_ERROR');
        break;
      default:
    }
  }
});

/**
 * GET hours page
 */
router.get('/hours', (req, res) => {
  User.getByQuerySorted({}, { name: 1 }).then((users) => {
    fs.readFile('./docs/notes.txt', 'utf-8', (err, note) => {
      if (err) {
        req.flash('danger', err.message);
      }
      res.render('hours', { title: 'Horas', layout: 'layoutHome', note, users });
    });
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/');
  });
});

/**
 * GET schedules page
 */
router.get('/schedules', (req, res) => {
  User.getByQuerySorted({}, { name: 1 }).then((users) => {
    fs.readFile('./docs/notes.txt', 'utf-8', (err, note) => {
      if (err) {
        req.flash('danger', err.message);
      }
      res.render('admin/schedules', { title: 'Horários Obrigatórios', layout: 'layoutHome', users, note });
    });
  }).catch((error) => {
    req.flash('danger', error.message);
    res.redirect('/admin');
  });
});

module.exports = router;
