$(document).ready(() => {
  const user = {
    name: $('input').val()
  };
  const options = {
    enableHighAccuracy: true
  };
  $('#loginForm').keypress((e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);
      } else {
        const error = 'NOT_SUPPORTED';
        $.post('/location', { user, error }, (result) => {
          $('#loginForm').append(`<input type="hidden" name="error" value="${result}">`);
          $('#loginForm').appendTo('body').submit();
        });
      }
    }
  });

  $('#loginButton').click(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
      const error = 'NOT_SUPPORTED';
      $.post('/location', { user, error }, (result) => {
        $('#loginForm').append(`<input type="hidden" name="error" value="${result}">`);
        $('#loginForm').appendTo('body').submit();
      });
    }
  });

  function success(position) {
    $.post('/location', { user, location: position }, (result) => {
      $('#loginForm').append(`<input type="hidden" name="location" value="${result}">`);
      $('#loginForm').appendTo('body').submit();
    });
  }

  function error(error) {
    $.post('/location', { user, error }, (result) => {
      $('#loginForm').append(`<input type="hidden" name="error" value="${result}">`);
      $('#loginForm').appendTo('body').submit();
    });
  }
});
