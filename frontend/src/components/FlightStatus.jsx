// src/components/FlightStatus.jsx

import React, { useEffect, useState } from "react";
import "./FlightStatus.css"; // Import CSS for styling

const FlightStatus = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/flights");
        const data = await response.json();
        setFlights(data);
      } catch (error) {
        console.error("Error fetching flight data:", error);
      }
    };

    fetchFlights();
  }, []);

  return (
    <div className="flight-status-container">
      <h2>Flight Status</h2>
      <table className="flight-status-table">
        <thead>
          <tr>
            <th>Flight Number</th>
            <th>Status</th>
            <th>Destination</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.id}>
              <td>{flight.flight_number}</td>
              <td>{flight.status}</td>
              <td>{flight.destination}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlightStatus;
