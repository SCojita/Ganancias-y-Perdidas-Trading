/* Los navegadores móviles restauran el estado del formulario al recargar
   (bfcache/autofill). Forzamos reset del form y ocultamos resultados. */
window.addEventListener('pageshow', () => {
  document.getElementById('calcForm').reset();
  document.getElementById('results').classList.add('hidden');
  clearAllErrors();
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
    h1Title: 'P&L Calculator for Trading',
    seoWhatIsH2: 'What Is P&L in Trading?',
    seoWhatIsP1: 'P&L stands for Profit and Loss. It represents the financial result of a trading position \u2014 the difference between the price at which you enter a trade and the price at which you exit, multiplied by the number of units traded. A positive P&L means the trade is profitable; a negative P&L means a loss.',
    seoHowCalcH2: 'How to Calculate Profit and Loss',
    seoHowCalcP1: 'The basic formula is: <strong class="text-white">P&L = (Exit Price \u2212 Entry Price) \u00D7 Quantity</strong>. This calculator determines the asset quantity from your invested capital and entry price, then computes both the potential profit at your take profit level and the potential loss at your stop loss level.',
    seoHowWorksH2: 'How This Calculator Works',
    seoHowWorksP1: 'Enter four values: invested capital, entry price, take profit price, and stop loss price. The calculator shows the quantity of the asset you would acquire, the net profit if the take profit is reached, and the net loss if the stop loss is hit \u2014 all expressed in both absolute terms and as a percentage of your capital.',
    seoExampleH2: 'Example Calculation',
    exCapital: 'Capital',
    exEntry: 'Entry',
    exTP: 'Take Profit',
    exSL: 'Stop Loss',
    exAcquire: 'You acquire 2.5 units.',
    seoFAQH2: 'Frequently Asked Questions',
    faqQ1: 'What does P&L mean in trading?',
    faqA1: 'P&L stands for Profit and Loss. It measures how much money a trade has made or lost.',
    faqQ2: 'How do you calculate profit on a trade?',
    faqA2: 'Profit equals (Take Profit Price minus Entry Price) times Quantity. The quantity is your invested capital divided by the entry price.',
    faqQ3: 'How do you calculate loss on a trade?',
    faqA3: 'Loss equals (Stop Loss Price minus Entry Price) times Quantity. This shows the maximum potential loss for the position.',
    faqQ4: 'What is the difference between take profit and stop loss?',
    faqA4: 'Take profit is the target price to close a winning trade. Stop loss is the safety limit to close a losing trade and prevent further losses.',
    faqQ5: 'Does this calculator include commissions?',
    faqA5: 'No. This calculator does not factor in broker commissions, spreads, or swap fees.',
    faqQ6: 'Can I use this for any type of trade?',
    faqA6: 'Yes. The calculator works for any market \u2014 forex, stocks, crypto, or others \u2014 as long as you know the entry price, take profit, and stop loss values.',
    metaTitle: 'P&L Calculator for Trading | Profit & Loss Calculator',
    metaDescription: 'Free P&L calculator for trading. Calculate profit and loss on any trade using entry price, take profit, and stop loss. No signup required.',
    errEmpty: 'Enter a value.',
    errNotNumber: 'Enter a valid number.',
    errNotPositive: 'Must be greater than 0.',
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
    h1Title: 'Calculadora de P&L para Trading',
    seoWhatIsH2: '\u00BFQu\u00E9 es el P&L en trading?',
    seoWhatIsP1: 'P&L significa Profit and Loss (beneficio y p\u00E9rdida). Representa el resultado financiero de una posici\u00F3n de trading: la diferencia entre el precio de entrada y el precio de salida, multiplicada por la cantidad de unidades operadas. Un P&L positivo indica ganancia; uno negativo, p\u00E9rdida.',
    seoHowCalcH2: '\u00BFC\u00F3mo calcular ganancias y p\u00E9rdidas?',
    seoHowCalcP1: 'La f\u00F3rmula b\u00E1sica es: <strong class="text-white">P&L = (Precio de Salida \u2212 Precio de Entrada) \u00D7 Cantidad</strong>. Esta calculadora determina la cantidad del activo a partir del capital invertido y el precio de entrada, y luego calcula tanto la ganancia potencial al nivel de take profit como la p\u00E9rdida potencial al nivel de stop loss.',
    seoHowWorksH2: '\u00BFQu\u00E9 hace esta calculadora de P&L?',
    seoHowWorksP1: 'Ingresa cuatro valores: capital invertido, precio de entrada, precio de take profit y precio de stop loss. La calculadora muestra la cantidad del activo que adquirir\u00EDas, la ganancia neta si se alcanza el take profit y la p\u00E9rdida neta si se alcanza el stop loss, tanto en t\u00E9rminos absolutos como porcentuales.',
    seoExampleH2: 'Ejemplo de c\u00E1lculo',
    exCapital: 'Capital',
    exEntry: 'Entrada',
    exTP: 'Take Profit',
    exSL: 'Stop Loss',
    exAcquire: 'Adquieres 2.5 unidades.',
    seoFAQH2: 'Preguntas Frecuentes',
    faqQ1: '\u00BFQu\u00E9 significa P&L en trading?',
    faqA1: 'P&L significa Profit and Loss (beneficio y p\u00E9rdida). Mide cu\u00E1nto dinero ha ganado o perdido una operaci\u00F3n.',
    faqQ2: '\u00BFC\u00F3mo se calcula la ganancia de una operaci\u00F3n?',
    faqA2: 'Ganancia = (Precio de Take Profit \u2212 Precio de Entrada) \u00D7 Cantidad. La cantidad se obtiene dividiendo el capital invertido entre el precio de entrada.',
    faqQ3: '\u00BFC\u00F3mo se calcula la p\u00E9rdida de una operaci\u00F3n?',
    faqA3: 'P\u00E9rdida = (Precio de Stop Loss \u2212 Precio de Entrada) \u00D7 Cantidad. Esto muestra la p\u00E9rdida m\u00E1xima potencial de la posici\u00F3n.',
    faqQ4: '\u00BFQu\u00E9 diferencia hay entre take profit y stop loss?',
    faqA4: 'Take profit es el precio objetivo para cerrar una operaci\u00F3n con ganancia. Stop loss es el l\u00EDmite de seguridad para cerrar una operaci\u00F3n con p\u00E9rdida y evitar mayores pr\u00E9rdidas.',
    faqQ5: '\u00BFLa calculadora incluye comisiones?',
    faqA5: 'No. Esta calculadora no tiene en cuenta comisiones de broker, spreads ni comisiones de swap.',
    faqQ6: '\u00BFPuedo usarla para cualquier tipo de operaci\u00F3n?',
    faqA6: 'S\u00ED. La calculadora funciona para cualquier mercado \u2014 forex, acciones, criptomonedas u otros \u2014 siempre que conozcas el precio de entrada, el take profit y el stop loss.',
    metaTitle: 'Calculadora de P&L para Trading | Ganancias y P\u00E9rdidas',
    metaDescription: 'Calculadora gratuita de P&L para trading. Calcula ganancias y p\u00E9rdidas usando precio de entrada, take profit y stop loss. Sin registro.',
    errEmpty: 'Introduce un valor.',
    errNotNumber: 'Introduce un valor num\u00E9rico v\u00E1lido.',
    errNotPositive: 'Debe ser mayor que 0.',
  }
};

