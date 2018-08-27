import {
  first,
  isObject,
  isArray,
  isString,
  isNumber,
  parseArgs,
  isBoolean,
  toBoolean,
  getCondition,
  mapObj
} from '../utils';

import operators from './operators';
import logicals from './logicals';
import masks from './masks';

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

export default prepareQuery;
