define([
  'backbone',
  'collections/keywords',
  'collections/tweets',
  'collections/hashtags',
  'models/tweet',
  'views/tweet',
  'views/hashtagpanel',
  'views/hashtag',
  'colorbox',
  ], function(Backbone, KeywordCollection, TweetCollection, HashtagCollection, Tweet, TweetView, HashtagPanelView, HashtagView){
  var Application = Backbone.View.extend({

    keywordCollection: new KeywordCollection(),
    tweetCollection: new TweetCollection(),
    hashtagCollection: new HashtagCollection(),

    keywordPath: '#keywords',
    hashtagPath: '#hashtags',
    hashtaggerPath: '#hashtagger',


    tweetBoxText: 'Hashtagger recommends hashtags for linked stories. Compose a Tweet here.',

    initialize: function() {
        this.setElement('#app');
        this.keywordList = $(this.el).find(this.keywordPath).first();
        this.hashtags = $(this.el).find(this.hashtagPath).first();
        this.hashtagger = $(this.el).find(this.hashtaggerPath).first();
        _.bindAll(this);
        $(document).bind('cbox_closed', this.updateCount);
        if (this.alchemyKey() === undefined){
            $('#alchemy-key-form').show();
        } else {
            $('#tweet-form').show();
        }
    },

    alchemyKey: function() {
        return sessionStorage.alchemyKey;
    },

    keywordView: Backbone.View.extend({
        tagName:  "li",
        render: function() {
          $(this.el).html(this.model.get('text') + ' (' + this.model.get('relevance') + ')');
          return this;
        },
    }),

    events: {
      "click #tweet": "tweet",
      "click #get-hashtags": "analyzeTweet",
      "click .add-hashtag": "addHashtag",
      "click .show-tweets": "showTweets",
      "focus #tweet-box": "updateCount",
      "blur #tweet-box": "setHelpText",
      "keyup #tweet-box": "updateCount",
      "click #alchemy-key-form > input": "clearAlchemyKeyInput",
      "click #alchemy-key-form > button": "updateAlchemyKey",
    },

    updateAlchemyKey: function() {
        var val = $.trim($('#alchemy-key-input').val());
        sessionStorage.alchemyKey = val;
        $('#alchemy-key-form').hide();
        $('#tweet-form').show();
    },

    clearAlchemyKeyInput: function() {
        var obj = $('#alchemy-key-input');
        if (obj.val() == 'Enter your Alchemy API key') {
            obj.val('');
        }
    },

    setHelpText: function() {
        var text = $('#tweet-box').val();
        if (text == '') {
            text = this.tweetBoxText;
            $('#tweet-box').val(text);
        }
    },

    updateCount: function() {
        var text = $('#tweet-box').val();
        if (text == this.tweetBoxText) {
            text = '';
            $('#tweet-box').val('');
        }
        var hasURL = false;
        var match = text.match(URL_REGEX);
        if (match) {
            text = text.replace(match, '');
            hasURL = true;
        }
        count = text.length;
        if (hasURL) count += 20;
        count = 140 - count;
        $('#charcount').html(count);
        if (count >= 0) {
            $('#charcount').css('color', '#ccc');
        } else {
            $('#charcount').css('color', 'red');
        }
    }, 

    addOneKeyword: function(keyword) {
      var view = new this.keywordView({
          model: keyword,
      });
      this.keywordList.append(view.render().el);
    },

    addAllKeywords: function() {
        this.keywordList.html('<h3>Keywords</h3><ul></ul>');
        this.keywordCollection.each(this.addOneKeyword);
    },

    addOneHashtag: function(hashtag) {
        var view = new HashtagView({
            model: hashtag,
        });
        var view2 = new HashtagPanelView({
            model: hashtag,
        });
        this.hashtags.append(view.render().el);
        this.hashtagger.append(view2.render().el);
    },

    addAllHashtags: function() {
        var view = this;
        var count = 0;
        view.hashtagCollection.each(function(item) {
            if (count < 20 || item.numRel() > 1) {
                view.addOneHashtag(item);
                count++;
            }
        });
    },

    search: function() {
        view = this;
        view.keywordCollection.reset(this.keywordCollection.first(6)).each(
            function(item) {
            view.tweetCollection.fetchQuery(item.get('text'));
        });
        $('#progress-bar').css('width', '80%');
        view.tweetCollection.done(function() {
            $('#progress-bar').css('width', '90%');
            view.hashtagCollection.extractHashtags(view.tweetCollection);
            view.addAllHashtags();
            view.hashtagCollection.each(function(item) {
                console.log(item.get('tag') + ' ' + item.get('count') +
                    ' ' + item.numRel());
            });
            $('#progress-bar').css('width', '100%');
            $('.progress').hide(1000);
        });
    },

    analyzeTweet: function(e) {
        if (this.alchemyKey() === undefined) {
            $('#alchemy-key-form').show();
            alert('Please enter your Alchemy API key');
            return false;
        }
        e.preventDefault();
        this.keywordCollection.reset();
        this.tweetCollection.reset();
        this.hashtagCollection.reset();
        $('#hashtagger').hide();
        $('#hashtagger').html('<div class="progress"><div id="progress-bar" class="bar" style="width: 0%;"></div></div>');
        var view = this;
        var text = $('#tweet-box').val();
        var url = text.match(URL_REGEX);
        if (url) {
            $('#hashtagger').show();
            $('.progress').show();
            $('#progress-bar').css('width', '10%');
            var keywords = view.keywordCollection.fetchFromURL(encodeURI(url), view.alchemyKey());
            keywords.done(function() {
                $('#progress-bar').css('width', '60%');
                view.addAllKeywords();
                view.search();
            });
        };
    },

    tweet: function(e) {
        var view = this;
        var tweet = new Tweet({
            text: view.$el.find('#tweet-box').val()
        });
        tweet.sendTweet();
    },

    addHashtag: function(e) {
        e.preventDefault();
        var hash = $(e.target);
        var obj = $(e.target).siblings('a').first();
        var tag = '#' + obj.html()
        var box = $('#tweet-box');
        var val = box.val();
        if (val.indexOf(tag) >= 0) {
            val = val.replace(tag, '');
            val = val.replace('  ', ' ');
            hash.css('color', '#aaa');
            obj.removeClass('label-success');
        } else {
            if (val.substr(-1) != ' ') {
                val += ' ';
            }
            val += tag;
            hash.css('color', '#42EB58');
            obj.addClass('label-success');
        }
        box.val(val);
        this.updateCount();
    },

    showTweets: function(e) {
      e.preventDefault();
      var a = $(e.target);
      this.hashtagSearch('#' + a.html());
    },

    hashtagSearch: function(tag) {
        $('#popup').html('');
        view = this;
        var col = this.tweetCollection;
        col.reset();
        col.fetchQuery(tag);
        col.done(function() {
          var html = '';
          col.each(function(item) {
              var view = new TweetView({
                  model: item,
              });
              html += $(view.render().el).html();
          });
          $.colorbox({ html: html });
          // bind click here since colorbox seems to screw with
          // backbone's standard binding
          $('.clickable-tag').click(view.addTag);
        }); 
    },

    addTag: function(e) {
        var tag = $(e.target);
        var box = $('#tweet-box');
        if (box.val().indexOf(tag.html()) >= 0) {
            var text = box.val().replace(tag.html(), '');
            var text = text.replace('  ', ' ');
            box.val(text);
            tag.css('color', '');
            $('.clickable-tag').each(function() {
                var t = $(this);
                if (t.html() == tag.html()) {
                    t.css('color', '');
                }
            });
        } else {
            box.val(box.val() + ' ' + tag.html());
            tag.css('color', '#42EB58');
            $('.clickable-tag').each(function() {
                var t = $(this);
                if (t.html() == tag.html()) {
                    t.css('color', '#42EB58');
                }
            });
        }
    }
  });
  return Application;
});
