import { PrismaClient, ProjectStatus } from ".prisma/client";
import { Router } from "express";
import authorization from "../middlewares/auth";
import cloudinary from "cloudinary";
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
    });
    res.send({ success: true, messasge: null, data: userContracts });
  } catch (error) {
    console.log(error);
    return error;
  }
});
contractRouter.post("/create-contract", authorization, async (req, res) => {
  try {
    const {
      contract_name,
      attached_file,
      custom_contract,
      text_field_response,
    } = req.body;
    const userId = req.user;
    if (!userId) return;
    await cloudinary.v2.uploader.upload(
      attached_file,
      { resource_type: "raw" },
      async (error, response) => {
        if (error || !res || res === null)
          res.send({
            success: false,
            message: "Something went wrong please try again.",
            data: undefined,
          });
        await prisma.contract.create({
          data: {
            contract_name,
            custom_contract,
            created_by: userId.toString(),
            text_field_response,
            cloduinary_file_url: response?.url,
            cloudinary_asset_id: response?.asset_id,
            cloudinary_public_id: response?.public_id,
            cloudinary_secure_link: response?.secure_url,
          },
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
});

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
