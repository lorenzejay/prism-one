import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AppLayout from "../components/app/Layout";
import ProjectsTable from "../components/app/Home/ProjectsTable";
import TaskTable from "../components/app/Home/TaskTable";
import ProjectStatusCharts from "../components/app/Home/ProjectStatusCharts";
import useFirebaseAuth from "../hooks/useAuth3";
import LeadStats from "../components/app/Home/LeadStats";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// const ReactGridLayout = WidthProvider(RGL);
const ReactGridLayout = WidthProvider(Responsive);
let originalLayouts: any;
if (process.browser) {
  originalLayouts = getFromLS("layout");
}

function getFromLS(key: any) {
  let ls: any = {};
  if (global.localStorage.getItem("userSetLayout")) {
    try {
      ls =
        JSON.parse(global.localStorage.getItem("userSetLayout") as string) ||
        {};
    } catch (e) {
      /*Ignore*/
      console.log(e);
    }
  }
  // console.log("ls", ls);
  return ls[key];
}
const Home = () => {
  const router = useRouter();
  const { authUser, loading } = useFirebaseAuth();

  const saveToLS = (item: string, layouts: any) => {
    if (global.localStorage) {
      global.localStorage.setItem(item, JSON.stringify({ layout: layouts }));
    }
  };
  const [layouts, setLayouts] = useState(originalLayouts);

  useEffect(() => {
    if (!loading && authUser === null) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

  const handleLayoutChange = (layout: any, allLayout: any) => {
    saveToLS("userSetLayout", allLayout);

    setLayouts(allLayout);
  };

  return (
    <AppLayout>
      {/* <div className="smooth overflow-hidden"> */}
      {/* <h2 className="font-bold text-2xl ">Dashboard</h2> */}

      <ReactGridLayout
        containerPadding={[1, 0]}
        layouts={layouts}
        breakpoints={{ lg: 900, md: 750, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        className="layout"
        compactType="vertical"
        allowOverlap={false}
        rowHeight={50}
        onLayoutChange={(layout, allLayouts) =>
          handleLayoutChange(layout, allLayouts as any)
        }
      >
        {/* <section className="flex flex-col md:flex-row md:justify-between w-full"> */}
        {/* <div className="flex flex-col w-full md:w-3/5 flex-wrap md:mr-2 2xl:mr-10"> */}
        <div
          className=""
          key={"a"}
          data-grid={{
            i: "a",
            x: 0,
            y: 0,
            w: 6,
            h: 9.5,
            maxH: 9.5,
            isResizable: false,
          }}
        >
          <ProjectsTable />
        </div>

        <div
          className=""
          key={"b"}
          data-grid={{
            i: "b",
            x: 0,
            y: 9.5,
            w: 6,
            h: 5.75,
            maxH: 7,
            isResizable: false,
          }}
        >
          <ProjectStatusCharts />
        </div>
        {/* </div> */}
        {/* <div className="md:w-2/5 flex flex-col "> */}
        <div
          className=""
          key={"c"}
          data-grid={{
            i: "c",
            x: 6,
            y: 0,
            w: 6,
            h: 6.5,
            minH: 4,
            maxH: 9.5,
            isResizable: false,
          }}
        >
          <TaskTable />
        </div>
        <div
          className=""
          key={"d"}
          data-grid={{ i: "d", x: 6, y: 3, w: 6, h: 8, isResizable: false }}
        >
          <LeadStats />
        </div>
        {/* </div> */}
        {/* </section> */}
      </ReactGridLayout>
      {/* </div> */}
    </AppLayout>
  );
};

export default Home;
