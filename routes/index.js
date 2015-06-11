var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');

var MongoClient = require('mongodb').MongoClient;
var longUrl;
var clicks;


/* GET home page. */
router.get('/', function(req, res, next) {
 res.render('index');
});
MongoClient.connect('mongodb://127.0.0.1:27017/shorten', function(err, db) {

router.post('/', function(request, response) {
var shortKey = uuid.v4();
var target= request.body.URL
console.log("howdy")

var collection =  db.collection('shorten_url')
collection.find(
  {'target': {$eq: target}},
  { target: 1, shortened:1}
  ).toArray(function(err,reply){
    if (reply.length>0){
    console.log(target)
    console.log(reply)
    response.redirect(reply[0].shortened);
    } else {
      collection.insert(
      {
       "shortened": shortKey,
       "target": target,
       "clicks": 0,
       "last_click": "2015-01-13T16:42:00"
      }), function(err, docs) {
          collection.find().toArray(function(err, results) {
            console.dir(results);
            response.redirect(shortKey);
          });//closes collection.find
        });//closes function
    }//closes else
  }//closes .toArray

});  


router.get('/:shortUrl', function(request, response){
  console.log('here')
  var collection = db.collection('shorten_url')
  var    shortUrl = request.params.shortUrl;
  console.log(shortUrl)
  
  collection.update(
    {shortened: {$eq: shortUrl}},
    {$inc: {clicks: 1}}
  )//closes .update
  collection.find(
    {shortened: {$eq: shortUrl}},
    { target: 1, shortened: 1, clicks:1}
  )//closes .find
  .toArray(function(err, result){  
   response.render('post', {"url": result[0]});
  })//closes .toArray
});//closes router.get
});//closes MongoClient


module.exports = router;