import { isNumber, last } from '../utils';

// const valuePlaceholder = 'VALUE';

// const comparators = ['>=', '<=', '<', '>', '=='];
// const logicals = ['&&', '||'];
// const parentheseses = ['(', ')'];
// const operators = ['^', '*', '%', '/', '+', '-'];

// const replacements = {
//   '=': '==',
//   '&&': 'and',
//   '\\|\\|': 'or',
//   '\\@': valuePlaceholder
// };

// const spacing = {
//   '\\)': ' )',
//   '\\(': '( ',
//   ...mapArray(comparators, c => ' ' + c + ' ')
// };

// const replace = str =>
//   Object.keys(replacements).reduce(
//     (str, rep) => str.replace(new RegExp(rep, 'g'), replacements[rep]),
//     str
//   );

// const space = str =>
//   Object.keys(spacing).reduce(
//     (str, sp) => str.replace(new RegExp(sp, 'g'), spacing[sp]),
//     str
//   );

// const injectValue = split => {
//   let result = [...split];
//   while (
//     result.find((part, index) => {
//       if (comparators.includes(part)) {
//         if (
//           index === 0 ||
//           logicals.concat(parentheseses).includes(result[index - 1])
//         ) {
//           result.splice(index, 0, valuePlaceholder);
//           return true;
//         }
//       }
//       return false;
//     })
//   );
//   return result;
// };

// const preprocess = str => {
//   const replaced = replace(str);
//   const spaced = space(replaced);
//   const split = spaced.split(' ').filter(s => s && s.length > 0);
//   return injectValue(split).join(' ');
// };

const logicals = {
  '&&': {
    precedence: 0,
    apply: (a, b) => a && b
  },
  '||': {
    precedence: 0,
    apply: (a, b) => a || b
  }
};

const comparators = {
  '<': {
    precedence: 1,
    apply: (a, b) => a < b
  },
  '>': {
    precedence: 1,
    apply: (a, b) => a > b
  },
  '<=': {
    precedence: 1,
    apply: (a, b) => a <= b
  },
  '>=': {
    precedence: 1,
    apply: (a, b) => a >= b
  },
  '==': {
    precedence: 1,
    apply: (a, b) => a === b
  },
  '=': {
    precedence: 1,
    apply: (a, b) => a === b
  }
};

const arithmetic = {
  '+': {
    precedence: 2,
    apply: (a, b) => a + b
  },
  '-': {
    precedence: 2,
    apply: (a, b) => a - b
  },
  '*': {
    precedence: 3,
    apply: (a, b) => a * b
  },
  '/': {
    precedence: 3,
    apply: (a, b) => a / b
  },
  '%': {
    precedence: 3,
    apply: (a, b) => a % b
  },
  '^': {
    precedence: 4,
    apply: (a, b) => a ^ b
  }
};

const operators = {
  ...arithmetic,
  ...comparators,
  ...logicals
};

const precedence = (a, b) =>
  !(b in operators) ||
  (a in operators && operators[a].precedence > operators[b].precedence);

const apply = (second, first, op) => operators[op].apply(first, second);

const evaluate = str => {
  const ops = [];
  const values = [];
  const tokens = str.split(' ').filter(s => s && s.length > 0);

  tokens.forEach(t => {
    if (t === '(') ops.push(t);
    else if (isNumber(Number(t))) values.push(Number(t));
    else if (t === ')') {
      while (ops.length > 0 && last(ops) !== '(') {
        values.push(apply(values.pop(), values.pop(), ops.pop()));
      }
      ops.pop();
    } else {
      while (ops.length > 0 && precedence(last(ops), t)) {
        values.push(apply(values.pop(), values.pop(), ops.pop()));
      }
      ops.push(t);
    }
  });

  while (ops.length > 0) {
    values.push(apply(values.pop(), values.pop(), ops.pop()));
  }

  return values.pop();
};

export default evaluate;
