import document from "document";
import * as messaging from "messaging";
import clock from "clock";
import {today} from "user-activity";
import {battery} from "power";
import {HeartRateSensor} from "heart-rate";
import {preferences} from "user-settings";
import * as util from "../common/utils";

// Constants
const time = document.getElementById("time");
const dateDay = document.getElementById("dateDay");
const dateDigit = document.getElementById("dateDigit");
const dateMon = document.getElementById("dateMon");
const clockLabel = document.getElementById("clock-label");
const stepValue = document.getElementById("stpValue");
const batValue = document.getElementById("batValue");
const batIcon = document.getElementById("batIcon");
const bpmValue = document.getElementById("bpmValue");

clock.granularity = "seconds"; // seconds, minutes, hours

// handle date
function setDay(val){
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  dateDay.text = ""+days[val];
}

function setMon(val){
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  dateMon.text = ""+months[val];
}

// stats
function updateStats(){
  // get stats or 0
  stepValue.text = today.adjusted.steps || 0;
  batValue.text = Math.floor(battery.chargeLevel) + "%";
  
  // change batIcon based on chargeLevel
  if (battery.chargeLevel >= 90){
    batIcon.href = "Imgs/bat/btFull.png";
  } else if (battery.chargeLevel >= 60 && battery.chargeLevel <= 89){
    batIcon.href = "Imgs/bat/btMed1.png";
  } else if (battery.chargeLevel >= 30 && battery.chargeLevel <= 59){
    batIcon.href = "Imgs/bat/btMed2.png";
  } else if (battery.chargeLevel >= 10 && battery.chargeLevel <= 29){
    batIcon.href = "Imgs/bat/btLow.png";
  } else {
    batIcon.href = "Imgs/bat/btCrit.png";
  }
}

// Heart Rate
let lastValueTimestamp = Date.now();

bpmValue.text = "---";
let hrm = new HeartRateSensor();
hrm.onreading = function(){
  // get cur val
  bpmValue.text = hrm.heartRate;
  lastValueTimestamp = Date.now(); // update for next reading
}

hrm.start();

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
  
  dateDigit.text = today.getDate();

  setMon(today.getMonth());
  
  // Update stats
  updateStats();
}