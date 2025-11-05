// HEX Control Nexus Dashboard Application
console.log('HEX Control Nexus Dashboard Loading...');

// DOM Elements
const logsContainer = document.getElementById('logsContainer');
const jobsTableBody = document.getElementById('jobsTableBody');
const totalJobsEl = document.getElementById('totalJobs');
const completedJobsEl = document.getElementById('completedJobs');
const failedJobsEl = document.getElementById('failedJobs');
const pendingJobsEl = document.getElementById('pendingJobs');
const startScrapingBtn = document.getElementById('startScraping');
const stopScrapingBtn = document.getElementById('stopScraping');
const triggerWebhookBtn = document.getElementById('triggerWebhook');
const clearLogsBtn = document.getElementById('clearLogs');
const autoScrollCheckbox = document.getElementById('autoScroll');

// State
let jobs = [];
let logEntries = [];
let ws = null;

// Add log entry to the logs container
function addLogEntry(level, message) {
    const timestamp = new Date().toISOString().substr(11, 8);
    const logEntry = {
        timestamp,
        level,
        message
    };
    
    logEntries.push(logEntry);
    
    const logElement = document.createElement('div');
    logElement.className = 'log-entry';
    logElement.innerHTML = `
        <span class="timestamp">[${timestamp}]</span>
        <span class="level ${level}">${level.toUpperCase()}</span>
        <span class="message">${message}</span>
    `;
    
    logsContainer.appendChild(logElement);
    
    if (autoScrollCheckbox.checked) {
        logsContainer.scrollTop = logsContainer.scrollHeight;
    }
    
    // Limit log entries to prevent memory issues
    if (logEntries.length > 1000) {
        logEntries = logEntries.slice(-500);
        // In a real app, we'd update the DOM as well
    }
}

// Update jobs table
function updateJobsTable() {
    if (jobs.length === 0) {
        jobsTableBody.innerHTML = '<tr><td colspan="5" class="no-data">No jobs in queue</td></tr>';
        return;
    }

    jobsTableBody.innerHTML = jobs.map(job => `
        <tr>
            <td>${job.id}</td>
            <td>${job.task}</td>
            <td>${job.target}</td>
            <td><span class="status-badge ${job.status}">${job.status}</span></td>
            <td>${new Date(job.createdAt).toLocaleTimeString()}</td>
        </tr>
    `).join('');

    // Update counters
    totalJobsEl.textContent = jobs.length;
    completedJobsEl.textContent = jobs.filter(j => j.status === 'completed').length;
    failedJobsEl.textContent = jobs.filter(j => j.status === 'failed').length;
    pendingJobsEl.textContent = jobs.filter(j => j.status === 'queued' || j.status === 'processing').length;
}

// Connect to WebSocket
function connectWebSocket() {
    // In a demo environment, we'll simulate WebSocket messages
    addLogEntry('info', 'Simulating WebSocket connection for demo purposes');
    
    // Simulate periodic updates
    setInterval(() => {
        // Randomly add log entries
        if (Math.random() > 0.7) {
            const messages = [
                'System health check passed',
                'Database connection stable',
                'Processing queue status: OK',
                'Memory usage within normal limits'
            ];
            addLogEntry('info', messages[Math.floor(Math.random() * messages.length)]);
        }
        
        // Randomly update job status
        if (jobs.length > 0 && Math.random() > 0.8) {
            const processingJobs = jobs.filter(j => j.status === 'processing');
            if (processingJobs.length > 0) {
                const job = processingJobs[Math.floor(Math.random() * processingJobs.length)];
                if (Math.random() > 0.5) {
                    job.status = 'completed';
                    job.completedAt = new Date().toISOString();
                    addLogEntry('info', `Job ${job.id} completed successfully`);
                } else {
                    job.status = 'failed';
                    job.failedAt = new Date().toISOString();
                    addLogEntry('error', `Job ${job.id} failed`);
                }
                updateJobsTable();
            }
        }
    }, 5000);
}

