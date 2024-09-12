package com.example.steel.controller;

import com.example.steel.dao.DatabaseConnection;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class DatabaseTestServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try (Connection connection = DatabaseConnection.getConnection()) {
            if (connection != null) {
                out.println("<h1>Conexión exitosa a la base de datos PostgreSQL!</h1>");
            } else {
                out.println("<h1>Fallo en la conexión a la base de datos.</h1>");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            out.println("<h1>Error en la conexión: " + e.getMessage() + "</h1>");
        }
    }
}
