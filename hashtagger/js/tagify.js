//var URL_REGEX = new RegExp(/([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=,]*)?)/gi);
//var URL_REGEX = new RegExp(/([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=,]*[-a-zA-Z0-9@:%_\+~#&//=]+)?)/gi);
//var URL_REGEX = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi
var URL_REGEX = new RegExp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:.;,]*[-A-Z0-9+&@#\/%=~_|]+)/ig);
var USER_REGEX = new RegExp(/(@\w+)/g);

var HASHTAG_REGEX = new RegExp(/(\#\w+)/g);

var tagify = function(text) {
    text = text.replace(URL_REGEX, '<a target="_blank" href="$1">$1</a>')
    text = text.replace(USER_REGEX, '<span class="clickable-tag">$1</span>');
    text = text.replace(HASHTAG_REGEX, '<span class="clickable-tag">$1</span>');
    return text;
}
