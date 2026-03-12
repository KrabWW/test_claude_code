import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskStatus, TaskPriority } from "@prisma/client";

import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const where: Prisma.TaskWhereInput = {};

    if (status && ["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
      where.status = status as TaskStatus;
    }

    if (priority && ["LOW", "MEDIUM", "HIGH"].includes(priority)) {
      where.priority = priority as TaskPriority;
    }

    const orderBy: Prisma.TaskOrderByWithRelationInput = {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    };

    const tasks = await prisma.task.findMany({
      where,
      orderBy,
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

interface CreateTaskBody {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CreateTaskBody = await request.json();

    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json(
        { error: "title is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title: body.title.trim(),
        description: body.description?.trim() || null,
        status: body.status || TaskStatus.TODO,
        priority: body.priority || TaskPriority.MEDIUM,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
