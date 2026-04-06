define(['backbone'], function() {
    var Tweet = Backbone.Model.extend({

        url: 'https://twitter.com/share',

        sync: null,

        fetch: null,

        sendTweet: function() {
            window.open(this.url + '?text=' + encodeURIComponent(this.get('text')) + '&url=false', 'Tweet', 'location=0,menubar=0,scrollbars=0,titlebar=0,height=250,width=500,left=400,top=300');
        }
    });
    return Tweet;
});
