// Password Generator - Enhanced Version
// Character sets
const charSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`',
  ambiguous: '0Ol1I',
  similar: 'il1Lo0O'
};

// DOM elements
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const passwordOutput = document.getElementById('passwordOutput');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const strengthDetails = document.getElementById('strengthDetails');
const copyBtn = document.getElementById('copyBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const generateBulkBtn = document.getElementById('generateBulkBtn');
const copyBulkBtn = document.getElementById('copyBulkBtn');
const bulkCountDisplay = document.getElementById('bulkCountDisplay');

// Password history
let passwordHistory = [];
const MAX_HISTORY = 10;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  generatePassword();
  setupEventListeners();
});

// Event listeners
function setupEventListeners() {
  lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
  });

  // Auto-generate on option change
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', generatePassword);
  });

  lengthSlider.addEventListener('change', generatePassword);

  copyBtn.addEventListener('click', copyPassword);
  regenerateBtn.addEventListener('click', generatePassword);
  clearHistoryBtn.addEventListener('click', clearHistory);
  generateBulkBtn.addEventListener('click', generateBulk);
  copyBulkBtn.addEventListener('click', copyBulkPasswords);

  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      applyPreset(e.target.dataset.preset);
    });
  });
}

// Apply preset configurations
function applyPreset(preset) {
  const presets = {
    easy: {
      length: 12,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
      excludeAmbiguous: true
    },
    strong: {
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeAmbiguous: false
    },
    ultra: {
      length: 24,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeAmbiguous: false
    },
    pin: {
      length: 6,
      uppercase: false,
      lowercase: false,
      numbers: true,
      symbols: false,
      excludeAmbiguous: false
    }
  };

  const config = presets[preset];
  if (!config) return;

  lengthSlider.value = config.length;
  lengthValue.textContent = config.length;
  document.getElementById('includeUppercase').checked = config.uppercase;
  document.getElementById('includeLowercase').checked = config.lowercase;
  document.getElementById('includeNumbers').checked = config.numbers;
  document.getElementById('includeSymbols').checked = config.symbols;
  document.getElementById('excludeAmbiguous').checked = config.excludeAmbiguous;

  generatePassword();
}

// Generate password
function generatePassword() {
  const length = parseInt(lengthSlider.value);
  const options = {
    includeUpper: document.getElementById('includeUppercase').checked,
    includeLower: document.getElementById('includeLowercase').checked,
    includeNums: document.getElementById('includeNumbers').checked,
    includeSyms: document.getElementById('includeSymbols').checked,
    excludeAmb: document.getElementById('excludeAmbiguous').checked,
    excludeSim: document.getElementById('excludeSimilar')?.checked || false,
    noDuplicates: document.getElementById('noDuplicates')?.checked || false,
    noSequential: document.getElementById('noSequential')?.checked || false
  };

  // Build character set
  let charset = '';
  if (options.includeUpper) charset += charSets.uppercase;
  if (options.includeLower) charset += charSets.lowercase;
  if (options.includeNums) charset += charSets.numbers;
  if (options.includeSyms) charset += charSets.symbols;

  if (charset === '') {
    passwordOutput.textContent = 'Please select at least one character type';
    passwordOutput.style.color = '#ef4444';
    strengthText.textContent = 'Invalid';
    strengthBar.style.width = '0%';
    strengthDetails.textContent = '';
    return;
  }

  // Apply exclusions
  if (options.excludeAmb) {
    charset = charset.split('').filter(c => !charSets.ambiguous.includes(c)).join('');
  }
  if (options.excludeSim) {
    charset = charset.split('').filter(c => !charSets.similar.includes(c)).join('');
  }

  // Generate password
  let password = '';
  const array = new Uint32Array(length * 2); // Extra for filtering
  crypto.getRandomValues(array);

  let attempts = 0;
  const maxAttempts = length * 10;
  const usedChars = new Set();

  for (let i = 0; i < length && attempts < maxAttempts; attempts++) {
    const char = charset[array[attempts] % charset.length];

    // Check for duplicates
    if (options.noDuplicates && usedChars.has(char)) {
      continue;
    }

    // Check for sequential characters
    if (options.noSequential && password.length > 0) {
      const lastChar = password[password.length - 1];
      if (Math.abs(char.charCodeAt(0) - lastChar.charCodeAt(0)) === 1) {
        continue;
      }
    }

    password += char;
    usedChars.add(char);
  }

  // Ensure minimum requirements are met
  if (options.includeUpper && !/[A-Z]/.test(password)) {
    const upperChars = charSets.uppercase.split('').filter(c => 
      !options.excludeAmb || !charSets.ambiguous.includes(c)
    );
    password = replaceRandomChar(password, upperChars);
  }
  if (options.includeLower && !/[a-z]/.test(password)) {
    const lowerChars = charSets.lowercase.split('').filter(c => 
      !options.excludeAmb || !charSets.ambiguous.includes(c)
    );
    password = replaceRandomChar(password, lowerChars);
  }
  if (options.includeNums && !/[0-9]/.test(password)) {
    const numChars = charSets.numbers.split('').filter(c => 
      !options.excludeAmb || !charSets.ambiguous.includes(c)
    );
    password = replaceRandomChar(password, numChars);
  }
  if (options.includeSyms && !/[^a-zA-Z0-9]/.test(password)) {
    password = replaceRandomChar(password, charSets.symbols.split(''));
  }

  // Display password
  passwordOutput.textContent = password;
  passwordOutput.style.color = '';

  // Calculate and display strength
  const strength = calculateStrength(password, options);
  displayStrength(strength);

  // Add to history
  addToHistory(password, strength);
}

// Replace random character in password
function replaceRandomChar(password, chars) {
  if (chars.length === 0) return password;
  const pos = Math.floor(Math.random() * password.length);
  const char = chars[Math.floor(Math.random() * chars.length)];
  return password.substring(0, pos) + char + password.substring(pos + 1);
}

// Calculate password strength
function calculateStrength(password, options) {
  let score = 0;
  let feedback = [];

  // Length scoring
  if (password.length >= 16) {
    score += 30;
    feedback.push('✓ Excellent length');
  } else if (password.length >= 12) {
    score += 20;
    feedback.push('✓ Good length');
  } else if (password.length >= 8) {
    score += 10;
    feedback.push('⚠ Consider longer password');
  } else {
    feedback.push('✗ Too short');
  }

  // Character variety
  if (/[a-z]/.test(password)) {
    score += 10;
    feedback.push('✓ Lowercase letters');
  }
  if (/[A-Z]/.test(password)) {
    score += 10;
    feedback.push('✓ Uppercase letters');
  }
  if (/[0-9]/.test(password)) {
    score += 10;
    feedback.push('✓ Numbers');
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 15;
    feedback.push('✓ Special characters');
  }

  // Uniqueness
  const uniqueChars = new Set(password).size;
  const uniqueRatio = uniqueChars / password.length;
  if (uniqueRatio > 0.8) {
    score += 15;
    feedback.push('✓ High character diversity');
  } else if (uniqueRatio > 0.6) {
    score += 10;
  }

  // Entropy calculation
  const entropy = Math.log2(Math.pow(getCharsetSize(options), password.length));
  if (entropy > 80) {
    score += 10;
    feedback.push('✓ High entropy');
  }

  // Pattern detection
  if (!/(.)\1{2,}/.test(password)) {
    score += 5;
  } else {
    feedback.push('⚠ Contains repeated characters');
  }

  return {
    score: Math.min(score, 100),
    feedback: feedback,
    entropy: entropy.toFixed(1)
  };
}

// Get charset size for entropy calculation
function getCharsetSize(options) {
  let size = 0;
  if (options.includeUpper) size += 26;
  if (options.includeLower) size += 26;
  if (options.includeNums) size += 10;
  if (options.includeSyms) size += 32;
  return size;
}

// Display strength
function displayStrength(strength) {
  const { score, feedback, entropy } = strength;

  let label = '';
  let color = '';

  if (score >= 90) {
    label = 'Very Strong 🛡️';
    color = '#10b981';
  } else if (score >= 70) {
    label = 'Strong 💪';
    color = '#3b82f6';
  } else if (score >= 50) {
    label = 'Medium ⚠️';
    color = '#f59e0b';
  } else if (score >= 30) {
    label = 'Weak 😟';
    color = '#ef4444';
  } else {
    label = 'Very Weak 🚨';
    color = '#dc2626';
  }

  strengthBar.style.width = score + '%';
  strengthBar.style.backgroundColor = color;
  strengthText.textContent = label;
  strengthText.style.color = color;
  
  strengthDetails.innerHTML = `
    <div class="strength-info">
      <span>Entropy: ${entropy} bits</span>
      <span>Score: ${score}/100</span>
    </div>
    <div class="strength-feedback">
      ${feedback.slice(0, 4).map(f => `<span>${f}</span>`).join('')}
    </div>
  `;
}

// Copy password
function copyPassword() {
  const password = passwordOutput.textContent;
  if (password && !password.includes('Please select')) {
    navigator.clipboard.writeText(password).then(() => {
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span style="color: #10b981;">✓ Copied!</span>';
      copyBtn.style.backgroundColor = '#d1fae5';
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.style.backgroundColor = '';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }
}

// Add to history
function addToHistory(password, strength) {
  const historyItem = {
    password: password,
    strength: strength.score,
    timestamp: new Date().toLocaleTimeString()
  };

  passwordHistory.unshift(historyItem);
  if (passwordHistory.length > MAX_HISTORY) {
    passwordHistory.pop();
  }

  renderHistory();
}

// Render history
function renderHistory() {
  if (passwordHistory.length === 0) {
    historyList.innerHTML = '<p class="history-empty">No passwords generated yet</p>';
    return;
  }

  historyList.innerHTML = passwordHistory.map((item, index) => `
    <div class="history-item">
      <div class="history-password">${item.password}</div>
      <div class="history-meta">
        <span class="history-strength" style="color: ${getStrengthColor(item.strength)}">
          ${getStrengthLabel(item.strength)}
        </span>
        <span class="history-time">${item.timestamp}</span>
        <button class="btn-icon-sm" onclick="copyHistoryPassword(${index})" title="Copy">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

