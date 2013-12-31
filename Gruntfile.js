module.exports = function(grunt) {
	// show elapsed time at the end
	// require('time-grunt')(grunt);
	// load all grunt tasks
	require('load-grunt-tasks')(grunt);
	// Project configuration.
	grunt.initConfig({
		compass: {                  
			dist: {                   
				options: {              
					sassDir: 'app/styles',
					cssDir: 'app/styles',
					imagesDir: 'app/images',
					importPath: 'app/bower_components',
					environment: 'production'
				}
			},
			dev: {                    
				options: {
					sassDir: 'app/styles',
					cssDir: 'app/styles',
					importPath: 'app/bower_components',
					imagesDir: 'app/images'
				}
			}
		},
		clean: [
			"app/styles/style.css"
		],
		connect: {
			options: {
				port: 9000,
				hostname: "localhost",
				livereload: 35729
			},
			server: {
				options: {
					base: ['app']
				}
			}
		},
		watch: {
			gruntfile: {
				files: ['Gruntfile.js'],
				options: {
	        livereload: true
	      }
			},
			compass: {
				files: ['app/styles/{,*/}*.{scss,sass}'],
				tasks: ['compass:dev'],
			},
			livereload: {
        options: {
          livereload: 35729
        },
        files: [
          'app/{,*/}*.html',
          'app/styles/{,*/}*.css',
          'app/scripts/{,*/}*.js',
          'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
		}
	});

	// Default task(s).
	grunt.registerTask('default', [
		'clean',
		'compass:dev',
		'connect:server',
		'watch'
	]);

	grunt.registerTask('build', [
		'clean',
		'compass:dist'
	]);
};