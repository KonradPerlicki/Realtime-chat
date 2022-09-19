$('#form').submit((e) => {
    e.preventDefault();

    var email = document.getElementById('email').value;
    document.getElementById('info').innerHTML = '';
    $.ajax({
        url: '/admin/forgot-password',
        method: 'POST',
        data: { email },
        success: (res) => {
            document.getElementById('info').innerHTML =
                '<p class="success text-success" id="success">Mail with reset link successfully sent</p>';
        },
        error: (err) => {
            try {
                err = JSON.parse(err.responseText);
                console.log(err, err.message);
                document.getElementById('info').innerHTML =
                    '<p class="error text-danger" id="error">' +
                    err.message +
                    '</p>';
            } catch (e) {
                document.getElementById('info').innerHTML =
                    '<p class="error text-danger" id="error">Too many requests, only 3 per 10 minutes is allowed.</p>';
            }
        },
    });
});
