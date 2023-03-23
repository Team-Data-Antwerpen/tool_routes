module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
	bower_concat: {
	  all: {
		dest: {
		  'js': 'js/_bower.js',
		  'css': 'css/_bower.css'
		},
		exclude: [
		],
		dependencies: {

		}
	  }
	}
	
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-bower-concat');

  // Default task(s).
  grunt.registerTask('default', ['bower_concat']);

}