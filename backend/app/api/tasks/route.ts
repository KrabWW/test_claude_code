import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskStatus, TaskPriority } from "@prisma/client";

import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
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
