module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({
    uglify: {
      options: {
        mangle: true
      },
      my_target: {
        files: {
          'build/mingraphing.min.js': ['src/mingraphing.js']
        }
      }
    }
  });

  grunt.registerTask('default', ['uglify']);
};
