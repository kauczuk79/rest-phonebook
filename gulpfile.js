/*jshint node: true, camelcase: false*/
/*global require: true*/
(function () {
    'use strict';

    var gulp = require('gulp'),
        karma = require('gulp-karma'),
        runSequence = require('run-sequence'),
        gulpProtractorAngular = require('gulp-angular-protractor');

    // Setting up the protractor task 
    gulp.task('protractor', function (callback) {
        gulp.src([]).pipe(gulpProtractorAngular({
            'configFile': 'tests/protractor.conf.js',
            'debug': false,
            'autoStartStopServer': true
        })).on('error', function (e) {
            throw (e);
        }).on('end', callback);
    });

    //Setting up the karma task
    gulp.task('karma', function (callback) {
        gulp.src([]).pipe(karma({
            configFile: 'tests/karma.conf.js',
            action: 'run'
        })).on('error', function (e) {
            throw (e);
        }).on('end', callback);
    });

    //Setting up the test task to run sequence of tests
    gulp.task('test', function (callback) {
        runSequence('karma', 'protractor', callback);
    });
}());