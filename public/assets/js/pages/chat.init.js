/*
Template Name: Velzon - Admin & Dashboard Template
Author: Themesbrand
Website: https://Themesbrand.com/
Contact: Themesbrand@gmail.com
File: Chat init js
*/

var dummyUserImage = '../assets/images/users/user-dummy-img.jpg';
var dummyMultiUserImage = '../assets/images/users/multi-user.jpg';
var isreplyMessage = false;

// favourite btn
document.querySelectorAll('.favourite-btn').forEach(function (item) {
    item.addEventListener('click', function (event) {
        this.classList.toggle('active');
    });
});

var userChatElement = document.getElementsByClassName('user-chat');

document.querySelectorAll('.chat-user-list li a').forEach(function (item) {
    item.addEventListener('click', function (event) {
        userChatElement.forEach(function (elm) {
            elm.classList.add('user-chat-show');
        });

        // chat user list link active
        var chatUserList = document.querySelector('.chat-user-list li.active');
        if (chatUserList) chatUserList.classList.remove('active');
        this.parentNode.classList.add('active');
    });
});

// user-chat-remove
document.querySelectorAll('.user-chat-remove').forEach(function (item) {
    item.addEventListener('click', function (event) {
        userChatElement.forEach(function (elm) {
            elm.classList.remove('user-chat-show');
        });
    });
});
//Append New Message
var getChatList = function (chatid, chatItems) {
    messageIds++;

    var chatConList = document.getElementById(chatid);
    var itemList = chatConList.querySelector('.chat-conversation-list');

    if (chatItems != null) {
        var userId = $('#chatinput-form').data('userId');

        $.ajax({
            url: '/admin/chat/send',
            type: 'POST',
            data: {
                message: chatItems,
                to: userId,
            },
            success: (res) => {
                socket.emit('send-message', { msg: chatItems, userId });
                createMessage(itemList, chatItems, 'right');
            },
        });
    }

    // remove chat list
    var newChatList = document.getElementById('chat-list-' + messageIds);
    if (newChatList) {
        var deleteItems = newChatList.querySelectorAll('.delete-item');
        if (deleteItems) {
            newChatList
                .querySelectorAll('.delete-item')
                .forEach(function (subitem) {
                    subitem.addEventListener('click', function () {
                        itemList.removeChild(newChatList);
                    });
                });
        }

        //Copy Message
        newChatList
            .querySelectorAll('.copy-message')
            .forEach(function (subitem) {
                subitem.addEventListener('click', function () {
                    var currentValue =
                        newChatList.childNodes[1].firstElementChild
                            .firstElementChild.firstElementChild
                            .firstElementChild.innerText;
                    navigator.clipboard.writeText(currentValue);
                });
            });

        //Copy Clipboard alert
        newChatList
            .querySelectorAll('.copy-message')
            .forEach(function (subitem) {
                subitem.addEventListener('click', function () {
                    document.getElementById('copyClipBoard').style.display =
                        'block';
                    setTimeout(hideclipboardNew, 1000);

                    function hideclipboardNew() {
                        document.getElementById('copyClipBoard').style.display =
                            'none';
                    }
                });
            });

        //reply Message model
        newChatList
            .querySelectorAll('.reply-message')
            .forEach(function (subitem) {
                subitem.addEventListener('click', function () {
                    var replyToggleOpenNew =
                        document.querySelector('.replyCard');
                    var replyToggleCloseNew =
                        document.querySelector('#close_toggle');
                    var replyMessageNew =
                        subitem.closest('.ctext-wrap').children[0].children[0]
                            .innerText;
                    var replyUserNew = document.querySelector(
                        '.replyCard .replymessage-block .flex-grow-1 .conversation-name'
                    ).innerHTML;
                    isreplyMessage = true;
                    replyToggleOpenNew.classList.add('show');
                    replyToggleCloseNew.addEventListener('click', function () {
                        replyToggleOpenNew.classList.remove('show');
                    });
                    var msgOwnerName = subitem.closest('.chat-list')
                        ? subitem
                              .closest('.chat-list')
                              .classList.contains('left')
                            ? replyUserNew
                            : 'You'
                        : replyUserNew;
                    document.querySelector(
                        '.replyCard .replymessage-block .flex-grow-1 .conversation-name'
                    ).innerText = msgOwnerName;
                    document.querySelector(
                        '.replyCard .replymessage-block .flex-grow-1 .mb-0'
                    ).innerText = replyMessageNew;
                });
            });
    }
};

