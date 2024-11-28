import { users } from "@/app/util/data";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Please Fill all the fields" },
      { status: 400 }
    );
  }

  const existingUser = users.find((user) => user.email === email);
  if (!existingUser) {
    return NextResponse.json(
      {
        error: "Email Not found Create a new Account",
      },
      { status: 404 }
    );
  }

  if (password === existingUser.password) {
    const data = { username: existingUser.name, email: existingUser.email };
    return NextResponse.json({ data, message: "Logged In successfully" });
  } else {
    return NextResponse.json(
      { error: "Password does not match" },
      { status: 400 }
    );
  }
};
