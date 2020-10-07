import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
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

// Update the <text> element every tick with the current time
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
  
}
