import { ResultError } from '../../../common/result/result-error';

export interface ApiErrorExample {
  example: ResultError;
}

export interface ApiErrorResponses {
  [key: string]: ApiErrorExample;
}
