// Función principal para cargar las tareas y proyectos al inicio
function loadProjectsAndTasks() {
    console.log("Cargando proyectos y tareas desde la base de datos...");
    fetchTasksFromDB().then(tasks => {
        const projects = groupTasksByProject(tasks);
        displayProjects(projects);
        if (Object.keys(projects).length > 0) {
            console.log("Cargando tareas del primer proyecto por defecto...");
            loadTasksByProject(Object.values(projects)[0]);
        } else {
            console.log("No hay proyectos disponibles.");
        }
    }).catch(error => {
        console.error("Error al cargar las tareas:", error);
    });
}

// Función para hacer un GET y obtener todas las tareas de la base de datos
function fetchTasksFromDB() {
    console.log("Realizando fetch de tareas desde la base de datos...");
    return fetch("http://localhost:8080/steel/tasks")
        .then(response => {
            console.log("Respuesta del servidor al cargar tareas:", response);
            return response.json();
        })
        .then(tasks => {
            console.log("Tareas recibidas de la base de datos:", tasks);
            return tasks;
        })
        .catch(error => {
            console.error("Error en fetchTasksFromDB:", error);
        });
}

// Función para agrupar las tareas por proyecto
function groupTasksByProject(tasks) {
    console.log("Agrupando tareas por proyecto...");
    const projects = {};
    tasks.forEach(task => {
        const projectName = task.project || "Sin Proyecto";
        if (!projects[projectName]) {
            projects[projectName] = [];
        }
        projects[projectName].push(task);
    });
    console.log("Tareas agrupadas por proyecto:", projects);
    return projects;
}

// Función para mostrar los proyectos como botones
function displayProjects(projects) {
    console.log("Mostrando proyectos en botones...");
    const projectContainer = document.getElementById('projects');
    projectContainer.innerHTML = ''; // Limpiar proyectos previos

    Object.keys(projects).forEach(projectName => {
        const projectButton = createProjectButton(projectName);
        projectButton.addEventListener('click', () => {
            console.log("Proyecto seleccionado:", projectName);
            loadTasksByProject(projects[projectName]);
        });
        projectContainer.appendChild(projectButton);
        console.log(`Botón del proyecto '${projectName}' añadido.`);
    });
}

// Función para crear el botón de un proyecto
function createProjectButton(projectName) {
    console.log(`Creando botón para el proyecto '${projectName}'...`);
    const projectButton = document.createElement('button');
    projectButton.classList.add('btn', 'btn-primary', 'm-2');
    projectButton.type = 'button';
    projectButton.innerText = projectName;
    return projectButton;
}

// Función para cargar las tareas de un proyecto en el tablero
function loadTasksByProject(tasks) {
    console.log("Cargando tareas para el proyecto seleccionado...");
    clearTaskColumns();
    tasks.forEach(task => {
        const taskItem = createTaskItem(task);
        addTaskToColumn(task, taskItem);
    });
    console.log("Tareas cargadas en las columnas.");
}

// Función para crear el elemento visual de una tarea
function createTaskItem(task) {
    console.log("Creando elemento visual para la tarea:", task);
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item');
    taskItem.innerHTML = `
        <h5>${task.title}</h5>
        <p>${task.description}</p>
    `;
    taskItem.addEventListener('click', () => {
        console.log("Tarea seleccionada:", task);
        openTaskDetails(task);
    });
    return taskItem;
}

// Función para limpiar las columnas del tablero
function clearTaskColumns() {
    console.log("Limpiando las columnas del tablero...");
    document.getElementById('highPriorityTasks').innerHTML = '<h3>Alta Prioridad</h3>';
    document.getElementById('mediumPriorityTasks').innerHTML = '<h3>Media Prioridad</h3>';
    document.getElementById('lowPriorityTasks').innerHTML = '<h3>Baja Prioridad</h3>';
    document.getElementById('completedTasks').innerHTML = '<h3>Completadas</h3>';
}

// Función para añadir una tarea a la columna correspondiente
function addTaskToColumn(task, taskItem) {
    console.log("Añadiendo tarea a la columna correspondiente:", task);
    if (task.status === "Completada") {
        document.getElementById('completedTasks').appendChild(taskItem);
    } else {
        switch (task.priority.toLowerCase()) {
            case 'alta':
                document.getElementById('highPriorityTasks').appendChild(taskItem);
                break;
            case 'media':
                document.getElementById('mediumPriorityTasks').appendChild(taskItem);
                break;
            case 'baja':
                document.getElementById('lowPriorityTasks').appendChild(taskItem);
                break;
            default:
                console.log("Prioridad desconocida:", task.priority);
        }
    }
}

