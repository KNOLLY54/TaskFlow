document.addEventListener('DOMContentLoaded', function() {
// Add character counter for description
const descriptionInput = document.getElementById('task-description');
const descriptionChars = document.getElementById('description-chars');
descriptionInput.addEventListener('input', function() {
const charCount = this.value.length;
descriptionChars.textContent = charCount;
if (charCount > 450) {
descriptionChars.classList.add('text-yellow-500');
} else if (charCount > 490) {
descriptionChars.classList.add('text-red-500');
} else {
descriptionChars.classList.remove('text-yellow-500', 'text-red-500');
}
});
// Add real-time validation for auth form
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
function validateInput(input, validationFn) {
input.addEventListener('input', function() {
if (validationFn(this.value)) {
this.classList.remove('border-red-500');
this.classList.add('border-green-500');
} else {
this.classList.remove('border-green-500');
this.classList.add('border-red-500');
}
});
}
validateInput(nameInput, (value) => {
return value.trim().length >= 2 && value.trim().length <= 50 && /^[A-Za-z0-9\s]+$/.test(value);
});
validateInput(emailInput, (value) => {
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
});
validateInput(passwordInput, (value) => {
return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value);
});
// DOM Elements
const taskContainer = document.getElementById('task-container');
const emptyState = document.getElementById('empty-state');
const addTaskBtn = document.getElementById('add-task-btn');
const emptyAddBtn = document.getElementById('empty-add-btn');
const taskModal = document.getElementById('task-modal');
const deleteModal = document.getElementById('delete-modal');
const closeModal = document.getElementById('close-modal');
const cancelTask = document.getElementById('cancel-task');
const taskForm = document.getElementById('task-form');
const taskCounter = document.getElementById('task-counter');
const modalTitle = document.getElementById('modal-title');
const taskIdInput = document.getElementById('task-id');
const taskTitleInput = document.getElementById('task-title');
const taskDescriptionInput = document.getElementById('task-description');
const taskDueDateInput = document.getElementById('task-due-date');
const filterTabs = document.querySelectorAll('.filter-tab');
const cancelDelete = document.getElementById('cancel-delete');
const confirmDelete = document.getElementById('confirm-delete');
const authBtn = document.getElementById('auth-btn');
const authModal = document.getElementById('auth-modal');
const closeAuthModal = document.getElementById('close-auth-modal');
const authForm = document.getElementById('auth-form');
const toggleAuthMode = document.getElementById('toggle-auth-mode');
let tasks = [];
let currentFilter = 'all';
let taskToDelete = null;
let notificationTimeout;
let isSignUp = false;
function checkDueTasks() {
const now = new Date();
tasks.forEach(task => {
if (!task.completed && task.dueDate && task.dueTime) {
const dueDateTime = new Date(task.dueDate + 'T' + task.dueTime);
const timeDiff = dueDateTime - now;
// Notify 30 minutes before due time
if (timeDiff > 0 && timeDiff <= 1800000 && !task.notified) {
showNotification(task);
task.notified = true;
saveTasks();
}
}
});
}
function showNotification(task) {
const notification = document.createElement('div');
notification.className = 'fixed top-20 right-4 bg-white rounded-lg shadow-lg p-4 z-50 animate-slide-in';
notification.style.maxWidth = '300px';
notification.innerHTML = `
<div class="flex items-start">
<div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
<i class="ri-alarm-warning-line text-primary"></i>
</div>
<div class="ml-3 flex-1">
<p class="text-sm font-medium text-gray-800">Task Due Soon</p>
<p class="mt-1 text-sm text-gray-600">${task.title} is due in 30 minutes</p>
</div>
<button class="ml-4 text-gray-400 hover:text-gray-500" onclick="this.parentElement.parentElement.remove()">
<i class="ri-close-line"></i>
</button>
</div>
`;
document.body.appendChild(notification);
setTimeout(() => {
notification.remove();
}, 5000);
}
// Start checking for due tasks every minute
setInterval(checkDueTasks, 60000);
// Initialize
loadTasks();
updateTaskCounter();
// Event Listeners
addTaskBtn.addEventListener('click', openAddTaskModal);
emptyAddBtn.addEventListener('click', openAddTaskModal);
closeModal.addEventListener('click', closeTaskModal);
cancelTask.addEventListener('click', closeTaskModal);
taskForm.addEventListener('submit', saveTask);
cancelDelete.addEventListener('click', closeDeleteModal);
confirmDelete.addEventListener('click', deleteTask);
filterTabs.forEach(tab => {
tab.addEventListener('click', function() {
const filter = this.dataset.filter;
filterTabs.forEach(t => t.classList.remove('active'));
this.classList.add('active');
setActiveFilter(filter);
renderTasks();
});
});
// Functions
function loadTasks() {
const savedTasks = localStorage.getItem('tasks');
if (savedTasks) {
tasks = JSON.parse(savedTasks);
renderTasks();
}
}
function saveTasks() {
localStorage.setItem('tasks', JSON.stringify(tasks));
updateTaskCounter();
}
function renderTasks() {
if (tasks.length === 0) {
taskContainer.classList.add('hidden');
emptyState.classList.remove('hidden');
return;
}
taskContainer.classList.remove('hidden');
emptyState.classList.add('hidden');
taskContainer.innerHTML = '';
const filteredTasks = filterTasks(tasks);
filteredTasks.forEach((task, index) => {
const delay = index * 0.05;
const taskCard = createTaskCard(task, delay);
taskContainer.appendChild(taskCard);
});
}
function filterTasks(taskList) {
if (currentFilter === 'all') {
return taskList;
} else if (currentFilter === 'completed') {
return taskList.filter(task => task.completed);
} else {
return taskList.filter(task => !task.completed);
}
}
function createTaskCard(task, delay) {
const taskCard = document.createElement('div');
taskCard.className = `task-card bg-white rounded-lg shadow-sm p-4 ${task.completed ? 'completed-task' : ''}`;
taskCard.style.animationDelay = `${delay}s`;
taskCard.dataset.id = task.id;
const formattedDateTime = task.dueDate ? new Date(`${task.dueDate}T${task.dueTime || '00:00'}`).toLocaleString('en-US', {
month: 'short',
day: 'numeric',
year: 'numeric',
hour: 'numeric',
minute: 'numeric',
hour12: true
}) : 'No due date';
const subtasksProgress = task.subtasks ?
task.subtasks.filter(subtask => subtask.completed).length + '/' + task.subtasks.length :
'0/0';
taskCard.innerHTML = `
<div class="flex items-start justify-between">
<div class="flex-1">
<h3 class="text-lg font-medium text-gray-800 mb-1">${task.title}</h3>
<p class="text-gray-600 text-sm mb-3">${task.description || 'No description'}</p>
<div class="flex items-center space-x-4 text-xs text-gray-500">
<div class="flex items-center">
<i class="ri-calendar-line mr-1"></i>
<span>${formattedDateTime}</span>
</div>
<div class="flex items-center">
<i class="ri-list-check-2-line mr-1"></i>
<span>Subtasks: ${subtasksProgress}</span>
</div>
</div>
${task.subtasks && task.subtasks.length > 0 ? `
<div class="mt-3 space-y-2">
${task.subtasks.map(subtask => `
<div class="flex items-center space-x-2 pl-4 text-sm">
<input type="checkbox" class="subtask-checkbox" data-task-id="${task.id}" data-subtask-id="${subtask.id}"
${subtask.completed ? 'checked' : ''}>
<span class="${subtask.completed ? 'line-through text-gray-400' : 'text-gray-700'}">${subtask.title}</span>
</div>
`).join('')}
</div>
` : ''}
</div>
<div class="flex space-x-1">
<button class="edit-btn w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer">
<i class="ri-edit-line text-gray-500"></i>
</button>
<button class="delete-btn w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer">
<i class="ri-delete-bin-line text-gray-500"></i>
</button>
</div>
</div>
<div class="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
<div class="text-xs ${task.completed ? 'text-secondary' : 'text-gray-500'}">
${task.completed ? 'Completed' : 'Pending'}
</div>
<button class="toggle-status px-3 py-1 rounded-full text-xs border ${task.completed ? 'border-secondary text-secondary' : 'border-gray-300 text-gray-600'} cursor-pointer">
${task.completed ? 'Mark as Pending' : 'Mark as Completed'}
</button>
</div>
`;
const editBtn = taskCard.querySelector('.edit-btn');
const deleteBtn = taskCard.querySelector('.delete-btn');
const toggleBtn = taskCard.querySelector('.toggle-status');
editBtn.addEventListener('click', () => openEditTaskModal(task));
deleteBtn.addEventListener('click', () => openDeleteModal(task.id));
toggleBtn.addEventListener('click', () => toggleTaskStatus(task.id));
return taskCard;
}
function openAddTaskModal() {
modalTitle.textContent = 'Add New Task';
taskIdInput.value = '';
taskTitleInput.value = '';
taskDescriptionInput.value = '';
taskDueDateInput.value = '';
taskModal.classList.remove('hidden');
}
function openEditTaskModal(task) {
modalTitle.textContent = 'Edit Task';
taskIdInput.value = task.id;
taskTitleInput.value = task.title;
taskDescriptionInput.value = task.description || '';
taskDueDateInput.value = task.dueDate || '';
document.getElementById('task-due-time').value = task.dueTime || '';
// Clear existing subtasks
const subtasksContainer = document.getElementById('subtasks-container');
subtasksContainer.innerHTML = '';
// Add existing subtasks
if (task.subtasks) {
task.subtasks.forEach(subtask => {
addSubtaskInput(subtask.title, subtask.id);
});
}
taskModal.classList.remove('hidden');
}
function closeTaskModal() {
taskModal.classList.add('hidden');
}
function openDeleteModal(taskId) {
taskToDelete = taskId;
deleteModal.classList.remove('hidden');
}
function closeDeleteModal() {
deleteModal.classList.add('hidden');
taskToDelete = null;
}
function saveTask(e) {
e.preventDefault();
const title = taskTitleInput.value.trim();
const description = taskDescriptionInput.value.trim();
const dueDate = taskDueDateInput.value;
const dueTime = document.getElementById('task-due-time').value;
const id = taskIdInput.value || Date.now().toString();
// Validate title
if (!title) {
showToast('Error', 'Task title is required', null);
return;
}
if (title.length < 3) {
showToast('Error', 'Task title must be at least 3 characters long', null);
return;
}
if (title.length > 100) {
showToast('Error', 'Task title cannot exceed 100 characters', null);
return;
}
// Validate description length if provided
if (description && description.length > 500) {
showToast('Error', 'Description cannot exceed 500 characters', null);
return;
}
// Validate due date and time
if (dueDate) {
const selectedDateTime = new Date(`${dueDate}T${dueTime || '23:59'}`);
const now = new Date();
if (selectedDateTime < now) {
showToast('Error', 'Due date cannot be in the past', null);
return;
}
// Validate if date is not more than 1 year in the future
const oneYearFromNow = new Date();
oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
if (selectedDateTime > oneYearFromNow) {
showToast('Error', 'Due date cannot be more than 1 year in the future', null);
return;
}
}
// Validate subtasks
const subtaskInputs = document.querySelectorAll('.subtask-input');
const subtaskTitles = new Set();
for (const input of subtaskInputs) {
const subtaskTitle = input.value.trim();
if (subtaskTitle) {
if (subtaskTitle.length < 3) {
showToast('Error', 'Subtask title must be at least 3 characters long', null);
return;
}
if (subtaskTitle.length > 100) {
showToast('Error', 'Subtask title cannot exceed 100 characters', null);
return;
}
if (subtaskTitles.has(subtaskTitle)) {
showToast('Error', 'Duplicate subtask titles are not allowed', null);
return;
}
subtaskTitles.add(subtaskTitle);
}
}
// Get subtasks
const subtaskElements = document.querySelectorAll('.subtask-input');
const subtasks = Array.from(subtaskElements).map(input => ({
id: input.dataset.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
title: input.value.trim(),
completed: false
})).filter(subtask => subtask.title !== '');
if (taskIdInput.value) {
// Edit existing task
const taskIndex = tasks.findIndex(task => task.id === id);
if (taskIndex !== -1) {
tasks[taskIndex] = {
...tasks[taskIndex],
title,
description,
dueDate,
dueTime,
subtasks,
notified: false,
updatedAt: new Date().toISOString()
};
}
} else {
// Add new task
const newTask = {
id,
title,
description,
dueDate,
dueTime,
subtasks,
completed: false,
notified: false,
createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString()
};
tasks.unshift(newTask);
}
saveTasks();
renderTasks();
closeTaskModal();
}
function toggleTaskStatus(taskId) {
const taskIndex = tasks.findIndex(task => task.id === taskId);
if (taskIndex !== -1) {
const task = tasks[taskIndex];
// Check if task has subtasks and if any are incomplete
if (task.subtasks && task.subtasks.length > 0) {
const incompleteSubtasks = task.subtasks.filter(subtask => !subtask.completed);
if (incompleteSubtasks.length > 0) {
showToast(
'Cannot Complete Task',
'Please complete all subtasks before marking the task as complete.',
taskId
);
return;
}
}
task.completed = !task.completed;
task.updatedAt = new Date().toISOString();
saveTasks();
renderTasks();
}
}
function showToast(title, message, taskId) {
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastMessage = document.getElementById('toast-message');
const toastBack = document.getElementById('toast-back');
const toastComplete = document.getElementById('toast-complete');
toastTitle.textContent = title;
toastMessage.textContent = message;
toast.classList.remove('hidden');
toastBack.onclick = () => {
toast.classList.add('hidden');
};
toastComplete.onclick = () => {
const taskIndex = tasks.findIndex(task => task.id === taskId);
if (taskIndex !== -1) {
tasks[taskIndex].subtasks.forEach(subtask => {
subtask.completed = true;
});
tasks[taskIndex].completed = true;
saveTasks();
renderTasks();
toast.classList.add('hidden');
}
};
document.getElementById('close-toast').onclick = () => {
toast.classList.add('hidden');
};
}
// Theme toggle functionality
document.getElementById('theme-toggle').addEventListener('click', () => {
document.documentElement.classList.toggle('dark');
document.body.classList.toggle('dark');
localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});
// Auth functionality
// Check theme preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
document.documentElement.classList.add('dark');
document.body.classList.add('dark');
}
authBtn.addEventListener('click', () => {
isSignUp = false;
document.getElementById('auth-modal-title').textContent = 'Sign In';
toggleAuthMode.textContent = 'Create account';
authForm.querySelector('button[type="submit"]').textContent = 'Sign In';
authForm.reset();
authModal.classList.remove('hidden');
});
closeAuthModal.addEventListener('click', () => {
authModal.classList.add('hidden');
});
toggleAuthMode.addEventListener('click', () => {
isSignUp = !isSignUp;
document.getElementById('auth-modal-title').textContent = isSignUp ? 'Sign Up' : 'Sign In';
toggleAuthMode.textContent = isSignUp ? 'Sign in instead' : 'Create account';
authForm.querySelector('button[type="submit"]').textContent = isSignUp ? 'Sign Up' : 'Sign In';
document.getElementById('confirm-password-field').classList.toggle('hidden', !isSignUp);
});
// Check for existing user session
document.addEventListener('DOMContentLoaded', function() {
// Add character counter for description
const descriptionInput = document.getElementById('task-description');
const descriptionChars = document.getElementById('description-chars');
descriptionInput.addEventListener('input', function() {
const charCount = this.value.length;
descriptionChars.textContent = charCount;
if (charCount > 450) {
descriptionChars.classList.add('text-yellow-500');
} else if (charCount > 490) {
descriptionChars.classList.add('text-red-500');
} else {
descriptionChars.classList.remove('text-yellow-500', 'text-red-500');
}
});
// Add real-time validation for auth form
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
function validateInput(input, validationFn) {
input.addEventListener('input', function() {
if (validationFn(this.value)) {
this.classList.remove('border-red-500');
this.classList.add('border-green-500');
} else {
this.classList.remove('border-green-500');
this.classList.add('border-red-500');
}
});
}
validateInput(nameInput, (value) => {
return value.trim().length >= 2 && value.trim().length <= 50 && /^[A-Za-z0-9\s]+$/.test(value);
});
validateInput(emailInput, (value) => {
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
});
validateInput(passwordInput, (value) => {
return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value);
});
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (currentUser) {
document.getElementById('user-name').textContent = `${currentUser.name}'s`;
document.getElementById('user-name').classList.remove('hidden');
}
});
function displayError(input, message) {
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('p');
        errorElement.className = 'error-message text-xs text-red-500 mt-1';
        input.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
    input.classList.add('border-red-500');
    input.classList.remove('border-green-500');
}

