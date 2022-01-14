import { PrismaClient, ProjectStatus } from ".prisma/client";
import { Router } from "express";
import authorization from "../middlewares/auth";

const projectRouter = Router();

const prisma = new PrismaClient();

const checkIfProjectOwner = async (
  projectId: number,
  ownerId: Record<string, any>
) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      owner_id: true,
    },
  });
  if (!project) return false;
  if (project.owner_id === ownerId.toString()) {
    return true;
  }
  return false;
};

projectRouter.post("/create-project", authorization, async (req, res) => {
  try {
    const userId = req.user;
    // console.log("userId", userId);
    const {
      title,
      client_email,
      clientId,
      client_name,
      project_date,
      goals,
      tags,
    } = req.body;

    if (!userId) return;
    //optional inputs are goals and project date
    const newProject = await prisma.project.create({
      data: {
        title,
        client_email,
        client_name,
        owner_id: userId.toString(),
        project_date,
        goals,
        tags,
      },
      select: {
        id: true,
      },
    });

    //if there is a client check
    const clientExists = await prisma.client.findFirst({
      where: {
        id: clientId,
      },
      select: {
        id: true,
      },
    });
    if (clientExists && newProject) {
      await prisma.client.update({
        where: {
          id: clientId,
        },
        data: {
          associatedProjectId: newProject.id,
        },
      });
    }

    res.send({ success: true, message: "Project successfully created." });
  } catch (error) {
    console.log(error);
  }
});

//update project details
projectRouter.post(
  "/update-project-details/:projectId",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user.toString();
      const projectId = parseInt(req.params.projectId);
      //include header_img, gallery later on
      const {
        client_name,
        client_email,
        title,
        is_private,
        project_date,
        job_type,
        amount_paid,
        amount_due,
        expected_revenue,
        project_status,
        tags,
        goals,
      } = req.body;
      //verify that project details owner is the userId
      const selectedProject = await prisma.project.findUnique({
        where: {
          id: projectId,
        },
        select: {
          owner_id: true,
        },
      });
      if (selectedProject?.owner_id !== userId) {
        return res.send({
          success: false,
          message: "You are not authorized to update this client.",
          data: undefined,
        });
      }
      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          client_name,
          client_email,
          title,
          is_private,
          project_date,
          job_type,
          amount_paid,
          amount_due,
          expected_revenue,
          project_status,
          tags,
          goals,
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

projectRouter.get(
  "/project-details/:projectId",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user;

      const projectId = parseInt(req.params.projectId);
      //find the project of the clientId
      const projectDetails = await prisma.project.findUnique({
        where: { id: projectId },
      });
      if (projectDetails?.owner_id !== userId.toString()) {
        res.send({
          data: undefined,
          success: false,
          message: "You are not the owner of this application.",
        });
      }
      res.send({ data: projectDetails, success: true, message: "" });
    } catch (error) {
      console.log(error);
    }
  }
);
projectRouter.get(
  "/project-title/:projectId",

  async (req, res) => {
    try {
      // const userId = req.user;

      const projectId = parseInt(req.params.projectId);
      //find the project of the clientId
      const title = await prisma.project.findUnique({
        where: { id: projectId },
        select: { title: true },
      });
      res.send({ data: title, success: true, message: "" });
    } catch (error) {
      console.log(error);
    }
  }
);

projectRouter.get("/list-projects", authorization, async (req, res) => {
  try {
    const userId = req.user;
    const projects = await prisma.project.findMany({
      orderBy: [
        {
          created_at: "desc",
        },
      ],
      where: {
        owner_id: userId,
      },
    });

    res.send({ success: true, message: undefined, data: projects });
  } catch (error) {
    console.log(error);
  }
});

