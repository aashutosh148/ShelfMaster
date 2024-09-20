import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize } = format;

const formatTimestamp = () => {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'IST',
    timeZoneName: 'short'
  }).format(new Date());
};

const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message} : ${timestamp}`;
  })
);

const logger = createLogger({
  level: "info",
  format: combine(
    colorize(),
    timestamp({ format: formatTimestamp }),
    json()
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: formatTimestamp }),
        consoleLogFormat
      ),
    }),
    new transports.File({
      filename: "app.log",
      format: combine(
        timestamp({ format: formatTimestamp }),
        json()
      )
    }),
  ],
});

export default logger;
