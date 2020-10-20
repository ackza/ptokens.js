import { AxiosInstance } from 'axios'

export class HttpProvider {
  constructor(_endpoint?: string, _headers?: object)

  api: AxiosInstance

  endpoint: string

  headers: any

  call(_callType: string, _apiPath: string, _params?: any[], _timeout?: number): Promise<any>

  setEndpoint(_endpoint: string): any

  setHeaders(_headers: object): any
}
