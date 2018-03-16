var language = 'en';  // change this if you want results in another language
var ss = SpreadsheetApp.getActiveSpreadsheet(),
    sheet = ss.getActiveSheet(),
    activeRange = ss.getActiveRange(),
    settings = {};

function forward(){
    getKey('forward');
}

function reverse(){
    getKey('reverse');
}

function callAPI(query, key){
    // full API docs: https://geocoder.opencagedata.com/api    
    var url = 'https://api.opencagedata.com/geocode/v1/json?query='
        + encodeURIComponent(query)
        + '&key=' + key;
        
    if (language){
        url += '&language=' + language;
    }

    // we don't need annotations so we turn them off
    // to make it slightly faster
    url += '&no_annotations=1';

    // more privacy
    url += '&no_record=1';
    
    var response = UrlFetchApp.fetch(url,{
        "headers" : {
            "Content-Type":"application/json",
            "Accept"      :"application/json"
        },
        muteHttpExceptions: true,
    });
    return response;
}

function error_txt(code){
    if (code == 402){
        return "free limit exceeded";
    }
    else if (code == 403){
        return "invalid API key";
    }
    return "error";
}

function getKey(gtype){
    var app = UiApp.createApplication()
        .setTitle('Please enter your OpenCage API key')
        .setStyleAttribute('width', '460')
        .setStyleAttribute('padding', '20');

    var grid = app.createGrid(3, 2);
    grid.setWidget(1, 0, app.createLabel('API key:'));
    grid.setWidget(1, 1, app.createTextBox().setName('key').setId('key'));
    
    var panel = app.createVerticalPanel().setId('geocodePanel');
    // add grid to panel
    panel.add(grid);
    var button = app.createButton('Geocode')
      .setStyleAttribute('margin-top', '10')
      .setId('geocode');
    var handler;
    if (gtype == 'forward'){
        handler = app.createServerClickHandler('do_forward');
    } else {
        handler = app.createServerClickHandler('do_reverse');
    }
    handler.addCallbackElement(grid);
    button.addClickHandler(handler);
    grid.setWidget(2, 1, button);
    app.add(panel);
    ss.show(app);
}

function do_forward(e){
    var key = e.parameter.key;
    var sheet = SpreadsheetApp.getActiveSheet();
    var cells = sheet.getActiveRange();

    // Must have selected at least 3 columns (Address, Lat, Lng).
    // Must have selected at least 1 row.
    var columnCount = cells.getNumColumns();
    if (columnCount < 3) {
        var popup = SpreadsheetApp.getUi();
        popup.alert("Select at least three columns: Address in the leftmost column; the latitude, longitude will go into the next three columns.");
        return;
    }
  
    var addressRow;
    var addressColumn;
    var rowCount = cells.getNumRows();
      
    var latColumn = columnCount - 1; // Latitude  goes into the next-to-last col
    var lngColumn = columnCount; // Longitude goes into the last col
    var addresses = sheet.getRange(cells.getRow(), cells.getColumn(), rowCount, columnCount - 2).getValues();
  
    // For each row of selected data...
    for (addressRow = 1; addressRow <= rowCount; ++addressRow) {
        var place = addresses[addressRow - 1].join(' ');
        var response = callAPI(place, key);
        var code = response.getResponseCode();
      
        if (code == '200'){
            var json = JSON.parse(response.getContentText());
            if (json){
                if (json.total_results >= 1){
                    lat = json.results[0].geometry.lat;
                    lng = json.results[0].geometry.lng;
                    cells.getCell(addressRow, latColumn).setValue(lat);
                    cells.getCell(addressRow, lngColumn).setValue(lng);
                }
            }
        } else {
            var etxt = error_txt(code);
            cells.getCell(addressRow, latColumn).setValue(etxt);
        }
    }      
}

function do_reverse(e){
    var key = e.parameter.key;
    var sheet = SpreadsheetApp.getActiveSheet();
    var cells = sheet.getActiveRange();
  
    // Must have selected at least 3 columns (Address, Lat, Lng).
    // Must have selected at least 1 row.
    var columnCount = cells.getNumColumns(); 
    if (columnCount < 3){
        var popup = SpreadsheetApp.getUi();
        popup.alert("Select at least three columns: latitude, longitude in the two leftmost columns; the formatted address will go in the third column.");
        return;
    }
    
    var latColumn = 1;
    var lngColumn = 2;

    var addressRow;
    var addressColumn = columnCount;

    for (addressRow = 1; addressRow <= cells.getNumRows(); ++addressRow) {
        var lat = cells.getCell(addressRow, latColumn).getValue();
        var lng = cells.getCell(addressRow, lngColumn).getValue();
        var response = callAPI(lat + '%2C' + lng, key);
        var code = response.getResponseCode();

        if (code == '200'){
            var json = JSON.parse(response.getContentText());
            if (json){
                if (json.total_results >= 1){
                    var place = json.results[0].formatted;
                    cells.getCell(addressRow, addressColumn).setValue(place);
                }
            }
        } else {
            var etxt = error_txt(code);
            cells.getCell(addressRow, addressColumn).setValue(etxt);
        }
    }    
}

function generateMenu(){
  return [{
    name: "Address to Latitude, Longitude",
    functionName: "forward"
  },
  {
    name: "Latitude, Longitude to Address",
    functionName: "reverse"
  }];
}

function onOpen() {
    SpreadsheetApp.getActiveSpreadsheet().addMenu('Geocode', generateMenu());
}
