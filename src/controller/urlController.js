const urlModel = require('../model/urlmodel')
const validUrl = require('valid-url')
const shortid = require('shortid')

const baseUrl = 'http:localhost:3000'

const Shortenurl = async function (req, res) {
    const longgerurl = req.body.longUrl // destructure the longUrl from req.body.longUrl

    // check base url if valid using the validUrl.isUri method
    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base URL')
    }

    // if valid, we create the url code
    const urlCode = shortid.generate()

    // check long url if valid using the validUrl.isUri method
    if (validUrl.isUri(longgerurl)) {
        try {
            /* The findOne() provides a match to only the subset of the documents 
            in the collection that match the query. In this case, before creating the short URL,
            we check if the long URL was in the DB ,else we create it.
            */
            let url = await urlModel.findOne({longUrl: longgerurl
            })
             console.log(url)
            // url exist and return the respose
            if (url) {
                res.json(url)
            } else {
                // join the generated short code the the base url
                const shortUrl = baseUrl + '/' + urlCode

                // invoking the Url model and saving to the DB
                url = new urlModel({
                    longUrl: longgerurl,
                    shortUrl,
                    urlCode,
        
                })
                await url.save()
                res.json(url)
            }
        }
        // exception handler
        catch (err) {
            console.log(err)
            res.status(500).json('Server Error')
        }
    } else {
        res.status(401).json('Invalid longUrl')
    }
}

        
        // let longurl=await urlModel.create(body)
        // console.log(longurl)
        // const Longurl=body.longUrl

        // const urlId = shortId.generate();
        // console.log(urlId)
         
        // if (validateUrl(Longurl)) {
        // let url = await urlModel.findOne({ Longurl });
        // console.log(url)
        //  }
        


        



    // } catch (err) {
    //     res.status(500).send({ status: false, error: err.message });
    // }


    module.exports.Shortenurl = Shortenurl