socket.on('receive-message', (msg) => {
    var chatConList = document.getElementById('users-chat');
    var itemList = chatConList.querySelector('.chat-conversation-list');
    createMessage(itemList, msg, 'left');
    scrollToBottom(currentChatId);
});
// popup image
var lightbox = GLightbox({
    selector: '.popup-img',
    title: false,
});

//User current Id
var currentChatId = 'users-chat';
scrollToBottom(currentChatId);

//chat form
var chatForm = document.querySelector('#chatinput-form');
var chatInput = document.querySelector('#chat-input');
var chatInputfeedback = document.querySelector('.chat-input-feedback');

function currentTime() {
    var ampm = new Date().getHours() >= 12 ? 'pm' : 'am';
    var hour =
        new Date().getHours() > 12
            ? new Date().getHours() % 12
            : new Date().getHours();
    var minute =
        new Date().getMinutes() < 10
            ? '0' + new Date().getMinutes()
            : new Date().getMinutes();
    if (hour < 10) {
        return '0' + hour + ':' + minute + ' ' + ampm;
    } else {
        return hour + ':' + minute + ' ' + ampm;
    }
}
setInterval(currentTime, 1000);

var messageIds = 0;

if (chatForm) {
    //add an item to the List, including to local storage
    chatForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var chatId = currentChatId;
        var chatReplyId = currentChatId;

        var chatInputValue = chatInput.value;

        if (chatInputValue.length === 0) {
            chatInputfeedback.classList.add('show');
            setTimeout(function () {
                chatInputfeedback.classList.remove('show');
            }, 2000);
        } else {
            if (isreplyMessage == true) {
                getReplyChatList(chatReplyId, chatInputValue);
                isreplyMessage = false;
            } else {
                getChatList(chatId, chatInputValue);
            }
            scrollToBottom(chatId || chatReplyId);
        }
        chatInput.value = '';

        //reply msg remove textarea
        document.getElementById('close_toggle').click();
    });
}

//user Name and user Profile change on click
document.querySelectorAll('#userList li').forEach(function (item) {
    item.addEventListener('click', function () {
        var username = item.querySelector('.text-truncate').innerHTML;
        var userProfile = item
            .querySelector('.avatar-xxs .userprofile')
            .getAttribute('src');

        document.querySelector(
            '.user-chat-topbar .text-truncate .username'
        ).innerHTML = username;

        if (userProfile) {
            document
                .querySelector('.user-chat-topbar .avatar-xs')
                .setAttribute('src', userProfile);
            document
                .querySelector('.profile-offcanvas .avatar-lg')
                .setAttribute('src', userProfile);
        } else {
            document
                .querySelector('.user-chat-topbar .avatar-xs')
                .setAttribute('src', dummyUserImage);
            document
                .querySelector('.profile-offcanvas .avatar-lg')
                .setAttribute('src', dummyUserImage);
        }
        var conversationImg = document.getElementById('users-conversation');
        conversationImg
            .querySelectorAll('.left .chat-avatar')
            .forEach(function (item) {
                if (userProfile) {
                    item.querySelector('img').setAttribute('src', userProfile);
                } else {
                    item.querySelector('img').setAttribute(
                        'src',
                        dummyUserImage
                    );
                }
            });
    });
});