/* lookup: obtiene el texto traducido para una clave. Usa localStorage para
   recordar el idioma entre visitas; si no hay guardado, inglés por defecto. */
function t(key) {
  const lang = localStorage.getItem('lang') || 'en';
  return translations[lang][key] || key;
}

/* Muestra un error de validación debajo de un campo. */
function showFieldError(inputId, messageKey) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(inputId + '-error');
  if (!input || !errorEl) return;
  errorEl.textContent = t(messageKey);
  errorEl.hidden = false;
  input.classList.add('input-error');
  input.setAttribute('aria-invalid', 'true');
}

/* Limpia el error de validación de un campo. */
function clearFieldError(inputId) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(inputId + '-error');
  if (!input || !errorEl) return;
  errorEl.textContent = '';
  errorEl.hidden = true;
  input.classList.remove('input-error');
  input.removeAttribute('aria-invalid');
}

/* Limpia todos los errores de validación. */
function clearAllErrors() {
  ['investedCapital', 'entryPrice', 'takeProfitPrice', 'stopLossPrice'].forEach(clearFieldError);
}

/* Valida un campo numérico positivo. Devuelve la clave de error o null. */
function validateField(rawValue) {
  if (rawValue === '' || rawValue === null || rawValue === undefined) return 'errEmpty';
  const parsed = parseFloat(rawValue.replace(',', '.'));
  if (isNaN(parsed)) return 'errNotNumber';
  if (parsed <= 0) return 'errNotPositive';
  return null;
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

  /* Actualización dinámica de title y meta description para usuarios
     que cambian de idioma. Los metadatos estáticos del <head> sirven
     como fallback para crawlers y primera carga. */
  if (translations[lang].metaTitle) {
    document.title = translations[lang].metaTitle;
  }
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && translations[lang].metaDescription) {
    metaDesc.setAttribute('content', translations[lang].metaDescription);
  }

  /* Actualizar mensajes de error visibles si los hay. */
  ['investedCapital', 'entryPrice', 'takeProfitPrice', 'stopLossPrice'].forEach(id => {
    const errorEl = document.getElementById(id + '-error');
    if (errorEl && !errorEl.hidden) {
      const input = document.getElementById(id);
      const raw = input ? input.value : '';
      const err = validateField(raw);
      if (err) {
        errorEl.textContent = t(err);
      } else {
        clearFieldError(id);
      }
    }
  });
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

/* Limpiar error cuando el usuario escribe en un campo con error. */
['investedCapital', 'entryPrice', 'takeProfitPrice', 'stopLossPrice'].forEach(id => {
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener('input', () => {
      const errorEl = document.getElementById(id + '-error');
      if (errorEl && !errorEl.hidden) {
        const err = validateField(input.value);
        if (!err) clearFieldError(id);
      }
    });
  }
});

/* Envío del formulario: valida campos, recoge los datos, llama a la API
   y pinta resultados. */
document.getElementById('calcForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  clearAllErrors();

  const fields = [
    { id: 'investedCapital', name: 'investedCapital' },
    { id: 'entryPrice', name: 'entryPrice' },
    { id: 'takeProfitPrice', name: 'takeProfitPrice' },
    { id: 'stopLossPrice', name: 'stopLossPrice' },
  ];

  let firstInvalid = null;

  for (const field of fields) {
    const input = document.getElementById(field.id);
    const raw = input.value;
    const err = validateField(raw);
    if (err) {
      showFieldError(field.id, err);
      if (!firstInvalid) firstInvalid = input;
    }
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  /* .replace(',', '.') permite que usuarios hispanos usen coma decimal.
     parseFloat("1,50") devuelve 1; el replace lo convierte a "1.50". */
  const payload = {
    investedCapital: parseFloat(document.getElementById('investedCapital').value.replace(',', '.')),
    entryPrice: parseFloat(document.getElementById('entryPrice').value.replace(',', '.')),
    takeProfitPrice: parseFloat(document.getElementById('takeProfitPrice').value.replace(',', '.')),
    stopLossPrice: parseFloat(document.getElementById('stopLossPrice').value.replace(',', '.')),
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
