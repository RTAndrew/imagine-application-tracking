# Imagine Job CSS Injection System

A Chrome extension CSS injection system that automatically injects styles based on class names, eliminating the need for inline styles.

## Features

- **Automatic CSS Injection**: Styles are injected only when needed
- **Unique Class Names**: All classes use `imaginejob-` prefix to avoid conflicts
- **Fallback Support**: Inline CSS fallback if external file fails to load
- **Chrome Extension Ready**: Works seamlessly with Chrome extensions
- **Animation Support**: Built-in fade-in animation for modals

## Files Structure

```
├── styles.css              # Main CSS file with all styles
├── css-injector.js         # CSS injection utility
├── job-details-modal.js    # Updated modal using CSS classes
├── manifest.json           # Updated manifest with CSS support
├── demo.html              # Demo page to test the system
└── README.md              # This file
```

## How It Works

### 1. CSS File (`styles.css`)
Contains all the styling with unique class names:
```css
.imaginejob-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* ... more styles */
}
```

### 2. CSS Injector (`css-injector.js`)
Automatically injects CSS into the page when needed:
```javascript
// CSS is automatically injected
await window.imagineJobCSSInjector.injectCSS();
```

### 3. Usage in Components
Use the CSS classes directly instead of inline styles:
```javascript
const modal = `
    <div class="imaginejob-modal">
        <div class="imaginejob-modalContent">
            <p class="imaginejob-modalTitle">Title</p>
        </div>
    </div>
`;
```

## Available CSS Classes

| Class | Purpose |
|-------|---------|
| `.imaginejob-modal` | Main modal container |
| `.imaginejob-modalContent` | Modal content wrapper |
| `.imaginejob-modalTitle` | Modal title |
| `.imaginejob-form` | Form container |
| `.imaginejob-formGroup` | Form field group |
| `.imaginejob-label` | Form labels |
| `.imaginejob-input` | Form inputs |
| `.imaginejob-footer` | Modal footer |
| `.imaginejob-button` | Buttons |
| `.imaginejob-button-cancel` | Cancel button |

## Setup Instructions

### 1. Include CSS Injector
Add `css-injector.js` to your content scripts in `manifest.json`:
```json
{
    "content_scripts": [
        {
            "matches": ["https://www.xing.com/jobs/*"],
            "js": ["css-injector.js", "job-details-modal.js", "job-boards/xing.js"]
        }
    ]
}
```

### 2. Make CSS Accessible
Add CSS file to `web_accessible_resources`:
```json
{
    "web_accessible_resources": [
        "styles.css"
    ]
}
```

### 3. Inject CSS Before Use
Ensure CSS is injected before creating elements:
```javascript
async function createModal() {
    // CSS is automatically injected when needed
    if (window.imagineJobCSSInjector) {
        await window.imagineJobCSSInjector.injectCSS();
    }

    // Now you can use the classes
    const modal = `<div class="imaginejob-modal">...</div>`;
}
```

## Demo

Open `demo.html` in your browser to see the CSS injection system in action. The demo includes:
- CSS injection button
- Modal creation with injected styles
- CSS removal functionality

## Benefits

1. **Cleaner Code**: No more inline styles cluttering your HTML
2. **Maintainability**: All styles in one place
3. **Performance**: CSS is injected only when needed
4. **Scalability**: Easy to add new styles and components
5. **Conflict Prevention**: Unique class names prevent style conflicts

## Browser Compatibility

- Chrome (with extension support)
- Firefox (with extension support)
- Edge (with extension support)
- Safari (with extension support)

## Troubleshooting

### CSS Not Loading
- Check if `styles.css` is included in `web_accessible_resources`
- Verify `css-injector.js` is loaded before other scripts
- Check browser console for errors

### Styles Not Applied
- Ensure `await window.imagineJobCSSInjector.injectCSS()` is called
- Verify class names match exactly (case-sensitive)
- Check if CSS was successfully injected (look for `imaginejob-styles` element)

### Extension Issues
- Reload the extension after making changes
- Check manifest.json syntax
- Verify file paths are correct

## Contributing

When adding new styles:
1. Use the `imaginejob-` prefix for all class names
2. Add styles to `styles.css`
3. Update the fallback CSS in `css-injector.js`
4. Document new classes in this README

## License

This project is part of the Imagine Job Email Insert Chrome extension.
