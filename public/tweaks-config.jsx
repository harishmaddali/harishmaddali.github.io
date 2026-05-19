/* Tweaks panel — gravity, jump, palette, player color */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "gravity": 0.55,
  "moveSpeed": 2.4,
  "jumpV": -9.2,
  "palette": "synthwave",
  "playerColor": "#ffd866"
}/*EDITMODE-END*/;

function QuestTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Push every tweak into the game whenever it changes
  React.useEffect(() => {
    const q = window.__quest;
    if (!q || !q.set) return;
    Object.entries(t).forEach(([k, v]) => q.set(k, v));
  }, [t.gravity, t.moveSpeed, t.jumpV, t.palette, t.playerColor]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Physics" />
      <TweakSlider
        label="Gravity" value={t.gravity} min={0.25} max={1.0} step={0.05}
        onChange={(v) => setTweak('gravity', v)}
      />
      <TweakSlider
        label="Move speed" value={t.moveSpeed} min={1.2} max={4.5} step={0.1} unit="px/f"
        onChange={(v) => setTweak('moveSpeed', v)}
      />
      <TweakSlider
        label="Jump power" value={-t.jumpV} min={5} max={14} step={0.2}
        onChange={(v) => setTweak('jumpV', -v)}
      />

      <TweakSection label="Look" />
      <TweakRadio
        label="Palette" value={t.palette}
        options={['synthwave', 'terminal', 'dawn']}
        onChange={(v) => setTweak('palette', v)}
      />
      <TweakColor
        label="Accent" value={t.playerColor}
        options={['#ffd866', '#22e8d5', '#ff3d8a', '#9a6bff', '#f4ecff']}
        onChange={(v) => setTweak('playerColor', v)}
      />

      <TweakSection label="Cheats" />
      <TweakButton
        label="Skip to end"
        onClick={() => {
          const p = window.__quest.player;
          if (p) { p.x = 4180; p.y = 200; p.vx = 0; p.vy = 0; }
        }}
      >Jump to flag</TweakButton>
      <TweakButton
        label="Reveal all bio"
        onClick={() => {
          // not destructive — just unlock all blocks (player still walks past them)
          // open them sequentially with no modal? just mark hit + bump counter
          const s = window.__quest.state;
          // iterate INFO via DOM impossible; expose helper
          window.__quest.revealAll && window.__quest.revealAll();
        }}
      >Mark all visited</TweakButton>
    </TweaksPanel>
  );
}

(function mount() {
  function tryMount() {
    if (typeof useTweaks === 'undefined' || typeof TweaksPanel === 'undefined') {
      return setTimeout(tryMount, 30);
    }
    const host = document.createElement('div');
    host.id = 'tweaks-root';
    document.body.appendChild(host);
    ReactDOM.createRoot(host).render(<QuestTweaks />);
  }
  tryMount();
})();
