function geocode(query,gtype,key,language){

    // full API docs: https://geocoder.opencagedata.com/api    
    var url = 'https://api.opencagedata.com/geocode/v1/json?query='
        + query
        + '&key=' + key;
        
    if (language){
        url += '&language=' + language;
    }

    // we don't need annotations so we turn them off
    // to make it slightly faster
    url += 'no_annotations=1';
    
    var response = UrlFetchApp.fetch(url,{
        "headers" : {
            "Content-Type":"application/json",
            "Accept"      :"application/json"
        },
        muteHttpExceptions: true,
    });
  
    var code = response.getResponseCode();

    if (code == 200){ // success!
        var json = JSON.parse(response.getContentText());
        if (json){
            if (json.total_results >= 1){
                // modify here if you want to return other things
                if (gtype == 'reverse'){
                    return json.results[0].formatted;
                }
                // default to forward
                var coords = json.results[0].geometry.lat
                    + ','
                    + json.results[0].geometry.lng;
                return coords;
            } else {
                return "no results found";
            }
        }
    }
    else if (code == 402){
        return "free limit exceeded";
        // todo: print the time until access is again allowed
    }
    else if (code == 403){
        return "invalid API key";
    }
    else { // some other type of error
        return "error";
    }
}


//
// use this function for forward geocoding:
// to turn placenames into coordinates
//
function forward(place,key,language){
    return geocode(place,'forward',key,language);
}

//
// use this function for reverse geocoding:
// to turn coordinates into a placename
//
function reverse(lat,lon,key,language){
    var query = lat + '%2C' + lon;
    return geocode(query,'reverse',key,language);
}



