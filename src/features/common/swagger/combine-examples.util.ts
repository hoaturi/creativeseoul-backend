import { ApiErrorExample } from './error-responses.interface';

/**
 * Combines multiple API error examples into a single example object for Swagger/OpenAPI documentation.
 * This utility helps work around Swagger/OpenAPI's limitation of allowing only one example
 * per status code by combining multiple examples into an array.
 *
 * @param {...ApiErrorExample[]} responses - Array of API error examples to be combined
 * @returns {{ example: { oneOf: any[] } }} Combined example object containing an array of examples
 */

export const combineExamples = (
  ...responses: ApiErrorExample[]
): { example: { oneOf: any[] } } => ({
  example: {
    oneOf: responses.map((response) => response.example),
  },
});
