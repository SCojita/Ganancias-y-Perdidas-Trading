/* Los navegadores móviles restauran el estado del formulario al recargar
   (bfcache/autofill). Forzamos reset del form y ocultamos resultados. */
window.addEventListener('pageshow', () => {
  document.getElementById('calcForm').reset();
  document.getElementById('results').classList.add('hidden');
});

/* Textos en inglés y español. Cada etiqueta HTML con data-i18n se reemplaza
   según el idioma seleccionado. Las claves con sufijo -aria y -html permiten
   traducir atributos aria-label y contenido con HTML respectivamente. */
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

/* lookup: obtiene el texto traducido para una clave. Usa localStorage para
   recordar el idioma entre visitas; si no hay guardado, inglés por defecto. */
function t(key) {
  const lang = localStorage.getItem('lang') || 'en';
  return translations[lang][key] || key;
}

/* Recorre todos los elementos con data-i18n, data-i18n-aria, data-i18n-html
   y reemplaza su contenido/atributos según el idioma activo. También persiste
   la selección en localStorage y actualiza el <html lang="...">. */
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

/* Al cargar la página, restauramos el último idioma elegido. */
const savedLang = localStorage.getItem('lang') || 'en';
setLanguage(savedLang);

/* Cuando el usuario cambie el selector de idioma, aplicamos el nuevo. */
document.getElementById('langSelect').addEventListener('change', (e) => {
  setLanguage(e.target.value);
});

/* Botones (i) junto a ciertos campos: muestran/ocultan un panel
   informativo flotante con ayuda sobre el dato a introducir. */
document.querySelectorAll('.info-icon-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const panel = btn.closest('.input-wrapper').querySelector('.info-panel');
    if (panel) panel.classList.toggle('active');
  });
});

/* Envío del formulario: recoge los datos, llama a la API y pinta resultados. */
document.getElementById('calcForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  /* .replace(',', '.') permite que usuarios hispanos usen coma decimal.
     parseFloat("1,50") devuelve 1; el replace lo convierte a "1.50". */
  const payload = {
    investedCapital: parseFloat(formData.get('investedCapital').replace(',', '.')),
    entryPrice: parseFloat(formData.get('entryPrice').replace(',', '.')),
    takeProfitPrice: parseFloat(formData.get('takeProfitPrice').replace(',', '.')),
    stopLossPrice: parseFloat(formData.get('stopLossPrice').replace(',', '.')),
  };

  /* POST a la API. Si el servidor devuelve error (400, 422, 500), mostramos
     el mensaje del backend. Si falla la red, lo capturamos en el catch. */
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

    /* Pintamos los resultados: cantidad de activo, P&L neto y porcentaje
       para Take Profit y Stop Loss. El contenedor #results se muestra. */
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
