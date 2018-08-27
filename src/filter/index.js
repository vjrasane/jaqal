import {
  first,
  isObject,
  isArray,
  isString,
  isFunction,
  isNumber,
  parseArgs,
  isNull,
  isBoolean,
  toBoolean,
  mapObj
} from '../utils';

const operators = {
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '>=': (a, b) => a >= b,
  '=': (a, b) => a === b,
  '?': a => !isNull(a),
  '!?': a => isNull(a),
  '~': (a, b) => a && a.includes(b)
};

const logicals = {
  '||': (a, b) => v => a(v) || b(v),
  '&&': (a, b) => v => a(v) && b(v)
};

const getFieldValue = (data, query) => {
  if (isFunction(query)) {
    return query(data);
  } else {
    return applyQuery(data, query);
  }
};

const getCondition = query => {
  return isObject(query) ? query['?'] : null;
};

const isIncluded = (data, query) => {
  const cond = getCondition(query);
  return cond ? cond(data) : true;
};

const filterObj = (obj, query) => {
  const result = {};
  const keys = Object.keys(query).filter(k => k !== '?');
  keys.forEach(k => {
    const queryField = query[k];
    const field = obj[k];
    const value = getFieldValue(field, queryField);
    if (!isNull(value)) result[k] = value;
  });

  return result;
};

const applyQuery = (data, query) => {
  if (isArray(data)) {
    const filtered = data.filter(d => isIncluded(d, query));
    return filtered.map(d => filterObj(d, query));
  }
  return isIncluded(data, query) ? filterObj(data, query) : null;
};

const cast = op => (a, b) => {
  if (op(a, b)) return true;
  const num = Number(b);
  if (isNumber(num)) return op(a, num);
  const bool = toBoolean(b);
  if (isBoolean(bool)) return op(a, bool);
  return false;
};

const expression = expr => {
  const op = operators[first(expr)];
  if (op) {
    const value = expr.splice(1).join(' ');
    return v => cast(op)(v, value);
  }
  const value = expr.join(' ');
  return v => cast(operators['='])(v, value);
};

const prepareExpressions = args => {
  const index = args.findIndex(a => a in logicals);
  if (index > -1) {
    const expr = args.slice(0, index);
    const rest = args.slice(index + 1);
    const logical = logicals[args[index]];
    return logical(expression(expr), prepareExpressions(rest));
  }
  return expression(args);
};

const prepareComparator = cond => {
  if (isString(cond)) {
    return prepareExpressions(parseArgs(cond));
  } else if (isNumber(cond) || isBoolean(cond)) {
    return v => v === cond;
  } else if (isArray(cond)) {
    // TODO: array condition
  } else if (isObject(cond)) {
    return prepareCondition(cond);
  }
  return () => false;
};

const prepareCondition = cond => {
  const comparators = mapObj(cond, c => prepareComparator(c));
  return obj =>
    obj &&
    Object.keys(cond).every(c => {
      return comparators[c](obj[c]);
    });
};

const masks = {
  '*': v => v,
  '?': v => !!v,
  '!?': v => !v,
  '!': v => !v
};

const prepareMask = mask => {
  if (mask in masks) return masks[mask];
  return v => null;
};

const prepareQuery = query => {
  const prepared = {};
  const cond = getCondition(query);

  if (cond) {
    prepared['?'] = prepareCondition(cond);
  }

  Object.keys(query || {})
    .filter(k => k !== '?')
    .forEach(k => {
      const field = query[k];
      prepared[k] = isObject(field) ? prepareQuery(field) : prepareMask(field);
    });

  return prepared;
};

const filter = (data, query) => applyQuery(data, prepareQuery(query));

export default filter;
