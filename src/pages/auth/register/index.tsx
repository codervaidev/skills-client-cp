import Nav from "@/components/Nav";
import React, { useState, useContext, useEffect } from "react";
import { HindSiliguri } from "@/helpers";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { UserContext } from "@/Contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { isLoggedIn, setCookieWithDomain } from "@/helpers";
import Button from "@/components/Button";
import bcrypt from "bcryptjs-react";

type Props = {};

export default function RegisterPage({}: Props) {
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    password: string;
    phone: any;
    confirmPass: any;
    currentInstitution: any;
    department: any;
    currentAcademicLevel: any;
    interestedTopic: any;
  }>({
    name: "",
    email: "",
    password: "",
    phone: "",
    confirmPass: "",
    currentInstitution: "",
    department: "",
    currentAcademicLevel: "",
    interestedTopic: "",
  });
  const router = useRouter();

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [user, setUser] = useContext<any>(UserContext);
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [otpHash, setOtpHash] = useState("");

  const submitHandler = (e: any) => {
    e.preventDefault();
    setSubmitButtonLoading(true);

    if (otp.length > 0) {
      const compareOtp = bcrypt.compareSync(otp, otpHash);

      if (compareOtp) {
        axios
          .post(BACKEND_URL + "/admin/auth/register-user", {
            login: userData.phone,
            password: userData.password,
            name: userData.name,
            type: 3,
            profile: {
              email: userData.email,
              currentInstitution: userData.currentInstitution,
              department: userData.department,
              currentAcademicLevel: userData.currentAcademicLevel,
              interestedTopic: userData.interestedTopic,
            },
          })
          .then((res) => {
            const token = res.data.token;
            localStorage.setItem("token", token);
            setCookieWithDomain("token", token, ".codervai.com");
            setSubmitButtonLoading(false);
            router.push("/course-details/12");
          })
          .catch((err) => {
            setSubmitButtonLoading(false);
          });
      } else {
        setErrorMsg("Wrong OTP!");
        setSubmitButtonLoading(false);
      }
    } else {
      if (userData.password === userData.confirmPass) {
        axios
          .get(BACKEND_URL + "/admin/auth/otp/" + userData.phone)
          .then((res) => {
            setSubmitButtonLoading(false);
            setOtpHash(res.data.data.otp);
            setShowOtp(true);
            setIsPhoneVerified(true);
          })
          .catch((err) => {
            setErrorMsg(err.response.data.data);
            setSubmitButtonLoading(false);
          });
      } else {
        setErrorMsg("The Paswords Must Match!");
        setSubmitButtonLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/course-details/12");
    }
  }, []);

  return (
    <div className={`  ${HindSiliguri.variable} font-hind  `}>
      <Nav></Nav>
      <div className="pt-20  bg-white dark:bg-[#0B060D] overflow-x-hidden min-h-[100vh] relative">
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
            className="px-8 py-6 text-heading dark:text-darkHeading bg-gray-400/30 dark:bg-gray-100/5  backdrop-blur-xl rounded-xl  lg:w-[50%] mx-auto flex flex-col items-center  gap-4"
          
            onSubmit={submitHandler}
          >
            <h2 className="text-2xl font-semibold">Register</h2>
            <div className="w-full">
              <p className="text-lg font-semibold mb-1">Name</p>
              <input
                className="w-full px-3 py-3 rounded bg-gray-200   dark:bg-gray-200/20 outline-none focus:ring ring-gray-400/80 dark:ring-gray-300/80"
                placeholder="Name"
                value={userData.name}
                required
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
            </div>
            <div className="w-full">
              <p className="text-lg font-semibold mb-1">Phone</p>
              <input
                disabled={isPhoneVerified}
                className="w-full px-3 py-3 rounded bg-gray-200   dark:bg-gray-200/20 outline-none focus:ring ring-gray-400/80 dark:ring-gray-300/80"
                placeholder="Phone Number"
                value={userData.phone}
                required
                type="number"
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
              />
            </div>
            <div className="w-full">
              <p className="text-lg font-semibold mb-1">Email</p>
              <input
                className="w-full px-3 py-3 rounded bg-gray-200   dark:bg-gray-200/20 outline-none focus:ring ring-gray-400/80 dark:ring-gray-300/80"
                
                placeholder="Email"
                value={userData.email}
                type="email"
                required
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </div>
            <div className="w-full">
              <p className="text-lg font-semibold mb-1">Password</p>
              <input
                className="w-full px-3 py-3 rounded bg-gray-200   dark:bg-gray-200/20 outline-none focus:ring ring-gray-400/80 dark:ring-gray-300/80"
                placeholder="Password"
                value={userData.password}
                type="password"
                required
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
              />
            </div>

            <div className="w-full">
              <p className="text-lg font-semibold mb-1">Confirm Password</p>
              <input
                className="w-full px-3 py-3 rounded bg-gray-200   dark:bg-gray-200/20 outline-none focus:ring ring-gray-400/80 dark:ring-gray-300/80"
                placeholder="Password"
                value={userData.confirmPass}
                type="password"
                required
                onChange={(e) =>
                  setUserData({ ...userData, confirmPass: e.target.value })
                }
              />
            </div>
            <div className="w-full">
              <p className="text-lg font-semibold mb-1">Current Institution</p>
              <input
                className="w-full px-3 py-3 rounded bg-gray-200   dark:bg-gray-200/20 outline-none focus:ring ring-gray-400/80 dark:ring-gray-300/80"
                placeholder="Current Institution"
                value={userData.currentInstitution}
                required
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    currentInstitution: e.target.value,
                  })
                }
              />
            </div>
            <div className="w-full">
              <p className="text-lg font-semibold mb-1">
                Current Academic Level
              </p>
              <select
                className="select select-bordered w-full bg-gray-400/20 dark:bg-gray-200/20"
                required
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    currentAcademicLevel: e.target.value,
                  });
                }}
                value={userData.currentAcademicLevel}
              >
                <option className="bg-gray-400/20 dark:bg-[#0B060D]" defaultChecked disabled>
                  Select an option
                </option>
                <option className="bg-gray-400/20 dark:bg-[#0B060D]" value="SSC">
                  SSC
                </option>
                <option className="bg-gray-400/20 dark:bg-[#0B060D]" value="HSC">
                  HSC
                </option>
                <option className="bg-gray-400/20 dark:bg-[#0B060D]" value="UNIVERSITY">
                  University
                </option>
                <option className="bg-gray-400/20 dark:bg-[#0B060D]" value="OTHERS">
                  OTHERS
                </option>
              </select>
            </div>
            <div className="w-full">
              <p className="text-lg font-semibold mb-1">
                Department{" "}
                <span className="text-sm text-paragraph  dark:text-darkParagraph font-normal">
                  optional
                </span>
              </p>
              <input
                                className="w-full px-3 py-3 rounded bg-gray-200   dark:bg-gray-200/20 outline-none focus:ring ring-gray-400/80 dark:ring-gray-300/80"

                placeholder="Optional"
                value={userData.department}
                onChange={(e) =>
                  setUserData({ ...userData, department: e.target.value })
                }
              />
            </div>

            <div className="w-full">
              <p className="text-lg font-semibold mb-1">
                Interested to learn{" "}
                <span className="text-sm text-paragraph  dark:text-darkParagraph font-normal">
                  optional
                </span>
              </p>
              <select
                className="select select-bordered w-full bg-gray-400/20  dark:bg-gray-200/20"
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    interestedTopic: e.target.value,
                  });
                }}
                value={userData.interestedTopic}
              >
                <option className="bg-[#0B060D]" defaultChecked disabled>
                  Select an option
                </option>
                <option className="bg-[#0B060D]" value="WEB">
                  Web
                </option>
                <option className="bg-[#0B060D]" value="Android">
                  Android
                </option>
                <option className="bg-[#0B060D]" value="COMPETITIVEPROGRAMMING">
                  Competitive Programming
                </option>
              </select>
            </div>

            <div className="w-full">
              <div className="flex font-semibold gap-2 mt-3">
                <p>Already have an account? </p>
                <Link
                  href="/auth/login"
                  className="text-purple hover:underline"
                >
                  Login
                </Link>
              </div>
            </div>

            {showOtp && (
              <div className="w-full">
                <p className="text-green-400">OTP sent to your Phone Number</p>
                <p className="text-lg font-semibold mb-1 mt-1">Enter OTP</p>
                <input
                  className="w-full px-3 py-3 rounded bg-gray-200/20 outline-none focus:ring ring-gray-300/80"
                  placeholder="OTP"
                  value={otp}
                  type="number"
                  required
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}
            {errorMsg.length > 0 && <p className="text-red-400">{errorMsg}</p>}

            <div className="mt-4">
              <Button
                type="submit"
                loading={submitButtonLoading}
                bgColor={"#532e62"}
                label="Submit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
