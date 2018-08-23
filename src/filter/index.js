import {
  first,
  isObject,
  isArray,
  isString,
  parseArgs,
  mapObj
} from '../utils';

const operators = {
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '>=': (a, b) => a >= b,
  '=': (a, b) => a === b,
  '?': a => !!a,
  '!?': a => !a,
  '!': a => !a,
  '~': (a, b) => a.includes(b),
};

const logicals = {
  '||': (a, b) => v => a(v) || b(v),
  '&&': (a, b) => v => a(v) && b(v),
};

const operation = expr => {
  const op = operators[first(expr)];
  if (op) {
    const value = expr.splice(1).join(' ');
    return v => op(v, value);
  }
  const value = expr.join(' ');
  return v => v === value;
};

const getExpressions = args => {
  const index = args.findIndex(a => a in logicals);
  if (index > -1) {
    const expr = args.slice(0, index);
    const rest = args.slice(index + 1);
    const logical = logicals[args[index]];
    return logical(operation(expr), getExpressions(rest));
  }
  return operation(args);
};

const getFieldValue = (data, query) => {
  if (query === '*') {
    return data;
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
    if (k in obj) {
      const queryField = query[k];
      const field = obj[k];
      result[k] = getFieldValue(field, queryField);
    }
  });

  return result;
};

const applyQuery = (data, query) => {
  if (isArray(data)) {
    return data.filter(d => isIncluded(d, query)).map(d => filterObj(d, query));
  }
  return isIncluded(data, query) ? filterObj(data, query) : null;
};

const expression = expr => {
  const op = operators[first(expr)];
  if (op) {
    const value = expr.splice(1).join(' ');
    return v => op(v, value);
  }
  const value = expr.join(' ');
  return v => v === value;
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
  } else if (isArray(cond)) {
    // TODO: array condition
  } else if (isObject(cond)) {
    return prepareCondition(cond);
  }
  return () => false;
};

const prepareCondition = cond => {
  const comparators = mapObj(cond, c => prepareComparator(c));
  return obj => Object.keys(cond).every(c => comparators[c](obj[c]));
};

const prepareQuery = query => {
  const prepared = {};
  const cond = getCondition(query);

  if (cond) {
    prepared['?'] = prepareCondition(cond);
  }
  Object.keys(query)
    .filter(k => k !== '?')
    .forEach(k => {
      const field = query[k];
      prepared[k] = isObject(field) ? prepareQuery(field) : field;
    });

  return prepared;
};

const filter = (data, query) => applyQuery(data, prepareQuery(query));

export default filter;
