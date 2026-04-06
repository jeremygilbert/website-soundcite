require.config({
  paths: {
    jquery: 'lib/jquery/jquery.min',
    underscore: 'lib/underscore/underscore-min',
    backbone: 'lib/backbone/backbone-min',
    domReady: 'lib/domReady/domReady',
    modelbinding: 'lib/modelbinding/backbone.modelbinding.min',
    colorbox: 'lib/colorbox/jquery.colorbox-min',
    tagify: 'tagify',
    queryform: 'lib/query-formation/queryform',
  },
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'collections/keywords': {
      deps: ['backbone'],
      exports: 'KeywordCollection'
    },
    'colorbox': {
      deps: ['jquery'],
      exports: 'colorbox'
    }
  }
});

var KEY_CODES = {
    'ESC':   27,
    'ENTER': 13,
    'TAB': 9,
}

require(['views/app'], function(Application){
  var app = new Application;
});
