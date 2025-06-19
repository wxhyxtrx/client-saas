type BodyRequest = {
  ClientId: string;
  UserId: string;
  Subject: string;
  SubjectType: string;
  SubjectIdentifier: string;
  Action: string;
  Date: string;
  Data?: any;
  ResourceType?: string;
  Resource?: string;
  ResourceId?: string;
};

type BodyRequestOut = {
  TicketId: string;
  Subject: string;
  SubjectType: string;
  SubjectIdentifier: string;
};

type OptionClientSaas = {
  baseURL: string;
  endpointIn: string;
  endpointOut: string;
  platformKey: string;
};

type FetchParams = {
  headers: AxiosRequestHeaders;
  body: BodyRequest;
  limit?: number;
};


interface BaseResponseSaaS {
  TicketId: string;
  Subject: string;
  SubjectType: string;
  SubjectIdentifier: string;
  Action: string;
  ResourceType: string | null;
  Resource: string | null;
  ResourceId: string | null;
  Status: string;
  Message: string;
}

type ResponseInSuccess = BaseResponseSaaS & {
  Data: null;
  StatusCode: 200;
};

type ResponseInFailure = {
  StatusCode: 500;
  Message: string;
};

type ResponseOutSuccess<T> = ResponseInSuccess<T>;

type ResponseOutFailure = Partial<BaseResponseSaaS> & {
  Data: null;
  StatusCode: number;
};

type ApiResponseIn = ResponseInSuccess | ResponseInFailure;
type ApiResponseOut<T> = ResponseOutSuccess<T> | ResponseOutFailure;
