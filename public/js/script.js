// Generates GET requests to a URL.
function httpGet(Url){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", Url, false);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}
window.onload=function(){
      // GET request to localhost:3000/test, which has been configured to send back our db data
      var aData = JSON.parse(httpGet('http://localhost:3000/device'));

      var dataLength = 15; // number of dataPoints visible at any point
      var updateInterval = 60000; //time interval


      var seriesData = {
        hum: [],
        temp: [],
        humk: [],
        lux: []
      };
      // Push the data into the seriesData object's arrays.
      for(var n = 0; n < dataLength; n++){
        seriesData['hum'].push(aData[n]['param'].hum;
          seriesData['temp'].push(aData[n]['param']['temp']);
          seriesData['humk'].push(aData[n]['param']['humk']);
          seriesData['lux'].push(aData[n]['param']['lux']);
        }

        var updateChart = function() {

      // Render the chart using the data from Mongo
      zingchart.render({
        id:"myChart",
        width:"100%",
        height:400,
        data:{
          "type":"line",
          "title":{
            "text":"Dynamic Humidity"
          },
          "plot":{
            "line-width":1,
            "aspect":"spline",
            "marker":{
              "visible":false
            }
          },
          "scale-x": {
            "min-value": new Date().getTime()-(1800000*(30-1)),
            "shadow": 0,
            "step": 1800000,
            "transform": {
              "type": "date",
              "all": "%D, %d %M<br />%h:%i %A",
              "guide": {
                "visible": false
              },
              "item": {
                "visible": false
              }}
            },
            "series":[
            {
              "values":seriesData['hum']
            }
            ]
          }
        });
      dataLength++;
      seriesData['series_0'].push(aData[dataLength]['series0']);
      seriesData['series_1'].push(aData[dataLength]['series1']);
      seriesData['series_2'].push(aData[dataLength]['series2']);
      seriesData['series_3'].push(aData[dataLength]['series3']);
      seriesData['series_0'].shift();
      seriesData['series_1'].shift();
      seriesData['series_2'].shift();
      seriesData['series_3'].shift();

    }
    updateChart();
    
    setInterval(function(){updateChart()}, updateInterval);

  };