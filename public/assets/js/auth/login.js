$('#loginForm').submit((e) => {
    e.preventDefault();

    var username = document.getElementById('username').value;
    var password = document.getElementById('userpassword').value;

    $.ajax({
        url: '/login',
        method: 'POST',
        data: { username, password },
        success: (res) => {
            localStorage.setItem('user', res.user);
            window.location.href = '/';
        },
        error: (err) => {
            console.log(err);
            document.getElementById('error').innerHTML =
                '*Invalid Email or Password';
        },
    });
});
