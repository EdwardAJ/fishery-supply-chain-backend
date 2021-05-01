interface ProductLotFromBlockchainInterface {
  id: string
  weight: number
  activitiesChainId: string
  activityId: string
  commodityType: string
  owner: {
    username: string,
    organizationName: string
  }
}

export {
  ProductLotFromBlockchainInterface
}