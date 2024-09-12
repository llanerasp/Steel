package com.example.steel.controller;

import com.example.steel.dao.TaskDAO;
import com.example.steel.model.Task;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import com.google.gson.Gson;



@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 2, // 2MB
        maxFileSize = 1024 * 1024 * 10, // 10MB
        maxRequestSize = 1024 * 1024 * 50) // 50MB
public class TaskCRUDServlet extends HttpServlet {

    // Ruta donde se guardarán las imágenes
    private static final String UPLOAD_DIRECTORY = "resources/images";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
    
        try {
            // Obtener el ID de la tarea desde la URL si está presente
            String pathInfo = request.getPathInfo();
    
            if (pathInfo != null && pathInfo.length() > 1) {
                // Si el path contiene un ID, obtener una tarea específica
                String idParam = pathInfo.substring(1); // Extrae el ID de la URL /tasks/{id}
                int id = Integer.parseInt(idParam);
    
                // Obtener la tarea por ID
                Task task = TaskDAO.getTaskById(id);
                if (task != null) {
                    // Convertir la tarea a JSON y devolverla
                    out.println("{");
                    out.println("\"id\": " + task.getId() + ",");
                    out.println("\"title\": \"" + task.getTitle() + "\",");
                    out.println("\"description\": \"" + task.getDescription() + "\",");
                    out.println("\"priority\": \"" + task.getPriority() + "\",");
                    out.println("\"assignedTo\": \"" + task.getAssignedTo() + "\",");
                    out.println("\"estimatedTime\": " + task.getEstimatedTime() + ",");
                    out.println("\"status\": \"" + task.getStatus() + "\",");
                    out.println("\"image\": \"" + (task.getImage() != null ? task.getImage() : "") + "\",");
                    out.println("\"project\": \"" + task.getProject() + "\"");
                    out.println("}");
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.println("{ \"error\": \"Tarea no encontrada\" }");
                }
            } else {
                // Si no hay ID en la URL, devolver todas las tareas
                List<Task> tasks = TaskDAO.getAllTasks();
                out.println("[");
                for (int i = 0; i < tasks.size(); i++) {
                    Task task = tasks.get(i);
                    out.println("{");
                    out.println("\"id\": " + task.getId() + ",");
                    out.println("\"title\": \"" + task.getTitle() + "\",");
                    out.println("\"description\": \"" + task.getDescription() + "\",");
                    out.println("\"priority\": \"" + task.getPriority() + "\",");
                    out.println("\"assignedTo\": \"" + task.getAssignedTo() + "\",");
                    out.println("\"estimatedTime\": " + task.getEstimatedTime() + ",");
                    out.println("\"status\": \"" + task.getStatus() + "\",");
                    out.println("\"image\": \"" + (task.getImage() != null ? task.getImage() : "") + "\",");
                    out.println("\"project\": \"" + task.getProject() + "\"");
                    if (i < tasks.size() - 1) {
                        out.println("},");
                    } else {
                        out.println("}");
                    }
                }
                out.println("]");
            }
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("{ \"error\": \"ID inválido\" }");
        } catch (Exception e) {
            e.printStackTrace();
            out.println("{ \"error\": \"Error al obtener las tareas: " + e.getMessage() + "\" }");
        } finally {
            out.close();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        request.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            String title = request.getParameter("title");
            String description = request.getParameter("description");
            String priority = request.getParameter("priority");
            String assignedTo = request.getParameter("assignedTo");
            String estimatedTimeStr = request.getParameter("estimatedTime");
            String project = request.getParameter("project");  // Campo para el proyecto
            String status = "Pendent"; // Siempre será "Pendent" al crear

            System.out.println("Título: " + title);
            System.out.println("Descripción: " + description);
            System.out.println("Prioridad: " + priority);
            System.out.println("Asignado a: " + assignedTo);
            System.out.println("Tiempo estimado: " + estimatedTimeStr);
            System.out.println("Proyecto: " + project); // Mostrar el proyecto

            // Verificar si hay una imagen adjunta
            String imagePath = null;
            Part imagePart = request.getPart("image");
            if (imagePart != null && imagePart.getSize() > 0) {
                imagePath = saveImage(request, imagePart);
                System.out.println("Imagen guardada en: " + imagePath);
            } else {
                System.out.println("No se adjuntó imagen.");
            }

            // Verificación de campos obligatorios
            if (title == null || title.isEmpty() || description == null || description.isEmpty() || 
                priority == null || priority.isEmpty() || estimatedTimeStr == null || estimatedTimeStr.isEmpty() ||
                project == null || project.isEmpty()) {  // Asegurar que el proyecto sea obligatorio
                out.println("{ \"error\": \"Todos los campos (title, description, priority, estimatedTime, project) son requeridos\" }");
                return;
            }

            int estimatedTime = Integer.parseInt(estimatedTimeStr);

            // Crear una nueva tarea
            Task task = new Task();
            task.setTitle(title);
            task.setDescription(description);
            task.setPriority(priority);
            task.setAssignedTo(assignedTo != null ? assignedTo : "Sin asignar");
            task.setEstimatedTime(estimatedTime);
            task.setStatus(status);
            task.setImage(imagePath);
            task.setProject(project);  // Guardar el nombre del proyecto

            TaskDAO.createTask(task);

            out.println("{ \"message\": \"Tarea creada correctamente\" }");

        } catch (NumberFormatException e) {
            out.println("{ \"error\": \"El tiempo estimado debe ser un número válido.\" }");
            e.printStackTrace();
        } catch (Exception e) {
            out.println("{ \"error\": \"Error inesperado al crear la tarea: " + e.getMessage() + "\" }");
            e.printStackTrace();
        } finally {
            out.close();
        }
    }

    // Método para guardar la imagen en la carpeta /resources/images
    private String saveImage(HttpServletRequest request, Part imagePart) throws IOException {
        String uploadPath = getServletContext().getRealPath("") + File.separator + UPLOAD_DIRECTORY;
        
        // Crear la carpeta si no existe
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Guardar el archivo de imagen
        String fileName = imagePart.getSubmittedFileName();
        String fullPath = uploadPath + File.separator + fileName;
        imagePart.write(fullPath);

        // Retornar la ruta relativa de la imagen
        return UPLOAD_DIRECTORY + File.separator + fileName;
    }

    @Override
