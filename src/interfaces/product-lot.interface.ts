interface ProductLotRequestBodyInterface {
  weight: number;
  commodityType: string;
}

interface ProductLotInterface extends ProductLotRequestBodyInterface {
  id: string;
  activitiesChainId: string;
  activityId: string;
}

export {
  ProductLotInterface,
  ProductLotRequestBodyInterface
}