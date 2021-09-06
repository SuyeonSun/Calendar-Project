let nav = 0; // way to keep track the month
let clicked = null; 
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
var savedDates= []; // save 버튼 클릭 시 저장되는 날짜

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// date를 인자로 받는데, 어떤 date를 클릭했는지 알아야 하기 때문
function openModal(date){
  clicked = date;
  // events는 array이기 때문에 find function 사용 가능
  const eventForDay = events.find(e => e.date === clicked); // e는 for every event

  if (eventForDay) {
    document.getElementById('eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    // css에서 hidden
    newEventModal.style.display='block';
  }

  backDrop.style.display = 'block';
}

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav); // nav가 --가 되면 prev month, +가 되면 next month
  }

  const day = dt.getDate();
  const month = dt.getMonth(); // 0부터 시작
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1); // first day of the month
  const daysInMonth = new Date(year, month+1, 0).getDate(); // 0는 last day month

  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday : 'long',
    year : 'numeric',
    month : 'numeric',
    day : 'numeric',
  });
  // console.log(dateString); // 현재 달의 첫번째 날짜 출력
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
  // console.log(paddingDays); // 첫 번째 날짜 출력 전 비워져있는 날짜

  // ----------- KEY POINT ----------- 활용!!!
  document.getElementById('monthDisplay').innerText = `${month+1}月 ${year}`; // 해당 month, year 표시

  calendar.innerHTML = ''; // when rendering new ones, need to wipe out the existing div tags

  for(let i = 1; i<= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div'); // ----------- KEY POINT -----------=> .createElement('Tag Name');
    daySquare.classList.add('day'); // daySquare에 'day'라는 class 부여 ----------- KEY POINT -----------=> .classList.add('Class Name');
    
    const dayString = `${month+1}/${i-paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays; // 날짜 기록 ----------- KEY POINT -----------=> .innerText = 
      const eventForDay = events.find(e => e.date === dayString); // e는 for every event

      // if nav ===0는 only highlighting the current month (if I'm ont 2월, then not 1월 or 3월)
      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      // add event button
      const daySquare2 = document.createElement('button');
      daySquare2.classList.add('day2');
      daySquare2.innerHTML = 'add event';
      daySquare.appendChild(daySquare2);

      // daySquare.addEventListener('click',
      daySquare2.addEventListener('click', 
      // () => console.log(`${month+1}/${i-paddingDays}/${year}`)); // ----------- KEY POINT -----------=> .addEventListener('click', ()=>{});
      () => openModal(dayString)); 

      // ####################################################################################################
      var saveSquare = document.createElement('button'); // 
      saveSquare.innerHTML = 'select';
      saveSquare.classList.add('select'); // 
      
      saveSquare.addEventListener('click', () => {
        var saved_date = `${month+1}/${i-paddingDays}/${year}`
        if (savedDates.includes(saved_date, 0)){
          // console.log('already saved dates');
          const idx = savedDates.indexOf(saved_date);
          alert('remove');
          savedDates.splice(idx, 1);
          document.getElementById('savedDates').innerHTML = savedDates;
        }
        else{
          savedDates.push(saved_date); // ----------- KEY POINT -----------=> push
          document.getElementById('savedDates').innerHTML = savedDates;
        }
        // savedDates.push(saved_date);
        // document.getElementById('savedDates').innerHTML = savedDates;
        // console.log(savedDates);
      });
      daySquare.appendChild(saveSquare);
      // ####################################################################################################

    } else {
      daySquare.classList.add('padding');
    }
    calendar.appendChild(daySquare);
  }
  
}

function closeModal() {
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = ''; // clearing out the input when clicked again
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error'); // ----------- KEY POINT -----------=> .remove
    events.push({
      date : clicked,
      title: eventTitleInput.value,
    });

    // object를 localstorage에 save 못해서, JSON.stringfy 이용!
    localStorage.setItem('events', JSON.stringify(events));
    closeModal(); // input에 event 입력하고 save 누르면 modal이 closed
  } else {
    eventTitleInput.classList.add('error'); // ----------- KEY POINT -----------=> .add
  }
}

function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

// ----------- KEY POINT -----------
function initButtons() { 
  document.getElementById('nextButton').addEventListener('click', () => {
    nav ++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav --;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener ('click', closeModal); // ----------- KEY POINT -----------

  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener ('click', closeModal);
}


initButtons();
load();