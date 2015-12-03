var assert = require('chai').assert;
var _ = require('underscore');
var conf = require('./helpers/config');
var utils = require('./helpers/utils');
var request;

describe('project:', function() {

  var publicProject, draftProject;

  // check that the values returned are correct for a project
  function assertProject(testData, realData) {
    assert.equal(testData.title, realData.title);
    assert.equal(testData.description, realData.description);
    assert.equal(testData.userId, realData.userId);
    assert.equal(testData.id, realData.id);
    assert.equal(testData.state, realData.state);
  }


  before(function(done) {
    request = utils.init();
    utils.login(request, function(err) {
      if (err) { return done(err); }
      utils.createProject(request, true, function(err, proj) {
        if (err) { return done(err); }
        publicProject = proj;
        utils.createProject(request, false, function(err, proj) {
          draftProject = proj;
          done(err);
        });
      });
    });
  });

  describe('logged in:', function () {

    before(function (done) {
      request = utils.init();
      utils.login(request, function (err) {
        done(err);
      });
    });


    it('view draft project', function (done) {
      request.get({ url: conf.url + '/project/' + draftProject.id },
                  function (err, response, body) {
        if (err) { return done(err); }
        assert.equal(response.statusCode, 200);
        var b = JSON.parse(body);
        // check that the values returned are correct
        assertProject(b, draftProject)
        assert.equal(b.like, false);
        done();
      });
    });

    it('view public project', function (done) {
      request.get({ url: conf.url + '/project/' + publicProject.id },
                  function (err, response, body) {
        if (err) { return done(err); }
        assert.equal(response.statusCode, 200);
        var b = JSON.parse(body);
        // check that the values returned are correct
        assertProject(b, publicProject)
        assert.equal(b.like, false);
        done();
      });
    });

    it('add empty project owner fails', function (done) {
      request.post({ url: conf.url + '/projectowner',
          form: { projectId: publicProject.id },
        }, function (err, response, body) {
          assert.equal(response.statusCode, 400);
          done();
      });
    });

    it('add project owner', function (done) {
      request.post({ url: conf.url + '/projectowner',
          form: { projectId: publicProject.id, userId: 2 },
        }, function (err, response, body) {
          assert.equal(response.statusCode, 200);
          var b = JSON.parse(body);
          assert.equal(b.projectId, publicProject.id);
          assert.equal(b.userId, 2);
          done();
      });
    });

  });

  describe('logged out:', function () {

    before(function () {
      request = utils.init();
    });

    it('view draft project', function (done) {
      request.get({ url: conf.url + '/project/' + draftProject.id },
                  function (err, response, body) {
        if (err) { return done(err); }
        assert.equal(response.statusCode, 403);
        done();
      });
    });

    it('view public project', function (done) {
      request.get({ url: conf.url + '/project/' + publicProject.id },
                  function (err, response, body) {
        if (err) { return done(err); }
        assert.equal(response.statusCode, 200);
        var b = JSON.parse(body);
        // check that the values returned are correct
        assertProject(b, publicProject)
        assert.equal(b.like, false);
        done();
      });
    });
  });
});
