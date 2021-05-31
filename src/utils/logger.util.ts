import { createLogger, format, transports, Logger } from "winston"

const logFormat = format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)

const logger: Logger = createLogger({
  format: format.combine(
    format.splat(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    // Format the metadata object
    format.metadata({ fillExcept: ["message", "level", "timestamp"] })
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        logFormat
      )
    }),
  ]
})

export {
  logger
}