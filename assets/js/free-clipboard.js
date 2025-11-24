// Free Clipboard Manager
let clipboardItems = [];
let currentFilter = 'all';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadClipboardFromStorage();
    renderClipboard();
    updateStats();
    
    // Setup search
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Setup paste detection
    document.getElementById('newClipboardText').addEventListener('paste', function() {
        setTimeout(() => {
            const text = this.value;
            if (text) {
                detectCategory(text);
            }
        }, 10);
    });
});

// Add new clipboard item
function addClipboardItem() {
    const text = document.getElementById('newClipboardText').value.trim();
    const category = document.getElementById('entryCategory').value;
    const title = document.getElementById('entryTitle').value.trim();
    
    if (!text) {
        alert('Please enter some text');
        return;
    }
    
    const item = {
        id: Date.now(),
        text: text,
        category: category,
        title: title || generateTitle(text, category),
        timestamp: new Date().toISOString(),
        favorite: false,
        copyCount: 0
    };
    
    clipboardItems.unshift(item);
    saveClipboardToStorage();
    renderClipboard();
    updateStats();
    
    // Clear inputs
    document.getElementById('newClipboardText').value = '';
    document.getElementById('entryTitle').value = '';
    
    showNotification('Added to clipboard!');
}

// Generate title from text
function generateTitle(text, category) {
    const maxLength = 50;
    let title = text.substring(0, maxLength);
    if (text.length > maxLength) title += '...';
    
    // Add emoji based on category
    const emoji = {
        'text': '📝',
        'code': '💻',
        'url': '🔗',
        'email': '📧'
    };
    
    return `${emoji[category] || '📋'} ${title}`;
}

// Detect category automatically
function detectCategory(text) {
    const urlPattern = /^(https?:\/\/|www\.)/i;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const codePattern = /(function|const|let|var|class|import|export|<\?php|def |public |private )/;
    
    let category = 'text';
    
    if (urlPattern.test(text)) {
        category = 'url';
    } else if (emailPattern.test(text)) {
        category = 'email';
    } else if (codePattern.test(text)) {
        category = 'code';
    }
    
    document.getElementById('entryCategory').value = category;
}

// Render clipboard items
function renderClipboard() {
    const container = document.getElementById('clipboardList');
    const emptyState = document.getElementById('emptyState');
    
    let filteredItems = clipboardItems;
    
    // Apply category filter
    if (currentFilter !== 'all') {
        if (currentFilter === 'favorite') {
            filteredItems = clipboardItems.filter(item => item.favorite);
        } else {
            filteredItems = clipboardItems.filter(item => item.category === currentFilter);
        }
    }
    
    // Apply search filter
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filteredItems = filteredItems.filter(item => 
            item.text.toLowerCase().includes(searchTerm) ||
            item.title.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filteredItems.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    container.innerHTML = filteredItems.map(item => `
        <div class="clipboard-item" data-id="${item.id}">
            <div class="item-header">
                <div class="item-title">
                    <span class="category-badge category-${item.category}">${getCategoryIcon(item.category)}</span>
                    <strong>${escapeHtml(item.title)}</strong>
                </div>
                <div class="item-actions">
                    <button onclick="toggleFavorite(${item.id})" class="icon-btn" title="Favorite">
                        ${item.favorite ? '⭐' : '☆'}
                    </button>
                    <button onclick="editItem(${item.id})" class="icon-btn" title="Edit">✏️</button>
                    <button onclick="copyToClipboard(${item.id})" class="icon-btn" title="Copy">📋</button>
                    <button onclick="deleteItem(${item.id})" class="icon-btn" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="item-content">
                <pre>${escapeHtml(item.text)}</pre>
            </div>
            <div class="item-footer">
                <span class="item-time">${formatTime(item.timestamp)}</span>
                <span class="item-copies">Copied ${item.copyCount} times</span>
            </div>
        </div>
    `).join('');
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'text': '📝',
        'code': '💻',
        'url': '🔗',
        'email': '📧'
    };
    return icons[category] || '📋';
}

// Copy to clipboard
async function copyToClipboard(id) {
    const item = clipboardItems.find(i => i.id === id);
    if (!item) return;
    
    try {
        await navigator.clipboard.writeText(item.text);
        item.copyCount++;
        saveClipboardToStorage();
        renderClipboard();
        showNotification('Copied to clipboard!');
    } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = item.text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        item.copyCount++;
        saveClipboardToStorage();
        renderClipboard();
        showNotification('Copied to clipboard!');
    }
}

// Toggle favorite
function toggleFavorite(id) {
    const item = clipboardItems.find(i => i.id === id);
    if (item) {
        item.favorite = !item.favorite;
        saveClipboardToStorage();
        renderClipboard();
        updateStats();
    }
}

// Edit item
function editItem(id) {
    const item = clipboardItems.find(i => i.id === id);
    if (!item) return;
    
    const newText = prompt('Edit text:', item.text);
    if (newText !== null && newText.trim()) {
        item.text = newText.trim();
        const newTitle = prompt('Edit title:', item.title);
        if (newTitle !== null && newTitle.trim()) {
            item.title = newTitle.trim();
        }
        saveClipboardToStorage();
        renderClipboard();
        showNotification('Item updated!');
    }
}

// Delete item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        clipboardItems = clipboardItems.filter(i => i.id !== id);
        saveClipboardToStorage();
        renderClipboard();
        updateStats();
        showNotification('Item deleted!');
    }
}

// Filter by category
function filterCategory(category) {
    currentFilter = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    renderClipboard();
}

// Handle search
function handleSearch() {
    renderClipboard();
}

// Clear all clipboard
function clearAllClipboard() {
    if (confirm('Are you sure you want to clear all clipboard items? This cannot be undone.')) {
        clipboardItems = [];
        saveClipboardToStorage();
        renderClipboard();
        updateStats();
        showNotification('Clipboard cleared!');
    }
}

// Export clipboard
function exportClipboard() {
    const dataStr = JSON.stringify(clipboardItems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clipboard-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Clipboard exported!');
}

// Import clipboard
function importClipboard() {
    document.getElementById('importFile').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                if (confirm(`Import ${imported.length} items? This will add to your existing clipboard.`)) {
                    clipboardItems = [...imported, ...clipboardItems];
                    saveClipboardToStorage();
                    renderClipboard();
                    updateStats();
                    showNotification(`Imported ${imported.length} items!`);
                }
            } else {
                alert('Invalid clipboard file format');
            }
        } catch (err) {
            alert('Error reading file: ' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// Update statistics
function updateStats() {
    document.getElementById('totalItems').textContent = clipboardItems.length;
    document.getElementById('favoriteCount').textContent = clipboardItems.filter(i => i.favorite).length;
    
    const storageSize = new Blob([JSON.stringify(clipboardItems)]).size;
    document.getElementById('storageUsed').textContent = (storageSize / 1024).toFixed(2) + ' KB';
}

// Storage functions
function saveClipboardToStorage() {
    try {
        localStorage.setItem('freeClipboard', JSON.stringify(clipboardItems));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

function loadClipboardFromStorage() {
    try {
        const stored = localStorage.getItem('freeClipboard');
        if (stored) {
            clipboardItems = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to load from localStorage:', e);
    }
}

// Utility functions
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
