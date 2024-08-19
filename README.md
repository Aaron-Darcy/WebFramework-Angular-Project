# Web Framework Development Project

## Overview
This project is part of the Web Framework Development module, focusing on creating a dynamic web application using Angular for the frontend and a REST API using Express for the backend. The project simulates a sports management system for the GAA NFL, allowing users to view teams, players, match results, and statistics.

## Project Structure
- **Web Framework Submission Docs**: Includes checklist for the project
- **Web Framework Code Folder**:
  - **Angular Project Directory**: `C:\Users\aaron\Desktop\Angular Project\Web Framework Code\a2ng_`
  - **REST API Directory**: `C:\Users\aaron\Desktop\Angular Project\Web Framework Code\a2restapi_`

### Angular Project (`a2ng_`)
This is the frontend of the application, built with Angular. It includes the following features:
- **Navigation Bar**: A consistent navigation bar implemented using Angular routing, styled with Bootstrap.
- **Teams Component**: Displays team data in a sortable table, fetches data using Angular Services, and includes links to the Wikipedia pages of the teams.
- **Players Component**: Shows players sorted by team and name, with a dropdown for filtering players by team.
- **Results Component**: Displays match results, with navigation between different rounds and filtering by team name.
- **Tables Component**: Shows standings for Division 1 teams, calculating values such as Points, Wins, Draws, Losses, and Goal Differences using JavaScript.
- **Stats Component**: Visualizes team performance using d3.js, including match scores and form, with scatter plots and bar charts.
- **Login Component**: Provides user authentication, updating the navigation bar upon login/logout.
- **Admin Component**: Allows admin users to edit and delete match results, with filters for rounds.

### REST API (`a2restapi_`)
The backend REST API is built with Express and connected to a SQL database. It includes the following endpoints:
- `GET /teams`: Retrieves team data.
- `GET /players`: Retrieves player data.
- `GET /results`: Retrieves match results.
- `GET /results/:round`: Retrieves match results for a specific round.

## Setup Instructions

### Prerequisites
- **Node.js**: Ensure you have Node.js installed. It includes npm, which is required to install dependencies.
- **MySQL**: Ensure You have MYSQL Set up & run the provided script. 

## Installation 
#### REST API 
1. Navigate to the REST API directory:
  `cd \Web Framework Code\a2restapi_"`
2. Install the necessary dependencies:
   `npm install`
3. Start the REST API server:
   `node index.js`
#### Angular Frontend 
1. Navigate to the Angular project directory:
   `cd \Web Framework Code\a2ng_"`
3. Install Angular dependencies:
   `npm install`
3. Run the Angular development server:
   `ng serve`
The application will be accessible at `http://localhost:4200/`.

# Images
![image](https://github.com/user-attachments/assets/fcf4072f-830f-4510-9e68-594d749fc2a9)
![image](https://github.com/user-attachments/assets/5d8ec0c9-9408-4e51-a154-bd3bb5266a6e)
![image](https://github.com/user-attachments/assets/9903c61a-2f77-4485-afec-6f964100fa2b)
![image](https://github.com/user-attachments/assets/a3ba54bd-4985-4f26-98ff-d4175b3eef49)
![image](https://github.com/user-attachments/assets/c4dc2cf6-5a0e-44b2-be14-823dd22a037c)
![image](https://github.com/user-attachments/assets/d0148508-fabd-42ce-9b7a-251ef37672f0)
![image](https://github.com/user-attachments/assets/bab388ab-3570-43d3-bc09-734734bd6a3c)





