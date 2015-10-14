(function () {
    "use strict";

    /*global angular, alert*/

    function LoggerFactory($log) {

        var DEBUG = 1,
            INFO = 2,
            WARN = 4,
            ERROR = 6,
            NONE = 16,
            logLevel = ERROR;

        function error(message) {
            if (logLevel <= ERROR) {
                $log.error(message);
            }
        }

        function debug(message) {
            if (logLevel <= DEBUG) {
                $log.debug(message);
            }
        }

        function warn(message) {
            if (logLevel <= WARN) {
                $log.warn(message);
            }
        }

        function info(message) {
            if (logLevel <= INFO) {
                $log.info(message);
            }
        }

        function setLogLevel(level) {
            logLevel = level;
        }

        return {
            error: error,
            warn: warn,
            info: info,
            debug: debug,
            setLogLevel: setLogLevel,
            DEBUG: DEBUG,
            INFO: INFO,
            WARN: WARN,
            ERROR: ERROR
        };
    }

    LoggerFactory.$inject = ["$log"];

    angular
        .module("app.logger")
        .factory("Logger", LoggerFactory);
}());