
const _ = require("lodash");
const request = require('request-promise');

module.exports = app => {

	app.post("/get", async (req, res) => {
        return new Promise((resolve, reject) => {
            request({
                url: "http://coolloader.herokuapp.com/"+ req.body.url,
                timeout: "15000",
                headers: {
                    'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Safari/537.36.'
                },
            })
            .then((response) => {
                res.send(response)
            })
            .catch((err) => {
                console.log(err)
            })
        });
	});
	
};

const buildQuery = criteria => {
    const query = {};

	return query
};


