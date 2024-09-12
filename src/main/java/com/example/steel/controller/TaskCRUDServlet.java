package com.example.steel.controller;

import com.example.steel.dao.TaskDAO;
import com.example.steel.model.Task;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;  // Importar List


public class TaskCRUDServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
    
        try {
            // Aquí llamamos al método del DAO para obtener todas las tareas
            List<Task> tasks = TaskDAO.getAllTasks(); // Este método debería devolver una lista de tareas
            out.println("[");
            for (int i = 0; i < tasks.size(); i++) {
                Task task = tasks.get(i);
                out.println("{");
                out.println("\"id\": " + task.getId() + ",");
                out.println("\"title\": \"" + task.getTitle() + "\",");
                out.println("\"description\": \"" + task.getDescription() + "\"");
                if (i < tasks.size() - 1) {
                    out.println("},");
                } else {
                    out.println("}");
                }
            }
            out.println("]");
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

        String title = request.getParameter("title");
        String description = request.getParameter("description");

        System.out.println("Título recibido: " + title);
        System.out.println("Descripción recibida: " + description);

        if (title == null || title.isEmpty() || description == null || description.isEmpty()) {
            out.println("{ \"error\": \"Todos los campos (title, description) son requeridos\" }");
            return;
        }

        try {
            Task task = new Task();
            task.setTitle(title);
            task.setDescription(description);
            TaskDAO.createTask(task);

            out.println("{ \"message\": \"Tarea creada correctamente\" }");
        } catch (Exception e) {
            e.printStackTrace();
            out.println("{ \"error\": \"Ocurrió un error: " + e.getMessage() + "\" }");
        } finally {
            out.close();
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String idParam = request.getParameter("id");
        String title = request.getParameter("title");
        String description = request.getParameter("description");

        if (idParam == null || idParam.isEmpty() || title == null || title.isEmpty() || description == null || description.isEmpty()) {
            out.println("{ \"error\": \"Todos los campos (id, title, description) son requeridos\" }");
            return;
        }

        try {
            int id = Integer.parseInt(idParam);
            Task task = new Task(id, title, description);
            TaskDAO.updateTask(task);

            out.println("{ \"message\": \"Tarea actualizada exitosamente\" }");
        } catch (NumberFormatException e) {
            out.println("{ \"error\": \"El ID debe ser un número válido.\" }");
        } catch (Exception e) {
            e.printStackTrace();
            out.println("{ \"error\": \"Ocurrió un error: " + e.getMessage() + "\" }");
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
