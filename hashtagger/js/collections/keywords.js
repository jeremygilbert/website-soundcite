define([
    'backbone',
], function(Backbone) {

    var KeywordCollection = Backbone.Collection.extend({

        url: 'https://access.alchemyapi.com/calls/url/URLGetRankedKeywords',

        parse: function(resp, xhr) {
            if (resp.status == 'OK') {
                return resp.keywords;
            } else if (resp.status == 'ERROR') {
                alert('Alchemy API Error: ' + resp.statusInfo);
                if (resp.statusInfo == 'invalid-api-key') {
                    $('#alchemy-key-form').show();
                }
                return null;
            } else {
                alert('Unknown Alchemy API status: ' + resp.status + 
                    ':: ' + resp.statusInfo);
            }
        },

        fetchFromURL: function(url, apiKey) {
            return this.fetch({ data: {url:url, apikey:apiKey}});
        },

        sync: function(method, model, options) {
            if (method != 'read') { return false; } // GET requests only
            var url = encodeURI(options.data.url);
            options.data = {
                url: url,
                apikey: options.data.apikey,
                keywordExtractMode: 'normal',
                showSourceText: 1,
                outputMode: 'json',
            };
            options.error = function(jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            };
            options.dataType = 'jsonp';
            options.jsonp = 'jsonp'; // Alchemy's callback parameter
            return Backbone.sync(method, model, options);
        }

    });
    return KeywordCollection;
});
