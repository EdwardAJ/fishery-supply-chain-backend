import { Wallet, Wallets } from "fabric-network"
import fs from "fs"
import path from "path"
import { logger } from "~/utils/logger.util"
import { getOrgConnectionFileName } from "./organization.util"

const adminExists = async (adminUsername: string): Promise<boolean> => {
   const wallet = await getWallet()
  // Check to see if we've already enrolled the admin user.
  const identity = await wallet.get(adminUsername)
  return !!identity
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getConnectionInfo = (orgDomain: string, orgMspId: string): any => {
  // load the network configuration
  const connectionInfoPath =
    path.resolve(__dirname, "..", "..", "blockchain", "test-network","organizations", "peerOrganizations", orgDomain, getOrgConnectionFileName(orgMspId))
  return JSON.parse(fs.readFileSync(connectionInfoPath, "utf8"))
}

const getWallet = async (): Promise<Wallet> => {
  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), "blockchain", "wallet")
  logger.info(`Creating wallet path at ${walletPath}...`)
  return await Wallets.newFileSystemWallet(walletPath)
}


export {
  adminExists,
  getConnectionInfo,
  getWallet
}