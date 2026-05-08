const fs = require('fs');
const content = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Simulados — Núcleo Tático</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  --bg: #0a0a0f;
  --card: #12121a;
  --card-hover: #1a1a28;
  --border: #1e1e2e;
  --border-light: #2a2a3e;
  --accent: #6366f1;
  --accent-glow: rgba(99,102,241,0.25);
  --accent-dim: #4f46e5;
  --text: #e8e8f0;
  --text-dim: #8888a0;
  --text-muted: #5a5a72;
  --green: #22c55e;
  --green-glow: rgba(34,197,94,0.2);
  --red: #ef4444;
  --red-glow: rgba(239,68,68,0.2);
  --amber: #f59e0b;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 4px 24px rgba(0,0,0,0.4);
  --transition: 0.25s cubic-bezier(0.4,0,0.2,1);
}
html { scroll-behavior: smooth; }
body {
  font-family: 'Inter', -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
}
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.08), transparent 70%);
  pointer-events: none;
  z-index: 0;
}
.container {
  width: 100%;
  max-width: 820px;
  padding: 24px 20px;
  position: relative;
  z-index: 1;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}
.header .logo-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent), var(--accent-dim));
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 800; color: #fff;
  flex-shrink: 0;
}
.header h1 {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.3px;
}
.header h1 span { color: var(--accent); }
.header .subtitle {
  font-size: 13px;
  color: var(--text-dim);
  margin-top: 2px;
}

/* Glass card */
.glass {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  backdrop-filter: blur(12px);
  padding: 24px;
  transition: border-color var(--transition);
}
.glass:hover { border-color: var(--border-light); }

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: var(--radius-sm);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all var(--transition);
  outline: none;
  user-select: none;
  white-space: nowrap;
}
.btn-primary {
  background: linear-gradient(135deg, var(--accent), #818cf8);
  color: #fff;
  box-shadow: 0 2px 12px rgba(99,102,241,0.3);
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(99,102,241,0.4);
}
.btn-primary:active { transform: translateY(0); }
.btn-secondary {
  background: transparent;
  color: var(--text);
  border-color: var(--border-light);
}
.btn-secondary:hover {
  background: var(--card-hover);
  border-color: var(--accent);
  color: var(--accent);
}
.btn-ghost {
  background: transparent;
  color: var(--text-dim);
  padding: 8px 16px;
  font-size: 13px;
}
.btn-ghost:hover { color: var(--text); background: rgba(255,255,255,0.05); }
.btn-sm { padding: 8px 18px; font-size: 13px; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

/* Section switcher */
.section { display: none; animation: fadeIn 0.3s ease; }
.section.active { display: block; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
  0%,100% { opacity: 1; }
  50% { opacity: 0.6; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

/* ========== MODE 1: CONFIG ========== */
.config-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}
.config-desc {
  font-size: 14px;
  color: var(--text-dim);
  margin-bottom: 24px;
}

/* Slider */
.slider-group {
  margin-bottom: 28px;
}
.slider-group label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
}
.slider-group label .val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  color: var(--accent);
  font-weight: 700;
}
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--border-light);
  outline: none;
  cursor: pointer;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  box-shadow: 0 0 12px var(--accent-glow);
  transition: box-shadow var(--transition);
}
input[type="range"]::-webkit-slider-thumb:hover { box-shadow: 0 0 20px var(--accent-glow); }
input[type="range"]::-moz-range-thumb {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  border: none;
  box-shadow: 0 0 12px var(--accent-glow);
}

/* Filter sections */
.filter-section {
  margin-bottom: 24px;
}
.filter-section .filter-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-dim);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pill {
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border-light);
  background: transparent;
  color: var(--text-dim);
  transition: all var(--transition);
  user-select: none;
  font-family: 'Inter', sans-serif;
}
.pill:hover { border-color: var(--accent); color: var(--text); }
.pill.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  box-shadow: 0 0 12px var(--accent-glow);
}

