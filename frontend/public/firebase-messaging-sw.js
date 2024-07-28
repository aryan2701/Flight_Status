importScripts('https://www.gstatic.com/firebasejs/9.8.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.8.3/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBRnyBcjmOo1x3hH1iGF8XRRdg_sXG9tjY",
  authDomain: "flightsupdates-9831a.firebaseapp.com",
  projectId: "flightsupdates-9831a",
  storageBucket: "flightsupdates-9831a.appspot.com",
  messagingSenderId: "332620022538",
  appId: "1:332620022538:web:bd544b87eec7e310d170f3",
  measurementId: "G-XLG2ETWJVR"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Test notification
self.addEventListener('install', (event) => {
  event.waitUntil(
    self.registration.showNotification('Test Notification', {
      body: 'This is a test notification',
      icon: '/firebase-logo.png'
    })
  );
});
