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

leadRouter.get("/list-lead-data/:leadId", authorization, async (req, res) => {
  try {
    const userId = req.user;
    const leadId = parseInt(req.params.leadId);

    if (!userId) return;
    const leads = await prisma.leadResponses.findMany({
      where: {
        lead_associated: leadId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!leads)
      return res.send({ success: false, message: "No leads.", data: null });

    leads.forEach((lead) => {
      lead.response = JSON.parse(lead.response as any);
    });

    res.send({
      success: true,
      message: undefined,
      data: leads,
    });
  } catch (error) {
    console.log(error);
  }
});

//get how many lead this year by month
leadRouter.get("/list-lead-amounts", authorization, async (req, res) => {
  try {
    const userId = req.user;
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    //6 months default
    //get current month then 6 months
    const date = new Date();
    const todaysMonths = date.getMonth();
    const todaysYear = date.getFullYear();
    const lastYear = date.getFullYear() - 1;
    let sixMonthNames = [];

    //6 months back
    for (
      let i = 0, x = todaysMonths, rCount = monthNames.length;
      i < 6;
      i++, x--
    ) {
      if (x < 0) {
        // monthNames[monthNames.length - i]
        // console.log("todays Month =", monthNames[monthNames.length - i]);
        sixMonthNames.push({
          monthDate: rCount < 10 ? "0" + rCount.toString() : rCount.toString(),
          monthName: monthNames[rCount - 1],
        });
        rCount--;
      } else {
        // console.log(monthNames[x]);
        sixMonthNames.push({
          monthDate: x + 1 < 10 ? "0" + (x + 1).toString() : (x + 1).toString(),
          monthName: monthNames[x],
        });
      }
    }
    // console.log(`${lastYear}-${sixMonthNames[0].monthDate}`);
    let result = [];
    // let sixMonthStats: any[] = [];
    for (const x of sixMonthNames) {
      // console.log(`${todaysYear}-${x.monthDate}`);
      const count = await prisma.project.count({
        where: {
          OR: [
            {
              owner_id: userId,
              project_status: "Lead",
              project_date: {
                startsWith: `${todaysYear}-${x.monthDate}`,
              },
            },
            {
              owner_id: userId,
              project_status: "Lead",
              project_date: {
                startsWith: `${lastYear}-${x.monthDate}`,
              },
            },
          ],
        },
      });

      let stats = {
        monthD: x.monthDate,
        name: x.monthName,
        count: count,
      };
      result.push(stats);
      // result = data;
      // console.log({ x: x.monthDate, countThisYear, countLastYear });
      // if (data.length !== 0) {
      //   result.push(data[0]);
      //   continue;
      // }
    }
    if (result) {
      res.send({ success: true, message: null, data: result.reverse() });
    } else {
      throw new Error("Something went wrong.");
    }
  } catch (error) {
    console.log(error);
  }
});

export default leadRouter;
