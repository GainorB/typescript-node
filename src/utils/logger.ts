import {createLogger, format, transports} from 'winston';
const {combine, timestamp, printf, colorize, json} = format;

const myFormat = printf(({level, message, timestamp}) => {
  return `${timestamp} ${level}: ${message}`;
});

export const logger = createLogger({
  format: combine(colorize(), timestamp(), json(), myFormat),
  transports: [
    new transports.Console(),
    new transports.File({filename: 'error.log', level: 'error'}),
    new transports.File({filename: 'combined.log'}),
  ],
});