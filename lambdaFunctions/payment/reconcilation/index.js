const http = require('http')
const astrochatpaymentreconcilation = function(event, context) {
    const astroPaymentServiceApi = process.env['AstroPaymentServiceApiHost'];
    // console.log('\n astroPaymentServiceApi',astroPaymentServiceApi)
    // let astroPaymentServiceApi = "astro-payment.us-east-1.staging.shaadi.internal";

    const postData = JSON.stringify({
                data: {
                    duration : event.duration
                }
            });

    const options = {
        host: astroPaymentServiceApi,
        path: '/payment/v1/internal/order/reconcile',
        method: 'POST',
        headers:   {    
            'Content-Type' : 'application/json'
        },

    };

    const req = http.request(options, res => {
        let response = '';
        res.on('response', chunk => {
            response += chunk;
        });
        res.on('end', () => {
            response = JSON.parse(response);
            console.log('\n response%j',response)
        });
    });
    req.on('error', error => {
        console.log("error", JSON.stringify(error));
    })
    req.write(postData);
    req.end();
    console.log('\n finished');
};
// astrochatpaymentreconcilation()
module.exports = {astrochatpaymentreconcilation}