import React, { useContext, useState } from "react";
import Link from "next/link";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { RxHamburgerMenu } from "react-icons/rx";
import { isLoggedIn, logout } from "@/helpers";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";

type Props = {};

import dynamic from "next/dynamic";
import axios from "axios";
import { BACKEND_URL, COURSE_ID, COURSE_ID_2 } from "@/api.config";
import { UserContext } from "@/Contexts/UserContext";
import { useLmsPreference } from "@/hooks/useLmsPreference";
import { getCoursesDashboardUrl } from "@/constants/lmsPreference";
import { appendTokenToUrl, getAuthToken } from "@/helpers";

const TestComponent = dynamic(() => import("./TestComponent"), {
  ssr: false,
});

function changeToDarkMode() {
  document.documentElement.classList.add("dark");
}
function changeToLightMode() {
  document.documentElement.classList.remove("dark");
}

const useThemeDetector = () => {
  const getCurrentTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());
  const mqListener = (e: any) => {
    setIsDarkTheme(e.matches);
  };

  useEffect(() => {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    darkThemeMq.addListener(mqListener);
    return () => darkThemeMq.removeListener(mqListener);
  }, []);
  return isDarkTheme;
};

export default function Nav({}: Props) {
  const [menuShow, setMenuShow] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState<any>("");
  const [isLogged, setIsLoggedIn] = useState(false);
  const [score, setScore] = useState(0);
  const [user, setUser] = useContext<any>(UserContext);
  const [notificationsCount, setNotificationsCount] = useState<any>(0);
  const [isCP2Taken, setIsCP2Taken] = useState(false);
  const { lmsPreference } = useLmsPreference();

  const fetchCP2 = () => {
    const token = localStorage.getItem("token");
    axios
      .get(BACKEND_URL + "/user/course/getfull/" + COURSE_ID, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.isTaken) {
          setIsCP2Taken(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const resetBellCount = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        BACKEND_URL +
          `/user/notification/bellIconClicked?courseId=${COURSE_ID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        // fetchNotifications();
        fetchNotificationsCount();
      })
      .catch((err) => {});
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (isLoggedIn()) {
      setIsLoggedIn(true);
      fetchScore();
      fetchNotificationsCount();
      fetchCP2();
    } else {
      setIsLoggedIn(false);
    }

    const isSystemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const pastPreference = localStorage.getItem("darkMode");

    if (pastPreference) {
      if (pastPreference == "true") {
        setDarkMode(true);
        console.log("past ref true");
      } else {
        setDarkMode(false);
        console.log("past ref false");
      }
    } else {
      setDarkMode(true);
      console.log("system dark");
    }
    // else if (isSystemDark) {
    //   setDarkMode(true);
    //   console.log("system dark");
    // }
  }, []);

  useEffect(() => {
    fetchScore();
  }, [user.scoreTrigger]);

  const fetchScore = () => {
    const token = localStorage.getItem("token");
    axios
      .get(BACKEND_URL + "/user/course/getScore/" + (isCP2Taken ? COURSE_ID : COURSE_ID_2), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setScore(res.data.data.score);
      })
      .catch((err) => {});
  };
  const fetchNotificationsCount = () => {
    const token = localStorage.getItem("token");
    axios
      .get(BACKEND_URL + "/user/notification/count?courseId=" + (isCP2Taken ? COURSE_ID : COURSE_ID_2), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setNotificationsCount(res.data.data[0].count);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    setUser({ ...user, darkMode: darkMode });
    if (darkMode) {
      changeToDarkMode();
    } else {
      changeToLightMode();
    }
  }, [darkMode]);

  return (
    <div className="font-hind">
      <div className="bg-gray-800 dark:bg-gray-100 bg-opacity-10  dark:bg-opacity-5 backdrop-blur-lg fixed w-full text-heading dark:text-darkHeading/90 z-50 border-b border-black/20 dark:border-gray-300/20">
        <div className="w-[90%]  mx-auto py-4">
          <div className="flex justify-between items-center ">
            <div className="flex gap-10 items-center">
              <Link href="/" className="hidden dark:block">
                <img src="/logo.png" alt="" className="w-8 md:w-14 mr-8 " />
              </Link>
              <Link href="/" className="dark:hidden">
                <img
                  src="/logo_black.png"
                  alt=""
                  className="w-8 md:w-14 mr-8 "
                />
              </Link>
              {/* {isLogged && ( */}
              <Link
                href="/course-details/15"
                className="hidden lg:block hover:text-black dark:hover:text-white ease-in-out duration-150"
              >
                কোর্স ডিটেইলস
              </Link>
              {/* )} */}

              {isLogged ? (
                lmsPreference === "unlocked" ? (
                  <a
                    href={getCoursesDashboardUrl(COURSE_ID_2)}
                    className="hidden lg:block hover:text-black dark:hover:text-white ease-in-out duration-150"
                  >
                    রেকর্ডেড কন্টেন্ট
                  </a>
                ) : (
                  <Link
                    href="/course"
                    className="hidden lg:block hover:text-black dark:hover:text-white ease-in-out duration-150"
                  >
                    রেকর্ডেড কন্টেন্ট
                  </Link>
                )
              ) : (
                ""
              )}

              {isLogged && isCP2Taken ? (
                lmsPreference === "unlocked" ? (
                  <a
                    href={appendTokenToUrl(getCoursesDashboardUrl(COURSE_ID), getAuthToken())}
                    className="hidden lg:block hover:text-black dark:hover:text-white ease-in-out duration-150"
                  >
                    CP 2.0 Progress
                  </a>
                ) : (
                  <Link
                    href="/course-cp-2"
                    className="hidden lg:block hover:text-black dark:hover:text-white ease-in-out duration-150"
                  >
                    CP 2.0 Progress
                  </Link>
                )
              ) : (
                ""
              )}

              {isLogged && (
                <Link
                  href="/live-class"
                  className="hidden lg:block hover:text-black dark:hover:text-white ease-in-out duration-150"
                >
                  লাইভ ক্লাস
                </Link>
              )}

              {/* {isLogged && (
                <Link
                  href="/ranking"
                  className="hidden lg:block hover:text-black dark:hover:text-white ease-in-out duration-150"
                >
                  র‍্যাঙ্কিং
                </Link>
              )} */}
              <Link
                href="/contests/lists"
                className="hidden lg:block hover:text-black dark:hover:text-white ease-in-out duration-150"
              >
                প্রতিযোগিতাসমূহ
              </Link>
            </div>

            {isLogged ? (
              <div className="flex gap-8 md:gap-8 items-center">
                <div className="relative">
                  {notificationsCount > 0 && (
                    <div className="bg-red-500  text-[13px] pl-[7px] pr-[8px] py-[1px] rounded-full absolute  -top-3  -right-2 text-darkHeading">
                      {notificationsCount > 9 ? "9+" : notificationsCount}
                    </div>
                  )}
                  <Link href={"/notifications"} onClick={resetBellCount}>
                    <svg
                      className="w-[20px] h-[20px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 1.25C7.71983 1.25 4.25004 4.71979 4.25004 9V9.7041C4.25004 10.401 4.04375 11.0824 3.65717 11.6622L2.50856 13.3851C1.17547 15.3848 2.19318 18.1028 4.51177 18.7351C5.26738 18.9412 6.02937 19.1155 6.79578 19.2581L6.79768 19.2632C7.56667 21.3151 9.62198 22.75 12 22.75C14.378 22.75 16.4333 21.3151 17.2023 19.2632L17.2042 19.2581C17.9706 19.1155 18.7327 18.9412 19.4883 18.7351C21.8069 18.1028 22.8246 15.3848 21.4915 13.3851L20.3429 11.6622C19.9563 11.0824 19.75 10.401 19.75 9.7041V9C19.75 4.71979 16.2802 1.25 12 1.25ZM15.3764 19.537C13.1335 19.805 10.8664 19.8049 8.62349 19.5369C9.33444 20.5585 10.571 21.25 12 21.25C13.4289 21.25 14.6655 20.5585 15.3764 19.537ZM5.75004 9C5.75004 5.54822 8.54826 2.75 12 2.75C15.4518 2.75 18.25 5.54822 18.25 9V9.7041C18.25 10.6972 18.544 11.668 19.0948 12.4943L20.2434 14.2172C21.0086 15.3649 20.4245 16.925 19.0936 17.288C14.4494 18.5546 9.5507 18.5546 4.90644 17.288C3.57561 16.925 2.99147 15.3649 3.75664 14.2172L4.90524 12.4943C5.45609 11.668 5.75004 10.6972 5.75004 9.7041V9Z"
                        className="fill-heading dark:fill-darkHeading"
                      />
                    </svg>
                  </Link>
                </div>
                <DarkModeSwitch
                  sunColor="orange"
                  moonColor="black"
                  size={20}
                  checked={!darkMode}
                  onChange={() => {
                    localStorage.setItem("darkMode", (!darkMode).toString());
                    setDarkMode(!darkMode);

                    // toggleTheme();
                  }}
                />
                {/* {false ? (
                  <Link href="/notifications" title="নোটিফিকেশানস">
                    {darkMode ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 687 783"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M337 65.6667C194.328 65.6667 78.668 181.326 78.668 324V347.47C78.668 370.7 71.7917 393.413 58.9057 412.74L20.6187 470.17C-23.8177 536.827 10.106 627.427 87.3923 648.503C112.579 655.373 137.979 661.183 163.526 665.937L163.589 666.107C189.222 734.503 257.733 782.333 337 782.333C416.267 782.333 484.777 734.503 510.41 666.107L510.473 665.937C536.02 661.183 561.423 655.373 586.61 648.503C663.897 627.427 697.82 536.827 653.383 470.17L615.097 412.74C602.21 393.413 595.333 370.7 595.333 347.47V324C595.333 181.326 479.673 65.6667 337 65.6667ZM449.547 675.233C374.783 684.167 299.213 684.163 224.45 675.23C248.148 709.283 289.367 732.333 337 732.333C384.63 732.333 425.85 709.283 449.547 675.233ZM128.668 324C128.668 208.941 221.942 115.667 337 115.667C452.06 115.667 545.333 208.941 545.333 324V347.47C545.333 380.573 555.133 412.933 573.493 440.477L611.78 497.907C637.287 536.163 617.817 588.167 573.453 600.267C418.647 642.487 255.357 642.487 100.548 600.267C56.187 588.167 36.7157 536.163 62.2213 497.907L100.508 440.477C118.87 412.933 128.668 380.573 128.668 347.47V324Z"
                          fill="#E2E8F0"
                        />
                        <circle cx="537" cy="150" r="150" fill="#EC2C2C" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 687 783"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M337 65.6667C194.328 65.6667 78.668 181.326 78.668 324V347.47C78.668 370.7 71.7917 393.413 58.9057 412.74L20.6187 470.17C-23.8177 536.827 10.106 627.427 87.3923 648.503C112.579 655.373 137.979 661.183 163.526 665.937L163.589 666.107C189.222 734.503 257.733 782.333 337 782.333C416.267 782.333 484.777 734.503 510.41 666.107L510.473 665.937C536.02 661.183 561.423 655.373 586.61 648.503C663.897 627.427 697.82 536.827 653.383 470.17L615.097 412.74C602.21 393.413 595.333 370.7 595.333 347.47V324C595.333 181.326 479.673 65.6667 337 65.6667ZM449.547 675.233C374.783 684.167 299.213 684.163 224.45 675.23C248.148 709.283 289.367 732.333 337 732.333C384.63 732.333 425.85 709.283 449.547 675.233ZM128.668 324C128.668 208.941 221.942 115.667 337 115.667C452.06 115.667 545.333 208.941 545.333 324V347.47C545.333 380.573 555.133 412.933 573.493 440.477L611.78 497.907C637.287 536.163 617.817 588.167 573.453 600.267C418.647 642.487 255.357 642.487 100.548 600.267C56.187 588.167 36.7157 536.163 62.2213 497.907L100.508 440.477C118.87 412.933 128.668 380.573 128.668 347.47V324Z"
                          fill="#000"
                        />
                        <circle cx="537" cy="150" r="150" fill="#EC2C2C" />
                      </svg>
                    )}
                  </Link>
                ) : (
                  <Link href="/notifications" title="নোটিফিকেশানস">
                    {darkMode ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 687 783"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M337 65.6667C194.328 65.6667 78.668 181.326 78.668 324V347.47C78.668 370.7 71.7917 393.413 58.9057 412.74L20.6187 470.17C-23.8177 536.827 10.106 627.427 87.3923 648.503C112.579 655.373 137.979 661.183 163.526 665.937L163.589 666.107C189.222 734.503 257.733 782.333 337 782.333C416.267 782.333 484.777 734.503 510.41 666.107L510.473 665.937C536.02 661.183 561.423 655.373 586.61 648.503C663.897 627.427 697.82 536.827 653.383 470.17L615.097 412.74C602.21 393.413 595.333 370.7 595.333 347.47V324C595.333 181.326 479.673 65.6667 337 65.6667ZM449.547 675.233C374.783 684.167 299.213 684.163 224.45 675.23C248.148 709.283 289.367 732.333 337 732.333C384.63 732.333 425.85 709.283 449.547 675.233ZM128.668 324C128.668 208.941 221.942 115.667 337 115.667C452.06 115.667 545.333 208.941 545.333 324V347.47C545.333 380.573 555.133 412.933 573.493 440.477L611.78 497.907C637.287 536.163 617.817 588.167 573.453 600.267C418.647 642.487 255.357 642.487 100.548 600.267C56.187 588.167 36.7157 536.163 62.2213 497.907L100.508 440.477C118.87 412.933 128.668 380.573 128.668 347.47V324Z"
                          fill="#E2E8F0"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 687 783"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M337 65.6667C194.328 65.6667 78.668 181.326 78.668 324V347.47C78.668 370.7 71.7917 393.413 58.9057 412.74L20.6187 470.17C-23.8177 536.827 10.106 627.427 87.3923 648.503C112.579 655.373 137.979 661.183 163.526 665.937L163.589 666.107C189.222 734.503 257.733 782.333 337 782.333C416.267 782.333 484.777 734.503 510.41 666.107L510.473 665.937C536.02 661.183 561.423 655.373 586.61 648.503C663.897 627.427 697.82 536.827 653.383 470.17L615.097 412.74C602.21 393.413 595.333 370.7 595.333 347.47V324C595.333 181.326 479.673 65.6667 337 65.6667ZM449.547 675.233C374.783 684.167 299.213 684.163 224.45 675.23C248.148 709.283 289.367 732.333 337 732.333C384.63 732.333 425.85 709.283 449.547 675.233ZM128.668 324C128.668 208.941 221.942 115.667 337 115.667C452.06 115.667 545.333 208.941 545.333 324V347.47C545.333 380.573 555.133 412.933 573.493 440.477L611.78 497.907C637.287 536.163 617.817 588.167 573.453 600.267C418.647 642.487 255.357 642.487 100.548 600.267C56.187 588.167 36.7157 536.163 62.2213 497.907L100.508 440.477C118.87 412.933 128.668 380.573 128.668 347.47V324Z"
                          fill="#000"
                        />
                      </svg>
                    )}
                  </Link>
                )} */}

                <a
                  href={"https://www.codervai.com/profile/my-courses"}
                  className=" hidden lg:block  hover:text-black dark:hover:text-white ease-in-out duration-150 text-sm md:text-base"
                >
                  {" "}
                  {token && jwtDecode<any>(token).name}
                </a>
                <div className="hidden lg:flex items-center gap-3 dark:bg-white/25 bg-black/50 px-3 py-1 rounded ">
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M21.8382 11.1263L21.609 13.5616C21.2313 17.5742 21.0425 19.5805 19.8599 20.7902C18.6773 22 16.9048 22 13.3599 22H10.6401C7.09517 22 5.32271 22 4.14009 20.7902C2.95748 19.5805 2.76865 17.5742 2.391 13.5616L2.16181 11.1263C1.9818 9.2137 1.8918 8.25739 2.21899 7.86207C2.39598 7.64823 2.63666 7.5172 2.89399 7.4946C3.36968 7.45282 3.96708 8.1329 5.16187 9.49307C5.77977 10.1965 6.08872 10.5482 6.43337 10.6027C6.62434 10.6328 6.81892 10.6018 6.99526 10.5131C7.31351 10.3529 7.5257 9.91812 7.95007 9.04852L10.1869 4.46486C10.9888 2.82162 11.3898 2 12 2C12.6102 2 13.0112 2.82162 13.8131 4.46485L16.0499 9.04851C16.4743 9.91812 16.6865 10.3529 17.0047 10.5131C17.1811 10.6018 17.3757 10.6328 17.5666 10.6027C17.9113 10.5482 18.2202 10.1965 18.8381 9.49307C20.0329 8.1329 20.6303 7.45282 21.106 7.4946C21.3633 7.5172 21.604 7.64823 21.781 7.86207C22.1082 8.25739 22.0182 9.2137 21.8382 11.1263ZM12.9524 12.699L12.8541 12.5227C12.4741 11.841 12.2841 11.5002 12 11.5002C11.7159 11.5002 11.5259 11.841 11.1459 12.5227L11.0476 12.699C10.9397 12.8927 10.8857 12.9896 10.8015 13.0535C10.7173 13.1174 10.6125 13.1411 10.4028 13.1886L10.2119 13.2318C9.47396 13.3987 9.10501 13.4822 9.01723 13.7645C8.92945 14.0468 9.18097 14.3409 9.68403 14.9291L9.81418 15.0813C9.95713 15.2485 10.0286 15.3321 10.0608 15.4355C10.0929 15.5389 10.0821 15.6504 10.0605 15.8734L10.0408 16.0765C9.96476 16.8613 9.92674 17.2538 10.1565 17.4282C10.3864 17.6027 10.7318 17.4436 11.4227 17.1255L11.6014 17.0432C11.7978 16.9528 11.8959 16.9076 12 16.9076C12.1041 16.9076 12.2022 16.9528 12.3986 17.0432L12.5773 17.1255C13.2682 17.4436 13.6136 17.6027 13.8435 17.4282C14.0733 17.2538 14.0352 16.8613 13.9592 16.0765L13.9395 15.8734C13.9179 15.6504 13.9071 15.5389 13.9392 15.4355C13.9714 15.3321 14.0429 15.2485 14.1858 15.0813L14.316 14.9291C14.819 14.3409 15.0706 14.0468 14.9828 13.7645C14.895 13.4822 14.526 13.3987 13.7881 13.2318L13.5972 13.1886C13.3875 13.1411 13.2827 13.1174 13.1985 13.0535C13.1143 12.9896 13.0603 12.8927 12.9524 12.699Z"
                      fill="#fff"
                    />
                  </svg>
                  <p className="text-xl font-semibold text-darkHeading">
                    {score}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="hidden lg:block md:px-8 px-4 py-2 rounded-lg bg-red-200 text-red-900 dark:text-darkHeading dark:bg-red-900 bg-opacity-30 dark:bg-opacity-10 backdrop-blur-xl hover:bg-opacity-100 ease-in-out duration-150 text-sm md:text-base"
                >
                  Logout
                </button>
                {darkMode ? (
                  <RxHamburgerMenu
                    onClick={() => setMenuShow(!menuShow)}
                    className="lg:hidden cursor-pointer"
                    size={22}
                    color="white"
                  />
                ) : (
                  <RxHamburgerMenu
                    onClick={() => setMenuShow(!menuShow)}
                    className="lg:hidden cursor-pointer"
                    size={22}
                    color="black"
                  />
                )}
              </div>
            ) : (
              <div className="flex gap-8 md:gap-8 items-center">
                <DarkModeSwitch
                  sunColor="orange"
                  moonColor="black"
                  size={20}
                  checked={!darkMode}
                  onChange={() => {
                    localStorage.setItem("darkMode", (!darkMode).toString());
                    setDarkMode(!darkMode);

                    // toggleTheme();
                  }}
                />
                <a
                  href="https://www.codervai.com/auth/login?redirect=cp.codervai.com"
                  className=" hidden lg:block hover:text-black dark:hover:text-white ease-in-out duration-150 text-sm md:text-base"
                >
                  লগ ইন
                </a>
                <a
                  href="https://www.codervai.com/auth/register?redirect=cp.codervai.com"
                  className="hidden lg:block md:px-8 px-4 py-2 rounded-lg bg-gray-900 bg-opacity-5 backdrop-blur-xl hover:text-black dark:hover:text-white ease-in-out duration-150 text-sm md:text-base"
                >
                  শুরু করুন
                </a>
                <RxHamburgerMenu
                  onClick={() => setMenuShow(!menuShow)}
                  className="lg:hidden cursor-pointer"
                  size={22}
                  color="white"
                />
              </div>
            )}
          </div>
        </div>
        {/* mobile menu */}
      </div>
      <div
        className={`dark:bg-gray-700/40  bg-gray-200/80 backdrop-blur-xl lg:hidden fixed w-full z-40 text-heading dark:text-darkHeading  top-[58px] md:top-[76px] border-b border-white/30 duration-150 ease-out ${
          menuShow ? "translate-y-0" : "-translate-y-[170%]"
        }`}
      >
        <div className="w-[90%] lg:w-[80%] mx-auto py-8 ">
          <div className="flex flex-col justify-between items-center ">
            <div className="flex flex-col gap-10 items-center">
              {/* <Link
                href=""
                className="  hover:text-black dark:hover:text-white ease-in-out duration-150"
              >
                নোটিফিকেশান
              </Link> */}
              {/* {isLogged && (
                <Link
                href="/live-class"
                  className="  hover:text-black dark:hover:text-white ease-in-out duration-150"
                >
                  লাইভ ক্লাস শিডিউল
                </Link>
              )} */}
              {/* <Link
                href="/course-details/12"
                className=" hover:text-black dark:hover:text-white ease-in-out duration-150"
              >
                কোস কন্টেন্ট
              </Link> */}
              {/* {isLogged ? (
                <Link
                  href="/course/12"
                  className=" hover:text-black dark:hover:text-white ease-in-out duration-150"
                >
                  আপনার প্রোগ্রেস
                </Link>
              ) : (
                <Link
                  href="/course/12"
                  className=" hover:text-black dark:hover:text-white ease-in-out duration-150"
                >
                  ফ্রি ট্রায়াল
                </Link>
              )} */}

              {isLogged ? (
                lmsPreference === "unlocked" ? (
                  <a
                    href={getCoursesDashboardUrl(COURSE_ID_2)}
                    className=" hover:text-black dark:hover:text-white ease-in-out duration-150"
                  >
                    আপনার প্রোগ্রেস
                  </a>
                ) : (
                  <Link
                    href="/course"
                    className=" hover:text-black dark:hover:text-white ease-in-out duration-150"
                  >
                    আপনার প্রোগ্রেস
                  </Link>
                )
              ) : (
                ""
              )}

              {isLogged && isCP2Taken ? (
                lmsPreference === "unlocked" ? (
                  <a
                    href={appendTokenToUrl(getCoursesDashboardUrl(COURSE_ID), getAuthToken())}
                    className=" hover:text-black dark:hover:text-white ease-in-out duration-150"
                  >
                    CP 2.0 Progress
                  </a>
                ) : (
                  <Link
                    href="/course-cp-2"
                    className=" hover:text-black dark:hover:text-white ease-in-out duration-150"
                  >
                    CP 2.0 Progress
                  </Link>
                )
              ) : (
                ""
              )}

              {/* {isLogged && (
                <Link
                  href="/ranking"
                  className=" hover:text-black dark:hover:text-white ease-in-out duration-150"
                >
                  র‍্যাঙ্কিং
                </Link>
              )} */}
            </div>

            {!isLogged ? (
              <div className="flex flex-col gap-8 items-center mt-8">
                <a
                  href="https://www.codervai.com/auth/login?redirect=cp.codervai.com"
                  className="  hover:text-black dark:hover:text-white ease-in-out duration-150 text-sm md:text-base"
                >
                  লগ ইন
                </a>
                <a
                  href="https://www.codervai.com/auth/register?redirect=cp.codervai.com"
                  className=" md:px-8 px-4 py-2 rounded-lg bg-white bg-opacity-30 backdrop-blur-xl hover:text-black dark:hover:text-white ease-in-out duration-150 text-sm md:text-base"
                >
                  শুরু করুন
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-8 items-center mt-8">
                <a
                  href={"https://www.codervai.com/profile/my-courses"}
                  className="  hover:text-black dark:hover:text-white ease-in-out duration-150 text-sm md:text-base"
                >
                  {token && jwtDecode<any>(token).name}
                </a>
                <div className="flex items-center gap-3 dark:bg-white/25 bg-black/50 px-3 py-1 rounded ">
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M21.8382 11.1263L21.609 13.5616C21.2313 17.5742 21.0425 19.5805 19.8599 20.7902C18.6773 22 16.9048 22 13.3599 22H10.6401C7.09517 22 5.32271 22 4.14009 20.7902C2.95748 19.5805 2.76865 17.5742 2.391 13.5616L2.16181 11.1263C1.9818 9.2137 1.8918 8.25739 2.21899 7.86207C2.39598 7.64823 2.63666 7.5172 2.89399 7.4946C3.36968 7.45282 3.96708 8.1329 5.16187 9.49307C5.77977 10.1965 6.08872 10.5482 6.43337 10.6027C6.62434 10.6328 6.81892 10.6018 6.99526 10.5131C7.31351 10.3529 7.5257 9.91812 7.95007 9.04852L10.1869 4.46486C10.9888 2.82162 11.3898 2 12 2C12.6102 2 13.0112 2.82162 13.8131 4.46485L16.0499 9.04851C16.4743 9.91812 16.6865 10.3529 17.0047 10.5131C17.1811 10.6018 17.3757 10.6328 17.5666 10.6027C17.9113 10.5482 18.2202 10.1965 18.8381 9.49307C20.0329 8.1329 20.6303 7.45282 21.106 7.4946C21.3633 7.5172 21.604 7.64823 21.781 7.86207C22.1082 8.25739 22.0182 9.2137 21.8382 11.1263ZM12.9524 12.699L12.8541 12.5227C12.4741 11.841 12.2841 11.5002 12 11.5002C11.7159 11.5002 11.5259 11.841 11.1459 12.5227L11.0476 12.699C10.9397 12.8927 10.8857 12.9896 10.8015 13.0535C10.7173 13.1174 10.6125 13.1411 10.4028 13.1886L10.2119 13.2318C9.47396 13.3987 9.10501 13.4822 9.01723 13.7645C8.92945 14.0468 9.18097 14.3409 9.68403 14.9291L9.81418 15.0813C9.95713 15.2485 10.0286 15.3321 10.0608 15.4355C10.0929 15.5389 10.0821 15.6504 10.0605 15.8734L10.0408 16.0765C9.96476 16.8613 9.92674 17.2538 10.1565 17.4282C10.3864 17.6027 10.7318 17.4436 11.4227 17.1255L11.6014 17.0432C11.7978 16.9528 11.8959 16.9076 12 16.9076C12.1041 16.9076 12.2022 16.9528 12.3986 17.0432L12.5773 17.1255C13.2682 17.4436 13.6136 17.6027 13.8435 17.4282C14.0733 17.2538 14.0352 16.8613 13.9592 16.0765L13.9395 15.8734C13.9179 15.6504 13.9071 15.5389 13.9392 15.4355C13.9714 15.3321 14.0429 15.2485 14.1858 15.0813L14.316 14.9291C14.819 14.3409 15.0706 14.0468 14.9828 13.7645C14.895 13.4822 14.526 13.3987 13.7881 13.2318L13.5972 13.1886C13.3875 13.1411 13.2827 13.1174 13.1985 13.0535C13.1143 12.9896 13.0603 12.8927 12.9524 12.699Z"
                      fill="#fff"
                    />
                  </svg>
                  <p className="text-xl font-semibold text-darkHeading">
                    {score}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className=" md:px-8 px-4 py-2 rounded-lg bg-red-300 text-red-900 dark:text-darkHeading dark:bg-red-900 bg-opacity-80 dark:bg-opacity-10 backdrop-blur-xl hover:text-black dark:hover:text-white ease-in-out duration-150 text-sm md:text-base"
                >
                  Logout
                </button>
              </div>
            )}
          </div>{" "}
        </div>{" "}
      </div>
    </div>
  );
}
