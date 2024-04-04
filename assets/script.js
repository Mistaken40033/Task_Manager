// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = localStorage.getItem("nextId");

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (!nextId) {
        nextId = 1
    } else {
        nextId ++
    } localStorage.setItem("nextId",nextId)
    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = $("<div>").addClass("card task-card").attr("data-id", task.id)
    const header = $("<div>").addClass("card-header h3").text(task.title)
    const body = $("<div>").addClass("card-body")
    const description = $("<p>").addClass("card-text").text(task.description)
    const dueDate = $("<p>").addClass("card-text").text(task.dueDate)
    const deleteBtn = $("<button>").addClass("btn btn-danger custom-delete-btn deleteBtn").text("delete").attr("data-taskId", task.id)
    deleteBtn.on("click", handleDeleteTask)
    if (task.status !== "done") {
        const today = dayjs()
        const dueDate = dayjs(task.dueDate, "DD/MM/YY")
        if (today.isSame(dueDate, "day")) {
            card.addClass("bg-warning text-white")

        } else if (today.isAfter(dueDate)) {
            card.addClass("bg-danger text-white")
        }
    } body.append(description, dueDate, deleteBtn)
    card.append(header, body)
    return card;
}


// Todo: create a function to render the task list and make cards draggable
function renderTaskList(tasks) {

    $("#todo-cards").empty()
    $("#in-progress-cards").empty()
    $("#done-cards").empty()

    taskList.forEach(task => {
        if (task.status === "to-do") {
            $("#todo-cards").append(createTaskCard(task))
        } else if (task.status === "in-progress") {
            $("#in-progress-cards").append(createTaskCard(task))
        }
        else {
            $("#done-cards").append(createTaskCard(task))
        }


    });
}

function taskCardsDraggable() {
    const taskCards = document.querySelectorAll('.task-card');

    taskCards.forEach(taskCard => {
        taskCard.setAttribute('draggable', true);

        taskCard.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', '');
        });
    });
}


// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();


    const newTask = {
        id: generateTaskId(),
        name: $("#taskTitle").val(),
        description: $("#taskDescription").val(),
        dueDate: $("#taskDueDate").val(),
        status: "to-do"
    };
    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    $("#taskTitle").val(""),
    $("#taskDescription").val(""),
    $("#taskDueDate").val(""),
    renderTaskList();
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = event.target.dataset.taskId;

    const taskIndex = taskList.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        console.error('Task not found for deletion.');
        return;
    }

    taskList.splice(taskIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    updateTaskBoard(taskList);
}

// Add event listeners to dynamically created task cards for deletion
const taskId = $(this).attr('data-task-id');
let tasks = JSON.parse(localStorage.getItem('tasks'))
console.log(taskId);

tasks.forEach((task) => {
    if (task.id == taskId) {
        console.log(task.id)
      tasks.splice(tasks.indexOf(task), 1);
    }
});

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    event.preventDefault();
    const taskId = ui.draggable.data("taskId");
    const laneId = ui.draggable.data("laneId");
    updateTaskBoard(taskList);
}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $("#taskForm").on("submit", handleAddTask); 

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

    $("#dueDate").datepicker();
});

