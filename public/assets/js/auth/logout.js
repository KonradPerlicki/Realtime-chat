$('#logout').click(() => {
    $.ajax({
        url: '/logout',
        method: 'DELETE',
        success: (res) => {
            localStorage.removeItem('user');
            window.location.href = '/login';
        },
        error: (res) => {
            console.log(res);
        },
    });
});
