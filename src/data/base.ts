import { HTTPClient } from 'koajax';

const ZkcServerUrl = process.env.REACT_APP_ZKC_SERVER_URL;

export const zkcServerClient = new HTTPClient({
  baseURI: ZkcServerUrl,
  responseType: 'json',
});
