export type HTTPMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATCH'

export type Query = Map<string, string | string[]>

export type ResponsePayload = {
  data?: object
  status?: number
  statusText?: string
  message?: string
}

export type Handler = {
  (payload: {
    body?: object
    url: URL
    query: Query
  }): Promise<ResponsePayload | void>
}

export type Route = [HTTPMethod | '*', string | RegExp, Handler]
