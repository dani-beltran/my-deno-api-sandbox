import { assertEquals, Dictionary } from "../deps.ts";

export enum  ResponseType {
  json = 'json',
  text = 'text'
}
export class IntegrationTestFactory {
  endpointUrl: string;
  headers: HeadersInit;
  method: string;

  constructor(params: {
    endpointUrl: string,
    headers: HeadersInit,
    method: string
  }) {
    this.endpointUrl = params.endpointUrl;
    this.headers = params.headers;
    this.method = params.method;
  }

  buildBodyValidationTest(params?: {
    responseType?: ResponseType
  }) {
    return async (input: Dictionary<string|number|boolean>, expected: string) => {
      const res = await fetch(this.endpointUrl, {
        method: this.method,
        headers: this.headers,
        body: JSON.stringify(input),
      });
      assertEquals(res.status, 400);
      if (params?.responseType === ResponseType.json) {
        assertEquals(await res.json(), expected);
      } else {
        assertEquals(await res.text(), expected);  
      }
    };
  }

  buildSearchValidation(params?: {
    responseType?: ResponseType
  }) {
    return async (input: [string, string][], expected: string) => {
      let url = `${this.endpointUrl}?`;
      input.forEach(pair => {
        url += `${pair[0]}=${pair[1]}&`;
      });
      url = url.substr(0, url.length - 1);
      const res = await fetch(url, {method: this.method, headers: this.headers});
      assertEquals(res.status, 400);
      if (params?.responseType === ResponseType.json) {
        assertEquals(await res.json(), expected);
      } else {
        assertEquals(await res.text(), expected);  
      }
    };
  }
}

