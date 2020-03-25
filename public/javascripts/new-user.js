$(document).ready(() => {
  $('#inputRole').off().change(() => {
    const user = $('#inputRole :selected').text();
    const div = document.getElementById('divPassword');
    if (user === 'Diretor(a) de Desenvolvimento' || user === 'Gerente de Desenvolvimento' || user === 'Assessor(a) de Desenvolvimento') {
      if (div.classList.contains('d-none')) {
        div.classList.remove('d-none');
        $('#inputPassword').attr('required', true);
      }
    }
    else {
      if (!div.classList.contains('d-none')) {
        div.classList.add('d-none');
        $('#inputPassword').attr('required', false);
      }
    }
  });
});
