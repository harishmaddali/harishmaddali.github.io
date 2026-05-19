import { useEffect, useRef } from 'react'
import '../styles/game.css'

export default function PortfolioQuest() {
  const gameInitialized = useRef(false)

  useEffect(() => {
    if (gameInitialized.current) return

    // Load React and Babel for the tweaks panel
    const scripts = [
      {
        src: 'https://unpkg.com/react@18.3.1/umd/react.development.js',
        integrity: 'sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L',
      },
      {
        src: 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
        integrity: 'sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm',
      },
      {
        src: 'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
        integrity: 'sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y',
      },
    ]

    let loadedCount = 0
    const onLoad = () => {
      loadedCount++
      if (loadedCount === scripts.length) {
        loadGameScripts()
      }
    }

    // Load external scripts
    scripts.forEach((script) => {
      const s = document.createElement('script')
      s.src = script.src
      if (script.integrity) {
        s.integrity = script.integrity
        s.crossOrigin = 'anonymous'
      }
      s.onload = onLoad
      document.body.appendChild(s)
    })

    function loadGameScripts() {
      // Load tweaks panel first
      const tweaksPanel = document.createElement('script')
      tweaksPanel.type = 'text/babel'
      tweaksPanel.src = '/tweaks-panel.jsx'
      document.body.appendChild(tweaksPanel)

      // Load tweaks config
      const tweaksConfig = document.createElement('script')
      tweaksConfig.type = 'text/babel'
      tweaksConfig.src = '/tweaks-config.jsx'
      document.body.appendChild(tweaksConfig)

      // Load game logic
      const gameScript = document.createElement('script')
      gameScript.src = '/game.js'
      document.body.appendChild(gameScript)
    }

    gameInitialized.current = true
  }, [])

  return (
    <div id="stage">
      <div id="frame">
        <canvas
          id="game"
          width="640"
          height="360"
          aria-label="Portfolio platformer game"
        ></canvas>

        <div id="hud">
          <div className="group">
            <div className="pill">
              <span className="key">WASD</span>
              <span>/ ←→</span>
              <span>move</span>
            </div>
            <div className="pill">
              <span className="key">SPACE</span>
              <span>jump</span>
            </div>
          </div>
          <div className="group right">
            <div className="pill">
              <span className="crystal"></span>
              <span id="coinCount">0</span>
              <span>/ </span>
              <span id="coinTotal">0</span>
            </div>
            <div className="pill">
              <span>BIO</span>
              <span id="bioCount">0</span>
              <span>/ </span>
              <span id="bioTotal">8</span>
            </div>
          </div>
        </div>

        <div id="toast"></div>

        <div id="modal" role="dialog" aria-modal="true">
          <div className="card">
            <div className="eyebrow">
              <span id="mEyebrow">DATA RECOVERED</span>
              <span className="idx" id="mIdx">01 / 08</span>
            </div>
            <h2 id="mTitle">Title</h2>
            <div className="sub" id="mSub">Subtitle</div>
            <div className="body">
              <span id="mBody"></span>
              <span className="cursor" id="mCursor"></span>
            </div>
            <div className="links" id="mLinks"></div>
            <div className="foot">
              <span>▲ SECTOR UNLOCKED</span>
              <span className="hint">SPACE / CLICK TO CLOSE</span>
            </div>
          </div>
        </div>

        <div id="end">
          <div className="panel">
            <h1>QUEST COMPLETE</h1>
            <div className="ssub">All sectors unlocked — full résumé recovered.</div>
            <div className="stats">
              <div>
                <b>BIO BLOCKS</b>
                <span id="eBio">0 / 8</span>
              </div>
              <div>
                <b>CRYSTALS</b>
                <span id="eCoins">0 / 0</span>
              </div>
              <div>
                <b>TIME</b>
                <span id="eTime">00:00</span>
              </div>
            </div>
            <div className="recap" id="eRecap"></div>
            <div className="actions">
              <button id="btnReplay">REPLAY</button>
              <a
                className="btn"
                href="mailto:"
                id="btnContact"
                style={{ background: 'var(--neon-y)' }}
              >
                CONTACT
              </a>
              <a
                className="btn"
                href="https://harishmaddali.github.io/"
                target="_blank"
                rel="noopener"
                style={{
                  background: 'transparent',
                  color: 'var(--neon-c)',
                  boxShadow: 'inset 0 0 0 1px var(--neon-c)',
                }}
              >
                OLD SITE ↗
              </a>
            </div>
          </div>
        </div>

        <div id="title">
          <div className="logo">
            HARISH MADDALI
            <br />
            <span style={{ color: 'var(--neon-m)', textShadow: '0 0 14px rgba(255,61,138,.7)' }}>
              PORTFOLIO&nbsp;QUEST
            </span>
          </div>
          <div className="sub">A side-scrolling résumé. Run. Jump. Recover the data.</div>
          <button id="btnStart">▶ START</button>
          <div className="keys">
            <span>
              <b>A · D</b> or <b>← →</b>
            </span>
            <span>move</span>
            <span>
              <b>SPACE</b> · <b>W</b> · <b>↑</b>
            </span>
            <span>jump</span>
            <span>
              <b>?</b> blocks
            </span>
            <span>reveal bio (hit from below)</span>
            <span>
              <b>◆</b> crystals
            </span>
            <span>just for fun</span>
            <span>
              <b>ESC</b>
            </span>
            <span>close info card</span>
          </div>
          <div className="by">
            Product Engineering Head (AI) · 12 yrs · Voice AI / Agents / Full-stack
          </div>
        </div>

        <div id="touch">
          <div className="pad">
            <button data-key="ArrowLeft">◀</button>
            <button data-key="ArrowRight">▶</button>
          </div>
          <div className="pad">
            <button data-key=" ">▲</button>
          </div>
        </div>

        <div id="crt"></div>
        <div id="vignette"></div>
      </div>
    </div>
  )
}
