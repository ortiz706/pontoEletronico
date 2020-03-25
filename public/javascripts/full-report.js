$(document).ready(() => {
  let sunday = moment().weekday(0);
  let nextSunday = moment().weekday(7);
  let body = '<h5 class="text-center mt-4">Não há registro para essa semana.</h5>';
  let color;
  $('.date').html(`<p style='margin: 2'>${sunday.format('DD/MM/YYYY')} - ${nextSunday.format('DD/MM/YYYY')}</p>`);
  $('#inputUser').off().change(() => {
    $('.date').html(`<p style='margin: 2'>${sunday.format('DD/MM/YYYY')} - ${nextSunday.format('DD/MM/YYYY')}</p>`);
    const user = $('#inputUser :selected').val();
    $.post('/users/reports', { user, date: sunday.format('YYYY-MM-DD') }, (report) => {
      if (report) {
        let minute = parseInt(report.minutes % 60, 10);
        if (minute < 10) {
          minute = '0' + minute;
        }
        let hour = parseInt((report.minutes - minute) / 60, 10);
        if (hour < 10) {
          hour = '0' + hour;
        }
        let time = `${hour}:${minute}`;
        $('#hours').html(`Horas semanais: ${time}`);
        body = `<div class="row justify-content-between text-center">
          <div class="col-4">
            <h5>Presentes</h5>`;
        if (report.present.length !== 0) {
          for (let i = 0; i < report.present.length; i++) {
            if ((i % 2) === 0) {
              color = 'bg-light-green';
            }
            else {
              color = 'bg-light-green-2';
            }
            body += `<div class="${color} font-small mt-2">
                     Data: ${moment(report.present[i].startTime).format('DD/MM/YYYY')} <br>
                     ${moment(report.present[i].startTime).locale('pt').format('ddd')} ${moment(report.present[i].startTime).format('HH:mm')} - ${moment(report.present[i].endTime).format('HH:mm')} <br>
                     </div>`
          }
        }
        body += `</div>
                   <div class="col-4 vl">
                     <h5>Atrasos</h5>`;
        if (report.delays.length !== 0) {
          for (let i = 0; i < report.delays.length; i++) {
            if ((i % 2) === 0) {
              color = 'bg-light-yellow';
            }
            else {
              color = 'bg-light-yellow-2';
            }
            body += `<div class="${color} font-small mt-2">
                     Tempo: ${report.delays[i].time} min. <br>
                     Data: ${moment(report.delays[i].schedule.startTime).format('DD/MM/YYYY')} <br>
                     ${moment(report.delays[i].schedule.startTime).locale('pt').format('ddd')} ${moment(report.delays[i].schedule.startTime).format('HH:mm')} - ${moment(report.delays[i].schedule.endTime).format('HH:mm')} <br>
                     E/S: ${moment(report.delays[i].entry.entrance).format('HH:mm')} - ${moment(report.delays[i].entry.departure).format('HH:mm')} <br>
                     </div>`;
          }
        }
        body += `</div>
                   <div class="col-4 vl">
                     <h5>Faltas</h5>`;
        if (report.skipped.length !== 0) {
          for (let i = 0; i < report.skipped.length; i++) {
            if ((i % 2) === 0) {
              color = 'bg-light-red';
            }
            else {
              color = 'bg-light-red-2';
            }
            body += `<div class="${color} font-small mt-2">
                     Data: ${moment(report.skipped[i].startTime).format('DD/MM/YYYY')} <br>
                     ${moment(report.skipped[i].startTime).locale('pt').format('ddd')} ${moment(report.skipped[i].startTime).format('HH:mm')} - ${moment(report.skipped[i].endTime).format('HH:mm')} <br>
                     </div>`
          }
        }
        body += `  </div>
                 </div>`;
      }
      else {
        let body = '<h5 class="text-center mt-4">Não há registro para essa semana.</h5>';
      }
      $('#report').html(body);
      body = '';
    });
    $('#previousButton').off().click(() => {
      weekDecrease();
      $('.date').html(`<p style='margin: 2'>${sunday.format('DD/MM/YYYY')} - ${nextSunday.format('DD/MM/YYYY')}</p>`);
      $.post('/users/reports', { user, date: sunday.format('YYYY-MM-DD') }, (report) => {
        if (report) {
          let minute = parseInt(report.minutes % 60, 10);
          if (minute < 10) {
            minute = '0' + minute;
          }
          let hour = parseInt((report.minutes - minute) / 60, 10);
          if (hour < 10) {
            hour = '0' + hour;
          }
          let time = `${hour}:${minute}`;
          $('#hours').html(`Horas semanais: ${time}`);
          body = `<div class="row justify-content-between text-center">
            <div class="col-4">
              <h5>Presentes</h5>`;
          if (report.present.length !== 0) {
            for (let i = 0; i < report.present.length; i++) {
              if ((i % 2) === 0) {
                color = 'bg-light-green';
              }
              else {
                color = 'bg-light-green-2';
              }
              body += `<div class="${color} font-small mt-2">
                       Data: ${moment(report.present[i].startTime).format('DD/MM/YYYY')} <br>
                       ${moment(report.present[i].startTime).locale('pt').format('ddd')} ${moment(report.present[i].startTime).format('HH:mm')} - ${moment(report.present[i].endTime).format('HH:mm')} <br>
                       </div>`
            }
          }
          body += `</div>
                     <div class="col-4 vl">
                       <h5>Atrasos</h5>`;
          if (report.delays.length !== 0) {
            for (let i = 0; i < report.delays.length; i++) {
              if ((i % 2) === 0) {
                color = 'bg-light-yellow';
              }
              else {
                color = 'bg-light-yellow-2';
              }
              body += `<div class="${color} font-small mt-2">
                       Tempo: ${report.delays[i].time} min. <br>
                       Data: ${moment(report.delays[i].schedule.startTime).format('DD/MM/YYYY')} <br>
                       ${moment(report.delays[i].schedule.startTime).locale('pt').format('ddd')} ${moment(report.delays[i].schedule.startTime).format('HH:mm')} - ${moment(report.delays[i].schedule.endTime).format('HH:mm')} <br>
                       E/S: ${moment(report.delays[i].entry.entrance).format('HH:mm')} - ${moment(report.delays[i].entry.departure).format('HH:mm')} <br>
                       </div>`;
            }
          }
          body += `</div>
                     <div class="col-4 vl">
                       <h5>Faltas</h5>`;
          if (report.skipped.length !== 0) {
            for (let i = 0; i < report.skipped.length; i++) {
              if ((i % 2) === 0) {
                color = 'bg-light-red';
              }
              else {
                color = 'bg-light-red-2';
              }
              body += `<div class="${color} font-small mt-2">
                       Data: ${moment(report.skipped[i].startTime).format('DD/MM/YYYY')} <br>
                       ${moment(report.skipped[i].startTime).locale('pt').format('ddd')} ${moment(report.skipped[i].startTime).format('HH:mm')} - ${moment(report.skipped[i].endTime).format('HH:mm')} <br>
                       </div>`
            }
          }
          body += `  </div>
                   </div>`;
        }
        else {
          let body = '<h5 class="text-center mt-4">Não há registro para essa semana.</h5>';
        }
        $('#report').html(body);
        body = '';
      });
    });
    $('#nextButton').off().click(() => {
      weekIncrease();
      $('.date').html(`<p style='margin: 2'>${sunday.format('DD/MM/YYYY')} - ${nextSunday.format('DD/MM/YYYY')}</p>`);
      $.post('/users/reports', { user, date: sunday.format('YYYY-MM-DD') }, (report) => {
        if (report) {
          let minute = parseInt(report.minutes % 60, 10);
          if (minute < 10) {
            minute = '0' + minute;
          }
          let hour = parseInt((report.minutes - minute) / 60, 10);
          if (hour < 10) {
            hour = '0' + hour;
          }
          let time = `${hour}:${minute}`;
          $('#hours').html(`Horas semanais: ${time}`);
          body = `<div class="row justify-content-between text-center">
            <div class="col-4">
              <h5>Presentes</h5>`;
          if (report.present.length !== 0) {
            for (let i = 0; i < report.present.length; i++) {
              if ((i % 2) === 0) {
                color = 'bg-light-green';
              }
              else {
                color = 'bg-light-green-2';
              }
              body += `<div class="${color} font-small mt-2">
                       Data: ${moment(report.present[i].startTime).format('DD/MM/YYYY')} <br>
                       ${moment(report.present[i].startTime).locale('pt').format('ddd')} ${moment(report.present[i].startTime).format('HH:mm')} - ${moment(report.present[i].endTime).format('HH:mm')} <br>
                       </div>`
            }
          }
          body += `</div>
                     <div class="col-4 vl">
                       <h5>Atrasos</h5>`;
          if (report.delays.length !== 0) {
            for (let i = 0; i < report.delays.length; i++) {
              if ((i % 2) === 0) {
                color = 'bg-light-yellow';
              }
              else {
                color = 'bg-light-yellow-2';
              }
              body += `<div class="${color} font-small mt-2">
                       Tempo: ${report.delays[i].time} min. <br>
                       Data: ${moment(report.delays[i].schedule.startTime).format('DD/MM/YYYY')} <br>
                       ${moment(report.delays[i].schedule.startTime).locale('pt').format('ddd')} ${moment(report.delays[i].schedule.startTime).format('HH:mm')} - ${moment(report.delays[i].schedule.endTime).format('HH:mm')} <br>
                       E/S: ${moment(report.delays[i].entry.entrance).format('HH:mm')} - ${moment(report.delays[i].entry.departure).format('HH:mm')} <br>
                       </div>`;
            }
          }
          body += `</div>
                     <div class="col-4 vl">
                       <h5>Faltas</h5>`;
          if (report.skipped.length !== 0) {
            for (let i = 0; i < report.skipped.length; i++) {
              if ((i % 2) === 0) {
                color = 'bg-light-red';
              }
              else {
                color = 'bg-light-red-2';
              }
              body += `<div class="${color} font-small mt-2">
                       Data: ${moment(report.skipped[i].startTime).format('DD/MM/YYYY')} <br>
                       ${moment(report.skipped[i].startTime).locale('pt').format('ddd')} ${moment(report.skipped[i].startTime).format('HH:mm')} - ${moment(report.skipped[i].endTime).format('HH:mm')} <br>
                       </div>`
            }
          }
          body += `  </div>
                   </div>`;
        }
        else {
          let body = '<h5 class="text-center mt-4">Não há registro para essa semana.</h5>';
        }
        $('#report').html(body);
        body = '';
      });
    });
  });

  function weekDecrease() {
    sunday.weekday(-7);
    nextSunday.weekday(-7);
  };

  function weekIncrease() {
    sunday.weekday(+7);
    nextSunday.weekday(+7);
  };
});
