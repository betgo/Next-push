import { useTheme } from "next-themes";
import React from "react";
import { MdDarkMode, MdOutlineWbSunny } from "react-icons/md";

function SideMenu() {
  // const { colorMode, toggleColorMode } = useColorMode();
  const { theme, setTheme } = useTheme();
  const toggleColorMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <div className=" hidden items-center justify-center sm:flex ">
      <div className="flex min-h-[100px] items-center justify-center  rounded-3xl border py-4 shadow">
        <div onClick={toggleColorMode}>
          {theme === "dark" ? (
            <MdDarkMode className="text-2xl" />
          ) : (
            <MdOutlineWbSunny className="text-2xl" />
          )}
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
