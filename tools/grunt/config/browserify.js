module.exports = {
  browserify: {
    prod: {
      src: 'assets/js/backbone/app.js',
      dest: 'assets/build/js/bundle.min.js',
      options: {
        browserifyOptions: { debug: false },
        transform: ['stringify', ['uglifyify', { global: true }]],
        require: ['./assets/js/vendor/jquery-shim.js:jquery'],
      }
    },
    dev: {
      src: 'assets/js/backbone/app.js',
      dest: 'assets/build/js/bundle.js',
      options: {
        browserifyOptions: { debug: true },
        transform: ['stringify'],
        require: ['./assets/js/vendor/jquery-shim.js:jquery'],
      }
    }
  },
};