function clearError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
    input.classList.remove('border-red-500');
    input.classList.add('border-green-500');
}

authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');

    let isValid = true;

    // Validate name
    if (name.value.trim().length < 2 || name.value.trim().length > 50 || !/^[A-Za-z0-9\s]+$/.test(name.value.trim())) {
        displayError(name, 'Name must be 2-50 characters long and contain only letters, numbers, and spaces.');
        isValid = false;
    } else {
        clearError(name);
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        displayError(email, 'Please enter a valid email address.');
        isValid = false;
    } else {
        clearError(email);
    }

    // Validate password
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password.value)) {
        displayError(password, 'Password must be at least 6 characters long and include at least one letter and one number.');
        isValid = false;
    } else {
        clearError(password);
    }

    // Validate confirm password during sign-up
    if (isSignUp && confirmPassword.value !== password.value) {
        displayError(confirmPassword, 'Passwords do not match.');
        isValid = false;
    } else {
        clearError(confirmPassword);
    }

    if (isValid) {
        // Store user data
        const userData = { name: name.value.trim(), email: email.value.trim() };
        localStorage.setItem('currentUser', JSON.stringify(userData));

        // Update UI
        document.getElementById('user-name').textContent = `${name.value.trim()}'s`;
        document.getElementById('user-name').classList.remove('hidden');

        // Show welcome toast
        showAuthToast('Welcome!', `Welcome back, ${name.value.trim()}!`, 'success');
        authModal.classList.add('hidden');
        authForm.reset();
    }
});
function showAuthToast(title, message, type = 'success') {
const toast = document.createElement('div');
toast.className = "fixed top-20 right-4 bg-white rounded-lg shadow-lg p-4 z-50 animate-slide-in max-w-sm";
toast.innerHTML = `
<div class="flex items-start">
<div class="flex-shrink-0 w-8 h-8 rounded-full ${type === 'success' ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center">
<i class="ri-${type === 'success' ? 'check-line text-green-500' : 'error-warning-line text-red-500'}"></i>
</div>
<div class="ml-3 flex-1">
<p class="text-sm font-medium text-gray-800">${title}</p>
<p class="mt-1 text-sm text-gray-600">${message}</p>
</div>
<button class="ml-4 text-gray-400 hover:text-gray-500" onclick="this.parentElement.parentElement.remove()">
<i class="ri-close-line"></i>
</button>
</div>
`;
document.body.appendChild(toast);
setTimeout(() => {
toast.remove();
}, 5000);
}
function deleteTask() {
if (taskToDelete) {
const taskElement = document.querySelector('.task-card[data-id="${taskToDelete}"]');
if (taskElement) {
taskElement.classList.add('delete-animation');
setTimeout(() => {
tasks = tasks.filter(task => task.id !== taskToDelete);
saveTasks();
renderTasks();
closeDeleteModal();
}, 300);
} else {
tasks = tasks.filter(task => task.id !== taskToDelete);
saveTasks();
renderTasks();
closeDeleteModal();
}
}
}
function setActiveFilter(filter) {
currentFilter = filter;
const filterButtons = document.querySelectorAll('.filter-tab');
filterButtons.forEach(tab => {
if (tab.dataset.filter === filter) {
tab.classList.add('active');
tab.setAttribute('aria-selected', 'true');
} else {
tab.classList.remove('active');
tab.setAttribute('aria-selected', 'false');
}
});
}
function updateTaskCounter() {
const totalTasks = tasks.length;
const completedTasks = tasks.filter(task => task.completed).length;
taskCounter.textContent = totalTasks === 0
? 'No tasks'
: `${completedTasks}/${totalTasks} tasks`;
}
// Set current date as min date for due date input
const today = new Date().toISOString().split('T')[0];
taskDueDateInput.setAttribute('min', today);
// Add subtask functionality
document.getElementById('add-subtask').addEventListener('click', () => addSubtaskInput());
function addSubtaskInput(value = '', id = '') {
const subtasksContainer = document.getElementById('subtasks-container');
const subtaskDiv = document.createElement('div');
subtaskDiv.className = 'flex items-center space-x-2';
subtaskDiv.innerHTML = `
<input type="text" class="subtask-input flex-1 px-3 py-2 text-sm border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
placeholder="Enter subtask" value="${value}" data-id="${id}" minlength="3" maxlength="100" title="Subtask must be between 3 and 100 characters">
<button type="button" class="remove-subtask w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
<i class="ri-delete-bin-line text-gray-500"></i>
</button>
<p class="absolute -bottom-5 left-0 text-xs text-gray-500 subtask-char-count">${value.length}/100</p>
`;
// Add input event listener for character count
const input = subtaskDiv.querySelector('.subtask-input');
input.addEventListener('input', function() {
const charCount = this.value.length;
const countDisplay = this.parentElement.querySelector('.subtask-char-count');
countDisplay.textContent = `${charCount}/100`;
});
subtaskDiv.querySelector('.remove-subtask').addEventListener('click', () => {
subtaskDiv.remove();
});
subtasksContainer.appendChild(subtaskDiv);
}
// Handle subtask checkbox clicks
document.addEventListener('click', function(e) {
if (e.target.classList.contains('subtask-checkbox')) {
const taskId = e.target.dataset.taskId;
const subtaskId = e.target.dataset.subtaskId;
const taskIndex = tasks.findIndex(t => t.id === taskId);
if (taskIndex !== -1) {
const subtaskIndex = tasks[taskIndex].subtasks.findIndex(s => s.id === subtaskId);
if (subtaskIndex !== -1) {
tasks[taskIndex].subtasks[subtaskIndex].completed = e.target.checked;
// Check if all subtasks are completed
const allSubtasksCompleted = tasks[taskIndex].subtasks.every(s => s.completed);
if (allSubtasksCompleted) {
tasks[taskIndex].completed = true;
}
saveTasks();
renderTasks();
}
}
}
});
// Add styles for notification animation
const style = document.createElement('style');
style.textContent = `
@keyframes slide-in {
from {
transform: translateX(100%);
opacity: 0;
}
to {
transform: translateX(0);
opacity: 1;
}
}
.animate-slide-in {
animation: slide-in 0.3s ease-out forwards;
}
`;
document.head.appendChild(style);
});
