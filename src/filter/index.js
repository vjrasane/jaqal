import {
  isArray,
  isFunction,
  isNull,
  getCondition
} from '../utils';

import prepare from './prepare';

const getFieldValue = (data, query) => {
  if (isFunction(query)) {
    return query(data);
  } else {
    return applyQuery(data, query);
  }
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

const filter = (data, query) => applyQuery(data, prepare(query));

export default filter;
