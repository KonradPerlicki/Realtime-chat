$('#registerForm').submit((e) => {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password-input').value;
    var passwordConfirmation = document.getElementById(
        'confirm-password-input'
    ).value;

    $('.invalid-feedback').hide();

    $.ajax({
        url: '/register',
        method: 'POST',
        data: { username, password, email, passwordConfirmation },
        success: (res) => {
            window.location.href = '/';
        },
        error: (res) => {
            const data = JSON.parse(res.responseText);
            data.errors.forEach((err) => {
                $('.' + err.field + '.invalid-feedback')
                    .text(err.message)
                    .show();
            });
        },
    });
});
