import { PrismaClient, ProjectStatus } from ".prisma/client";
import { Router } from "express";
import authorization from "../middlewares/auth";

const clientRouter = Router();

const prisma = new PrismaClient();

//add client
clientRouter.post("/create-client", authorization, async (req, res) => {
  try {
    const userId = req.user.toString();
    //initial creation will not have address, => this can be included when user updates clients details
    const {
      client_name,
      client_email,
      phone_number,
      notes,
      address,
      state,
      city,
      zip_code,
    } = req.body;

    //check for any blanks on required

    await prisma.client.create({
      data: {
        client_email,
        client_name,
        phone_number,
        notes,
        created_by: userId,
        address,
        city,
        state,
        zip_code,
      },
    });
    res.send({
      success: true,
      message: "Successfully created a new client.",
      data: undefined,
    });
  } catch (error) {
    console.log(error);
  }
});

//list-user-clients
clientRouter.get("/list-clients", authorization, async (req, res) => {
  try {
    const userId = req.user;
    if (!userId)
      return res
        .status(403)
        .send({ success: false, message: "Forbidden", data: undefined });
    const clientList = await prisma.client.findMany({
      where: {
        created_by: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.send({ message: undefined, success: true, data: clientList });
  } catch (error) {
    console.log(error);
  }
});

// client details
clientRouter.get(
  "/client-details/:clientId",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user;

      const clientId = parseInt(req.params.clientId);
      //find the project of the clientId
      const clientDetails = await prisma.client.findUnique({
        where: { id: clientId },
      });
      if (clientDetails?.created_by !== userId.toString()) {
        res.send({
          data: undefined,
          success: false,
          message: "You are not the owner of this application.",
        });
      }
      res.send({ data: clientDetails, success: true, message: "" });
    } catch (error) {
      console.log(error);
    }
  }
);

//search for client
clientRouter.get(
  "/client-filter-by-name/:clientName",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user;
      const clientName = req.params.clientName;
      if (!userId) return;
      //find the client
      const client = await prisma.client.findMany({
        where: {
          client_name: {
            startsWith: clientName,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (client === undefined || client === null)
        return res.send({
          data: null,
          success: false,
          message: "Client not found.",
        });

      res.send({
        data: client,
        success: true,
        message: "Successfully found the client",
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//update client details
clientRouter.post(
  "/update-client-details/:clientId",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user.toString();
      const clientId = parseInt(req.params.clientId);
      const {
        client_name,
        client_email,
        phone_number,
        notes,
        address,
        state,
        city,
        zip_code,
      } = req.body;
      //verify that client details owner is the userId
      const selectedClient = await prisma.client.findUnique({
        where: {
          id: clientId,
        },
      });
      if (selectedClient?.created_by !== userId) {
        return res.send({
          success: false,
          message: "You are not authorized to update this client.",
          data: undefined,
        });
      }

      await prisma.client.update({
        where: {
          id: clientId,
        },
        data: {
          client_email,
          client_name,
          phone_number,
          notes,
          address,
          state,
          city,
          zip_code,
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

//checker function for user logged in is authorized to modify the client details / is the created_by
const isClientCreatedByUser = async (userId: string, clientId: number) => {
  const checker = await prisma.client.findUnique({
    where: {
      id: clientId,
    },
  });
  if (checker?.created_by === userId) {
    return true;
  }
  return false;
};

//delete client
clientRouter.delete(
  "/delete-client/:clientId",
  authorization,
  async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const userId = req.user;
      const didCreateClient = await isClientCreatedByUser(
        userId.toString(),
        clientId
      );
      if (!didCreateClient) {
        return res.send({
          success: false,
          message: "You are not authorized to modify this client.",
          data: null,
        });
      }
      await prisma.client.delete({
        where: {
          id: clientId,
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

export default clientRouter;
