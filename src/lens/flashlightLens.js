// Flashlight cursor reveal:
// - Two images are stacked.
// - The top image is clipped with a circular clip-path following the pointer.
// - We animate the clip center with a simple lerp to create a subtle trailing effect.

((global) => {
  global.LisaDrip = global.LisaDrip || {};
  const ns = global.LisaDrip;

  function createFlashlightLensController({ stage, funImage, lens, config }) {
    const { clamp, lerp } = ns.math;

    if (!stage || !funImage || !lens) {
      throw new Error(
        "Flashlight lens init failed: expected {stage, funImage, lens} elements to exist.",
      );
    }

    // Apply the lens radius to CSS so both the visible ring and clip-path share sizing.
    stage.style.setProperty("--r", `${config.radiusPx}px`);
    funImage.style.setProperty("--r", "0px"); // start hidden until user interacts

    // Animation state
    let rafId = null;
    let active = false;
    let lerpFactor = config.lerpFactorMouse;

    // Target position (pointer)
    let tx = 0;
    let ty = 0;

    // Current position (animated)
    let cx = 0;
    let cy = 0;

    function setTargetFromEvent(e) {
      // Mouse should feel immediate; touch benefits from a little smoothing.
      lerpFactor = e.pointerType === "mouse" ? config.lerpFactorMouse : config.lerpFactorTouch;

      const rect = stage.getBoundingClientRect();
      tx = clamp(e.clientX - rect.left, 0, rect.width);
      ty = clamp(e.clientY - rect.top, 0, rect.height);
    }

    function render() {
      // Smoothly move current position toward target.
      cx = lerp(cx, tx, lerpFactor);
      cy = lerp(cy, ty, lerpFactor);

      // Drive the clip-path via CSS variables (px is more accurate than % here).
      funImage.style.setProperty("--x", `${cx}px`);
      funImage.style.setProperty("--y", `${cy}px`);

      // Move the visible ring to match.
      lens.style.left = `${cx}px`;
      lens.style.top = `${cy}px`;

      // Continue animating while active, or while settling to the target.
      if (active || Math.abs(cx - tx) + Math.abs(cy - ty) > config.settleThreshold) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    }

    function start() {
      if (rafId) return;
      rafId = requestAnimationFrame(render);
    }

    function onPointerEnter(e) {
      active = true;
      stage.dataset.active = "true";
      funImage.style.setProperty("--r", `${config.radiusPx}px`);

      setTargetFromEvent(e);

      // Snap current position to target on entry to avoid a jump.
      cx = tx;
      cy = ty;
      start();
    }

    function onPointerMove(e) {
      // Touch/pen don't have hover, so allow drag-to-reveal.
      // Mouse keeps the hover-to-reveal behavior.
      if (e.pointerType !== "mouse") {
        active = true;
        stage.dataset.active = "true";
      } else if (!active) {
        return;
      }

      setTargetFromEvent(e);
      start();
    }

    function onPointerLeave() {
      active = false;
      stage.dataset.active = "false";
      funImage.style.setProperty("--r", "0px");

      // Stop animation when not interacting.
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function onPointerDown(e) {
      // Only handle touch/pen; mouse already works via hover.
      if (e.pointerType === "mouse") return;

      // Keep receiving move events even if the finger drifts slightly off the element.
      try {
        stage.setPointerCapture(e.pointerId);
      } catch {
        // Some browsers may throw if capture isn't allowed; safe to ignore.
      }

      active = true;
      stage.dataset.active = "true";
      funImage.style.setProperty("--r", `${config.radiusPx}px`);

      setTargetFromEvent(e);
      start();
    }

    function onPointerUp(e) {
      if (e.pointerType === "mouse") return;

      active = false;
      stage.dataset.active = "false";
      funImage.style.setProperty("--r", "0px");

      // Park lens back to center (keeps it from lingering on mobile).
      const rect = stage.getBoundingClientRect();
      tx = rect.width / 2;
      ty = rect.height / 2;
      cx = tx;
      cy = ty;
      funImage.style.setProperty("--x", `${cx}px`);
      funImage.style.setProperty("--y", `${cy}px`);
      lens.style.left = `${cx}px`;
      lens.style.top = `${cy}px`;

      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      try {
        stage.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }

    function centerOnLoad() {
      const rect = stage.getBoundingClientRect();
      tx = cx = rect.width / 2;
      ty = cy = rect.height / 2;
      funImage.style.setProperty("--x", `${cx}px`);
      funImage.style.setProperty("--y", `${cy}px`);
      funImage.style.setProperty("--r", "0px");
    }

    stage.addEventListener("pointerenter", onPointerEnter);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerleave", onPointerLeave);
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointerup", onPointerUp);
    window.addEventListener("load", centerOnLoad);

    return {
      destroy() {
        stage.removeEventListener("pointerenter", onPointerEnter);
        stage.removeEventListener("pointermove", onPointerMove);
        stage.removeEventListener("pointerleave", onPointerLeave);
        stage.removeEventListener("pointerdown", onPointerDown);
        stage.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("load", centerOnLoad);

        if (rafId) cancelAnimationFrame(rafId);
      },
    };
  }

  ns.createFlashlightLensController = createFlashlightLensController;
})(window);
