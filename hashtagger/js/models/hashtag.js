define(['backbone'], function() {
    var Hashtag = Backbone.Model.extend({

        idAttribute: 'key',

        defaults: {
            count: 1,
        },

        sync: function() {
            return false;
        },

        numRel: function() {
            return this.get('rel').length;
        }

    });
    return Hashtag;
});
