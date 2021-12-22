import React from "react";

const ProjectStatusCharts = () => {
  return (
    <section className="grid grid-cols-2 gap-4">
      <div
        className="mt-2  px-5 py-3 flex rounded-md shadow-2xl items-start justify-between"
        style={{ background: "#ffffff" }}
      >
        <div className="flex flex-col">
          <h4 className="text-xl">Completed</h4>
          <p className="text-xl font-bold">12</p>
        </div>
        <img src={"/CompletedProjectLabel.png"} className="w-24 object-cover" />
      </div>

      <div
        className="mt-2 px-5 py-3 flex rounded-md shadow-2xl items-start justify-between"
        style={{ background: "#ffffff" }}
      >
        <div className="flex flex-col">
          <h4 className="text-xl">In Progress</h4>
          <p className="text-xl font-bold">12</p>
        </div>
        <img src={"/InProgress.png"} className="w-24 object-cover" />
      </div>

      <div
        className="mt-2  px-5 py-3 flex rounded-md shadow-2xl items-start justify-between"
        style={{ background: "#ffffff" }}
      >
        <div className="flex flex-col">
          <h4 className="text-xl">Pending</h4>
          <p className="text-xl font-bold">12</p>
        </div>
        <img src={"/Pending.png"} className="w-24 object-cover" />
      </div>
      <div
        className="mt-2  px-5 py-3 flex rounded-md shadow-2xl items-start justify-between"
        style={{ background: "#ffffff" }}
      >
        <div className="flex flex-col">
          <h4 className="text-xl">Closed</h4>
          <p className="text-xl font-bold">12</p>
        </div>
        <img src={"/Closed.png"} className="w-24 object-cover" />
      </div>
    </section>
  );
};

export default ProjectStatusCharts;
