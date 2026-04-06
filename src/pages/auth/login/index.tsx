import Nav from "@/components/Nav";
import React, { useState, useContext, useEffect } from "react";
import { HindSiliguri } from "@/helpers";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { UserContext } from "@/Contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { capitalizeFirstWord, isLoggedIn, setCookieWithDomain } from "@/helpers";

type Props = {};

export default function RegisterPage({}: Props) {
  const [userData, setUserData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const [user, setUser] = useContext<any>(UserContext);
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  const submitHandler = (e: any) => {
    e.preventDefault();
    setUser({ ...user, loading: true });
    axios
      .post(BACKEND_URL + "/admin/auth/login", {
        login: userData.email,
        password: userData.password,
      })
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem("token", token);
        setCookieWithDomain("token", token, ".codervai.com");
        setUser({ ...user, loading: false });
        setErrorMsg("");
        router.push("/course-details/12");
      })
      .catch((err) => {
        setUser({ ...user, loading: false });

        setErrorMsg(capitalizeFirstWord(err.response.data.error));
      });
  };

  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/course-details/12");
    }
  }, []);

  return (
    <div className={`  ${HindSiliguri.variable} font-hind  `}>
      <Nav></Nav>
      <div className="pt-20 bg-white dark:bg-[#0B060D] overflow-x-hidden min-h-[100vh] relative">
        <svg
          className="absolute h-full w-full z-0 -top-20"
          viewBox="0 0 1215 926"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_748_4329)">
            <ellipse
              cx="549.662"
              cy="328.453"
              rx="167.107"
              ry="94.0796"
              transform="rotate(-10.6934 549.662 328.453)"
              fill="#B153E0"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_748_4329"
              x="-115.482"
              y="-269.081"
              width="1330.29"
              height="1195.07"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="250"
                result="effect1_foregroundBlur_748_4329"
              />
            </filter>
          </defs>
        </svg>
        <div className="w-[90%] lg:w-[80%] mx-auto py-16 z-20">
          <form
            onSubmit={submitHandler}
            className="px-8 py-6 text-heading dark:text-darkHeading bg-gray-400/50 dark:bg-gray-100/5  backdrop-blur-xl rounded-xl  lg:w-[50%] mx-auto flex flex-col items-center  gap-4"
          >
            <h2 className="text-2xl font-semibold">Login</h2>

            <div className="w-full">
              <p className="text-lg font-semibold mb-1">Phone Number</p>
              <input
                className="w-full px-3 py-3 rounded bg-gray-200   dark:bg-gray-200/20 outline-none focus:ring ring-gray-400/80 dark:ring-gray-300/80"
                placeholder="Phone Number"
                value={userData.email}
                required
 
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </div>
            <div className="w-full">
              <p className="text-lg font-semibold mb-1">Password</p>
              <input
                className="w-full px-3 py-3 rounded bg-gray-200     dark:bg-gray-200/20 outline-none focus:ring ring-gray-400/80 dark:ring-gray-300/80"
                placeholder="Password"
                value={userData.password}
                required
                type="password"
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
              />
              {errorMsg.length > 0 && (
                <p className="text-red-500">{errorMsg}</p>
              )}
              <div className="flex justify-end  ">
                <Link
                  href="/auth/forgot-password"
                  className="hover:underline text-purple mt-1"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="flex font-semibold gap-2 mt-2">
                <p>Don{"'"}t have an account? </p>
                <Link
                  href="/auth/register"
                  className="text-purple hover:underline"
                >
                  Register
                </Link>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="py-2 px-8 bg-[#532e62] hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80  rounded font-semibold text-white text-lg "
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
