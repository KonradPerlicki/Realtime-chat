var toastExamples = document.querySelectorAll('[data-toast]');
toastExamples.forEach(function (element) {
    var toastData = {};
    var isToastVal = element.attributes;
    if (isToastVal['data-toast-text']) {
        toastData.text = isToastVal['data-toast-text'].value.toString();
    }
    if (isToastVal['data-toast-gravity']) {
        toastData.gravity = isToastVal['data-toast-gravity'].value.toString();
    }
    if (isToastVal['data-toast-position']) {
        toastData.position = isToastVal['data-toast-position'].value.toString();
    }
    if (isToastVal['data-toast-className']) {
        toastData.className =
            isToastVal['data-toast-className'].value.toString();
    }
    if (isToastVal['data-toast-duration']) {
        toastData.duration = isToastVal['data-toast-duration'].value.toString();
    }
    if (isToastVal['data-toast-close']) {
        toastData.close = isToastVal['data-toast-close'].value.toString();
    }
    if (isToastVal['data-toast-style']) {
        toastData.style = isToastVal['data-toast-style'].value.toString();
    }
    if (isToastVal['data-toast-offset']) {
        toastData.offset = isToastVal['data-toast-offset'];
    }
    Toastify({
        newWindow: true,
        text: toastData.text,
        gravity: toastData.gravity,
        position: toastData.position,
        className: 'bg-' + toastData.className,
        stopOnFocus: true,
        offset: {
            x: toastData.offset ? 50 : 0, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: toastData.offset ? 10 : 0, // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        duration: toastData.duration,
        close: toastData.close == 'close' ? true : false,
        style:
            toastData.style == 'style'
                ? {
                      background: 'linear-gradient(to right, #0AB39C, #405189)',
                  }
                : '',
    }).showToast();
});
