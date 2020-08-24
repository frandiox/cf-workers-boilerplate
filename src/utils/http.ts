import { Overwrite } from '../@types/util'
import { HTTPMethod, ResponsePayload } from '../@types/http'

export function makeRequest(
  endpoint: string,
  {
    method = 'GET',
    headers = {},
    body = {},
    ...options
  }: Overwrite<RequestInit, { body?: object; method?: HTTPMethod }> = {}
) {
  return fetch(endpoint, {
    method,
    headers: {
      'Content-Type': body ? 'application/json' : 'text/plain',
      ...headers,
    },
    body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
    ...options,
  })
    .then((res) => {
      if (res && res.status === 200) {
        if (
          (res.headers.get('content-type') || '').toLowerCase() ===
          'application/json'
        ) {
          return res.json()
        }
      }

      return res
    })
    .catch((error) => {
      throw new ExternalServiceError(error.message)
    })
}

class RestError extends Error implements ResponsePayload {
  status: number
  statusText: string
  data?: object

  constructor(
    message: string,
    status: number,
    statusText: string,
    data?: object
  ) {
    super(message)
    this.name = this.constructor.name
    this.status = status
    this.statusText = statusText
    this.data = data
  }
}

export class UserInputError extends RestError {
  constructor(message: string, data?: object) {
    super(message, 400, 'Bad Request', data)
  }
}

export class UnknownError extends RestError {
  constructor(message: string, data?: object) {
    super(message, 500, 'Internal Server Error', data)
  }
}

export class ExternalServiceError extends RestError {
  constructor(message: string, data?: object) {
    super(message, 503, 'External Service Error', data)
  }
}
