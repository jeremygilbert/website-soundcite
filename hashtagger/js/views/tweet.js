define([
  'backbone',
  'tagify',
  ], function(Backbone) {
  var TweetView = Backbone.View.extend({
        tagName: "div",
        render: function() {
            $(this.el).html('<div class="tweet span6"><img class="profile-image" src="' + this.model.get('profile_image_url') + '"/><div class="tweet-content"><p><strong><span class="clickable-tag">@'+ this.model.get('from_user') + '</span></strong></p><p>' + tagify(this.model.get('text')) + '</p></div></div>'); 
            return this;
        },
  });
  return TweetView;
});