/* Start button */
.start-area {
  margin-top: 32px;
  text-align: center;
}
.btn-start {
  padding: 16px 48px;
  font-size: 17px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, var(--accent), #818cf8);
  box-shadow: 0 4px 24px var(--accent-glow);
  position: relative;
  overflow: hidden;
}
.btn-start::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.08) 60%, transparent 80%);
  pointer-events: none;
}
.btn-start:hover {
  box-shadow: 0 6px 32px var(--accent-glow);
}
.start-info {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 10px;
}

/* ========== MODE 2: ACTIVE ========== */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 16px;
}
.top-bar .q-counter {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}
.top-bar .q-counter span { color: var(--accent); }
.top-bar .timer {
  font-family: 'JetBrains Mono', monospace;
  font-size: 17px;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 6px;
}
.top-bar .timer.warning { color: var(--amber); }
.top-bar .timer.danger { color: var(--red); animation: pulse 0.8s infinite; }
.top-bar .timer-icon { font-size: 15px; }

/* Progress bar */
.progress-container {
  width: 100%;
  height: 4px;
  background: var(--border-light);
  border-radius: 2px;
  margin-bottom: 20px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, var(--accent), #818cf8);
  border-radius: 2px;
  transition: width 0.5s ease;
}

/* Question card */
.question-card {
  margin-bottom: 20px;
}
.question-card .q-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.question-card .q-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.question-card .q-meta .tag {
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(99,102,241,0.12);
  color: var(--accent);
  border: 1px solid rgba(99,102,241,0.2);
}
.question-card .q-meta .tag.banca-tag {
  background: rgba(245,158,11,0.10);
  color: var(--amber);
  border-color: rgba(245,158,11,0.2);
}
.question-card .enunciado {
  font-size: 16px;
  line-height: 1.7;
  color: var(--text);
  margin-bottom: 20px;
}

/* Alternatives */
.alts { display: flex; flex-direction: column; gap: 8px; }
.alt-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 18px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: rgba(18,18,26,0.6);
  cursor: pointer;
  transition: all var(--transition);
  position: relative;
}
.alt-card:hover {
  border-color: var(--border-light);
  background: var(--card-hover);
}
.alt-card .letter {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-dim);
  flex-shrink: 0;
  transition: all var(--transition);
}
.alt-card .alt-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  padding-top: 3px;
  color: var(--text);
}
.alt-card .result-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  opacity: 0;
  transition: opacity 0.2s;
}

/* Selected state */
.alt-card.selected {
  border-color: var(--accent);
  background: rgba(99,102,241,0.08);
  box-shadow: 0 0 16px var(--accent-glow);
}
.alt-card.selected .letter {
  background: var(--accent);
  color: #fff;
}

/* Correct/wrong states */
.alt-card.correct {
  border-color: var(--green) !important;
  background: rgba(34,197,94,0.08) !important;
  box-shadow: 0 0 16px var(--green-glow) !important;
  pointer-events: none;
}
.alt-card.correct .letter { background: var(--green) !important; color: #fff !important; }
.alt-card.correct .result-icon { opacity: 1; color: var(--green); }
.alt-card.wrong {
  border-color: var(--red) !important;
  background: rgba(239,68,68,0.08) !important;
  box-shadow: 0 0 16px var(--red-glow) !important;
  pointer-events: none;
}
.alt-card.wrong .letter { background: var(--red) !important; color: #fff !important; }
.alt-card.wrong .result-icon { opacity: 1; color: var(--red); }
.alt-card.reveal-correct {
  border-color: var(--green) !important;
  background: rgba(34,197,94,0.06) !important;
  pointer-events: none;
}
.alt-card.reveal-correct .letter { background: var(--green) !important; color: #fff !important; }
.alt-card.disabled { pointer-events: none; }

/* Bottom bar */
.bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}
.bottom-bar .answered-count {
  font-size: 13px;
  color: var(--text-dim);
}

/* ========== MODE 3: RESULTS ========== */
.results-header {
  text-align: center;
  margin-bottom: 28px;
}
.results-header h2 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}
.results-header p {
  font-size: 14px;
  color: var(--text-dim);
}

/* Donut */
.donut-container {
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
}
.donut-ring {
  position: relative;
  width: 180px;
  height: 180px;
}
.donut-ring svg { transform: rotate(-90deg); }
.donut-ring .bg-circle { fill: none; stroke: var(--border-light); stroke-width: 8; }
.donut-ring .fg-circle {
  fill: none;
  stroke: url(#donutGrad);
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 502.65;
  stroke-dashoffset: 502.65;
  transition: stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1);
}
.donut-ring .fg-circle.animate { stroke-dashoffset: var(--offset); }
.donut-ring .score-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.donut-ring .score-text .score-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 36px;
  font-weight: 700;
  color: var(--text);
  line-height: 1;
}
.donut-ring .score-text .score-label {
  font-size: 13px;
  color: var(--text-dim);
  margin-top: 4px;
}
.donut-ring .score-text .score-pct {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  font-weight: 600;
  color: var(--accent);
  margin-top: 2px;
}

