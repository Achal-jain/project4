
const express = require("express");
const router = express.Router();
const urlModel = require('../controller/urlController');



router.post("/url/shorten", urlModel.Shortenurl)

router.get("/:urlCode", urlModel.Shortenurl)


module.exports=router
