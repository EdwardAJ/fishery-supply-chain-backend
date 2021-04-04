/*
  This response body structure is based on
  JSend standard (https://github.com/omniti-labs/jsend)
*/

class Response {
  readonly status: string
  readonly data ?: unknown
  readonly message: string

  constructor (status: string, message: string, data ?: unknown) {
    this.status = status
    this.data = data
    this.message = message
  }
}

export { Response }