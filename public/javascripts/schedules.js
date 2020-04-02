$(document).ready(() => {
  let today = moment()
  $('#inputUser').off().change(() => {
    const user = $('#inputUser :selected').val();
    $.post('/users/schedules', { user }, (schedules) => {
      if (schedules.length !== 0) {
        body = `<table class="table mt-4">
            <caption>Lista de horários obrigatórios</caption>
            <thead class="thead-CPE-black">
              <tr>
                <th class="text-center color-background">Dia</th>
                <th class="text-center color-background">Hora</th>
              </tr>
            </thead>
            <tbody id="table">`;
        schedules.sort((a, b) => (a.weekday > b.weekday) ? 1 : (a.weekday === b.weekday) ? ((parseInt(a.startTime.slice(0, 2), 10) > parseInt(b.startTime.slice(0, 2), 10)) ? 1 : -1) : -1 )
        for (let i = 0; i < schedules.length; i++) {
          today.weekday(schedules[i].weekday);
          body += `<tr>
                     <td scope="row" class="text-center align-middle font-weight-bold">${moment(today).locale('pt').format('ddd')}</td>
                     <td scope="row" class="text-center align-middle font-weight-bold"> ${schedules[i].startTime} - ${schedules[i].endTime}</td>
                   </tr>`;
        }
        body += `</tbody>
              </table>`;
      }
      else {
        body = '<h5 class="text-center mt-4">O usuário não tem horários obrigatórios cadastrados.</h5>';
      }
      $('#schedules').html(body);
    });
  });
});
