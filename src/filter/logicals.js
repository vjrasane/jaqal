export default {
  '||': (a, b) => v => a(v) || b(v),
  '&&': (a, b) => v => a(v) && b(v)
};
