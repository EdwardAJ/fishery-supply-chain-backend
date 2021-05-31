import { Gateway } from "fabric-network"
import { GatewaysInterface } from "~/interfaces/gateways.interface"
import { logger } from "~/utils/logger.util"

let gateways: GatewaysInterface = {}

async function connect (ccp: any, wallet: any, username: string): Promise<any> {
  logger.info("Connecting to gateway with username: ", username)
  gateways[username] = new Gateway()
  await gateways[username].connect(ccp, {
    wallet,
    identity: username,
    discovery: { enabled: true, asLocalhost: true },
    eventHandlerOptions: {
      strategy: null
    }
  })
}

export {
  connect,
  gateways
}
