const http = require('http')
const astrostuckscheduler = function(event, context) {
    const astroServiceApi = process.env['AstroServiceApiHost'];

    const options = {
        host: astroServiceApi,
        path: '/astro/v1/metrics/astrologer/status-tracking',
        method: 'GET',
        headers: {    
            'Content-Type': 'application/json'
        },
    };

    const req = http.request(options, res => {
        let response = '';
        res.on('data', chunk => {
            response += chunk;
        });
        res.on('end', () => {
            try {
                if (response) {
                    response = JSON.parse(response);
                    console.log('\n response%j', response);
                }
            } catch (error) {
                console.log('\n Error parsing response:', error);
            }
        });
    });
    
    req.on('error', error => {
        console.log("error", JSON.stringify(error));
    });
    
    req.end();
    console.log('\n astrostuckscheduler finished');
};

module.exports = { astrostuckscheduler }