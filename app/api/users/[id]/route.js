import { users } from "@/app/util/data";
import { NextResponse } from "next/server";
import fs from "fs";

export const GET = async (_, res) => {
  const { id } = await res.params;
  const data = users.find((user) => user.id === id);
  if (!data) {
    return NextResponse.json(
      { message: `No user found on the id #${id}` },
      { status: 400 }
    );
  }
  return NextResponse.json({ data });
};

export const PUT = async (req, res) => {
  const { id } = await res.params;
  const { name, age, email } = await req.json();

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  users[userIndex].name = name || users[userIndex].name;
  users[userIndex].age = age || users[userIndex].age;
  users[userIndex].email = email || users[userIndex].email;

  const updatedUser = users;

  const userData = JSON.stringify(updatedUser, null, 2);
  fs.writeFileSync("./app/util/data.js", `export const users = ${userData}`, {
    encoding: "utf8",
  });

  const resData = { name, age, email };

  return NextResponse.json({
    data: resData,
    message: "User data updated successfully",
  });
};

export const DELETE = async (_, res) => {
  const { id } = await res.params;
  if (!id) {
    return NextResponse.json({ error: "Id not provided" }, { status: 400 });
  }

  const isExisting = users.some((user) => user.id === id);
  if (!isExisting) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const filteredData = users.filter((user) => user.id !== id);

  const updatedData = JSON.stringify(filteredData, null, 2);

  fs.writeFileSync(
    "./app/util/data.js",
    `export const users = ${updatedData}`,
    {
      encoding: "utf8",
    }
  );

  return NextResponse.json({ message: "User deleted successfully" });
};