protected void doPut(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    PrintWriter out = response.getWriter();

    // Leer el cuerpo JSON
    StringBuilder sb = new StringBuilder();
    try (BufferedReader reader = request.getReader()) {
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
    }
    String jsonString = sb.toString();
    System.out.println("Datos JSON recibidos en el PUT: " + jsonString);

    // Parsear el JSON a un objeto Task usando una librería como Gson
    Gson gson = new Gson();
    Task updatedTask = gson.fromJson(jsonString, Task.class);

    // Verificar que se recibieron los datos necesarios
    if (updatedTask.getId() == 0 || updatedTask.getTitle() == null || updatedTask.getDescription() == null ||
        updatedTask.getPriority() == null || updatedTask.getEstimatedTime() == 0 || updatedTask.getStatus() == null || 
        updatedTask.getProject() == null) {
        out.println("{ \"error\": \"Todos los campos (id, title, description, priority, estimatedTime, status, project) son requeridos\" }");
        return;
    }

    // Actualizar la tarea en la base de datos
    try {
        TaskDAO.updateTask(updatedTask);
        out.println("{ \"message\": \"Tarea actualizada exitosamente\" }");
    } catch (Exception e) {
        e.printStackTrace();
        out.println("{ \"error\": \"Error al actualizar la tarea: " + e.getMessage() + "\" }");
    } finally {
        out.close();
    }
}

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            int id = Integer.parseInt(request.getParameter("id"));
            TaskDAO.deleteTask(id);
            response.getWriter().write("{ \"message\": \"Tarea eliminada exitosamente.\" }");
        } catch (NumberFormatException e) {
            response.getWriter().write("{ \"error\": \"El ID debe ser un número válido.\" }");
        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().write("{ \"error\": \"Error al eliminar la tarea.\" }");
        }
    }
}
