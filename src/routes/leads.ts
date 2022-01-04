import { PrismaClient, Prisma } from ".prisma/client";
import { Router } from "express";
import authorization from "../middlewares/auth";

const leadRouter = Router();

const prisma = new PrismaClient();

leadRouter.get("/list-lead-forms", authorization, async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) return;

    const leads = await prisma.leadForms.findMany({
      orderBy: [
        {
          created_at: "desc",
        },
      ],
      where: {
        created_by: userId,
      },
    });
    res.send({ success: true, message: undefined, data: leads });
  } catch (error) {
    console.log(error);
  }
});

leadRouter.post("/create-lead-form", authorization, async (req, res) => {
  try {
    const userId = req.user;
    const { title, formElements } = req.body;
    if (!userId) return;
    const leads = await prisma.leadForms.create({
      data: {
        title,
        created_by: userId.toString(),
        formElements,
      },
      select: {
        id: true,
      },
    });
    res.send({ success: true, message: undefined, data: leads.id });
  } catch (error) {
    console.log(error);
  }
});

leadRouter.get("/list-lead/:leadId", authorization, async (req, res) => {
  try {
    const userId = req.user;
    const leadId = parseInt(req.params.leadId);

    if (!userId) return;
    const leads = await prisma.leadForms.findFirst({
      where: {
        id: leadId,
      },
    });
    if (!leads) throw new Error("No lead found...");
    //transfor the json string to an actual array / obj
    const regFormElements = JSON.parse(leads.formElements as any);

    leads.formElements = regFormElements;
    res.send({ success: true, message: undefined, data: leads });
  } catch (error) {
    console.log(error);
  }
});

leadRouter.post("/upload-form-response/:leadId", async (req, res) => {
  try {
    const leadId = parseInt(req.params.leadId);
    const { response } = req.body;
    if (!leadId) return;
    const leads = await prisma.leadResponses.create({
      data: {
        response,
        lead_associated: leadId,
      },
      select: {
        id: true,
      },
    });
    res.send({ success: true, message: undefined, data: leads.id });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

export default leadRouter;
