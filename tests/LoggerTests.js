/*global describe, beforeEach, module, inject, spyOn, it, expect*/
describe('Logger\'s', function () {
    'use strict';
    var Logger,
        $log;

    beforeEach(module('app.logger'));

    beforeEach(inject(function ($injector) {
        // Get instance of dependencies from $provide
        Logger = $injector.get('Logger');
        $log = $injector.get('$log');
        // Watch on methods in $log used in Logger
        spyOn($log, 'debug');
        spyOn($log, 'info');
        spyOn($log, 'warn');
        spyOn($log, 'error');
    }));

    it('debug log level should print all logs', function () {
        // Set Logger level to DEBUG
        Logger.setLogLevel(Logger.DEBUG);
        // Call each log function in Logger
        Logger.debug('');
        Logger.info('');
        Logger.warn('');
        Logger.error('');
        // Each log function from $log should be called
        expect($log.debug).toHaveBeenCalled();
        expect($log.info).toHaveBeenCalled();
        expect($log.warn).toHaveBeenCalled();
        expect($log.error).toHaveBeenCalled();
    });

    it('info log level should print info, warn and error logs', function () {
        // Set Logger level to INFO
        Logger.setLogLevel(Logger.INFO);
        // Call each log function in Logger
        Logger.debug('');
        Logger.info('');
        Logger.warn('');
        Logger.error('');
        // Each log function from $log with level bigger or equal to info's level should be called
        expect($log.debug).not.toHaveBeenCalled();
        expect($log.info).toHaveBeenCalled();
        expect($log.warn).toHaveBeenCalled();
        expect($log.error).toHaveBeenCalled();
    });

    it('warn log level should print warn and error logs', function () {
        // Set Logger level to WARN
        Logger.setLogLevel(Logger.WARN);
        // Call each log function in Logger
        Logger.debug('');
        Logger.info('');
        Logger.warn('');
        Logger.error('');
        // Each log function from $log with level bigger or equal to warn's level should be called
        expect($log.debug).not.toHaveBeenCalled();
        expect($log.info).not.toHaveBeenCalled();
        expect($log.warn).toHaveBeenCalled();
        expect($log.error).toHaveBeenCalled();
    });

    it('error log level should print errors only', function () {
        // Set Logger level to ERROR
        Logger.setLogLevel(Logger.ERROR);
        // Call each log function in Logger
        Logger.debug('');
        Logger.info('');
        Logger.warn('');
        Logger.error('');
        // Each log function from $log with level bigger or equal to error's level should be called
        expect($log.debug).not.toHaveBeenCalled();
        expect($log.info).not.toHaveBeenCalled();
        expect($log.warn).not.toHaveBeenCalled();
        expect($log.error).toHaveBeenCalled();
    });

    it('none log level should disable logging', function () {
        // Set Logger level to NONE
        Logger.setLogLevel(Logger.NONE);
        // Call each log function in Logger
        Logger.debug('');
        Logger.info('');
        Logger.warn('');
        Logger.error('');
        // All log functions from $log should not be called.
        expect($log.debug).not.toHaveBeenCalled();
        expect($log.info).not.toHaveBeenCalled();
        expect($log.warn).not.toHaveBeenCalled();
        expect($log.error).not.toHaveBeenCalled();
    });
});