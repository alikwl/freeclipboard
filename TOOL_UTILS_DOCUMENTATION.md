# Tool Utilities Documentation

## Overview

The `tool-utils.js` file provides a comprehensive set of shared JavaScript utilities for all tool pages. These utilities ensure consistent functionality, reduce code duplication, and provide a professional user experience across all tools.

## Installation

Include the utilities in your tool page:

```html
<link rel="stylesheet" href="/assets/css/tool-pages.css">
<script src="/assets/js/tool-utils.js"></script>
```

## Features

### 1. Clipboard Utilities

#### `copyToClipboard(text, button)`

Copy text to the clipboard with automatic visual feedback.

**Parameters:**
- `text` (string) - Text to copy
- `button` (HTMLElement, optional) - Button element for visual feedback

**Returns:** Promise<boolean> - Success status

**Example:**
```javascript
// Basic usage
await copyToClipboard('Hello, World!');

// With button feedback
const copyBtn = document.getElementById('copyBtn');
await copyToClipboard('Hello, World!', copyBtn);
```

#### `pasteFromClipboard()`

Paste text from the clipboard.

**Returns:** Promise<string> - Pasted text

**Example:**
```javascript
const text = await pasteFromClipboard();
console.log('Pasted:', text);
```

### 2. Notification System

#### `showNotification(message, type, duration)`

Display a toast notification to the user.

**Parameters:**
- `message` (string) - Notification message
- `type` (string) - Type: 'success', 'error', 'warning', 'info' (default: 'info')
- `duration` (number) - Duration in milliseconds (default: 3000)

**Example:**
```javascript
showNotification('Operation successful!', 'success');
showNotification('An error occurred', 'error');
showNotification('Please wait...', 'info', 5000);
```

### 3. History Manager

#### `HistoryManager` Class

Manage local storage history for tools.

**Constructor:**
```javascript
const history = new HistoryManager(storageKey, maxItems);
```

**Parameters:**
- `storageKey` (string) - Local storage key
- `maxItems` (number) - Maximum items to store (default: 10)

**Methods:**

##### `add(item)`
Add item to history.
```javascript
history.add({ text: 'Sample text', value: 123 });
```

##### `getAll()`
Get all history items.
```javascript
const items = history.getAll();
```

##### `get(index)`
Get specific history item.
```javascript
const item = history.get(0);
```

##### `remove(index)`
Remove item from history.
```javascript
history.remove(0);
```

##### `clear()`
Clear all history.
```javascript
history.clear();
```

##### `count()`
Get history count.
```javascript
const count = history.count();
```

##### `isEmpty()`
Check if history is empty.
```javascript
if (history.isEmpty()) {
  console.log('No history');
}
```

**Example:**
```javascript
// Create history manager
const passwordHistory = new HistoryManager('password-history', 10);

// Add to history
passwordHistory.add({
  password: 'abc123',
  strength: 85,
  timestamp: new Date().toISOString()
});

// Get all history
const allPasswords = passwordHistory.getAll();

// Clear history
passwordHistory.clear();
```

### 4. File Download Utilities

#### `downloadFile(content, filename, mimeType)`

Download content as a file.

**Parameters:**
- `content` (string) - File content
- `filename` (string) - File name
- `mimeType` (string) - MIME type (default: 'text/plain')

**Example:**
```javascript
// Download text file
downloadFile('Hello, World!', 'hello.txt', 'text/plain');

// Download JSON
const data = { name: 'John', age: 30 };
downloadFile(JSON.stringify(data, null, 2), 'data.json', 'application/json');

// Download CSV
downloadFile('Name,Age\nJohn,30', 'data.csv', 'text/csv');
```

#### `downloadDataUrl(dataUrl, filename)`

Download data URL as file (for images, etc.).

**Example:**
```javascript
const canvas = document.getElementById('myCanvas');
const dataUrl = canvas.toDataURL('image/png');
downloadDataUrl(dataUrl, 'image.png');
```

### 5. Keyboard Shortcuts

#### `KeyboardShortcuts` Class

