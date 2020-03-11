var messageCounter = 56791;
var userName = "Guest";
var referenceRegex = /(#[0-9]*)/gi;

(function($) {

    "use strict";

    $('#sidebar').toggleClass('active');

    $('#chat-input').keyup(function(event) {
        var value = $.trim($('#chat-input').val());
        if (event.shiftKey && event.keyCode == 13 &&
            value != '' && value != null) {
            var message = $.trim($('#chat-input').val());
            var actionMessage = detectActions(message);
            appendReferences(actionMessage);
            $('#messages').append(generateChatMsg(actionMessage));
            $('#chat-input').val('');
            $('#chat-input').focus();
        }
    });

    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

    // $('#img-upload').fileupload();

})(jQuery);

generateChatMsg = function(message) {
    var newMsg = message.replace(/(#[0-9]*)/gi, '<a href="#">$&</a>');
    return `<div class="chat-message">
        <div id="msg-header-${messageCounter}">
            <span class="username"> ${userName} </span> |
            <span> Msg. <a href="#"> #${messageCounter++} </a> </span> |
        </div>
        <div class="message-body">${newMsg}</div>
    </div>`;
}

appendReferences = function(message) {
    var references = message.match(referenceRegex) || [];
    references.forEach(ref => {
        var cleanRef = ref.replace('#', '');
        var referencedEl = $(`#msg-header-${cleanRef}`);
        referencedEl.append(makeRef());
    });
}

detectActions = function(message) {
    console.log(message.replace(/(\*+)(\s*\b)([^\*]*)(\b\s*)(\*+)/gi, '<i>$&</i>'))
    return message.replace(/(\*+)(\s*\b)([^\*]*)(\b\s*)(\*+)/gi, '<i>$&</i>').replace(/\*/g, '');
}

makeRef = function() {
    return `<small><a href="#">#${messageCounter} </a></small>`;
};