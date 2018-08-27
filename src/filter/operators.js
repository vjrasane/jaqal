import { isNull } from '../utils';

export default {
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '>=': (a, b) => a >= b,
  '=': (a, b) => a === b,
  '?': a => !isNull(a),
  '!?': a => isNull(a),
  '~': (a, b) => a && a.includes(b)
};
