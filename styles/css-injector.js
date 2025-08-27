/**
 * CSS Injector Utility
 * Automatically injects CSS styles into the page when needed
 */
class CSSInjector {
    constructor() {
        this.injected = false;
        this.cssContent = null;
    }

    /**
     * Load CSS content from the styles.css file
     * @returns {Promise<string>} CSS content
     */
    async loadCSS() {
        if (this.cssContent) {
            return this.cssContent;
        }

        try {
            // For Chrome extension, we need to get the CSS from the extension's files
            const response = await fetch(chrome.runtime.getURL('styles.css'));
            this.cssContent = await response.text();
            return this.cssContent;
        } catch (error) {
            console.error('Failed to load CSS:', error);
            // Fallback to inline CSS if fetch fails
            return this.getFallbackCSS();
        }
    }

    /**
     * Get fallback CSS content (in case fetch fails)
     * @returns {string} Fallback CSS content
     */
    getFallbackCSS() {
        return `
            .imaginejob-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 500px;
                height: fit-content;
                background-color: #42414D;
                display: flex;
                z-index: 1000;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .imaginejob-modalContent {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 20px;
                width: 100%;
            }
            .imaginejob-modalTitle {
                font-size: 20px;
                font-weight: bold;
                color: #ffffff;
                margin: 0 0 15px 0;
            }
            .imaginejob-form {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 10px;
                width: 100%;
            }
            .imaginejob-formGroup {
                display: flex;
                flex-direction: column;
                gap: 5px;
                width: 100%;
            }
            .imaginejob-label {
                color: #ffffff;
                font-size: 14px;
                font-weight: 500;
            }
            .imaginejob-input {
                width: 100%;
                padding: 10px;
                border: 1px solid #5a5a5a;
                border-radius: 5px;
                background-color: #2d2d2d;
                color: #ffffff;
                font-size: 14px;
                transition: border-color 0.2s ease;
            }
            .imaginejob-input:focus {
                outline: none;
                border-color: #007acc;
                box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
            }
            .imaginejob-input::placeholder {
                color: #888888;
            }
            .imaginejob-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                width: 100%;
                margin-top: 10px;
            }
            .imaginejob-button {
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .imaginejob-button:not(.imaginejob-button-cancel):not(.imaginejob-buttonSaved) {
                background-color: #007acc;
                color: #ffffff;
            }
            .imaginejob-button:not(.imaginejob-button-cancel):not(.imaginejob-buttonSaved):hover {
                background-color: #005a9e;
                transform: translateY(-1px);
            }
            .imaginejob-button-cancel {
                background-color: #5a5a5a;
                color: #ffffff;
            }
            .imaginejob-button-cancel:hover {
                background-color: #404040;
                transform: translateY(-1px);
            }
            .imaginejob-buttonSaved {
                background-color: #28a745 !important;
                color: #ffffff;
                cursor: not-allowed;
            }
            .imaginejob-buttonSaved:hover {
                background-color: #28a745 !important;
                transform: none;
            }
            @keyframes imaginejob-modalFadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            .imaginejob-modal {
                animation: imaginejob-modalFadeIn 0.2s ease-out;
            }
        `;
    }

    /**
     * Inject CSS into the page
     * @returns {Promise<void>}
     */
    async injectCSS() {
        if (this.injected) {
            return;
        }

        try {
            const css = await this.loadCSS();
            const styleElement = document.createElement('style');
            styleElement.id = 'imaginejob-styles';
            styleElement.textContent = css;

            // Inject into head if available, otherwise into body
            if (document.head) {
                document.head.appendChild(styleElement);
            } else {
                document.body.appendChild(styleElement);
            }

            this.injected = true;
            console.log('Imagine Job CSS styles injected successfully');
        } catch (error) {
            console.error('Failed to inject CSS:', error);
        }
    }

    /**
     * Check if CSS is already injected
     * @returns {boolean}
     */
    isInjected() {
        return this.injected || !!document.getElementById('imaginejob-styles');
    }

    /**
     * Remove injected CSS
     */
    removeCSS() {
        const styleElement = document.getElementById('imaginejob-styles');
        if (styleElement) {
            styleElement.remove();
            this.injected = false;
        }
    }
}

// Create a global instance
window.imagineJobCSSInjector = new CSSInjector();
