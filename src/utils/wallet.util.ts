import { Wallets } from "fabric-network"
import path from "path"

const adminExists = async (adminUsername: string): Promise<boolean> => {
  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), "blockchain", "wallet")
  const wallet = await Wallets.newFileSystemWallet(walletPath)

  // Check to see if we've already enrolled the admin user.
  const identity = await wallet.get(adminUsername)
  return !!identity
}


export {
  adminExists
}