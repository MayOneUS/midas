/**
 * Volunteer
 *
 * @module      :: Model
 * @description :: Stores volunteer information for tasks
 *
 */
module.exports = {

  attributes: {

    // The task which a user volunteers for
    taskId: 'INTEGER',
    // the user that is volunteering
    userId: 'INTEGER',
    // send notification or not, after create
    silent: 'BOOLEAN'

  },

  // create notification after creating a volunteer
  afterCreate: function(model, done) {
    this.assignVolunteerCountBadges(model);

    if (model.silent === true) return done();

    Notification.create({
      action: 'volunteer.create.thanks',
      model: model
    }, done);
  },

  afterDestroy: function(model, done) {
    Notification.create({
      action: 'volunteer.destroy.decline',
      // Sails returns an array of deleted models,
      // but we're only deleting them one at a time
      model: model[0]
    }, done);
  },

  assignVolunteerCountBadges: function (model) {

    Volunteer.find({ taskId: model.taskId }).exec(function(err, vols) {
      if (err) return;

      Task.findOne({ id: model.taskId }).exec(function(err, task) {
        var badge = {
          user: task.userId,
          type: 'team builder',
          task: model.taskId
        };
        if (err) return;
        if (vols.length === 4) {
          Badge.findOrCreate(badge, badge).exec(function(err, b){
            if (err) return console.error(err);
          });
        }
      });
    });

  }
};
