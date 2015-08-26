
var _ = require('underscore');
var async = require('async');
var Backbone = require('backbone');
var utils = require('../../../mixins/utilities');
var BaseController = require('../../../base/base_controller');
var AdminMainView = require('../views/admin_main_view');


Admin = {};

Admin.ShowController = BaseController.extend({

  events: {
  },

  // Initialize the admin view
  initialize: function (options) {
    this.options = options;
    this.adminMainView = new AdminMainView({
      action: options.action,
      el: this.el
    }).render();
  },

  // Cleanup controller and views
  cleanup: function() {
    this.adminMainView.cleanup();
    removeView(this);
  }

});

module.exports = Admin.ShowController;
