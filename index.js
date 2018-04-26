
const winston = require('winston');
const {LoggerConsole} = require('@goldix.org/logger-console');


class LoggerWinstonConsole extends LoggerConsole {
  
  /**
   * @see https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport
   *
   * @param options
   * @param options.level       Level of messages that this transport should log (default 'info').
   * @param options.silent      Boolean flag indicating whether to suppress output (default false).
   * @param options.colorize    Boolean flag indicating if we should colorize output (default false).
   * @param options.timestamp   Boolean flag indicating if we should prepend output with timestamps (default false).
   *                            If function is specified, its return value will be used instead of timestamps.
   *
   * @param options.json        Boolean flag indicating whether or not the output should be JSON.
   *                            If true, will log out multi-line JSON objects. (default false)
   *
   * @param options.stringify   Boolean flag indiciating if the output should be passed through JSON.stringify,
   *                            resulting in single-line output. Most useful when used in conjunction with the json flag.
   *                            (default false)
   *
   * @param options.prettyPrint Boolean flag indicating if we should util.inspect the meta (default false).
   *                            If function is specified, its return value will be the string representing the meta.
   *
   * @param options.depth       Numeric indicating how many times to recurse while formatting the object with
   *                            util.inspect (only used with prettyPrint: true) (default null, unlimited)
   *
   * @param options.humanReadableUnhandledException Boolean flag indicating if uncaught exception should be
   *                            output as human readable, instead of a single line
   *
   * @param options.showLevel   Boolean flag indicating if we should prepend output with level (default true).
   * @param options.formatter   If function is specified, its return value will be used instead of default output.
   *                            (default undefined)
   *
   * @param options.stderrLevels Array of strings containing the levels to log to stderr instead of stdout,
   *                            for example ['error', 'debug', 'info']. (default ['error', 'debug'])
   */
  
  constructor(options) {
    super(options);
  }
  
  async init() {
    this._winston = new winston.Logger({
      transports: [
        new winston.transports.Console({
          ...this.options
        })
      ]
    });
    return true;
  }
  
  getLevelInfo(level) {
    let levelNum = 7, method = 'log';
    switch (level) {
      case 'emerg':
        method = 'error';
        levelNum = 0;
        break;
      case 'alert':
        method = 'error';
        levelNum = 1;
        break;
      case 'crit':
        method = 'error';
        levelNum = 2;
        break;
      case 'error':
        method = 'error';
        levelNum = 3;
        break;
      case 'warn':
      case 'warning':
        method = 'warn';
        levelNum = 4;
        break;
      case 'log':
      case 'notice':
        method = 'log';
        levelNum = 5;
        break;
      case 'info':
      case 'verbose':
      case 'profiler':
        method = 'info';
        levelNum = 6;
        break;
      case 'debug':
      case 'silly':
        method = 'info';
        levelNum = 7;
        break;
      default:
        method = 'log';
        levelNum = 5;
        break;
    }
    
    return { method, level, levelNum };
  }
  
  async _writeMessage(transformedMessage) {
    let args = [transformedMessage.message];
    if(transformedMessage.payload) {
      args.push(transformedMessage.payload);
    }
    this._winston[transformedMessage.method].apply(this._winston, args);
    return true;
  }
}

module.exports = { LoggerWinstonConsole };