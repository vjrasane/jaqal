import { parseArgs, removeQuotes, isNumber, last, isFunction } from '../utils';

const logicals = {
  '&&': {
    precedence: 0,
    func: (a, b) => a && b
  },
  '||': {
    precedence: 0,
    func: (a, b) => a || b
  }
};

const comparators = {
  '<': {
    precedence: 1,
    func: (a, b) => a < b
  },
  '>': {
    precedence: 1,
    func: (a, b) => a > b
  },
  '<=': {
    precedence: 1,
    func: (a, b) => a <= b
  },
  '>=': {
    precedence: 1,
    func: (a, b) => a >= b
  },
  '==': {
    precedence: 1,
    func: (a, b) => a === b
  },
  '=': {
    precedence: 1,
    func: (a, b) => a === b
  }
};

const arithmetic = {
  '+': {
    precedence: 2,
    func: (a, b) => a + b
  },
  '-': {
    precedence: 2,
    func: (a, b) => a - b
  },
  '*': {
    precedence: 3,
    func: (a, b) => a * b
  },
  '/': {
    precedence: 3,
    func: (a, b) => a / b
  },
  '%': {
    precedence: 3,
    func: (a, b) => a % b
  },
  '^': {
    precedence: 4,
    func: (a, b) => Math.pow(a, b)
  }
};

const parentheses = ['(', ')'];

const operators = {
  ...arithmetic,
  ...comparators,
  ...logicals
};

const precedence = (a, b) => a.precedence > operators[b].precedence;

const val = (token, value) =>
  token === '@' ? value : isFunction(token) ? token(value) : token;

const apply = (op, values) => {
  const args = [...Array(op.func.length).keys()].map(a => values.pop()).reverse();
  return v => op.func.apply(null, args.map(a => val(a, v)));
};

const injectValues = split => {
  const injected = [...split];
  if (injected.length === 1) {
    return ['@', '==', ...injected];
  }

  while (
    injected.find((part, index) => {
      if (part in comparators) {
        if (
          index === 0 ||
          parentheses.includes(injected[index - 1]) ||
          injected[index - 1] in logicals
        ) {
          injected.splice(index, 0, '@');
        }
      }
      return false;
    })
  ) {}
  return injected;
};

const functions = {
  abs: v => Math.abs(v),
  length: v => v.length
};

const tokenize = str =>
  injectValues(
    parseArgs(str)
      .filter(s => s && s.length > 0)
      .map(s => removeQuotes(s))
  );

const evaluate = str => {
  const ops = [];
  const values = [];
  const tokens = tokenize(str);

  tokens.forEach(t => {
    if (t === '(') ops.push(t);
    else if (isNumber(Number(t))) values.push(Number(t));
    else if (t === '@') values.push(t);
    else if (t === ')') {
      while (ops.length > 0 && last(ops) !== '(') {
        values.push(apply(ops.pop(), values));
      }
      ops.pop();
    } else if (t in operators) {
      while (ops.length > 0 && precedence(last(ops), t)) {
        values.push(apply(ops.pop(), values));
      }
      ops.push(operators[t]);
    } else if (t.endsWith('(')) {
      ops.push('(');
      // Function call
      const name = t.substring(0, t.length - 1);
      ops.push({
        precedence: 5,
        func: functions[name]
      });
    } else if (t === ',') { // Ignore commas
    } else {
      // String literal
      values.push(t);
    }
  });

  while (ops.length > 0) {
    values.push(apply(ops.pop(), values));
  }

  return values.pop();
};

export default evaluate;
