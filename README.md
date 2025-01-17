![image](https://github.com/user-attachments/assets/a979d079-d96a-4ac4-8b98-d94e4bd13abe)


## Overview

GRG_ADMIN is a React-based application built with **Vite**, a modern web development build tool. It serves as the administrative interface for **RockyGo**, allowing admins to manage orders, riders, and their associated information. The application features a robust set of functionalities, including user authentication, dynamic filtering, pagination, and dynamic error messages.  

The backend is powered by **Laravel**, which handles server-side pagination, search queries, and authentication. The frontend communicates with the backend via API requests.  

## Features  
- **User Authentication**:  
  - Secure login and registration system integrated with Laravel backend.  
  - Token-based authorization for protected routes.  
  - Dynamic error message handling for authentication forms (e.g., invalid credentials, email already in use).  

- **User Registration:**
    - Supports additional fields like first_name and last_name for user profiles.
    - Validates inputs dynamically (e.g., missing fields, invalid email formats).
    - Disables form submission until all required fields are filled.
    - Displays backend-sent error messages for registration issues (e.g., email already in use).

- **Order Management**:  
  - View all orders with detailed information.  
  - Filter orders based on specific criteria (e.g., status, date range).  
  - Server-side pagination for efficient data loading.  
  - Dynamic URL parameter validation and error handling.
  - Caching for recently accessed data.  

- **Rider Management**:  
  - View rider profiles and their associated orders.  
  - Search and filter riders dynamically.  
  - Server-side pagination for riders and rider orders.
  - Dynamic URL parameter validation and error handling.  
  - Caching for recently accessed data.  

- **Alert Messages**:  
  - Display dynamic alert messages sent from the backend (e.g., success, error, warnings).  
  - Toast notifications for user feedback.  

- **Responsive Design**:  
  - Built with **Tailwind CSS** for a clean and responsive user interface.  
  - Redesigned scrollbar and layout adjustments for better user experience.  

- **Modular Code Structure**:  
  - Separate components for each feature, ensuring maintainability and scalability.  
  - Refactored code with inline comments for improved readability.  

## Technologies Used  
- **Frontend**:  
  - React: Front-end library for building user interfaces.  
  - Vite: Build tool for fast and efficient development.  
  - Tailwind CSS: Utility-first CSS framework for styling. 
  - Material Tailwind: Open-source UI library that uses Tailwind CSS. 
  - React Router: Library for client-side routing.  
  - Axios: Library for making HTTP requests to the Laravel backend.  
  - Lucide: Icon library for visually appealing icons.  

- **Backend**:  
  - Laravel: PHP framework for server-side logic, authentication, and API handling.  
  - Server-side pagination and search queries for optimized performance.  

## Installation  
To set up the application locally, follow these steps:  

1. **Clone the repository**:  
   ```bash  
   git clone https://github.com/myco27/grg_admin  
   ```  

2. **Navigate to the project directory (this varies depending on the root folder)**:  
   ```bash  
   cd grg_admin  
   ```  

3. **Install dependencies**:  
   ```bash  
   npm install  
   ```  

4. **Set up the backend**:  
   - Ensure the Laravel backend is running and accessible.
      ```bash
      php artisan serve
      ```

   - Start the Apache and MySQL processes via XAMPP.
   
   - Update the API baseURL by setting configuring the `.env` file.
      ```bash
      VITE_BASE_URL=https://api.example.com
      ```   

5. **Start the development server**:  
   ```bash  
   npm run dev  
   ```  

6. **Access the application**:  
   Open a web browser and navigate to `http://localhost:5173`.
