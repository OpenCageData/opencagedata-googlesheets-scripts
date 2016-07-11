function reverse(lat,lon,key,language){
    // full API docs: https://geocoder.opencagedata.com/api
    
    var url = 'https://api.opencagedata.com/geocode/v1/json?query='
        + lat
        + '%2C'
        + lon
        + '&key=' + key
        + '&language=' + language;
  
    var response = UrlFetchApp.fetch(url,{
        "headers" : {
            "Content-Type":"application/json",
            "Accept"      :"application/json"
        },
        muteHttpExceptions: true,
    });
  
    var code = response.getResponseCode();
    if (code == 200){
        var json = JSON.parse(response.getContentText());
        if (json){
            if (json.total_results >= 1){
                 // modify here if you want to return other things
                return json.results[0].formatted;
            } else {
                return "no results found";
            }
        }
    }
    else if (code == 402){
        return "free limit exceeded";
    }
    else if (code == 403){
        return "invalid API key";
    }
    else {
      return "error";
    }
}