/* Stats row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}
.stat-item {
  text-align: center;
  padding: 16px 12px;
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
}
.stat-item .stat-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
}
.stat-item .stat-label {
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.stat-item.acertos .stat-num { color: var(--green); }
.stat-item.erros .stat-num { color: var(--red); }
.stat-item.tempo .stat-num { color: var(--accent); font-size: 16px; }

/* Category breakdown */
.cat-breakdown {
  margin-bottom: 28px;
}
.cat-breakdown h3 {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-dim);
  margin-bottom: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.cat-bar-item {
  margin-bottom: 14px;
  animation: slideUp 0.4s ease backwards;
}
.cat-bar-item:nth-child(1) { animation-delay: 0.05s; }
.cat-bar-item:nth-child(2) { animation-delay: 0.1s; }
.cat-bar-item:nth-child(3) { animation-delay: 0.15s; }
.cat-bar-item:nth-child(4) { animation-delay: 0.2s; }
.cat-bar-item:nth-child(5) { animation-delay: 0.25s; }
.cat-bar-item:nth-child(6) { animation-delay: 0.3s; }
.cat-bar-item:nth-child(7) { animation-delay: 0.35s; }
.cat-bar-item:nth-child(8) { animation-delay: 0.4s; }
.cat-bar-item .cat-bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 5px;
}
.cat-bar-item .cat-bar-label .name { color: var(--text); font-weight: 500; }
.cat-bar-item .cat-bar-label .score {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--text-dim);
}
.cat-bar-item .cat-bar-track {
  height: 6px;
  background: var(--border-light);
  border-radius: 3px;
  overflow: hidden;
}
.cat-bar-item .cat-bar-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--accent), #818cf8);
  width: 0%;
  transition: width 1s cubic-bezier(0.4,0,0.2,1);
}

/* Results actions */
.results-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Review mode */
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.review-header h2 {
  font-size: 18px;
  font-weight: 700;
}
.review-header .back-btn {
  font-size: 13px;
  color: var(--text-dim);
  cursor: pointer;
  background: none;
  border: none;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color var(--transition);
}
.review-header .back-btn:hover { color: var(--accent); }
.review-card {
  margin-bottom: 20px;
}
.review-card .enunciado { font-size: 15px; margin-bottom: 16px; }
.review-card .explicacao {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-dim);
  padding: 16px;
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  margin-top: 16px;
  border-left: 3px solid var(--accent);
}
.review-card .explicacao .ex-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}
.empty-state .empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}
.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}
.empty-state p {
  font-size: 14px;
  color: var(--text-dim);
  margin-bottom: 20px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}
.empty-state .browse-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}
.empty-state .browse-link:hover { text-decoration: underline; }

