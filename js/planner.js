/* ============================================================
   ACADEMIC PLANNER – planner.js
   Features: add / complete / delete / filter / localStorage
   ============================================================ */

// ── State ────────────────────────────────────────────────────
let tasks = [];
let currentFilter = 'all';

// ── Initialise ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  renderTasks();

  // Allow Enter key to add task
  const input = document.getElementById('taskInput');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addTask();
    });
  }
});

// ── Add Task ─────────────────────────────────────────────────
function addTask() {
  const input    = document.getElementById('taskInput');
  const priority = document.getElementById('prioritySelect').value;
  const category = document.getElementById('categorySelect').value;
  const text     = input.value.trim();

  if (!text) {
    input.style.borderColor = '#EF4444';
    input.focus();
    setTimeout(() => { input.style.borderColor = ''; }, 1500);
    return;
  }

  const task = {
    id:       Date.now(),
    text:     text,
    priority: priority,
    category: category,
    done:     false,
    created:  new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  };

  tasks.unshift(task);           // newest first
  saveToStorage();
  renderTasks();
  input.value = '';
  input.focus();
}

// ── Toggle Done ──────────────────────────────────────────────
function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  saveToStorage();
  renderTasks();
}

// ── Delete Task ──────────────────────────────────────────────
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveToStorage();
  renderTasks();
}

// ── Clear Completed ──────────────────────────────────────────
function clearCompleted() {
  tasks = tasks.filter(t => !t.done);
  saveToStorage();
  renderTasks();
}

// ── Filter ───────────────────────────────────────────────────
function filterTasks(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderTasks();
}

// ── Render ───────────────────────────────────────────────────
function renderTasks() {
  const list  = document.getElementById('taskList');
  const empty = document.getElementById('emptyState');
  if (!list) return;

  // Apply filter
  let visible = tasks;
  if (currentFilter === 'pending')  visible = tasks.filter(t => !t.done);
  if (currentFilter === 'done')     visible = tasks.filter(t => t.done);
  if (currentFilter === 'high')     visible = tasks.filter(t => t.priority === 'high');

  updateSummary();

  if (visible.length === 0) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  list.innerHTML = visible.map(task => `
    <div class="task-item ${task.done ? 'done' : ''}" id="task-${task.id}">
      <button
        class="task-check ${task.done ? 'checked' : ''}"
        onclick="toggleTask(${task.id})"
        aria-label="${task.done ? 'Mark incomplete' : 'Mark complete'}"
        title="${task.done ? 'Mark incomplete' : 'Mark complete'}"
      ></button>
      <span class="task-text">${escapeHtml(task.text)}</span>
      <span class="task-category" style="font-size:0.75rem; color: var(--clr-muted);">${task.category}</span>
      <span class="task-priority ${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
      <span style="font-size:0.72rem; color: var(--clr-muted);">${task.created}</span>
      <button class="task-delete" onclick="deleteTask(${task.id})" aria-label="Delete task" title="Delete">✕</button>
    </div>
  `).join('');
}

// ── Summary ──────────────────────────────────────────────────
function updateSummary() {
  const total   = tasks.length;
  const done    = tasks.filter(t => t.done).length;
  const pending = total - done;
  const high    = tasks.filter(t => t.priority === 'high' && !t.done).length;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('totalCount',   total);
  set('pendingCount', pending);
  set('doneCount',    done);
  set('highCount',    high);
}

// ── Storage ──────────────────────────────────────────────────
function saveToStorage() {
  try { localStorage.setItem('je_tasks', JSON.stringify(tasks)); } catch(e) {}
}
function loadFromStorage() {
  try {
    const saved = localStorage.getItem('je_tasks');
    if (saved) tasks = JSON.parse(saved);
  } catch(e) { tasks = []; }

  // Seed with sample tasks if empty
  if (tasks.length === 0) {
    tasks = [
      { id: 1, text: 'Submit COS 106 Portfolio Project', priority: 'high',   category: 'Assignment', done: false, created: '2 Jul' },
      { id: 2, text: 'Study for SC-300 practice test',   priority: 'high',   category: 'Study',      done: false, created: '2 Jul' },
      { id: 3, text: 'Review MIVA week 5 lecture notes', priority: 'medium', category: 'Study',      done: false, created: '1 Jul' },
      { id: 4, text: 'Update GitHub portfolio README',   priority: 'medium', category: 'Project',    done: true,  created: '30 Jun' },
      { id: 5, text: 'Complete TryHackMe Advent of Cyber room', priority: 'low', category: 'Other', done: false, created: '29 Jun' },
    ];
    saveToStorage();
  }
}

// ── Helpers ──────────────────────────────────────────────────
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
