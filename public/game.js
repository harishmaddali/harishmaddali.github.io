/* Harish Maddali — Portfolio Quest
 * Original synthwave platformer. Vanilla canvas. No frameworks.
 */
(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // BIO DATA — what each info block reveals, in order along level
  // ─────────────────────────────────────────────────────────────
  const BIO = [
    {
      eyebrow: 'ORIGIN · PRESS START',
      title: 'HARISH MADDALI',
      sub: 'Product Engineering Head (AI) · 12 yrs',
      body:
        'Hi. I build software for a living.\n\n' +
        'Full-stack apps to autonomous agents.\n' +
        'Voice AI is my current obsession.\n' +
        'Startups and large enterprises, both.',
    },
    {
      eyebrow: 'NOW PLAYING',
      title: 'VOICEQUBE',
      sub: 'Product Engineering Head (AI) · Aug 2025 → now',
      body:
        'Leading AI engineering across recruitment & banking.\n\n' +
        '▸ 4 realtime voice agents shipped\n' +
        '▸ WebRTC · LiveKit · Deepgram · Cartesia\n' +
        '▸ GPT-5.1 + Claude Sonnet 3.5\n' +
        '▸ 12-person team · cloud built from zero',
    },
    {
      eyebrow: 'STARTUP BOSS-FIGHT',
      title: 'ASKIYO · CO-FOUNDER & CTO',
      sub: 'Oct 2024 → Aug 2025',
      body:
        'Low-code, AI-driven workflow SaaS.\n\n' +
        '▸ 12 agents — meetings, leads, proposals,\n' +
        '   project plans, sales training\n' +
        '▸ Hybrid evals: LLM-as-judge + human\n' +
        '▸ 0 → 10 enterprise customers · ~$30K ARR',
    },
    {
      eyebrow: 'ENTERPRISE LEVEL',
      title: 'ICICI BANK · INNOVATION LABS',
      sub: 'Engineering Manager · May 2018 → Jul 2024',
      body:
        'Six years inside a top private bank.\n\n' +
        '▸ Designed their first DevOps architecture\n' +
        '▸ No-code AI conversations platform (RAG)\n' +
        '▸ Shipped store-locator in COVID week 1\n' +
        '▸ Led 3 teams · 17 people · 12 new products',
    },
    {
      eyebrow: 'EARLY GAME',
      title: 'LIFION BY ADP',
      sub: 'Platform Engineer · Jun 2014 → May 2018',
      body:
        'First gig out of college.\n\n' +
        "▸ Built the configurable designer in React\n" +
        "▸ For ADP's no-code HCM platform\n" +
        '▸ Drag-and-drop components · payroll demos',
    },
    {
      eyebrow: 'INVENTORY',
      title: 'TECH STACK',
      sub: 'What I reach for, daily',
      body:
        'Clouds  · AWS · Azure · GCP\n' +
        'Code    · TypeScript · Python · React · Node\n' +
        'AI      · OpenAI · Anthropic · Gemini\n' +
        'Agents  · LangChain · LangGraph · Langfuse\n' +
        'Voice   · Deepgram · ElevenLabs · LiveKit\n' +
        'Vectors · Pinecone · Qdrant · Milvus\n' +
        'Ops     · Docker · K8s · Terraform · Kafka',
    },
    {
      eyebrow: 'SIDE QUESTS',
      title: 'PROJECTS',
      sub: 'Builds outside the day job',
      body:
        '▸ Jarvis AI — call-screening agent\n' +
        '   LiveKit · ElevenLabs · GPT-5.2 · LangGraph\n' +
        '▸ Pilot AI — agent management platform\n' +
        '   OpenClaw · Linux · Docker · Claude Code\n' +
        '▸ MyAroundly — proximity discovery + NLP\n' +
        '▸ TelosAir — IoT air-quality pipelines · AWS',
    },
    {
      eyebrow: 'BASE STATS',
      title: 'BITS PILANI',
      sub: 'M.Sc. (Hons.) Economics + B.E. (Hons.) Civil',
      body:
        '2009 → 2014. Five-year dual degree.\n\n' +
        'Economics taught me incentives.\n' +
        'Engineering taught me systems.\n' +
        'Software became where I use both.\n\n' +
        'Thanks for playing. Reach me from the end screen.',
    },
  ];

  // ─────────────────────────────────────────────────────────────
  // LEVEL DEFINITION
  // ─────────────────────────────────────────────────────────────
  // World is 360px tall (matches canvas). Ground top at y=300 (60px floor).
  // Player feet on ground at y=278 (player is 22 tall).
  const W = { w: 4600, h: 360, floor: 300 };

  // Solid AABBs the player collides with. Ground segments + platforms.
  // {x, y, w, h, type: 'ground' | 'plat' | 'brick'}
  const SOLIDS = [
    // Initial ground
    { x: 0,    y: 300, w: 1000, h: 60, type: 'ground' },
    // gap 1000-1090
    { x: 1090, y: 300, w: 360,  h: 60, type: 'ground' },
    // gap 1450-1520
    { x: 1520, y: 300, w: 580,  h: 60, type: 'ground' },
    // gap 2100-2200
    { x: 2200, y: 300, w: 460,  h: 60, type: 'ground' },
    // gap 2660-2740
    { x: 2740, y: 300, w: 520,  h: 60, type: 'ground' },
    // gap 3260-3320 (small)
    { x: 3320, y: 300, w: 1280, h: 60, type: 'ground' },

    // Floating platforms (positions chosen so they're reachable & lead the eye)
    { x: 320,  y: 230, w: 90, h: 14, type: 'plat' },
    { x: 540,  y: 200, w: 70, h: 14, type: 'plat' },
    { x: 740,  y: 230, w: 90, h: 14, type: 'plat' },

    // Stairs up before pit 1 → land on far side
    { x: 970,  y: 250, w: 60, h: 14, type: 'plat' },
    { x: 1050, y: 215, w: 60, h: 14, type: 'plat' },

    // After pit, build up to high block
    // (removed plat at x=1180,y=240 — it sat right where bio block 2 lives and blocked the head-bump)
    { x: 1300, y: 200, w: 80, h: 14, type: 'plat' },
    { x: 1420, y: 170, w: 80, h: 14, type: 'plat' },

    // Mid run
    { x: 1650, y: 230, w: 100, h: 14, type: 'plat' },
    { x: 1830, y: 200, w: 80, h: 14, type: 'plat' },
    { x: 1990, y: 230, w: 90, h: 14, type: 'plat' },

    // Above pit 3
    { x: 2120, y: 220, w: 60, h: 14, type: 'plat' },
    { x: 2280, y: 195, w: 80, h: 14, type: 'plat' },
    { x: 2440, y: 220, w: 70, h: 14, type: 'plat' },

    // Approach to info 7 (Projects) — stepped
    { x: 2620, y: 240, w: 70, h: 14, type: 'plat' },
    { x: 2780, y: 210, w: 90, h: 14, type: 'plat' },
    { x: 2960, y: 230, w: 90, h: 14, type: 'plat' },

    // Final climb
    { x: 3140, y: 200, w: 80, h: 14, type: 'plat' },
    { x: 3360, y: 230, w: 100, h: 14, type: 'plat' },
    { x: 3540, y: 200, w: 100, h: 14, type: 'plat' },

    // Pre-finish runway
    { x: 3760, y: 240, w: 120, h: 14, type: 'plat' },
  ];

  // 8 info blocks placed throughout.
  // Reachability rule: a block at (bx, by, h=26) is head-bumpable only if a player
  // can stand on a floor BELOW it with (head_y - block_bottom) > 0 (no overlap when
  // standing) and ≤ ~77 (max jump rise). Player height 22, so when standing on floor
  // at floor_y, head is at floor_y - 22. From ground (y=300) head is at 278, so the
  // block bottom must sit in (201, 278] → block.y in (175, 252]. We also keep each
  // block's X over a ground segment (not over a pit) and ensure no platform's top
  // sits in the "dead zone" (between the block top and block.bottom + player.h)
  // directly under the block in X — otherwise standing on that platform overlaps
  // the block and the X-collision pushes the player back out.
  const INFO = [
    { x: 220,  y: 240, idx: 0 },  // intro — over ground 0-1000, small hop
    { x: 620,  y: 220, idx: 1 },  // Voiceqube — over ground 0-1000
    { x: 1200, y: 215, idx: 2 },  // Askiyo — over ground 1090-1450 (was over pit)
    { x: 1620, y: 218, idx: 3 },  // ICICI — over ground 1520-2100 (was over pit)
    { x: 1900, y: 200, idx: 4 },  // Lifion — highest, still reachable from ground
    { x: 2400, y: 218, idx: 5 },  // Tech stack — over ground 2200-2660
    { x: 2880, y: 215, idx: 6 },  // Projects — over ground 2740-3260
    { x: 3480, y: 218, idx: 7 },  // Education — over ground 3320-4600
  ].map(o => ({ ...o, w: 26, h: 26, hit: false, bounce: 0 }));

  // Crystals (coins) — scattered
  const COINS = [
    { x: 360, y: 215 }, { x: 400, y: 215 }, { x: 440, y: 215 },
    { x: 560, y: 185 }, { x: 760, y: 215 },
    { x: 1000, y: 270 }, { x: 1040, y: 250 },
    { x: 1200, y: 225 }, { x: 1320, y: 185 }, { x: 1440, y: 155 },
    { x: 1680, y: 215 }, { x: 1860, y: 185 },
    { x: 2020, y: 215 }, { x: 2150, y: 205 },
    { x: 2310, y: 180 }, { x: 2460, y: 205 },
    { x: 2640, y: 225 }, { x: 2800, y: 195 }, { x: 2980, y: 215 },
    { x: 3160, y: 185 }, { x: 3380, y: 215 }, { x: 3560, y: 185 },
    { x: 3780, y: 225 }, { x: 3820, y: 225 }, { x: 3860, y: 225 },
  ].map(c => ({ ...c, w: 12, h: 12, taken: false, t: Math.random() * 6.28 }));

  // Decorative trees / antennae on ground — purely visual
  const DECOR = [];
  for (let i = 0; i < 40; i++) {
    DECOR.push({ x: 80 + i * 110 + ((i * 37) % 50), kind: (i * 13) % 3 });
  }

  // Far parallax mountains
  const MOUNTAINS = [];
  for (let i = 0; i < 22; i++) {
    MOUNTAINS.push({ x: i * 220 + ((i * 71) % 80), h: 90 + ((i * 53) % 70), w: 280 + ((i * 41) % 90) });
  }

  // Stars
  const STARS = [];
  for (let i = 0; i < 90; i++) {
    STARS.push({ x: Math.random() * W.w, y: Math.random() * 200, r: Math.random() * 1.4 + 0.3, tw: Math.random() * 6.28 });
  }

  // Flag goal
  const FLAG = { x: 4200, y: 300 - 86, w: 6, h: 86 };

  // World end wall (so player can't leave right side before flag)
  // handled implicitly by clamp.

  // ─────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────
  const cv = document.getElementById('game');
  const ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const state = {
    running: false,
    paused: false,        // modal open
    won: false,
    t: 0,                 // frame counter
    startTime: 0,
    elapsedMs: 0,
    bioCount: 0,
    coinCount: 0,
    lastCheckpoint: { x: 40, y: 270 },
    cam: { x: 0 },
    typewriter: { full: '', idx: 0, lastTick: 0 },
  };

  const player = {
    x: 40, y: 270, w: 14, h: 22,
    vx: 0, vy: 0,
    onGround: false,
    facing: 1,
    runT: 0,
    color: '#ffd866',     // tweakable
    hood: '#9a6bff',
    skin: '#f4ecff',
  };

  const keys = Object.create(null);
  const press = Object.create(null); // edge-triggered

  // Tweakable params (driven by Tweaks panel via window.__quest)
  const tunables = {
    gravity: 0.55,
    moveSpeed: 2.4,
    jumpV: -9.2,
    palette: 'synthwave', // synthwave | terminal | dawn
    playerColor: '#ffd866',
  };
  window.__quest = window.__quest || {};
  window.__quest.set = (k, v) => {
    if (k in tunables) tunables[k] = v;
    if (k === 'playerColor') player.color = v;
    applyPalette();
  };
  window.__quest.get = () => ({ ...tunables });

  const palettes = {
    synthwave: { skyA: '#2a1257', skyB: '#100527', mtnA: '#3a1862', mtnB: '#1c0a3a',
                 groundTop: '#5b2dbf', groundBot: '#1d0a3a', sun: '#ff3d8a', sun2: '#ffd866', grid: '#9a6bff' },
    terminal:  { skyA: '#001b1a', skyB: '#000605', mtnA: '#013634', mtnB: '#001815',
                 groundTop: '#0f6f5a', groundBot: '#022e26', sun: '#22e8d5', sun2: '#84ffd1', grid: '#22e8d5' },
    dawn:      { skyA: '#3a1230', skyB: '#1a0823', mtnA: '#5a2a52', mtnB: '#2a1130',
                 groundTop: '#d97757', groundBot: '#552020', sun: '#ffd866', sun2: '#ff8a5c', grid: '#ffb070' },
  };
  let PAL = palettes.synthwave;
  function applyPalette(){ PAL = palettes[tunables.palette] || palettes.synthwave; }

  // ─────────────────────────────────────────────────────────────
  // AUDIO — tiny WebAudio bleeps
  // ─────────────────────────────────────────────────────────────
  let audioCtx = null;
  function aCtx() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { audioCtx = { state: 'closed' }; }
    }
    return audioCtx;
  }
  function blip(freq, dur, type = 'square', vol = 0.06, slide = 0) {
    const a = aCtx(); if (!a || a.state === 'closed') return;
    const t0 = a.currentTime;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(a.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  const sfx = {
    jump:  () => blip(620, 0.14, 'square', 0.05, 220),
    coin:  () => { blip(880, 0.06, 'triangle', 0.07); setTimeout(() => blip(1320, 0.10, 'triangle', 0.07), 50); },
    bonk:  () => blip(180, 0.10, 'square', 0.05, -60),
    info:  () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => blip(f, 0.12, 'square', 0.06), i * 70)); },
    flag:  () => { [523, 659, 784, 880, 988, 1175].forEach((f, i) => setTimeout(() => blip(f, 0.14, 'triangle', 0.08), i * 90)); },
    type:  () => blip(1200, 0.015, 'square', 0.02),
  };

  // ─────────────────────────────────────────────────────────────
  // INPUT
  // ─────────────────────────────────────────────────────────────
  function setKey(k, v) {
    if (!keys[k] && v) press[k] = true;
    keys[k] = v;
  }
  window.addEventListener('keydown', e => {
    // intercept arrows/space so the page doesn't scroll
    const k = e.key;
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' ','w','a','s','d','W','A','S','D'].includes(k)) {
      e.preventDefault();
    }
    if (k === 'Escape' && state.paused) closeModal();
    if (state.paused && (k === ' ' || k === 'Enter')) { e.preventDefault(); closeModal(); return; }
    setKey(k.toLowerCase(), true);
    setKey(k, true);
  });
  window.addEventListener('keyup', e => {
    setKey(e.key.toLowerCase(), false);
    setKey(e.key, false);
  });

  // Touch controls
  if ('ontouchstart' in window) document.body.classList.add('touch');
  document.querySelectorAll('#touch button').forEach(btn => {
    const k = btn.getAttribute('data-key');
    const down = e => { e.preventDefault(); setKey(k, true); setKey(k.toLowerCase(), true); };
    const up   = e => { e.preventDefault(); setKey(k, false); setKey(k.toLowerCase(), false); };
    btn.addEventListener('touchstart', down, { passive: false });
    btn.addEventListener('touchend', up);
    btn.addEventListener('mousedown', down);
    btn.addEventListener('mouseup', up);
    btn.addEventListener('mouseleave', up);
  });

  // ─────────────────────────────────────────────────────────────
  // MODAL
  // ─────────────────────────────────────────────────────────────
  const modal = document.getElementById('modal');
  const mTitle = document.getElementById('mTitle');
  const mSub = document.getElementById('mSub');
  const mBody = document.getElementById('mBody');
  const mEyebrow = document.getElementById('mEyebrow');
  const mIdx = document.getElementById('mIdx');
  const mCursor = document.getElementById('mCursor');

  function openModal(idx) {
    const b = BIO[idx];
    state.paused = true;
    mEyebrow.textContent = b.eyebrow;
    mIdx.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(BIO.length).padStart(2, '0');
    mTitle.textContent = b.title;
    mSub.textContent = b.sub;
    mBody.textContent = '';
    state.typewriter.full = b.body;
    state.typewriter.idx = 0;
    state.typewriter.lastTick = performance.now();
    modal.classList.add('show');
    sfx.info();
  }
  function closeModal() {
    state.paused = false;
    modal.classList.remove('show');
    // finish typewriter so re-open isn't weird
    state.typewriter.full = '';
  }
  modal.addEventListener('click', () => {
    // if typewriter still running, click finishes it; second click closes
    if (state.typewriter.idx < state.typewriter.full.length) {
      state.typewriter.idx = state.typewriter.full.length;
      mBody.textContent = state.typewriter.full;
    } else {
      closeModal();
    }
  });

  function toast(text, ms = 1400) {
    const el = document.getElementById('toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), ms);
  }

  // ─────────────────────────────────────────────────────────────
  // PHYSICS
  // ─────────────────────────────────────────────────────────────
  function aabb(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function step() {
    state.t++;

    // input
    const left  = keys['arrowleft']  || keys['a'] || keys['ArrowLeft'];
    const right = keys['arrowright'] || keys['d'] || keys['ArrowRight'];
    const jump  = keys[' ']          || keys['arrowup'] || keys['w'] || keys['ArrowUp'];

    // horizontal
    let ax = 0;
    if (left)  ax -= 1;
    if (right) ax += 1;
    const target = ax * tunables.moveSpeed;
    // smooth toward target (accel/friction)
    const accel = player.onGround ? 0.6 : 0.35;
    if (player.vx < target) player.vx = Math.min(target, player.vx + accel);
    else if (player.vx > target) player.vx = Math.max(target, player.vx - accel);
    if (ax !== 0) player.facing = ax > 0 ? 1 : -1;
    if (ax === 0 && player.onGround) player.vx *= 0.78;
    if (Math.abs(player.vx) < 0.05) player.vx = 0;

    // jump
    if (jump && player.onGround) {
      player.vy = tunables.jumpV;
      player.onGround = false;
      sfx.jump();
    }
    // variable jump — release early to cut
    if (!jump && player.vy < -4) player.vy += 0.35;

    // gravity
    player.vy += tunables.gravity;
    if (player.vy > 12) player.vy = 12;

    // run animation timer
    if (player.onGround && Math.abs(player.vx) > 0.3) player.runT += Math.abs(player.vx) * 0.18;

    // X movement + collisions
    player.x += player.vx;
    if (player.x < 0) { player.x = 0; player.vx = 0; }
    if (player.x + player.w > W.w) { player.x = W.w - player.w; player.vx = 0; }

    for (const s of SOLIDS) {
      if (aabb(player, s)) {
        if (player.vx > 0)      player.x = s.x - player.w;
        else if (player.vx < 0) player.x = s.x + s.w;
        player.vx = 0;
      }
    }
    // info blocks block horizontally too
    for (const ib of INFO) {
      if (aabb(player, ib)) {
        if (player.vx > 0)      player.x = ib.x - player.w;
        else if (player.vx < 0) player.x = ib.x + ib.w;
        player.vx = 0;
      }
    }

    // Y movement
    player.y += player.vy;
    player.onGround = false;
    for (const s of SOLIDS) {
      if (aabb(player, s)) {
        if (player.vy > 0) {
          player.y = s.y - player.h;
          player.vy = 0;
          player.onGround = true;
        } else if (player.vy < 0) {
          player.y = s.y + s.h;
          player.vy = 0;
        }
      }
    }

    // Info blocks: hitting from below triggers reveal, hitting top is platform
    for (const ib of INFO) {
      if (aabb(player, ib)) {
        if (player.vy > 0) {
          // landed on top
          player.y = ib.y - player.h;
          player.vy = 0;
          player.onGround = true;
        } else if (player.vy < 0) {
          // head-bump from below
          player.y = ib.y + ib.h;
          player.vy = 1.5;
          ib.bounce = 8;
          if (!ib.hit) {
            ib.hit = true;
            state.bioCount++;
            updateHud();
            openModal(ib.idx);
            // checkpoint at this block
            state.lastCheckpoint = { x: Math.max(player.x - 40, 20), y: 270 };
          } else {
            sfx.bonk();
          }
        }
      }
      if (ib.bounce > 0) ib.bounce -= 0.8;
    }

    // coins
    for (const c of COINS) {
      if (c.taken) continue;
      c.t += 0.12;
      if (aabb(player, c)) {
        c.taken = true;
        state.coinCount++;
        updateHud();
        sfx.coin();
      }
    }

    // fall — respawn at last checkpoint
    if (player.y > 420) {
      player.x = state.lastCheckpoint.x;
      player.y = state.lastCheckpoint.y;
      player.vx = 0; player.vy = 0;
      sfx.bonk();
    }

    // flag
    if (!state.won && player.x + player.w > FLAG.x && player.x < FLAG.x + 30) {
      state.won = true;
      sfx.flag();
      showEnd();
    }

    // camera
    const targetCam = Math.max(0, Math.min(W.w - cv.width, player.x + player.w / 2 - cv.width / 2));
    state.cam.x += (targetCam - state.cam.x) * 0.15;
  }

  function updateHud() {
    document.getElementById('coinCount').textContent = state.coinCount;
    document.getElementById('coinTotal').textContent = COINS.length;
    document.getElementById('bioCount').textContent = state.bioCount;
    document.getElementById('bioTotal').textContent = BIO.length;
    if (state.bioCount > 0 && state.bioCount <= BIO.length) {
      toast(`+ BIO ${String(state.bioCount).padStart(2, '0')} / ${BIO.length}`);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  function px(n) { return Math.round(n); }
  function r(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(px(x), px(y), Math.max(1, px(w)), Math.max(1, px(h)));
  }

  function draw() {
    // Sky gradient
    const g = ctx.createLinearGradient(0, 0, 0, cv.height);
    g.addColorStop(0, PAL.skyA);
    g.addColorStop(1, PAL.skyB);
    ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height);

    // Stars (parallax 0.2x)
    const camX = state.cam.x;
    for (const s of STARS) {
      const sx = s.x - camX * 0.2;
      const x = ((sx % (W.w)) + W.w) % W.w;
      if (x < -2 || x > cv.width + 2) continue;
      const tw = 0.5 + 0.5 * Math.sin(state.t * 0.04 + s.tw);
      ctx.globalAlpha = 0.5 + tw * 0.5;
      r(x, s.y, s.r * 2, s.r * 2, '#f4ecff');
    }
    ctx.globalAlpha = 1;

    // Sun
    const sunX = 480 - state.cam.x * 0.05;
    const sunY = 70;
    const gr = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 80);
    gr.addColorStop(0, PAL.sun2);
    gr.addColorStop(0.4, PAL.sun);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gr;
    ctx.fillRect(sunX - 90, sunY - 90, 180, 180);
    // sun stripes
    for (let i = 0; i < 5; i++) {
      r(sunX - 36, sunY + 10 + i * 6, 72, 2, PAL.skyA);
    }

    // Grid horizon
    ctx.strokeStyle = PAL.grid;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 1;
    const horizonY = 200;
    for (let i = 0; i < 8; i++) {
      const yy = horizonY + i * (i + 1) * 1.6;
      ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(cv.width, yy); ctx.stroke();
    }
    // vertical grid converging
    const vp = cv.width / 2 - state.cam.x * 0.1;
    for (let i = -12; i <= 12; i++) {
      const x0 = vp + i * 30;
      const x1 = vp + i * 90;
      ctx.beginPath(); ctx.moveTo(x0, horizonY); ctx.lineTo(x1, horizonY + 100); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Mountains (parallax 0.4x)
    for (const m of MOUNTAINS) {
      const mx = m.x - state.cam.x * 0.4;
      if (mx + m.w < 0 || mx > cv.width) continue;
      ctx.fillStyle = PAL.mtnA;
      ctx.beginPath();
      ctx.moveTo(mx, 300);
      ctx.lineTo(mx + m.w / 2, 300 - m.h);
      ctx.lineTo(mx + m.w, 300);
      ctx.closePath();
      ctx.fill();
      // outline
      ctx.strokeStyle = PAL.grid;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(mx, 300);
      ctx.lineTo(mx + m.w / 2, 300 - m.h);
      ctx.lineTo(mx + m.w, 300);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Mid parallax (closer mountains)
    for (const m of MOUNTAINS) {
      const mx = m.x * 0.7 + 100 - state.cam.x * 0.65;
      const mh = m.h * 0.7;
      const mw = m.w * 0.8;
      if (mx + mw < 0 || mx > cv.width) continue;
      ctx.fillStyle = PAL.mtnB;
      ctx.beginPath();
      ctx.moveTo(mx, 300);
      ctx.lineTo(mx + mw / 2, 300 - mh);
      ctx.lineTo(mx + mw, 300);
      ctx.closePath();
      ctx.fill();
    }

    // Decor (antennae)
    for (const d of DECOR) {
      const dx = d.x - state.cam.x;
      if (dx < -10 || dx > cv.width + 10) continue;
      // base
      r(dx, 290, 2, 12, PAL.mtnB);
      if (d.kind === 0) {
        // antenna
        r(dx - 1, 270, 4, 4, PAL.grid);
        r(dx + 0.5, 250, 1, 22, PAL.grid);
        ctx.globalAlpha = 0.6; r(dx, 248, 2, 2, PAL.sun); ctx.globalAlpha = 1;
      } else if (d.kind === 1) {
        // billboard
        r(dx - 5, 270, 12, 8, PAL.mtnA);
        r(dx - 4, 271, 10, 1, PAL.sun);
        r(dx - 4, 274, 6, 1, PAL.grid);
      } else {
        // palm-ish
        r(dx, 268, 2, 22, PAL.mtnB);
        r(dx - 5, 264, 12, 2, PAL.grid);
        r(dx - 3, 260, 8, 2, PAL.grid);
      }
    }

    // Camera transform from here on
    ctx.save();
    ctx.translate(-Math.round(state.cam.x), 0);

    // Ground segments
    for (const s of SOLIDS) {
      if (s.x + s.w < state.cam.x - 20 || s.x > state.cam.x + cv.width + 20) continue;
      if (s.type === 'ground') {
        // top strip
        r(s.x, s.y, s.w, 4, PAL.groundTop);
        r(s.x, s.y + 4, s.w, 2, '#000');
        // body
        r(s.x, s.y + 6, s.w, s.h - 6, PAL.groundBot);
        // grid lines on ground
        ctx.strokeStyle = PAL.grid;
        ctx.globalAlpha = 0.2;
        for (let gx = Math.floor(s.x / 24) * 24; gx < s.x + s.w; gx += 24) {
          ctx.beginPath(); ctx.moveTo(gx, s.y + 8); ctx.lineTo(gx, s.y + s.h); ctx.stroke();
        }
        for (let gy = s.y + 16; gy < s.y + s.h; gy += 16) {
          ctx.beginPath(); ctx.moveTo(s.x, gy); ctx.lineTo(s.x + s.w, gy); ctx.stroke();
        }
        ctx.globalAlpha = 1;
      } else if (s.type === 'plat') {
        // floating platform: neon edge + dark fill
        r(s.x, s.y, s.w, s.h, PAL.groundBot);
        r(s.x, s.y, s.w, 2, PAL.sun);
        r(s.x, s.y + s.h - 1, s.w, 1, PAL.grid);
      }
    }

    // Info blocks
    for (const ib of INFO) {
      if (ib.x + ib.w < state.cam.x - 20 || ib.x > state.cam.x + cv.width + 20) continue;
      const yy = ib.y - (ib.bounce > 0 ? ib.bounce : 0);
      if (!ib.hit) {
        // Active glowing block with "?"
        // glow
        ctx.globalAlpha = 0.3 + 0.2 * Math.sin(state.t * 0.15);
        r(ib.x - 4, yy - 4, ib.w + 8, ib.h + 8, PAL.sun);
        ctx.globalAlpha = 1;
        // body
        r(ib.x, yy, ib.w, ib.h, PAL.sun);
        // inner border
        r(ib.x + 2, yy + 2, ib.w - 4, ib.h - 4, '#0a0418');
        // "?"
        drawGlyph('?', ib.x + ib.w / 2 - 4, yy + 5, PAL.sun);
        // rivets
        r(ib.x + 1, yy + 1, 2, 2, '#0a0418');
        r(ib.x + ib.w - 3, yy + 1, 2, 2, '#0a0418');
        r(ib.x + 1, yy + ib.h - 3, 2, 2, '#0a0418');
        r(ib.x + ib.w - 3, yy + ib.h - 3, 2, 2, '#0a0418');
      } else {
        // Spent — dim, with checkmark
        r(ib.x, yy, ib.w, ib.h, '#2a1257');
        r(ib.x + 1, yy + 1, ib.w - 2, ib.h - 2, '#15082c');
        // check
        r(ib.x + 8,  yy + 14, 3, 3, PAL.sun2);
        r(ib.x + 11, yy + 16, 3, 3, PAL.sun2);
        r(ib.x + 14, yy + 13, 3, 3, PAL.sun2);
        r(ib.x + 17, yy + 10, 3, 3, PAL.sun2);
      }
    }

    // Coins
    for (const c of COINS) {
      if (c.taken) continue;
      if (c.x + c.w < state.cam.x - 20 || c.x > state.cam.x + cv.width + 20) continue;
      const phase = Math.sin(c.t);
      const ww = Math.max(2, Math.abs(phase) * 12);
      const bob = Math.sin(c.t * 0.7) * 2;
      const cx = c.x + 6, cy = c.y + 6 + bob;
      // glow
      ctx.globalAlpha = 0.35;
      r(cx - 6, cy - 6, 12, 12, PAL.sun);
      ctx.globalAlpha = 1;
      // diamond (rotated square) approximated by stacked rects
      const half = ww / 2;
      for (let i = 0; i < 6; i++) {
        const yy = cy - 6 + i * 2;
        const h = Math.max(0.5, 6 - Math.abs(i - 2.5) * 2);
        r(cx - half, yy, ww, 2, i % 2 ? PAL.sun2 : PAL.grid);
      }
      // highlight
      r(cx - 1, cy - 5, 2, 2, '#fff');
    }

    // Flag
    {
      const f = FLAG;
      if (!(f.x + 60 < state.cam.x || f.x > state.cam.x + cv.width)) {
        // pole
        r(f.x, f.y, 2, f.h, PAL.sun2);
        // base
        r(f.x - 4, f.y + f.h - 6, 10, 6, PAL.grid);
        // flag fabric (animated)
        const wob = Math.sin(state.t * 0.12) * 2;
        ctx.fillStyle = PAL.sun;
        ctx.beginPath();
        ctx.moveTo(f.x + 2, f.y + 4);
        ctx.lineTo(f.x + 22 + wob, f.y + 10);
        ctx.lineTo(f.x + 2, f.y + 18);
        ctx.closePath(); ctx.fill();
        // HM monogram on flag
        ctx.fillStyle = '#0a0418';
        ctx.font = 'bold 8px "JetBrains Mono", monospace';
        ctx.fillText('HM', f.x + 6, f.y + 14);
      }
    }

    // Player
    drawPlayer();

    ctx.restore();

    // Foreground scanlines & particles (in screen space)
    // little dust under feet when running
    if (player.onGround && Math.abs(player.vx) > 1) {
      const dx = player.x - state.cam.x + (player.facing > 0 ? -2 : player.w);
      const dy = player.y + player.h - 3;
      ctx.globalAlpha = 0.6;
      r(dx, dy, 2, 1, PAL.grid);
      r(dx + (player.facing > 0 ? -3 : 3), dy - 1, 1, 1, PAL.grid);
      ctx.globalAlpha = 1;
    }

    // Edge label: distance to next bio block
    const next = INFO.find(i => !i.hit);
    if (next && !state.won) {
      const dist = (next.x - (player.x + player.w / 2));
      if (Math.abs(dist) > cv.width / 2) {
        const arrowX = dist > 0 ? cv.width - 18 : 8;
        ctx.fillStyle = PAL.sun;
        ctx.globalAlpha = 0.6 + 0.4 * Math.sin(state.t * 0.2);
        ctx.font = 'bold 10px "Press Start 2P", monospace';
        ctx.fillText(dist > 0 ? '▶' : '◀', arrowX, 200);
        ctx.globalAlpha = 1;
      }
    }
  }

  // Player sprite — drawn procedurally
  function drawPlayer() {
    const p = player;
    const x = px(p.x), y = px(p.y);
    const f = p.facing; // 1 right, -1 left
    // shadow
    ctx.globalAlpha = 0.35;
    r(x - 1, p.y + p.h, p.w + 2, 1, '#000');
    ctx.globalAlpha = 1;

    // hood / body
    const hood = p.hood;
    const skin = p.skin;
    const accent = p.color;

    // Body (cloak)
    r(x + 1, y + 6, p.w - 2, 12, hood);
    // hood up around head
    r(x + 2, y + 1, p.w - 4, 5, hood);
    r(x + 1, y + 2, p.w - 2, 4, hood);
    // face shadow inside hood
    r(x + 3, y + 3, p.w - 6, 3, skin);
    // eyes (cyan glow)
    const eyeY = y + 4;
    if (f > 0) {
      r(x + 8, eyeY, 2, 1, '#22e8d5');
    } else {
      r(x + 4, eyeY, 2, 1, '#22e8d5');
    }
    // belt / accent
    r(x + 1, y + 13, p.w - 2, 1, accent);

    // legs — running animation
    let legAOff = 0, legBOff = 0;
    if (p.onGround && Math.abs(p.vx) > 0.3) {
      legAOff = Math.sin(p.runT) > 0 ? 0 : 1;
      legBOff = Math.sin(p.runT) > 0 ? 1 : 0;
    } else if (!p.onGround) {
      // jump pose
      legAOff = 0; legBOff = 1;
    }
    r(x + 2,           y + 18 + legAOff, 3, 4 - legAOff, hood);
    r(x + p.w - 5,     y + 18 + legBOff, 3, 4 - legBOff, hood);
    // boots
    r(x + 2,           y + 21, 3, 1, accent);
    r(x + p.w - 5,     y + 21, 3, 1, accent);

    // arm (front) — small forward
    if (f > 0) r(x + p.w - 3, y + 8 + Math.sin(p.runT) * 0.5, 2, 5, hood);
    else       r(x + 1,       y + 8 + Math.sin(p.runT) * 0.5, 2, 5, hood);
  }

  // Tiny glyph drawer for the "?" symbol (so it stays pixelated)
  function drawGlyph(g, x, y, color) {
    // simple 5x7 pixel "?" font, hardcoded
    const Q = [
      ' ███ ',
      '█   █',
      '    █',
      '   █ ',
      '  █  ',
      '     ',
      '  █  ',
    ];
    if (g !== '?') return;
    ctx.fillStyle = color;
    for (let row = 0; row < Q.length; row++) {
      for (let col = 0; col < Q[row].length; col++) {
        if (Q[row][col] === '█') {
          ctx.fillRect(px(x + col * 2), px(y + row * 2), 2, 2);
        }
      }
    }
    // border to read on yellow block
    ctx.fillStyle = '#0a0418';
    // already drawn — keep
  }

  // ─────────────────────────────────────────────────────────────
  // TYPEWRITER for modal
  // ─────────────────────────────────────────────────────────────
  function tickTypewriter(now) {
    const tw = state.typewriter;
    if (!tw.full || tw.idx >= tw.full.length) return;
    if (now - tw.lastTick < 16) return;
    tw.lastTick = now;
    const inc = 2;
    tw.idx = Math.min(tw.full.length, tw.idx + inc);
    mBody.textContent = tw.full.slice(0, tw.idx);
    if (tw.idx % 4 === 0 && tw.idx < tw.full.length) sfx.type();
  }

  // ─────────────────────────────────────────────────────────────
  // END SCREEN
  // ─────────────────────────────────────────────────────────────
  function showEnd() {
    state.elapsedMs = performance.now() - state.startTime;
    const m = Math.floor(state.elapsedMs / 60000);
    const s = Math.floor((state.elapsedMs % 60000) / 1000);
    document.getElementById('eBio').textContent = `${state.bioCount} / ${BIO.length}`;
    document.getElementById('eCoins').textContent = `${state.coinCount} / ${COINS.length}`;
    document.getElementById('eTime').textContent =
      String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');

    const recap = document.getElementById('eRecap');
    recap.innerHTML = BIO.map((b, i) => {
      const visited = INFO[i].hit;
      return `<h3>${visited ? '✓' : '·'} ${b.title}</h3><div>${b.sub}</div><div style="opacity:.85">${b.body.replace(/\n/g, '<br/>')}</div>`;
    }).join('');

    document.getElementById('end').classList.add('show');
  }
  document.getElementById('btnReplay').addEventListener('click', () => {
    location.reload();
  });

  // ─────────────────────────────────────────────────────────────
  // MAIN LOOP
  // ─────────────────────────────────────────────────────────────
  let last = 0;
  function loop(now) {
    requestAnimationFrame(loop);
    if (!state.running) { draw(); return; }
    if (state.paused) { draw(); tickTypewriter(now); return; }

    // fixed-step style with cap
    if (!last) last = now;
    let dt = Math.min(40, now - last);
    last = now;

    // run physics at ~60Hz regardless of refresh
    const steps = Math.max(1, Math.round(dt / 16.7));
    for (let i = 0; i < steps; i++) step();

    draw();
    // clear edge-triggered presses
    for (const k in press) press[k] = false;
  }

  // ─────────────────────────────────────────────────────────────
  // START
  // ─────────────────────────────────────────────────────────────
  function startGame() {
    document.getElementById('title').classList.add('hidden');
    state.running = true;
    state.startTime = performance.now();
    updateHud();
    // resume audio context on first interaction
    aCtx();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }
  document.getElementById('btnStart').addEventListener('click', startGame);
  window.addEventListener('keydown', e => {
    if (!state.running && (e.key === 'Enter' || e.key === ' ')) startGame();
  });

  // Initial draw so the title screen has a backdrop
  applyPalette();
  updateHud();
  requestAnimationFrame(loop);

  // Expose for debugging / Tweaks
  window.__quest.state = state;
  window.__quest.player = player;
  window.__quest.tunables = tunables;
  window.__quest.revealAll = () => {
    for (const ib of INFO) {
      if (!ib.hit) { ib.hit = true; state.bioCount++; }
    }
    document.getElementById('bioCount').textContent = state.bioCount;
  };
})();
