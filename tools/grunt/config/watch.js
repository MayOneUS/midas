module.exports = {

  watch: {

    js: {

      files: [

        'assets/js/**/*.js',

      ],

      tasks: [ 'jsonlint', 'browserify:dev', 'copy:prod' ],

    },

    styles: {

      files: [

        'assets/styles/**/*.scss',

      ],

      tasks: [

        'sass',
        'copy:csssourcemaps',
        'cssmin',
        'copy:csssupport',
        'copy:prod'

      ],

    },

    font: {

      files: [
        'assets/fonts/**/*.eot',
        'assets/fonts/**/*.svg',
        'assets/fonts/**/*.ttf',
        'assets/fonts/**/*.woff',
      ],

      tasks: [ 'copy:font' ],

    }

  },

};
