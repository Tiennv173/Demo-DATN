// var mqtt = require('mqtt');
// var client  = mqtt.connect('mqtt://fillab:123123123@smartpump.ml:1883');


//var socket = io('http://192.168.0.104:3000');
var socket = io('http://smartpump.ml:3000');

socket.on('datas', function(data) {  
  // $(".test2").text(data);
  var aData = data;
  var leng = aData.length;

  Object.sizeObject = function(obj){
    var size = 0, key;
    for(key in obj) {
      if (obj.hasOwnProperty(key)) size ++;
    }
    return size;
  };

  var sizeData = Object.sizeObject(aData);

  var seriesData = {
    hum: [],
    temp: [],
    humk: [],
    lux: []
  };

  var numberSample = sizeData;
  var timescale = [];

  // var today = new Date(aData[numberSample-1].date.current);
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth();
  var day = today.getDate();
  var oneDay = 86400000; //(ms)
  var currentDay = new Date(year, month, day).getTime(); //type current miliseconds

  // $(".test2").text((currentDay));

  var dataLength = 20; // number of dataPoints visible at any point
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
    if(aData[i1].milis >= currentDay) 
      {
        indexToday.push(i1);
        countToday++;
      }
  };
  $(".test2").text(countToday);

  var timeToday;
  var monthToDay;
  var hourToday;
  for(var j1 =0; j1<countToday; j1++) {
    // $(".test2").text(countToday);
    dataToday['hum'].push(aData[indexToday[j1]]['param']['hum']);
    dataToday['temp'].push(aData[indexToday[j1]].param.temp);
    dataToday['humk'].push(aData[indexToday[j1]].param.humk);
    dataToday['lux'].push(aData[indexToday[j1]].param.lux);
    // time = aData[indexToday[j1]].date.current.getDate()+"/"+((aData[indexToday[j1]].date.current).getMonth()+1);
    hourToday = aData[indexToday[j1]].date.hour;
    timeToday = new Date(aData[indexToday[j1]].milis).getDate();
    monthToDay = new Date(aData[indexToday[j1]].milis).getMonth()+1;
    // time = time.getDate();
    dataToday['time'].push(hourToday+", "+timeToday+"/"+monthToDay);
  }
  // $(".test2").text(dataToday['time']);


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
  var threeDayAgo = currentDay - (oneDay*2);

  for( var i2 = 0; i2< numberSample; i2++) {
    if(aData[i2].milis >= threeDayAgo) {
      indexThreeDay.push(i2);
      countThreeDay++;
    }
  };
  $(".test2").append(countThreeDay);

  var timeThreeDay;
  var monthThreeDay;
  var hourThreeDay;
  for(var j2 = 0; j2<countThreeDay; j2++) {
    dataThreeDay['hum'].push(aData[indexThreeDay[j2]].param.hum);
    dataThreeDay['temp'].push(aData[indexThreeDay[j2]].param.temp);
    dataThreeDay['humk'].push(aData[indexThreeDay[j2]].param.humk);
    dataThreeDay['lux'].push(aData[indexThreeDay[j2]].param.lux);

    hourThreeDay = aData[indexThreeDay[j2]].date.hour;
    timeThreeDay = new Date(aData[indexThreeDay[j2]].milis).getDate();
    monthThreeDay = new Date(aData[indexThreeDay[j2]].milis).getMonth()+1;
    // time = time.getDate();
    dataThreeDay['time'].push(hourThreeDay+", "+timeThreeDay+"/"+monthThreeDay);
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
    if(aData[i3].milis >= (currentDay-oneDay*6)) 
      {
        indexWeek.push(i3);
        countWeek++;
      }
  };
  $(".test2").append(countThreeDay);

  var timeOneWeek;
  var monthOneWeek;
  var hourOneWeek;

  for(var j3 =0; j3<countWeek; j3++) {
    // $(".test2").text(countToday);
    dataWeek['hum'].push(aData[indexWeek[j3]].param.hum);
    dataWeek['temp'].push(aData[indexWeek[j3]].param.temp);
    dataWeek['humk'].push(aData[indexWeek[j3]].param.humk);
    dataWeek['lux'].push(aData[indexWeek[j3]].param.lux);

    hourOneWeek = aData[indexWeek[j3]].date.hour;
    timeOneWeek = new Date(aData[indexWeek[j3]].date.current).getDate();
    monthOneWeek = new Date(aData[indexWeek[j3]].date.current).getMonth()+1;

    dataWeek['time'].push(hourOneWeek+", "+timeOneWeek+"/"+monthOneWeek);
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
    var x1 ='<table id="example" class="display mt-3"><thead><tr><th>Time</th><th>Temperature</th><th>Humidity</th><th>Lux</th><th>Humk</th></tr></thead><tbody>'; 
    var x3='</tbody></table>';
    var y1 ='';
    for (var i = 0; i < countToday ; i++) {
    // var y =`<div>${i}</div>`
    y1 = '<tr><td>'+dataToday['time'][i]+'</td><td>'+dataToday['temp'][i]+'</td><td>'+dataToday['hum'][i]+'</td><td>'+dataToday['lux'][i]+'</td><td>'+dataToday['humk'][i]+'</td></tr>';

    x2 += y1;
    };

    // var a = '<thead><tr><th>Time</th><th>Temperature</th><th>Humidity</th><th>Lux</th><th>Humk</th></tr></thead><tbody>';
    // var b = 

    var x22 ='';
    var y2 = '';
    for (var j = 0; j < countThreeDay ; j++) {
    // var y =`<div>${i}</div>`
    y2 = '<tr><td>'+dataThreeDay['time'][j]+'</td><td>'+dataThreeDay['temp'][j]+'</td><td>'+dataThreeDay['hum'][j]+'</td><td>'+dataThreeDay['lux'][j]+'</td><td>'+dataThreeDay['humk'][j]+'</td></tr>';

    x22 += y2;
    }

    var x23 = '';
    var y3 = '';
    for (var j = 0; j < countWeek ; j++) {
    // var y =`<div>${i}</div>`
    y3 = '<tr><td>'+dataWeek['time'][j]+'</td><td>'+dataWeek['temp'][j]+'</td><td>'+dataWeek['hum'][j]+'</td><td>'+dataWeek['lux'][j]+'</td><td>'+dataWeek['humk'][j]+'</td></tr>';

    x23 += y3;
    }

var z1 = x1+x2+x3;
var z2 = x1+x22+x3;
var z3 = x1+x23+x3;

$("#test_table").html(z1);
$("#day1").html(z1);
$("#day3").html(z2);
$("#week1").html(z3);

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



// Actuator


var socket2 = io('http://localhost:3000');
$('document').ready(function() {

  var enableSubmit = function(ele) {
    $(ele).removeAttr("disabled");
  }

  $('#actuator').click(function() {
    let that = this;
    var message_lv1 = {"mac":"B4:E6:2D:15:8B:98","cmd":"pump","lvl":"1"};
    mesage_lv1 = JSON.stringify(message_lv1);
    socket2.emit('publish',mesage_lv1);
    $(this).attr("disabled", true);
    setTimeout(function() {enableSubmit(that)}, 5000);
  });

  $('#actuator2').click(function() {
    let that = this;
    var message_lv2 = {"mac":"B4:E6:2D:15:8B:98","cmd":"pump","lvl":"2"};
    mesage_lv2 = JSON.stringify(message_lv2);
    socket2.emit('publish',mesage_lv2);

    $(this).attr("disabled", true);
    setTimeout(function() {enableSubmit(that)}, 5000);
  });

  // $('#example').DataTable( {
  //   "pagingType": "full_numbers"
  // } );

})

