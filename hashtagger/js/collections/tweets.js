define([
  'underscore', 
  'backbone',
  ], function(_, Backbone){

    var TweetCollection = Backbone.Collection.extend({

    url: function() {
       return 'http://search.twitter.com/search.json'
    },

    activeSearches: new Array(),
    activeSearchCount: 0,
    timeoutChecks: 0,

    parse: function(resp, xhr) {
        if (!resp) {
            return [];
        }
        var q = resp.query;
        var r = [];
        $(resp.results).each(function() {
            this.query = q;
            r.push(this);
        });
        return r;
    },

    done: function(callback) {
        var col = this;
        var searches = col.activeSearchCount;
        col.timeoutChecks++;
        if (searches <= 0 || col.timeoutChecks > 5) {
            col.activeSearchCount = 0;
            col.timeoutChecks = 0;
            callback();
        } else {
            setTimeout(function(){col.done(callback)}, 500);
        }
    },

    fetchQuery: function(query) {
        var col = this;
        if (query.indexOf(' ') >= 0) {
            query = '"' + query + '"';
        }
        col.activeSearches.push(query);
        col.activeSearchCount++;
        $.ajax({
            url: this.url(),
            data: {
                q: query,
                rpp: 100,
                include_entities: true,
                result_type: 'mixed',
                lang: 'en'
            },
            dataType: 'jsonp',
            success: function(data) {
                var r = col.parse(data); 
                col.add(r);
                col.activeSearchCount--;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('error: ' + errorThrown);
                col.activeSearchCount--;
            }
        });
        return col;
    },

    sync: null, /* using jQuery ajax directly */

    fetch: null,

  });
  return TweetCollection;
})
