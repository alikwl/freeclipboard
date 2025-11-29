const colorInput = document.getElementById('colorInput');
const hexInput = document.getElementById('hexInput');
const colorPreview = document.getElementById('colorPreview');

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  let h;

  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function updateColor() {
  const hex = colorInput.value;
  const rgb = hexToRgb(hex);
  
  if (!rgb) return;
  
  hexInput.value = hex.toUpperCase();
  colorPreview.style.backgroundColor = hex;
  
  document.getElementById('rgbInput').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  document.getElementById('hslInput').value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  document.getElementById('hsvInput').value = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
  
  generateShades(hsl);
  generateHarmonies(hsl);
}

function generateShades(hsl) {
  const shadesGrid = document.getElementById('shadesGrid');
  shadesGrid.innerHTML = '';
  
  const lightnesses = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  lightnesses.forEach(l => {
    const hex = hslToHex(hsl.h, hsl.s, l);
    const shade = document.createElement('div');
    shade.className = 'shade-box';
    shade.style.backgroundColor = hex;
    shade.title = hex;
    shade.onclick = () => {
      colorInput.value = hex;
      updateColor();
    };
    shadesGrid.appendChild(shade);
  });
}

function generateHarmonies(hsl) {
  // Complementary
  const comp = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);
  document.getElementById('complementary').innerHTML = 
    `<div class="harmony-box" style="background: ${colorInput.value}"></div>
     <div class="harmony-box" style="background: ${comp}" onclick="colorInput.value='${comp}'; updateColor();"></div>`;
  
  // Analogous
  const ana1 = hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
  const ana2 = hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l);
  document.getElementById('analogous').innerHTML = 
    `<div class="harmony-box" style="background: ${ana2}" onclick="colorInput.value='${ana2}'; updateColor();"></div>
     <div class="harmony-box" style="background: ${colorInput.value}"></div>
     <div class="harmony-box" style="background: ${ana1}" onclick="colorInput.value='${ana1}'; updateColor();"></div>`;
  
  // Triadic
  const tri1 = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
  const tri2 = hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l);
  document.getElementById('triadic').innerHTML = 
    `<div class="harmony-box" style="background: ${colorInput.value}"></div>
     <div class="harmony-box" style="background: ${tri1}" onclick="colorInput.value='${tri1}'; updateColor();"></div>
     <div class="harmony-box" style="background: ${tri2}" onclick="colorInput.value='${tri2}'; updateColor();"></div>`;
}

function copyFormat(format) {
  const input = document.getElementById(format + 'Input');
  navigator.clipboard.writeText(input.value).then(() => {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = originalText, 2000);
  });
}

hexInput.addEventListener('input', () => {
  let hex = hexInput.value;
  if (hex.match(/^#?[0-9A-Fa-f]{6}$/)) {
    if (!hex.startsWith('#')) hex = '#' + hex;
    colorInput.value = hex;
    updateColor();
  }
});

colorInput.addEventListener('input', updateColor);
updateColor();
