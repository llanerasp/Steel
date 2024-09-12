const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const type = document.getElementById('type').value;
    const priority = document.getElementById('priority').value;
    
    // Aquí agregarías la lógica para enviar la tarea al backend (POST a tu API)

    // Crear elemento de tarea en la lista
    const li = document.createElement('li');
    li.className = 'list-group-item task-item';
    li.setAttribute('draggable', true);
    li.innerHTML = `<strong>${title}</strong> (${type}) - Prioridad: ${priority}<br>${description}`;

    // Hacer arrastrable
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', handleDrop);
    
    taskList.appendChild(li);
    
    taskForm.reset();  // Reiniciar el formulario
});

// Funciones para arrastrar y soltar tareas
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(taskList, e.clientY);
    if (afterElement == null) {
        taskList.appendChild(dragging);
    } else {
        taskList.insertBefore(dragging, afterElement);
    }
}

function handleDrop(e) {
    e.target.classList.remove('dragging');
}

// Obtener el elemento después del cual se suelta
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
