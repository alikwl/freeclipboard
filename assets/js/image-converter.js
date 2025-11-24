// Image Converter Tool
let uploadedImage = null;
let originalWidth = 0;
let originalHeight = 0;
let convertedDataURL = null;
let originalFileName = '';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeImageConverter();
});

function initializeImageConverter() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const outputFormat = document.getElementById('outputFormat');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const enableResize = document.getElementById('enableResize');
    const lockAspectRatio = document.getElementById('lockAspectRatio');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Upload area click
    uploadArea.addEventListener('click', () => imageInput.click());

    // File input change
    imageInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Format change
    outputFormat.addEventListener('change', handleFormatChange);

    // Quality slider
    quality.addEventListener('input', function() {
        qualityValue.textContent = this.value;
    });

    // Enable resize checkbox
    enableResize.addEventListener('change', function() {
        document.getElementById('resizeControls').style.display = 
            this.checked ? 'block' : 'none';
    });

    // Dimension inputs with aspect ratio lock
    widthInput.addEventListener('input', function() {
        if (lockAspectRatio.checked && originalWidth && originalHeight) {
            const ratio = originalHeight / originalWidth;
            heightInput.value = Math.round(this.value * ratio);
        }
    });

    heightInput.addEventListener('input', function() {
        if (lockAspectRatio.checked && originalWidth && originalHeight) {
            const ratio = originalWidth / originalHeight;
            widthInput.value = Math.round(this.value * ratio);
        }
    });

    // Convert button
    convertBtn.addEventListener('click', convertImage);

    // Download button
    downloadBtn.addEventListener('click', downloadImage);

    // Reset button
    resetBtn.addEventListener('click', resetConverter);

    // Initial format check
    handleFormatChange();
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please upload a valid image file.');
        return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showError('File size exceeds 10MB. Please upload a smaller image.');
        return;
    }

    originalFileName = file.name;
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = function(e) {
        loadImage(e.target.result);
    };
    reader.onerror = function() {
        showError('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
}

function loadImage(dataURL) {
    const img = new Image();
    img.onload = function() {
        uploadedImage = img;
        originalWidth = img.width;
        originalHeight = img.height;
        
        // Update UI
        document.getElementById('uploadedFileName').textContent = 
            `Uploaded: ${originalFileName}`;
        document.getElementById('conversionControls').style.display = 'block';
        document.getElementById('originalDimensions').textContent = 
            `${originalWidth} × ${originalHeight}px`;
        
        // Set default dimensions
        document.getElementById('width').placeholder = originalWidth;
        document.getElementById('height').placeholder = originalHeight;
        
        // Show original preview
        document.getElementById('originalPreview').src = dataURL;
        document.getElementById('originalInfo').textContent = 
            `${originalWidth} × ${originalHeight}px`;
        
        hideError();
    };
    img.onerror = function() {
        showError('Error loading image. Please try a different file.');
    };
    img.src = dataURL;
}

function handleFormatChange() {
    const format = document.getElementById('outputFormat').value;
    const qualityControl = document.getElementById('qualityControl');
    
    // Show quality control only for JPG and WebP
    if (format === 'image/jpeg' || format === 'image/webp') {
        qualityControl.style.display = 'block';
    } else {
        qualityControl.style.display = 'none';
    }
}

function convertImage() {
    if (!uploadedImage) {
        showError('Please upload an image first.');
        return;
    }

    try {
        const format = document.getElementById('outputFormat').value;
        const quality = parseFloat(document.getElementById('quality').value);
        const enableResize = document.getElementById('enableResize').checked;
        
        let targetWidth = originalWidth;
        let targetHeight = originalHeight;
        
        if (enableResize) {
            const widthInput = document.getElementById('width').value;
            const heightInput = document.getElementById('height').value;
            
            if (widthInput) targetWidth = parseInt(widthInput);
            if (heightInput) targetHeight = parseInt(heightInput);
            
            // If only one dimension is provided, calculate the other
            if (widthInput && !heightInput) {
                targetHeight = Math.round(targetWidth * (originalHeight / originalWidth));
            } else if (heightInput && !widthInput) {
                targetWidth = Math.round(targetHeight * (originalWidth / originalHeight));
            }
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        
        // Draw image on canvas
        ctx.drawImage(uploadedImage, 0, 0, targetWidth, targetHeight);
        
        // Convert to data URL
        if (format === 'image/png') {
            convertedDataURL = canvas.toDataURL('image/png');
        } else {
            convertedDataURL = canvas.toDataURL(format, quality);
        }
        
        // Show preview
        showPreview(convertedDataURL, targetWidth, targetHeight, format);
        
        hideError();
    } catch (error) {
        showError('Error converting image: ' + error.message);
    }
}

function showPreview(dataURL, width, height, format) {
    const previewSection = document.getElementById('previewSection');
    const convertedPreview = document.getElementById('convertedPreview');
    const convertedInfo = document.getElementById('convertedInfo');
    const downloadBtn = document.getElementById('downloadBtn');
    
    convertedPreview.src = dataURL;
    
    // Calculate file size
    const base64Length = dataURL.split(',')[1].length;
    const fileSize = Math.round((base64Length * 3) / 4 / 1024); // KB
    
    const formatName = format.split('/')[1].toUpperCase();
    convertedInfo.textContent = `${width} × ${height}px • ${fileSize}KB • ${formatName}`;
    
    previewSection.style.display = 'block';
    downloadBtn.style.display = 'inline-block';
    
    // Scroll to preview
    previewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function downloadImage() {
    if (!convertedDataURL) {
        showError('Please convert an image first.');
        return;
    }

    const format = document.getElementById('outputFormat').value;
    const extension = format.split('/')[1];
    const baseName = originalFileName.replace(/\.[^/.]+$/, '');
    const fileName = `${baseName}_converted.${extension}`;
    
    // Create download link
    const link = document.createElement('a');
    link.href = convertedDataURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Image downloaded successfully!');
}

function resetConverter() {
    // Reset all variables
    uploadedImage = null;
    originalWidth = 0;
    originalHeight = 0;
    convertedDataURL = null;
    originalFileName = '';
    
    // Reset UI
    document.getElementById('imageInput').value = '';
    document.getElementById('uploadedFileName').textContent = '';
    document.getElementById('conversionControls').style.display = 'none';
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('enableResize').checked = false;
    document.getElementById('resizeControls').style.display = 'none';
    document.getElementById('width').value = '';
    document.getElementById('height').value = '';
    document.getElementById('quality').value = '0.9';
    document.getElementById('qualityValue').textContent = '0.9';
    document.getElementById('outputFormat').value = 'image/png';
    
    hideError();
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
