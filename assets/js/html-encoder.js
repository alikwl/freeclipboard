const inputBox = document.getElementById('inputBox');
const outputBox = document.getElementById('outputBox');
let currentMode = 'encode';

function setMode(mode) {
  currentMode = mode;
  const encodeBtn = document.getElementById('encodeBtn');
  const decodeBtn = document.getElementById('decodeBtn');
  if (encodeBtn && decodeBtn) {
    encodeBtn.classList.toggle('active', mode === 'encode');
    decodeBtn.classList.toggle('active', mode === 'decode');
  }
  processText();
}

function encodeHTML(text) {
  const encodeAll = document.getElementById('encodeAll').checked;
  const useHex = document.getElementById('useHex').checked;
  
  if (encodeAll) {
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      if (useHex) {
        return `&#x${code.toString(16)};`;
      }
      return `&#${code};`;
    }).join('');
  }
  
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  
  return text.replace(/[&<>"'\/]/g, char => entities[char]);
}

function decodeHTML(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

function processText() {
  const input = inputBox.value;
  
  if (!input) {
    outputBox.value = '';
    return;
  }
  
  try {
    if (currentMode === 'encode') {
      outputBox.value = encodeHTML(input);
    } else {
      outputBox.value = decodeHTML(input);
    }
    outputBox.classList.remove('error');
  } catch (e) {
    outputBox.value = 'Error: ' + e.message;
    outputBox.classList.add('error');
  }
}

function clearAll() {
  inputBox.value = '';
  outputBox.value = '';
}

function copyOutput() {
  const text = outputBox.value;
  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('copyOutputBtn');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = originalText, 2000);
      }
    });
  }
}

inputBox.addEventListener('input', processText);
