
const express = require("express");
const router = express.Router();
const urlModel = require('../controller/urlController');



router.post("/url/shorten", urlModel.Shortenurl)

router.get("/:urlCode", urlModel.getShortenurl)


module.exports=router
