import { PrismaClient } from ".prisma/client";
import { Router } from "express";
import authorization from "../middlewares/auth";

import { storage } from "../utils/firebaseInit";
const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);

const contractRouter = Router();

const prisma = new PrismaClient();
contractRouter.get("/list-contracts", authorization, async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) return;

    //find the contratcs created y user
    const userContracts = await prisma.contract.findMany({
      where: {
        created_by: userId,
      },
      select: {
        id: true,
        contract_name: true,
        created_at: true,
      },
    });
    res.send({ success: true, messasge: null, data: userContracts });
  } catch (error) {
    console.log(error);
    return error;
  }
});
contractRouter.post("/create-contract", authorization, async (req, res) => {
  try {
    const { contract_name, location_bucket, firebase_path, custom_contract } =
      req.body;
    const userId = req.user;
    if (!userId) return;
    await prisma.contract.create({
      data: {
        contract_name,
        firebase_path,
        location_bucket,
        custom_contract,
        created_by: userId.toString(),
      },
    });
    res.send({
      success: true,
      message: "Created a contract",
      data: null,
    });
    // await cloudinary.v2.uploader.upload(
    //   attached_file,
    //   { resource_type: "raw" },
    //   async (error, response) => {
    //     if (error || !res || res === null)
    //       res.send({
    //         success: false,
    //         message: "Something went wrong please try again.",
    //         data: undefined,
    //       });
    //     await prisma.contract.create({
    //       data: {
    //         contract_name,
    //         custom_contract,
    //         created_by: userId.toString(),
    //         text_field_response,
    //         cloduinary_file_url: response?.url,
    //         cloudinary_asset_id: response?.asset_id,
    //         cloudinary_public_id: response?.public_id,
    //         cloudinary_secure_link: response?.secure_url,
    //       },
    //     });
    //   }
    // );
  } catch (error) {
    console.log(error);
  }
});

//create-contract-firebase-storage
contractRouter.post(
  "/create-contract-firebase-storage",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user;
      const { attached_file } = req.body;
      if (!userId)
        return res.send({
          success: false,
          message: "You are not authenticated",
          data: null,
        });
      const destination = `${userId}/${attached_file}`;
      await bucket.upload(attached_file, {
        destination,
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

//list one contract based on the id of the user
contractRouter.get(
  "/list-contract/:contractId",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user;
      const contractId = parseInt(req.params.contractId);
      if (!userId) return;

      //find the contratcs created y user
      const userContract = await prisma.contract.findFirst({
        where: {
          AND: [
            {
              id: contractId,
              created_by: userId,
            },
          ],
        },
      });
      res.send({ success: true, messasge: null, data: userContract });
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

//update contract title
//update title
contractRouter.put(
  "/update-title/:contractId",
  authorization,
  async (req, res) => {
    try {
      const { newContractName } = req.body;
      const contractId = parseInt(req.params.contractId);

      const userId = req.user.toString();

      //check if you are the project owner
      const contract = await prisma.contract.findUnique({
        where: {
          id: contractId,
        },
        select: {
          created_by: true,
        },
      });
      if (!contract) return;

      if (contract.created_by !== userId)
        return res.send({
          success: false,
          message: "You don't have access to update this project",
          data: undefined,
        });

      await prisma.contract.update({
        where: { id: contractId },
        data: { contract_name: newContractName },
      });

      res.send({
        success: true,
        message: "Updated the title for your contract.",
        data: undefined,
      });
    } catch (error) {
      console.log(error);
    }
  }
);
export default contractRouter;
