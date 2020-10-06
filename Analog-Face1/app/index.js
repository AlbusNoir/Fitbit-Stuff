import document from "document";
import clock from "clock";
import {preferences} from "user-settings";
import * as util from "../common/utils"
import {today} from "user-activity";  // update in package.json
import {battery} from "power";
import {HeartRateSensor} from "heart-rate";  // update in package.json

//Update every sec
clock.granularity = "seconds";

// date
const dayname = document.getElementById("dayname");
const date = document.getElementById("date");

function setDay(val){
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  dayname.text = ""+days[val];
}


//stats
const stpValue = document.getElementById("stpValue");
const flValue = document.getElementById("flValue");
const calValue = document.getElementById("calValue");
const btValue = document.getElementById("btValue");

function updateStats(){
  // get today's stats or 0
  stpValue.text = today.adjusted.steps || 0;
  flValue.text = today.adjusted.elevationGain || 0;
  calValue.text = today.adjusted.calories || 0;
  btValue.text = Math.floor(battery.chargeLevel) + "%";
}

// heart rate
let lastValueTimestamp = Date.now();
const bpmValue = document.getElementById("bpmValue");
bpmValue.text = "---";
let hrm = new HeartRateSensor();
hrm.onreading = function(){
  // get current sensor val
  bpmValue.text = hrm.heartRate;
  lastValueTimestamp = Date.now();  // update stamp for next read
}

hrm.start();


//analog vars
const secHand = document.getElementById("secs");
const minHand = document.getElementById("mins");
const hourHand = document.getElementById("hours");

//digital vars
const hours1 = document.getElementById("hours1");
const hours2 = document.getElementById("hours2");
const separator = document.getElementById("separator");
const mins1 = document.getElementById("mins1");
const mins2 = document.getElementById("mins2");

//stats screen
const btn = document.getElementById("btn");
const screen2 = document.getElementById("screen2");

btn.onclick = function(){
  toggle(screen2);
}

//toggle element passed in via "enable" id
function toggle(element){
  element.animate("enable");
}


// separator blink. take val, mod2, if 0 display, if not, don't. val is sec
function separatorBlink(val){
  separator.style.display = (val % 2 === 0 ? "inline": "none");
}

function drawDigit(val, place){
  // update img with dynamic href
  place.image = `Font/${val}.png`;
}

function setHours(val){
  //digit 1
  if(val > 9){
    drawDigit(Math.floor(val / 10), hours1);
  } else {
    drawDigit("", hours1);
  }
  // digit2
  drawDigit(Math.floor(val % 10), hours2);
}

function setMins(val){
  drawDigit(Math.floor(val / 10), mins1);
  drawDigit(Math.floor(val % 10), mins2);
}


// ToAngle funcs
function timeToAngle(time){
  //the bot and top are 120 degrees each
  const angle = 120;
  const fraction = 120/60;

  //if else: passing sec (if 0, 239. The angle is 239. This is for returning from 60 to 0)
  return time === 0 ? 239 : 239 - (fraction*time);
}
  
function hoursToAngle(hours){
    switch(hours){
        case 1:
          return 308;
          break;
        case 2:
          return 318;
          break;
        case 3:
          return 329;
          break;
        case 4:
          return 340;
          break;
        case 5:
          return 350;
          break;
        case 6:
          return 360;
          break;
        case 7:
          return 10;
          break;
        case 8:
          return 20;
          break;
        case 9:
          return 30;
          break;
        case 10:
          return 40;
          break;
        case 11:
          return 50;
          break;
        case 12:
          return 60;
          break;
        default:
          return
    }
}

 function updateClock(){
  const today = new Date();
  const sec = today.getSeconds();
  const min = today.getMinutes();
  const hour = today.getHours() % 12;
  
  //perform rotations
  secHand.groupTransform.rotate.angle = timeToAngle(sec);
  minHand.groupTransform.rotate.angle = timeToAngle(min);
  hourHand.groupTransform.rotate.angle = hoursToAngle(hour);
}


// ANIMATIONS -> can be combined into one giant function
// bigger number for speed = slower

// steps
const stepsIcon = document.getElementById("stepsIcon");
animateSteps(500);
function animateSteps(speed){
  let frame = 1;
  let frameCount = 2;
  
  setInterval(function(){
    //load cur frame
    stepsIcon.href = `Animations/Steps/step${frame}.png`;
    
    // increment
    frame++;
    // if frame exceeds count, repeat
    if(frame > frameCount){
      frame = 1;
    }
  }, speed)
}

// heart rate
const bpmIcon = document.getElementById("bpmIcon");
animateBPM(150);
function animateBPM(speed){
  let frame = 1;
  let frameCount = 9;
  
  setInterval(function(){
    //load cur frame
    bpmIcon.href = `Animations/BPM/bpm${frame}.png`;
    
    // increment
    frame++;
    // if frame exceeds count, repeat
    if(frame > frameCount){
      frame = 1;
    }
  }, speed)
}

// calories
const burnIcon = document.getElementById("burnIcon");
animateCal(800);
function animateCal(speed){
  let frame = 1;
  let frameCount = 2;
  
  setInterval(function(){
    //load cur frame
   burnIcon.href = `Animations/Calories/burn${frame}.png`;
    
    // increment
    frame++;
    // if frame exceeds count, repeat
    if(frame > frameCount){
      frame = 1;
    }
  }, speed)
}

// floors
const floorsIcon = document.getElementById("floorsIcon");
animateFloors(400);
function animateFloors(speed){
  let frame = 1;
  let frameCount = 6;
  
  setInterval(function(){
    //load cur frame
    floorsIcon.href = `Animations/Floors/floors${frame}.png`;
    
    // increment
    frame++;
    // if frame exceeds count, repeat
    if(frame > frameCount){
      frame = 1;
    }
  }, speed)
}

// battery
const batteryIcon = document.getElementById("batteryIcon");
animateBattery(600);
function animateBattery(speed){
  let frame = 1;
  let frameCount = 6;
  
  setInterval(function(){
    //load cur frame
    batteryIcon.href = `Animations/Battery/bt${frame}.png`;
    
    // increment
    frame++;
    // if frame exceeds count, repeat
    if(frame > frameCount){
      frame = 1;
    }
  }, speed)
}


//update
clock.ontick = evt =>{
  
  const d = evt.date;
  
  const hours = d.getHours();
  
  const minutes = ("0" + d.getMinutes()).slice(-2); // append 0 so we can have 01 02 03 etc
  
  setDay(d.getDay());
  date.text = d.getDate();
  
  // 24hr - 12hr toggle
  if(preferences.clockDisplay === "12h") {
    hours = hours % 12 || 12; // mod 12 else 12
  } else {
    hours = util.zeroPad(hours);
  }
  
  // sep blink - remove if don't want blink
  separatorBlink(d.getSeconds());
  
  // set digital time
  setHours(hours);
  
  setMins(minutes);
  
  // set analog time
  updateClock();
  //update steps & Floors
  updateStats();
}