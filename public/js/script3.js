//var socket = io('http://192.168.0.104:3000');
var socket = io('http://localhost:3000');

socket.on('datas', function(data) {  
  // $(".test2").text(data);
  var aData = data;

  // Object.sizeObject = function(obj){
  //   var size = 0, key;
  //   for(key in obj) {
  //     if (obj.hasOwnProperty(key)) size ++;
  //   }
  //   return size;
  // };

  // var sizeData = Object.sizeObject(aData);
  // var query = {date:}
  // $(".test2").text(sizeData);

  var seriesData = {
    hum: [],
    temp: [],
    humk: [],
    lux: []
  };

  var numberSample = 70;
  var timescale = [];

  // var today = new Date(aData[numberSample-1].date.current);
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth()+1;
  var day = today.getDate();
  var oneDay = 86400000; //(ms)
  var currentDay = new Date(year, month, day).getTime(); //type current miliseconds


  var dataLength = 10; // number of dataPoints visible at any point
  // var updateInterval = 6000; //time interval
  // var timeStep = 1800000;
  var dataPoints = numberSample - dataLength;
  // console.log(aData.length());
  for(var n = dataPoints; n < numberSample; n++) {
    seriesData['hum'].push(aData[n]['param']['hum']);
    seriesData['temp'].push(aData[n]['param']['temp']);
    seriesData['humk'].push(aData[n]['param']['humk']);
    seriesData['lux'].push(aData[n]['param']['lux']);
    timescale.push(aData[n].date.hour);
  };


  // Data in today
  var dataToday = {
    time: [],
    hum: [],
    temp: [],
    humk: [],
    lux: []
  }
  var indexToday =[];
  var countToday =0;

  for( var i1 = 0; i1< numberSample; i1++) {
    if(aData[i1].date.current >= currentDay) 
      {
        indexToday.push(i1);
        countToday++;
      }
  };


  for(var j1 =0; j1<countToday; j1++) {
    // $(".test2").text(countToday);
    dataToday['hum'].push(aData[indexToday[j1]]['param']['hum']);
    dataToday['temp'].push(aData[indexToday[j1]].param.temp);
    dataToday['humk'].push(aData[indexToday[j1]].param.humk);
    dataToday['lux'].push(aData[indexToday[j1]].param.lux);
    dataToday['time'].push((aData[indexToday[j1]].date.current).getDate()+"/"+((aData[indexToday[j1]].date.current).getMonth()+1));
  }

  // Data in three day
  var dataThreeDay = {
    time: [],
    hum: [],
    temp: [],
    humk: [],
    lux: []
  }
  var indexThreeDay =[];
  var countThreeDay =0;

  for( var i2 = 0; i2< numberSample; i2++) {
    if(aData[i2].date.current >= currentDay - oneDay*2) {
      indexThreeDay.push(i2);
    countThreeDay++;
    }
  };
  $(".test2").text(countThreeDay);





  for(var j2 =0; j2<countThreeDay; j2++) {
    dataThreeDay['hum'].push(aData[indexThreeDay[i2]].param.hum);
    dataThreeDay['temp'].push(aData[indexThreeDay[i2]].param.temp);
    dataThreeDay['humk'].push(aData[indexThreeDay[i2]].param.humk);
    dataThreeDay['lux'].push(aData[indexThreeDay[i2]].param.lux);
    dataThreeDay['time'].push((aData[indexThreeDay[i2]].date.current).getDate()+"/"+((aData[indexThreeDay[i2]].date.current).getMonth()+1));
  }

  // Data in week
  var dataWeek = {
    time: [],
    hum: [],
    temp: [],
    humk: [],
    lux: []
  }
  var indexWeek =[];
  var countWeek =0;

  for( var i3 = 0; i3< numberSample; i3++) {
    if(aData[i3].date.current >= currentDay-oneDay*6) 
      {
        index.push(i3);
        countWeek++;
      }
  };


  for(var j3 =0; j3<countWeek; j3++) {
    // $(".test2").text(countToday);
    dataWeek['hum'].push(aData[indexWeek[i]].param.hum);
    dataWeek['temp'].push(aData[indexWeek[i]].param.temp);
    dataWeek['humk'].push(aData[indexWeek[i]].param.humk);
    dataWeek['lux'].push(aData[indexWeek[i]].param.lux);
    dataWeek['time'].push((aData[indexWeek[i3]].date.current).getDate()+"/"+((aData[indexWeek[i3]].date.current).getMonth()+1));
  }


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
          "text": "hum"
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
    for (var i = 0; i < countToday ; i++) {
  // var y =`<div>${i}</div>`
  y = '<tr><td>'+dataToday['time'][i]+'</td><td>'+dataToday['temp'][i]+'</td><td>'+dataToday['hum'][i]+'</td><td>'+dataToday['lux'][i]+'</td><td>'+dataToday['humk'][i]+'</td></tr>';

  x2 += y;
}

var z = x1+x2+x3;
$("#day1").html(z);

//show date now
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth()+1;
var day = date.getDate();
var hour = date.getHours();
var minutes = date.getMinutes();
var time = day+"-"+month+"-"+year+"   "+hour + ":" +minutes;
$("#date").text(time);
$("#date2").text(time);

});



