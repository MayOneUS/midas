var _ = require('underscore');
var Backbone = require('backbone');
var async = require('async');
var UIConfig = require('../../../config/ui.json');

var ActivityCollection = window.c = require('../../../entities/activities/activities_collection');
var TaskCollection = require('../../../entities/tasks/tasks_collection');

var DashboardTemplate = require('../templates/home_dashboard_template.html');
var BadgesTemplate = require('../templates/home_badges_feed_template.html');
var UsersTemplate = require('../templates/home_users_feed_template.html');
var NetworkTemplate = require('../templates/home_network_stats_template.html');

var templates = {
  main: _.template(DashboardTemplate),
  badges: _.template(BadgesTemplate),
  users: _.template(UsersTemplate),
  network: _.template(NetworkTemplate)
};

var DashboardView = Backbone.View.extend({
  el: "#container",
  initialize: function (options) {
    this.options = options;

    return this;
  },

  render: function () {
    var self            = this,
        badges          = new ActivityCollection({ type: 'badges' }),
        users           = new ActivityCollection({ type: 'users' }),
        tasks           = new TaskCollection();

    this.$el.html(templates.main());

    /*
     * Listen for badges. This callback function uses Backbone's trigger method
     * to retrieve the badges information whenever the ActivityCollection is
     * fetched successfully.
     * @param ActivityCollection | An activity collection.
     * @param String             | A Backbone event string to bind to..
     * @param Function           | A callback function containing the event data.
     * @see   /assets/js/backbone/entities/activities/activities_collection.js
     */
    this.listenTo( badges, 'activity:collection:fetch:success', function ( e ) {

      var bs = e.toJSON().filter( function( b ) {
        return b.participants.length > 0;
      } );

      var badgesHtml = templates.badges( { badges: bs } );

      self.setTarget( 'badges-feed', badgesHtml );

    } );

    this.listenTo(users, 'activity:collection:fetch:success', function (e) {
      var data = { users: e.toJSON() },
          usersHtml = templates.users(data);
      self.setTarget('users-feed', usersHtml);
    });

    $.ajax({
      url: '/api/activity/count',
      data: { where: { state: 'completed' }},
      success: function (d) {
        var html = templates.network({ count: d });
        self.setTarget('network-stats', html);
      },
      error: function (err) {
        console.log('err with /api/activity/count\n', err);
      }
    });

    $.ajax({
      url: '/api/activity/count',
      data: { where: { state: 'open' }},
      success: function (d) {
        self.$('#opportunity-count span')
            .addClass('loaded')
            .text(d);
      },
      error: function (err) {
        console.log('err with /api/activity/count\n', err);
      }
    });

    this.$el.i18n();
    return this;
  },
  setTarget: function (target, inner) {
    var s = '[data-target=' + target + ']';
    $(s).html(inner);
  },
  cleanup: function () {
    this.$el.removeClass('home');
    removeView(this);
  },
});

module.exports = DashboardView;
