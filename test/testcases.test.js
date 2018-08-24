import filter from '../src/filter';

import { assert } from 'chai';
import { isEqual } from 'lodash';

import path from 'path';
import requireDir from 'require-directory';

const wrapper = (name, it) =>
  name.endsWith('#skip') ? it.skip : name.endsWith('#only') ? it.only : it;

const createTest = (name, files, parentData) => {
  const query = files['query'];
  const data = 'data' in files ? files['data'] : parentData;
  const expected = files['expected'];
  wrapper(name, it)(name, () => {
    const result = filter(data, query);
    assert(
      isEqual(expected, result),
      'expected: ' +
        JSON.stringify(expected) +
        '\n received: ' +
        JSON.stringify(result)
    );
  });
};

const createSuite = (name, dir, parentData) => {
  const data = 'data' in dir ? dir['data'] : parentData;
  wrapper(name, describe)(name, () => {
    Object.keys(dir)
      .filter(n => !['data', 'query', 'expected'].includes(n))
      .forEach(n => createTests(n, dir[n], data));
  });
};

const createTests = (dirname, dir, data) => {
  if ('query' in dir) {
    createTest(dirname, dir, data);
  } else {
    createSuite(dirname, dir, data);
  }
};

const dir = requireDir(module, path.join(__dirname, './testcases'));

createTests('testcases', dir);
