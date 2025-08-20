const resultEl = document.getElementById('result');
const historyEl = document.getElementById('history');

const isOperator = (ch) => /[+\-*/]/.test(ch);

function insertValue(v) {
  let txt = resultEl.textContent;
  if (txt === '0' && /[0-9.]/.test(v)) {
    txt = '';
  }
  const last = txt.slice(-1);
  if (isOperator(last) && isOperator(v)) {
    txt = txt.slice(0, -1); // substitui operador
  }
  if (v === '.') {
    const lastNum = txt.split(/[-+*/]/).pop();
    if (lastNum.includes('.')) return;
  }
  resultEl.textContent = txt + v;
}

function clearAll() {
  resultEl.textContent = '0';
  historyEl.textContent = '';
}

function deleteOne() {
  let txt = resultEl.textContent;
  if (txt.length <= 1) {
    resultEl.textContent = '0';
  } else {
    resultEl.textContent = txt.slice(0, -1);
  }
}

function applyPercent() {
  let txt = resultEl.textContent;
  const parts = txt.split(/([+\-*/])/);
  const lastPart = parts[parts.length - 1];
  if (!lastPart || /[+\-*/]/.test(lastPart)) return;
  const num = parseFloat(lastPart);
  if (isNaN(num)) return;
  parts[parts.length - 1] = String(num / 100);
  resultEl.textContent = parts.join('');
}

function toggleSign() {
  let txt = resultEl.textContent;
  const parts = txt.split(/([+\-*/])/);
  let i = parts.length - 1;
  while (i >= 0 && parts[i] === '') i--;
  if (i < 0) return;
  if (/^[+\-*/]$/.test(parts[i])) return;
  const val = parseFloat(parts[i]);
  if (isNaN(val)) return;
  parts[i] = (val * -1).toString();
  resultEl.textContent = parts.join('');
}

function safeEvaluate(expr) {
  const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/');
  if (!/^[0-9+\-*/().\s]+$/.test(sanitized)) throw new Error('Expressão inválida');
  if (/[+\-*/.]$/.test(sanitized)) throw new Error('Incompleta');
  if (/([+\-*/])\1+/.test(sanitized)) throw new Error('Operadores duplicados');
  const fn = new Function(`return (${sanitized})`);
  const out = fn();
  if (typeof out !== 'number' || !isFinite(out)) throw new Error('Erro de cálculo');
  return out;
}

function equals() {
  const expr = resultEl.textContent;
  try {
    const val = safeEvaluate(expr);
    historyEl.textContent = expr + ' =';
    resultEl.textContent = String(val);
  } catch (e) {
    historyEl.textContent = 'Erro: ' + e.message;
    resultEl.textContent = '0';
  }
}

// clique dos botões
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    const v = btn.getAttribute('data-value');
    const action = btn.getAttribute('data-action');
    if (v) return insertValue(v);
    if (action === 'clear') return clearAll();
    if (action === 'delete') return deleteOne();
    if (action === 'percent') return applyPercent();
    if (action === 'sign') return toggleSign();
    if (action === 'equals') return equals();
  });
});

// suporte ao teclado
window.addEventListener('keydown', (e) => {
  const key = e.key;
  if ((/^[0-9]$/.test(key)) || ['+', '-', '*', '/', '.','(',')'].includes(key)) {
    insertValue(key);
  } else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    equals();
  } else if (key === 'Backspace') {
    deleteOne();
  } else if (key === 'Escape') {
    clearAll();
  } else if (key === '%') {
    applyPercent();
  }
});
