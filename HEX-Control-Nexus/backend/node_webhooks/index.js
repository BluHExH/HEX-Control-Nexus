const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { triggerPuppeteerTask } = require('./puppeteer_tasks');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Store for job statuses
const jobs = new Map();

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  // Send initial connection message
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to HEX Control Nexus WebSocket'
  }));
  
  // Handle incoming messages from clients
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);
      
      // Echo the message back
      ws.send(JSON.stringify({
        type: 'echo',
        message: `Echo: ${data.message || 'No message'}`
      }));
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

// Helper function to broadcast to all WebSocket clients
function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const { task, target, options } = req.body;
    
    // Generate job ID
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store job info
    const jobInfo = {
      id: jobId,
      task,
      target,
      options,
      status: 'queued',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    jobs.set(jobId, jobInfo);
    
    // Broadcast job creation
    broadcast({
      type: 'job_created',
      job: jobInfo
    });
    
    // Respond immediately with job ID
    res.status(202).json({
      jobId,
      message: 'Job queued successfully',
      status: 'queued'
    });
    
    // Process the job asynchronously
    processJob(jobId, task, target, options);
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Process job function
async function processJob(jobId, task, target, options) {
  try {
    // Update job status
    const job = jobs.get(jobId);
    if (!job) return;
    
    job.status = 'processing';
    job.startedAt = new Date().toISOString();
    job.updatedAt = new Date().toISOString();
    
    jobs.set(jobId, job);
    
    // Broadcast status update
    broadcast({
      type: 'job_status',
      job
    });
    
    // Process based on task type
    let result;
    switch (task) {
      case 'puppeteer':
        result = await triggerPuppeteerTask(target, options);
        break;
      case 'scrape':
        result = { message: `Scraped target: ${target}`, data: {} };
        break;
      case 'api_call':
        result = { message: `API call to: ${target}`, data: {} };
        break;
      default:
        result = { message: `Executed task: ${task}`, data: {} };
    }
    
    // Update job as completed
    job.status = 'completed';
    job.result = result;
    job.completedAt = new Date().toISOString();
    job.updatedAt = new Date().toISOString();
    
    jobs.set(jobId, job);
    
    // Broadcast completion
    broadcast({
      type: 'job_completed',
      job
    });
    
  } catch (error) {
    console.error(`Job ${jobId} failed:`, error);
    
    // Update job as failed
    const job = jobs.get(jobId);
    if (job) {
      job.status = 'failed';
      job.error = error.message;
      job.failedAt = new Date().toISOString();
      job.updatedAt = new Date().toISOString();
      
      jobs.set(jobId, job);
      
      // Broadcast failure
      broadcast({
        type: 'job_failed',
        job
      });
    }
  }
}

// Get job status endpoint
app.get('/jobs/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);
  
  if (!job) {
    return res.status(404).json({
      error: 'Job not found',
      jobId
    });
  }
  
  res.json(job);
});

// Get all jobs endpoint
app.get('/jobs', (req, res) => {
  const allJobs = Array.from(jobs.values());
  res.json(allJobs);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'HEX Control Nexus Webhook Service',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  const allJobs = Array.from(jobs.values());
  const statusCounts = allJobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});
  
  res.json({
    total_jobs: allJobs.length,
    status_counts: statusCounts,
    pending_jobs: allJobs.filter(j => j.status === 'queued' || j.status === 'processing').length,
    completed_jobs: allJobs.filter(j => j.status === 'completed').length,
    failed_jobs: allJobs.filter(j => j.status === 'failed').length,
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`
██╗  ██╗███████╗██╗  ██╗    ██████╗ ███████╗ ██████╗██╗   ██╗███████╗
██║  ██║██╔════╝╚██╗██╔╝    ██╔══██╗██╔════╝██╔════╝██║   ██║██╔════╝
███████║█████╗   ╚███╔╝     ██║  ██║█████╗  ██║     ██║   ██║███████╗
██╔══██║██╔══╝   ██╔██╗     ██║  ██║██╔══╝  ██║     ██║   ██║╚════██║
██║  ██║███████╗██╔╝ ██╗    ██████╔╝███████╗╚██████╗╚██████╔╝███████║
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝    ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝
  `);
  console.log('HEX Control Nexus Webhook Service');
  console.log(`Webhook server running on port ${PORT}`);
  console.log(`WebSocket server available at ws://localhost:${PORT}`);
});