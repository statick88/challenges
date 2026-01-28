// Real-time updates system using WebSockets
export class RealtimeUpdater {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isConnected = false;
    this.subscribers = new Map();
    this.lastUpdate = null;
    this.updateInterval = null;
    this.fallbackInterval = null;
  }

  // Initialize WebSocket connection
  async initialize() {
    try {
      // Try WebSocket connection first
      await this.connectWebSocket();
    } catch (error) {
      console.warn('WebSocket connection failed, using fallback polling:', error);
      this.startFallbackPolling();
    }
  }

  async connectWebSocket() {
    // WebSocket URL - replace with your WebSocket server
    const wsUrl = 'wss://api.example.com/ws/challenges'; // Replace with actual WebSocket URL
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('🔌 WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifySubscribers('connection', { status: 'connected' });
      
      // Request initial data
      this.send({ type: 'subscribe', channel: 'challenges' });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      this.isConnected = false;
      this.notifySubscribers('connection', { status: 'disconnected' });
      
      // Attempt reconnection
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnected = false;
    };
  }

  handleMessage(data) {
    console.log('📨 Real-time update received:', data);
    
    switch (data.type) {
      case 'challenge_update':
        this.handleChallengeUpdate(data.payload);
        break;
      case 'progress_update':
        this.handleProgressUpdate(data.payload);
        break;
      case 'system_update':
        this.handleSystemUpdate(data.payload);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
    
    this.lastUpdate = Date.now();
    this.notifySubscribers('update', data);
  }

  handleChallengeUpdate(payload) {
    // Update challenge data in the UI
    this.updateChallengeData(payload);
    
    // Show notification
    this.showNotification('Challenge Updated', payload.message || 'Challenge progress updated', 'success');
  }

  handleProgressUpdate(payload) {
    // Update progress metrics
    this.updateProgressMetrics(payload);
    
    // Show notification for significant changes
    if (payload.significant) {
      this.showNotification('Progress Updated', payload.message || 'Your progress has been updated', 'info');
    }
  }

  handleSystemUpdate(payload) {
    // Handle system-wide updates
    if (payload.requiresRefresh) {
      this.showNotification('System Update', 'Page will refresh to apply updates', 'warning');
      setTimeout(() => location.reload(), 3000);
    }
  }

  // Fallback polling when WebSocket is not available
  startFallbackPolling() {
    console.log('🔄 Starting fallback polling for real-time updates');
    
    // Poll every 30 seconds
    this.fallbackInterval = setInterval(async () => {
      try {
        await this.pollForUpdates();
      } catch (error) {
        console.error('Error during fallback polling:', error);
      }
    }, 30000);
    
    // Initial poll
    this.pollForUpdates();
  }

  async pollForUpdates() {
    try {
      // Check if data has been updated by comparing timestamps
      const response = await fetch('/data/challenges.json');
      const data = await response.json();
      
      if (data.lastUpdated !== this.lastUpdate) {
        console.log('📊 Data updated via polling');
        this.lastUpdate = data.lastUpdated;
        this.notifySubscribers('update', { type: 'poll_update', payload: data });
        this.updateUIWithNewData(data);
      }
    } catch (error) {
      console.error('Error polling for updates:', error);
    }
  }

  updateUIWithNewData(data) {
    // Update progress bars
    this.updateProgressBars(data);
    
    // Update counters
    this.updateCounters(data);
    
    // Update activity timeline
    this.updateActivityTimeline(data);
    
    // Show subtle notification
    this.showNotification('Data Updated', 'Progress data has been refreshed', 'info', 2000);
  }

  updateProgressBars(data) {
    Object.entries(data.programs).forEach(([program, programData]) => {
      const progressBar = document.querySelector(`[data-program="${program}"] .progress-bar`);
      if (progressBar) {
        progressBar.style.width = `${programData.percentage}%`;
        progressBar.setAttribute('aria-valuenow', programData.percentage);
      }
    });
  }

  updateCounters(data) {
    // Update main metrics
    const totalChallenges = document.querySelector('[data-metric="total-challenges"]');
    if (totalChallenges) {
      this.animateCounter(totalChallenges, data.overview.totalChallenges);
    }
    
    const completedChallenges = document.querySelector('[data-metric="completed-challenges"]');
    if (completedChallenges) {
      this.animateCounter(completedChallenges, data.overview.completed);
    }
    
    const completionRate = document.querySelector('[data-metric="completion-rate"]');
    if (completionRate) {
      this.animateCounter(completionRate, data.overview.completionRate, '%');
    }
    
    const streak = document.querySelector('[data-metric="streak"]');
    if (streak) {
      this.animateCounter(streak, data.overview.streak);
    }
  }

  updateActivityTimeline(data) {
    const timeline = document.querySelector('.activity-timeline');
    if (timeline && data.recentActivity) {
      // Update recent activity with animation
      const newActivity = data.recentActivity.slice(0, 5);
      timeline.innerHTML = this.generateActivityHTML(newActivity);
    }
  }

  animateCounter(element, targetValue, suffix = '') {
    const startValue = parseInt(element.textContent) || 0;
    const duration = 1000;
    const steps = 60;
    const increment = (targetValue - startValue) / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const currentValue = Math.round(startValue + (increment * currentStep));
      element.textContent = currentValue.toLocaleString() + suffix;
      
      if (currentStep >= steps) {
        clearInterval(timer);
        element.textContent = targetValue.toLocaleString() + suffix;
      }
    }, duration / steps);
  }

  generateActivityHTML(activities) {
    return activities.map((activity, index) => `
      <div class="activity-item slide-up" style="animation-delay: ${index * 0.05}s">
        <div class="activity-icon">${activity.icon}</div>
        <div class="activity-content">
          <div class="activity-text">${activity.activity}</div>
          <div class="activity-program">${activity.program}</div>
        </div>
        <div class="activity-time">${index === 0 ? 'Just now' : `${index}h ago`}</div>
      </div>
    `).join('');
  }

  // Notification system
  showNotification(title, message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} slide-up`;
    notification.innerHTML = `
      <div class="notification-header">
        <span class="notification-title">${title}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="notification-message">${message}</div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, duration);
  }

  // Subscription system for components
  subscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType).push(callback);
  }

  unsubscribe(eventType, callback) {
    if (this.subscribers.has(eventType)) {
      const callbacks = this.subscribers.get(eventType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  notifySubscribers(eventType, data) {
    if (this.subscribers.has(eventType)) {
      this.subscribers.get(eventType).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }
  }

  // Reconnection logic
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connectWebSocket();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.log('❌ Max reconnection attempts reached, switching to fallback polling');
      this.startFallbackPolling();
    }
  }

  // Manual refresh trigger
  triggerRefresh() {
    console.log('🔄 Manual refresh triggered');
    this.pollForUpdates();
  }

  // Cleanup
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    this.subscribers.clear();
    this.isConnected = false;
  }

  // Send message to WebSocket
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('Cannot send message - WebSocket not connected');
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      type: this.ws ? 'websocket' : 'polling',
      lastUpdate: this.lastUpdate,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}