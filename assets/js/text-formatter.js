const textInput = document.getElementById('textInput');
const outputText = document.getElementById('outputText');

function applyFormat(type) {
  const text = textInput.value;
  let result = '';
  
  switch(type) {
    case 'uppercase':
      result = text.toUpperCase();
      break;
    case 'lowercase':
      result = text.toLowerCase();
      break;
    case 'titlecase':
      result = text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      break;
    case 'sentencecase':
      result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
      break;
    case 'camelcase':
      result = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      ).replace(/\s+/g, '');
      break;
    case 'snakecase':
      result = text.trim().replace(/\s+/g, '_').toLowerCase();
      break;
    case 'kebabcase':
      result = text.trim().replace(/\s+/g, '-').toLowerCase();
      break;
    case 'reverse':
      result = text.split('').reverse().join('');
      break;
    case 'trim':
      result = text.split('\n').map(line => line.trim()).join('\n');
      break;
    case 'removespaces':
      result = text.replace(/\s/g, '');
      break;
    case 'removelinebreaks':
      result = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
      break;
    case 'removeduplicate':
      const lines = text.split('\n');
      result = [...new Set(lines)].join('\n');
      break;
    case 'sortasc':
      result = text.split('\n').sort().join('\n');
      break;
    case 'sortdesc':
      result = text.split('\n').sort().reverse().join('\n');
      break;
    case 'shuffle':
      const shuffled = text.split('\n');
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      result = shuffled.join('\n');
      break;
    case 'numberedlist':
      result = text.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
      break;
    default:
      result = text;
  }
  
  outputText.value = result;
}

function clearText() {
  textInput.value = '';
  outputText.value = '';
}

function copyOutput() {
  const text = outputText.value;
  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = event.target;
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = originalText, 2000);
    });
  }
}
