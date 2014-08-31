'use strict';

var gulp = require('gulp');
var glob = require('glob');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

// load plugins
var $ = require('gulp-load-plugins')();

var STYLESHEETS_DIR = './assets/stylesheets';

// error handling
var handleError = function (err) {
    $.util.log(err.toString());
    this.emit('end');
};

var plumber = function () {
    return $.plumber({ errorHandler : handleError });
};

//------------------------------------------------
// HANDLEBARS
//------------------------------------------------
gulp.task('handlebars', function () {

    return gulp.src('./app/templates/**/[!__]*.hbs')
        .pipe(plumber())
        .pipe($.handlebars({ wrapped : true }))
        .pipe($.wrap('templates["<%= file.relative.replace(/\\\\/g, "/").replace(/.js$/, "") %>"] = Handlebars.template(<%= file.contents %>);\n'))
        .pipe($.concat('compiledTemplates.js'))
        .pipe($.wrap('module.exports = function(Handlebars){\ntemplates = {};\n<%= contents %>\nreturn templates \n};'))
        .pipe(gulp.dest('app/templates/'));
});

//------------------------------------------------
// STYLUS
//------------------------------------------------

gulp.task('stylus', function () {

    var opts = { set : [ 'include css' ] };

    return gulp.src(STYLESHEETS_DIR + '/index.styl')
        .pipe(plumber())
        .pipe($.stylus(opts))
        .pipe($.concat('styles.css'))
        .pipe(gulp.dest('./public'));
});

//------------------------------------------------
// BROWSERIFY
//------------------------------------------------

// get rendr shared & client files list
var rendrClientFiles = glob.sync('rendr/{client,shared}/**/*.js', { cwd : './node_modules/' });

var rendrModules = rendrClientFiles.map(function (file) {
    return file.replace('.js', '')
});

var getBundler = function (globs) {

    var bundler, files, moduleName;

    bundler = browserify({
        fullPaths : false,
        entries   : []
    });

    globs.forEach(function (pattern) {
        files = glob.sync(pattern, { cwd : './' });
        files.forEach(function (file) {
            // it's nesessary for some app modules (e.g. 'app/app')
            // to be exposed otherwise rendr couldn't require them
            moduleName = file.replace(/.js$/, '')
            bundler.require('./' + file, { expose: moduleName});
        });
    });

    rendrModules.forEach(function (moduleName) {
        bundler.require(moduleName);
    });

    bundler.require('rendr-handlebars');
    bundler.require('./assets/vendor/jquery-1.9.1.min.js', { expose : 'jquery' });

    return bundler;
};

gulp.task('browserify', [ 'handlebars' ], function () {

    var bundler = getBundler([ 'app/**/*.js' ]),
        options = { insertGlobals : false, debug : true };

    return bundler.bundle(options)
        .on('error', handleError)
        .pipe(plumber())
        .pipe(source('mergedAssets.js'))
        .pipe(gulp.dest('./public'));
});

//------------------------------------------------
// BUILD
//------------------------------------------------

gulp.task('clean', function () {
    return gulp.src(['public/*', 'app/templates/compiledTemplates.js'], { read: false }).pipe($.clean());
});

gulp.task('build', [ 'handlebars', 'browserify',   'stylus' ]);

gulp.task('default', [ 'clean', 'build', 'runNode' ]);

//------------------------------------------------
// RUN
//------------------------------------------------

gulp.task('runNode', function () {
    $.nodemon({
        script : 'index.js',
        ext    : 'js',
        ignore : [ 'public/', 'gulpfile.js' ]
    });
});

//------------------------------------------------
// WATCH
//------------------------------------------------

gulp.task('watch', function () {
    gulp.watch('app/templates/**/*.hbs', [ 'handlebars' ]);
    gulp.watch(STYLESHEETS_DIR + '/index.styl', [ 'stylus' ]);
    gulp.watch('./app/**/*.js', [ 'browserify' ])
});
