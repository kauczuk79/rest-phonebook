/*jshint node: true, camelcase: false*/
/*global require: true*/
(function () {
    'use strict';

    var gulp = require('gulp'),
        gulpProtractorAngular = require('gulp-angular-protractor'),
        server = require('gulp-develop-server'),
        karma = require('gulp-karma'),
        runSequence = require('run-sequence'),
        shell = require('gulp-shell'),
        fs = require('fs');

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

    gulp.task('start-mongo', shell.task('mongod'));
    gulp.task('stop-mongo', shell.task('mongo admin --eval "db.shutdownServer();"'));

    gulp.task('start-server', function (callback) {
        server.listen({
            path: './index.js',
            killSignal: 'SIGTERM'
        });
    });

    gulp.task('stop-server', function (callback) {

        gulp.watch(['./index.js'], server.restart);
    });

    //Setting up the test task to run sequence of tests
    gulp.task('test', function (callback) {
        runSequence('karma', ['start-mongo', 'start-server', 'protractor'], 'stop-mongo', callback);
    });
}());