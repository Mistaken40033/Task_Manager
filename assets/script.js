// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let taskDate = new Date().getTime();
    let nextId = Math.floor(Math.random()*1000);
    return 'task_${taskList}_${nextId}';
}

// Todo: create a function to create a task card



// Todo: create a function to render the task list and make cards draggable

function renderTaskList(task) {

    // const taskListContainer = document.getElementById("task-list-container");
    // taskListContainer.innerHTML = "task";

    task.forEach((task) => {
        const taskCard = createTaskCard(task);
        taskCard.setAttribute("draggable", "true");

        taskCard.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text/plain", task.id);
        });

        taskListContainer.appendChild(taskCard);
    });
}

function allowDrop(event) {
    event.preventDefault();
}

function moveTaskToTarget(taskId, event) {
    const taskCard = document.getElementById(taskId);
    event.target.appendChild(taskCard);
}

// Todo: create a function to handle adding a new task
function handleAddTask(_event){
    const taskList = JSON.parse(localStorage.getItem("tasks"));
    const nextId = JSON.parse(localStorage.getItem("nextId"));

    const newTask = {
        id: nextId,
        name: taskName,
        description: description
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId + 1);

    renderTaskList(taskList);

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = event.target.dataset.taskId;
    let taskList = JSON.parse(localStorage.getItem("tasks"));
    
    taskList = taskList.filter(task => task.id !== parseInt(taskId));
    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList(taskList);
}


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable[0].dataset.taskId;
    const newStatus = event.target.dataset.status;
    let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

    taskList = taskList.map(task => {
        if (task.id === parseInt(taskId)) {
            task.status = newStatus;
        }
        return task;
    });

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList(taskList);
}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, 
// and make the due date field a date picker
$(document).ready(function () {
    renderTaskList(JSON.parse(localStorage.getItem("tasks")));

    $(".task-card").on("dragstart", function (event) {
        event.originalEvent.dataTransfer.setData("text/plain", $(this).data("taskId"));
    });

    $(".status-lane").on("drop", function (event) {
        event.preventDefault();
        handleDrop(event, { draggable: [event.originalEvent] });
    });

    $(".status-lane").on("dragover", function (event) {
        event.preventDefault();
    });

    $("#due-date").datepicker();
});