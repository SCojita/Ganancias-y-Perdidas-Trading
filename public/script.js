const translations = {
  en: {
    title: 'P&L Calculator',
    subtitle: 'Profit & Loss Estimator',
    disclaimer: 'EUR/USD Only \u00B7 No crypto pair support',
    investedCapital: 'Invested Capital',
    entryPrice: 'Entry Price',
    calculate: 'Calculate',
    moreInfo: 'More information',
    infoEntry: 'Price at which the market position is opened.',
    infoTP: 'Target price at which the trade will be closed for profit.',
    infoSL: 'Limit price at which the trade will be closed to avoid further losses.',
    assetQuantity: 'Asset Quantity',
    feesNotIncluded: 'Commissions not included.',
    calcError: 'Calculation error',
    connError: 'Connection error',
    copyright: 'Copyright \u00A9 2026 by Stefan Cojita. All rights reserved.',
    reportBug: 'To report bugs or suggest improvements, send a message to this <a href="https://github.com/SCojita" class="underline hover:text-cyber-400 transition-colors duration-200" target="_blank" rel="noopener noreferrer">profile</a>',
  },
  es: {
    title: 'Calculadora de P&L',
    subtitle: 'Profit & Loss Estimator',
    disclaimer: 'Solo EUR/USD \u00B7 Sin soporte para pares cripto',
    investedCapital: 'Capital Invertido',
    entryPrice: 'Precio de Entrada',
    calculate: 'Calcular',
    moreInfo: 'M\u00E1s informaci\u00F3n',
    infoEntry: 'Precio al que se abre la posici\u00F3n en el mercado.',
    infoTP: 'Precio objetivo al cual se cerrar\u00E1 la operaci\u00F3n para obtener ganancias.',
    infoSL: 'Precio l\u00EDmite al cual se cerrar\u00E1 la operaci\u00F3n para evitar p\u00E9rdidas mayores.',
    assetQuantity: 'Cantidad del Activo',
    feesNotIncluded: 'No se incluyen las comisiones.',
    calcError: 'Error al calcular',
    connError: 'Error de conexi\u00F3n',
    copyright: 'Copyright \u00A9 2026 por Stefan Cojita. Todos los derechos reservados.',
    reportBug: 'Para reportar bugs o indicar sugerencias, env\u00EDe un mensaje a este <a href="https://github.com/SCojita" class="underline hover:text-cyber-400 transition-colors duration-200" target="_blank" rel="noopener noreferrer">perfil</a>',
  }
};

function t(key) {
  const lang = localStorage.getItem('lang') || 'en';
  return translations[lang][key] || key;
}

function setLanguage(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (translations[lang][key]) {
      el.setAttribute('aria-label', translations[lang][key]);
    }
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
  document.documentElement.lang = lang;
  document.getElementById('langSelect').value = lang;
  localStorage.setItem('lang', lang);
}

const savedLang = localStorage.getItem('lang') || 'en';
setLanguage(savedLang);

document.getElementById('langSelect').addEventListener('change', (e) => {
  setLanguage(e.target.value);
});

document.querySelectorAll('.info-icon-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const panel = btn.closest('.input-wrapper').querySelector('.info-panel');
    if (panel) panel.classList.toggle('active');
  });
});

document.getElementById('calcForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const payload = {
    investedCapital: parseFloat(formData.get('investedCapital')),
    entryPrice: parseFloat(formData.get('entryPrice')),
    takeProfitPrice: parseFloat(formData.get('takeProfitPrice')),
    stopLossPrice: parseFloat(formData.get('stopLossPrice')),
  };

  try {
    const res = await fetch('/api/v1/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || t('calcError'));
      return;
    }

    const data = await res.json();

    document.getElementById('assetQuantity').textContent = data.assetQuantity;

    document.getElementById('tpNetPL').textContent = `+${data.takeProfit.netPL.toFixed(2)} \u20AC/$`;
    document.getElementById('tpPercentage').textContent = `+${data.takeProfit.percentage.toFixed(2)}%`;

    document.getElementById('slNetPL').textContent = `${data.stopLoss.netPL.toFixed(2)} \u20AC/$`;
    document.getElementById('slPercentage').textContent = `${data.stopLoss.percentage.toFixed(2)}%`;

    document.getElementById('results').classList.remove('hidden');
  } catch (err) {
    alert(t('connError') + ': ' + err.message);
  }
});
