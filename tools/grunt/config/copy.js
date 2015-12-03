module.exports = {
  copy: {
    prod: {
      files: [
      {
        expand: true,
        cwd: './assets',
        src: ['build/**/*', 'js/vendor/**/*', 'images/**/*', 'locales/**/*', 'data/**/*', 'uploads/**/*'],
        dest: '.tmp/public'
      }
      ]
    },
    font: {
      files: [
      {
        expand: true,
        flatten: true,
        cwd: './assets',
        src: ['styles/vendor/font-awesome/fonts/*'],
        dest: 'assets/build/fonts'
      },
      {
        expand: true,
        flatten: true,
        cwd: './assets',
        src: ['styles/vendor/font-custom/fonts/*'],
        dest: 'assets/build/fonts'
      },
      {
        expand: true,
        flatten: true,
        cwd: './assets',
        src: ['fonts/*'],
        dest: 'assets/build/fonts'
      }
      ]
    },
    csssupport: {
      files: [
        {
          expand: true,
          flatten: true,
          cwd: './',
          src: ['node_modules/Select2/*.png', 'node_modules/Select2/*.gif'],
          dest: 'assets/build/css'
        }
      ]
    },
    csssourcemaps: {
      files: [
        {
          expand: true,
          flatten: true,
          cwd: './assets/styles/vendor',
          src: '*.css.map',
          dest: 'assets/build/css',
        },
      ],
    },
  },
};
