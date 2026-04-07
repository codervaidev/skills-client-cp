import Nav from "@/components/Nav";
import { HindSiliguri } from "@/helpers";
import Link from "next/link";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Editor from "@monaco-editor/react";
import { useContext, useEffect, useState, Fragment, useMemo } from "react";
import { UserContext } from "@/Contexts/UserContext";
import { BACKEND_URL } from "@/api.config";
import axios from "axios";
import { useRouter } from "next/router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CircularProgress } from "@mui/material";
import Button from "@/components/Button";
import { formatDate } from "@/helpers";
import { CodeBlock, atomOneDark } from "react-code-blocks";
import FloatingCompiler from "@/components/FloatingCompiler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { Dialog, Transition } from "@headlessui/react";
import { set } from "zod";

const testCases = ["[1,23,4]", "[33,35]"];

export default function CourseDetailsPage() {
  const [isEditorialOpen, setIsEditorialOpen] = useState<any>(false);
  const [editorialWarningOpen, setEditorialWarningOpen] = useState<any>(false);
  const codeString =
    "Input: obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]] \nOutput: 2\nExplanation: There is one obstacle in the middle of the 3x3 grid above.\nThere are two ways to reach the bottom-right corner:\n1. Right -> Right -> Down -> Down\n2. Down -> Down -> Right -> Right";
  const router = useRouter();
  const [testCaseTab, setTestCaseTab] = useState({
    testcase: true,
    result: false,
  });

  const [resultData, setResultData] = useState<any>({
    title: "Run Or Submit the problem first",
    message: {},
  });

  const [problemTab, setProblemTab] = useState({
    problem: true,
    editorial: false,
    submissions: false,
    activeSubmission: false,
  });

  const [user, setUser] = useContext<any>(UserContext);

  const changeTestCaseTab = (tabName: string) => {
    let temp: any = {
      testcase: false,
      result: false,
    };
    temp[tabName] = true;

    setTestCaseTab(temp);
  };
  const changeProblemTab = (tabName: string) => {
    let temp: any = {
      problem: false,
      editorial: false,
      submissions: false,
      activeSubmission: false,
    };
    temp[tabName] = true;

    setProblemTab(temp);
  };

  const submitViewedEditorial = (module_id: any) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `${BACKEND_URL}/user/module/viewEditorial/${module_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        fetchHasViewed();
        setEditorialWarningOpen(false);
        // toast.success("Editorial is open now!")
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
      });
  };

  const submitProgress = (module_id: any, score: any) => {
    const token = localStorage.getItem("token");

    axios
      .post(
        `${BACKEND_URL}/user/module/addProgress/${module_id}?points=${score}&type=${problemData?.data?.category}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {})
      .catch((err) => {});
  };

  const [code, setCode] = useState<any>({
    java: ` class HelloWorld {
        public static void main(String[] args) {
            System.out.println("Hello, World!"); 
        }
    }`,
    python: `print("hello World")`,
    cpp: `#include<bits/stdc++.h>
using namespace std; 
    
int main(){
    
    
}`,
  });

  const [submissions, setSubmissions] = useState<any>([]);

  const [language, setLanguage] = useState("cpp");

  const [activeTestCase, setActiveTestCase] = useState(0);
  const [problemData, setProblemData] = useState<any>({});

  const languageIds: any = {
    cpp: 76,
    python: 71,
    java: 91,
  };
  const languageIdsToName: any = {
    76: "cpp",
    71: "python",
    91: "java",
  };
  const [activeSubmission, setActiveSubmission] = useState<any>({});
  const [runButtonLoading, setRunButtonLoading] = useState(false);
  const [submitButtonLoading, setsubmitButtonLoading] = useState(false);

  const fetchModule = () => {
    setUser({ ...user, loading: true });

    const token = localStorage.getItem("token");

    axios
      .get(BACKEND_URL + "/user/module/get/" + router.query.problemId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser({ ...user, loading: false });
        setProblemData(res.data.data[0]);
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
      });
  };
  const fetchHasViewed = () => {
    const token = localStorage.getItem("token");

    axios
      .get(BACKEND_URL + "/user/module/hasViewed/" + router.query.problemId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setIsEditorialOpen(res.data.data.hasViewed);
      })
      .catch((err) => {});
  };
  const fetchSubmissions = () => {
    // setUser({ ...user, loading: true });

    const token = localStorage.getItem("token");

    axios
      .get(
        BACKEND_URL +
          "/user/module/getMyCompilations/" +
          router.query.problemId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setUser({ ...user, loading: false });
        // setProblemData(res.data.data[0]);
        setSubmissions(res.data.data);
        res.data.data.map((elem: any) => {
          if (elem.data.verdict === "Accepted") {
            setIsEditorialOpen(true);
          }
        });
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
      });
  };

  useEffect(() => {
    fetchHasViewed();
    fetchModule();
    fetchSubmissions();
  }, [router.query.problemId]);

  const returnToModulePath = useMemo(() => {
    const problemId = router.query.problemId as string | undefined;
    const chapterId = router.query.chapterId as string | undefined;
    const course = router.query.course as string | undefined;

    if (!problemId || !chapterId || !course) return null;
    if (course !== "course" && course !== "course-cp-2") return null;

    return `/${course}/${chapterId}/${problemId}`;
  }, [router.query.problemId, router.query.chapterId, router.query.course]);

  return (
    <ProtectedRoute>
      <div className={`  ${HindSiliguri.variable} font-hind  `}>
        <Nav></Nav>
        <Transition appear show={editorialWarningOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative "
            style={{ zIndex: 99999 }}
            onClose={() => {
              // setCoursePurchaseSuccessfull(false);
            }}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="md:w-[50vw] lg:w-[40vw] text-darkHeading transform overflow-hidden  rounded-2xl bg-gray-900/70 backdrop-blur-3xl border border-gray-300/30  text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="div"
                      className="text-lg font-medium leading-6 p-2 "
                    >
                      <div className="flex justify-end">
                        <button
                          className="hover:bg-gray-300/20 p-2 mr-2 rounded"
                          onClick={() => {
                            setEditorialWarningOpen(false);
                          }}
                        >
                          <svg
                            width="14"
                            height="15"
                            viewBox="0 0 14 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13 1.25L1 13.25M1 1.25L13 13.25"
                              stroke="#FBEEEC"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </Dialog.Title>
                    <div className="border-b border-t border-gray-300/20 py-3 px-6">
                      <div className="flex flex-col items-center ">
                        <FontAwesomeIcon
                          icon={faTriangleExclamation}
                          className="text-4xl text-orange-300"
                        />
                        <p className="text-xl font-bold text-darkHeading mt-1">
                          Warning!
                        </p>
                        <p className="text-darkHeading text-center mt-1 ">
                          Hold on! Opening the editorial for
                          <span className=" text-lg text-white font-bold">
                            {" "}
                            {problemData.title}
                          </span>{" "}
                          won{`'`}t give you points. Try solving it yourself
                          first!
                        </p>
                      </div>
                    </div>
                    <div className="p-6 flex gap-4">
                      <button
                        onClick={() => {
                          setEditorialWarningOpen(false);
                        }}
                        className={`bg-gray-300/30 hover:opacity-60 ease-in-out duration-150  text-darkHeading py-3 w-full  rounded-xl font-bold`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          submitViewedEditorial(problemData.id);
                        }}
                        className={`bg-red-600 hover:bg-opacity-50 ease-in-out duration-150  text-darkHeading py-3 w-full  rounded-xl font-bold`}
                      >
                        Open
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
        <div className="pt-16 pb-1 bg-white dark:bg-[#0B060D] overflow-x-hidden">
          <div className="w-[98%]  mx-auto pt-8 z-20">
            <div className="flex flex-col lg:flex-row gap-2 justify-between relative">
              <svg
                viewBox="0 0 1215 926"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-0 top-0 w-full h-full z-0"
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
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
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

              <div
                className={`text-heading dark:text-darkHeading border border-gray-400/50 dark:border-gray-300/10 bg-gray-400/10 dark:bg-gray-100/5 backdrop-blur-xl rounded-xl  flex-1 lg:h-[88.5vh] lg:overflow-y-scroll  z-10 ${
                  user.darkMode ? "darkCustomScrollbar" : "customScrollbar"
                } `}
              >
                <div className=" py-6  text-heading dark:text-darkHeading   ">
                  <div className="px-4 ">
                    <h2 className="text-2xl font-semibold">
                      {problemData.title}
                    </h2>
                    {/* <p className="text-lg font-semibold text-green-400 mt-2">
                    Medium
                  </p> */}
                  </div>

                  <div className="px-4 flex gap-6 mt-4 border-b border-gray-400/50 dark:border-gray-300/10">
                    <p
                      className={` text-xl font-semibold pb-2 cursor-pointer
                  ${
                    problemTab.problem
                      ? "border-b border-black dark:border-white text-heading dark:text-darkHeading"
                      : "text-paragraph dark:text-darkParagraph/70"
                  }  
                     `}
                      onClick={() => {
                        changeProblemTab("problem");
                      }}
                    >
                      Problem
                    </p>
                    {isEditorialOpen ? (
                      <p
                        className={` text-xl font-semibold pb-2 cursor-pointer
                    ${
                      problemTab.editorial
                        ? "border-b border-black dark:border-white text-heading dark:text-darkHeading"
                        : "text-paragraph dark:text-darkParagraph/70"
                    }  
                       `}
                        onClick={() => {
                          changeProblemTab("editorial");
                        }}
                      >
                        Editorial
                      </p>
                    ) : (
                      <div className="flex items-center gap-1 pb-2 cursor-pointer">
                        <p
                          className={` text-xl font-semibold 
                    ${
                      problemTab.editorial
                        ? "border-b border-black dark:border-white text-heading dark:text-darkHeading"
                        : "text-paragraph dark:text-darkParagraph/70"
                    }  
                       `}
                          onClick={() => {
                            //somefucntion about opening editorial

                            setEditorialWarningOpen(true);
                          }}
                        >
                          Editorial
                        </p>
                        <FontAwesomeIcon
                          icon={faLock}
                          className="text-orange-300"
                        />
                      </div>
                    )}
                    <p
                      className={` text-xl font-semibold pb-2 cursor-pointer 
                    ${
                      problemTab.submissions
                        ? "border-b border-black dark:border-white text-heading dark:text-darkHeading"
                        : "text-paragraph dark:text-darkParagraph/70"
                    }  
                       `}
                      onClick={() => {
                        changeProblemTab("submissions");
                      }}
                    >
                      Submissions
                    </p>
                    {activeSubmission?.data?.verdict && (
                      <div className="flex gap-1 ">
                        <p
                          className={` text-xl font-semibold pb-2 cursor-pointer 
                    ${
                      problemTab.activeSubmission
                        ? "border-b border-black dark:border-white text-heading dark:text-darkHeading"
                        : "text-paragraph dark:text-darkParagraph/70"
                    }  
                       `}
                          onClick={() => {
                            changeProblemTab("activeSubmission");
                          }}
                        >
                          {activeSubmission?.data?.verdict}
                        </p>
                        <div
                          onClick={() => {
                            changeProblemTab("submissions");
                            setActiveSubmission({});
                          }}
                          className="dark:hover:bg-gray-100/20 hover:bg-gray-400/50 rounded-full h-[24px] mt-1 cursor-pointer"
                        >
                          <svg
                            width="24"
                            viewBox="0 -0.5 25 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              {" "}
                              <path
                                d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z"
                                fill={user.darkMode ? "#e2e8f0" : "#000"}
                              ></path>{" "}
                            </g>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  {problemTab.problem && (
                    <div className="px-4">
                      <div
                        className="text-xl flex flex-col gap-8 mt-6 break-words"
                        dangerouslySetInnerHTML={{
                          __html: problemData?.data?.body,
                        }}
                      ></div>

                      <div className="mt-8">
                        <p className="text-2xl font-semibold mb-2 ">Input</p>
                        <div
                          className="text-xl"
                          dangerouslySetInnerHTML={{
                            __html: problemData?.data?.input,
                          }}
                        ></div>

                        {/* <img src="/robot1.jpg" alt="" className="my-6" />
                  <SyntaxHighlighter language="markdown" style={dracula}>
                    {codeString}
                  </SyntaxHighlighter> */}
                      </div>
                      <div className="mt-8">
                        <p className="text-2xl font-semibold mb-2 ">Output</p>
                        <div
                          className="text-xl"
                          dangerouslySetInnerHTML={{
                            __html: problemData?.data?.output,
                          }}
                        ></div>
                      </div>
                      <div className="mt-8">
                        <p className="text-2xl font-semibold mb-2 ">Example</p>
                        <p className="text-lg font-semibold mb-2 ">Input</p>
                        <div
                          className="text-xl text-darkHeading bg-[#282A36] p-4"
                          dangerouslySetInnerHTML={{
                            __html: problemData?.data?.inputSample,
                          }}
                        ></div>
                        <p className="text-lg font-semibold my-4 ">Output</p>
                        <div
                          className="text-xl bg-[#282A36] p-4 text-darkHeading"
                          dangerouslySetInnerHTML={{
                            __html: problemData?.data?.outputSample,
                          }}
                        ></div>
                      </div>
                      <div className="mt-8">
                        <p className="text-2xl font-semibold mb-2 ">Notes</p>
                        <div
                          className="text-xl"
                          dangerouslySetInnerHTML={{
                            __html: problemData?.data?.notes,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {problemTab.editorial && (
                    <div className="px-4">
                      {/* <p className="text-2xl text-heading dark:text-darkHeading my-4 font-semibold">Tutorial Video</p> */}
                      {problemData?.data?.editorialVideoHost === "Youtube" && (
                        <iframe
                          className="rounded-xl mt-10 mb-8 w-full min-h-[260px]  md:min-h-[400px]  lg:min-h-[500px] "
                          src={problemData?.data?.editorial_video_url}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      )}
                      {problemData?.data?.editorialVideoHost === "BunnyCDN" && (
                        <iframe
                          className="rounded-xl mt-10 mb-8 w-full min-h-[260px]  md:min-h-[400px]  lg:min-h-[500px] "
                          src={problemData?.data?.editorial_video_url}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      )}
                      <div
                        className="text-xl flex flex-col gap-8 mt-6"
                        dangerouslySetInnerHTML={{
                          __html: problemData?.data?.editorial_details,
                        }}
                      ></div>
                      {/* <div
                        className="text-xl flex flex-col gap-8 mt-6 text-darkHeading bg-[#282A36] p-4"
                        dangerouslySetInnerHTML={{
                          __html: problemData?.data?.editorial_code,
                        }}
                      ></div> */}
                      <CodeBlock
                        text={problemData?.data?.editorial_code}
                        language="cpp"
                        theme={atomOneDark}
                        showLineNumbers
                        customStyle={{
                          height: "600px",
                          overflowY: "scroll",
                          margin: "0px 0.75rem",
                          borderRadius: "5px",
                          boxShadow: "1px 2px 3px rgba(0,0,0,0.35)",
                        }}
                      />
                    </div>
                  )}
                  {problemTab.submissions && (
                    <div className="mt-2 min-h-[600px]">
                      <div className="border-b border-gray-300/10 pb-2">
                        <div className="flex px-4 ">
                          <p
                            className=" text-paragraph dark:text-darkParagraph"
                            style={{ flex: 3 }}
                          >
                            Status
                          </p>
                          <p className="flex-1 text-paragraph dark:text-darkParagraph">
                            Language
                          </p>
                          <p className="flex-1 text-paragraph dark:text-darkParagraph">
                            Runtime
                          </p>
                          <p className="flex-1 text-paragraph dark:text-darkParagraph">
                            memory
                          </p>
                        </div>
                      </div>
                      {submissions.length === 0 ? (
                        <div className="flex items-center justify-center h-[500px]">
                          <p className="text-paragraph dark:text-darkParagraph">
                            No Data Found!
                          </p>
                        </div>
                      ) : (
                        <div>
                          {submissions.map((submission: any, index: any) => (
                            <div
                              key={Math.random()}
                              onClick={() => {
                                setActiveSubmission(submission);
                                changeProblemTab("activeSubmission");
                              }}
                              className={`flex items-center px-4 py-4 hover:bg-gray-400/70 dark:hover:bg-[#0B060D]/60 cursor-pointer ${
                                index % 2 != 0 &&
                                "bg-gray-400/50 dark:bg-gray-100/10"
                              }`}
                            >
                              <div className=" " style={{ flex: 3 }}>
                                <p
                                  className={`text-xl  font-semibold ${
                                    submission.data.verdict === "Accepted" &&
                                    "text-green-700 dark:text-green-300"
                                  }
                                  ${
                                    submission.data.verdict ===
                                      "Wrong Answer" &&
                                    "text-red-700 dark:text-red-300"
                                  }
                                  ${
                                    submission.data.verdict ===
                                      "Time Limit Exceeded" &&
                                    "text-red-700 dark:text-red-300"
                                  }
                                  ${
                                    submission.data.verdict ===
                                      "Compilation Error" &&
                                    "text-orange-600 dark:text-orange-300"
                                  }
                                  
                                  `}
                                >
                                  {submission.data.verdict}
                                </p>
                                <p>
                                  {formatDate(
                                    new Date(submission.timestamp * 1000),
                                  )}
                                </p>
                              </div>
                              <div className="flex-1 text-paragraph dark:text-darkParagraph flex items-center ">
                                <p className="bg-gray-100/20 px-2  rounded-full ">
                                  {languageIdsToName[submission.data.language]}
                                </p>
                              </div>
                              <p className="flex-1 text-paragraph dark:text-darkParagraph">
                                {submission.data.runtime}
                              </p>
                              <p className="flex-1 text-paragraph dark:text-darkParagraph">
                                {submission.data.memory}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {problemTab.activeSubmission && (
                    <div className="mt-2 min-h-[600px] px-4 py-4">
                      <p
                        className={`text-xl  font-semibold ${
                          activeSubmission.data.verdict === "Accepted" &&
                          "text-green-700 dark:text-green-300"
                        }
                                  ${
                                    activeSubmission.data.verdict ===
                                      "Wrong Answer" &&
                                    "text-red-700 dark:text-red-300"
                                  }
                                  ${
                                    activeSubmission.data.verdict ===
                                      "Time Limit Exceeded" &&
                                    "text-red-700 dark:text-red-300"
                                  }
                                  ${
                                    activeSubmission.data.verdict ===
                                      "Compilation Error" &&
                                    "text-orange-600 dark:text-orange-300"
                                  }
                                  
                                  `}
                      >
                        {activeSubmission?.data.verdict}
                      </p>
                      <p className=" ">
                        {formatDate(
                          new Date(activeSubmission.timestamp * 1000),
                        )}
                      </p>
                      <p className="mt-2 ">
                        Runtime:{" "}
                        <span className="text-heading dark:text-darkHeading font-semibold text-xl">
                          {activeSubmission.data.runtime}
                        </span>
                      </p>
                      <p className="mt-1  ">
                        memory:{" "}
                        <span className="text-heading dark:text-darkHeading font-semibold text-xl">
                          {activeSubmission.data.memory}
                        </span>
                      </p>

                      <div className=" mt-6">
                        <CodeBlock
                          text={activeSubmission.data.code}
                          language="cpp"
                          theme={atomOneDark}
                          showLineNumbers
                          customStyle={{
                            height: "300px",
                            overflowY: "scroll",
                            margin: "0px 0.75rem",
                            borderRadius: "5px",
                            boxShadow: "1px 2px 3px rgba(0,0,0,0.35)",
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {/* <div className="mt-8">
                  <p className="text-lg font-semibold  mb-4">Constraints:</p>
                  <SyntaxHighlighter language="markdown" style={dracula}>
                    m == obstacleGrid.length
                  </SyntaxHighlighter>
                  <SyntaxHighlighter language="markdown" style={dracula}>
                    n == obstacleGrid[i].length
                  </SyntaxHighlighter>{" "}
                  <SyntaxHighlighter language="markdown" style={dracula}>
                    {"1 <= m, n <= 100"}
                  </SyntaxHighlighter>
                  <SyntaxHighlighter language="markdown" style={dracula}>
                    obstacleGrid[i][j] is 0 or 1.
                  </SyntaxHighlighter>
                </div> */}
                </div>
              </div>
              <div className="text-heading dark:text-darkHeading flex-1 lg:h-[89vh] lg:overflow-y-scroll  z-10 hide-scrollbar">
                <div className="px-4 py-6 border border-gray-400/50 dark:border-gray-300/10 bg-gray-400/10 dark:bg-gray-100/5 text-heading dark:text-darkHeading  backdrop-blur-xl rounded-xl  pb-2">
                  <div className="mb-4">
                    <select
                      className="select select-bordered w-full max-w-xs bg-gray-100/10"
                      onChange={(e) => {
                        setLanguage(e.target.value);
                      }}
                      value={language}
                    >
                      <option className="bg-[#0B060D]" value="cpp">
                        C++
                      </option>

                      <option className="bg-[#0B060D]" value="python">
                        Python
                      </option>
                      <option className="bg-[#0B060D]" value="java">
                        Java
                      </option>
                    </select>
                  </div>
                  <div
                    className={`pt-4 ${
                      user.darkMode ? "bg-[#1e1e1e]" : "bg-white"
                    } `}
                  >
                    <Editor
                      language={language}
                      value={code[language]}
                      onChange={(e) => setCode({ ...code, [language]: e })}
                      theme={user.darkMode ? "vs-dark" : "light"}
                      defaultValue=""
                      height="49vh"
                    />
                  </div>
                </div>
                <div className="px-4 border border-gray-400/50 dark:border-gray-300/10 bg-gray-400/10 dark:bg-gray-100/5 py-6 text-heading dark:text-darkHeading  backdrop-blur-xl rounded-xl  mt-3">
                  <div className="flex  gap-8 border-b border-gray-300/10">
                    {/* <a
                    className={` text-xl font-semibold pb-2 cursor-pointer border-b  ${
                      testCaseTab.testcase
                        ? "border-white text-heading dark:text-darkHeading"
                        : "text-paragraph dark:text-darkParagraph border-gray-300/0"
                    }`}
                    onClick={() => changeTestCaseTab("testcase")}
                  >
                    Testcase
                  </a> */}
                    <a
                      className={` text-xl font-semibold pb-2 cursor-pointer  border-b  
                 border-white text-heading dark:text-darkHeading
                       `}
                      // onClick={() => changeTestCaseTab("result")}
                    >
                      Result
                    </a>
                  </div>

                  <div className="my-3 ">
                    {/* {testCases.map((item, index) => (
                    <div
                      className="px-4 py-2 bg-gray-300/10 rounded-lg hover:bg-gray-300/20 cursor-pointer"
                      key={Math.random() * 1000}
                      onClick={() => {
                        setActiveTestCase(index);
                      }}
                    >
                      <p className="text-lg ">Case {index + 1}</p>
                    </div>
                  ))} */}

                    <p
                      className={` ${
                        resultData.title === "Run Or Submit the problem first"
                          ? "text-gray-400"
                          : resultData.title === "Accepted"
                            ? "text-green-400 font-semibold text-2xl"
                            : "text-red-600 font-semibold text-2xl"
                      }`}
                    >
                      {resultData.title}
                    </p>

                    {resultData.message?.yourOutput && (
                      <div>
                        <p className="text-lg font-bold">Input:</p>
                        <p>{resultData.message?.input}</p>
                      </div>
                    )}
                    {resultData.message?.yourOutput && (
                      <div>
                        <p className="text-lg font-bold">Expected:</p>
                        <p>{resultData.message?.expectedOutput}</p>
                      </div>
                    )}
                    {resultData.message?.expectedOutput && (
                      <div>
                        <p className="text-lg font-bold"> Output</p>
                        <p>{resultData.message?.yourOutput}</p>
                      </div>
                    )}

                    <p className="text-gray-400">
                      {resultData.message?.compilerMessage &&
                        resultData.message?.compilerMessage}
                    </p>
                  </div>
                  {/* <div className="mt-">
                  <p>head =</p>
                  <SyntaxHighlighter language="markdown" style={dracula}>
                    {testCases[activeTestCase]}
                  </SyntaxHighlighter>
                </div> */}

                  <div className="flex gap-4 mt-8 flex-col md:flex-row  justify-between items-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (returnToModulePath) {
                          router.push(returnToModulePath);
                        } else {
                          router.back();
                        }
                      }}
                      className="py-2 px-6 bg-[#532e62] hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80  rounded font-semibold text-white text-lg "
                    >
                      Return to Module Page
                    </button>
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setRunButtonLoading(true);
                          const token = localStorage.getItem("token");
                          axios
                            .post(
                              BACKEND_URL +
                                "/user/module/compile/" +
                                router.query.problemId,
                              {
                                body: {
                                  language_id: languageIds[language],
                                  test: true,
                                  code: code[language],
                                },
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              },
                            )
                            .then((res) => {
                              setResultData({
                                ...resultData,
                                title: res.data.data.status,
                                message: res.data.data.message,
                              });
                              setRunButtonLoading(false);
                            })
                            .catch((err) => {
                              setRunButtonLoading(false);
                            });
                        }}
                        // className="py-2  flex gap-2 items-center mt-5 px-6 bg-green-700 hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80  rounded font-semibold text-white text-lg "
                        className={`py-2  flex gap-2 items-center   px-6 ${
                          runButtonLoading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-green-700 cursor-pointer hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80"
                        }    rounded font-semibold text-white text-lg`}
                        disabled={runButtonLoading}
                      >
                        {runButtonLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : (
                          <svg
                            width={16}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              {" "}
                              <path
                                d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z"
                                fill="#fff"
                              ></path>{" "}
                            </g>
                          </svg>
                        )}{" "}
                        Run
                      </button>
                      <Button
                        label={"Submit"}
                        loading={submitButtonLoading}
                        bgColor={"#532e62"}
                        callBackFunction={() => {
                          setsubmitButtonLoading(true);
                          const token = localStorage.getItem("token");
                          axios
                            .post(
                              BACKEND_URL +
                                "/user/module/compile/" +
                                router.query.problemId,
                              {
                                body: {
                                  language_id: languageIds[language],
                                  test: false,
                                  code: code[language],
                                },
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              },
                            )
                            .then((res) => {
                              fetchSubmissions();
                              setResultData({
                                ...resultData,
                                title: res.data.data.status,
                                message: res.data.data.message,
                              });
                              if (res.data.data.status === "Accepted") {
                                submitProgress(
                                  problemData.id,
                                  problemData.score,
                                );
                                setIsEditorialOpen(true);
                              }
                              setsubmitButtonLoading(false);
                            })
                            .catch((err) => {
                              setsubmitButtonLoading(false);
                            });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
