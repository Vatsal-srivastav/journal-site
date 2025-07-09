const today = new Date();
const todayStr = today.toISOString().split('T')[0];
document.getElementById('today-date').innerText = todayStr;

let viewedMonth = today.getMonth();
let viewedYear = today.getFullYear();

function getColorClass(rating) {
  if (rating <= 3) return 'color-0-3';
  if (rating === 4) return 'color-4';
  if (rating === 5) return 'color-5';
  if (rating <= 7) return 'color-6-7';
  if (rating <= 9) return 'color-8-9';
  return 'color-10';
}

function saveEntry() {
  const text = document.getElementById('journal-text').value;
  const rating = parseInt(document.getElementById('rating').value);
  const emoji = document.getElementById('emoji').value;

  const nowStr = new Date().toISOString().split('T')[0];
  if (todayStr !== nowStr) {
    alert('You can only journal for today!');
    return;
  }

  if (isNaN(rating) || rating < 0 || rating > 10) {
    alert('Please enter a valid rating between 0 and 10.');
    return;
  }

  const entry = { text, rating, emoji };
  localStorage.setItem('entry-' + todayStr, JSON.stringify(entry));
  generateCalendar();
  calculateStreak();
  alert('Saved!');
}

function generateCalendar() {
  const calendar = document.getElementById('calendar');
  const monthTitle = document.getElementById('month-year-title');
  calendar.innerHTML = '';

  const year = viewedYear;
  const month = viewedMonth;
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();

  const monthName = firstDay.toLocaleString('default', { month: 'long' });
  monthTitle.innerText = `${monthName} ${year}`;

  for (let i = 0; i < firstDay.getDay(); i++) {
    const blank = document.createElement('div');
    calendar.appendChild(blank);
  }

  for (let d = 1; d <= lastDate; d++) {
    const date = new Date(year, month, d);
    const dateStr = date.toISOString().split('T')[0];
    const entry = localStorage.getItem('entry-' + dateStr);
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';
    dayDiv.innerText = d;

    const isPastOrToday = date <= today;

    if (entry) {
      const parsed = JSON.parse(entry);
      dayDiv.classList.add(getColorClass(parsed.rating));
      if (isPastOrToday) {
        dayDiv.onclick = () => showDayLog(dateStr);
      }
    } else if (isPastOrToday) {
      // Clickable to check if no entry
      dayDiv.onclick = () => showDayLog(dateStr);
    }

    calendar.appendChild(dayDiv);
  }
}

function showDayLog(dateStr) {
  const entry = localStorage.getItem('entry-' + dateStr);
  if (!entry) {
    alert('No journal entry found for this day.');
    return;
  }

  const parsed = JSON.parse(entry);

  document.getElementById('main-form').classList.add('hidden');
  document.getElementById('calendar-section').classList.add('hidden');

  document.getElementById('entry-date').innerText = dateStr;
  document.getElementById('entry-rating').innerText = parsed.rating;
  document.getElementById('entry-emoji').innerText = parsed.emoji || '(none)';
  document.getElementById('entry-text').innerText = parsed.text;

  document.getElementById('entry-view').classList.remove('hidden');
}

function backToMain() {
  document.getElementById('main-form').classList.remove('hidden');
  document.getElementById('calendar-section').classList.remove('hidden');
  document.getElementById('entry-view').classList.add('hidden');
}

function changeMonth(delta) {
  viewedMonth += delta;
  if (viewedMonth < 0) {
    viewedMonth = 11;
    viewedYear--;
  } else if (viewedMonth > 11) {
    viewedMonth = 0;
    viewedYear++;
  }
  generateCalendar();
}

function calculateStreak() {
  const streakDisplay = document.getElementById('streak-count');
  let streak = 0;
  let date = new Date();

  while (true) {
    const dateStr = date.toISOString().split('T')[0];
    if (localStorage.getItem('entry-' + dateStr)) {
      streak++;
      date.setDate(date.getDate() - 1);
    } else {
      break;
    }
  }

  streakDisplay.innerText = streak;
}

generateCalendar();
calculateStreak();
