var express =  require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const validUrl = require('valid-url');


mongoose.connect('mongodb://'+process.env.User+':'+process.env.password+'@ds131320.mlab.com:31320/urls');

const urlSchema = new mongoose.Schema({
  url: String,
  urlShortned: String
});

const Urls = mongoose.model("Urls", urlSchema);

// var firstOne = {
//   url: 'www.google.com',
//   urlShortned: '1'
// };
//
// Urls(firstOne).save();

const PORT  = process.env.PORT || 3000;

app.use(function(req, res, next){
  if (req.headers['x-forwarded-proto'] === 'https'){
    res.redirect('http://'+ req.hostname + req.url);
  }else {
    next();
  }
});


//// / shall get the home page
/// '/:ShortUrl' must return url that was shortned
// '/new/:newUrl' takes the url and makes a shortned version
// '/error' this route must receive people who pass bad urls


var urls = [
  {
    url: '',
    urlShortned:''

  }
];

app.get('/' , function(req, res, next) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/new', function(req, res,next) {
  res.send('You have inserted an invalid URL');
});
app.get('/new/*', function(req, res, next) {

  if(validUrl.isUri(req.params[0]) != undefined){
    Urls.findOne({url: req.params[0]}, function(err , url) {

      if(url === null) {
        Urls.count({}, function(err, count){
          Urls(urlShortner(req.params[0], count)).save();
          res.json(urlShortner(req.params[0], count));

        })
      }else {
        res.json(parseDb(url));
      }

    });

  }else {
    res.redirect('/new');
  }
})


app.get('/:key' , function(req, res, next) {
  // look for the shortned url and redirect to the real

  var find = 'https://andrei-little-url.herokuapp.com/'+ req.params.key;
    Urls.findOne({urlShortned: find }, function(err, obj) {
    if (obj === null){
      res.redirect('/new');
    } else {
      return obj;
    }
  }).then(function(obj){
      res.redirect(obj.url);
    });

});


app.listen(PORT, function() {
  console.log('server is up on port ' + PORT);
});






// this parsers takes the database response and returns only the url an urlShortned leaving out the id.
function parseDb(db) {
  return {
    url: db.url,
    urlShortned: db.urlShortned
  }
}

function urlShortner(url, count){
  count = count +1;
  return {
    url: url,
    urlShortned: 'https://andrei-little-url.herokuapp.com/'+ count
  };
};
