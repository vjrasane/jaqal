import filter from "../src/filter";
import data from '../src/resources/test/data/basic-object.json';
import query from '../src/resources/test/queries/basic-single-query.json';

describe('filter', () => {
  it('simple query', () => {
    console.log(JSON.stringify(filter(data, query)));
  });
});