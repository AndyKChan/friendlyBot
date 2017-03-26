// This will perform a search. The object passed into this function
// can contain all the perameters the API accepts in the `POST /v2/search` endpoint
var NutritionixClient = require('nutritionix');
var nutritionix = new NutritionixClient({
    appId: 'f0efc5ac',
    appKey: '75f8e573f3d4e21f9b74334e590dc47a'
    // debug: true, // defaults to false
});

function getFatInfo(food){
  // This will perform a search. The object passed into this function
  // can contain all the perameters the API accepts in the `POST /v2/search` endpoint
  nutritionix.search({
    q:food,
    // use these for paging
    limit: 1,
    offset: 0,

    // controls the basic nutrient returned in search
    search_nutrient: 'fat'
  }).then(results => {
    var fullString = results.results[0].nutrient_name + ': ' +results.results[0].nutrient_value;
    console.log(fullString);
    return fullString;
  });
}

  function getCaloriesInfo(food){
    // This will perform a search. The object passed into this function
    // can contain all the perameters the API accepts in the `POST /v2/search` endpoint
    nutritionix.search({
      q:food,
      // use these for paging
      limit: 1,
      offset: 0,

      // controls the basic nutrient returned in search
      search_nutrient: 'calories'
    }).then(results => {
      var fullString = results.results[0].nutrient_name + ': ' +results.results[0].nutrient_value;
      console.log(fullString);
      return fullString;
    });
  }

    function getCarbInfo(food){
      // This will perform a search. The object passed into this function
      // can contain all the perameters the API accepts in the `POST /v2/search` endpoint
      nutritionix.search({
        q:food,
        // use these for paging
        limit: 1,
        offset: 0,

        // controls the basic nutrient returned in search
        search_nutrient: 'carb'
      }).then(results => {
        var fullString = JSON.stringify(results.results[0].nutrient_name) + ': ' + JSON.stringify(results.results[0].nutrient_value);
        console.log(fullString);
        return fullString;
      });
    }

function getNutrition(food){
  var fullNutritionString =
  'Nutrition info for ' + food + ' ' +
  getFatInfo(food) + ' ' +
  getCarbInfo(food) + ' ' +
  getCaloriesInfo(food);

  console.log(fullNutritionString);
}

getNutrition('salad');




//
//
// var querystring = require('querystring');
// var https = require('https');
//
// var host = "api.nutritionix.com";
// var appKey = "75f8e573f3d4e21f9b74334e590dc47a";
// var appId = "f0efc5ac";
//
// function performRequest(endpoint, method, data, success) { //method is GET or POST, data is food item
//   var dataString = JSON.stringify(data);
//   var headers = {
//     'Content-Type': 'application/json',
//   };
//
//   // if (method == 'GET') {
//     endpoint += '?' + querystring.stringify(data);
//   // }
//
//   var options = {
//     host: host,
//     path: endpoint,
//     method: method,
//     headers: headers
//   };
//
//   var req = https.request(options, function(res) {
//     res.setEncoding('utf-8');
//
//     var responseString = '';
//
//     res.on('data', function(data) {
//       responseString += data;
//     });
//
//     res.on('end', function() {
//       console.log(responseString);
//       var responseObject = JSON.parse(responseString);
//       success(responseObject);
//     });
//   });
//
//   req.write(dataString);
//   req.end();
// }
//
// performRequest('/v1_1/search/'+'cookie', 'GET', {
//   "fields" : "item_name",
//   "appId":appId,
//   "appKey":appKey,
//   // "query":"Cookies `n Cream"
// }, function(data) {
//   console.log('Fetched and called bot successfully!!!');
// });
