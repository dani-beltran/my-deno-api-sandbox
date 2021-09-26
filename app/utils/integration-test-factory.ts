import { assertEquals, Dictionary } from "../deps.ts";
export enum  ResponseType {
  json = 'json',
  text = 'text'
}
export class IntegrationTestFactory {
  endpointUrl: string;
  method: string;

  constructor(params: {
    endpointUrl: string;
    method: string;
  }) {
    this.endpointUrl = params.endpointUrl;
    this.method = params.method;
  }

  buildValidationTest(params?: {
    responseType?: ResponseType
  }) {
    return async (input: Dictionary<string|number|boolean>, expected: string) => {
      const res = await fetch(this.endpointUrl, {
        method: this.method,
        headers: {
          "Content-Type": "application/json",
        },
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
}

