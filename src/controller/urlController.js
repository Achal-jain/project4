const urlModel = require('../model/urlmodel')
const validUrl = require("valid-url")

const Shortenurl = async function (req, res) {
    try {
        let body = req.body;

        if (Object.keys(body).length == 0)
            return res.status(400).send({ status: false, message: "Data is required for shorten url" })


    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
}

    module.exports.Shortenurl = Shortenurl