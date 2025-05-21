// File: scripts/main.js

Hooks.once('init', () => {
  console.log('click-to-scene-v13 | Initializing Click-to-Scene Hotspots');
});

// Extend Drawing configuration to add a "Hotspot" tab
Hooks.on('getDrawingConfig', (drawing, config) => {
  config.tabs.push({
    navSelector: '.sheet-body',
    title: 'Hotspot',
    icon: 'fas fa-map-signs',
    tabId: 'click2scene'
  });
  const html = config.html;
  html.find('.sheet-body').append(`
    <div id="click2scene" style="margin-top:10px;">
      <label>Target Scene:</label>
      <select name="flags.click-to-scene-v13.targetScene">
        <option value="">— Select Scene —</option>
        ${game.scenes.map(s => `
          <option value="${s.id}"
            ${drawing.document.getFlag('click-to-scene-v13','targetScene') === s.id ? 'selected' : ''}>
            ${s.name}
          </option>`).join('')}
      </select>
    </div>
  `);
});

// Once the canvas is ready, listen for clicks on Drawings flagged with a target scene
Hooks.on('canvasReady', () => {
  canvas.app.renderer.plugins.interaction.on('pointerdown', event => {
    const { x, y } = event.data.getLocalPosition(canvas.stage);
    canvas.drawings.placeables.forEach(draw => {
      const targetSceneId = draw.document.getFlag('click-to-scene-v13', 'targetScene');
      if (!targetSceneId) return;
      const bounds = draw.object.getBounds();
      if (x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height) {
        const scene = game.scenes.get(targetSceneId);
        if (scene) scene.activate();
      }
    });
  });
});
