import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The optional chaining (?.) prevents a total crash if the key is missing
      // The replace() fixes the Render line-break issue
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
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
