Backend Setup (Spring Boot)
The backend is a Spring Boot application.

Prerequisites
Java 17
Maven
PostgreSQL
Database Configuration
Create a PostgreSQL database:

SQL

CREATE DATABASE bookdb;
Ensure your application.properties (or application.yml) in the backend project is configured correctly for your PostgreSQL instance. It should look something like this:

Properties

spring.datasource.url=jdbc:postgresql://localhost:5432/bookdb
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
Note: Replace your_username and your_password with your PostgreSQL credentials.

Running the Backend
Clone the repository:

Bash

git clone https://github.com/trang1302/oop-project.git
cd oop-project/your-backend-directory # Navigate to your backend project root, e.g., 'oop-project/backend'
(Assuming your Spring Boot project is directly inside oop-project or in a subdirectory like backend or server).

Build and run the application using Maven:

Bash

mvn clean install
mvn spring-boot:run
The backend will start on http://localhost:8080.

API Documentation (Swagger UI)
Once the backend is running, you can access the API documentation via Swagger UI:
http://localhost:8080/swagger-ui.html

Frontend Setup (React)
The frontend is a React application.

Prerequisites
Node.js (LTS version recommended)
npm or Yarn
Installation
Navigate to the frontend directory:
Bash

cd oop-project/oop-fe # Assuming 'oop-fe' is your frontend directory
Install the dependencies:
Bash

npm install
# or
yarn install
Running the Frontend
Start the development server:
Bash

npm run dev
# or
yarn dev
The frontend will typically run on http://localhost:5173 (or another port if 5173 is in use).
Default Credentials
For initial testing, the application comes with default accounts:

Admin:
Username: admin
Password: admin
User:
Username: user
Password: user
API Endpoints Summary
Here's a quick overview of the main API endpoints:

Auth
POST /api/auth/register - Register a new user
POST /api/auth/login - User login (handled by Spring Security)
User Management (Admin)
GET /api/admin/users - Get all users
GET /api/admin/users/{id} - Get user by ID
DELETE /api/admin/users/{id} - Delete a user
PUT /api/admin/users/{id}/roles - Update user roles
Book Management
GET /api/books - Get all active books
GET /api/books/search?keyword=... - Search for books by name
GET /api/books/{id} - Get book details by ID
GET /api/books/{id}/read - Read/download a book
POST /api/books - Upload a new book (multipart form data)
Book Management (Admin)
PUT /api/admin/books/{id}/status?active=true|false - Activate or deactivate a book