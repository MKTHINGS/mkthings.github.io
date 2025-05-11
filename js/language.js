/**
 * Language switching functionality for fast.com clone
 * Handles loading language files and updating UI text
 */

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.languageButtons = document.querySelectorAll('.language-btn');
        this.elementsToTranslate = document.querySelectorAll('[data-i18n]');
        this.supportedLanguages = ['en', 'it'];
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Load default language (browser language or saved preference or fallback to English)
        this.loadInitialLanguage();
    }
    
    /**
     * Initialize event listeners for language buttons
     */
    initEventListeners() {
        this.languageButtons.forEach(button => {
            button.addEventListener('click', () => {
                const lang = button.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
    }
    
    /**
     * Load the initial language based on saved preference or browser language
     */
    loadInitialLanguage() {
        // First check if there's a saved preference
        const savedLanguage = localStorage.getItem('preferredLanguage');
        
        if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
            this.setLanguage(savedLanguage);
        } else {
            // Otherwise detect browser language
            this.detectBrowserLanguage();
        }
    }
    
    /**
     * Detect browser language and set as default if supported
     */
    detectBrowserLanguage() {
        try {
            const browserLang = navigator.language.split('-')[0];
            
            // Check if browser language is supported
            if (this.supportedLanguages.includes(browserLang)) {
                this.setLanguage(browserLang);
            } else {
                // Default to English for all other languages
                this.setLanguage('en');
            }
        } catch (error) {
            // If there's any error, default to English
            this.setLanguage('en');
        }
    }
    
    /**
     * Set active language and update UI
     * @param {string} lang - Language code (e.g., 'en', 'it')
     */
    async setLanguage(lang) {
        // Validate language code
        if (!this.supportedLanguages.includes(lang)) {
            console.error(`Unsupported language: ${lang}`);
            lang = 'en'; // Default to English if unsupported
        }
        
        // Update active button state
        this.languageButtons.forEach(button => {
            if (button.getAttribute('data-lang') === lang) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // If translations for this language aren't loaded yet, load them
        if (!this.translations[lang]) {
            try {
                const response = await fetch(`locales/${lang}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to load language file: ${lang}`);
                }
                this.translations[lang] = await response.json();
            } catch (error) {
                console.error('Error loading language file:', error);
                
                // If loading fails, try to use English as fallback
                if (lang !== 'en' && this.translations['en']) {
                    this.currentLanguage = 'en';
                    this.updateTranslations();
                    return;
                } else if (lang !== 'en') {
                    // Try to load English if it's not already loaded
                    this.setLanguage('en');
                    return;
                } else {
                    // If English fails too, we can't do much
                    return;
                }
            }
        }
        
        // Update current language
        this.currentLanguage = lang;
        
        // Update all translatable elements
        this.updateTranslations();
        
        // Store language preference
        localStorage.setItem('preferredLanguage', lang);
        
        // Set HTML lang attribute for accessibility
        document.documentElement.setAttribute('lang', lang);
    }
    
    /**
     * Update all translatable elements with current language
     */
    updateTranslations() {
        const currentTranslations = this.translations[this.currentLanguage];
        
        if (!currentTranslations) {
            console.error(`No translations loaded for ${this.currentLanguage}`);
            return;
        }
        
        this.elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (currentTranslations[key]) {
                element.textContent = currentTranslations[key];
            }
        });
        
        // Special case for the more info button which changes text
        const moreInfoBtn = document.getElementById('more-info-btn');
        const additionalMetrics = document.getElementById('additional-metrics');
        
        if (moreInfoBtn && additionalMetrics) {
            const isExpanded = additionalMetrics.classList.contains('show');
            
            if (isExpanded) {
                moreInfoBtn.textContent = currentTranslations['show-less'] || 'SHOW LESS INFO';
            } else {
                moreInfoBtn.textContent = currentTranslations['show-more'] || 'SHOW MORE INFO';
            }
        }
        
        // Update page title
        if (currentTranslations['page-title']) {
            document.title = currentTranslations['page-title'];
        }
    }
    
    /**
     * Get translation for a specific key
     * @param {string} key - Translation key
     * @returns {string} Translated text or key if translation not found
     */
    translate(key) {
        if (this.translations[this.currentLanguage] && 
            this.translations[this.currentLanguage][key]) {
            return this.translations[this.currentLanguage][key];
        }
        
        // Fallback to English if available
        if (this.translations['en'] && this.translations['en'][key]) {
            return this.translations['en'][key];
        }
        
        return key;
    }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
    
    // Set up more info button toggle functionality
    const moreInfoBtn = document.getElementById('more-info-btn');
    const additionalMetrics = document.getElementById('additional-metrics');
    
    if (moreInfoBtn && additionalMetrics) {
        moreInfoBtn.addEventListener('click', () => {
            additionalMetrics.classList.toggle('show');
            
            // Update button text based on state
            if (additionalMetrics.classList.contains('show')) {
                moreInfoBtn.textContent = window.languageManager.translate('show-less');
            } else {
                moreInfoBtn.textContent = window.languageManager.translate('show-more');
            }
        });
    }
});