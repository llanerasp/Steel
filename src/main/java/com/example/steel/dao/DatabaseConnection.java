package com.example.steel.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    private static final String URL = "jdbc:postgresql://localhost:5432/steel_db";
    private static final String USER = "llanerasp";  // Usuario correcto
    private static final String PASSWORD = "Cocacolafanta123";  // Reemplaza con tu contraseña

    // Bloque estático para cargar explícitamente el controlador JDBC
    static {
        try {
            // Cargar explícitamente el driver JDBC de PostgreSQL
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("Error al cargar el controlador de PostgreSQL.");
            e.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        Connection connection = null;
        try {
            connection = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Conexión establecida: " + (connection != null));
        } catch (SQLException e) {
            System.err.println("Error al intentar conectar a la base de datos.");
            throw e;
        }
        return connection;
    }

    // Método principal para probar la conexión
    public static void main(String[] args) {
        try (Connection connection = getConnection()) {
            if (connection != null) {
                System.out.println("Conexión exitosa a la base de datos!");
            } else {
                System.out.println("Fallo en la conexión a la base de datos.");
            }
        } catch (SQLException e) {
            System.err.println("Excepción SQL: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
