import filter from '../src/filter';

import { assert } from 'chai';
import { isEqual } from 'lodash';

import requireDir from 'require-dir';

const createTest = (name, files, parentData) => {
  const query = files['query'];
  const data = 'data' in files ? files['data'] : parentData;
  const expected = files['expected'];
  it(name, () => {
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
  describe(name, () => {
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

createTests('testcases', requireDir('./testcases', { recurse: true, }));
