const { insidePolygon } = require('geolocation-utils');

const express = require('express');
const querystring = require('querystring');
const { DateTime } = require('luxon');
const Mandatory = require('../functions/mandatory');
const Schedule = require('../models/schedule');
const Sheets = require('../functions/sheets');
const User = require('../models/user');
const Report = require('../models/report');

const router = express.Router();

/**
 * GET Home page
 */
router.get('/', (req, res) => {
  // Mandatory.createSchedules();

  // Schedule.deleteAll();

  // const ids = ['5c7866fccd3bb91bc8f4597c', '5c7866fccd3bb91bc8f45965', '5c7866fccd3bb91bc8f45964', '5c7866fccd3bb91bc8f45966'];
  // ids.forEach((id) => {
  //   Schedule.getById(id).then((result) => {
  //     console.log(result);
  //   });
  // });

  const today = DateTime.local();
  // console.log(today.toISO());
  // const today2 = today;
  // console.log(today2.toISO());
  // if (today2.valueOf() < today.valueOf()) {
  //   console.log('today2 < today');
  // }
  // if (today2.valueOf() > today.valueOf()) {
  //   console.log('today2 > today');
  // }
  // if (+today2.valueOf() === +today.valueOf()) {
  //   console.log('today2 === today');
  // }
  User.getOneByQuery({ name: 'penis' }).then((user) => {
    if (user) {
      console.log(user);
    }
    else {
      console.log('Não existe');
    }
  }).catch((error) => {
    console.log(error);
  });

  // User.getByQuerySorted({}, { name: 1 }).then((users) => {
  //   console.log(users);
  // });
  // Mandatory.getLastWeekReport().then((report) => {
  //   console.log(report);
  //   // Sheets.writeReportGoogleSheets(report);
  // });
  // User.getAll().then((users) => {
  // console.log(users);
  // });
  // const report = [
  //   ['29/03/2019'],
  //   [100],
  //   [200],
  //   [300],
  //   [5]
  // ];
  // console.log(today.toFormat("dd'/'LL'/'yyyy"));
  // const minutes = 256.67;
  // let minute = parseInt(minutes % 60, 10);
  // let hour = parseInt((minutes - minute) / 60, 10);
  // let time = `${hour}:${minute}`;
  // console.log(time);
  // var result = querystring.escape("página5");
  // console.log(result);
  // const polygon = [
  //   [4.03146, 51.9644],
  //   [4.03151, 51.9643],
  //   [4.03048, 51.9627],
  //   [4.04550, 51.9600],
  //   [4.05279, 51.9605],
  //   [4.05215, 51.9619],
  //   [4.04528, 51.9614],
  //   [4.03146, 51.9644]
  // ];
  // console.log(insidePolygon([4.03324, 51.9632], polygon));
  const polygon = [
    [-19.869513, -43.964235],
    [-19.870421, -43.963393],
    [-19.871309, -43.964906],
    [-19.870350, -43.965582]
  ];
  const latitude = -19.869692699999998;
  const longitude = -43.9642744;
  // console.log(insidePolygon([latitude, longitude], polygon));
  res.render('test', { tile: 'Teste' });
  // User.deleteAllEntries().catch((error) => {
  //   console.log(error);
  // });
  // Report.deleteAll().catch((error) => {
  //   console.log(error);
  // });
});

router.post('/', (req, res) => {
  // const polygon = [
  //   [-19.872530, -43.963515],
  //   [-19.871279, -43.964636],
  //   [-19.872210, -43.965968],
  //   [-19.872210, -43.965968]
  // ];
  const polygon = [
    [-19.852189, -43.958522],
    [-19.853360, -43.958117],
    [-19.853660, -43.959166],
    [-19.852486, -43.959595]
  ];
  if (req.body.location) {
    // const polygon = [
    //   [-19.869513, -43.964235],
    //   [-19.870421, -43.963393],
    //   [-19.871309, -43.964906],
    //   [-19.870350, -43.965582]
    // ];
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

router.post('/test', (req, res) => {
  console.log(req.body);
});


module.exports = router;
