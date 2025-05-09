// Constants
const AIRTABLE_TOKEN = "patuKKtlyfqvVNCpc.25468d0bda6badcfd90c84a03a681fc462c0b66b57b964eddb0449b24134a45e"
const BASE_ID = "appPGVN4sDJ0aTrSb"
const TABLE_NAME = "calendario"

// DOM Elements
const calendarGrid = document.getElementById("calendar-grid")
const currentMonthDisplay = document.getElementById("current-month-display")
const prevMonthBtn = document.getElementById("prev-month")
const nextMonthBtn = document.getElementById("next-month")
const loadingIndicator = document.getElementById("loading-indicator")

// State
let currentMonth = new Date().getMonth()
let currentYear = new Date().getFullYear()
let events = []

// Month and day names
const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

const weekDaysShort = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  updateMonthDisplay()
  loadEvents()

  // Event listeners
  prevMonthBtn.addEventListener("click", () => changeMonth(-1))
  nextMonthBtn.addEventListener("click", () => changeMonth(1))
})

// Functions
function updateMonthDisplay() {
  currentMonthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`
}

function changeMonth(offset) {
  currentMonth += offset

  if (currentMonth > 11) {
    currentMonth = 0
    currentYear++
  } else if (currentMonth < 0) {
    currentMonth = 11
    currentYear--
  }

  updateMonthDisplay()
  loadEvents()
}

async function loadEvents() {
  showLoading(true);

  try {
    let allRecords = [];
    let offset = null;

    do {
      const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?sort%5B0%5D%5Bfield%5D=fecha&sort%5B1%5D%5Bfield%5D=hora${
        offset ? "&offset=" + offset : ""
      }`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      allRecords = [...allRecords, ...data.records];
      offset = data.offset;
    } while (offset);

    const monthStr = String(currentMonth + 1).padStart(2, "0");
    const monthPattern = `${currentYear}-${monthStr}`;
    const excludedWords = ["ensayo", "reunión ø central", "licencia"]; // Palabras a excluir

    events = allRecords
      .filter((record) => record.fields.fecha?.startsWith(monthPattern))
      .filter((record) => {
        const lugar = record.fields.lugar?.toLowerCase() || "";
        // Retorna true si NINGUNA de las palabras excluidas está presente en el lugar
        return !excludedWords.some(word => lugar.includes(word));
      })
      .map((record) => ({
        id: record.id,
        ...record.fields,
      }));

    renderCalendar();
  } catch (error) {
    console.error("Error loading events:", error);
    calendarGrid.innerHTML = `<div class="loading">Error al cargar eventos: ${error.message}</div>`;
  } finally {
    showLoading(false);
  }
}
function showLoading(isLoading) {
  if (isLoading) {
    loadingIndicator.style.display = "block"
    calendarGrid.innerHTML = ""
    calendarGrid.appendChild(loadingIndicator)
  } else {
    loadingIndicator.style.display = "none"
  }
}

function renderCalendar() {
  calendarGrid.innerHTML = ""

  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDay.getDate()

  let startingDay = firstDay.getDay() - 1 
  if (startingDay === -1) startingDay = 6 

  for (let i = 0; i < startingDay; i++) {
    const emptyDay = document.createElement("div")
    emptyDay.className = "day empty"
    calendarGrid.appendChild(emptyDay)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dayEvents = events.filter((event) => event.fecha === dateStr)

    const dayElement = document.createElement("div")
    dayElement.className = `day ${dayEvents.length > 0 ? "has-events" : ""}`

    const dayOfWeek = new Date(currentYear, currentMonth, day).getDay()
    const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1 

    const dayWeekLabel = document.createElement("div")
    dayWeekLabel.className = "day-week-label"
    dayWeekLabel.textContent = weekDaysShort[adjustedDayOfWeek]
    dayElement.appendChild(dayWeekLabel)

    const dayNumber = document.createElement("div")
    dayNumber.className = "day-number"
    dayNumber.textContent = day
    dayElement.appendChild(dayNumber)

    dayEvents.forEach((event) => {
      const eventElement = document.createElement("div")
      eventElement.className = "event"

      const style = getLugarStyle(event.lugar)
      Object.assign(eventElement.style, style)

      // Event time
      const eventTime = document.createElement("div")
      eventTime.className = "event-time"
      eventTime.innerHTML = `<i class="fas fa-clock icon"></i>${event.hora}`
      eventElement.appendChild(eventTime)

      // Event location
      const eventLocation = document.createElement("div")
      eventLocation.className = "event-location"
      eventLocation.innerHTML = `<i class="fas fa-map-marker-alt icon"></i>${event.lugar}`
      eventElement.appendChild(eventLocation)

      dayElement.appendChild(eventElement)
    })

    calendarGrid.appendChild(dayElement)
  }
}

function getLugarStyle(lugar) {
  const lugarLower = lugar?.toLowerCase() || ""

  if (lugarLower.includes("cruceros nocturno")) {
    return { backgroundColor: "#3949ab", borderLeftColor: "#303f9f" }
  } else if (lugarLower.includes("cruceros")) {
    return { backgroundColor: "#1976d2", borderLeftColor: "#1565c0" }
  } else if (lugarLower.includes("casa malbec")) {
    return { backgroundColor: "#7b1fa2", borderLeftColor: "#6a1b9a" }
  } else if (lugarLower.includes("meliá") || lugarLower.includes("melia")) {
    return { backgroundColor: "#00897b", borderLeftColor: "#00796b" }
  } else if (lugarLower.includes("dam-cde")) {
    return { backgroundColor: "#546e7a", borderLeftColor: "#455a64" }
  } else if (lugarLower.includes("clases")) {
    return { backgroundColor: "#43a047", borderLeftColor: "#388e3c" }
  } else {
    return { backgroundColor: "#5c6bc0", borderLeftColor: "#3949ab" }
  }
}
