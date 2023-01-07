import axios from "axios";
import FormData from "form-data";
class RestEndpoint {
  constructor(
    public endpoint: string,
    public username: string,
    public useraddress: string
  ) {}
  async prepareRequest(
    method: "GET" | "POST",
    url: string,
    body: JSON | FormData | null,
    headers?: {
      [key: string]: string;
    }
  ) {
    if (method === "GET") {
      console.log(this.endpoint + url);
      try {
        let response = await axios.get(
          this.endpoint + url,
          body ? { params: body! } : {}
        );
        return response.data;
      } catch (e: any) {
        console.error(e);
        throw Error("RestEndpointGetFailure");
      }
    } else {
      try {
        let response = await axios.post(
          this.endpoint + url,
          body ? body! : {},
          {
            headers: {
              ...headers,
            },
          }
        );
        return response.data;
      } catch (e: any) {
        console.log(e);
        throw Error("RestEndpointPostFailure");
      }
    }
  }

  async getJSONResponse(json: any) {
    if (json["success"] !== true) {
      console.error(json);
      throw new Error("RequestError:" + json["error"]);
    }
    return json["result"];
  }

  async invokeRequest(
    method: "GET" | "POST",
    url: string,
    body: JSON | FormData | null,
    headers?: {
      [key: string]: string;
    }
  ) {
    let response = await this.prepareRequest(method, url, body, headers);
    return await this.getJSONResponse(response);
  }
}

export const resturl = "http://127.0.0.1:8080";

export const endpoint = new RestEndpoint(resturl, "test", "test");
