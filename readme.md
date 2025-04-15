# TaskFlow - Task Management Application

TaskFlow is a feature-rich task management application designed to help users organize their tasks efficiently. It provides a clean and intuitive interface for creating, managing, and tracking tasks, along with support for subtasks, due dates, and notifications. The application also includes user authentication and a dark mode for enhanced usability.

---

## Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)
4. [File Structure](#file-structure)
5. [Detailed Features](#detailed-features)
6. [How to Use](#how-to-use)
7. [Future Enhancements](#future-enhancements)

---

## Features

- **Task Management**: Create, edit, and delete tasks with ease.
- **Subtasks**: Add subtasks to tasks for better organization.
- **Due Dates and Notifications**: Set due dates and receive notifications for tasks due soon.
- **Real-Time Validation**: Form fields are validated in real-time to ensure data accuracy.
- **Dark Mode**: Toggle between light and dark themes for better accessibility.
- **Authentication**: Sign up and sign in functionality with user session management.
- **Filter Tasks**: Filter tasks by status (All, Pending, Completed).
- **Responsive Design**: Fully responsive layout for desktop and mobile devices.

---

## Technologies Used

- **HTML5**: For structuring the web page.
- **CSS3**: For styling the application, including Tailwind CSS for utility-first styling.
- **JavaScript**: For dynamic functionality and interactivity.
- **LocalStorage**: For storing user data and tasks persistently in the browser.
- **Remix Icons**: For modern and visually appealing icons.

---

## Getting Started

### Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Edge).
- No additional installations are required as the application runs entirely in the browser.

### Running the Application
1. Clone or download the repository to your local machine.
2. Open the `index.html` file in your browser.
3. Start managing your tasks!

---

## File Structure

---

## Detailed Features

### 1. **Task Management**
   - Users can create tasks with a title, description, due date, and time.
   - Tasks can be marked as completed or pending.
   - Tasks can be edited or deleted.

### 2. **Subtasks**
   - Each task can have multiple subtasks.
   - Subtasks can be marked as completed individually.
   - Tasks cannot be marked as completed until all subtasks are completed.

### 3. **Due Dates and Notifications**
   - Users can set due dates and times for tasks.
   - Notifications are displayed 30 minutes before a task is due.

### 4. **Real-Time Validation**
   - Input fields for name, email, and password are validated in real-time.
   - Error messages are displayed below invalid fields.

### 5. **Dark Mode**
   - Users can toggle between light and dark themes.
   - The theme preference is saved in LocalStorage.

### 6. **Authentication**
   - Users can sign up and sign in.
   - User sessions are managed using LocalStorage.
   - The application displays the user's name after login.

### 7. **Filter Tasks**
   - Tasks can be filtered by status:
     - **All**: Displays all tasks.
     - **Pending**: Displays tasks that are not completed.
     - **Completed**: Displays tasks that are completed.

### 8. **Responsive Design**
   - The application is fully responsive and works seamlessly on both desktop and mobile devices.

---

## How to Use

### 1. **Authentication**
   - Click the user icon in the navigation bar to open the authentication modal.
   - Sign up by entering your name, email, and password.
   - Sign in with your credentials to access the application.

### 2. **Creating a Task**
   - Click the "Add New Task" button to open the task modal.
   - Enter the task title, description, due date, and time.
   - Add subtasks if needed.
   - Click "Save Task" to add the task to the list.

### 3. **Managing Tasks**
   - Use the filter tabs to view tasks by status (All, Pending, Completed).
   - Click the edit icon on a task to modify it.
   - Click the delete icon on a task to remove it.

### 4. **Subtasks**
   - Add subtasks by clicking the "Add Subtask" button in the task modal.
   - Mark subtasks as completed by checking the checkbox next to them.

### 5. **Dark Mode**
   - Toggle the theme by clicking the sun/moon icon in the navigation bar.
   - The selected theme will be saved for future sessions.

### 6. **Notifications**
   - Notifications will appear 30 minutes before a task is due.
   - Dismiss notifications by clicking the close icon.

---

## Future Enhancements

- **User Authentication with Backend**: Integrate a backend service for secure user authentication.
- **Task Sharing**: Allow users to share tasks with others.
- **Recurring Tasks**: Add support for recurring tasks.
- **Priority Levels**: Allow users to set priority levels for tasks.
- **Export/Import Tasks**: Enable users to export and import tasks as JSON or CSV files.

---

## Screenshots

### 1. **Task List**
![Task List](https://via.placeholder.com/800x400)

### 2. **Add Task Modal**
![Add Task Modal](https://via.placeholder.com/800x400)

### 3. **Dark Mode**
![Dark Mode](https://via.placeholder.com/800x400)

---

## License

This project is licensed under the MIT License. Feel free to use and modify it as needed.

---

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework.
- [Remix Icons](https://remixicon.com/) for the beautiful icons.
- [Google Fonts](https://fonts.google.com/) for the fonts used in the application.

---

Thank you for using TaskFlow! If you have any feedback or suggestions, feel free to reach out.
