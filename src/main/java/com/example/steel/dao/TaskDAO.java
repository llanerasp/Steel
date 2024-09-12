package com.example.steel.dao;

import com.example.steel.model.Task;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;


import java.util.List;

public class TaskDAO {

    // Crear EntityManagerFactory para manejar las operaciones con Hibernate/JPA
    private static EntityManagerFactory entityManagerFactory =
            Persistence.createEntityManagerFactory("steelUnit");

    // Método para crear una nueva tarea
    public static void createTask(Task task) {
        EntityManager em = entityManagerFactory.createEntityManager();
        em.getTransaction().begin();
        em.persist(task);  // Guardar la tarea en la base de datos
        em.getTransaction().commit();
        em.close();
    }

    // Método para obtener todas las tareas usando JPA/Hibernate (sin SQL directo)
    public static List<Task> getAllTasks() {
        EntityManager em = entityManagerFactory.createEntityManager();
        List<Task> tasks = em.createQuery("SELECT t FROM Task t", Task.class).getResultList();
        em.close();
        return tasks;
    }

    // Método para actualizar una tarea
    public static void updateTask(Task task) {
        EntityManager em = entityManagerFactory.createEntityManager();
        em.getTransaction().begin();
        em.merge(task);  // Actualizar la tarea en la base de datos
        em.getTransaction().commit();
        em.close();
    }

    // Método para eliminar una tarea
    public static void deleteTask(int id) {
        EntityManager em = entityManagerFactory.createEntityManager();
        em.getTransaction().begin();
        Task task = em.find(Task.class, id);  // Encontrar la tarea por ID
        if (task != null) {
            em.remove(task);  // Eliminar la tarea
        }
        em.getTransaction().commit();
        em.close();
    }

    // Método corregido para obtener una tarea por su ID usando EntityManager
    public static Task getTaskById(int id) {
        EntityManager em = entityManagerFactory.createEntityManager();
        Task task = em.find(Task.class, id);  // Buscar la tarea por ID usando JPA
        em.close();
        return task;
    }
}
