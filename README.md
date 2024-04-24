# inventory_backend
# Inventory Management System

![](https://github.com/HenryAugustiano/inventory_frontend) [Frontend Repository](https://github.com/HenryAugustiano/inventory_frontend)  
![](https://github.com/HenryAugustiano/inventory_backend) [Backend Repository](https://github.com/HenryAugustiano/inventory_backend)

## Description
This project is an inventory management system created using the MERN stack (MongoDB, Express.js, React, Node.js).
It allows users to manage inventory, track products sales, view sales report using chart, find nearby businesses that need the products.

![Homepage](/imgs/home.png)
<br>
<br>
![Inventory](/imgs/inventory.png)


## Features
- CRUD operations for products via REST API
- User authentication and authorization using JWT tokens
- Reporting and analytics
- Integration with external APIs (Local Business Finder)
- many more!

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/HenryAugustiano/inventory_backend.git
   ```
2. Install Dependencies
    ```
    cd inventory_backend
    npm install
    ```
3. Configure environment variables:
   ```
    PORT=3000
    MONGO_URI
    SECRET_KEY
    ```
4. Run server
   ```
   node index.js
   ```
