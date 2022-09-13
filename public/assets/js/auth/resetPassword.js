$('#form').submit((e) => {
    e.preventDefault();
    var password = document.getElementById('password-input').value;
    var passwordConfirmation = document.getElementById(
        'confirm-password-input'
    ).value;

    var userId = document.getElementById('userId').value;

    $('#invalid').hide();

    $.ajax({
        url: '/reset-password',
        method: 'POST',
        data: { password, passwordConfirmation, userId },
        success: (res) => {
            window.location.href = '/login';
        },
        error: (res) => {
            const data = JSON.parse(res.responseText);
            $('#invalid').text(data.errors[0].message).show();
        },
    });
});
