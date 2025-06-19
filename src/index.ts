import type { AxiosRequestHeaders } from "axios";

import axios from "axios";
import { generateIdempotencyKey } from "./utils";

export const createClientSaas = (options: OptionClientSaas) => {
  const { baseURL, endpointIn, endpointOut, platformKey } = options;

  const requestIn = async (
    headers: AxiosRequestHeaders,
    body: BodyRequest
  ): Promise<ApiResponseIn> => {
    try {
      const resp = await axios.post(endpointIn, body, { headers, baseURL });
      const data = resp.data;
      if (data?.StatusCode === 401) throw new Error("Expired Token");
      return { ...data, error: false };
    } catch (err) {
      console.error("error request in:", err);
      return { Message: "Access route not found", StatusCode: 500 };
    }
  };

  const requestOut = async <T>(
    headers: AxiosRequestHeaders,
    body: BodyRequestOut
  ): Promise<ApiResponseOut<T>> => {
    try {
      const resp = await axios.post(endpointOut, body, { headers, baseURL });
      const data = resp.data;
      if (data?.StatusCode === 401) throw new Error("Expired Token");
      return { ...data, error: false };
    } catch (err) {
      console.error(err);
      return {
        Message: "Request on process / not available now",
        StatusCode: 404,
        Data: null,
        error: true,
      };
    }
  };

  const fetch = async <T>(params: FetchParams): Promise<ApiResponseOut<T> | undefined> => {
    const { body, headers, limit = 3 } = params;

    if (!platformKey) throw new Error("Platform Key not found");

    headers["PlatformKey"] = platformKey;
    headers["Idempotency-Key"] = generateIdempotencyKey(body);

    try {
      const respIn = await requestIn(headers, body);
      if (respIn.StatusCode !== 200) throw new Error(respIn.Message || "Request In Failed");

      const bodyOut: BodyRequestOut = {
        TicketId: respIn.TicketId!,
        Subject: body.Subject,
        SubjectType: body.SubjectType,
        SubjectIdentifier: body.SubjectIdentifier,
      };

      let attempt = 0;
      while (attempt < limit) {
        const respOut = await requestOut<T>(headers, bodyOut);
        if ([200, 404, 403].includes(respOut.StatusCode)) return respOut;
        if (respOut.StatusCode === 401) throw new Error("Expired Token");

        attempt++;
        await new Promise((r) => setTimeout(r, 5000));
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  return {
    fetch,
  };
};