// Trigger a demo scraping job
function triggerDemoScraping() {
    addLogEntry('info', 'Triggering demo scraping job...');
    
    // Create a new job
    const newJob = {
        id: `job_${Date.now()}`,
        task: 'web_scrape',
        target: 'https://quotes.toscrape.com',
        status: 'processing',
        createdAt: new Date().toISOString()
    };
    
    jobs.push(newJob);
    updateJobsTable();
    
    addLogEntry('info', `Scraping job ${newJob.id} started for ${newJob.target}`);
    
    // Simulate job completion after a delay
    setTimeout(() => {
        const jobIndex = jobs.findIndex(j => j.id === newJob.id);
        if (jobIndex !== -1) {
            if (Math.random() > 0.2) { // 80% success rate
                jobs[jobIndex].status = 'completed';
                jobs[jobIndex].completedAt = new Date().toISOString();
                addLogEntry('info', `Scraping job ${newJob.id} completed successfully`);
            } else {
                jobs[jobIndex].status = 'failed';
                jobs[jobIndex].failedAt = new Date().toISOString();
                addLogEntry('error', `Scraping job ${newJob.id} failed`);
            }
            updateJobsTable();
        }
    }, 3000 + Math.random() * 5000); // Random delay between 3-8 seconds
}

// Trigger a demo webhook
function triggerDemoWebhook() {
    addLogEntry('info', 'Triggering demo webhook...');
    
    // Create a new job
    const newJob = {
        id: `job_${Date.now()}`,
        task: 'webhook',
        target: 'https://httpbin.org/post',
        status: 'queued',
        createdAt: new Date().toISOString()
    };
    
    jobs.push(newJob);
    updateJobsTable();
    
    addLogEntry('info', `Webhook job ${newJob.id} queued`);
    
    // Simulate job processing after a delay
    setTimeout(() => {
        const jobIndex = jobs.findIndex(j => j.id === newJob.id);
        if (jobIndex !== -1) {
            jobs[jobIndex].status = 'processing';
            addLogEntry('info', `Webhook job ${newJob.id} processing`);
            updateJobsTable();
            
            // Simulate completion
            setTimeout(() => {
                const jobIndex = jobs.findIndex(j => j.id === newJob.id);
                if (jobIndex !== -1) {
                    if (Math.random() > 0.1) { // 90% success rate
                        jobs[jobIndex].status = 'completed';
                        jobs[jobIndex].completedAt = new Date().toISOString();
                        addLogEntry('info', `Webhook job ${newJob.id} completed successfully`);
                    } else {
                        jobs[jobIndex].status = 'failed';
                        jobs[jobIndex].failedAt = new Date().toISOString();
                        addLogEntry('error', `Webhook job ${newJob.id} failed`);
                    }
                    updateJobsTable();
                }
            }, 2000 + Math.random() * 3000); // Random delay between 2-5 seconds
        }
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
}

// Clear logs
function clearLogs() {
    logsContainer.innerHTML = '';
    logEntries = [];
    addLogEntry('info', 'Logs cleared');
}

// Event Listeners
if (startScrapingBtn) {
    startScrapingBtn.addEventListener('click', triggerDemoScraping);
}

if (stopScrapingBtn) {
    stopScrapingBtn.addEventListener('click', () => {
        addLogEntry('info', 'Stop scraping requested');
    });
}

if (triggerWebhookBtn) {
    triggerWebhookBtn.addEventListener('click', triggerDemoWebhook);
}

if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', clearLogs);
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    addLogEntry('info', 'HEX Control Nexus Dashboard initialized');
    
    // Connect to WebSocket
    connectWebSocket();
    
    // Add initial jobs for demonstration
    setTimeout(() => {
        jobs = [
            {
                id: 'job_1001',
                task: 'web_scrape',
                target: 'https://quotes.toscrape.com',
                status: 'completed',
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                completedAt: new Date(Date.now() - 3500000).toISOString()
            },
            {
                id: 'job_1002',
                task: 'api_call',
                target: 'https://jsonplaceholder.typicode.com/posts',
                status: 'completed',
                createdAt: new Date(Date.now() - 1800000).toISOString(),
                completedAt: new Date(Date.now() - 1700000).toISOString()
            }
        ];
        updateJobsTable();
    }, 1000);
});