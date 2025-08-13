const http = require('http');

/**
 * GCP Cloud Function to check for stuck astrologer conversations.
 *
 * @param {object} req The HTTP request object.
 * @param {object} res The HTTP response object.
 */
exports.astrostuckscheduler = (req, res) => {
    const astroServiceApi = process.env.AstroServiceApiHost;

    const options = {
        host: astroServiceApi,
        path: '/astro/v1/metrics/astrologer/status-tracking',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    const request = http.request(options, response => {
        let responseData = '';
        response.on('data', chunk => {
            responseData += chunk;
        });
        response.on('end', () => {
            console.log('Response from astro service:', responseData);
            res.status(200).send('Successfully triggered astro stuck scheduler.');
        });
    });

    request.on('error', error => {
        console.error("Error calling astro service:", error);
        res.status(500).send("Failed to trigger astro stuck scheduler.");
    });

    request.end();
};
