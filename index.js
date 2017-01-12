// Imports
const admin = require("firebase-admin");
const serviceAccount = require("./credentials.json");
const config = require("./config.json");

// Setup
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://limits-4ac8f.firebaseio.com/"
});

console.log(`App launched - ${new Date()}`);

// Run
app.database().ref("lookups/driver").on("child_changed", () => {});
app.database().ref("lookups/trip").on("child_changed", () => {});
app.database().ref("users").on("child_changed", () => {});

const now = new Date();
console.log(`Just wait now...until at least ${new Date(now.setTime(now.getTime() + 3900000))}`);  // Wait 65 minutes from now