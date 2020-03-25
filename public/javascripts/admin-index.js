$(document).ready(function () {
  $('#mandatory-btn').click(function () {
    if (confirm('Tem certeza que deseja atualizar os horários obrigatórios?')) {
      $('#mandatory-form').submit();
    }
  });
});
