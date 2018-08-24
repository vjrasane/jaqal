function isArray (value) {
  return value && typeof value === 'object' && value.constructor === Array;
}

function isObject (value) {
  return value && typeof value === 'object' && value.constructor === Object;
}

function isString (value) {
  return value && typeof value === 'string';
}

const isFunction = obj => !!(obj && obj.constructor && obj.call && obj.apply);
const isBoolean = obj => obj !== null && obj !== undefined && typeof obj === 'boolean';
const isNumber = obj => obj && typeof obj === 'number';
const isNull = obj => obj === null || obj === undefined;

const QUOTED_ARGS_MATCHER = /"[^"]+"|'[^']+'|\S+/g;
const QUOTE_MATCHER = /^[']+|[']+$/g;

const parseArgs = str =>
  str
    .trim()
    .match(QUOTED_ARGS_MATCHER)
    .map(s => s.replace(QUOTE_MATCHER, ''));

const first = array => array[0];

const mapObj = (obj, mapper) => {
  const mapped = {};
  Object.keys(obj).forEach(k => {
    mapped[k] = mapper(obj[k]);
  });
  return mapped;
};

const isEmpty = obj => {
  return Object.keys(obj).length === 0;
};

const toBoolean = obj => {
  if (obj === 'true' || obj === true) return true;
  if (obj === 'false' || obj === false) return false;
  return null;
};

export {
  isArray,
  isObject,
  isString,
  parseArgs,
  first,
  mapObj,
  isEmpty,
  isNull,
  isNumber,
  isBoolean,
  toBoolean,
  isFunction
};
