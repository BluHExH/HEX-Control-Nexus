// HEX Control Nexus Dashboard API Integration

class DashboardAPI {
    constructor() {
        this.baseURL = 'http://localhost:3000'; // Node.js webhook service
        this.ws = null;
        this.reconnectInterval = 5000; // 5 seconds
    }
    
    // Initialize WebSocket connection
    initWebSocket() {
        try {
            this.ws = new WebSocket(`ws://localhost:3000`);
            
            this.ws.onopen = () => {
                console.log('WebSocket connected to HEX Control Nexus');
                this.addLog('WebSocket connected to backend service', 'info');
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleWebSocketMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
            
            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.addLog('WebSocket disconnected from backend service', 'warn');
                // Attempt to reconnect
                setTimeout(() => this.initWebSocket(), this.reconnectInterval);
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.addLog('WebSocket connection error', 'error');
            };
            
        } catch (error) {
            console.error('Failed to initialize WebSocket:', error);
            this.addLog('Failed to connect to backend service', 'error');
        }
    }
    
    // Handle WebSocket messages
    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'job_created':
                this.addLog(`Job created: ${data.job.id}`, 'info');
                this.updateJobInTable(data.job);
                break;
            case 'job_status':
                this.addLog(`Job status updated: ${data.job.id} - ${data.job.status}`, 'info');
                this.updateJobInTable(data.job);
                break;
            case 'job_completed':
                this.addLog(`Job completed: ${data.job.id}`, 'info');
                this.updateJobInTable(data.job);
                break;
            case 'job_failed':
                this.addLog(`Job failed: ${data.job.id} - ${data.error}`, 'error');
                this.updateJobInTable(data.job);
                break;
            case 'connection':
                this.addLog(data.message, 'info');
                break;
            default:
                console.log('Unknown WebSocket message type:', data.type);
        }
    }
    
    // Add log entry to the dashboard
    addLog(message, level = 'info') {
        const logsContainer = document.getElementById('logsContainer');
        if (!logsContainer) return;
        
        const timestamp = new Date().toISOString().substr(11, 8);
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            <span class="level ${level}">${level.toUpperCase()}</span>
            <span class="message">${message}</span>
        `;
        
        logsContainer.appendChild(logEntry);
        
        // Auto-scroll to bottom if enabled
        const autoScroll = document.getElementById('autoScroll');
        if (autoScroll && autoScroll.checked) {
            logsContainer.scrollTop = logsContainer.scrollHeight;
        }
    }
    
    // Update job in the jobs table
    updateJobInTable(job) {
        const jobsTableBody = document.getElementById('jobsTableBody');
        if (!jobsTableBody) return;
        
        // Check if job row already exists
        let jobRow = document.getElementById(`job-${job.id}`);
        
        if (!jobRow) {
            // Create new row
            jobRow = document.createElement('tr');
            jobRow.id = `job-${job.id}`;
            jobsTableBody.appendChild(jobRow);
        }
        
        // Update row content
        jobRow.innerHTML = `
            <td>${job.id}</td>
            <td>${job.task || 'N/A'}</td>
            <td>${job.target || 'N/A'}</td>
            <td><span class="status-badge ${job.status}">${job.status}</span></td>
            <td>${job.createdAt ? new Date(job.createdAt).toLocaleString() : 'N/A'}</td>
        `;
        
        // Update metrics
        this.updateMetrics();
    }
    
    // Update dashboard metrics
    updateMetrics() {
        // In a real implementation, this would fetch actual metrics from the backend
        // For demo, we'll simulate updates
        
        const totalJobsElement = document.getElementById('totalJobs');
        const completedJobsElement = document.getElementById('completedJobs');
        const failedJobsElement = document.getElementById('failedJobs');
        const pendingJobsElement = document.getElementById('pendingJobs');
        
        if (totalJobsElement) {
            // Simulate updating metrics
            const randomTotal = Math.floor(Math.random() * 50) + 10;
            totalJobsElement.textContent = randomTotal;
            
            if (completedJobsElement) {
                const completed = Math.floor(randomTotal * 0.7);
                completedJobsElement.textContent = completed;
            }
            
            if (failedJobsElement) {
                const failed = Math.floor(randomTotal * 0.1);
                failedJobsElement.textContent = failed;
            }
            
            if (pendingJobsElement) {
                const pending = Math.floor(randomTotal * 0.2);
                pendingJobsElement.textContent = pending;
            }
        }
    }
    
    // Trigger a demo scraping job
    async triggerScrapingJob() {
        try {
            this.addLog('Triggering demo scraping job...', 'info');
            
            const response = await fetch(`${this.baseURL}/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    task: 'scrape',
                    target: 'http://quotes.toscrape.com',
                    options: {
                        selectors: {
                            title: 'title',
                            heading: 'h1'
                        }
                    }
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.addLog(`Scraping job triggered successfully: ${data.jobId}`, 'info');
            } else {
                this.addLog(`Failed to trigger scraping job: ${data.error}`, 'error');
            }
        } catch (error) {
            console.error('Error triggering scraping job:', error);
            this.addLog(`Error triggering scraping job: ${error.message}`, 'error');
        }
    }
    
    // Trigger a demo webhook
    async triggerWebhook() {
        try {
            this.addLog('Triggering demo webhook...', 'info');
            
            const response = await fetch(`${this.baseURL}/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    task: 'demo',
                    target: 'Test Webhook',
                    options: {
                        message: 'This is a test webhook from HEX Control Nexus'
                    }
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.addLog(`Webhook triggered successfully: ${data.jobId}`, 'info');
            } else {
                this.addLog(`Failed to trigger webhook: ${data.error}`, 'error');
            }
        } catch (error) {
            console.error('Error triggering webhook:', error);
            this.addLog(`Error triggering webhook: ${error.message}`, 'error');
        }
    }
    
    // Fetch jobs from backend
    async fetchJobs() {
        try {
            const response = await fetch(`${this.baseURL}/jobs`);
            const jobs = await response.json();
            
            if (response.ok) {
                // Update jobs table with fetched data
                const jobsTableBody = document.getElementById('jobsTableBody');
                if (jobsTableBody) {
                    jobsTableBody.innerHTML = '';
                    
                    if (jobs.length === 0) {
                        jobsTableBody.innerHTML = '<tr><td colspan="5" class="no-data">No jobs in queue</td></tr>';
                        return;
                    }
                    
                    jobs.forEach(job => {
                        const row = document.createElement('tr');
                        row.id = `job-${job.id}`;
                        row.innerHTML = `
                            <td>${job.id}</td>
                            <td>${job.task || 'N/A'}</td>
                            <td>${job.target || 'N/A'}</td>
                            <td><span class="status-badge ${job.status}">${job.status}</span></td>
                            <td>${job.createdAt ? new Date(job.createdAt).toLocaleString() : 'N/A'}</td>
                        `;
                        jobsTableBody.appendChild(row);
                    });
                }
                
                this.updateMetrics();
            } else {
                this.addLog('Failed to fetch jobs', 'error');
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            this.addLog(`Error fetching jobs: ${error.message}`, 'error');
        }
    }
}

// Initialize dashboard API when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const api = new DashboardAPI();
    
    // Initialize WebSocket connection
    api.initWebSocket();
    
    // Set up event listeners
    const startScrapingBtn = document.getElementById('startScraping');
    const stopScrapingBtn = document.getElementById('stopScraping');
    const triggerWebhookBtn = document.getElementById('triggerWebhook');
    const clearLogsBtn = document.getElementById('clearLogs');
    
    if (startScrapingBtn) {
        startScrapingBtn.addEventListener('click', () => {
            api.triggerScrapingJob();
        });
    }
    
    if (triggerWebhookBtn) {
        triggerWebhookBtn.addEventListener('click', () => {
            api.triggerWebhook();
        });
    }
    
    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', () => {
            const logsContainer = document.getElementById('logsContainer');
            if (logsContainer) {
                logsContainer.innerHTML = '';
            }
        });
    }
    
    // Periodically fetch jobs
    setInterval(() => {
        api.fetchJobs();
    }, 10000); // Every 10 seconds
    
    // Initial fetch
    setTimeout(() => {
        api.fetchJobs();
    }, 1000);
});