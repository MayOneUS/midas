var assert = require('chai').assert;
var conf = require('../../api/sails/helpers/config');

describe('BadgeModel', function() {
  var user;

  before(function(done){
    User.create(conf.defaultUser).exec(function createCB(err, newUser){
      user = newUser;
      done(err);
    });
  })

  describe('#awardForTaskCompletion()', function() {
    var task;

    before(function(done) {
      task = { id:1 };
      done();
    });

    describe('no tasks', function() {
      it('should not award a badge', function (done) {
        Badge.awardForTaskCompletion(task, user, function(err, badges) {
          assert.equal(badges.length, 0, 'badge should not be created');
          done();
        });
      });
    });

    describe('1 task', function() {
      it('should award a badge', function (done) {
        user.completedTasks = 1;
        user.save(function(err, user) {
          if (err) done(err);
          Badge.awardForTaskCompletion(task, user, function(err, badges) {
            assert.equal(badges.length, 1, 'badge should be created');
            done();
          });
        });
      });
    });

    describe('2 tasks', function() {
      it('should not award a new badge', function (done) {
        user.completedTasks = 2;
        user.save(function(err, user) {
          if (err) done(err);
          Badge.awardForTaskCompletion(task, user, function(err, badges) {
            // this badge array contains NEWLY awarded badges
            assert.equal(badges.length, 0, 'badge should not be created');
            done();
          });
        });
      });
    });

  });

  describe('#awardForTaskPublish()', function() {
    var tasks,
        tags = {
          oneTime: {
            name: 'One time',
            type: 'task-time-required'
          },
          ongoing: {
            name: 'Ongoing',
            type: 'task-time-required'
          }
        };

    describe('first one time task', function(){
      it('should award a badge', function (done) {
        var tasks = [
          {
            id: 1,
            title: 'Fake one time task',
            tags: [tags.oneTime]
          }
        ];
        Badge.awardForTaskPublish(tasks, user.id, function(err, badges) {
          // this badge array contains NEWLY awarded badges
          assert.equal(badges.length, 1, 'badge should be created');
          done();
        });

      });
    });

    describe('second one time task', function(){
      it('should not award a badge', function (done) {
        var tasks = [
          {
            id: 2,
            title: 'Second fake one time task',
            tags: [tags.oneTime]
          }
        ];
        Badge.awardForTaskPublish(tasks, user.id, function(err, badges) {
          assert.equal(badges.length, 0, 'badge should not be created');
          done();
        });

      });
    });

    describe('first ongoing task', function(){
      it('should award a badge', function (done) {
        var tasks = [
          {
            id: 1,
            title: 'Fake ongoing task',
            tags: [tags.ongoing]
          }
        ];
        Badge.awardForTaskPublish(tasks, user.id, function(err, badges) {
          // this badge array contains NEWLY awarded badges
          assert.equal(badges.length, 1, 'badge should be created');
          done();
        });

      });
    });

    describe('second ongoing task', function(){
      it('should not award a badge', function (done) {
        var tasks = [
          {
            id: 2,
            title: 'Second fake one time task',
            tags: [tags.ongoing]
          }
        ];
        Badge.awardForTaskPublish(tasks, user.id, function(err, badges) {
          assert.equal(badges.length, 0, 'badge should not be created');
          done();
        });

      });
    });

  });

});
