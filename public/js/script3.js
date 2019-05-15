var socket = io('http://localhost:3000');
socket.on('datas', function(data) {
  // $(".test2").text(data);
  var aData = data;
  // var query = {date:}
  // $(".test2").text(typeof(aData));

  var seriesData = {
    hum: [],
    temp: [],
    humk: [],
    lux: []
  };

  var numberSample = 90;
  var timescale = [];
  var today;

      // var z = aData[100]['param']['hum'];
      // document.getElementById("test2").innerHTML = [typeof(z),z];
        var dataLength = 10; // number of dataPoints visible at any point
        // var updateInterval = 6000; //time interval
        // var timeStep = 1800000;
        var dataPoints = numberSample - dataLength;
        for(var n = dataPoints; n < numberSample; n++) {
          seriesData['hum'].push(aData[n]['param']['hum']);
          seriesData['temp'].push(aData[n]['param']['temp']);
          seriesData['humk'].push(aData[n]['param']['humk']);
          seriesData['lux'].push(aData[n]['param']['lux']);
            // seriesData['timescale'].push((aData[n].date.hour).toString();
            timescale.push(aData[n].date.hour);
            // $(".test2").text(timescale);
          };

          // today = new Date(aData[numberSample-1].date.current);

          // var year = today.substring(0,4);
          // var month = today.substring(5,7);
          // var day = today.substring(8,10);

          // var oneDay = 86400000; //(ms)
          // var d = new Date(year, month, day).getTime();

          // var currentDay =today.getTime();
          // $(".test2").text(today);

          var updateChart = function() {

            var myConfig = {
              "type": "line",
              "title": {
                "text": "Đồ thị độ ẩm đất và không khí",
                "color":"#2835ea",
                "font-size": "24px"
              },
              // "plotarea": {
              //   "adjust-layout": true
              // },
              "scale-x": {
                "labels": timescale
              },
              "series":[
              {
                "values":seriesData['hum'],
                "line-color": "green",
              },
              {
                "values":seriesData['humk'],
                "line-color": "red",

              },
              ]
            };
      // Render the chart using the data from Mongo
      zingchart.render({
        id:"myChart",
        width:"100%",
        height:500,
        data: myConfig
      });
    };

      //chart lux
      var updateChart2 = function() {

        let myConfig = {
          "type": "line",
          "title": {
            "text": "Đồ thị cường độ ánh sáng, nhiệt độ",
            "color":"#2835ea",
            "font-size": "24px"
          },
          // "plotarea": {
          //   "adjust-layout": true
          // },
          "scale-x": {
            "labels": timescale
          },
          "series":[
          {
            "values":seriesData['lux']
          },
          {
            "values":seriesData['temp'],
            "line-color": "red",
          },
          ]
        };
      // Render the chart using the data from Mongo
      zingchart.render({
        id:"myChart_lux",
        width:"100%",
        height:500,
        data: myConfig
      });
    };

    updateChart();
    updateChart2();


    // the data 
    var x2='';
    var x1 ='<table border = "1"><tr><th>Time</th><th>Temperature</th><th>Humidity</th><th>Lux</th><th>Humk</th></tr>'; 
    var x3='</table>';
    var y ='';
    for (var i = 0; i < 10 ; i++) {
  // var y =`<div>${i}</div>`
  y = '<tr><td></td><td>Maria Anders</td><td>Germany</td><td>Maria Anders</td><td>Germany</td></tr>';

  x2 += y;
}

var z = x1+x2+x3;
$("#day1").html(z);

//show date now
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth();
var day = date.getDate();
var hour = date.getHours();
var minutes = date.getMinutes();
var time = day+"-"+month+"-"+year+"   "+hour + ":" +minutes;
$("#date").text(time);
});



