import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    const users = await User.find({});
    return NextResponse.json({ users });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const user = await User.create(body);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const { id, ...updateData } = body;

    const user = await User.findOneAndUpdate({ id: id }, updateData, {
      new: true,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const user = await User.findOneAndDelete({ id: parseInt(id) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
