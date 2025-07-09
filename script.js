const today = new Date();
const todayStr = today.toISOString().split('T')[0];
document.getElementById('today-date').innerText = todayStr;

function getColorClass(rating) {
  if (rating <= 3) return 'color-0-3';
  if (rating == 4) return 'color-4';
  if (rating == 5) return 'color-5';
  if (rating <= 7) return 'color-6-7';
  if (rating <= 9) return 'color-8-9';
  return 'color-10';
}

function saveEntry() {
  const text = document.getElementById('journal-text').value;
  const rating = parseInt(document.getElementById('rating').value);
  const emoji = document.getElementById('emoji').value;

  if (isNaN(rating) || rating < 0 || rating > 10) {
    alert('Please enter a valid rating between 0 and 10.');
    return;
  }

  const entry = { text, rating, emoji };
  localStorage.setItem('entry-' + todayStr, JSON.stringify(entry));
  generateCalendar();
  alert('Saved!');
}

function generateCalendar() {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';

  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay.getDay(); i++) {
    const blank = document.createElement('div');
    calendar.appendChild(blank);
  }

  for (let d = 1; d <= lastDate; d++) {
    const dateObj = new Date(year, month, d);
    const dateStr = dateObj.toISOString().split('T')[0];
    const entry = localStorage.getItem('entry-' + dateStr);
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';
    dayDiv.innerText = d;

    if (entry) {
      const parsed = JSON.parse(entry);
      dayDiv.classList.add(getColorClass(parsed.rating));
    }

    dayDiv.onclick = () => showDayLog(dateStr);
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
  document.getElementById('entry-date').innerText = dateStr;
  document.getElementById('entry-rating').innerText = parsed.rating;
  document.getElementById('entry-emoji').innerText = parsed.emoji || '(none)';
  document.getElementById('entry-text').innerText = parsed.text;
  document.getElementById('entry-view').classList.remove('hidden');
}

generateCalendar();
