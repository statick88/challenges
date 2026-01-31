// Enhanced Dark Mode Toggle System
export class DarkModeManager {
  constructor() {
    this.currentTheme = localStorage.getItem("challenges_theme") || "dark";
    this.systemPreference = this.getSystemPreference();
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.isAnimating = false;

    this.initialize();
  }

  initialize() {
    // Apply saved theme
    this.applyTheme(this.currentTheme);

    // Listen for system preference changes
    this.mediaQuery.addEventListener("change", (e) => {
      this.systemPreference = e.matches ? "dark" : "light";
      if (!localStorage.getItem("challenges_theme")) {
        this.applyTheme(this.systemPreference);
      }
    });

    // Setup toggle listener
    this.setupToggleListener();

    // Setup keyboard shortcut
    this.setupKeyboardShortcut();
  }

  getSystemPreference() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }

  setupToggleListener() {
    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleTheme();

        // Add ripple effect
        this.createRipple(e);
      });
    }
  }

  setupKeyboardShortcut() {
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + Shift + D for theme toggle
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "D") {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  toggleTheme() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const newTheme = this.currentTheme === "dark" ? "light" : "dark";

    // Animate transition
    this.animateThemeTransition(() => {
      this.currentTheme = newTheme;
      this.applyTheme(newTheme);
      localStorage.setItem("challenges_theme", newTheme);

      // Dispatch custom event
      document.dispatchEvent(
        new CustomEvent("themeChanged", {
          detail: { theme: newTheme, source: "manual" },
        }),
      );

      this.isAnimating = false;
    });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    // Update toggle button
    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      const icon = toggle.querySelector(".theme-icon");
      const label = toggle.querySelector(".theme-label");

      if (theme === "dark") {
        icon.textContent = "🌙";
        label.textContent = "Dark Mode";
        toggle.setAttribute("aria-label", "Switch to light mode");
      } else {
        icon.textContent = "🌞";
        label.textContent = "Light Mode";
        toggle.setAttribute("aria-label", "Switch to dark mode");
      }
    }

    // Update meta theme-color
    this.updateMetaThemeColor(theme);
  }

  animateThemeTransition(callback) {
    document.documentElement.classList.add("theme-transitioning");

    const overlay = document.createElement("div");
    overlay.className = "theme-transition-overlay";
    document.body.appendChild(overlay);

    // Force reflow
    overlay.offsetHeight;

    requestAnimationFrame(() => {
      overlay.classList.add("active");

      setTimeout(() => {
        overlay.classList.remove("active");
        setTimeout(() => {
          document.body.removeChild(overlay);
          document.documentElement.classList.remove("theme-transitioning");
          callback();
        }, 300);
      }, 10);
    });
  }

  createRipple(event) {
    const toggle = event.currentTarget;
    const rect = toggle.getBoundingClientRect();

    const ripple = document.createElement("span");
    ripple.className = "theme-toggle-ripple";

    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = event.clientX - rect.left - size / 2 + "px";
    ripple.style.top = event.clientY - rect.top - size / 2 + "px";

    toggle.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.classList.add("animate");
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
    const meta = document.createElement("meta");
    meta.name = "theme-color";

    // Prefer theme tokens to avoid hardcoded colors.
    const rgb = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-primary")
      .trim();
    meta.content = rgb
      ? `rgb(${rgb})`
      : theme === "dark"
        ? "#0f172a"
        : "#f8fafc";

    document.head.appendChild(meta);
  }

  // Auto-switch based on time
  enableAutoTheme() {
    const hour = new Date().getHours();
    const autoDark = hour >= 18 || hour < 6; // 6 PM - 6 AM

    if (autoDark && this.currentTheme !== "dark") {
      this.applyTheme("dark");
      this.currentTheme = "dark";
    } else if (!autoDark && this.currentTheme !== "light") {
      this.applyTheme("light");
      this.currentTheme = "light";
    }
  }

  // Get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Reset to system preference
  resetToSystemPreference() {
    this.applyTheme(this.systemPreference);
    localStorage.removeItem("challenges_theme");
    this.currentTheme = this.systemPreference;

    document.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { theme: this.systemPreference, source: "system" },
      }),
    );
  }
}
