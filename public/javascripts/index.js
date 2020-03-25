$(document).ready(function () {
  $('#yellow-beach-btn').click(function () {
    if (confirm('Tem certeza que deseja deslogar todos os membros?')) {
      $('#yellow-beach-form').submit();
    }
  });

  $('#table tr').each(function () {
    const entry = $(this).find("td").eq(7).html();
    $(this).find("td").eq(8).html(moment(entry).format("kk:mm"));
    const now = moment().valueOf();
    const entryHour = moment(entry).valueOf();
    const time = moment.duration(now - entryHour);
    let hours = time.hours();
    let minutes = time.minutes();
    if (time.minutes() < 10) {
      minutes = `0${time.minutes()}`;
    }
    if (time.hours() < 10 && time.hours() > 0) {
      hours = `0${time.hours()}`;
    }
    if (time.hours() === 0) {
      const badge = `<span class="badge badge-CPE text-white p-2" style="font-size: 1rem">
                       ${minutes} min.
                     </span>`;
      $(this).find("td").eq(9).html(badge);
    }
    else {
      const badge = `<span class="badge badge-CPE text-white p-2" style="font-size: 1rem">
                       ${hours}h${minutes}
                     </span>`;
      $(this).find("td").eq(9).html(badge);
    }
  });

  function updateTable() {
    $('#table tr').each(function () {
      const entry = $(this).find("td").eq(7).html();
      const now = moment().valueOf();
      const entryHour = moment(entry).valueOf();
      const time = moment.duration(now - entryHour);
      let hours = time.hours();
      let minutes = time.minutes();
      if (time.minutes() < 10) {
        minutes = `0${time.minutes()}`;
      }
      if (time.hours() < 10 && time.hours() > 0) {
        hours = `0${time.hours()}`;
      }
      if (time.hours() === 0) {
        const badge = `<span class="badge badge-CPE text-white p-2" style="font-size: 1rem">
                         ${minutes} min.
                       </span>`;
        $(this).find("td").eq(9).html(badge);
      }
      else {
        const badge = `<span class="badge badge-CPE text-white p-2" style="font-size: 1rem">
                         ${hours}h${minutes}
                       </span>`;
        $(this).find("td").eq(9).html(badge);
      }
    });
  }

  function timedUpdate() {
    updateTable();
    setTimeout(timedUpdate, 10000);
  }

  timedUpdate();
});
