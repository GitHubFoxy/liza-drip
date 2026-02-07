// App entrypoint.
// Keeps `index.html` mostly markup/styles, and puts behavior into small, focused files.

(() => {
  function mustGetEl(id) {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Missing element #${id}`);
    return el;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const stage = mustGetEl("imageStage");
    const funImage = mustGetEl("funImage");
    const lens = mustGetEl("cursorLens");

    // Expose the controller on the global namespace so it can be inspected in DevTools.
    window.LisaDrip = window.LisaDrip || {};
    window.LisaDrip.flashlight = window.LisaDrip.createFlashlightLensController({
      stage,
      funImage,
      lens,
      config: window.LisaDrip.lensConfig,
    });
  });
})();
