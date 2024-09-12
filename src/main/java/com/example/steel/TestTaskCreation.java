package com.example.steel;

import com.example.steel.dao.TaskDAO;
import com.example.steel.model.Task;

public class TestTaskCreation {
    public static void main(String[] args) {
        // Crear una nueva tarea
        Task newTask = new Task();
        newTask.setTitle("Tarea de Prueba con Hibernate");
        newTask.setDescription("Descripción de la tarea de prueba con Hibernate");

        // Llamar al método createTask para guardar la tarea en la base de datos
        TaskDAO.createTask(newTask);

        System.out.println("Tarea creada con éxito usando Hibernate.");
    }
}
