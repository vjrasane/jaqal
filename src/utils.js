function isArray (value) {
  return value && typeof value === 'object' && value.constructor === Array;
}

function isObject (value) {
  return value && typeof value === 'object' && value.constructor === Object;
}

function isString (value) {
  return value && typeof value === 'string';
}

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

export { isArray, isObject, isString, parseArgs, first, mapObj, isEmpty };
