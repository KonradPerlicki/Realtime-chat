/*
Template Name: Velzon - Admin & Dashboard Template
Author: Themesbrand
Version: 1.5.0
Website: https://Themesbrand.com/
Contact: Themesbrand@gmail.com
File: Common Plugins Js File
*/

//Common plugins
if (
    document.querySelectorAll('[toast-list]') ||
    document.querySelectorAll('[data-choices]') ||
    document.querySelectorAll('[data-provider]')
) {
    document.writeln(
        "<script type='text/javascript' src='/assets/libs/toastify.js'></script>"
    );
    document.writeln(
        "<script type='text/javascript' src='/assets/libs/choices.js'></script>"
    );
    document.writeln(
        "<script type='text/javascript' src='/assets/libs/flatpickr.min.js'></script>"
    );
}
