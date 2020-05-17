declare type HTTPMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATCH'

declare type Query = Map<string, string | string[]>

declare type ResponsePayload = {
  data?: object
  status?: number
  statusText?: string
  message?: string
}

declare type Handler = {
  (payload: {
    body?: object
    url: URL
    query: Query
  }): Promise<ResponsePayload | void>
}

declare type Route = [HTTPMethod | '*', string | RegExp, Handler]

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

type MakeRequestOptions = Overwrite<
  RequestInit,
  { body?: object; method?: HTTPMethod }
>
