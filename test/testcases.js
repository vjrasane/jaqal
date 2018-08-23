import filter from '../src/filter';
// import data from '../src/resources/test/data/basic-object.json';
// import query from '../src/resources/test/queries/basic-single-query.json';
import { assert } from 'chai';
import { isEqual } from 'lodash';
// import { isEmpty } from '../src/utils';

import requireDir from 'require-dir';

const createTest = (name, files) => {
  const query = files['query'];
  const data = files['data'];
  const expected = files['expected'];
  it(name, () => {
    const result = filter(data, query);
    assert(
      isEqual(expected, result),
      'expected: ' + JSON.stringify(expected) + '\n received: ' + JSON.stringify(result)
    );
  });
};

const createSuite = (name, dir) => {
  describe(name, () => {
    Object.keys(dir).forEach(n => createTests(n, dir[n]));
  });
};

const createTests = (dirname, dir) => {
  const subdirnames = Object.keys(dir);
  if (subdirnames.includes('query')) {
    createTest(dirname, dir);
  } else {
    createSuite(dirname, dir);
  }
};

createTests('testcases', requireDir('./testcases', { recurse: true, }));