// Función para abrir los detalles de una tarea
function openTaskDetails(task) {
    console.log("Abriendo detalles de la tarea:", task);
    const taskDetails = createTaskDetails(task);
    const container = document.querySelector('.container');
    container.innerHTML = ''; // Limpiar detalles previos
    container.appendChild(taskDetails);
    console.log("Detalles de la tarea mostrados.");
}

// Función para crear el contenedor de detalles de una tarea
function createTaskDetails(task) {
    console.log("Creando contenedor de detalles de la tarea:", task);
    const taskDetails = document.createElement('div');
    taskDetails.classList.add('task-details');
    taskDetails.innerHTML = `
        <h2>${task.title}</h2>
        <p><strong>Descripción:</strong> ${task.description}</p>
        <p><strong>Tiempo estimado:</strong> ${task.estimatedTime} horas</p>
        <p><strong>Programador asignado:</strong> ${task.assignedTo}</p>
        <img src="${task.image ? task.image : 'resources/images/default.png'}" alt="${task.title}" style="width: 100%; max-width: 400px; margin-bottom: 20px;">
        <button id="startTaskBtn" class="btn btn-primary" ${task.status === 'Iniciada' || task.status === 'Completada' ? 'disabled' : ''} type="button">Iniciar tarea</button>
        <button id="completeTaskBtn" class="btn btn-success" ${task.status !== 'Iniciada' ? 'disabled' : ''} type="button">Tarea completada</button>
        <button id="backToListBtn" class="btn btn-secondary" type="button">Volver al Listado</button> <!-- Botón de "Volver al Listado" -->
    `;
    setupTaskActions(taskDetails, task);
    return taskDetails;
}

//Funcion para que cuando pulsemos el boton vuelva a la lista de tareas
function backToTaskList() {
    console.log("Volviendo al listado de tareas...");
    window.location.href = 'http://localhost:8080/steel/tasks.html'; // Redirigir al listado de tareas
}

// Función para configurar los eventos de los botones de la tarea
function setupTaskActions(taskDetails, task) {
    console.log("Configurando eventos de los botones para la tarea:", task);
    const startTaskBtn = taskDetails.querySelector('#startTaskBtn');
    const completeTaskBtn = taskDetails.querySelector('#completeTaskBtn');
    const backToListBtn = taskDetails.querySelector('#backToListBtn'); // Botón "Volver al Listado"
    
    startTaskBtn.addEventListener('click', (event) => {
        event.preventDefault();
        startTask(task, startTaskBtn, completeTaskBtn);
    });

    completeTaskBtn.addEventListener('click', (event) => {
        event.preventDefault();
        completeTask(task, completeTaskBtn);
    });

        // Configurar botón de "Volver al Listado"
    backToListBtn.addEventListener('click', (event) => {
            event.preventDefault();
            backToTaskList(); // Llamada a la función para volver al listado
        });
}

// Función para iniciar una tarea
function startTask(task, startTaskBtn, completeTaskBtn) {
    console.log("Iniciando tarea con ID:", task.id);
    fetchTaskById(task.id).then(data => {
        console.log("Datos de la tarea antes de iniciar:", data);
        data.status = 'Iniciada';
        updateTaskStatus(data).then(() => {
            console.log("Tarea iniciada correctamente.");
            startTaskBtn.disabled = true;
            completeTaskBtn.disabled = false;
        });
    }).catch(error => {
        console.error("Error al iniciar la tarea:", error);
    });
}

// Función para completar una tarea
function completeTask(task, completeTaskBtn) {
    console.log("Completando tarea con ID:", task.id);
    fetchTaskById(task.id).then(data => {
        console.log("Datos de la tarea antes de completar:", data);
        data.status = 'Completada';
        updateTaskStatus(data).then(() => {
            console.log("Tarea completada correctamente.");
            completeTaskBtn.disabled = true;
        });
    }).catch(error => {
        console.error("Error al completar la tarea:", error);
    });
}

// Función para obtener una tarea por ID
function fetchTaskById(taskId) {
    console.log(`Obteniendo tarea con ID ${taskId}...`);
    return fetch(`http://localhost:8080/steel/tasks/${taskId}`)
        .then(response => {
            console.log(`Respuesta del servidor (GET - Tarea ${taskId}):`, response);
            return response.json();
        })
        .catch(error => {
            console.error(`Error al obtener la tarea con ID ${taskId}:`, error);
        });
}

// Función para actualizar el estado de una tarea en la base de datos
function updateTaskStatus(task) {
    console.log("Actualizando tarea en el servidor:", task);
    return fetch("http://localhost:8080/steel/tasks", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    }).then(response => {
        console.log("Respuesta del servidor (PUT):", response);
        if (!response.ok) {
            throw new Error("Error al actualizar el estado de la tarea");
        }
        return response.json();
    }).catch(error => {
        console.error("Error en la actualización de la tarea:", error);
    });
}

// Cargar las tareas al inicio
window.onload = loadProjectsAndTasks;
