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
    // console.log("project_associated", project_associated);
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
        project_associated: parseInt(project_associated),
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

//list specific task
taskRouter.get(
  "/list-specific-task/:taskId",
  authorization,
  async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const userId = req.user;
      if (!userId)
        return res.send({
          success: false,
          message: "Something went wrong",
          data: null,
        });
      //list all tasks with the owner of userId
      const tasks = await prisma.task.findFirst({
        where: {
          id: taskId,
        },
      });
      res.send({ success: true, message: null, data: tasks });
    } catch (error) {
      console.log(console.log(error));
    }
  }
);
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

//update-task
taskRouter.post(
  "/update-task-details/:taskId",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user.toString();
      const taskId = parseInt(req.params.taskId);
      const { description, status, due_date, project_associated } = req.body;
      //verify that task owner is the userId
      const selectedTask = await prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });
      if (selectedTask?.created_by !== userId) {
        return res.send({
          success: false,
          message: "You are not authorized to update this task.",
          data: undefined,
        });
      }

      await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          description,
          due_date,
          status: status ? FormType.completed : FormType.incomplete,
          project_associated: project_associated,
        },
      });
      res.send({
        success: true,
        message: "Updated client details",
        data: null,
      });
    } catch (error) {
      console.log(error);
    }
  }
);
//search for client
taskRouter.get(
  "/task-filter-by-name/:taskDescription",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user;
      const taskDescription = req.params.taskDescription;
      if (!userId) return;
      //find the client
      const tasks = await prisma.task.findMany({
        where: {
          description: {
            startsWith: taskDescription,
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });
      if (tasks === undefined || tasks === null)
        return res.send({
          data: null,
          success: false,
          message: "Tasks not found.",
        });

      res.send({
        data: tasks,
        success: true,
        message: "Successfully found the task.",
      });
    } catch (error) {
      console.log(error);
    }
  }
);
taskRouter.get("/list-associated-projects", authorization, async (req, res) => {
  try {
    const userId = req.user;
    if (!userId)
      return res.send({
        success: false,
        message: "You aren't allowed to be here.",
        data: null,
      });

    //fetch projects id and name from the one you created
    const projects = await prisma.project.findMany({
      where: {
        owner_id: userId,
      },
      select: {
        title: true,
        id: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    res.send({ success: true, message: null, data: projects });
  } catch (error) {
    console.log(error);
    return error;
  }
});

export default taskRouter;
