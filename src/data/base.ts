import { HTTPClient } from 'koajax';

const ZkcServerUrl = process.env.REACT_APP_ZKC_SERVER_URL;

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
  baseURI: ZkcServerUrl,
  responseType: 'json',
});