/* Responsive */
@media (max-width: 600px) {
  .container { padding: 16px 14px; }
  .glass { padding: 18px; }
  .header h1 { font-size: 19px; }
  .stats-row { grid-template-columns: 1fr; }
  .alt-card { padding: 12px 14px; }
  .top-bar { flex-wrap: wrap; }
  .btn-start { padding: 14px 32px; font-size: 15px; }
  .donut-ring { width: 150px; height: 150px; }
  .donut-ring .score-text .score-num { font-size: 30px; }
}
</style>
</head>
<body>
<div class="container" id="app">
  <header class="header">
    <div class="logo-icon">⚡</div>
    <div>
      <h1>Núcleo <span>Tático</span></h1>
      <div class="subtitle">Simulados — Treinamento para concursos</div>
    </div>
  </header>

  <!-- SECTION: CONFIG -->
  <section id="section-config" class="section active">
    <div class="glass">
      <div class="config-title">⚙️ Configurar Simulado</div>
      <div class="config-desc">Escolha o número de questões e os filtros desejados</div>

      <div class="slider-group">
        <label>
          <span>Número de questões</span>
          <span class="val" id="qty-val">20</span>
        </label>
        <input type="range" id="qty-slider" min="5" max="50" value="20" step="1">
      </div>

      <div class="filter-section">
        <div class="filter-label">Categorias</div>
        <div class="pills" id="cat-pills">
          <button class="pill active" data-cat="todas">Todas</button>
          <button class="pill" data-cat="Raciocínio Lógico">R. Lógica</button>
          <button class="pill" data-cat="Português">Português</button>
          <button class="pill" data-cat="Direito Constitucional">D. Constitucional</button>
          <button class="pill" data-cat="Direito Administrativo">D. Administrativo</button>
          <button class="pill" data-cat="Informática">Informática</button>
          <button class="pill" data-cat="História">História</button>
          <button class="pill" data-cat="Geografia">Geografia</button>
        </div>
      </div>

      <div class="filter-section">
        <div class="filter-label">Banca</div>
        <div class="pills" id="banca-pills">
          <button class="pill active" data-banca="todas">Todas</button>
          <button class="pill" data-banca="CESPE / CEBRASPE">CESPE</button>
          <button class="pill" data-banca="FCC">FCC</button>
          <button class="pill" data-banca="FGV">FGV</button>
          <button class="pill" data-banca="VUNESP">VUNESP</button>
          <button class="pill" data-banca="IBFC">IBFC</button>
          <button class="pill" data-banca="AOCP">AOCP</button>
          <button class="pill" data-banca="Quadrix">Quadrix</button>
        </div>
      </div>

      <div class="start-area">
        <button class="btn btn-start" id="btn-start">🚀 Iniciar Simulado</button>
        <div class="start-info" id="start-info">20 questões disponíveis com os filtros atuais</div>
      </div>
    </div>
  </section>

  <!-- SECTION: ACTIVE -->
  <section id="section-active" class="section">
    <div class="top-bar">
      <div class="q-counter">Q <span id="current-q">1</span>/<span id="total-q">20</span></div>
      <div class="timer" id="timer-display">
        <span class="timer-icon">⏱</span>
        <span id="timer-value">01:30</span>
      </div>
    </div>
    <div class="progress-container">
      <div class="progress-bar" id="progress-bar"></div>
    </div>

    <div class="glass question-card" id="question-card">
      <div class="q-number">Questão <span id="q-num-label">1</span></div>
      <div class="q-meta" id="q-meta">
        <span class="tag" id="q-cat-tag">Categoria</span>
        <span class="tag banca-tag" id="q-banca-tag">Banca</span>
      </div>
      <div class="enunciado" id="q-enunciado">Carregando...</div>
      <div class="alts" id="q-alts"></div>
    </div>

    <div class="bottom-bar">
      <div>
        <button class="btn btn-ghost btn-sm" id="btn-revisar" disabled>← Revisar</button>
      </div>
      <div class="answered-count">
        <span id="answered-count-val">0</span>/<span id="answered-total">20</span> respondidas
      </div>
    </div>
  </section>

  <!-- SECTION: RESULTS -->
  <section id="section-results" class="section">
    <div class="glass">
      <div class="results-header">
        <h2>📊 Resultado do Simulado</h2>
        <p id="results-subtitle">Simulado concluído</p>
      </div>

      <div class="donut-container">
        <div class="donut-ring">
          <svg width="180" height="180" viewBox="0 0 180 180">
            <defs>
              <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#6366f1"/>
                <stop offset="100%" stop-color="#a78bfa"/>
              </linearGradient>
            </defs>
            <circle class="bg-circle" cx="90" cy="90" r="80"/>
            <circle class="fg-circle" id="donut-circle" cx="90" cy="90" r="80" style="--offset: 502.65;"/>
          </svg>
          <div class="score-text">
            <div class="score-num" id="score-num">0/0</div>
            <div class="score-pct" id="score-pct">0%</div>
            <div class="score-label">acertos</div>
          </div>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-item acertos">
          <div class="stat-num" id="stat-acertos">0</div>
          <div class="stat-label">Acertos</div>
        </div>
        <div class="stat-item erros">
          <div class="stat-num" id="stat-erros">0</div>
          <div class="stat-label">Erros</div>
        </div>
        <div class="stat-item tempo">
          <div class="stat-num" id="stat-tempo">00:00</div>
          <div class="stat-label">Tempo total</div>
        </div>
      </div>

      <div class="cat-breakdown" id="cat-breakdown">
        <h3>Desempenho por categoria</h3>
        <div id="cat-bars"></div>
      </div>

      <div class="results-actions">
        <button class="btn btn-secondary" id="btn-revisar-erros">📝 Revisar Erros</button>
        <button class="btn btn-primary" id="btn-novo-simulado">🔄 Novo Simulado</button>
      </div>
    </div>
  </section>

  <!-- SECTION: REVIEW -->
  <section id="section-review" class="section">
    <div class="glass">
      <div class="review-header">
        <h2>📝 Revisão de Erros</h2>
        <button class="back-btn" id="btn-voltar-resultados">← Voltar</button>
      </div>
      <div id="review-list"></div>
    </div>
  </section>
