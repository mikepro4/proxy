
const _ = require("lodash");
const request = require('request-promise');

module.exports = app => {

	app.post("/get", async (req, res) => {
        return new Promise((resolve, reject) => {
            request({
                url: "http://coolloader.herokuapp.com/"+ req.body.url,
                timeout: "15000",
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


