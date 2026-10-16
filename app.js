// Study Tracker: sessions are saved in the browser's localStorage,
// so they stay put when you refresh the page.
const STORAGE_KEY = "study-sessions";

const form = document.getElementById("session-form");
const subjectInput = document.getElementById("subject");
const minutesInput = document.getElementById("minutes");
const notesInput = document.getElementById("notes");
const errorEl = document.getElementById("error");
const list = document.getElementById("session-list");
const totalEl = document.getElementById("total-minutes");
const streakEl = document.getElementById("streak");
const chart = document.getElementById("week-chart");

let sessions = loadSessions();

// --- Storage ---------------------------------------------------------

function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    // Corrupted data shouldn't crash the app
    return [];
  }
}

function saveSessions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

// --- Dates -----------------------------------------------------------

// Returns "YYYY-MM-DD" in the user's local time zone
function dateKey(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// --- Calculations ----------------------------------------------------

// Total minutes per day, e.g. { "2025-03-01": 45, "2025-03-02": 60 }
function minutesByDay() {
  const totals = {};
  for (const s of sessions) {
    totals[s.date] = (totals[s.date] || 0) + s.minutes;
  }
  return totals;
}

// Counts consecutive days with study, ending today
function currentStreak() {
  const totals = minutesByDay();
  let streak = 0;
  let day = new Date();

  while (totals[dateKey(day)]) {
    streak++;
    day = daysAgo(streak);
  }
  return streak;
}

// --- Rendering -------------------------------------------------------

function render() {
  renderStats();
  renderChart();
  renderList();
}

function renderStats() {
  const totals = minutesByDay();
  let weekMinutes = 0;
  for (let i = 0; i < 7; i++) {
    weekMinutes += totals[dateKey(daysAgo(i))] || 0;
  }
  totalEl.textContent = weekMinutes;
  streakEl.textContent = currentStreak();
}

function renderChart() {
  const totals = minutesByDay();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    days.push(daysAgo(i));
  }

  // Scale bars against the busiest day (at least 1 to avoid dividing by zero)
  const max = Math.max(1, ...days.map((d) => totals[dateKey(d)] || 0));

  chart.innerHTML = "";
  for (const day of days) {
    const minutes = totals[dateKey(day)] || 0;

    const wrap = document.createElement("div");
    wrap.className = "bar-wrap";

    const value = document.createElement("span");
    value.className = "bar-value";
    value.textContent = minutes || "";

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${(minutes / max) * 100}%`;

    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = day.toLocaleDateString(undefined, { weekday: "short" });

    wrap.append(value, bar, label);
    chart.append(wrap);
  }
}

function renderList() {
  // Newest first
  const sorted = [...sessions].sort(
    (a, b) => b.date.localeCompare(a.date) || b.id - a.id
  );

  list.innerHTML = "";

  if (sorted.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No sessions yet. Log your first one above!";
    list.append(empty);
    return;
  }

  for (const s of sorted) {
    const li = document.createElement("li");

    const info = document.createElement("div");

    const title = document.createElement("strong");
    title.textContent = s.subject;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${s.date} · ${s.minutes} min`;

    info.append(title, meta);

    if (s.notes) {
      const notes = document.createElement("p");
      notes.className = "notes";
      notes.textContent = s.notes;
      info.append(notes);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.textContent = "×";
    deleteBtn.setAttribute("aria-label", `Delete ${s.subject} session`);
    deleteBtn.addEventListener("click", () => deleteSession(s.id));

    li.append(info, deleteBtn);
    list.append(li);
  }
}

// --- Actions ---------------------------------------------------------

function addSession(event) {
  event.preventDefault();

  const subject = subjectInput.value.trim();
  const minutes = Number(minutesInput.value);

  if (!subject) {
    errorEl.textContent = "Please enter a subject.";
    return;
  }
  if (!Number.isInteger(minutes) || minutes < 1) {
    errorEl.textContent = "Minutes must be a whole number greater than 0.";
    return;
  }

  errorEl.textContent = "";
  sessions.push({
    id: Date.now(),
    subject,
    minutes,
    notes: notesInput.value.trim(),
    date: dateKey(),
  });

  saveSessions();
  form.reset();
  subjectInput.focus();
  render();
}

function deleteSession(id) {
  sessions = sessions.filter((s) => s.id !== id);
  saveSessions();
  render();
}

form.addEventListener("submit", addSession);
render();
