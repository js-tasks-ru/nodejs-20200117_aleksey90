function isNum(a) {
  return typeof(a) === "number";
}
function sum(a, b) {
  /* ваш код */
  if (!(isNum(a) && isNum(b))) {
    throw new TypeError(`TypeError`);
  }
  return a + b;
}

module.exports = sum;
