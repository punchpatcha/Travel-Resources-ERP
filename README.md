

# TravelInventoryManagement
## Overview
Travel Inventory Management System is a web application developed to manage the inventory of vehicles, equipment, and staff for travel-related businesses. The application is designed to work across Android, iOS, and browsers, providing users with efficient tools to manage resources, bookings, and reports.

## Features
### Home (Dashboard)
- Current Availability: Displays resources that are available for use.
- Inventory Summary: Shows a summary of all resources in the system, including those in use.
- Low Stock Alert: Notifies users when resources are running low (fewer than 5 available).
- Upcoming Bookings: Shows pending bookings and allows users to update their statuses.
- Recent Activities: Displays recent activities in the system related to bookings.
  To start a local development server, run:

### Resource Management
Manage the resources available in the system, which include:

- Vehicles: Manage vehicles like cars, boats, and vans.
Add, edit, update, and delete vehicle details such as name, category, plate number, capacity, status, and maintenance dates.
- Equipment: Manage equipment such as cameras, microphones, and bags.
Add, edit, update, and delete equipment details.
- Staff: Manage staff members, including roles and availability.
Add, edit, update, and delete staff details such as name, role, and contact information.

### Booking Management
Handle bookings for resources with the following features:

- Add Booking: Users can add new bookings by selecting vehicles, equipment, and staff.
Set start and end dates and confirm booking status (Pending, Booked, In Use, Returned).
- Edit Booking: Users can edit booking details and update statuses.
- Update Booking: After editing, users can update the booking and resource statuses.
- Delete Booking: Users can delete bookings, and resources will be marked as available again.

### Report Generation
Generate monthly and yearly reports for bookings:

- Monthly Report: View bookings for a selected month in a specific year.
- Yearly Report: View all bookings for a selected year.

## Getting Started
### Prerequisites
Ensure you have the following installed:

- Node.js
- Express.js 
- MongoDB (for storing data)
- Postman (optional for testing API)
- VS code (for running code to development)

### Installation
- Clone the repository
git clone https://github.com/your-username/travel-inventory-management.git

- Navigate to the project directory:
 `cd travel-inventory-management `

-Install dependencies:
 `npm install `

- Run the development server:
 `npm start `

## Run the Angular App
In a separate terminal window, navigate to the Angular project directory and start the Angular development server:

cd path-to-angular-frontend 
 `ng serve` 
ypu will see http://localhost:4200

## Run the server
cd path-to-angular-frontend
cd backend
 `node server.js`
 you will see http://localhost:3000 server connected

## Usage
Once the server is running using  `node server.js `, navigate to http://localhost:4200 using  `ng serve ` to start using the system. You can:

- View the dashboard with an overview of resources.
- Manage inventory resources (vehicles, equipment, and staff).
- Make and manage bookings.
- Generate reports for a specific month or year