//channel Name and channel Profile change on click
document.querySelectorAll('#channelList li').forEach(function (item) {
    item.addEventListener('click', function () {
        var channelname = item.querySelector('.text-truncate').innerHTML;

        document.querySelector(
            '.user-chat-topbar .text-truncate .username'
        ).innerHTML = channelname;
        document.querySelector('.profile-offcanvas .username').innerHTML =
            channelname;

        document
            .querySelector('.user-chat-topbar .avatar-xs')
            .setAttribute('src', dummyMultiUserImage);
        document
            .querySelector('.profile-offcanvas .avatar-lg')
            .setAttribute('src', dummyMultiUserImage);

        var conversationImg = document.getElementById('users-conversation');
        conversationImg
            .querySelectorAll('.left .chat-avatar')
            .forEach(function (item) {
                item.querySelector('img').setAttribute('src', dummyUserImage);
            });
    });
});

function createMessage(list, msg, className, time = null) {
    var date = time ? new Date(time).toDateString() : currentTime();
    list.insertAdjacentHTML(
        'beforeend',
        '<li class="chat-list ' +
            className +
            '" id="chat-list-' +
            messageIds +
            '" >\
            <div class="conversation-list">\
                <div class="user-chat-content">\
                    <div class="ctext-wrap">\
                        <div class="ctext-wrap-content">\
                            <p class="mb-0 ctext-content">\
                                ' +
            msg +
            '\
                            </p>\
                    </div>\
                </div>\
                <div class="conversation-name">\
                    <small class="text-muted time">' +
            date +
            '</small>\
                    <span class="text-success check-message-icon"></span>\
                </div>\
            </div>\
        </div>\
    </li>'
    );
}

var messageboxcollapse = 0;

