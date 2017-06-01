/* jslint browser:true */

var id = null;
var firstTime = -1;

var gps1Lat = 43.7724967; //WSC
var gps1Long = -79.5076432;
var gps2Lat = 43.7721815 //SRC
var gps2Long = -79.5043401;

var v1 = 770;
var u1 = 680;
var v2 = 890;
var u2 = 950;

var loc1 ={latie : 43.773939 ,longie : -79.5072558,desc : "William Small Center"};
var loc2={latie : 43.7718983 ,longie : -79.5068937,desc : "Berg"};
var loc3={latie : 43.7732861 ,longie : -79.5057176, desc:"Curtis"};

var caches =[];
caches[0]=loc1;
caches[1]=loc2;
caches[2]=loc3;

var currentCache=0;

function togglegps() {
    var button = document.getElementById("togglegps");
    if (navigator.geolocation) {
        if (id === null) {
            id = navigator.geolocation.watchPosition(showPosition, handleError, {enableHighAccuracy : true, timeout: 1000});
            button.innerHTML = "STOP GPS";
            firstTime = -1;
        } else {
            navigator.geolocation.clearWatch(id);
            id = null;
            button.innerHTML = "START GPS";
        }
    } else {
        alert("NO GPS AVAILABLE");
    }
}

function handleError(error) {
    var errorstr = "Really unknown error";
    switch (error.code) {
    case error.PERMISSION_DENIED:
        errorstr = "Permission deined";
        break;
    case error.POSITION_UNAVAILABLE:
        errorstr = "Permission unavailable";
        break;
    case error.TIMEOUT:
        errorstr = "Timeout";
        break;
    case error.UNKNOWN_ERROR:
        error = "Unknown error";
        break;
    }
    alert("GPS error " + error);
}


function showPosition(position) {
    var latitude = document.getElementById("latitude");
    var longitude = document.getElementById("longitude");
    var now = document.getElementById("now");
    var debug = document.getElementById("debug");

    latitude.innerHTML = position.coords.latitude;
    longitude.innerHTML = position.coords.longitude;
    if (firstTime < 0) {
      firstTime = position.timestamp;
    }
    now.innerHTML = position.timestamp - firstTime;

    var curLatVal = position.coords.latitude;
    var curLonVal = position.coords.longitude;

    var currentLat=interpolateLat(position);
    var currentLong=interpolateLong(position);
    var debug =document.getElementById("debug");


  //  var u = checkn(curLonVal, long2, x, u2);
  //  var v = checkn(curLatVal, lat2, y, v2);

    debug.innerHTML="u= "+currentLong+ " v= "+currentLat;
    var num=document.getElementById("me");
    num.style.left=currentLong;
    num.style.top=currentLat;
}

function interpolateLong(position){
    return Math.abs((u1+(u2-u1)*(position.coords.longitude-gps1Long)/(gps2Long-gps1Long)));
}

function interpolateLat(position){
    return Math.abs(((v1+(v2-v1)*(position.coords.latitude-gps1Lat)/(gps2Lat-gps1Lat))));
}

function updateCache(){
    currentCache=(currentCache+1)%3;
    showCache();
}

function showCache(){
    var cacheCounter=currentCache;
//debug2.innerHTML=caches[cacheCounter].lat;
    var cacheLong =Math.abs((u1+(u2-u1)*(caches[cacheCounter].longie-gps1Long)/(gps2Long-gps1Long)));
    var cacheLat =Math.abs((v1+(v2-v1)*(caches[cacheCounter].latie-gps1Lat)/(gps2Lat-gps1Lat)));

    document.getElementById("target").style.left=cacheLong;
    document.getElementById("target").style.top=cacheLat;
}
