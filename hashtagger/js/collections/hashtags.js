define([
    'backbone',
    'models/hashtag',
    'assert',
], function(Backbone, Hashtag) {

    var HashtagCollection = Backbone.Collection.extend({

        model: Hashtag,

        comparator: function(hashtag1, hashtag2) {
            // order by reverse count but prefer > 1 rel query
            var c1 = hashtag1.get('count');
            var c2 = hashtag2.get('count');
            var r1 = hashtag1.get('rel').length;
            var r2 = hashtag2.get('rel').length;
            if ( (r1 == 1 && r2 != 1) || (r1 != 1 && r2 == 1) ) {
                if (r1 == 1) { return 1; }
                else { return -1; }
            }
            if (c1 == c2 ) {
                if (r1 == r2) { return 0; }
                else if (r1 > r2) { return -1; }
                else { return 1; }
            } else if (c1 > c2) {
                return -1;
            } else if (c1 < c2 ) {
                return 1;
            }
            assert(false, 'Unhandled sort condition');
        },

        addTag: function(tag, query) {
            if (tag == '' || tag === undefined) { return; }
            var key = tag.toLowerCase(); 
            var hashtag = this.get(tag);
            if (hashtag === undefined) {
                this.create({
                    key: key,
                    tag: tag,
                    rel: [query]
                });
            } else {
                var rel = hashtag.get('rel'); 
                if (rel.indexOf(query) < 0) {
                    rel.push(query);
                }
                hashtag.set({ count: hashtag.get('count') + 1,
                    rel: rel });
            }
        },

        extractHashtags: function(tweets) {
            var collection = this;
            tweets.each(function(tweet) {
                tweet = tweet.toJSON();
                if (tweet.entities !== undefined) {
                    $(tweet.entities.hashtags).each(function() {
                        var tag = this.text;
                        collection.addTag(tag, tweet.query);
                    });
                };
            });
            collection.sort();
        }
    });
    return HashtagCollection;
});
