import React, { FC } from "react";
import { NavLink, useHistory } from "react-router-dom";
import leftBottomAss from "../images/left_bottom_ass.png";
import rightBottomAss from "../images/right_bottom_ass.png";
import discordLogo from "../images/discrod.png";
import twitter from "../images/twitter.png";
import { useForm } from "react-hook-form";
interface PasswordForms {
  password: string;
}

const PasswordForm: FC = () => {
  let history = useHistory();

  const { register, handleSubmit, reset } = useForm<PasswordForms>();

  const onSubmit = handleSubmit((password) => {
    console.log(password);

    reset();
    history.push("/deadasspassword=badasspassword");
  });

  return (
    <main>
      <div className=" relative min-h-full py-10 flex flex-col-3 justify-center h-screen bg-purple-600">
        <img
          className=" hiddenAss absolute bottom-0 left-0 h-100 w-60"
          src={leftBottomAss}
          alt=""
          height="50%"
        />
        <img
          className=" hiddenAss absolute bottom-0 right-0 h-100 w-60"
          src={rightBottomAss}
          alt=""
          height="50%"
        />
        <div id="toMint"></div>
        <section className=" finalSection py-5 shadow-inner container border-4 flex-col justify-center flex-grow bg-green-400 h-100 ">
          <div className="max-w-md w-full mx-auto"></div>
          <div className="assTitleFinal text-center font-medium text-xl">
            No password?
          </div>
          <div className=" assTitleFinal text-3xl font-bold text-gray-900 mt-2 text-center">
            JOIN US DEADASS
          </div>
          <div className="max-w-md w-full mx-auto mt-4 bg-green-600 p-8 border border-gray-300">
            <form action="" className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor=""
                  className="text-sm font-bold text-gray-300 rounded mt-1"
                >
                  Password here
                </label>
                <input
                  ref={register({
                    required: true,
                    pattern: /funwins/,
                  })}
                  name="password"
                  type="text"
                  className="w-full p-2 border-gray-300 rounded mt-1"
                />
              </div>
              <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm">
                Submit
              </button>
            </form>
          </div>

          <div className="  flex flex-col items-center ">
            <div className=" gass flex flex-col items-center">
              <h1 className="assTitleFinal py-5">
                UH OH LOOKS LIKE YOU HAVENT JOINED OUR BADASS DISCORD
              </h1>

              <div className="flex flex-row items-center">
                <a
                  className="anchorsSocials justify-center flex items-center"
                  href="https://discord.gg/BeYDXSjekW"
                >
                  <img className="w-1/4" src={discordLogo} alt="" />
                </a>
                <a
                  className="justify-center flex items-center"
                  href="https://twitter.com/deadasssol"
                >
                  <img className=" w-1/4" src={twitter} alt="" />
                </a>
              </div>
              <NavLink to="/">Go back </NavLink>
            </div>

            <div className="flex-col justify-center "></div>
            <div className=" flex-col justify-center"></div>
          </div>
        </section>
      </div>
    </main>
  );
};
export default PasswordForm;
