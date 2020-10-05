import document from "document";
import clock from "clock";
import {preferences} from "user-settings";
import * as util from "../common/utils"

//Update every sec
clock.granularity = "seconds";

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

//update
clock.ontick = evt =>{
  
  const d = evt.date;
  
  const hours = d.getHours();
  
  const minutes = ("0" + d.getMinutes()).slice(-2); // append 0 so we can have 01 02 03 etc
  
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
}