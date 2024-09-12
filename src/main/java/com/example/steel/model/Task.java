package com.example.steel.model;

import javax.persistence.*;

@Entity
@Table(name = "tasks")  // Mapea la entidad a la tabla "tasks"
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "priority", nullable = false)
    private String priority;

    @Column(name = "assigned_to")
    private String assignedTo;

    @Column(name = "estimated_time", nullable = false)
    private int estimatedTime;

    @Column(name = "status", nullable = false)
    private String status = "Pendent"; // Siempre comienza como "Pendent"

    @Column(name = "image_path")  // Asegurar que el nombre de la columna sea "image_path"
    private String image;

    @Column(name = "project", nullable = false)  // Nuevo campo para el proyecto
    private String project;

    // Constructor por defecto
    public Task() {
    }

    // Constructor con todos los campos, incluyendo imagen y proyecto
    public Task(String title, String description, String priority, String assignedTo, int estimatedTime, String status, String image, String project) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.assignedTo = assignedTo;
        this.estimatedTime = estimatedTime;
        this.status = status;
        this.image = image;
        this.project = project;
    }

    // Getters y setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public int getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(int estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }
}
