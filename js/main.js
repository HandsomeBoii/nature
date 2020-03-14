var messageCounter = 56791;
var userName = "Guest";
var referenceRegex = /(#[0-9]*)/gi;

(function($) {

    "use strict";

    $('#sidebar').toggleClass('active');

    $('body').on('dblclick', 'a.msg-id', function() {
        var id = $.trim($(this).html());
        $('#chat-input')
            .val(function() {
                return ($(this).val() === '' || $(this).val() === undefined) ?
                    `${$(this).val()}${id}\n` :
                    `${$(this).val()}\n${id}\n`;
            })
            .focus();
    });

    $('#chat-input').keyup(function(event) {
        var value = $.trim($('#chat-input').val());
        if (event.shiftKey && event.keyCode == 13 &&
            value != '' && value != null) {
            var message = $.trim($('#chat-input').val());

            var newMsg = generateChatMsg(message);
            if (newMsg) {
                $('#messages').append(newMsg);
            }

            $('#chat-input').val('').focus();
            messageCounter++;
        }
    });

    // $('#file-input').change(function() {
    //     const file = this.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.addEventListener('load', function() {
    //             console.log(this);
    //             $('#test-img').attr('src', this.result);
    //         });
    //         reader.readAsDataURL(file);
    //     }
    //     console.log(file);
    // });

    // $('#chat-input').change(function(event) {
    //     $('#chat-input').val(detectActions($('#chat-input').val()));
    // });

    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

    // TODO: next pass
    // $('.msg-image').on('click', function() {
    //     console.log('hello')
    //     $(this).toggleClass('msg-image-lg');
    // });

})(jQuery);

generateImage = function(messageCounter) {
    var image = $('#file-input').prop('files')[0];
    if (image) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            console.log(this.result)
            const id = `img-${messageCounter}`;
            console.log(id);
            console.log($(id));
            // $(id).attr('src', this.result);
        });
        reader.readAsDataURL(image);
        $('#file-input').val('');
    }
}

generateChatMsg = function(message) {
    // Message creation logic
    var actionMessage = detectActions(message);
    appendReferences(actionMessage);
    var newMsg = actionMessage.replace(/(#[0-9]*)/gi, '<a href="#">$&</a>');

    // Check image upload
    var image = $('#file-input').prop('files')[0];
    if (image) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            // Generate message here with image
            const msg = getChatHtml(newMsg, this.result);
            $('#messages').append(msg);
        });
        reader.readAsDataURL(image);
        $('#file-input').val('');
    } else {
        // Message with no image
        return getChatHtml(newMsg);
    }
}

getChatHtml = function(message, imageSrc) {
    return `<div class="chat-message">
        <div id="msg-header-${messageCounter}">
            <span class="username"> ${userName} </span> |
            <span> Msg. <a href="#" class="msg-id" id="msg-id-${messageCounter}"> #${messageCounter} </a> </span> |
        </div>
        <div class="message-body">${!!imageSrc ? getImageHtml(messageCounter, imageSrc) : ''}<span>${message}</span></div>
        </div>`;
}

getImageHtml = function(messageCounter, imageSrc) {
    return `<span><img src="${imageSrc}" alt="image" class="msg-image" id="img-${messageCounter}"></span>`;
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
    return message.replace(/(\*+)(\s*\b)([^\*]*)(\b\s*)(\*+)/gi, '<i>$&</i>').replace(/\*/g, '');
}

makeRef = function() {
    return `<small><a href="#">#${messageCounter} </a></small>`;
};