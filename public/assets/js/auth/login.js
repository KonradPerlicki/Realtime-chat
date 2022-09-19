$('#loginForm').submit((e) => {
    e.preventDefault();

    var username = document.getElementById('username').value;
    var password = document.getElementById('password-input').value;

    $.ajax({
        url: '/admin/login',
        method: 'POST',
        data: { username, password },
        success: (res) => {
            window.location.href = '/admin';
        },
        error: (err) => {
            console.log(err);
            document.getElementById('error').innerHTML =
                'Invalid Email or Password';
        },
    });
});
