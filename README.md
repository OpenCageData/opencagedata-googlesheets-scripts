You can use Google Sheets and the [OpenCage Geocoder](https://geocoder.opencagedata.com) to quickly convert a list of coordinates to placenames (reverse geocoding) or vice versa (forward geocoding).

1. register for an OpenCage Geocoder API key ([signup here](https://geocoder.opencagedata.com/users/sign_up))

2. create a new Sheet

Put you addresses in a column, or your coordinates in two columns (latitude, longitude)

**First we show how to do reverse geocoding**


![Reverse Geocoding in Sheets example](reverse1.png)

3. open Tools > Scripts editor

![Scripts editor](reverse2.png)

4. copy the script [opencage.js](opencage.js) into the scripts editor and save.

![Scripts editor](scripts-editor.png)

5. Reload your Google Sheet. After a few seconds a new "Geocode" button should appear

![Geocode button](geocode-button.png)

6. Select three columns, and then click on "Latitude, Longitude to Address"

  * You will be prompted to give the script access to your Google docs. You will need to select yes.

  * A popup will appear asking your for your API key. Enter it and click "Geocode"

![Enter key](enter-key.png)

7. The results will appear in the third column you selected.

![Reverse results](reverse-results.png)


**Forward geocoding is very similar:**

Follow steps 1-5 above

6. Create three columns, the first column should contain the address

![Forward example](forward-example.png)

7. Select the three columns and then click "Address to Latitude, Longitude" in the "Geocode" menu.

![Forward select](forward-select.png)

  * You will be prompted to give the script access to your Google docs. You will need to select yes.

  * A popup will appear asking your for your API key. Enter it and click "Geocode"

![Enter key](forward-key.png)

8. The results will appear in the second and third column you selected.

![Forward results](forward-results.png)




