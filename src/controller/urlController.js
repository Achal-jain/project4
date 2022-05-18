const urlModel = require('../model/urlmodel')
const validUrl = require('valid-url')
const shortid = require('shortid')


const Shortenurl = async function (req, res) {
    try {
        const baseUrl = 'http:localhost:3000'

        let body = req.body

        if (Object.keys(body).length === 0) {
            return res.status(400).send({ status: false, message: "Please enter the data" })
        }
        if (!body.longUrl) {
            return res.status(400).send({ status: false, message: "Please Provide the URL for shorten url" })
        }
        if (!validUrl.isUri(body.longUrl)) {
            return res.status(400).send({ status: false, message: "Not a valid URL" })
        }

        let FindUrl = await urlModel.findOne({ longUrl: body.longUrl });  

        if (FindUrl) {
            return res.status(400).send({ status: false, message: "urlcode is already in used" })
        }
        let urlCode = shortid.generate().toLowerCase()
        let shortUrl = baseUrl + '/' + urlCode

        body.shortUrl = shortUrl
        body.urlCode = urlCode

        await urlModel.create(body)

        let ShowUrl = await urlModel.findOne({ longUrl: body.longUrl }).select({ longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0 })

        return res.status(201).send({ Status: true, data: ShowUrl })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getShortenurl = async function (req, res) {
    try {
        let code = req.params.urlCode

        let fetchCode = await urlModel.findOne({ urlCode: code })
        //console.log(fetchCode)

        if (!fetchCode)
            return res.status(400).send({ status: false, message: "Invalid Url-Code" })
        
            res.status(303).redirect(fetchCode.longUrl)
    } catch (err) {
        return res.status(500).send({ Status: false, error: message.err })
    }
}


module.exports.Shortenurl = Shortenurl
module.exports.getShortenurl = getShortenurl
