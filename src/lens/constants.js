// Flashlight lens tuning knobs.
//
// If the cursor feels "slow" on desktop, increase `lerpFactorMouse`.
// If touch feels too jittery, decrease `lerpFactorTouch`.

((global) => {
  global.LisaDrip = global.LisaDrip || {};
  const ns = global.LisaDrip;

  ns.lensConfig = {
    // Lens radius in pixels. The visible ring is 2x this size.
    radiusPx: 112,

    // Bigger = faster (less trailing). Keep touch slightly smoother.
    lerpFactorMouse: 0.34,
    lerpFactorTouch: 0.18,

    // When the lens is "close enough" to the target, stop rendering.
    settleThreshold: 0.2,
  };
})(window);
