// firebase.js
const admin = require("firebase-admin");

// Parse JSON từ biến môi trường
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://trello-app-2ebad.firebaseio.com",
});

module.exports = { db: admin.database() };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = db;
