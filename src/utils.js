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
const isBoolean = obj =>
  obj !== null && obj !== undefined && typeof obj === 'boolean';
const isNumber = obj => !isNaN(obj);
const isNull = obj => obj === null || obj === undefined;

// const QUOTED_ARGS_MATCHER = /"[^"]+"|'[^']+'|\S+/g;
// const QUOTE_MATCHER = /^[']+|[']+$/g;
const isQuoted = str => str.startsWith("'") && str.endsWith("'");
const removeQuotes = str => str.replace(/^'/, '').replace(/'$/, '');
const parseArgs = str => str.match(/\S+|"[^"]+"/g);

const first = array => array[0];
const last = array => array[array.length - 1];

const mapArray = (array, mapper) => {
  const mapped = {};
  array.forEach(k => {
    mapped[k] = mapper(k);
  });
  return mapped;
};

const mapObj = (obj, mapper) => {
  const mapped = {};
  Object.keys(obj).forEach(k => {
    mapped[k] = mapper(obj[k]);
  });
  return mapped;
};

const toBoolean = obj => {
  if (obj === 'true' || obj === true) return true;
  if (obj === 'false' || obj === false) return false;
  return null;
};

const getCondition = query => {
  return isObject(query) ? query['?'] : null;
};

export {
  isArray,
  isObject,
  isString,
  isQuoted,
  removeQuotes,
  parseArgs,
  first,
  last,
  mapObj,
  mapArray,
  isNull,
  isNumber,
  isBoolean,
  toBoolean,
  isFunction,
  getCondition
};
