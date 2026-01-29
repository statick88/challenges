// Analytics system for challenges dashboard
export class ChallengeAnalytics {
  constructor() {
    this.events = [];
    this.sessionStart = Date.now();
    this.initializeTracking();
  }

  initializeTracking() {
    // Track page views
    this.trackEvent('page_view', {
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      sessionId: this.getSessionId()
    });

    // Track user interactions
    this.setupInteractionTracking();

    // Track performance metrics
    this.setupPerformanceTracking();

    // Track visibility changes
    this.setupVisibilityTracking();
  }

  get sessionId() {
    let sessionId = sessionStorage.getItem('challenges_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('challenges_session_id', sessionId);
    }
    return sessionId;
  }

  trackEvent(eventName, eventData = {}) {
    const event = {
      id: this.generateEventId(),
      name: eventName,
      data: eventData,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      url: window.location.href
    };

    this.events.push(event);
    
    // Send to analytics endpoint (if configured)
    this.sendAnalytics(event);

    // Store locally for fallback
    this.storeEventLocally(event);

    console.log('📊 Analytics Event:', event);
  }

  generateEventId() {
    return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  setupInteractionTracking() {
    // Track button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('button, .btn, [role="button"]')) {
        this.trackEvent('button_click', {
          buttonText: e.target.textContent?.trim(),
          buttonClass: e.target.className,
          buttonId: e.target.id || e.target.getAttribute('aria-label')
        });
      }
    });

    // Track refresh button specifically
    const refreshBtn = document.querySelector('[onclick*="location.reload()"]');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.trackEvent('refresh_data', {
          triggeredBy: 'user_click',
          timestamp: Date.now()
        });
      });
    }
  }

  setupPerformanceTracking() {
    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (performance.getEntriesByType) {
          const perfEntries = performance.getEntriesByType('navigation');
          if (perfEntries.length > 0) {
            const nav = perfEntries[0];
            this.trackEvent('page_performance', {
              loadTime: nav.loadEventEnd - nav.navigationStart,
              domContentLoaded: nav.domContentLoadedEventEnd - nav.navigationStart,
              firstContentfulPaint: nav.loadEventEnd - nav.navigationStart,
              connectionType: nav.effectiveType
            });
          }
        }
      }, 0);
    });
  }

  setupVisibilityTracking() {
    let visibilityStartTime = Date.now();
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('page_hidden', {
          duration: Date.now() - visibilityStartTime,
          reason: 'tab_hidden'
        });
      } else {
        this.trackEvent('page_visible', {
          reason: 'tab_visible',
          timeSinceHidden: Date.now() - visibilityStartTime
        });
        visibilityStartTime = Date.now();
      }
    });
  }

  sendAnalytics(event) {
    // Send to analytics endpoint (configure as needed)
    const analyticsEndpoint = 'https://api.example.com/analytics/events'; // Replace with your endpoint
    
    // Uncomment to enable remote tracking
    /*
    fetch(analyticsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      'X-App-Version': '1.0.0'
      },
      body: JSON.stringify(event)
    }).catch(error => {
      console.warn('Analytics send failed:', error);
    });
    */
  }

  storeEventLocally(event) {
    // Store events in localStorage for analytics dashboard
    const storedEvents = JSON.parse(localStorage.getItem('challenges_events') || '[]');
    storedEvents.push(event);
    
    // Keep only last 100 events to avoid storage bloat
    if (storedEvents.length > 100) {
      storedEvents.splice(0, storedEvents.length - 100);
    }
    
    localStorage.setItem('challenges_events', JSON.stringify(storedEvents));
  }

  // Challenge-specific tracking methods
  trackChallengeView(program, challengeNumber) {
    this.trackEvent('challenge_view', {
      program,
      challengeNumber,
      category: this.getProgramCategory(program)
    });
  }

  trackChallengeComplete(program, challengeNumber, timeSpent) {
    this.trackEvent('challenge_complete', {
      program,
      challengeNumber,
      timeSpent,
      category: this.getProgramCategory(program)
    });
  }

  trackProgramSwitch(fromProgram, toProgram) {
    this.trackEvent('program_switch', {
      fromProgram,
      toProgram,
      fromCategory: this.getProgramCategory(fromProgram),
      toCategory: this.getProgramCategory(toProgram)
    });
  }

  getProgramCategory(program) {
    const categories = {
      'linux': 'system_administration',
      'docker': 'containerization',
      'devops': 'devops_fundamentals'
    };
    return categories[program] || 'general';
  }

  // Analytics dashboard methods
  getEventSummary(timeRange = '24h') {
    const now = Date.now();
    const timeMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    };

    const cutoffTime = now - timeMs[timeRange];
    const recentEvents = this.events.filter(event => event.timestamp > cutoffTime);

    return {
      totalEvents: recentEvents.length,
      pageViews: recentEvents.filter(e => e.name === 'page_view').length,
      buttonClicks: recentEvents.filter(e => e.name === 'button_click').length,
      refreshCount: recentEvents.filter(e => e.name === 'refresh_data').length,
      avgSessionDuration: this.calculateAvgSessionDuration(recentEvents)
    };
  }

  calculateAvgSessionDuration(events) {
    const sessions = events.filter(e => e.name === 'page_visible');
    if (sessions.length === 0) return 0;

    const totalDuration = sessions.reduce((sum, session) => sum + (session.data.timeSinceHidden || 0), 0);
    return Math.round(totalDuration / sessions.length);
  }

  // Export methods
  exportEvents(format = 'json') {
    const dataStr = JSON.stringify(this.events, null, 2);
    
    if (format === 'csv') {
      const csv = this.convertToCSV(this.events);
      this.downloadFile(csv, 'challenges_analytics.csv', 'text/csv');
    } else {
      this.downloadFile(dataStr, 'challenges_analytics.json', 'application/json');
    }
  }

  convertToCSV(events) {
    const headers = ['Event ID', 'Name', 'Timestamp', 'Session ID', 'Data'];
    const csvRows = events.map(event => [
      event.id,
      event.name,
      new Date(event.timestamp).toISOString(),
      event.sessionId,
      JSON.stringify(event.data)
    ]);

    return [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}