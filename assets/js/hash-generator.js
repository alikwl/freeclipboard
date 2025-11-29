const textInput = document.getElementById('textInput');
let currentMode = 'text';

function switchMode(mode) {
  currentMode = mode;
  const textBtn = document.getElementById('textModeBtn');
  const fileBtn = document.getElementById('fileModeBtn');
  if (textBtn && fileBtn) {
    textBtn.classList.toggle('active', mode === 'text');
    fileBtn.classList.toggle('active', mode === 'file');
  }
  
  if (mode === 'text') {
    document.getElementById('textMode').style.display = 'block';
    document.getElementById('fileMode').style.display = 'none';
    generateHashes();
  } else {
    document.getElementById('textMode').style.display = 'none';
    document.getElementById('fileMode').style.display = 'block';
    clearHashes();
  }
}

function generateHashes() {
  const text = textInput.value;
  
  if (!text) {
    clearHashes();
    return;
  }
  
  document.getElementById('md5Output').textContent = CryptoJS.MD5(text).toString();
  document.getElementById('sha1Output').textContent = CryptoJS.SHA1(text).toString();
  document.getElementById('sha256Output').textContent = CryptoJS.SHA256(text).toString();
  document.getElementById('sha512Output').textContent = CryptoJS.SHA512(text).toString();
}

function handleFile() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) return;
  
  document.getElementById('fileName').textContent = file.name;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
    
    document.getElementById('md5Output').textContent = CryptoJS.MD5(wordArray).toString();
    document.getElementById('sha1Output').textContent = CryptoJS.SHA1(wordArray).toString();
    document.getElementById('sha256Output').textContent = CryptoJS.SHA256(wordArray).toString();
    document.getElementById('sha512Output').textContent = CryptoJS.SHA512(wordArray).toString();
  };
  reader.readAsArrayBuffer(file);
}

function clearInput() {
  textInput.value = '';
  generateHashes();
}

function clearHashes() {
  document.getElementById('md5Output').textContent = '-';
  document.getElementById('sha1Output').textContent = '-';
  document.getElementById('sha256Output').textContent = '-';
  document.getElementById('sha512Output').textContent = '-';
}

function copyHash(type) {
  const hash = document.getElementById(type + 'Output').textContent;
  if (hash !== '-') {
    navigator.clipboard.writeText(hash).then(() => {
      const btnIdMap = {
        md5: 'md5CopyBtn',
        sha1: 'sha1CopyBtn',
        sha256: 'sha256CopyBtn',
        sha512: 'sha512CopyBtn'
      };
      const btn = document.getElementById(btnIdMap[type]);
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = originalText, 2000);
      }
    });
  }
}

textInput.addEventListener('input', generateHashes);
