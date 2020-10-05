import document from "document";
import clock from "clock";

//Update every sec
clock.granularity = "seconds";

const secHand = document.getElementById("secs");
const minHand = document.getElementById("mins");
const hourHand = document.getElementById("hours");

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
  updateClock();
}