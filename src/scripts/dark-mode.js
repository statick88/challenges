// Enhanced Dark Mode Toggle System
export class DarkModeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('challenges_theme') || 'dark';
    this.systemPreference = this.getSystemPreference();
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.isAnimating = false;
    
    this.initialize();
  }

  initialize() {
    // Apply saved theme
    this.applyTheme(this.currentTheme);
    
    // Listen for system preference changes
    this.mediaQuery.addEventListener('change', (e) => {
      this.systemPreference = e.matches ? 'dark' : 'light';
      if (!localStorage.getItem('challenges_theme')) {
        this.applyTheme(this.systemPreference);
      }
    });

    // Setup toggle listener
    this.setupToggleListener();
    
    // Setup keyboard shortcut
    this.setupKeyboardShortcut();
    
    // Add theme transition CSS
    this.addTransitionStyles();
  }

  getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  setupToggleListener() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleTheme();
        
        // Add ripple effect
        this.createRipple(e);
      });
    }
  }

  setupKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Shift + D for theme toggle
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  toggleTheme() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    
    // Animate transition
    this.animateThemeTransition(() => {
      this.currentTheme = newTheme;
      this.applyTheme(newTheme);
      localStorage.setItem('challenges_theme', newTheme);
      
      // Dispatch custom event
      document.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme: newTheme, source: 'manual' }
      }));
      
      this.isAnimating = false;
    });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update toggle button
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      const icon = toggle.querySelector('.theme-icon');
      const label = toggle.querySelector('.theme-label');
      
      if (theme === 'dark') {
        icon.textContent = '🌙';
        label.textContent = 'Dark Mode';
        toggle.setAttribute('aria-label', 'Switch to light mode');
      } else {
        icon.textContent = '🌞';
        label.textContent = 'Light Mode';
        toggle.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
    
    // Update meta theme-color
    this.updateMetaThemeColor(theme);
  }

  animateThemeTransition(callback) {
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    document.body.appendChild(overlay);
    
    // Force reflow
    overlay.offsetHeight;
    
    requestAnimationFrame(() => {
      overlay.classList.add('active');
      
      setTimeout(() => {
        overlay.classList.remove('active');
        setTimeout(() => {
          document.body.removeChild(overlay);
          callback();
        }, 300);
      }, 10);
    });
  }

  createRipple(event) {
    const toggle = event.currentTarget;
    const rect = toggle.getBoundingClientRect();
    
    const ripple = document.createElement('span');
    ripple.className = 'theme-toggle-ripple';
    
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    
    toggle.appendChild(ripple);
    
    requestAnimationFrame(() => {
      ripple.classList.add('animate');
    });
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  updateMetaThemeColor(theme) {
    // Remove existing theme-color meta tag
    const existingMeta = document.querySelector('meta[name="theme-color"]');
    if (existingMeta) {
      existingMeta.remove();
    }
    
    // Add new theme-color meta tag
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = theme === 'dark' ? '#0f172a' : '#f8fafc';
    document.head.appendChild(meta);
  }

  addTransitionStyles() {
    const style = document.createElement('style');
    style.textContent = `
      [data-theme="dark"] {
        --bg-primary: #0f172a;
        --bg-secondary: #1e293b;
        --bg-accent: #10b981;
        --text-primary: #f8fafc;
        --text-secondary: #94a3b8;
        --text-muted: #64748b;
        --border-color: #334155;
        --shadow-color: rgba(0, 0, 0, 0.3);
      }
      
      [data-theme="light"] {
        --bg-primary: #ffffff;
        --bg-secondary: #f8fafc;
        --bg-accent: #10b981;
        --text-primary: #1e293b;
        --text-secondary: #64748b;
        --text-muted: #94a3b8;
        --border-color: #e2e8f0;
        --shadow-color: rgba(0, 0, 0, 0.1);
      }
      
      .theme-transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      
      .theme-transition-overlay.active {
        opacity: 1;
      }
      
      .theme-toggle-ripple {
        position: absolute;
        border-radius: 50%;
        background: currentColor;
        transform: scale(0);
        opacity: 0.6;
        pointer-events: none;
      }
      
      .theme-toggle-ripple.animate {
        transform: scale(4);
        opacity: 0;
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      * {
        transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
      }
      
      @media (prefers-reduced-motion: reduce) {
        .theme-transition-overlay,
        .theme-toggle-ripple.animate {
          transition: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Auto-switch based on time
  enableAutoTheme() {
    const hour = new Date().getHours();
    const autoDark = hour >= 18 || hour < 6; // 6 PM - 6 AM
    
    if (autoDark && this.currentTheme !== 'dark') {
      this.applyTheme('dark');
      this.currentTheme = 'dark';
    } else if (!autoDark && this.currentTheme !== 'light') {
      this.applyTheme('light');
      this.currentTheme = 'light';
    }
  }

  // Get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Reset to system preference
  resetToSystemPreference() {
    this.applyTheme(this.systemPreference);
    localStorage.removeItem('challenges_theme');
    this.currentTheme = this.systemPreference;
    
    document.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: this.systemPreference, source: 'system' }
    }));
  }
}