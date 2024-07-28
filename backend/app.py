from flask import Flask, jsonify, request, Response
import psycopg2
import pika # type: ignore
import firebase_admin # type: ignore
from firebase_admin import credentials, messaging # type: ignore
from flask_cors import CORS
import threading

app = Flask(__name__)

# Enable CORS for all origins (adjust as needed)
CORS(app)

# Database connection parameters
DB_HOST = 'localhost'
DB_NAME = 'flightstatusdb'
DB_USER = 'postgres'
DB_PASSWORD = 'admin123'  # Replace with your PostgreSQL password

# Connect to PostgreSQL
def get_db_connection():
    try:
        conn = psycopg2.connect(host=DB_HOST, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

# RabbitMQ connection parameters
RABBITMQ_HOST = 'localhost'
RABBITMQ_QUEUE = 'flight_notifications'

# Firebase Admin SDK setup
cred = credentials.Certificate('C:/Users/hp/Desktop/INDIGO/flight-status-notifications/backend/flightsupdates-9831a-firebase-adminsdk-rn3bj-4454cc3b1e.json')
firebase_admin.initialize_app(cred)

# Send notification to RabbitMQ
def send_notification(message):
    try:
        print(f"Sending message to RabbitMQ: {message}")
        connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
        channel = connection.channel()
        channel.queue_declare(queue=RABBITMQ_QUEUE)
        channel.basic_publish(exchange='', routing_key=RABBITMQ_QUEUE, body=message)
        connection.close()
    except Exception as e:
        print(f"Error sending message to RabbitMQ: {e}")

# Send notification to Firebase Cloud Messaging (using device tokens)
def send_firebase_notification(token, title, body):
    try:
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            token=token  # Send to a specific device using its token
        )
        response = messaging.send(message)
        print('Successfully sent message to Firebase:', response)
    except Exception as e:
        print(f"Error sending notification to Firebase: {e}")

@app.route('/flights', methods=['GET'])
def get_flights():
    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cur = conn.cursor()
        cur.execute('SELECT id, flight_number, status, destination FROM flights')
        flights = cur.fetchall()
        cur.close()

        # Convert flight data to JSON format including destination
        flights_list = [
            {'id': flight[0], 'flight_number': flight[1], 'status': flight[2], 'destination': flight[3]}
            for flight in flights
        ]
        return jsonify(flights_list)
    except Exception as e:
        print(f"Error fetching flights: {e}")
        return jsonify({'error': 'Failed to fetch flights'}), 500
    finally:
        conn.close()

@app.route('/update_status', methods=['POST'])
def update_status():
    flight_number = request.json.get('flight_number')
    new_status = request.json.get('status')
    token = request.json.get('token')  # Get the FCM token from the request

    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor()
        cursor.execute('UPDATE flights SET status = %s WHERE flight_number = %s', (new_status, flight_number))
        conn.commit()
        cursor.close()

        # Construct and send notification message
        notification_message = f'Flight {flight_number} status updated to {new_status}'
        send_notification(notification_message)
        print(f"Notification sent: {notification_message}")

        # Send notification to Firebase
        if token:  # Only send notification if token is provided
            send_firebase_notification(
                token,
                title='Flight Status Update',
                body=f'Flight {flight_number} status updated to {new_status}'
            )

        return jsonify({'status': 'success'})
    except Exception as e:
        print(f"Error updating flight status: {e}")
        return jsonify({'error': 'Failed to update flight status'}), 500
    finally:
        conn.close()

@app.route('/consume_notifications', methods=['GET'])
def consume_notifications():
    def callback(ch, method, properties, body):
        print(f"Received message: {body.decode()}")

    def start_consuming():
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
            channel = connection.channel()
            channel.queue_declare(queue=RABBITMQ_QUEUE)
            channel.basic_consume(queue=RABBITMQ_QUEUE, on_message_callback=callback, auto_ack=True)
            
            print('Waiting for messages. To exit press CTRL+C')
            channel.start_consuming()
        except Exception as e:
            print(f"Error consuming RabbitMQ messages: {e}")

    thread = threading.Thread(target=start_consuming)
    thread.daemon = True  # Ensure thread exits when the main program exits
    thread.start()

    return Response("Started consuming RabbitMQ messages in the background.", status=200)

@app.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "API is running"}), 200

if __name__ == '__main__':
    app.run(debug=True)