// Copy history password
function copyHistoryPassword(index) {
  const password = passwordHistory[index].password;
  navigator.clipboard.writeText(password).then(() => {
    // Visual feedback handled by button
  });
}

// Clear history
function clearHistory() {
  if (confirm('Clear all password history?')) {
    passwordHistory = [];
    renderHistory();
  }
}

// Get strength color
function getStrengthColor(score) {
  if (score >= 90) return '#10b981';
  if (score >= 70) return '#3b82f6';
  if (score >= 50) return '#f59e0b';
  if (score >= 30) return '#ef4444';
  return '#dc2626';
}

// Get strength label
function getStrengthLabel(score) {
  if (score >= 90) return 'Very Strong';
  if (score >= 70) return 'Strong';
  if (score >= 50) return 'Medium';
  if (score >= 30) return 'Weak';
  return 'Very Weak';
}

// Generate bulk passwords
function generateBulk() {
  const count = parseInt(document.getElementById('bulkCount').value);
  if (count < 1 || count > 100) {
    alert('Please enter a number between 1 and 100');
    return;
  }

  const passwords = [];
  const currentPassword = passwordOutput.textContent;

  for (let i = 0; i < count; i++) {
    generatePassword();
    passwords.push(passwordOutput.textContent);
  }

  document.getElementById('bulkOutput').value = passwords.join('\n');
  bulkCountDisplay.textContent = `${count} password${count > 1 ? 's' : ''} generated`;

  // Restore original password
  passwordOutput.textContent = currentPassword;
}

// Copy bulk passwords
function copyBulkPasswords() {
  const bulkOutput = document.getElementById('bulkOutput');
  if (bulkOutput.value) {
    navigator.clipboard.writeText(bulkOutput.value).then(() => {
      const originalText = copyBulkBtn.textContent;
      copyBulkBtn.textContent = 'Copied!';
      copyBulkBtn.style.backgroundColor = '#d1fae5';
      setTimeout(() => {
        copyBulkBtn.textContent = originalText;
        copyBulkBtn.style.backgroundColor = '';
      }, 2000);
    });
  }
}
