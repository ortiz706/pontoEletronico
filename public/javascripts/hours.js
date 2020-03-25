$(document).ready(() => {
  let sunday = moment().weekday(0);
  let nextSunday = moment().weekday(7);
  let body = '<h5 class="text-center mt-4">O usuário não tem entradas nessa semana.</h5>';
  $('.date').html(`<p style='margin: 2'>${sunday.format('DD/MM/YYYY')} - ${nextSunday.format('DD/MM/YYYY')}</p>`);
  $('#inputUser').off().change(() => {
    sunday = moment().weekday(0);
    nextSunday = moment().weekday(7);
    $('.date').html(`<p style='margin: 2'>${sunday.format('DD/MM/YYYY')} - ${nextSunday.format('DD/MM/YYYY')}</p>`);
    const user = $('#inputUser :selected').val();
    $.post('/users/reports', { user, date: sunday.format('YYYY-MM-DD') }, (report) => {
      if (report) {
        if (report.minutes > 0) {
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
        }
        else {
          $('#hours').html(`Horas semanais: Não há registro.`);
        }
      }
      else {
        $('#hours').html(`Horas semanais: Não há registro.`);
      }
    });
    $.post('/users/entries', { user, sunday: sunday.format(), nextSunday: nextSunday.format() }, (entries) => {
      if (entries.length !== 0) {
        body = `<table class="table mt-4">
                  <caption>Lista de entradas</caption>
                    <thead class="thead-CPE-black">
                      <tr>
                        <th class="text-center">Data</th>
                        <th class="text-center">Hora</th>
                      </tr>
                    </thead>
                    <tbody id="table">`;
        for (let i = 0; i < entries.length; i++) {
          body += `<tr>
                     <td scope="row" class="text-center align-middle font-weight-bold">${moment(entries[i]).format('DD/MM/YYYY')}</td>
                     <td scope="row" class="text-center align-middle font-weight-bold">${moment(entries[i]).format('HH:mm:ss')}</td>
                   </tr>`;
        }
        body += `</tbody>
        </table>`;
      }
      else {
        body = '<h5 class="text-center mt-4">O usuário não tem entradas nessa semana.</h5>';
      }
      $('#report').html(body);
    });
    $('#previousButton').off().click(() => {
      weekDecrease();
      $('.date').html(`<p style='margin: 2'>${sunday.format('DD/MM/YYYY')} - ${nextSunday.format('DD/MM/YYYY')}</p>`);
      $.post('/users/reports', { user, date: sunday.format('YYYY-MM-DD') }, (report) => {
        if (report) {
          if (report.minutes > 0) {
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
          }
          else {
            $('#hours').html(`Horas semanais: Não há registro.`);
          }
        }
        else {
          $('#hours').html(`Horas semanais: Não há registro.`);
        }
      });
      $.post('/users/entries', { user, sunday: sunday.format(), nextSunday: nextSunday.format() }, (entries) => {
        if (entries.length !== 0) {
          body = `<table class="table mt-4">
                    <caption>Lista de entradas</caption>
                      <thead class="thead-CPE-black">
                        <tr>
                          <th class="text-center">Data</th>
                          <th class="text-center">Hora</th>
                        </tr>
                      </thead>
                      <tbody id="table">`;
          for (let i = 0; i < entries.length; i++) {
            body += `<tr>
                       <td scope="row" class="text-center align-middle font-weight-bold">${moment(entries[i]).format('DD/MM/YYYY')}</td>
                       <td scope="row" class="text-center align-middle font-weight-bold">${moment(entries[i]).format('HH:mm:ss')}</td>
                     </tr>`;
          }
          body += `</tbody>
          </table>`;
        }
        else {
          body = '<h5 class="text-center mt-4">O usuário não tem entradas nessa semana.</h5>';
        }
        $('#report').html(body);
      });
    });
    $('#nextButton').off().click(() => {
      weekIncrease();
      $('.date').html(`<p style='margin: 2'>${sunday.format('DD/MM/YYYY')} - ${nextSunday.format('DD/MM/YYYY')}</p>`);
      $.post('/users/reports', { user, date: sunday.format('YYYY-MM-DD') }, (report) => {
        if (report) {
          if (report.minutes > 0) {
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
          }
          else {
            $('#hours').html(`Horas semanais: Não há registro.`);
          }
        }
        else {
          $('#hours').html(`Horas semanais: Não há registro.`);
        }
      });
      $.post('/users/entries', { user, sunday: sunday.format(), nextSunday: nextSunday.format() }, (entries) => {
        if (entries.length !== 0) {
          body = `<table class="table mt-4">
                    <caption>Lista de entradas</caption>
                      <thead class="thead-CPE-black">
                        <tr>
                          <th class="text-center">Data</th>
                          <th class="text-center">Hora</th>
                        </tr>
                      </thead>
                      <tbody id="table">`;
          for (let i = 0; i < entries.length; i++) {
            body += `<tr>
                       <td scope="row" class="text-center align-middle font-weight-bold">${moment(entries[i]).format('DD/MM/YYYY')}</td>
                       <td scope="row" class="text-center align-middle font-weight-bold">${moment(entries[i]).format('HH:mm:ss')}</td>
                     </tr>`;
          }
          body += `</tbody>
          </table>`;
        }
        else {
          body = '<h5 class="text-center mt-4">O usuário não tem entradas nessa semana.</h5>';
        }
        $('#report').html(body);
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
