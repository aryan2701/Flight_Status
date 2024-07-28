// src/App.jsx

import React, { useEffect, useState } from "react";
import FlightStatus from "./components/FlightStatus";
import { messaging, getToken, onMessage } from "./firebaseConfig";
import "./App.css";
import Navbar from "./components/Navbar";

const App = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    // Fetch flight status data from the backend
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

    // Register Service Worker for FCM and then fetch the FCM token
    const registerServiceWorkerAndFetchToken = async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );

        const token = await getToken(messaging, {
          vapidKey:
            "BKNuWyL0xpyHtCtVKR8zeWYrZ948fTU1feTOQhBtnL57jSKFW8tP5IRqG43J70breuiKuI_0DIcvBgJZHGXulyA",
          serviceWorkerRegistration: registration,
        });

        if (token) {
          console.log("FCM Token:", token);
          // Optionally send the token to your server to store it
        } else {
          console.warn("No FCM token received.");
        }
      } catch (error) {
        console.error("Error getting FCM token:", error);
      }
    };

    registerServiceWorkerAndFetchToken();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received: ", payload);
      if (Notification.permission === "granted") {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: "/firebase-logo.png",
        });
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <div className="App">
      <Navbar></Navbar>
      <h1>Flight Status Notifications</h1>
      <FlightStatus flights={flights} />
    </div>
  );
};

export default App;
