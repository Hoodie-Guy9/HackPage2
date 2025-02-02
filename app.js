const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const useragent = require('useragent');  // Use useragent package

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Function to get visitor IP & location
async function getVisitorInfo(req) {
    try {
        // Get public IP
        const ipResponse = await axios.get('https://api64.ipify.org?format=json');
        const ip = ipResponse.data.ip;

        // Get geolocation data from ipinfo.io
        const geoResponse = await axios.get(`https://ipinfo.io/${ip}/json?token=eae8797467ee7e`);
        const geo = geoResponse.data;

        // Get OS & Browser details
        const userAgentString = req.headers['user-agent'] || 'Unknown';
        const parsedUA = useragent.parse(userAgentString);  // Using useragent package

        return {
            ip: ip || 'Unknown',
            location: geo.city ? `${geo.city}, ${geo.country}` : 'Unknown',
            os: parsedUA.os.family || 'Unknown',  // Correctly extracting OS name
            osVersion: parsedUA.os.toVersion() || 'Unknown',  // Correctly extracting OS version
            browser: parsedUA.toAgent() || 'Unknown',  // Correctly extracting browser details
            isp: geo.org || 'Unknown ISP',
            timezone: geo.timezone || 'Unknown Timezone'
        };
    } catch (error) {
        console.error('❌ Error fetching visitor data:', error.message);
        return { ip: 'Unknown', location: 'Unknown', os: 'Unknown', osVersion: 'Unknown', browser: 'Unknown', isp: 'Unknown', timezone: 'Unknown' };
    }
}

// Route to serve visitor data
app.get('/visitor-data', async (req, res) => {
    const visitorData = await getVisitorInfo(req);

    // Log visitor info
    const logMessage = `${new Date().toISOString()} | IP: ${visitorData.ip} | Location: ${visitorData.location} | OS: ${visitorData.os} ${visitorData.osVersion} | Browser: ${visitorData.browser} | ISP: ${visitorData.isp} | Timezone: ${visitorData.timezone}\n`;
    fs.appendFile(path.join(__dirname, 'logs', 'visitor_log.txt'), logMessage, (err) => {
        if (err) console.log('Error logging visitor info:', err);
    });

    res.json(visitorData);
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`💀 Hacker site running at http://localhost:${port}`);
});