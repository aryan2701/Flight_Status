# Flight Status Notifications System

## Overview
This project is a full-stack application designed to provide real-time flight status updates and notifications to passengers. It uses a combination of Flask for the backend, PostgreSQL for the database, RabbitMQ for messaging, and Firebase Cloud Messaging (FCM) for push notifications. The frontend is built with React.js.

## Features
- **Real-Time Flight Status Updates**: Fetch and display the latest flight status information.
- **Push Notifications**: Receive real-time notifications about flight status changes using FCM.
- **Background Notifications**: Notifications are displayed even when the web app is not in the foreground.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Flask (Python)
- **Database**: PostgreSQL
- **Messaging**: RabbitMQ
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Service Worker**: Firebase Messaging Service Worker

## Demo Video
Watch the demo video [here](https://www.youtube.com/watch?v=oXTyY2w_c0Y).

## Installation

### Backend Setup
1. **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd flight-status-notifications/backend
    ```

2. **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4. **Configure PostgreSQL:**
    Ensure PostgreSQL is installed and create a database named `flightstatusdb`. Update the `DB_PASSWORD` in `app.py` with your PostgreSQL password.

5. **Configure Firebase:**
    Place your Firebase Admin SDK service account key at `C:/Users/hp/Desktop/INDIGO/flight-status-notifications/backend/flightsupdates-9831a-firebase-adminsdk-rn3bj-4454cc3b1e.json`.

6. **Run the Flask app:**
    ```bash
    python app.py
    ```

7. **Start RabbitMQ:**
    Make sure RabbitMQ is running on localhost.

### Frontend Setup
1. **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configure Firebase:**
    Ensure the `firebaseConfig` in `src/firebase-messaging-sw.js` is updated with your Firebase project configuration.

4. **Start the React app:**
    ```bash
    npm start
    ```

## Usage
- **Fetch Flight Status:**
    Access the `/flights` endpoint on the backend to get a list of flights and their statuses.

- **Update Flight Status:**
    Use the `/update_status` endpoint to update a flight's status. Include `flight_number`, `status`, and optionally, an FCM token in the request body.

- **Consume Notifications:**
    Visit `/consume_notifications` to start consuming RabbitMQ messages in the background.

- **Frontend Interaction:**
    Use the frontend application to view flight status and receive push notifications.

## Service Worker
The service worker is located in `public/firebase-messaging-sw.js` and is responsible for handling background notifications.

## Troubleshooting
- **Database Connection Errors:**
    Check PostgreSQL connection parameters and ensure the database is running.

- **Notification Issues:**
    Verify Firebase configuration and check if notification permissions are granted in the browser.

- **RabbitMQ Issues:**
    Ensure RabbitMQ server is running and accessible.
