$('#logout').click(() => {
    $.ajax({
        url: '/logout',
        method: 'DELETE',
        success: (res) => {
            window.location.href = '/logout';
        },
        error: (res) => {
            console.log(res);
        },
    });
});
