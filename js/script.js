// This file contains the JavaScript code for the Calculadora Hematimétrica application.

const defaultConfig = {
  app_title: 'Índices Hematimétricos',
  primary_color: '#dc2626',
  background_color: '#0f172a',
  surface_color: '#1e293b',
  text_color: '#ffffff',
  secondary_text_color: '#94a3b8'
};

let config = { ...defaultConfig };

// Initialize Element SDK
if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange: async (newConfig) => {
      config = { ...defaultConfig, ...newConfig };
      applyConfig();
    },
    mapToCapabilities: (cfg) => ({
      recolorables: [
        {
          get: () => cfg.background_color || defaultConfig.background_color,
          set: (v) => { cfg.background_color = v; window.elementSdk.setConfig({ background_color: v }); }
        },
        {
          get: () => cfg.surface_color || defaultConfig.surface_color,
          set: (v) => { cfg.surface_color = v; window.elementSdk.setConfig({ surface_color: v }); }
        },
        {
          get: () => cfg.text_color || defaultConfig.text_color,
          set: (v) => { cfg.text_color = v; window.elementSdk.setConfig({ text_color: v }); }
        },
        {
          get: () => cfg.primary_color || defaultConfig.primary_color,
          set: (v) => { cfg.primary_color = v; window.elementSdk.setConfig({ primary_color: v }); }
        },
        {
          get: () => cfg.secondary_text_color || defaultConfig.secondary_text_color,
          set: (v) => { cfg.secondary_text_color = v; window.elementSdk.setConfig({ secondary_text_color: v }); }
        }
      ],
      borderables: [],
      fontEditable: undefined,
      fontSizeable: undefined
    }),
    mapToEditPanelValues: (cfg) => new Map([
      ['app_title', cfg.app_title || defaultConfig.app_title]
    ])
  });
}

function applyConfig() {
  const title = document.getElementById('app-title');
  if (title) {
    title.textContent = config.app_title || defaultConfig.app_title;
    title.style.color = config.text_color || defaultConfig.text_color;
  }

  document.body.style.background = `linear-gradient(135deg, ${config.background_color || defaultConfig.background_color}, ${config.surface_color || defaultConfig.surface_color})`;
}

// Calculate hematological indices
function calculateIndices(ht) {
  const H = (ht + 4) / 10;
  const Hb = ht / 3;
  const VCM = (ht * 10) / H;
  const HCM = (Hb * 10) / H;
  const CHCM = (Hb * 100) / ht;

  return { H, Hb, VCM, HCM, CHCM };
}

// Render results
function renderResults(indices) {
  const resultsData = [
    { label: 'Hemácias (H)', value: indices.H.toFixed(2), unit: 'milhões/mm³', icon: 'circle-dot' },
    { label: 'Hemoglobina (Hb)', value: indices.Hb.toFixed(2), unit: 'g/dL', icon: 'droplet' },
    { label: 'VCM', value: indices.VCM.toFixed(2), unit: 'fL', icon: 'box' },
    { label: 'HCM', value: indices.HCM.toFixed(2), unit: 'pg', icon: 'target' },
    { label: 'CHCM', value: indices.CHCM.toFixed(2), unit: 'g/dL', icon: 'percent' }
  ];

  const grid = document.getElementById('results-grid');
  grid.innerHTML = resultsData.map(item => `
    <div class="result-card bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
          <i data-lucide="${item.icon}" class="w-5 h-5 text-red-500"></i>
        </div>
        <div>
          <p class="text-slate-400 text-sm">${item.label}</p>
          <p class="text-white font-semibold text-lg">${item.value}</p>
        </div>
      </div>
      <span class="text-slate-500 text-sm">${item.unit}</span>
    </div>
  `).join('');

  lucide.createIcons();
}

// Handle input changes
const htInput = document.getElementById('ht-input');
const resultsContainer = document.getElementById('results-container');
const emptyState = document.getElementById('empty-state');

htInput.addEventListener('input', function() {
  const value = parseFloat(this.value);

  if (!isNaN(value) && value > 0 && value <= 100) {
    const indices = calculateIndices(value);
    renderResults(indices);
    resultsContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');
  } else {
    resultsContainer.classList.add('hidden');
    emptyState.classList.remove('hidden');
  }
});

// Initialize Lucide icons
lucide.createIcons();
applyConfig();