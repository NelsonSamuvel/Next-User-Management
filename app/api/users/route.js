import { users } from "@/app/util/data";
import { NextResponse } from "next/server";
import fs from "fs";

export const GET = () => {
  const data = users;
  return NextResponse.json({ data });
};

export const POST = async (req) => {
  const { name, age, email, password } = await req.json();
  if (!name || !age || !email || !password) {
    return NextResponse.json(
      { error: "Please fill all the fields" },
      { status: 400 }
    );
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );
  }

  const id = (Number(users[users.length - 1].id) + 1).toString();
  const data = { id, name, age, email, password };
  users.push(data);
  const updatedUsers = JSON.stringify(users, null, 4);

  fs.writeFileSync(
    "./app/util/data.js",
    `export const users = ${updatedUsers}`,
    {
      encoding: "utf8",
    }
  );

  const resData = {
    id: data.id,
    name: data.name,
    age: data.age,
  };
  return NextResponse.json({
    data: resData,
    message: "Registered Successfully",
  });
};