</div>

<script>
(function() {
  'use strict';

  /* ─── State ─── */
  const s = {
    questoes: [],
    filtradas: [],
    respostas: [],
    idx: 0,
    respondendo: false,
    timerInt: null,
    timerSeg: 0,
    tempoTotal: 0,
    tempoPorQuestao: 90,
    tempoGasto: [],
    revisao: false,
    resultados: null,
  };

  /* ─── DOM refs ─── */
  const $ = id => document.getElementById(id);
  const sec = {
    config:  $('section-config'),
    active:  $('section-active'),
    results: $('section-results'),
    review:  $('section-review'),
  };

  /* ─── Carregar questoes ─── */
  function carregar() {
    let qs = [];
    try { const d = localStorage.getItem('nucleo_questoes'); if (d) qs = JSON.parse(d); } catch(e) {}
    if (!qs.length && window.QUESTOES && Array.isArray(window.QUESTOES)) qs = window.QUESTOES;
    s.questoes = qs;
  }

  /* ─── Switcher ─── */
  function showSection(id) {
    Object.values(sec).forEach(el => el.classList.remove('active'));
    sec[id].classList.add('active');
    // recalc scroll
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ─── Pill setup ─── */
  function setupPills(contId, dataKey, allVal) {
    const cont = $(contId);
    if (!cont) return;
    cont.addEventListener('click', e => {
      const btn = e.target.closest('.pill');
      if (!btn) return;
      if (btn.dataset[dataKey] === allVal) {
        // "Todas" clicks — activate it, deactivate others
        cont.querySelectorAll('.pill').forEach(p => {
          if (p.dataset[dataKey] === allVal) p.classList.add('active');
          else p.classList.remove('active');
        });
      } else {
        // Remove "Todas" active, toggle this
        const allBtn = cont.querySelector(\`[data-\${dataKey}="\${allVal}"]\`);
        if (allBtn) allBtn.classList.remove('active');
        btn.classList.toggle('active');
        // If nothing selected, re-enable "Todas"
        const anyActive = cont.querySelector('.pill.active');
        if (!anyActive && allBtn) allBtn.classList.add('active');
      }
      updateStartInfo();
    });
  }

  /* ─── Get selected pills