let timeEl = document.getElementById('timer');
let selectHoursEl = document.getElementById('hours');
let selectMinsEl = document.getElementById('mins');
let selectSecsEl = document.getElementById('secs');
let amPmEl = document.getElementById('ampm');
let addBtn = document.getElementById('add-btn');
let alarmsEl = document.getElementById('alarms');
let errorBox = document.getElementById('error-box');
let upcomingAlarms = document.getElementById('upcoming-alarms');
let timerInterval;
let alarms = [];
let alarmRunning = false;
let currentAlarmTime;
let alarmTone = new Audio('./assets/alarmTone.mp3');

addBtn.addEventListener('click', addOrStopAlarm);

showClockTime();
addTimeOptions();
function showClockTime(){
    // displays current time as callback runs every second
    setInterval(()=>{
        let currentTime = getTimeString();
        // check if the current time exists in alarms or not
        if(alarms.includes(currentTime)){
            startAlarm(currentTime);
            currentAlarmTime = currentTime;
        }
        timeEl.textContent = currentTime;
    }, 1000);
}

function addTimeOptions(){
    for(let i = 1; i<= 12; i++ ){
        // add hours select options
        let option = document.createElement('option');
        option.textContent = String(i).padStart(2, '0');
        selectHoursEl.appendChild(option);
    }

    for(let i = 0; i< 60; i++){

        // add minute select options
        let option = document.createElement('option');
        option.textContent = String(i).padStart(2, '0');
        selectMinsEl.appendChild(option);

        // add seconds select options
        let option2 = document.createElement('option');
        option2.textContent = String(i).padStart(2, '0');
        selectSecsEl.appendChild(option2);
    }
}    

function addOrStopAlarm(e){
    // same button is used to stop alarm so this event listener will be called 
    // again to stop alarm and remove it from upcoming alarms
    if (alarmRunning){
        alarmRunning = false;
        addBtn.classList.replace('btn-danger', 'btn-primary');
        addBtn.innerText = 'Add Alarm';
        alarmTone.pause();
        alarms = alarms.filter((time)=> time !== currentAlarmTime);
        reRenderAlarms();
        currentAlarmTime = null;
    } else {
        // fetch the selected option index value for hours, minutes and seconds.
        let hoursSelected = selectHoursEl.options[selectHoursEl.selectedIndex].textContent;
        let minsSelected = selectMinsEl.options[selectMinsEl.selectedIndex].textContent;
        let secsSelected = selectSecsEl.options[selectSecsEl.selectedIndex].textContent;
        let amPmSelected = amPmEl.options[amPmEl.selectedIndex].textContent;
        let timeString =hoursSelected+':'+minsSelected+ ':' + secsSelected + ' ' + amPmSelected;

        // if check if alarm is already set for selected time
        if (!alarms.includes(timeString)){
            // if not add time to alarms array and display updated alarms list
            alarms.push(timeString);
            reRenderAlarms();
        } else {
            // alarms exist already show error
            showError('Alarms Already Exists');
        }
    }
}

function showError(msg){
    errorBox.innerText = msg;
}

function deleteAlarm(i){
    alarms.splice(i, 1);
    reRenderAlarms();
}

function reRenderAlarms(){
    // clears alarm list
    showError('');
    if (alarms.length){
        // show heading upcoming alarms only if alarm exists
        upcomingAlarms.innerHTML = 'Upcoming Alarms';
    } else {
        upcomingAlarms.innerHTML = '';
    }
    alarmsEl.innerHTML = '';
    for (let i= 0; i< alarms.length; i++){
        let liEl = document.createElement('li');
        liEl.innerHTML = `${alarms[i]} <button style="margin-left:15px; padding:0px; border:none; color: red" onclick="deleteAlarm(${i})"><i class="fas fa-trash" /></button>`;
        alarmsEl.appendChild(liEl);
    }
}





function getTimeString() {
    // returns current time in selected format
    let currentTimestamp = Date.now(); // Current timestamp in milliseconds since the Unix epoch
    let currentDate = new Date(currentTimestamp); // Create a Date object from the timestamp

    // Extract current hour, minute, and second from the Date object
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();

    // Determine if it's AM or PM
    let period = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    hours = hours % 12 || 12; // If hours is 0, convert it to 12
    
    // Formatting
    let hourString = hours.toString().padStart(2, '0');
    let minuteString = minutes.toString().padStart(2, '0');
    let secondString = seconds.toString().padStart(2, '0');
    
    return hourString + ':' + minuteString + ':' + secondString + ' ' + period;
}

function startAlarm(){
    alarmRunning = true;
    addBtn.classList.replace('btn-primary', 'btn-danger');
    addBtn.innerText = 'Stop Alarm';
    alarmTone.play();
    alarmTone.loop = true;
}