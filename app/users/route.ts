
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);
    
    if (querySnapshot.empty) {
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }

    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}