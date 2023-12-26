import { HTTPClient } from 'koajax';

export const ZKC_SERVICE_API = process.env.REACT_APP_ZKC_SERVER_URL;

export const ZK_MD5 = process.env.MD5 || '77DA9B5A42FABD295FD67CCDBDF2E348';

export interface Base extends Record<'createdAt' | 'updatedAt', string> {
  id?: string | number;
}

export interface ErrorBaseData
  extends Record<
    'type' | 'title' | 'detail' | 'traceId' | 'instance' | 'message',
    string
  > {
  status: number;
  body?: any;
}

export const zkcServerClient = new HTTPClient({
  baseURI: ZKC_SERVICE_API,
  responseType: 'json',
});
