import evaluate from '../src/filter/arithmetic';

describe('test', () => {
  it('parse', () => {
    const func = evaluate('length( @ 3 2 )');
    console.log(func('asd'), func('dhasd'), func('swaggety'));
  });
});