//message with reply
var getReplyChatList = function (chatReplyId, chatReplyItems) {
    var chatReplyUser = document.querySelector(
        '.replyCard .replymessage-block .flex-grow-1 .conversation-name'
    ).innerHTML;
    var chatReplyMessage = document.querySelector(
        '.replyCard .replymessage-block .flex-grow-1 .mb-0'
    ).innerText;

    messageIds++;
    var chatreplyConList = document.getElementById(chatReplyId);
    var itemReplyList = chatreplyConList.querySelector(
        '.chat-conversation-list'
    );
    if (chatReplyItems != null) {
        itemReplyList.insertAdjacentHTML(
            'beforeend',
            '<li class="chat-list right" id="chat-list-' +
                messageIds +
                '" >\
                <div class="conversation-list">\
                    <div class="user-chat-content">\
                        <div class="ctext-wrap">\
                            <div class="ctext-wrap-content">\
                            <div class="replymessage-block mb-0 d-flex align-items-start">\
                        <div class="flex-grow-1">\
                            <h5 class="conversation-name">' +
                chatReplyUser +
                '</h5>\
                            <p class="mb-0">' +
                chatReplyMessage +
                '</p>\
                        </div>\
                        <div class="flex-shrink-0">\
                            <button type="button" class="btn btn-sm btn-link mt-n2 me-n3 font-size-18">\
                            </button>\
                        </div>\
                    </div>\
                                <p class="mb-0 ctext-content mt-1">\
                                    ' +
                chatReplyItems +
                '\
                                </p>\
                            </div>\
                            <div class="dropdown align-self-start message-box-drop">\
                                <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
                                    <i class="ri-more-2-fill"></i>\
                                </a>\
                                <div class="dropdown-menu">\
                                    <a class="dropdown-item d-flex align-items-center justify-content-between reply-message" href="#" data-bs-toggle="collapse"  data-bs-target=".replyCollapse">Reply <i class="bx bx-share ms-2 text-muted"></i></a>\
                                    <a class="dropdown-item d-flex align-items-center justify-content-between" href="#" data-bs-toggle="modal" data-bs-target=".forwardModal">Forward <i class="bx bx-share-alt ms-2 text-muted"></i></a>\
                                    <a class="dropdown-item d-flex align-items-center justify-content-between copy-message" href="#" id="copy-message-' +
                messageIds +
                '">Copy <i class="bx bx-copy text-muted ms-2"></i></a>\
                                    <a class="dropdown-item d-flex align-items-center justify-content-between" href="#">Bookmark <i class="bx bx-bookmarks text-muted ms-2"></i></a>\
                                    <a class="dropdown-item d-flex align-items-center justify-content-between" href="#">Mark as Unread <i class="bx bx-message-error text-muted ms-2"></i></a>\
                                    <a class="dropdown-item d-flex align-items-center justify-content-between delete-item" id="delete-item-' +
                messageIds +
                '" href="#">Delete <i class="bx bx-trash text-muted ms-2"></i></a>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="conversation-name">\
                        <small class="text-muted time">' +
                currentTime() +
                '</small>\
                        <span class="text-success check-message-icon"><i class="bx bx-check"></i></span>\
                    </div>\
                </div>\
            </div>\
        </li>'
        );
        messageboxcollapse++;
    }

    // remove chat list
    var newChatList = document.getElementById('chat-list-' + messageIds);
    newChatList.querySelectorAll('.delete-item').forEach(function (subitem) {
        subitem.addEventListener('click', function () {
            itemList.removeChild(newChatList);
        });
    });

    //Copy Clipboard alert
    newChatList.querySelectorAll('.copy-message').forEach(function (subitem) {
        subitem.addEventListener('click', function () {
            document.getElementById('copyClipBoard').style.display = 'block';
            document.getElementById('copyClipBoardChannel').style.display =
                'block';
            setTimeout(hideclipboardNew, 1000);

            function hideclipboardNew() {
                document.getElementById('copyClipBoard').style.display = 'none';
                document.getElementById('copyClipBoardChannel').style.display =
                    'none';
            }
        });
    });

    newChatList.querySelectorAll('.reply-message').forEach(function (subitem) {
        subitem.addEventListener('click', function () {
            var replyMessage =
                subitem.closest('.ctext-wrap').children[0].children[0]
                    .innerText;
            var replyuser = document.querySelector(
                '.user-chat-topbar .text-truncate .username'
            ).innerHTML;
            document.querySelector(
                '.replyCard .replymessage-block .flex-grow-1 .mb-0'
            ).innerText = replyMessage;
            var msgOwnerName = subitem.closest('.chat-list')
                ? subitem.closest('.chat-list').classList.contains('left')
                    ? replyuser
                    : 'You'
                : replyuser;
            document.querySelector(
                '.replyCard .replymessage-block .flex-grow-1 .conversation-name'
            ).innerText = msgOwnerName;
        });
    });

    //Copy Message
    newChatList.querySelectorAll('.copy-message').forEach(function (subitem) {
        subitem.addEventListener('click', function () {
            newChatList.childNodes[1].children[1].firstElementChild.firstElementChild.getAttribute(
                'id'
            );
            isText =
                newChatList.childNodes[1].children[1].firstElementChild
                    .firstElementChild.innerText;
            navigator.clipboard.writeText(isText);
        });
    });
};

//Search Message
function searchMessages() {
    var searchInput, searchFilter, searchUL, searchLI, a, i, txtValue;
    searchInput = document.getElementById('searchMessage');
    searchFilter = searchInput.value.toUpperCase();
    searchUL = document.getElementById('users-conversation');
    searchLI = searchUL.getElementsByTagName('li');
    searchLI.forEach(function (search) {
        a = search.getElementsByTagName('p')[0]
            ? search.getElementsByTagName('p')[0]
            : '';
        txtValue =
            a.textContent || a.innerText ? a.textContent || a.innerText : '';
        if (txtValue.toUpperCase().indexOf(searchFilter) > -1) {
            search.style.display = '';
        } else {
            search.style.display = 'none';
        }
    });
}
