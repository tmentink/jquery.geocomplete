// ------------------------------------------------------------------------
// Gruntfile
// ------------------------------------------------------------------------

module.exports = function(grunt) {
  "use strict"

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    version: "<%= pkg.version %>",
    banner: "/*!\n" +
                " * <%= pkg.name %> v<%= version %> (<%= pkg.homepage %>)\n" +
                " * Copyright <%= grunt.template.today('yyyy') %> <%= pkg.author %>\n" +
                " * Licensed under <%= pkg.license %>\n" +
                " */\n",
    dependencyCheck: "if (typeof jQuery === 'undefined' && typeof $ === 'undefined'){\n" +
                     "throw new Error('jQuery is required.')}\n" +
                     "if (typeof google === 'undefined' || typeof google.maps === 'undefined' || typeof google.maps.places === 'undefined') {\n" +
                     "throw new Error('Google Maps JavaScript API v3 with Places libary is required.')};",


    // --------------------------------------------------------------------
    // Grunt Tasks
    // --------------------------------------------------------------------

    babel: {
      js: {
        files: {
          "<%= concat.geocomplete.dest %>" : "<%= concat.geocomplete.dest %>"
        }
      }
    },
    clean: {
      js: ["<%= concat.geocomplete.dest %>"]
    },
    concat: {
      geocomplete: {
        src: ["src/js/**/*.js"],
        dest: "src/js/main.js"
      }
    },
    eslint: {
      target: ["src/js/**/*.js"]
    },
    sass: {
      expanded: {
        options: {
          outputStyle: "expanded"
        },
        files: {
          "dist/<%= pkg.name %>.css" : "src/scss/master.scss"
        }
      },
      compressed: {
        options: {
          outputStyle: "compressed"
        },
        files: {
          "dist/<%= pkg.name %>.min.css" : "src/scss/master.scss"
        }
      }
    },
    stamp: {
      banner: {
        options: {
          banner: "<%= banner %>"
        },
        files: {
          src: "dist/*"
        }
      },
      dependency: {
        options: {
          banner: "<%= dependencyCheck %>"
        },
        files: {
          src: "<%= concat.geocomplete.dest %>"
        }
      },
    },
    uglify: {
      dev: {
        options: {
          beautify: true,
          compress: false,
          mangle: false,
          output: {
            indent_level: 2,
            comments: /\*/
          }
        },
        src: "<%= concat.geocomplete.dest %>",
        dest: "dist/<%= pkg.name %>.js",
      },
      dist: {
        src: "<%= concat.geocomplete.dest %>",
        dest: "dist/<%= pkg.name %>.min.js",
      }
    },
    watch: {
      js: {
        files: ["src/js/**/*.js"],
        tasks: ["concat", "stamp:dependency", "babel", "uglify:dev", "clean"]
      }
    }
  })

  require("load-grunt-tasks")(grunt)
  require("time-grunt")(grunt)

  grunt.registerTask("css", ["sass", "stamp:banner"])
  grunt.registerTask("default", ["sass", "eslint", "concat", "stamp:dependency", "babel", "uglify", "stamp:banner", "clean"])
  grunt.registerTask("lint", ["eslint"])
}
