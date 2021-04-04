import { createLogger, transports, Logger } from "winston"

const logger: Logger = createLogger({
  transports: [
    new transports.Console()
  ]
})

export {
  logger
}