Global keyboard shortcuts handler (automatically instantiated as `keyboardShortcuts`).

**Methods:**

##### `register(combination, handler)`
Register a keyboard shortcut.
```javascript
keyboardShortcuts.register('ctrl+c', (e) => {
  console.log('Ctrl+C pressed');
  return true; // Prevent default
});
```

##### `unregister(combination)`
Unregister a keyboard shortcut.
```javascript
keyboardShortcuts.unregister('ctrl+c');
```

##### `enable()` / `disable()`
Enable or disable all shortcuts.
```javascript
keyboardShortcuts.disable();
keyboardShortcuts.enable();
```

##### `clear()`
Clear all shortcuts.
```javascript
keyboardShortcuts.clear();
```

**Supported Key Combinations:**
- Single keys: `'a'`, `'enter'`, `'escape'`
- With modifiers: `'ctrl+c'`, `'alt+s'`, `'shift+d'`
- Multiple modifiers: `'ctrl+shift+s'`, `'ctrl+alt+delete'`

**Example:**
```javascript
// Copy shortcut
keyboardShortcuts.register('ctrl+c', () => {
  const text = document.getElementById('output').textContent;
  copyToClipboard(text);
});

// Save shortcut
keyboardShortcuts.register('ctrl+s', (e) => {
  saveData();
  return true; // Prevent browser save dialog
});

// Clear shortcut
keyboardShortcuts.register('ctrl+shift+x', () => {
  clearAll();
});
```

### 6. UI Helper Utilities

#### `updateButtonState(button, state, text, duration)`

Update button state with temporary feedback.

**Parameters:**
- `button` (HTMLElement) - Button element
- `state` (string) - State: 'success', 'error', 'loading'
- `text` (string) - Button text
- `duration` (number) - Duration in milliseconds (default: 2000)

**Example:**
```javascript
const btn = document.getElementById('saveBtn');
updateButtonState(btn, 'success', '✓ Saved!', 2000);
```

#### `showLoading(element, message)` / `hideLoading(element)`

Show/hide loading state on element.

**Example:**
```javascript
const output = document.getElementById('output');
showLoading(output, 'Processing...');

// After processing
setTimeout(() => {
  hideLoading(output);
}, 2000);
```

#### `debounce(func, wait)`

Debounce a function (delay execution until after wait time).

**Example:**
```javascript
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((value) => {
  performSearch(value);
}, 500);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

#### `throttle(func, limit)`

Throttle a function (limit execution frequency).

**Example:**
```javascript
const throttledScroll = throttle(() => {
  console.log('Scroll event');
}, 1000);

window.addEventListener('scroll', throttledScroll);
```

### 7. Validation Utilities

#### `isValidEmail(email)`

Validate email address.

**Example:**
```javascript
if (isValidEmail('test@example.com')) {
  console.log('Valid email');
}
```

#### `isValidUrl(url)`

Validate URL.

**Example:**
```javascript
if (isValidUrl('https://example.com')) {
  console.log('Valid URL');
}
```

#### `sanitizeHTML(html)`

Sanitize HTML to prevent XSS.

**Example:**
```javascript
const userInput = '<script>alert("XSS")</script>';
const safe = sanitizeHTML(userInput);
// Result: &lt;script&gt;alert("XSS")&lt;/script&gt;
```

### 8. Storage Utilities

#### `savePreference(key, value)`

Save preference to local storage.

**Example:**
```javascript
savePreference('theme', 'dark');
savePreference('settings', { fontSize: 16, lineHeight: 1.5 });
```

#### `loadPreference(key, defaultValue)`

Load preference from local storage.

**Example:**
```javascript
const theme = loadPreference('theme', 'light');
const settings = loadPreference('settings', { fontSize: 14 });
```

#### `clearPreference(key)`

Clear preference from local storage.

**Example:**
```javascript
clearPreference('theme');
```

### 9. Format Utilities

#### `formatFileSize(bytes)`

Format file size in human-readable format.

**Example:**
```javascript
formatFileSize(1024);        // "1 KB"
formatFileSize(1048576);     // "1 MB"
formatFileSize(1073741824);  // "1 GB"
```

#### `formatDate(date, format)`

Format date.

**Parameters:**
- `date` (Date|string) - Date to format
- `format` (string) - Format type: 'short', 'long', 'time'

**Example:**
```javascript
const now = new Date();
formatDate(now, 'short');  // "Jan 15, 2025"
formatDate(now, 'long');   // "January 15, 2025, 10:30 AM"
formatDate(now, 'time');   // "10:30:45 AM"
```

#### `formatNumber(num)`

Format number with commas.

**Example:**
```javascript
formatNumber(1000);      // "1,000"
formatNumber(1000000);   // "1,000,000"
```

## Complete Example

Here's a complete example of using multiple utilities in a tool:

```javascript
// Initialize history manager
const history = new HistoryManager('my-tool-history', 10);

