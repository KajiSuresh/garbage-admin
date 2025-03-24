import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";

/**
 * Logs in a user with email and password.
 * @param email - User's email address.
 * @param password - User's password.
 * @returns The authenticated user object.
 * @throws Error if login fails.
 */
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    console.log("User logged in successfully:", user);

    return user;
  } catch (error: any) {
    let errorMessage = "An error occurred while logging in.";
    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "No user found with this email.";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password.";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address.";
        break;
      default:
        errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};