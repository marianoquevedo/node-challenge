import { ajv } from '../validator';
import { FromSchema } from 'json-schema-to-ts';
import { Request } from 'express';
import { ApiErrorType, BadRequest } from '@nc/utils/errors';

const sortFields = ['merchant_name', 'amount_in_cents', 'date_created', 'status'];

const queryParamsSchema = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      format: 'uuid',
    },
    merchant_name: {
      type: 'string',
      minLength: 1,
    },
    status: {
      type: 'string',
      enum: ['pending', 'processed'],
    },
    sort: {
      type: 'string',
      minLength: 1,
      enum: sortFields,
      default: 'date_created',
    },
    sortDir: {
      type: 'string',
      minLength: 1,
      enum: ['ASC', 'DESC'],
      default: 'DESC',
    },
    offset: {
      type: 'number',
      minimum: 0,
      default: 0,
    },
    limit: {
      type: 'number',
      minimum: 1,
      default: 20,
    },
  },
  required: ['userId'],
  additionalProperties: false,
} as const;

// typed definition of the request parameters
export type GetExpensesRequest = FromSchema<typeof queryParamsSchema>;

// Ajv compiled validator
const validator = ajv.compile<GetExpensesRequest>(queryParamsSchema);

export function validate(req: Request): [ApiErrorType, GetExpensesRequest] {
  const input = { ...req.query }; // ajv mutates the input

  if (validator(input)) {
    return [null, input];
  }

  // ajv returns an array of error objects
  const errMessage = validator.errors.map((e) => `${e.instancePath.replace('/', '')}: ${e.message}`).join(';');
  return [BadRequest(`Invalid query parameters - ${errMessage}`), null];
}
