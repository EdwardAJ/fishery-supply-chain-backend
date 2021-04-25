interface ActivitesChainFromBlockchainInterface {
  id: string
  activities: ActivityInterfaceFromBlockchain[]
}

interface ActivityInterfaceFromBlockchain {
  id: string
  parentIds: string[] | null
  owner: {
    username: string
    organizationName: string
  }
  createdAt: string
}

export {
  ActivitesChainFromBlockchainInterface
}