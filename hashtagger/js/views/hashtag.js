define([
  'backbone',
  ], function(Backbone){
  var HashtagView = Backbone.View.extend({
        tagName:  "p",
        render: function() {
          $(this.el).html('<p>' + this.model.get('tag') + '</p>');
          return this;
        },
  });
  return HashtagView;
});
