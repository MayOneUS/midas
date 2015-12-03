module.exports = {

  cssmin: {
    minify: {
      expand: true,
      cwd: 'assets/build/css/',
      src: ['*.css', '!*.min.css'],
      dest: 'assets/build/css/',
      ext: '.min.css',
      extDot: 'last',
      options: {
        report: 'min',
        sourceMap: process.env.NODE_ENV !== 'production'
      }
    }
  },


};
