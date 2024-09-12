// Función para agrupar las tareas por proyecto
function groupTasksByProject(tasks) {
    const projects = {};

    tasks.forEach(task => {
        const projectName = task.project || "Sin Proyecto"; // Usar un nombre por defecto si no hay proyecto
        if (!projects[projectName]) {
            projects[projectName] = [];
        }
        projects[projectName].push(task);
    });

    return projects;
}

// Función para cargar los proyectos y tareas reales desde la base de datos
function loadProjectsAndTasks() {
    fetch("http://localhost:8080/steel/tasks") // Llamada a la API del backend para obtener las tareas
        .then(response => response.json())
        .then(tasks => {
            console.log("Tareas recibidas de la base de datos:", tasks);

            // Agrupar las tareas por proyecto
            const projects = groupTasksByProject(tasks);

            // Mostrar los botones de proyectos
            const projectContainer = document.getElementById('projects');
            projectContainer.innerHTML = ''; // Limpiar proyectos previos

            Object.keys(projects).forEach(projectName => {
                const projectButton = document.createElement('button');
                projectButton.classList.add('btn', 'btn-primary', 'm-2');
                projectButton.type = 'button'; // Asegurarse de que no sea un botón de tipo submit
                projectButton.innerText = projectName;

                // Al hacer clic en un proyecto, cargar las tareas asociadas
                projectButton.addEventListener('click', () => loadTasksByProject(projects[projectName]));

                projectContainer.appendChild(projectButton);
            });

            // Si hay al menos un proyecto, cargar las tareas del primer proyecto por defecto
            if (Object.keys(projects).length > 0) {
                loadTasksByProject(Object.values(projects)[0]);
            }
        })
        .catch(error => {
            console.error("Error al cargar las tareas:", error);
        });
}

// Función para cargar las tareas de un proyecto
function loadTasksByProject(tasks) {
    const highPriorityColumn = document.getElementById('highPriorityTasks');
    const mediumPriorityColumn = document.getElementById('mediumPriorityTasks');
    const lowPriorityColumn = document.getElementById('lowPriorityTasks');
    const completedTasksColumn = document.getElementById('completedTasks');

    // Limpiar las columnas de tareas
    highPriorityColumn.innerHTML = '<h3>Alta Prioridad</h3>';
    mediumPriorityColumn.innerHTML = '<h3>Media Prioridad</h3>';
    lowPriorityColumn.innerHTML = '<h3>Baja Prioridad</h3>';
    completedTasksColumn.innerHTML = '<h3>Completadas</h3>';

    // Añadir las tareas nuevas según su prioridad y estado
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.innerHTML = `
            <h5>${task.title}</h5>
            <p>${task.description}</p>
        `;

        // Añadir evento para abrir detalles de la tarea
        taskItem.addEventListener('click', () => openTaskDetails(task));

        // Colocar tareas en las columnas correspondientes
        if (task.status === "Completada") {
            completedTasksColumn.appendChild(taskItem);
        } else {
            switch (task.priority.toLowerCase()) {
                case 'alta':
                    highPriorityColumn.appendChild(taskItem);
                    break;
                case 'media':
                    mediumPriorityColumn.appendChild(taskItem);
                    break;
                case 'baja':
                    lowPriorityColumn.appendChild(taskItem);
                    break;
            }
        }
    });
}

// Función para abrir los detalles de una tarea
function openTaskDetails(task) {
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
    `;

    const startTaskBtn = taskDetails.querySelector('#startTaskBtn');
    const completeTaskBtn = taskDetails.querySelector('#completeTaskBtn');

    // Al hacer clic en "Iniciar tarea"
    startTaskBtn.addEventListener('click', (event) => {
        event.preventDefault();
        console.log("Iniciando tarea con ID:", task.id);

        // Paso 1: Hacer GET para obtener los datos de la tarea
        fetch(`http://localhost:8080/steel/tasks/${task.id}`, {
            method: "GET"
        })
        .then(response => {
            console.log("Respuesta del servidor (GET):", response);
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos del GET:", data);

            // Paso 2: Actualizar el estado a 'Iniciada'
            data.status = 'Iniciada';

            // Crear un objeto actualizado, eliminando la imagen si no existe
            const updatedTask = {
                id: data.id,
                title: data.title || "Sin título", // Asegurar un título
                description: data.description || "Sin descripción", // Asegurar una descripción
                priority: data.priority || "Baja", // Asegurar una prioridad
                assignedTo: data.assignedTo || "Sin asignar", // Asegurar que haya un asignado
                estimatedTime: data.estimatedTime || 0, // Asegurar tiempo estimado
                status: data.status || "Pendent", // Asegurar un estado
                project: data.project || "Sin Proyecto", // Asegurar que haya un proyecto
                image: data.image || "" // Enviar cadena vacía si no hay imagen
            };

            console.log("Datos a enviar en el PUT:", updatedTask);

            // Paso 3: Hacer PUT para actualizar el estado a 'Iniciada'
            return fetch(`http://localhost:8080/steel/tasks`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedTask) // Enviar la tarea actualizada al servidor
            });
        })
        .then(response => {
            console.log("Respuesta del servidor (PUT):", response);
            if (!response.ok) {
                throw new Error("Error al actualizar el estado de la tarea");
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos del PUT:", data);

            // Paso 4: Hacer GET nuevamente para verificar que el estado es 'Iniciada'
            return fetch(`http://localhost:8080/steel/tasks/${task.id}`, {
                method: "GET"
            });
        })
        .then(response => response.json())
        .then(data => {
            console.log("Datos después del segundo GET:", data);

            // Si el estado es 'Iniciada', deshabilitar el botón de "Iniciar tarea"
            if (data.status === 'Iniciada') {
                startTaskBtn.disabled = true;
                completeTaskBtn.disabled = false; // Habilitar el botón de "Tarea completada"
            }
        })
        .catch(error => {
            console.error("Error en el proceso:", error);
        });
    });

    // Evento para completar la tarea
    completeTaskBtn.addEventListener('click', (event) => {
        event.preventDefault();
        console.log("Completando tarea:", task.id);
        task.status = 'Completada';
        updateTaskStatus(task); // Actualiza la tarea en el backend
        completeTaskBtn.disabled = true;
    });

    // Reemplazar el contenido actual con los detalles de la tarea
    const container = document.querySelector('.container');
    container.innerHTML = '';
    container.appendChild(taskDetails);
}



// Cargar las tareas al inicio
window.onload = loadProjectsAndTasks;
