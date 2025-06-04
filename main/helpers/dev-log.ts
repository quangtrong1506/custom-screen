import log from 'electron-log';
log.transports.file.maxSize = 5 * 1024 * 1024;
log.transports.console.level = 'debug';
export { log };
