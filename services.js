// installation instructions
// 1. npm install body-parser
// 2. npm install express
// 3. npm install request

var express = require('express');
var app = express();
var request = require('request');

app.use(require('body-parser')())

app.get('/weather/getWeather/:zipcode', function(req, res) {
  res.type('application/json');
  var zip = req.params.zipcode;
  console.log("Parameter: " + zip);

  request('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20location%3D%22' + zip + '%22&format=json', function (error, response, body) {
    if (!error && response.statusCode == 200) {

//      console.log(body) // Print the google web page.
      // note: body is a string,  not a JSON object
      final = new Object();
      final.zipcode = zip;
      final.weather = JSON.parse(body);
      res.json(final);
    }
  })
});

// A simple async series:
var stringArray = [];
var results = [];

// Final task
function finalTask(res) 
{ 
   //console.log('Done', results); 
   var jsonString = JSON.stringify( results );
   //console.log(jsonString);
   
   weatherList = new Object();
   weatherList.cities = results;
   
   
   res.json(weatherList);	   
}


// Async task (same in all examples in this chapter)
function async(arg, callback) 
{
  var zip = arg;

  request('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20location%3D%22' + zip + '%22&format=json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log(body) // Print the google web page.
      final = new Object();
      final.zipcode = zip;
      final.weather = JSON.parse(body);
      callback(final);
    }
  });
}


app.post('/weather/getWeatherListByZip', function(req, res) {

	stringArray = [];
	results = [];

	var body = req.body;
	console.dir(req.body);
	var arr = body.zipList;

	for ( var i = 0; i < arr.length; i++ ) {
	    if ( typeof arr[i] == "string" ) {
		stringArray.push(arr[i]);
	    }
	}
	
	stringArray.forEach(function(item) {
	  async(item, function(result){
	    results.push(result);
	    if(results.length == stringArray.length) {
	      finalTask(res);
	    }
	  })
	});

});	


app.listen(process.env.PORT || 9999);