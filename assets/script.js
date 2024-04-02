// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

    // Todo: create a function to create a task card
    function createTaskCard(taskName, taskDescription) {
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');
    
        const heading = document.createElement('h2');
        heading.textContent = taskName;
    
        const description = document.createElement('p');
        description.textContent = taskDescription;
    
        taskCard.appendChild(heading);
        taskCard.appendChild(description);
    
        return taskCard;
    }


    // Todo: create a function to render the task list and make cards draggable
    function renderTaskList(tasks) {
        const taskContainer = document.getElementById('taskContainer');
        taskContainer.HTMLElement;  // Clear existing content
    
        tasks.forEach(task => {
            const taskCard = createTaskCard(task.name, task.description);
            taskContainer.appendChild(taskCard);
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
    function task(event) {
        event.preventDefault();

        const taskNameInput = document.getElementById('taskNameInput');
        const taskDescriptionInput = document.getElementById('taskDescriptionInput');
        const taskName = taskNameInput.value.trim();
        const taskDescription = taskDescriptionInput.value.trim();
        if (taskName === '' || taskDescription === '') {
            alert();
        }
        const newTask = {
            name: taskName,
            description: taskDescription
        };
        taskList.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(taskList));
        taskNameInput.value = '';
        taskDescriptionInput.value = '';
        updateTaskBoard(taskList);
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
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-task-btn')) {
            const taskId = event.target.dataset.taskId; 
            handleDeleteTask(taskId);
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
    $(document).ready(function() {
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

        $("#dueDate").datepicker();
    });
    
