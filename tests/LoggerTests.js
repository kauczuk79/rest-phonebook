describe('Logger\'s', function () {

    var Logger,
        $log;

    beforeEach(module('app.logger'));

    beforeEach(inject(function ($injector) {
        Logger = $injector.get('Logger');
        $log = $injector.get('$log');
        spyOn($log, 'debug');
        spyOn($log, 'info');
        spyOn($log, 'warn');
        spyOn($log, 'error');
    }));

    it('debug log level should print all logs', function () {
        Logger.setLogLevel(Logger.DEBUG);
        Logger.debug('');
        expect($log.debug).toHaveBeenCalled();
        Logger.info('');
        expect($log.info).toHaveBeenCalled();
        Logger.warn('');
        expect($log.warn).toHaveBeenCalled();
        Logger.error('');
        expect($log.error).toHaveBeenCalled();
    });

    it('info log level should print info, warn and error logs', function () {
        Logger.setLogLevel(Logger.INFO);
        Logger.debug('');
        expect($log.debug).not.toHaveBeenCalled();
        Logger.info('');
        expect($log.info).toHaveBeenCalled();
        Logger.warn('');
        expect($log.warn).toHaveBeenCalled();
        Logger.error('');
        expect($log.error).toHaveBeenCalled();
    });

    it('warn log level should print warn and error logs', function () {
        Logger.setLogLevel(Logger.WARN);
        Logger.debug('');
        expect($log.debug).not.toHaveBeenCalled();
        Logger.info('');
        expect($log.info).not.toHaveBeenCalled();
        Logger.warn('');
        expect($log.warn).toHaveBeenCalled();
        Logger.error('');
        expect($log.error).toHaveBeenCalled();
    });

    it('error log level should print errors only', function () {
        Logger.setLogLevel(Logger.ERROR);
        Logger.debug('');
        expect($log.debug).not.toHaveBeenCalled();
        Logger.info('');
        expect($log.info).not.toHaveBeenCalled();
        Logger.warn('');
        expect($log.warn).not.toHaveBeenCalled();
        Logger.error('');
        expect($log.error).toHaveBeenCalled();
    });

    it('none log level should disable logging', function () {
        Logger.setLogLevel(Logger.NONE);
        Logger.debug('');
        expect($log.debug).not.toHaveBeenCalled();
        Logger.info('');
        expect($log.info).not.toHaveBeenCalled();
        Logger.warn('');
        expect($log.warn).not.toHaveBeenCalled();
        Logger.error('');
        expect($log.error).not.toHaveBeenCalled();
    });
})