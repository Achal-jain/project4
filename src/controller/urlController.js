const urlModel = require('../model/urlmodel')
const validUrl = require('valid-url')
const shortid = require('shortid')
const redis = require("redis");
const { promisify } = require("util");

//-----------------------------Connect With Redis----------------------------------------------

const redisClient = redis.createClient(
  13865,
  "redis-13865.c264.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("80i2mn417hivwBz3n5kginpWOosOI0H5", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis");
});

const SETEX_ASYNC = promisify(redisClient.SETEX).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

//-------------------------------------CREATE Shorten Url-----------------------------------

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

    // let FindUrl = await urlModel.findOne({ longUrl: body.longUrl });

    // if (FindUrl) {
    //   return res.status(400).send({ status: false, message: "urlcode is already in used" })
    // }
    let urlCode = shortid.generate().toLowerCase()
    let shortUrl = baseUrl + '/' + urlCode

    body.shortUrl = shortUrl
    body.urlCode = urlCode

    await urlModel.create(body)

    let ShowUrl = await urlModel.findOne({ longUrl: body.longUrl }).select({ longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0 })

    let ncode = await GET_ASYNC(`${ShowUrl}`)

    if (ncode) {
      res.send(ncode)
    } else {
      let profile = await urlModel.findOne({ longUrl: body.longUrl }).select({ longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0 });
      await SETEX_ASYNC(`${body.longUrl}`, 3600, JSON.stringify(profile))
      res.status(201).send({ status: true , data: profile });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}

//-----------------------------------Redirect Orignal Url-----------------------------------------------

const getShortenurl = async function (req, res) {

  try {
    let Code = await GET_ASYNC(`${req.params.urlCode}`);

    let fetchCode = JSON.parse(Code);

    if (fetchCode) {
      return res.status(302).redirect(fetchCode.longUrl);
    } else {
      let getUrl = await urlModel.findOne({ urlCode: req.params.urlCode });

      if (!getUrl) {
        return res.status(404).send({ status: false, message: "Invalid Url-Code" });
      }
      await SETEX_ASYNC(`${req.params.urlCode}`, 3600, JSON.stringify(getUrl));
      return res.status(302).redirect(getUrl.longUrl);
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};



module.exports.Shortenurl = Shortenurl
module.exports.getShortenurl = getShortenurl
