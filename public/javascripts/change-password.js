$(document).ready(() => {
  const password = document.getElementById('newPassword');
  const confirmPassword = document.getElementById('confirmPassword');

  function validatePassword() {
    if (password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity('As senhas não coincidem!');
    }
    else {
      confirmPassword.setCustomValidity('');
    }
  }
  password.onchange = validatePassword;
  confirmPassword.onkeyup = validatePassword;
});
