// Small math helpers used by the flashlight lens.
//
// Attached to a single global namespace to keep this project dependency-free
// and easy to understand without bundlers.

((global) => {
  global.LisaDrip = global.LisaDrip || {};
  const ns = global.LisaDrip;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  ns.math = {
    clamp,
    lerp,
  };
})(window);
