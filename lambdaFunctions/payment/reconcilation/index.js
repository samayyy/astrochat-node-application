const http = require('http');

/**
 * GCP Cloud Function to trigger payment reconciliation.
 *
 * @param {object} req The HTTP request object.
 * @param {object} res The HTTP response object.
 */
exports.astrochatpaymentreconcilation = (req, res) => {
    const astroPaymentServiceApi = process.env.AstroPaymentServiceApiHost;

    // Data from Cloud Scheduler is in the request body.
    const duration = req.body.duration || 15; // Default to 15 if not provided.
    console.log(`Starting reconciliation for duration: ${duration}`);

    const postData = JSON.stringify({
        data: {
            duration: duration
        }
    });

    const options = {
        host: astroPaymentServiceApi,
        path: '/payment/v1/internal/order/reconcile',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        },
    };

    const request = http.request(options, response => {
        let responseData = '';
        response.on('data', chunk => {
            responseData += chunk;
        });
        response.on('end', () => {
            console.log('Response from payment service:', responseData);
            res.status(200).send(`Successfully triggered reconciliation.`);
        });
    });

    request.on('error', error => {
        console.error("Error calling payment service:", error);
        res.status(500).send("Failed to trigger reconciliation.");
    });

    request.write(postData);
    request.end();
};
