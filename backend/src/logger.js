import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import path from "path";

const { combine, timestamp, json, colorize } = format;

const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message }) => {
    return `${level}: ${message}`;
  }),
);

const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    // Automatically rotates logs and deletes files older than 7 days
    new transports.DailyRotateFile({
      dirname: path.join(process.cwd(), "logs"),
      filename: "app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "7d", // Keeps logs for 7 days, then auto-deletes
      zippedArchive: false, // Set to true if you want old logs compressed
    }),
  ],
});

export default logger;
