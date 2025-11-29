document.addEventListener('DOMContentLoaded', function() {
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const statusMsg = document.getElementById('statusMsg');
    const clearBtn = document.getElementById('clearBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Function to format or minify
    function processJSON(minify = false) {
        const raw = jsonInput.value.trim();
        
        if (!raw) {
            jsonOutput.value = '';
            statusMsg.textContent = '';
            statusMsg.className = '';
            return;
        }

        try {
            // Try to parse the input
            const parsed = JSON.parse(raw);
            
            // If successful, format it
            if (minify) {
                jsonOutput.value = JSON.stringify(parsed);
                statusMsg.textContent = "âœ… Valid JSON (Minified)";
            } else {
                jsonOutput.value = JSON.stringify(parsed, null, 2); // 2 spaces indent
                statusMsg.textContent = "âœ… Valid JSON (Formatted)";
            }
            
            // Success Styles
            statusMsg.style.color = "#16a34a"; // Green
            jsonOutput.classList.remove('error');
            jsonInput.classList.remove('error');
            
        } catch (e) {
            // Error handling
            jsonOutput.value = "";
            statusMsg.textContent = "âŒ Error: " + e.message;
            statusMsg.style.color = "#dc2626"; // Red
            jsonInput.classList.add('error');
        }
    }

    // Event Listeners
    formatBtn.addEventListener('click', () => {
        formatBtn.classList.add('active');
        minifyBtn.classList.remove('active');
        processJSON(false);
    });

    minifyBtn.addEventListener('click', () => {
        minifyBtn.classList.add('active');
        formatBtn.classList.remove('active');
        processJSON(true);
    });

    // Auto-process when typing (debounced slightly for performance)
    let timeout;
    jsonInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const isMinify = minifyBtn.classList.contains('active');
            processJSON(isMinify);
        }, 300);
    });

    // Standard Buttons
    clearBtn.addEventListener('click', () => {
        jsonInput.value = '';
        jsonOutput.value = '';
        statusMsg.textContent = '';
        jsonInput.focus();
    });

    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            jsonInput.value = text;
            processJSON(false);
        } catch (err) {
            alert('Clipboard access denied. Please press Ctrl+V to paste.');
        }
    });

    copyBtn.addEventListener('click', () => {
        jsonOutput.select();
        document.execCommand('copy');
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Copied!';
        setTimeout(() => copyBtn.innerText = originalText, 2000);
    });
});