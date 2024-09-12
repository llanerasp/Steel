document.getElementById("taskForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío tradicional del formulario

    console.log("Formulario de tarea enviado. Recopilando datos...");

    // Usar FormData para manejar tanto texto como archivos
    const formData = new FormData();
    formData.append("project", document.getElementById("project").value);
    formData.append("title", document.getElementById("title").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("type", document.getElementById("type").value);
    formData.append("priority", document.getElementById("priority").value);
    formData.append("assignedTo", document.getElementById("assignedTo").value || "Sin asignar");
    formData.append("estimatedTime", document.getElementById("estimatedTime").value); // Añadir el campo de horas estimadas
    formData.append("status", "Pendent"); // El status siempre es "Pendent" al crear

    // Si hay una imagen, añadirla al FormData
    const imageFile = document.getElementById("image").files[0];
    if (imageFile) {
        formData.append("image", imageFile);
        console.log("Imagen adjunta:", imageFile.name);
    }

    console.log("Datos recopilados del formulario:", {
        project: document.getElementById("project").value,
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        type: document.getElementById("type").value,
        priority: document.getElementById("priority").value,
        assignedTo: document.getElementById("assignedTo").value || "Sin asignar",
        estimatedTime: document.getElementById("estimatedTime").value, // Mostrar las horas estimadas
        status: "Pendent",
        image: imageFile ? imageFile.name : "No image"
    });

    console.log("Enviando datos a la API...");

    // Enviar los datos a la API con el formato multipart/form-data
    fetch("http://localhost:8080/steel/tasks", { 
        method: "POST",
        body: formData // El body es el FormData con todos los datos y archivos
    })
    .then(response => {
        console.log("Respuesta recibida del servidor:", response);
        if (!response.ok) {
            // Si la respuesta no es exitosa, mostrar un error
            return response.json().then(errorData => {
                console.log("Detalles del error recibido:", errorData);
                throw new Error("Error al crear la tarea. Por favor, intenta nuevamente.");
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Datos recibidos del servidor después de crear la tarea:", data);
        alert("Tarea creada exitosamente."); // Mostrar mensaje de éxito
        window.location.href = "tasks.html"; // Redirigir a la página de tareas
    })
    .catch(error => {
        // Mostrar mensaje de error en caso de fallo
        console.error("Error al crear la tarea:", error);
        alert(`Error: ${error.message}`);
    });
});
