import addFormats from 'ajv-formats';
import Ajv from 'ajv';

const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
  useDefaults: true,
});
addFormats(ajv);

export { ajv };
