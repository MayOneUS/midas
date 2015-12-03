var _ = require( 'lodash' );

module.exports = {

  sass: {

    options: {

      style: 'expanded',
      sourcemaps: true,

      // Paths to use with `@import` within Sass source files
      // README: Be mindful of path name collisions as everything in Sass shares
      // the same namespace.
      // --------------------------------------------------------------------
      includePaths: _.flatten( [
        require( 'bourbon' ).includePaths,
        'assets/styles',
        'assets/styles/vendor',
        'node_modules',
      ] ),

    },

    app: {

      options: {

        style: 'compressed',

      },

      files: {
        'assets/build/css/midas.css': [
          'assets/styles/application.scss',
          'assets/styles/vendor.scss',
        ],
      },

    },

  },

};
