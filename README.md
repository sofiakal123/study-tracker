# Study Tracker

A lightweight web app to log study sessions and see your progress over a week. Track minutes per subject, build a day streak, and get instant insight into your study habits.

## How to use

1. Open `index.html` in your browser, or run `npx serve` in this folder and visit `http://localhost:3000`.
2. Log a subject, number of minutes, and optionally what you learned.
3. See your weekly bar chart update, streak count, and session history.
4. Data is saved in your browser's `localStorage`, so it persists when you refresh.

## Features

- **Quick logging** — add a session with subject, time, and optional notes
- **Weekly chart** — see your busiest days and total minutes at a glance
- **Day streak** — how many consecutive days you've studied
- **Session history** — all your past sessions, newest first, with delete buttons
- **Persistent storage** — data lives in the browser, no login needed
- **Mobile friendly** — works on phone and desktop

## What you can learn from this

- **localStorage API** — how browser storage works and why dates matter (local time vs. UTC)
- **Form validation** — handling user input safely and showing error messages
- **DOM manipulation** — building UI with vanilla JavaScript, no framework
- **Responsive CSS** — a grid layout that adapts to screen size
- **Data visualization** — CSS bar chart with dynamic heights based on data

## File structure

```
study-tracker/
├── index.html    — layout and form
├── style.css     — responsive styling and bar chart
└── app.js        — all the logic: adding, storing, filtering, and rendering
```

## Ideas for extending it

- Export sessions to CSV
- Study goals (target minutes per week)
- Streak notifications
- Category breakdown (pie chart of time by subject)
