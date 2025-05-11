/**
 * Speed test functionality for fast.com clone
 * Simulates download, upload, and latency measurements
 */

class SpeedTest {
    constructor() {
        // DOM elements
        this.loadingElement = document.getElementById('loading');
        this.resultElement = document.getElementById('result');
        this.downloadSpeedElement = document.getElementById('download-speed');
        this.uploadSpeedElement = document.getElementById('upload-speed');
        this.latencyUnloadedElement = document.getElementById('latency-unloaded');
        this.latencyLoadedElement = document.getElementById('latency-loaded');
        this.additionalMetricsElement = document.getElementById('additional-metrics');
        
        // Test configuration
        this.testConfig = {
            downloadTestDuration: 10000, // 10 seconds
            uploadTestDuration: 8000,    // 8 seconds
            latencyTestCount: 5,         // Number of pings
            downloadSizes: [1, 2, 5, 10, 20], // MB
            uploadSizes: [1, 2, 5],      // MB
            maxConnections: 8,           // Maximum parallel connections
            testServer: 'https://httpbin.org' // For demo purposes
        };
        
        // Test state
        this.isRunning = false;
        this.testResults = {
            download: 0,
            upload: 0,
            latencyUnloaded: 0,
            latencyLoaded: 0
        };
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize speed test
     */
    init() {
        // Hide result initially, show loading
        if (this.resultElement) this.resultElement.style.display = 'none';
        if (this.loadingElement) this.loadingElement.style.display = 'flex';
        
        // Start the test sequence
        this.startTest();
    }
    
    /**
     * Start the complete test sequence
     */
    async startTest() {
        this.isRunning = true;
        
        try {
            // First measure unloaded latency
            await this.measureLatency(false);
            
            // Then measure download speed
            await this.measureDownloadSpeed();
            
            // Show the download result
            this.showResult();
            
            // Then measure upload speed
            await this.measureUploadSpeed();
            
            // Finally measure loaded latency
            await this.measureLatency(true);
            
            // Update all metrics
            this.updateAllMetrics();
        } catch (error) {
            this.handleError(error);
        }
        
        this.isRunning = false;
    }
    
    /**
     * Handle errors during speed test
     * @param {Error} error - The error that occurred
     */
    handleError(error) {
        // Log the error for debugging
        console.error('Speed test error:', error);
        
        // Show error state in UI
        this.showError();
        
        // If we have partial results, still show them
        if (this.testResults.download > 0) {
            this.updateDownloadSpeed(this.testResults.download);
            this.showResult();
        }
    }
    
    /**
     * Measure download speed
     */
    async measureDownloadSpeed() {
        const startTime = Date.now();
        let totalBytesDownloaded = 0;
        let lastUpdateTime = startTime;
        let connections = [];
        
        // Create multiple connections for parallel downloads
        const connectionCount = this.determineConnectionCount();
        
        for (let i = 0; i < connectionCount; i++) {
            connections.push(this.downloadFile());
        }
        
        // Update speed while test is running
        const updateInterval = setInterval(() => {
            const currentTime = Date.now();
            const elapsedSecs = (currentTime - lastUpdateTime) / 1000;
            
            if (elapsedSecs > 0) {
                // Calculate current speed in Mbps
                const currentSpeed = (totalBytesDownloaded * 8) / (elapsedSecs * 1000000);
                this.testResults.download = currentSpeed;
                
                // Update UI with current speed
                this.updateDownloadSpeed(currentSpeed);
                
                // Reset for next update
                totalBytesDownloaded = 0;
                lastUpdateTime = currentTime;
            }
        }, 200);
        
        // Wait for test duration
        await new Promise(resolve => setTimeout(resolve, this.testConfig.downloadTestDuration));
        
        // Clean up
        clearInterval(updateInterval);
        connections.forEach(connection => {
            if (connection && connection.abort) {
                connection.abort();
            }
        });
        
        // Ensure we have a reasonable value (in case of very slow connections)
        if (this.testResults.download < 0.1) {
            this.testResults.download = 0.1;
        }
        
        return this.testResults.download;
    }
    
    /**
     * Simulate downloading a file
     * In a real implementation, this would download actual files
     */
    async downloadFile() {
        try {
            // Select a random file size from the configured sizes
            const sizeIndex = Math.floor(Math.random() * this.testConfig.downloadSizes.length);
            const sizeInMB = this.testConfig.downloadSizes[sizeIndex];
            
            // Simulate download speed variations
            const randomFactor = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
            const simulatedSpeed = 50 * randomFactor; // Simulate ~50 Mbps with variation
            
            // Calculate how long this download should take at the simulated speed
            const downloadTimeMs = (sizeInMB * 8) / simulatedSpeed * 1000;
            
            // Simulate the download
            await new Promise(resolve => setTimeout(resolve, downloadTimeMs));
            
            // Return simulated bytes downloaded
            return sizeInMB * 1024 * 1024;
        } catch (error) {
            throw new Error(`Download error: ${error.message}`);
        }
    }
    
    /**
     * Measure upload speed
     */
    async measureUploadSpeed() {
        try {
            // Similar to download but simulating upload
            const startTime = Date.now();
            let totalBytesUploaded = 0;
            
            // Simulate upload test
            const simulatedUploadSpeed = 10 + Math.random() * 20; // 10-30 Mbps
            const uploadSizeInMB = 5; // 5 MB total upload
            const uploadTimeMs = (uploadSizeInMB * 8) / simulatedUploadSpeed * 1000;
            
            // Simulate the upload
            await new Promise(resolve => setTimeout(resolve, uploadTimeMs));
            
            // Calculate final speed
            this.testResults.upload = simulatedUploadSpeed;
            this.updateUploadSpeed(simulatedUploadSpeed);
            
            return simulatedUploadSpeed;
        } catch (error) {
            throw new Error(`Upload error: ${error.message}`);
        }
    }
    
    /**
     * Measure latency (ping)
     * @param {boolean} loaded - Whether to measure under load
     */
    async measureLatency(loaded) {
        let totalLatency = 0;
        let successfulTests = 0;
        
        // Perform multiple latency tests and average the results
        for (let i = 0; i < this.testConfig.latencyTestCount; i++) {
            try {
                // Simulate a ping
                const pingDelay = loaded ? 
                    20 + Math.random() * 40 : // 20-60ms when loaded
                    10 + Math.random() * 20;  // 10-30ms when unloaded
                
                await new Promise(resolve => setTimeout(resolve, pingDelay));
                
                const latency = pingDelay; // In a real test, this would be Date.now() - pingStart
                totalLatency += latency;
                successfulTests++;
            } catch (error) {
                // Continue with other tests if one fails
                continue;
            }
        }
        
        // Calculate average latency if we have any successful tests
        if (successfulTests > 0) {
            const avgLatency = totalLatency / successfulTests;
            
            // Update the appropriate latency result
            if (loaded) {
                this.testResults.latencyLoaded = avgLatency;
                this.updateLatencyLoaded(avgLatency);
            } else {
                this.testResults.latencyUnloaded = avgLatency;
                this.updateLatencyUnloaded(avgLatency);
            }
            
            return avgLatency;
        } else {
            throw new Error('All latency tests failed');
        }
    }
    
    /**
     * Determine optimal number of connections based on network conditions
     */
    determineConnectionCount() {
        // In a real implementation, this would adapt based on network conditions
        // For now, return a fixed number
        return Math.min(4, this.testConfig.maxConnections);
    }
    
    /**
     * Show the speed test result
     */
    showResult() {
        if (this.loadingElement) this.loadingElement.style.display = 'none';
        if (this.resultElement) this.resultElement.style.display = 'block';
    }
    
    /**
     * Show error message
     */
    showError() {
        if (this.loadingElement) this.loadingElement.style.display = 'none';
        if (this.resultElement) {
            this.resultElement.style.display = 'block';
            this.downloadSpeedElement.textContent = '0';
        }
    }
    
    /**
     * Update download speed display
     * @param {number} speed - Speed in Mbps
     */
    updateDownloadSpeed(speed) {
        if (this.downloadSpeedElement) {
            this.downloadSpeedElement.textContent = speed.toFixed(1);
        }
    }
    
    /**
     * Update upload speed display
     * @param {number} speed - Speed in Mbps
     */
    updateUploadSpeed(speed) {
        if (this.uploadSpeedElement) {
            this.uploadSpeedElement.textContent = speed.toFixed(1);
        }
    }
    
    /**
     * Update unloaded latency display
     * @param {number} latency - Latency in ms
     */
    updateLatencyUnloaded(latency) {
        if (this.latencyUnloadedElement) {
            this.latencyUnloadedElement.textContent = Math.round(latency);
        }
    }
    
    /**
     * Update loaded latency display
     * @param {number} latency - Latency in ms
     */
    updateLatencyLoaded(latency) {
        if (this.latencyLoadedElement) {
            this.latencyLoadedElement.textContent = Math.round(latency);
        }
    }
    
    /**
     * Update all metrics displays
     */
    updateAllMetrics() {
        this.updateDownloadSpeed(this.testResults.download);
        this.updateUploadSpeed(this.testResults.upload);
        this.updateLatencyUnloaded(this.testResults.latencyUnloaded);
        this.updateLatencyLoaded(this.testResults.latencyLoaded);
    }
    
    /**
     * Restart the speed test
     */
    restart() {
        // Reset test results
        this.testResults = {
            download: 0,
            upload: 0,
            latencyUnloaded: 0,
            latencyLoaded: 0
        };
        
        // Hide result, show loading
        if (this.resultElement) this.resultElement.style.display = 'none';
        if (this.loadingElement) this.loadingElement.style.display = 'flex';
        
        // Hide additional metrics if they're shown
        if (this.additionalMetricsElement) {
            this.additionalMetricsElement.classList.remove('show');
            
            // Update button text
            const moreInfoBtn = document.getElementById('more-info-btn');
            if (moreInfoBtn && window.languageManager) {
                moreInfoBtn.textContent = window.languageManager.translate('show-more');
            }
        }
        
        // Start the test again
        this.startTest();
    }
}

// Initialize speed test when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a moment to ensure language manager is initialized
    setTimeout(() => {
        window.speedTest = new SpeedTest();
        
        // Add click handler to restart test when clicking on the result
        const resultElement = document.getElementById('result');
        if (resultElement) {
            resultElement.addEventListener('click', () => {
                if (window.speedTest && !window.speedTest.isRunning) {
                    window.speedTest.restart();
                }
            });
        }
    }, 500);
});