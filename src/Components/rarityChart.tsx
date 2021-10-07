import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import rarityImage from "../images/rarities_chart.png";
const RarityChart: FC = () => {
  return (
    <main>
      <div className=" min-h-full py-10 flex justify-center h-screen bg-purple-600">
        <div className="container border-4 bg-green-400 flex flex-col justify-center items-center">
          <NavLink
            className="gotoMint rounded-full py-3 px-4 bg-yellow-300 shadow-2xl hover:bg-red-700 w-60"
            to="/"
          >
            Go back
          </NavLink>
          <div className=" containerChart  ">
            <input type="checkbox" id="zoomCheck" />
            <label htmlFor="zoomCheck">
              <img src={rarityImage} alt="chart" className="raritiesChart " />
            </label>
          </div>
        </div>

        <div className="">
          <img
            className="hiddenAss absolute top-0 left-0 h-100 w-60"
            src="./images/left_ass_top.png"
            alt=""
            height="50%"
          />
        </div>

        <div className="">
          <img
            className="hiddenAss absolute top-0 right-0 h-100 w-60 sm:h-50"
            src="./images/right_ass_top.png"
            alt=""
          />
        </div>
      </div>
      <div className=" min-h-full py-10 flex justify-center h-96 bg-purple-600"></div>
    </main>
  );
};
export default RarityChart;
