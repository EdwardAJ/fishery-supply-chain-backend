interface ActivitesChainFromBlockchainInterface {
  id: string
  activities: ActivityFromBlockchainInterface[]
}

interface ActivityFromBlockchainInterface {
  id: string
  parentIds: string[] | null
  owner: {
    username: string
    organizationName: string
  }
  createdAt: string
}

export {
  ActivitesChainFromBlockchainInterface,
  ActivityFromBlockchainInterface
}