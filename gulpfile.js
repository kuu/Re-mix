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
// CODE VALIDATOR
//------------------------------------------------

gulp.task('jsonlint', function () {
    gulp.src("./data/**/*.json")
        .pipe($.jsonlint())
        .pipe($.jsonlint.reporter());
});

gulp.task('jshint', function () {
    return gulp.src(['app/**/[!compiled]*.js', 'data/**/*.js'])
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('default'))
        .pipe($.size());
});

gulp.task('lint', [ 'jsonlint', 'jshint' ]);

//------------------------------------------------
// IMAGES
//------------------------------------------------

gulp.task('images', function () {
    return gulp.src('assets/images/**/*')
        //.pipe($.cache($.imagemin({
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('public/assets/images'))
        .pipe($.size());
});

//------------------------------------------------
// BUILD
//------------------------------------------------

gulp.task('clean', function () {
    return gulp.src(['public/*', '.tmp', 'app/templates/compiledTemplates.js'], { read: false }).pipe($.clean());
});

gulp.task('compile', function () {
    $.runSequence(['lint', 'handlebars', 'browserify']);
});

gulp.task('build', [ 'compile', 'stylus', 'images' ]);

gulp.task('debug', function () {
    $.runSequence('clean', 'build', 'runDebugNode');
});

gulp.task('default', function () {
    $.runSequence('clean', 'build', 'runNode');
});


//------------------------------------------------
// CREATE DATABASE
//------------------------------------------------

gulp.task('createDB', $.shell.task([
  'mongo mydb --eval "db.dropDatabase()"',
  'mongoimport --db mydb --collection users --type json --file data/user_data.json --jsonArray',
  'mongoimport --db mydb --collection projects --type json --file data/project_data.json --jsonArray',
  'mongoimport --db mydb --collection tracks --type json --file data/track_data.json --jsonArray'
]));

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

gulp.task('runDebugNode', $.shell.task([
  'node-debug index.js'
]));

//------------------------------------------------
// WATCH
//------------------------------------------------

gulp.task('watch', function () {
    gulp.watch('app/templates/**/*.hbs', [ 'handlebars' ]);
    gulp.watch(STYLESHEETS_DIR + '/index.styl', [ 'stylus' ]);
    gulp.watch('./app/**/*.js', [ 'browserify' ])
});
