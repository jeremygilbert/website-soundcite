define([
  'backbone',
  ], function(Backbone){
  var HashtagPanelView = Backbone.View.extend({
        tagName:  "div",
        render: function() {
          $(this.el).html('<div class="hashtag" style="float:left;"><a class="add-hashtag" href="" style="color:#aaa;" title="Add/Remove Hashtag">#</a><a class="show-tweets label" href="" title="See hashtag usage">' +  this.model.get('tag') + '</a></div>');
          return this;
        },
  });
  return HashtagPanelView;
});
