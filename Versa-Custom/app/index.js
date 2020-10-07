/*
KSEGO2020
*/

import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import {today} from "user-activity";
import {battery} from "power";
import {HeartRateSensor} from "heart-rate";

// Update the clock every second
clock.granularity = "seconds";

// time
const time = document.getElementById("time");

// date
const dateDay = document.getElementById("dateDay");
const dateDigit = document.getElementById("dateDigit");
const dateMon = document.getElementById("dateMon");

function setDay(val){
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  dateDay.text = ""+days[val];
}

function setMon(val){
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  dateMon.text = ""+months[val];
}

// timeIcon
const timeIcon = document.getElementById("timeIcon")

// handle stats screen
const btn = document.getElementById("btn");
const screen2 = document.getElementById("screen2");

btn.onclick = function(){
  toggle(screen2);
}

// toggle
function toggle(element){
  element.animate("enable");
}

// stats
const stepValue = document.getElementById("stepValue");
const batValue = document.getElementById("batValue");
const calValue = document.getElementById("calValue");
const batIcon = document.getElementById("batIcon");

function updateStats(){
  // get stats or 0
  stepValue.text = today.adjusted.steps || 0;
  batValue.text = Math.floor(battery.chargeLevel) + "%";
  calValue.text = today.adjusted.calories || 0;
  
  // change batIcon based on chargeLevel
  if (battery.chargeLevel >= 90) {
    batIcon.href = "StatsImgs/battery/btFull.png";
  } else if (battery.chargeLevel >= 60 && battery.chargeLevel <= 89){
    batIcon.href = "StatsImgs/battery/btMed1.png";
  } else if (battery.chargeLevel >= 30 && battery.chargeLevel <= 59){
    batIcon.href = "StatsImgs/battery/btMed2.png";
  } else if (battery.chargeLevel >= 10 && battery.chargeLevel <= 29){
    batIcon.href = "StatsImgs/battery/btLow.png";
  } else {
    batIcon.href = "StatsImgs/battery/btCrit.png";
  }
}

// hr
let lastValueTimestamp = Date.now();
const bpmValue = document.getElementById("bpmValue");
bpmValue.text = "---";
let hrm = new HeartRateSensor();
hrm.onreading = function(){
  // get cur sensor val
  bpmValue.text = hrm.heartRate;
  lastValueTimestamp = Date.now(); // update for next read
}

hrm.start();


// Update the every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  time.text = `${hours}:${mins}`;
  
  setDay(today.getDay());
  // pad 0 in front of day
  dateDigit.text = "0" + today.getDate();
  setMon(today.getMonth());
  
  // change icon by time
  if (today.getHours() > 7 && today.getHours() < 19){
   timeIcon.href = "TimeImgs/sunIcon.png";
  } else {
    timeIcon.href = "TimeImgs/moonIcon.png";
  }
  
  // update stats
  updateStats();
  
}
