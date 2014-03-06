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
      "app/styles/style.css",
      "app/scripts/main.js",
      "app/scripts/templates.js"
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
      jst: {
        files: ['app/templates/**/*.html'],
        tasks: ['jst']
      },
      compass: {
        files: ['app/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:dev'],
      },
      neuter: {
        files: ['app/scripts/{,*/}*.js', '!app/scripts/{main,templates}.js'],
        tasks: ['neuter']
      },
      livereload: {
        options: {
          livereload: 35729
        },
        files: [
          'app/{,*/}*.html',
          'app/styles/{,*/}*.css',
          'app/scripts/main.js',
          'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          // 'app/templates/{,*/}*.html'
        ]
      }
    },
    neuter: {
      application: {
        src: 'app/scripts/app.js',
        dest: 'app/scripts/main.js',
      }
    },
    jst: {
      compile: {
        options: {
          prettify: true,
          processName: function(filepath) {
            return filepath.slice("app/templates/".length, -".html".length);
          }
        },
        files: {
          "app/scripts/templates.js": ["app/templates/**/*.html"]
        }
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', [
    'clean',
    'compass:dev',
    'jst',
    'neuter',
    'connect:server',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'compass:dist',
    'jst',
    'neuter'
  ]);
};