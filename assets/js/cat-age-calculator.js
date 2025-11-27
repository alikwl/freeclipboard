// Cat Age Calculator
(function() {
  const catYearsInput = document.getElementById('catYears');
  const catMonthsInput = document.getElementById('catMonths');
  const humanAgeDisplay = document.getElementById('humanAge');
  const lifeStageDisplay = document.getElementById('lifeStage');
  const stageInfoDisplay = document.getElementById('stageInfo');
  const catIconDisplay = document.getElementById('catIcon');
  const shareBtn = document.getElementById('shareBtn');
  
  function calculateCatAge() {
    const years = parseInt(catYearsInput.value) || 0;
    const months = parseInt(catMonthsInput.value) || 0;
    
    let humanAge = 0;
    let lifeStage = '';
    let stageInfo = '';
    let catIcon = '🐱';
    
    // Calculate human age based on veterinary formula
    if (years === 0) {
      // First year calculation (by months)
      humanAge = Math.round(months * 1.25); // Approximately 15 years / 12 months
    } else if (years === 1) {
      humanAge = 15 + Math.round(months * 0.75); // 15 + up to 9 more
    } else {
      // 2 years = 24 human years, then 4 years per cat year
      humanAge = 24 + ((years - 2) * 4) + Math.round(months * 0.33);
    }
    
    // Determine life stage
    const totalMonths = (years * 12) + months;
    
    if (totalMonths < 12) {
      lifeStage = '🐱 Kitten';
      stageInfo = '<h4>Life Stage: Kitten</h4><p>Your cat is a playful kitten, full of energy and curiosity! This is a crucial time for socialization and learning.</p>';
      catIcon = '🐱';
    } else if (totalMonths < 24) {
      lifeStage = '🐈 Young Adult';
      stageInfo = '<h4>Life Stage: Young Adult</h4><p>Your cat is a young adult, energetic and in their prime! They\'re fully grown but may still have kitten-like playfulness.</p>';
      catIcon = '🐈';
    } else if (totalMonths < 84) {
      lifeStage = '🐈 Adult';
      stageInfo = '<h4>Life Stage: Adult</h4><p>Your cat is in their prime adult years, full of energy and personality! This is typically the healthiest period of their life.</p>';
      catIcon = '🐈';
    } else if (totalMonths < 132) {
      lifeStage = '🐈‍⬛ Mature Adult';
      stageInfo = '<h4>Life Stage: Mature Adult</h4><p>Your cat is a mature adult, still active but may be slowing down slightly. Regular vet checkups are important now.</p>';
      catIcon = '🐈‍⬛';
    } else if (totalMonths < 180) {
      lifeStage = '👴 Senior';
      stageInfo = '<h4>Life Stage: Senior</h4><p>Your cat is a senior, deserving extra care and comfort. They may have age-related health needs but can still enjoy life!</p>';
      catIcon = '🐈‍⬛';
    } else {
      lifeStage = '👴 Geriatric';
      stageInfo = '<h4>Life Stage: Geriatric</h4><p>Your cat is elderly and precious! They need special care, but many cats thrive well into their late teens and twenties.</p>';
      catIcon = '🐈‍⬛';
    }
    
    // Update display
    if (humanAgeDisplay) {
      humanAgeDisplay.textContent = humanAge;
      humanAgeDisplay.style.fontSize = '72px';
      humanAgeDisplay.style.fontWeight = 'bold';
      humanAgeDisplay.style.color = '#667eea';
    }
    
    if (lifeStageDisplay) {
      lifeStageDisplay.textContent = lifeStage;
    }
    
    if (stageInfoDisplay) {
      stageInfoDisplay.innerHTML = stageInfo;
    }
    
    if (catIconDisplay) {
      catIconDisplay.textContent = catIcon;
      catIconDisplay.style.fontSize = '80px';
    }
    
    // Store for sharing
    window.catAgeResult = {
      catYears: years,
      catMonths: months,
      humanAge: humanAge,
      lifeStage: lifeStage
    };
  }
  
  // Event listeners
  if (catYearsInput) {
    catYearsInput.addEventListener('input', calculateCatAge);
  }
  
  if (catMonthsInput) {
    catMonthsInput.addEventListener('input', calculateCatAge);
  }
  
  // Share button
  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      const result = window.catAgeResult;
      if (!result) return;
      
      const text = `My cat is ${result.catYears} year${result.catYears !== 1 ? 's' : ''} old, which is ${result.humanAge} in human years! 🐱`;
      const url = window.location.href;
      
      if (navigator.share) {
        navigator.share({
          title: 'Cat Age Calculator Result',
          text: text,
          url: url
        }).catch(() => {
          // Fallback to clipboard
          copyToClipboard(text + ' ' + url);
        });
      } else {
        copyToClipboard(text + ' ' + url);
      }
    });
  }
  
  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // Show feedback
    if (shareBtn) {
      const originalText = shareBtn.textContent;
      shareBtn.textContent = '✓ Copied!';
      setTimeout(() => {
        shareBtn.textContent = originalText;
      }, 2000);
    }
  }
  
  // Initial calculation
  calculateCatAge();
})();
