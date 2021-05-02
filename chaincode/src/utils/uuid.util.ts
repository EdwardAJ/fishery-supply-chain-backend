import { v4 as uuidv4 } from "uuid"

const getGeneratedUuid = (): string => {
  return uuidv4()
} 

export {
  getGeneratedUuid
}