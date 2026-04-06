import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

try {
  // Instead of reading a file, we build the credentials from your .env variables
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // The replace function is CRUCIAL so Render reads the newlines in the key correctly
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  // Initialize Firebase
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("Firebase Admin SDK Initialized Successfully");
} catch (error) {
  console.error(
    "🔥 Firebase Setup Error: Could not load credentials from environment variables.",
  );
  console.error(error.message);
  process.exit(1);
}

export default admin;