// Setup keyboard shortcuts
keyboardShortcuts.register('ctrl+c', () => {
  const output = document.getElementById('output').textContent;
  copyToClipboard(output);
});

keyboardShortcuts.register('ctrl+s', () => {
  const output = document.getElementById('output').textContent;
  downloadFile(output, 'output.txt', 'text/plain');
  return true; // Prevent browser save dialog
});

// Copy button
document.getElementById('copyBtn').addEventListener('click', async function() {
  const text = document.getElementById('output').textContent;
  await copyToClipboard(text, this);
  
  // Add to history
  history.add({ text: text, timestamp: new Date().toISOString() });
});

// Download button
document.getElementById('downloadBtn').addEventListener('click', function() {
  const text = document.getElementById('output').textContent;
  downloadFile(text, 'output.txt', 'text/plain');
});

// Process button with loading state
document.getElementById('processBtn').addEventListener('click', async function() {
  const output = document.getElementById('output');
  
  showLoading(output, 'Processing...');
  
  try {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    hideLoading(output);
    output.textContent = 'Processing complete!';
    showNotification('Processing successful!', 'success');
    updateButtonState(this, 'success', '✓ Done!', 2000);
  } catch (err) {
    hideLoading(output);
    showNotification('Processing failed', 'error');
    updateButtonState(this, 'error', '✗ Failed', 2000);
  }
});

// Debounced search
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((value) => {
  console.log('Searching for:', value);
  // Perform search
}, 500);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Load saved preferences
const savedTheme = loadPreference('theme', 'light');
document.body.dataset.theme = savedTheme;

// Save preferences on change
document.getElementById('themeToggle').addEventListener('change', (e) => {
  const theme = e.target.checked ? 'dark' : 'light';
  savePreference('theme', theme);
  document.body.dataset.theme = theme;
  showNotification(`Theme changed to ${theme}`, 'success');
});
```

## Browser Compatibility

All utilities are compatible with modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

For older browsers, the utilities include fallback mechanisms where necessary (e.g., clipboard API fallback).

## Testing

A comprehensive test page is available at `test-tool-utils.html` that demonstrates all utilities in action.

## Best Practices

1. **Always provide user feedback** - Use notifications for important actions
2. **Handle errors gracefully** - All utilities include error handling
3. **Use keyboard shortcuts wisely** - Don't override common browser shortcuts
4. **Respect user preferences** - Use storage utilities to remember settings
5. **Optimize performance** - Use debounce/throttle for frequent events
6. **Validate user input** - Use validation utilities before processing
7. **Provide loading states** - Use loading utilities for async operations

## Requirements Validation

This implementation satisfies the following requirements from the spec:

- **Requirement 3.1**: ✓ Copy to clipboard functionality
- **Requirement 3.3**: ✓ History management for recent items
- **Requirement 14.1**: ✓ Save preferences to local storage
- **Requirement 14.2**: ✓ Restore saved settings
- **Requirement 15.2**: ✓ Visual confirmation for operations
- **Requirement 15.3**: ✓ Consistent feedback patterns

## Support

For issues or questions, refer to the test page or contact the development team.
