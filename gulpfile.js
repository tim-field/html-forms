'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const cssmin = require('gulp-cssmin');
const browserify = require('browserify');
const streamify = require('gulp-streamify');
const sourcemaps = require('gulp-sourcemaps');
const wpPot = require('gulp-wp-pot');
const insert = require('gulp-insert');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const babel  = require('gulp-babel');
const es = require('event-stream');

gulp.task('default', ['css', 'js', 'minify-css', 'minify-js', 'pot']);

gulp.task('css', function () {
    let files = './assets/sass/[^_]*.scss';

    return gulp.src(files)
        // create .css file
        .pipe(sass())
        .pipe(rename({ extname: '.css' }))
        .pipe(gulp.dest('./assets/css'));
});

gulp.task('js', function() {
    let files = [
        './assets/browserify/public.js',
        './assets/browserify/admin.js',
    ];

    // map them to our stream function
    let tasks = files.map(function(entry) {
        let filename = entry.split('/').pop();
        return browserify({ entries: [entry] }).on('error', gutil.log)
            .bundle()
            .pipe(source(filename))
            .pipe(insert.wrap('(function () { var require = undefined; var module = undefined; var exports = undefined; var define = undefined;', '; })();'))
            .pipe(buffer())
            .pipe(babel({presets: ['es2015']}))
            .pipe(gulp.dest('./assets/js'));
    });

    // create a merged stream
    return  es.merge(tasks);
});

gulp.task('minify-js', ['js'], function() {
    return gulp.src(['./assets/js/**/*.js','!./assets/js/**/*.min.js'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(streamify(uglify())).on('error', gutil.log)
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./assets/js'));
});

gulp.task('minify-css', ['css'], function() {
    return gulp.src(["./assets/css/*.css", "!./assets/css/*.min.css"])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(cssmin({ sourceMap: true }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("./assets/css"));
});


gulp.task('pot', function () {
    const domain = 'html-forms';
    return gulp.src('src/**/**/*.php')
        .pipe(wpPot({ domain: domain}))
        .pipe(gulp.dest(`languages/${domain}.pot`));
});

gulp.task('watch', function () {
    gulp.watch('./assets/sass/**/*.scss', ['css']);
    gulp.watch('./assets/browserify/**/*.js', ['js']);
});
