$('#logout').click(() => {
    $.ajax({
        url: '/admin/logout',
        method: 'DELETE',
        success: (res) => {
            window.location.href = '/admin/logout';
        },
        error: (res) => {
            console.log(res);
        },
    });
});
