import { PrismaClient, TaskStatus } from ".prisma/client";
import { Router } from "express";
import authorization from "../middlewares/auth";

const taskRouter = Router();
const prisma = new PrismaClient();

enum FormType {
  completed = "Completed",
  incomplete = "Incomplete",
}
const checkIfTaskOwner = async (
  taskId: number,
  ownerId: Record<string, any>
) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    select: {
      created_by: true,
    },
  });
  if (!task) return false;
  if (task.created_by === ownerId.toString()) {
    return true;
  }
  return false;
};
taskRouter.post("/create-task", authorization, async (req, res) => {
  try {
    const userId = req.user.toString();
    const { description, due_date, project_associated } = req.body;
    if (!userId)
      return res.send({
        success: false,
        message: "You aren't allowed to be here.",
        data: null,
      });
    await prisma.task.create({
      data: {
        description,
        due_date,
        project_associated,
        created_by: userId,
      },
    });
    return res.send({
      success: true,
      message: "Successfully created a new task.",
      data: null,
    });
  } catch (error) {
    console.log(error);
  }
});

taskRouter.get("/list-tasks", authorization, async (req, res) => {
  try {
    const userId = req.user;
    if (!userId)
      return res.send({
        success: true,
        message: "Something went wrong",
        data: null,
      });
    //list all tasks with the owner of userId
    const tasks = await prisma.task.findMany({
      where: {
        created_by: userId,
      },
      orderBy: {
        created_by: "desc",
      },
    });
    res.send({ success: true, message: null, data: tasks });
  } catch (error) {
    console.log(console.log(error));
  }
});

taskRouter.post("/update-due-date/:taskId", authorization, async (req, res) => {
  try {
    const userId = req.user;
    const taskId = parseInt(req.params.taskId);
    const { new_due_date } = req.body;
    const authChecker = await checkIfTaskOwner(taskId, userId);
    if (!authChecker)
      return res.send({
        success: false,
        message: "You are not authorized to update this task.",
        data: null,
      });
    await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        due_date: new_due_date,
      },
    });
  } catch (error) {
    console.log(error);
  }
});
taskRouter.post(
  "/update-task-project-association/:taskId",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user;
      const taskId = parseInt(req.params.taskId);
      const { newProjectId } = req.body;

      //we will only show them options of your current project lists
      const authChecker = await checkIfTaskOwner(taskId, userId);
      if (!authChecker)
        return res.send({
          success: false,
          message: "You are not authorized to update this task.",
          data: null,
        });
      await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          project_associated: newProjectId,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
);
taskRouter.post(
  "/update-task-description/:taskId",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user;
      const taskId = parseInt(req.params.taskId);
      const { newDescription } = req.body;
      const authChecker = await checkIfTaskOwner(taskId, userId);
      if (!authChecker)
        return res.send({
          success: false,
          message: "You are not authorized to update this task.",
          data: null,
        });
      await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          description: newDescription,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
);
taskRouter.post(
  "/update-task-status/:taskId",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user;
      const taskId = parseInt(req.params.taskId);
      const newStatus = req.body.newStatus as FormType;
      const authChecker = await checkIfTaskOwner(taskId, userId);
      if (!authChecker)
        return res.send({
          success: false,
          message: "You are not authorized to update this task.",
          data: null,
        });
      await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          status: newStatus as any,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
);

export default taskRouter;
