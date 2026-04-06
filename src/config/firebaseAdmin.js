import admin from "firebase-admin";
import fs from "fs";

try {
  // In ES Modules, the cleanest way to read a relative file is using import.meta.url
  const serviceAccountPath = new URL("../../../firebase-service-account.json", import.meta.url);
  
  // Read and parse the JSON file
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

  // Initialize Firebase
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log("Firebase Admin SDK Initialized Successfully");

} catch (error) {
  console.error("🔥 Firebase Setup Error: Could not find or read the service account JSON file.");
  console.error(error.message);
  process.exit(1); // Stop the server from starting if Firebase fails
}

// Export it at the bottom, AFTER it has been initialized
export default admin;