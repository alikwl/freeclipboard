let currentType = 'text';
let qrCode = null;

function setQRType(type) {
  currentType = type;
  const map = {
    text: 'typeBtnText',
    url: 'typeBtnUrl',
    email: 'typeBtnEmail',
    phone: 'typeBtnPhone',
    wifi: 'typeBtnWifi'
  };
  document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(map[type]);
  if (activeBtn) activeBtn.classList.add('active');
  
  document.querySelectorAll('.qr-input-form').forEach(form => form.style.display = 'none');
  document.getElementById(type + 'Input').style.display = 'block';
}

function getQRData() {
  switch(currentType) {
    case 'text':
      return document.getElementById('qrText').value;
    case 'url':
      return document.getElementById('qrUrl').value;
    case 'email':
      const email = document.getElementById('qrEmail').value;
      const subject = document.getElementById('qrSubject').value;
      return `mailto:${email}${subject ? '?subject=' + encodeURIComponent(subject) : ''}`;
    case 'phone':
      return `tel:${document.getElementById('qrPhone').value}`;
    case 'wifi':
      const ssid = document.getElementById('wifiSSID').value;
      const password = document.getElementById('wifiPassword').value;
      const security = document.getElementById('wifiSecurity').value;
      return `WIFI:T:${security};S:${ssid};P:${password};;`;
    default:
      return '';
  }
}

function generateQR() {
  const data = getQRData();
  
  if (!data) {
    alert('Please enter data to generate QR code');
    return;
  }
  
  const size = parseInt(document.getElementById('qrSize').value);
  const display = document.getElementById('qrCodeDisplay');
  display.innerHTML = '';
  
  qrCode = new QRCode(display, {
    text: data,
    width: size,
    height: size,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
}

function downloadQR() {
  if (!qrCode) {
    alert('Please generate a QR code first');
    return;
  }
  
  const canvas = document.querySelector('#qrCodeDisplay canvas');
  if (canvas) {
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    a.click();
  }
}

// Add event listeners for real-time generation
document.getElementById('qrText').addEventListener('input', () => {
  if (document.getElementById('qrText').value) generateQR();
});
