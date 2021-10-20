import React from "react";

const NavBar = ({ onClick = () => {} }) => {
  return (
    <div className="flex flex-col gap-10 items-center text-xl font-bold md:flex-row md:text-sm md:gap-5">
      <a onClick={onClick} href="https://discord.gg/BeYDXSjekW">
        Discord
      </a>
      <a onClick={onClick} href="https://twitter.com/deadasssol">
        Twitter
      </a>
    </div>
  );
};

export default NavBar;
