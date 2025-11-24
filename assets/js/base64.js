document.addEventListener('DOMContentLoaded', function() {
    const inputBox = document.getElementById('inputBox');
    const outputBox = document.getElementById('outputBox');
    const modeEncode = document.getElementById('modeEncode');
    const modeDecode = document.getElementById('modeDecode');
    const inputLabel = document.getElementById('inputLabel');
    const clearBtn = document.getElementById('clearBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const copyBtn = document.getElementById('copyBtn');

    let isEncoding = true;

    // Toggle Modes
    function setMode(encoding) {
        isEncoding = encoding;
        inputBox.value = '';
        outputBox.value = '';
        
        if (isEncoding) {
            modeEncode.classList.add('active');
            modeDecode.classList.remove('active');
            inputLabel.innerText = "Text to Encode:";
            inputBox.placeholder = "Type text here to convert to Base64...";
        } else {
            modeDecode.classList.add('active');
            modeEncode.classList.remove('active');
            inputLabel.innerText = "Base64 to Decode:";
            inputBox.placeholder = "Paste Base64 string here...";
        }
    }

    modeEncode.addEventListener('click', () => setMode(true));
    modeDecode.addEventListener('click', () => setMode(false));

    // Conversion Logic
    function process() {
        const input = inputBox.value;
        if (!input) {
            outputBox.value = '';
            return;
        }

        try {
            if (isEncoding) {
                // Encode handles UTF-8 characters correctly
                outputBox.value = btoa(unescape(encodeURIComponent(input)));
            } else {
                // Decode
                outputBox.value = decodeURIComponent(escape(window.atob(input)));
            }
            outputBox.classList.remove('error');
        } catch (e) {
            if (!isEncoding) {
                outputBox.value = "Error: Invalid Base64 string";
                outputBox.classList.add('error');
            }
        }
    }

    // Event Listeners
    inputBox.addEventListener('input', process);

    clearBtn.addEventListener('click', () => {
        inputBox.value = '';
        outputBox.value = '';
        inputBox.focus();
    });

    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            inputBox.value = text;
            process();
        } catch (err) {
            alert('Could not paste permission denied');
        }
    });

    copyBtn.addEventListener('click', () => {
        outputBox.select();
        document.execCommand('copy');
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Copied!';
        setTimeout(() => copyBtn.innerText = originalText, 2000);
    });
});