projectRouter.get(
  "/list-project-tasks/:projectId",
  authorization,
  async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const userId = req.user;
      if (!userId) return;
      const projectTasks = await prisma.task.findMany({
        orderBy: [
          {
            created_at: "desc",
          },
        ],
        where: {
          project_associated: projectId,
          created_by: userId,
        },
      });
      if (projectTasks === [] || projectTasks.length === 0) {
        return res.send({ success: true, message: null, data: null });
      }
      res.send({ success: true, message: null, data: projectTasks });
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

//update title
projectRouter.put(
  "/update-title/:projectId",
  authorization,
  async (req, res) => {
    try {
      const { newTitle } = req.body;
      const projectId = parseInt(req.params.projectId);
      console.log(projectId);
      const userId = req.user.toString();

      //check if you are the project owner
      const project = await prisma.project.findUnique({
        where: {
          id: projectId,
        },
        select: {
          owner_id: true,
        },
      });
      if (!project) return;
      console.log(project.owner_id);
      if (project.owner_id !== userId)
        return res.send({
          success: false,
          message: "You don't have access to update this project",
          data: undefined,
        });

      await prisma.project.update({
        where: { id: projectId },
        data: { title: newTitle },
      });

      res.send({
        success: true,
        message: "Updated the title for the project.",
        data: undefined,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

const isProjectCreatedByUser = async (projectId: number, userId: string) => {
  //check if you are the project owner
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      owner_id: true,
    },
  });
  if (!project) return false;

  if (project.owner_id !== userId) return false;
  return true;
};

//delete project
projectRouter.delete(
  "/delete-project/:projectId",
  authorization,
  async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const userId = req.user;
      const didCreateClient = await isProjectCreatedByUser(
        projectId,
        userId.toString()
      );
      if (!didCreateClient) {
        return res.send({
          success: false,
          message: "You are not authorized to modify this client.",
          data: null,
        });
      }
      await prisma.project.delete({
        where: {
          id: projectId,
        },
      });
      return res.send({
        success: true,
        message: "Successfully delete the client.",
        data: null,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//update status

projectRouter.put(
  "/update-status/:projectId",
  authorization,
  async (req, res) => {
    try {
      const { newStatus } = req.body as { newStatus: ProjectStatus };

      const projectId = parseInt(req.params.projectId);

      const userId = req.user.toString();

      //check if you are the project owner
      const project = await prisma.project.findUnique({
        where: {
          id: projectId,
        },
        select: {
          owner_id: true,
        },
      });
      if (!project) return;
      console.log(project.owner_id);
      if (project.owner_id !== userId)
        return res.send({
          success: false,
          message: "You don't have access to update this project",
          data: undefined,
        });

      await prisma.project.update({
        where: { id: projectId },
        data: { project_status: newStatus },
      });

      res.send({
        success: true,
        message: "Updated the status for the project.",
        data: undefined,
      });
    } catch (error) {
      console.log(error);
    }
  }
);
//add tags
projectRouter.post(
  "/add-new-tag/:projectId",
  authorization,
  async (req, res) => {
    try {
      const newTag: string = req.body.newTag;

      const projectId = parseInt(req.params.projectId);

      const userId = req.user;
      if (!userId) return;

      const isProjectOwner = await checkIfProjectOwner(projectId, userId);
      if (!isProjectOwner)
        return res.send({
          success: false,
          message: "You do not have access to modify this project.",
          data: undefined,
        });

      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          tags: {
            push: newTag,
          },
        },
      });
      res.send({
        data: undefined,
        success: true,
        message: "Successfully added a new tag to your project.",
      });
    } catch (error) {
      console.log(error);
    }
  }
);
//add tags
projectRouter.post(
  "/add-new-tag/:projectId",
  authorization,
  async (req, res) => {
    try {
      const newTag: string = req.body.newTag;

      const projectId = parseInt(req.params.projectId);

      const userId = req.user;
      if (!userId) return;

      const isProjectOwner = await checkIfProjectOwner(projectId, userId);
      if (!isProjectOwner)
        return res.send({
          success: false,
          message: "You do not have access to modify this project.",
          data: undefined,
        });

      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          tags: {
            push: newTag,
          },
        },
      });
      res.send({
        data: undefined,
        success: true,
        message: "Successfully added a new tag to your project.",
      });
    } catch (error) {
      console.log(error);
    }
  }
);
//add tags
projectRouter.post(
  "/add-new-tag/:projectId",
  authorization,
  async (req, res) => {
    try {
      const newTag: string = req.body.newTag;

      const projectId = parseInt(req.params.projectId);

      const userId = req.user;
      if (!userId) return;

      const isProjectOwner = await checkIfProjectOwner(projectId, userId);
      if (!isProjectOwner)
        return res.send({
          success: false,
          message: "You do not have access to modify this project.",
          data: undefined,
        });

      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          tags: {
            push: newTag,
          },
        },
      });
      res.send({
        data: undefined,
        success: true,
        message: "Successfully added a new tag to your project.",
      });
    } catch (error) {
      console.log(error);
    }
  }
);
//add tags
projectRouter.post(
  "/add-new-tag/:projectId",
  authorization,
  async (req, res) => {
    try {
      const newTag: string = req.body.newTag;

      const projectId = parseInt(req.params.projectId);

      const userId = req.user;
      if (!userId) return;

      const isProjectOwner = await checkIfProjectOwner(projectId, userId);
      if (!isProjectOwner)
        return res.send({
          success: false,
          message: "You do not have access to modify this project.",
          data: undefined,
        });

      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          tags: {
            push: newTag,
          },
        },
      });
      res.send({
        data: undefined,
        success: true,
        message: "Successfully added a new tag to your project.",
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//remove one tag
projectRouter.put(
  "/remove-new-tag/:projectId",
  authorization,
  async (req, res) => {
    try {
      const selectedTag: string = req.body.selectedTag;
      const projectId = parseInt(req.params.projectId);

      const userId = req.user;

      if (!userId) return;
      // const isProjectOwner = await checkIfProjectOwner(projectId, userIdString);
      const project = await prisma.project.findUnique({
        where: {
          id: projectId,
        },
        select: {
          owner_id: true,
          tags: true,
        },
      });
      if (!project) return;
      if (project.owner_id !== userId.toString()) {
        return res.send({
          success: false,
          message: "You do not have access to modify this project.",
          data: undefined,
        });
      }
      //manual modification for the removal of the tag (filter)

      const newTagList = project.tags.filter((x) => x !== selectedTag);
      console.log("newtagList :", newTagList);

      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          tags: newTagList,
        },
      });
      res.send({
        data: undefined,
        success: true,
        message: `Successfully removed ${selectedTag} tag from your project.`,
      });
    } catch (error) {
      console.log(error);
    }
  }
);
//update amount paid
projectRouter.post(
  "/update-amount-paid/:projectId",
  authorization,
  async (req, res) => {
    try {
      const newAmountPaid: number = req.body.newAmountPaid;

      const projectId = parseInt(req.params.projectId);

      const userId = req.user;
      if (!userId) return;

      const isProjectOwner = await checkIfProjectOwner(projectId, userId);
      if (!isProjectOwner)
        return res.send({
          success: false,
          message: "You do not have access to modify this project.",
          data: undefined,
        });

      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          amount_paid: newAmountPaid,
        },
      });
      res.send({
        data: undefined,
        success: true,
        message: `Successfully updated amount paid to $${newAmountPaid}.`,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//update is private project
projectRouter.put(
  "/update-privacy/:projectId",
  authorization,
  async (req, res) => {
    try {
      const newPrivacyStatus: boolean = req.body.newPrivacyStatus;

      const projectId = parseInt(req.params.projectId);

      const userId = req.user;
      if (!userId) return;

      const isProjectOwner = await checkIfProjectOwner(projectId, userId);
      if (!isProjectOwner)
        return res.send({
          success: false,
          message: "You do not have access to modify this project.",
          data: undefined,
        });

      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          is_private: newPrivacyStatus,
        },
      });
      res.send({
        data: undefined,
        success: true,
        message: `Successfully updated project privacy status to ${newPrivacyStatus}.`,
      });
    } catch (error) {
      console.log(error);
    }
  }
);
//update client name
projectRouter.put(
  "/update-client-name/:projectId",
  authorization,
  async (req, res) => {
    try {
      const newClientName = req.body.newClientName;
      const projectId = parseInt(req.params.projectId);

      const userId = req.user;
      if (!userId) return;

      const isProjectOwner = await checkIfProjectOwner(projectId, userId);
      if (!isProjectOwner)
        return res.send({
          success: false,
          message: "You do not have access to modify this project.",
          data: undefined,
        });
      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          client_name: newClientName,
        },
      });
      res.send({
        data: undefined,
        success: true,
        message: `Successfully updated project client name to ${newClientName}.`,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//update client email
projectRouter.put(
  "/update-client-email/:projectId",
  authorization,
  async (req, res) => {
    try {
      const newClientEmail = req.body.newClientEmail;
      const projectId = parseInt(req.params.projectId);

      const userId = req.user;
      if (!userId) return;

      const isProjectOwner = await checkIfProjectOwner(projectId, userId);
      if (!isProjectOwner)
        return res.send({
          success: false,
          message: "You do not have access to modify this project.",
          data: undefined,
        });
      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          client_name: newClientEmail,
        },
      });
      res.send({
        data: undefined,
        success: true,
        message: `Successfully updated project client email to ${newClientEmail}.`,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//update amount due
projectRouter.put(
  "/update-amount-due/:projectId",
  authorization,
  async (req, res) => {
    try {
      const newAmountDue: number = req.body.newAmountDue;
      const projectId = parseInt(req.params.projectId);

      const userId = req.user;
      if (!userId) return;

      const isProjectOwner = await checkIfProjectOwner(projectId, userId);
      if (!isProjectOwner)
        return res.send({
          success: false,
          message: "You do not have access to modify this project.",
          data: undefined,
        });
      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          amount_due: newAmountDue,
        },
      });
      res.send({
        data: undefined,
        success: true,
        message: `Successfully updated project amount due to ${newAmountDue}.`,
      });
    } catch (error) {
      console.log(error);
    }
  }
);
//update goals
projectRouter.put(
  "/update-goals/:projectId",
  authorization,
  async (req, res) => {
    try {
      const newGoals: string = req.body.newGoals;
      const projectId = parseInt(req.params.projectId);

      const userId = req.user;
      if (!userId) return;

      const isProjectOwner = await checkIfProjectOwner(projectId, userId);
      if (!isProjectOwner)
        return res.send({
          success: false,
          message: "You do not have access to modify this project.",
          data: undefined,
        });
      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          goals: newGoals,
        },
      });
      res.send({
        data: undefined,
        success: true,
        message: `Successfully updated project goals to ${newGoals}.`,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//update project date
projectRouter.put(
  "/update-project-date/:projectId",
  authorization,
  async (req, res) => {
    try {
      const newProjectDueDate = req.body.newProjectDueDate;
      const projectId = parseInt(req.params.projectId);

      const userId = req.user;
      if (!userId) return;

      const isProjectOwner = await checkIfProjectOwner(projectId, userId);
      if (!isProjectOwner)
        return res.send({
          success: false,
          message: "You do not have access to modify this project.",
          data: undefined,
        });
      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          project_date: newProjectDueDate,
        },
      });
      res.send({
        data: undefined,
        success: true,
        message: `Successfully updated project amount due to ${newProjectDueDate}.`,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//listing project status stats
projectRouter.get(
  "/list-projects-status-counter",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user;
      const counter = await prisma.project.groupBy({
        where: {
          owner_id: userId,
          project_status: {
            in: ["Booked", "Completed", "Fulfillment", "Lead"],
          },
        },

        by: ["project_status"],

        _count: {
          project_status: true,
        },
      });

      const leadCount = counter.find(
        (x) => x.project_status === ProjectStatus.Lead
      )?._count;
      const bookedCount = counter.find(
        (x) => x.project_status === ProjectStatus.Booked
      )?._count;
      const fulfillmentCount = counter.find(
        (x) => x.project_status === ProjectStatus.Fulfillment
      )?._count;
      const completedCount = counter.find(
        (x) => x.project_status === ProjectStatus.Completed
      )?._count;
      let statusCounts = {
        leadCount: leadCount?.project_status || 0,
        bookedCount: bookedCount?.project_status || 0,
        fulfillmentCount: fulfillmentCount?.project_status || 0,
        completedCount: completedCount?.project_status || 0,
      };
      res.send({
        success: true,
        message: undefined,
        data: {
          statusCounts,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
);

// list 6 of the most recent projects made
projectRouter.get("/list-recent-projects", authorization, async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      res.send({
        success: false,
        message: "You are not authorized to view this data.",
        data: null,
      });
    }
    const projects = await prisma.project.findMany({
      take: 6,
      orderBy: [
        {
          created_at: "desc",
        },
      ],
      where: {
        owner_id: userId,
      },
    });

    res.send({ success: true, message: undefined, data: projects });
  } catch (error) {
    console.log(error);
  }
});

export default projectRouter;
