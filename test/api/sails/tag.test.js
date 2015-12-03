var assert = require('chai').assert;
var _ = require('underscore');
var icalendar = require('icalendar');
var conf = require('./helpers/config');
var utils = require('./helpers/utils');
var request;

describe('tag:', function() {

  var publicProject, draftProject;
  var tags = [];

  before(function(done) {
    request = utils.init();
    utils.login(request, function(err) {
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

    it('add', function (done) {
      request.post({ url: conf.url + '/tagentity',
                     body: JSON.stringify(conf.tags[0])
                   }, function (err, response, body) {
        if (err) { return done(err); }
        assert.equal(response.statusCode, 200);
        var b = JSON.parse(body);
        // check that the values passed in are the same as those passed back
        assert.equal(conf.tags[0].name, b.name);
        assert.equal(conf.tags[0].type, b.type);
        // make sure the automatically populated fields get set
        assert(b.id);
        tags.push(b);
        done();
      });
    });

    it('create', function (done) {
      var tag = {
        projectId: publicProject.id,
        tagId: tags[0].id
      };
      request.put({ url: conf.url + '/project/' + tag.projectId,
                     body: JSON.stringify({ tags: [tag.tagId] })
                   }, function(err, response, body) {
        if (err) { return done(err); }
        assert.equal(response.statusCode, 200);
        var b = JSON.parse(body);
        // check that the values passed in are the same as those passed back
        assert.equal(tag.projectId, b.id);
        assert.equal(tag.tagId, b.tags[0].id);
        // make sure the automatically populated fields get set
        assert(b.id);
        done();
      });
    });

    it('findAllByProjectId', function (done) {
      request.get({ url: conf.url + '/project/' + publicProject.id },
        function (err, response, body) {
          if (err) { return done(err); }
          assert.equal(response.statusCode, 200);
          var b = JSON.parse(body);
          assert.equal(b.tags.length, 1);
          assert.equal(b.tags[0].type, tags[0].type);
          assert.equal(b.tags[0].name, tags[0].name);
          assert.equal(b.tags[0].id, tags[0].id);
          assert.equal(b.id, publicProject.id);
          done();
      });
    });

    it('destroy', function (done) {
      // Add new tag
      request.put({
        url: conf.url + '/project/' + draftProject.id,
        body: JSON.stringify({ tags: [conf.tags[1]] })
      }, function(err, response, body) {

        if (err) { return done(err); }
        assert.equal(response.statusCode, 200);
        var b = JSON.parse(body);
        // check that the values passed in are the same as those passed back
        assert.equal(conf.tags[1].name, b.tags[0].name);
        assert.equal(conf.tags[1].type, b.tags[0].type);
        // make sure the automatically populated fields get set
        assert(b.tags[0].id);
        assert.equal(draftProject.id, b.id);
        tags.push(b.tags[0]);

        // Try to destroy the tag
        request.put({
          url: conf.url + '/project/' + draftProject.id,
          body: JSON.stringify({ tags: [] })
        }, function(err, response, body) {
          assert.equal(response.statusCode, 200);
          var b = JSON.parse(body);
          assert.equal(b.id, draftProject.id);
          assert.equal(b.tags.length, 0);
          done();
        });
      });
    });

    it('location tag', function (done) {
      request.get({
        url: conf.url + '/location/suggest?q=Camden,%20NJ'
      }, function(err, response, body) {
        assert.equal(response.statusCode, 200);
        var b = JSON.parse(body);
        assert.isAbove(body.length, 0);
        var tag = {
              name: body[0].name,
              type: 'location',
              data: _.omit(body[0], 'name')
            };

        request.post({ url: conf.url + '/tagentity',
                       body: JSON.stringify(tag)
                     }, function (err, response, body) {
          if (err) { return done(err); }
          assert.equal(response.statusCode, 200);
          var b = JSON.parse(body);
          // check that the values passed in are the same as those passed back
          assert.equal(tag.name, b.name);
          assert.equal(tag.type, b.type);
          assert.deepEqual(tag.data, b.data);
          done();
        });

      });
    });


  });

  describe('logged out:', function () {

    before(function () {
      request = utils.init();
    });

    it('add denied', function (done) {
      request.post({ url: conf.url + '/tagentity',
                     body: JSON.stringify(conf.tags[0])
                   }, function (err, response, body) {
        if (err) { return done(err); }
        assert.equal(response.statusCode, 403);
        done();
      });
    });

    it('findAllByProjectId', function (done) {
      request.get({ url: conf.url + '/project/' + publicProject.id },
        function (err, response, body) {
          if (err) { return done(err); }
          assert.equal(response.statusCode, 200);
          var b = JSON.parse(body);
          assert.equal(b.tags.length, 1);
          assert.equal(b.tags[0].type, tags[0].type);
          assert.equal(b.tags[0].name, tags[0].name);
          assert.equal(b.tags[0].id, tags[0].id);
          assert.equal(b.id, publicProject.id);
          done();
      });
    });

    it('findAllByProjectId denied', function (done) {
      request.get({ url: conf.url + '/project/' + draftProject.id },
        function (err, response, body) {
          if (err) { return done(err); }
          assert.equal(response.statusCode, 403);
          done();
      });
    });

    it('autocomplete', function(done) {
      request.get({ url: conf.url + '/ac/tag?q=T' }, function(err, response, body) {
        if (err) { return done(err); }
        assert.equal(response.statusCode, 200);
        var b = JSON.parse(body);
        assert.equal(b[0].name, tags[0].name);
        assert.equal(b[0].type, tags[0].type);
        done();
      });
    });

  });

});
