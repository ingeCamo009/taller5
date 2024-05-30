const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  deleteEventBtn = document.querySelector(".delete-event-btn"),
  modal = document.querySelector(".modal"),
  modalOverlay = document.querySelector(".modal-overlay"),
  closeModalBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventDescription = document.querySelector(".event-description"),
  addEventParticipants = document.querySelector(".event-participants"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  addEventSubmit = document.querySelector(".add-event-btn");

let today = new Date();
let activeDay = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

let eventsArr = JSON.parse(localStorage.getItem("events")) || [];

function renderCalendar() {
  date.innerHTML = `${months[month]} ${year}`;
  daysContainer.innerHTML = "";

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const totalDays = lastDay.getDate();
  const startWeekDay = firstDay.getDay();

  let days = "";

  for (let x = startWeekDay; x > 0; x--) {
    days += `<div class="prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= totalDays; i++) {
    let event = eventsArr.find(event => event.day === i && event.month === month + 1 && event.year === year);
    if (i === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
      days += event ? `<div class="today active event">${i}</div>` : `<div class="today active">${i}</div>`;
    } else {
      days += event ? `<div class="active event">${i}</div>` : `<div>${i}</div>`;
    }
  }

  const nextDays = 7 - ((startWeekDay + totalDays) % 7);
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  addDaysListener();
}

function addDaysListener() {
  const days = daysContainer.querySelectorAll("div:not(.prev-date):not(.next-date)");
  days.forEach(day => {
    day.addEventListener("click", () => {
      const dayNumber = Number(day.innerText);
      updateEvents(dayNumber);
      activeDay = dayNumber;
      days.forEach(d => d.classList.remove("selected"));
      day.classList.add("selected");
    });
  });
}

function updateEvents(day) {
  const eventsForDay = eventsArr.filter(event => event.day === day && event.month === month + 1 && event.year === year);
  eventsContainer.innerHTML = eventsForDay.length ? eventsForDay.map(event => `<div>${event.events.map(e => `<div><h3>${e.title}</h3><p>${e.time}</p></div>`).join('')}</div>`).join('') : "<div>No hay eventos</div>";
}

addEventBtn.addEventListener("click", () => {
  modal.classList.add("show");
  modalOverlay.classList.add("show");
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("show");
  modalOverlay.classList.remove("show");
});

addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventDescription = addEventDescription.value;
  const eventParticipants = addEventParticipants.value;
  const eventFrom = addEventFrom.value;
  const eventTo = addEventTo.value;

  if (!eventTitle || !eventFrom || !eventTo) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  const newEvent = {
    day: activeDay,
    month: month + 1,
    year: year,
    events: [
      {
        title: eventTitle,
        description: eventDescription,
        participants: eventParticipants,
        time: `${eventFrom} - ${eventTo}`
      }
    ]
  };

  eventsArr.push(newEvent);
  localStorage.setItem("events", JSON.stringify(eventsArr));
  renderCalendar();
  modal.classList.remove("show");
  modalOverlay.classList.remove("show");
  updateEvents(activeDay);
});

deleteEventBtn.addEventListener("click", () => {
  eventsArr = eventsArr.filter(
    (event) => !(event.day === activeDay && event.month === month + 1 && event.year === year)
  );
  localStorage.setItem("events", JSON.stringify(eventsArr));
  renderCalendar();
  updateEvents(activeDay);
});

prev.addEventListener("click", () => {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  renderCalendar();
});

next.addEventListener("click", () => {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  renderCalendar();
});

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  activeDay = today.getDate();
  renderCalendar();
});

gotoBtn.addEventListener("click", () => {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length < 2) return;
  month = dateArr[0] - 1;
  year = dateArr[1];
  renderCalendar();
});

renderCalendar();
updateEvents(activeDay);
