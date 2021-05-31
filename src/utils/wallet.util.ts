import { Wallet, Wallets } from "fabric-network"
import fs from "fs"
import path from "path"
import { logger } from "~/utils/logger.util"
import { getOrgConnectionFileName } from "./organization.util"

const adminExists = async (adminUsername: string): Promise<boolean> => {
  const wallet = await getWallet()
  const identity = await wallet.get(adminUsername)
  return !!identity
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getConnectionInfo = (orgMspId: string, peerNumber = 0): any => {
  const connectionInfoPath =
    path.resolve(__dirname, "..", "..", getOrgConnectionFileName(orgMspId, peerNumber))
  return JSON.parse(fs.readFileSync(connectionInfoPath, "utf8"))
}

const getWallet = async (): Promise<Wallet> => {
  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), "wallet")
  logger.info(`Creating wallet path at ${walletPath}...`)
  return await Wallets.newFileSystemWallet(walletPath)
}

const validateWallet = async (wallet: Wallet, username: string): Promise<void> => {
  const identity = await wallet.get(username)
  if (!identity) {
    logger.error(`Identity ${username} does not exist`)
    throw new Error(`An identity for the user ${username} does not exist in the wallet`)
  }
} 

export {
  adminExists,
  getConnectionInfo,
  getWallet,
  validateWallet
}