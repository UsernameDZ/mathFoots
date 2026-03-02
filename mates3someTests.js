// require lodash
var withThis = (obj, cb) => cb(obj),
factorize = num =>
  [...Array(Math.abs(num)).keys()]
  .map(i => i + 1).reduce((acc, inc) =>
    num % inc === 0 ? [...acc, inc] : acc
, []),
prz = (a, b) => withThis(
  withThis(
    {aF: factorize(a), bF: factorize(b)},
    ({aF, bF}) => bF.map(i => aF.map(j => i / j))
  ), result => withThis(
    _.uniq(_.flattenDeep(result)), fs => [
      ...fs, ...fs.map(i => i * -1)
    ].sort()
  )
),
synDiv = (num, arr) =>
  arr.reduce((acc, inc) => [
    ...acc, inc + (num * (_.last(acc) || 0))
  ], []),
polySolve = equ =>
  prz(_.first(equ), _.last(equ))
  .map(i => ({f: i, rem: synDiv(i, equ)}))
  .filter(i => _.last(i.rem) === 0)

polySolve([1, 3, -4]);