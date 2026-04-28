import Nav from "@/components/Nav";
import { HindSiliguri } from "@/helpers";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BsChevronRight } from "react-icons/bs";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserContext } from "@/Contexts/UserContext";
import axios from "axios";
import { BACKEND_URL, COURSE_ID } from "@/api.config";
import {
  calculateRemainingDays,
  countAssignmentsAndVideos,
  decryptString,
  englishToBanglaNumbers,
} from "@/helpers";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Theme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Toaster, toast } from "react-hot-toast";
import { pink } from "@mui/material/colors";
import { RxButton } from "react-icons/rx";
import FloatingCompiler from "@/components/FloatingCompiler";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";

// `@mui/styles` is deprecated and conflicts with React 18 peer deps.
// Use MUI v5 supported styling instead.
const GreenRadio = styled(Radio)({
  color: "#fff",
  "&.Mui-checked": {
    color: "#fff",
  },
});

export default function CourseDetailsPage() {
  const cancelButtonRef = useRef(null);

  const [user, setUser] = useContext<any>(UserContext);
  const [quizAnswer, setQuizAnswer] = useState<any>({});
  const [fetchingTrigger, setFetchingTrigger] = useState(false);
  const [assignmentSubmission, setAssignmentSubmission] = useState({
    youtube_link: "",
    github_link: "",
  });
  const [assignmentEvaluted, setAssignmentEvaluted] = useState<any>([]);

  const [activeModule, setActiveModule] = useState<any>({});
  const [quizScore, setQuizScore] = useState<any>(0);

  const [cfHandle, setCfHandle] = useState<any>("");
  const router = useRouter();
  const [courseData, setCourseData] = useState<any>({});
  const [discussions, setDiscussions] = useState<any>([]);
  const [openDiscussions, setOpenDiscussions] = useState<any>(false);
  const [quizVerdict, setQuizVerdict] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState<any>("");
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const activeModuleRef = useRef<any>();
  const nonActiveModuleRef = useRef<any>();

  const isActiveChapter = (chapter: any) => {
    for (module of chapter.modules) {
      if (String(module.id) === String(activeModule?.id)) {
        return true;
      }
    }

    return false;
  };

  const submitNewDiscussion = () => {
    setUser({ ...user, loading: true });
    const token = localStorage.getItem("token");
    axios
      .post(
        BACKEND_URL + "/user/module/discussion/create/" + activeModule.id,
        {
          content: newDiscussion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        fetchDiscussions();
        setNewDiscussion("");
        setUser({ ...user, loading: false });
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
      });
  };

  const checkCFStatus = () => {
    const token = localStorage.getItem("token");
    setUser({ ...user, loading: true });
    axios
      .get(
        BACKEND_URL +
          `/user/module/checkCfStatus?handle=${cfHandle}&problem=${activeModule?.data?.cf_name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        if (res.data.data.solved) {
          submitProgress(activeModule?.id, activeModule.score);
        } else {
          toast.error("You have not solved this problem yet!");
        }
        setUser({ ...user, loading: false });
      })
      .catch((err) => {
        toast.error("Please provide a valid Codeforces handle!");
        setUser({ ...user, loading: false });
      });
  };

  const fetchCourse = () => {
    setUser({ ...user, loading: true });
    const token = localStorage.getItem("token");
    axios
      .get(BACKEND_URL + "/user/course/getfull/" + COURSE_ID, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCourseData(res.data);
        if (res.data.maxModuleSerialProgress === 0) {
          submitProgress(
            res.data.chapters[0].modules[0].id,
            res.data.chapters[0].modules[0].score,
          );
        }
        res.data.chapters.forEach((chapter: any) => {
          chapter.modules.forEach((module: any) => {
            if (module.serial === res.data.maxModuleSerialProgress + 1) {
              setActiveModule(module);
            }
          });
        });

        setUser({ ...user, loading: false });
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
      });
  };

  const fetchEvalutedAssignment = (moduleId: any) => {
    setUser({ ...user, loading: true });
    const token = localStorage.getItem("token");
    axios
      .get(BACKEND_URL + "/user/assignment/view/" + moduleId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAssignmentEvaluted(res.data.data);
        if (res.data.data.length > 0) {
          setAssignmentSubmission(res.data.data[0].submission);
        } else {
          setAssignmentSubmission({ youtube_link: "", github_link: "" });
        }
        setUser({ ...user, loading: false });
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
      });
  };

  const submitProgress = (module_id: any, score: any) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `${BACKEND_URL}/user/module/addProgress/${module_id}?points=${score}&type=${activeModule?.data?.category}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        axios
          .get(BACKEND_URL + "/user/course/getfull/" + COURSE_ID, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setCourseData(res.data);
            if (res.data.maxModuleSerialProgress === 0) {
              submitProgress(
                res.data.chapters[0].modules[0].id,
                res.data.chapters[0].modules[0].score,
              );
            }

            setUser({
              ...user,
              loading: false,
              scoreTrigger: !user.scoreTrigger,
            });
          })
          .catch((err) => {
            setUser({ ...user, loading: false });
          });
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
      });
  };

  const submitQuiz = () => {
    let quizes = activeModule.data.quiz;
    let verdict: any = [];
    const total_quiz = quizes.length;
    let accepted_answer = 0;
    quizes.forEach((quiz: any, index: any) => {
      const decrypted = decryptString(
        quiz.answer,
        process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ,
      );
      if (decrypted === quizAnswer[index]) {
        verdict.push(true);
        accepted_answer += 1;
        // submitProgress(activeModule.id);
      } else {
        verdict.push(false);
      }
    });
    setShowQuizAnswer(true);
    const real_score = (accepted_answer / total_quiz) * activeModule.score;
    setQuizScore(real_score);

    setQuizVerdict(verdict);
    submitProgress(activeModule.id, real_score);
  };

  useEffect(() => {
    setQuizAnswer([]);
    setQuizVerdict([]);
    setShowQuizAnswer(false);
  }, [activeModule]);

  const submitAssignment = (e: any) => {
    e.preventDefault();
    setUser({ ...user, loading: true });
    const token = localStorage.getItem("token");

    if (assignmentEvaluted?.length > 0) {
      axios
        .put(
          BACKEND_URL + "/user/assignment/edit/" + activeModule.id,
          {
            submission: assignmentSubmission,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(() => {
          setUser({ ...user, loading: false });
          toast.success("Assignment Submitted Successfully");
          submitProgress(activeModule.id, activeModule.score);
        })
        .catch((err) => {
          setUser({ ...user, loading: false });
          toast.error("Something Went Wrong");
        });
    } else {
      axios
        .post(
          BACKEND_URL + "/user/assignment/submit/" + activeModule.id,
          {
            submission: assignmentSubmission,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(() => {
          setUser({ ...user, loading: false });
          toast.success("Assignment Submitted Successfully");
          submitProgress(activeModule.id, activeModule.score);
        })
        .catch((err) => {
          setUser({ ...user, loading: false });
          toast.error("Something Went Wrong");
        });
    }
  };

  const fetchDiscussions = () => {
    setUser({ ...user, loading: true });
    const token = localStorage.getItem("token");

    axios
      .get(BACKEND_URL + `/user/module/discussion/list/${activeModule.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDiscussions(res.data.data);
        setUser({ ...user, loading: false });
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
      });
  };

  const getCFHandle = () => {
    setUser({ ...user, loading: true });
    const token = localStorage.getItem("token");

    axios
      .get(BACKEND_URL + "/user/module/getCfHandle", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCfHandle(res.data.data[0].cf_handle);
        setUser({ ...user, loading: false });
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
      });
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  useEffect(() => {
    if (activeModule?.data?.category === "CODE" && activeModule?.data?.is_cf) {
      getCFHandle();
    }
    activeModuleRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start",
    });
  }, [activeModule]);

  return (
    <div className={`  ${HindSiliguri.variable} font-hind   overflow-x-hidden`}>
      <Nav></Nav>
      <Toaster />

      <FloatingCompiler />

      <button
        style={{ zIndex: 999 }}
        onClick={() => {
          setUser({ ...user, openCompiler: true });
        }}
        className="fixed top-80 -left-2 bg-[#0B060D] bg-opacity-30  backdrop-blur-lg border border-gray-200/20 p-3 hover:bg-gray-300/20 "
      >
        <svg
          width={40}
          height={40}
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
              d="M15.5 9L15.6716 9.17157C17.0049 10.5049 17.6716 11.1716 17.6716 12C17.6716 12.8284 17.0049 13.4951 15.6716 14.8284L15.5 15"
              stroke="#fff"
              stroke-width="1.5"
              stroke-linecap="round"
            ></path>{" "}
            <path
              d="M13.2942 7.17041L12.0001 12L10.706 16.8297"
              stroke="#fff"
              stroke-width="1.5"
              stroke-linecap="round"
            ></path>{" "}
            <path
              d="M8.49994 9L8.32837 9.17157C6.99504 10.5049 6.32837 11.1716 6.32837 12C6.32837 12.8284 6.99504 13.4951 8.32837 14.8284L8.49994 15"
              stroke="#fff"
              stroke-width="1.5"
              stroke-linecap="round"
            ></path>{" "}
            <path
              d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
              stroke="#fff"
              stroke-width="1.5"
              stroke-linecap="round"
            ></path>{" "}
          </g>
        </svg>
      </button>
      <Transition appear show={openDiscussions} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setOpenDiscussions(false);
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
                <Dialog.Panel className=" w-[90vw] md:w-[80vw] transform overflow-hidden rounded-2xl bg-[#0B060D]/60 dark:bg-[#0B060D]/30  backdrop-blur-lg border border-gray-200/20 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="text-lg font-medium leading-6 "
                  >
                    <div className="flex justify-end mb-4">
                      <svg
                        onClick={() => {
                          setOpenDiscussions(false);
                        }}
                        className="cursor-pointer"
                        width="30"
                        viewBox="0 0 32 32"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <title>cross-circle</title>{" "}
                          <desc>Created with Sketch Beta.</desc> <defs> </defs>{" "}
                          <g
                            id="Page-1"
                            stroke="none"
                            stroke-width="1"
                            fill="none"
                            fill-rule="evenodd"
                          >
                            {" "}
                            <g
                              id="Icon-Set"
                              transform="translate(-568.000000, -1087.000000)"
                              fill="#ffffff"
                            >
                              {" "}
                              <path
                                d="M584,1117 C576.268,1117 570,1110.73 570,1103 C570,1095.27 576.268,1089 584,1089 C591.732,1089 598,1095.27 598,1103 C598,1110.73 591.732,1117 584,1117 L584,1117 Z M584,1087 C575.163,1087 568,1094.16 568,1103 C568,1111.84 575.163,1119 584,1119 C592.837,1119 600,1111.84 600,1103 C600,1094.16 592.837,1087 584,1087 L584,1087 Z M589.717,1097.28 C589.323,1096.89 588.686,1096.89 588.292,1097.28 L583.994,1101.58 L579.758,1097.34 C579.367,1096.95 578.733,1096.95 578.344,1097.34 C577.953,1097.73 577.953,1098.37 578.344,1098.76 L582.58,1102.99 L578.314,1107.26 C577.921,1107.65 577.921,1108.29 578.314,1108.69 C578.708,1109.08 579.346,1109.08 579.74,1108.69 L584.006,1104.42 L588.242,1108.66 C588.633,1109.05 589.267,1109.05 589.657,1108.66 C590.048,1108.27 590.048,1107.63 589.657,1107.24 L585.42,1103.01 L589.717,1098.71 C590.11,1098.31 590.11,1097.68 589.717,1097.28 L589.717,1097.28 Z"
                                id="cross-circle"
                              >
                                {" "}
                              </path>{" "}
                            </g>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </div>
                    <textarea
                      className="w-full px-3 py-3 rounded mb-2 resize-none bg-gray-200/20 outline-none focus:ring ring-gray-300/80 text-white"
                      placeholder="Write a question or an answer"
                      value={newDiscussion}
                      onChange={(e) => {
                        setNewDiscussion(e.target.value);
                      }}
                    />
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={submitNewDiscussion}
                        className="py-2 px-8 bg-[#532e62] hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80  rounded font-semibold text-white text-lg "
                      >
                        Submit
                      </button>
                    </div>
                  </Dialog.Title>
                  <div className="mt-2 max-h-[50vh]  overflow-y-scroll">
                    {discussions.map((elem: any) => (
                      <div className="my-4" key={Math.random()}>
                        <p className="text-white text-2xl">{elem.name}</p>
                        <p className="text-white ">{elem.content}</p>
                      </div>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="py-16 bg-white dark:bg-[#0B060D] overflow-x-hidden">
        <div className="w-[90%] lgXl:w-[80%] mx-auto py-12 z-20">
          <div className="flex flex-col lg:flex-row gap-24 justify-between relative">
            <svg
              viewBox="0 0 980 892"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute hidden -top-[70px] -left-[200px] h-full z-0"
            >
              <g filter="url(#filter0_f_261_7530)">
                <ellipse
                  cx="314.306"
                  cy="293.812"
                  rx="167.107"
                  ry="94.0796"
                  transform="rotate(-10.6934 314.306 293.812)"
                  fill="#B153E0"
                />
              </g>
              <defs>
                <filter
                  id="filter0_f_261_7530"
                  x="-350.838"
                  y="-303.722"
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
                    result="effect1_foregroundBlur_261_7530"
                  />
                </filter>
              </defs>
            </svg>
            <div
              style={{ flex: 2 }}
              className="text-heading dark:text-darkHeading z-10"
            >
              <h2 className="text-2xl lg:text-4xl font-semibold">
                {courseData.title}
              </h2>
              {!courseData.isTaken && (
                <div className="flex gap-8 items-center pb-6 border-b border-gray-400/50 dark:border-gray-300/10 relative ">
                  {/* <div className="flex gap-3 mt-6 items-center bg-[#FFF1E9]/20 px-3 py-2 rounded-xl">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.99855 17.6269C4.23361 17.6269 0.371094 13.7645 0.371094 8.99951C0.371094 4.23457 4.23361 0.37207 8.99855 0.37207C13.7635 0.37207 17.6259 4.23457 17.6259 8.99951C17.6259 13.7645 13.7635 17.6269 8.99855 17.6269ZM8.99855 15.9015C10.8291 15.9015 12.5846 15.1743 13.879 13.8799C15.1733 12.5856 15.9005 10.83 15.9005 8.99951C15.9005 7.16901 15.1733 5.41346 13.879 4.1191C12.5846 2.82472 10.8291 2.09756 8.99855 2.09756C7.16803 2.09756 5.4125 2.82472 4.11812 4.1191C2.82376 5.41346 2.09659 7.16901 2.09659 8.99951C2.09659 10.83 2.82376 12.5856 4.11812 13.8799C5.4125 15.1743 7.16803 15.9015 8.99855 15.9015ZM9.8613 8.99951H13.3123V10.725H8.1358V4.68579H9.8613V8.99951Z"
                        fill="#F1BA41"
                      />
                    </svg>
                    {englishToBanglaNumbers(
                      calculateRemainingDays(courseData?.chips?.deadline),
                    )}{" "}
                    দিন বাকি
                  </div> */}
                  {/* <div className="flex gap-3 mt-6 items-center bg-[#A144FF]/10 px-3 py-2 rounded-xl">
                    <svg
                      width="23"
                      height="22"
                      viewBox="0 0 23 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.0943 12.9745V14.807C12.3007 14.5264 11.4514 14.4403 10.6177 14.5561C9.78391 14.6717 8.99011 14.9858 8.30288 15.4719C7.61567 15.9579 7.05511 16.6017 6.66827 17.3492C6.28144 18.0968 6.07963 18.9263 6.07979 19.768L4.32617 19.7671C4.32589 18.6965 4.57073 17.6399 5.04191 16.6785C5.51309 15.717 6.1981 14.8762 7.04447 14.2204C7.89084 13.5647 8.8761 13.1114 9.92476 12.8953C10.9734 12.6791 12.0576 12.7068 13.0943 12.9745ZM11.3407 11.8767C8.43403 11.8767 6.07979 9.52248 6.07979 6.61585C6.07979 3.70922 8.43403 1.35498 11.3407 1.35498C14.2473 1.35498 16.6016 3.70922 16.6016 6.61585C16.6016 9.52248 14.2473 11.8767 11.3407 11.8767ZM11.3407 10.1231C13.2784 10.1231 14.8479 8.5536 14.8479 6.61585C14.8479 4.67809 13.2784 3.1086 11.3407 3.1086C9.40291 3.1086 7.83341 4.67809 7.83341 6.61585C7.83341 8.5536 9.40291 10.1231 11.3407 10.1231ZM16.42 17.939L19.5195 14.8395L20.7602 16.0792L16.42 20.4195L13.3196 17.3191L14.5604 16.0792L16.42 17.939Z"
                        fill="#A144FF"
                      />
                    </svg>
                    {englishToBanglaNumbers(
                      parseInt(courseData?.chips?.total_seats) -
                        courseData?.enrolled,
                    )}{" "}
                    টি সিট বাকি
                  </div> */}
                </div>
              )}
              {courseData.isTaken && (
                <div className="pb-6 border-b border-gray-400/50 dark:border-gray-300/10 "></div>
              )}

              <div className="mt-8">
                {/* <p>{activeModule?.title}</p> */}
                {activeModule?.data?.category == "VIDEO" &&
                  activeModule?.data?.videoHost === "Youtube" && (
                    <iframe
                      className="rounded-xl w-full min-h-[260px]  md:min-h-[400px]  lg:min-h-[500px] "
                      src={activeModule?.data?.videoUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  )}

                {activeModule?.data?.category == "PDF" && (
                  <iframe
                    src={`https://docs.google.com/viewer?url=${activeModule?.data?.pdf_link}&embedded=true`}
                    className="w-full h-[70vh]"
                  ></iframe>
                )}
                {activeModule?.data?.category == "VIDEO" &&
                  activeModule?.data?.videoHost === "BunnyCDN" && (
                    <iframe
                      className="rounded-xl w-full min-h-[260px]  md:min-h-[400px]  lg:min-h-[500px] "
                      src={activeModule?.data?.videoUrl}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  )}
                {activeModule?.data?.category === "ASSIGNMENT" && (
                  <div className=" mx-auto  z-20">
                    <p className="text-lg  mb-2">
                      Assignment Status:{" "}
                      {assignmentEvaluted.length === 0 && (
                        <span className="font-semibold text-xl text-red-600">
                          INCOMPLETE
                        </span>
                      )}
                      {assignmentEvaluted.length > 0 && (
                        <span className="font-semibold text-xl text-green-300">
                          {assignmentEvaluted[0] &&
                            assignmentEvaluted[0]?.status}
                        </span>
                      )}
                    </p>

                    <p className="text-lg  mb-2">
                      Verdict:{" "}
                      {assignmentEvaluted.length > 0 &&
                        assignmentEvaluted[0]?.status === "EVALUATED" && (
                          <span
                            className={`font-semibold text-xl ${
                              assignmentEvaluted[0]?.evaluation?.verdict ===
                              "PASSED"
                                ? "text-green-300"
                                : "text-red-300"
                            }`}
                          >
                            {assignmentEvaluted[0] &&
                              assignmentEvaluted[0]?.evaluation?.verdict}
                          </span>
                        )}
                    </p>
                    <p className="text-lg  mb-2">
                      Feedback:{" "}
                      {assignmentEvaluted.length > 0 &&
                        assignmentEvaluted[0]?.status === "EVALUATED" && (
                          <span className={`text-black dark:text-white`}>
                            {assignmentEvaluted[0] &&
                              assignmentEvaluted[0]?.evaluation?.feedback}
                          </span>
                        )}
                    </p>
                    <form
                      onSubmit={submitAssignment}
                      className="lg:px-8 px-6 py-6 text-heading dark:text-darkHeading bg-gray-100/5 backdrop-blur-xl rounded-xl  mx-auto flex flex-col items-center  gap-4"
                    >
                      <div className="w-full">
                        <p className="text-lg font-semibold mb-1">Github URL</p>
                        <input
                          className="w-full px-3 py-3 rounded bg-gray-200/20 outline-none focus:ring ring-gray-300/80"
                          placeholder="Github URL"
                          value={assignmentSubmission.github_link}
                          required
                          onChange={(e) => {
                            setAssignmentSubmission({
                              ...assignmentSubmission,
                              github_link: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="w-full">
                        <p className="text-lg font-semibold mb-1">
                          Youtube URL
                        </p>
                        <input
                          className="w-full px-3 py-3 rounded bg-gray-200/20 outline-none focus:ring ring-gray-300/80"
                          placeholder="Youtube URL"
                          value={assignmentSubmission.youtube_link}
                          required
                          onChange={(e) => {
                            setAssignmentSubmission({
                              ...assignmentSubmission,
                              youtube_link: e.target.value,
                            });
                          }}
                        />
                        {/* {errorMsg.length > 0 && (
                            <p className="text-red-500">{errorMsg}</p>
                          )} */}
                      </div>

                      <div className="mt-4">
                        <button
                          type="submit"
                          className="py-2 px-8 bg-[#532e62] hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80  rounded font-semibold text-white text-lg "
                        >
                          Submit Assignment
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                {activeModule?.data?.category === "CODE" &&
                  !activeModule?.data?.is_cf && (
                    <div className=" mx-auto  z-20">
                      <p className="text-lg  mb-2">
                        Coding Status:{" "}
                        {activeModule.serial >=
                        courseData.maxModuleSerialProgress + 1 ? (
                          <span className="font-semibold text-xl text-red-600">
                            INCOMPLETE
                          </span>
                        ) : (
                          <span className="font-semibold text-xl text-green-300">
                            COMPLETED
                          </span>
                        )}
                      </p>

                      <div className="mt-6">
                        <Link
                          href={`/problem/${activeModule.id}`}
                          className="py-2 px-8 bg-[#532e62] hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80  rounded font-semibold text-white text-lg "
                        >
                          Go to Problem Page
                        </Link>
                      </div>
                    </div>
                  )}
                {activeModule?.data?.category === "CODE" &&
                  activeModule?.data?.is_cf && (
                    <div className=" mx-auto  z-20">
                      <p className="text-lg  mb-2">
                        Coding Status:{" "}
                        {activeModule.serial >=
                        courseData.maxModuleSerialProgress + 1 ? (
                          <span className="font-semibold text-xl text-red-600">
                            INCOMPLETE
                          </span>
                        ) : (
                          <span className="font-semibold text-xl text-green-300">
                            COMPLETED
                          </span>
                        )}
                      </p>

                      <div className="w-full my-8">
                        <p className="text-lg font-semibold mb-1">
                          Codeforces Handle
                        </p>
                        <input
                          className="w-full px-3 py-3 rounded bg-gray-200/20 outline-none focus:ring ring-gray-300/80"
                          placeholder="Codeforces Handle"
                          value={cfHandle}
                          required
                          onChange={(e) => {
                            setCfHandle(e.target.value);
                          }}
                        />
                      </div>

                      <div className="mt-6">
                        <a
                          href={activeModule?.data?.cf_url}
                          target="_blank"
                          className="py-2 px-8 bg-[#532e62] hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80  rounded font-semibold text-white text-lg "
                        >
                          Go to Codeforces Problem
                        </a>
                      </div>

                      <div className="mt-12">
                        <button
                          onClick={checkCFStatus}
                          className="py-2 px-8 bg-green-700 hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80  rounded font-semibold text-white text-lg "
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  )}

                {activeModule?.data?.category === "QUIZ" && (
                  <div>
                    {showQuizAnswer && (
                      <div>
                        <p className="font-bold text-3xl">
                          {quizScore}/{activeModule.score}
                        </p>
                      </div>
                    )}
                    {activeModule?.data?.quiz?.map((quiz: any, index: any) => (
                      <div
                        className="my-6 bg-[#B153E0]/10 border border-[#B153E0] dark:bg-gray-300/10  rounded p-6"
                        key={Math.random()}
                      >
                        <div
                          className="text-black dark:text-white forced-white font-bold"
                          dangerouslySetInnerHTML={{
                            __html: quiz.question,
                          }}
                        ></div>

                        <div>
                          <FormControl>
                            <RadioGroup
                              value={quizAnswer[index]}
                              onChange={(e) => {
                                if (!showQuizAnswer) {
                                  let temp = quizAnswer;
                                  temp[index] = e.target.value;
                                  setQuizAnswer(temp);
                                }
                              }}
                            >
                              {quiz.options?.map((elem: any) => (
                                <FormControlLabel
                                  key={Math.random()}
                                  value={elem}
                                  // disabled={
                                  //   !(quizAnswer[index] == elem) &&
                                  //   showQuizAnswer
                                  // }
                                  sx={{
                                    color:
                                      showQuizAnswer &&
                                      !quizVerdict[index] &&
                                      elem === quizAnswer[index]
                                        ? "red"
                                        : showQuizAnswer &&
                                            quizVerdict[index] &&
                                            elem === quizAnswer[index]
                                          ? "limegreen"
                                          : "",
                                  }}
                                  control={
                                    <Radio
                                      sx={{
                                        color:
                                          showQuizAnswer &&
                                          !quizVerdict[index] &&
                                          elem === quizAnswer[index]
                                            ? "red"
                                            : showQuizAnswer &&
                                                quizVerdict[index] &&
                                                elem === quizAnswer[index]
                                              ? "limegreen"
                                              : user.darkMode
                                                ? "#B153E0"
                                                : "#B153E0",
                                        "&.Mui-checked": {
                                          color:
                                            showQuizAnswer &&
                                            !quizVerdict[index] &&
                                            elem === quizAnswer[index]
                                              ? "red"
                                              : showQuizAnswer &&
                                                  quizVerdict[index] &&
                                                  elem === quizAnswer[index]
                                                ? "limegreen"
                                                : user.darkMode
                                                  ? "#B153E0"
                                                  : "#B153E0",
                                        },
                                        "&.Mui-disabled": {
                                          color: "red",
                                        },
                                      }}
                                    />
                                  }
                                  label={elem}
                                />
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </div>

                        {showQuizAnswer && (
                          <div>
                            <p className="text-heading dark:text-darkHeading text-xl mt-2">
                              Answer:
                            </p>
                            <p className="text-green-400">
                              {decryptString(
                                quiz.answer,
                                process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ,
                              )}
                            </p>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: decryptString(
                                  quiz.explanation,
                                  process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ,
                                ),
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={submitQuiz}
                      type="submit"
                      disabled={showQuizAnswer}
                      className={`py-2 mt-5 px-8 ${
                        showQuizAnswer
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-[#532e62] hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80"
                      }   rounded font-semibold text-white text-lg`}
                    >
                      Submit Answer
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-12">
                {activeModule?.description?.length > 0 && (
                  <p className="font-semibold text-2xl pb-4 border-b border-gray-300/10 ">
                    Description
                  </p>
                )}
                <div
                  className="text-lg pt-6 border-t border-gray-400/50 dark:border-gray-300/10 "
                  dangerouslySetInnerHTML={{
                    __html: activeModule?.description,
                  }}
                ></div>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => {
                    fetchDiscussions();
                    setOpenDiscussions(true);
                  }}
                  className="py-2 mt-5 px-6 bg-[#532e62] hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80  rounded font-semibold text-white text-lg "
                >
                  View Discussions
                </button>
              </div>
            </div>
            <div style={{ flex: 1 }} className="z-10 relative">
              <div className="text-heading dark:text-darkHeading">
                <div
                  className=" scrollbar-thumb-rounded-full scrollbar-track-rounded-full h-[100vh] overflow-y-scroll py-6 px-4 border rounded-lg border-gray-300/20  scrollbar-thin scrollbar-thumb-gray-300
               scrollbar-rounded-[12px]
                 scrollbar-track-gray-600"
                >
                  {courseData?.chapters?.map((elem: any, index: any) => (
                    <div
                      key={Math.random()}
                      className={
                        "collapse collapse-plus dark:bg-gray-200/5 bg-gray-400/20 border-gray-400/50 backdrop-blur-lg border dark:border-gray-200/20 mb-6"
                      }
                    >
                      <input
                        type="radio"
                        name="my-accordion-3"
                        defaultChecked={isActiveChapter(elem)}
                      />
                      <div className="collapse-title  font-medium ">
                        <div className="flex justify-between">
                          <div
                            className="flex gap-4 flex-col lg:flex-row justify-start"
                            style={{ flex: 3 }}
                          >
                            {elem.is_free || courseData.isTaken ? (
                              <div className="">
                                <div className=" px-2 py-2 rounded-full bg-[#B153E0]/[.14] inline-block">
                                  <p className="px-4 py-1 rounded-full bg-[#B153E0]/[.32] font-bold text-xl inline-block">
                                    {index + 1}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="">
                                <div className=" px-2 py-2 rounded-full bg-[#FFFFFF]/[.14] inline-block">
                                  <p className="px-4 py-1 rounded-full bg-[#FFFFFF]/[.32] font-bold text-xl inline-block">
                                    {index + 1}
                                  </p>
                                </div>
                              </div>
                            )}
                            <div>
                              <p
                                className={`text-2xl ${
                                  !elem.is_free &&
                                  !courseData.isTaken &&
                                  "text-[#565656]"
                                }`}
                              >
                                {elem.title}
                              </p>
                              <div className="flex flex-wrap gap-3  lg:items-center mt-3 text-sm font-medium">
                                  {/* <div className="flex items-center gap-3">
                                    <svg
                                      width="13"
                                      height="12"
                                      viewBox="0 0 13 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <g clipPath="url(#clip0_261_7601)">
                                        <path
                                          d="M10.46 1C10.736 1 10.96 1.224 10.96 1.5V3.3785L9.95996 4.3785V2H2.95996V10H9.95996V8.621L10.96 7.621V10.5C10.96 10.776 10.736 11 10.46 11H2.45996C2.18396 11 1.95996 10.776 1.95996 10.5V1.5C1.95996 1.224 2.18396 1 2.45996 1H10.46ZM11.349 4.404L12.056 5.111L8.16696 9L7.45896 8.999L7.45996 8.293L11.349 4.404ZM6.95996 6V7H4.45996V6H6.95996ZM8.45996 4V5H4.45996V4H8.45996Z"
                                          fill={
                                            elem.is_free ? "#B153E0" : "#565656"
                                          }
                                        />
                                      </g>
                                      <defs>
                                        <clipPath id="clip0_261_7601">
                                          <rect
                                            width="12"
                                            height="12"
                                            fill="white"
                                            transform="translate(0.459961)"
                                          />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                    <p
                                      className={` ${
                                        !elem.is_free && "text-[#565656]"
                                      }`}
                                    >
                                      {
                                        countAssignmentsAndVideos(elem.modules)
                                          .assignmentCount
                                      }{" "}
                                      টি অ্যাসাইনমেন্ট{" "}
                                    </p>
                                  </div> */}
                                  <div
                                    className={`flex items-center gap-3 ${
                                      countAssignmentsAndVideos(elem.modules)
                                        .videoCount == 0 && "hidden"
                                    }`}
                                  >
                                    <svg
                                      width="13"
                                      height="12"
                                      viewBox="0 0 13 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M9.37 1H10.87C11.0026 1 11.1298 1.05268 11.2236 1.14645C11.3173 1.24021 11.37 1.36739 11.37 1.5V10.5C11.37 10.6326 11.3173 10.7598 11.2236 10.8536C11.1298 10.9473 11.0026 11 10.87 11H2.87C2.73739 11 2.61021 10.9473 2.51645 10.8536C2.42268 10.7598 2.37 10.6326 2.37 10.5V1.5C2.37 1.36739 2.42268 1.24021 2.51645 1.14645C2.61021 1.05268 2.73739 1 2.87 1H4.37V0H5.37V1H8.37V0H9.37V1ZM9.37 2V3H8.37V2H5.37V3H4.37V2H3.37V10H10.37V2H9.37ZM4.37 4H9.37V5H4.37V4ZM4.37 6H9.37V7H4.37V6Z"
                                        fill={
                                          elem.is_free ? "#B153E0" : "#565656"
                                        }
                                      />
                                    </svg>
                                    <p
                                      className={` ${
                                        !elem.is_free && "text-[#565656]"
                                      }`}
                                    >
                                      {
                                        countAssignmentsAndVideos(elem.modules)
                                          .videoCount
                                      }{" "}
                                      টি ভিডিও
                                    </p>
                                  </div>
                                  <div
                                    className={`flex items-center gap-3 ${
                                      countAssignmentsAndVideos(elem.modules)
                                        .quizCount == 0 && "hidden"
                                    }`}
                                  >
                                    <svg
                                      width="13"
                                      height="12"
                                      viewBox="0 0 13 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M9.37 1H10.87C11.0026 1 11.1298 1.05268 11.2236 1.14645C11.3173 1.24021 11.37 1.36739 11.37 1.5V10.5C11.37 10.6326 11.3173 10.7598 11.2236 10.8536C11.1298 10.9473 11.0026 11 10.87 11H2.87C2.73739 11 2.61021 10.9473 2.51645 10.8536C2.42268 10.7598 2.37 10.6326 2.37 10.5V1.5C2.37 1.36739 2.42268 1.24021 2.51645 1.14645C2.61021 1.05268 2.73739 1 2.87 1H4.37V0H5.37V1H8.37V0H9.37V1ZM9.37 2V3H8.37V2H5.37V3H4.37V2H3.37V10H10.37V2H9.37ZM4.37 4H9.37V5H4.37V4ZM4.37 6H9.37V7H4.37V6Z"
                                        fill={
                                          elem.is_free ? "#B153E0" : "#565656"
                                        }
                                      />
                                    </svg>
                                    <p
                                      className={` ${
                                        !elem.is_free && "text-[#565656]"
                                      }`}
                                    >
                                      {
                                        countAssignmentsAndVideos(elem.modules)
                                          .quizCount
                                      }{" "}
                                      টি কুইজ
                                    </p>
                                  </div>
                                  <div
                                    className={`flex items-center gap-3 ${
                                      countAssignmentsAndVideos(elem.modules)
                                        .codeCount == 0 && "hidden"
                                    }`}
                                  >
                                    <svg
                                      width="13"
                                      height="12"
                                      viewBox="0 0 13 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M9.37 1H10.87C11.0026 1 11.1298 1.05268 11.2236 1.14645C11.3173 1.24021 11.37 1.36739 11.37 1.5V10.5C11.37 10.6326 11.3173 10.7598 11.2236 10.8536C11.1298 10.9473 11.0026 11 10.87 11H2.87C2.73739 11 2.61021 10.9473 2.51645 10.8536C2.42268 10.7598 2.37 10.6326 2.37 10.5V1.5C2.37 1.36739 2.42268 1.24021 2.51645 1.14645C2.61021 1.05268 2.73739 1 2.87 1H4.37V0H5.37V1H8.37V0H9.37V1ZM9.37 2V3H8.37V2H5.37V3H4.37V2H3.37V10H10.37V2H9.37ZM4.37 4H9.37V5H4.37V4ZM4.37 6H9.37V7H4.37V6Z"
                                        fill={
                                          elem.is_free ? "#B153E0" : "#565656"
                                        }
                                      />
                                    </svg>
                                    <p
                                      className={` ${
                                        !elem.is_free && "text-[#565656]"
                                      }`}
                                    >
                                      {
                                        countAssignmentsAndVideos(elem.modules)
                                          .codeCount
                                      }{" "}
                                      টি কোডিং চ্যালেঞ্জ
                                    </p>
                                  </div>
                                  <div
                                    className={`flex items-center gap-3 ${
                                      countAssignmentsAndVideos(elem.modules)
                                        .pdfCount == 0 && "hidden"
                                    }`}
                                  >
                                    <svg
                                      width="13"
                                      height="12"
                                      viewBox="0 0 13 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M9.37 1H10.87C11.0026 1 11.1298 1.05268 11.2236 1.14645C11.3173 1.24021 11.37 1.36739 11.37 1.5V10.5C11.37 10.6326 11.3173 10.7598 11.2236 10.8536C11.1298 10.9473 11.0026 11 10.87 11H2.87C2.73739 11 2.61021 10.9473 2.51645 10.8536C2.42268 10.7598 2.37 10.6326 2.37 10.5V1.5C2.37 1.36739 2.42268 1.24021 2.51645 1.14645C2.61021 1.05268 2.73739 1 2.87 1H4.37V0H5.37V1H8.37V0H9.37V1ZM9.37 2V3H8.37V2H5.37V3H4.37V2H3.37V10H10.37V2H9.37ZM4.37 4H9.37V5H4.37V4ZM4.37 6H9.37V7H4.37V6Z"
                                        fill={
                                          elem.is_free ? "#B153E0" : "#565656"
                                        }
                                      />
                                    </svg>
                                    <p
                                      className={` ${
                                        !elem.is_free && "text-[#565656]"
                                      }`}
                                    >
                                      {
                                        countAssignmentsAndVideos(elem.modules)
                                          .pdfCount
                                      }{" "}
                                      টি পিডিএফ
                                    </p>
                                  </div>
                                </div>
                            </div>
                          </div>
                          <div>
                            {elem.is_free && (
                              <p
                                className="px-4 py-1 text-[#1CAB55] bg-[#1CAB55]/10 rounded-full text-sm"
                                style={{ flex: 1 }}
                              >
                                ফ্রি দেখুন
                              </p>
                            )}
                            {!elem.is_free && !courseData.isTaken && (
                              <svg
                                width="18"
                                height="21"
                                viewBox="0 0 18 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9 13.5V15.5M3 19.5H15C16.1046 19.5 17 18.6046 17 17.5V11.5C17 10.3954 16.1046 9.5 15 9.5H3C1.89543 9.5 1 10.3954 1 11.5V17.5C1 18.6046 1.89543 19.5 3 19.5ZM13 9.5V5.5C13 3.29086 11.2091 1.5 9 1.5C6.79086 1.5 5 3.29086 5 5.5V9.5H13Z"
                                  stroke="#2E2E2E"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="collapse-content   border-t border-gray-400/50 dark:border-gray-300/10 ">
                        <div className="pt-6"></div>
                        {elem.modules.map((module: any) => (
                          <div
                            key={Math.random()}
                            className="flex gap-4 items-center mb-4 "
                            ref={
                              module.id === activeModule?.id
                                ? activeModuleRef
                                : nonActiveModuleRef
                            }
                            onClick={() => {
                              if (elem.is_free || courseData.isTaken) {
                                if (
                                  module.data.category === "ASSIGNMENT" &&
                                  courseData.isTaken &&
                                  courseData.maxModuleSerialProgress + 1 >=
                                    module.serial
                                ) {
                                  fetchEvalutedAssignment(module.id);
                                  setActiveModule(module);
                                }
                                if (
                                  module.data.category === "CODE" &&
                                  courseData.isTaken &&
                                  courseData.maxModuleSerialProgress + 1 >=
                                    module.serial
                                ) {
                                  setActiveModule(module);
                                }

                                if (
                                  module.data.category === "VIDEO" &&
                                  courseData.maxModuleSerialProgress + 1 >=
                                    module.serial
                                ) {
                                  setActiveModule(module);
                                  submitProgress(module.id, module.score);
                                }
                                if (
                                  module.data.category === "QUIZ" &&
                                  courseData.maxModuleSerialProgress + 1 >=
                                    module.serial &&
                                  courseData.isTaken
                                ) {
                                  setActiveModule(module);
                                }
                                if (
                                  module.data.category === "PDF" &&
                                  courseData.maxModuleSerialProgress + 1 >=
                                    module.serial
                                ) {
                                  setActiveModule(module);
                                  submitProgress(module.id, module.score);
                                }
                              }
                            }}
                          >
                            {module.data.category == "VIDEO" && (
                              <svg
                                width="20"
                                height="21"
                                viewBox="0 0 20 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10 20.5C15.523 20.5 20 16.023 20 10.5C20 4.977 15.523 0.5 10 0.5C4.477 0.5 0 4.977 0 10.5C0 16.023 4.477 20.5 10 20.5Z"
                                  fill={
                                    (elem.is_free || courseData.isTaken) &&
                                    courseData.maxModuleSerialProgress + 1 >=
                                      module.serial
                                      ? "#B153E0"
                                      : "#565656"
                                  }
                                />
                                <path
                                  d="M14.2164 11.3862C14.7194 10.9382 14.7194 10.0622 14.2164 9.61419C12.7337 8.28108 11.0347 7.21042 9.19235 6.44819L8.86235 6.31319C8.22935 6.05319 7.56235 6.54719 7.47635 7.30019C7.23705 9.42681 7.23705 11.5736 7.47635 13.7002C7.56135 14.4532 8.22935 14.9462 8.86235 14.6872L9.19235 14.5522C11.0347 13.7899 12.7337 12.7193 14.2164 11.3862Z"
                                  fill="white"
                                />
                              </svg>
                            )}
                            {module.data.category == "ASSIGNMENT" && (
                              <svg
                                width="20"
                                height="21"
                                viewBox="0 0 20 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10 20.5C15.5228 20.5 20 16.0228 20 10.5C20 4.97715 15.5228 0.5 10 0.5C4.47715 0.5 0 4.97715 0 10.5C0 16.0228 4.47715 20.5 10 20.5Z"
                                  fill={
                                    (elem.is_free || courseData.isTaken) &&
                                    courseData.maxModuleSerialProgress + 1 >=
                                      module.serial
                                      ? "#B153E0"
                                      : "#565656"
                                  }
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M7.85422 5.5H12.0442C13.5892 5.5 14.4492 6.39 14.4492 7.915V13.08C14.4492 14.63 13.5892 15.5 12.0452 15.5H7.85422C6.33422 15.5 5.44922 14.63 5.44922 13.08V7.915C5.44922 6.39 6.33422 5.5 7.85422 5.5ZM7.98922 7.83V7.825H9.48322C9.58732 7.825 9.68715 7.86635 9.76076 7.93996C9.83437 8.01357 9.87572 8.1134 9.87572 8.2175C9.87572 8.3216 9.83437 8.42143 9.76076 8.49504C9.68715 8.56865 9.58732 8.61 9.48322 8.61H7.98922C7.88578 8.61 7.78659 8.56891 7.71345 8.49577C7.64031 8.42263 7.59922 8.32343 7.59922 8.22C7.59922 8.11657 7.64031 8.01737 7.71345 7.94423C7.78659 7.87109 7.88578 7.83 7.98922 7.83ZM7.98922 10.87H11.9092C12.0127 10.87 12.1119 10.8289 12.185 10.7558C12.2581 10.6826 12.2992 10.5834 12.2992 10.48C12.2992 10.3766 12.2581 10.2774 12.185 10.2042C12.1119 10.1311 12.0127 10.09 11.9092 10.09H7.98922C7.88578 10.09 7.78659 10.1311 7.71345 10.2042C7.64031 10.2774 7.59922 10.3766 7.59922 10.48C7.59922 10.5834 7.64031 10.6826 7.71345 10.7558C7.78659 10.8289 7.88578 10.87 7.98922 10.87ZM7.98922 13.155H11.9092C12.1092 13.135 12.2592 12.965 12.2592 12.765C12.2605 12.6674 12.2254 12.5728 12.1606 12.4998C12.0959 12.4267 12.0063 12.3804 11.9092 12.37H7.98922C7.91552 12.3629 7.84131 12.3766 7.77497 12.4095C7.70864 12.4423 7.65281 12.4931 7.61381 12.556C7.5748 12.619 7.55417 12.6915 7.55424 12.7656C7.55431 12.8396 7.57509 12.9121 7.61422 12.975C7.69422 13.1 7.83922 13.175 7.98922 13.155Z"
                                  fill="white"
                                />
                              </svg>
                            )}
                            {module.data.category == "PDF" && (
                              <svg
                                width="20"
                                height="21"
                                viewBox="0 0 20 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10 20.5C15.5228 20.5 20 16.0228 20 10.5C20 4.97715 15.5228 0.5 10 0.5C4.47715 0.5 0 4.97715 0 10.5C0 16.0228 4.47715 20.5 10 20.5Z"
                                  fill={
                                    (elem.is_free || courseData.isTaken) &&
                                    courseData.maxModuleSerialProgress + 1 >=
                                      module.serial
                                      ? "#B153E0"
                                      : "#565656"
                                  }
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M7.85422 5.5H12.0442C13.5892 5.5 14.4492 6.39 14.4492 7.915V13.08C14.4492 14.63 13.5892 15.5 12.0452 15.5H7.85422C6.33422 15.5 5.44922 14.63 5.44922 13.08V7.915C5.44922 6.39 6.33422 5.5 7.85422 5.5ZM7.98922 7.83V7.825H9.48322C9.58732 7.825 9.68715 7.86635 9.76076 7.93996C9.83437 8.01357 9.87572 8.1134 9.87572 8.2175C9.87572 8.3216 9.83437 8.42143 9.76076 8.49504C9.68715 8.56865 9.58732 8.61 9.48322 8.61H7.98922C7.88578 8.61 7.78659 8.56891 7.71345 8.49577C7.64031 8.42263 7.59922 8.32343 7.59922 8.22C7.59922 8.11657 7.64031 8.01737 7.71345 7.94423C7.78659 7.87109 7.88578 7.83 7.98922 7.83ZM7.98922 10.87H11.9092C12.0127 10.87 12.1119 10.8289 12.185 10.7558C12.2581 10.6826 12.2992 10.5834 12.2992 10.48C12.2992 10.3766 12.2581 10.2774 12.185 10.2042C12.1119 10.1311 12.0127 10.09 11.9092 10.09H7.98922C7.88578 10.09 7.78659 10.1311 7.71345 10.2042C7.64031 10.2774 7.59922 10.3766 7.59922 10.48C7.59922 10.5834 7.64031 10.6826 7.71345 10.7558C7.78659 10.8289 7.88578 10.87 7.98922 10.87ZM7.98922 13.155H11.9092C12.1092 13.135 12.2592 12.965 12.2592 12.765C12.2605 12.6674 12.2254 12.5728 12.1606 12.4998C12.0959 12.4267 12.0063 12.3804 11.9092 12.37H7.98922C7.91552 12.3629 7.84131 12.3766 7.77497 12.4095C7.70864 12.4423 7.65281 12.4931 7.61381 12.556C7.5748 12.619 7.55417 12.6915 7.55424 12.7656C7.55431 12.8396 7.57509 12.9121 7.61422 12.975C7.69422 13.1 7.83922 13.175 7.98922 13.155Z"
                                  fill="white"
                                />
                              </svg>
                            )}
                            {module.data.category == "QUIZ" && (
                              <svg
                                width="20"
                                height="21"
                                viewBox="0 0 20 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10 20.5C15.5228 20.5 20 16.0228 20 10.5C20 4.97715 15.5228 0.5 10 0.5C4.47715 0.5 0 4.97715 0 10.5C0 16.0228 4.47715 20.5 10 20.5Z"
                                  fill={
                                    (elem.is_free || courseData.isTaken) &&
                                    courseData.maxModuleSerialProgress + 1 >=
                                      module.serial
                                      ? "#B153E0"
                                      : "#565656"
                                  }
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M7.85422 5.5H12.0442C13.5892 5.5 14.4492 6.39 14.4492 7.915V13.08C14.4492 14.63 13.5892 15.5 12.0452 15.5H7.85422C6.33422 15.5 5.44922 14.63 5.44922 13.08V7.915C5.44922 6.39 6.33422 5.5 7.85422 5.5ZM7.98922 7.83V7.825H9.48322C9.58732 7.825 9.68715 7.86635 9.76076 7.93996C9.83437 8.01357 9.87572 8.1134 9.87572 8.2175C9.87572 8.3216 9.83437 8.42143 9.76076 8.49504C9.68715 8.56865 9.58732 8.61 9.48322 8.61H7.98922C7.88578 8.61 7.78659 8.56891 7.71345 8.49577C7.64031 8.42263 7.59922 8.32343 7.59922 8.22C7.59922 8.11657 7.64031 8.01737 7.71345 7.94423C7.78659 7.87109 7.88578 7.83 7.98922 7.83ZM7.98922 10.87H11.9092C12.0127 10.87 12.1119 10.8289 12.185 10.7558C12.2581 10.6826 12.2992 10.5834 12.2992 10.48C12.2992 10.3766 12.2581 10.2774 12.185 10.2042C12.1119 10.1311 12.0127 10.09 11.9092 10.09H7.98922C7.88578 10.09 7.78659 10.1311 7.71345 10.2042C7.64031 10.2774 7.59922 10.3766 7.59922 10.48C7.59922 10.5834 7.64031 10.6826 7.71345 10.7558C7.78659 10.8289 7.88578 10.87 7.98922 10.87ZM7.98922 13.155H11.9092C12.1092 13.135 12.2592 12.965 12.2592 12.765C12.2605 12.6674 12.2254 12.5728 12.1606 12.4998C12.0959 12.4267 12.0063 12.3804 11.9092 12.37H7.98922C7.91552 12.3629 7.84131 12.3766 7.77497 12.4095C7.70864 12.4423 7.65281 12.4931 7.61381 12.556C7.5748 12.619 7.55417 12.6915 7.55424 12.7656C7.55431 12.8396 7.57509 12.9121 7.61422 12.975C7.69422 13.1 7.83922 13.175 7.98922 13.155Z"
                                  fill="white"
                                />
                              </svg>
                            )}
                            {module.data.category == "CODE" && (
                              <svg
                                width="20"
                                height="21"
                                viewBox="0 0 20 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10 20.5C15.5228 20.5 20 16.0228 20 10.5C20 4.97715 15.5228 0.5 10 0.5C4.47715 0.5 0 4.97715 0 10.5C0 16.0228 4.47715 20.5 10 20.5Z"
                                  fill={
                                    (elem.is_free || courseData.isTaken) &&
                                    courseData.maxModuleSerialProgress >=
                                      module.serial - 1
                                      ? "#B153E0"
                                      : "#565656"
                                  }
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M7.85422 5.5H12.0442C13.5892 5.5 14.4492 6.39 14.4492 7.915V13.08C14.4492 14.63 13.5892 15.5 12.0452 15.5H7.85422C6.33422 15.5 5.44922 14.63 5.44922 13.08V7.915C5.44922 6.39 6.33422 5.5 7.85422 5.5ZM7.98922 7.83V7.825H9.48322C9.58732 7.825 9.68715 7.86635 9.76076 7.93996C9.83437 8.01357 9.87572 8.1134 9.87572 8.2175C9.87572 8.3216 9.83437 8.42143 9.76076 8.49504C9.68715 8.56865 9.58732 8.61 9.48322 8.61H7.98922C7.88578 8.61 7.78659 8.56891 7.71345 8.49577C7.64031 8.42263 7.59922 8.32343 7.59922 8.22C7.59922 8.11657 7.64031 8.01737 7.71345 7.94423C7.78659 7.87109 7.88578 7.83 7.98922 7.83ZM7.98922 10.87H11.9092C12.0127 10.87 12.1119 10.8289 12.185 10.7558C12.2581 10.6826 12.2992 10.5834 12.2992 10.48C12.2992 10.3766 12.2581 10.2774 12.185 10.2042C12.1119 10.1311 12.0127 10.09 11.9092 10.09H7.98922C7.88578 10.09 7.78659 10.1311 7.71345 10.2042C7.64031 10.2774 7.59922 10.3766 7.59922 10.48C7.59922 10.5834 7.64031 10.6826 7.71345 10.7558C7.78659 10.8289 7.88578 10.87 7.98922 10.87ZM7.98922 13.155H11.9092C12.1092 13.135 12.2592 12.965 12.2592 12.765C12.2605 12.6674 12.2254 12.5728 12.1606 12.4998C12.0959 12.4267 12.0063 12.3804 11.9092 12.37H7.98922C7.91552 12.3629 7.84131 12.3766 7.77497 12.4095C7.70864 12.4423 7.65281 12.4931 7.61381 12.556C7.5748 12.619 7.55417 12.6915 7.55424 12.7656C7.55431 12.8396 7.57509 12.9121 7.61422 12.975C7.69422 13.1 7.83922 13.175 7.98922 13.155Z"
                                  fill="white"
                                />
                              </svg>
                            )}
                            <p
                              className={`text-base ${
                                (elem.is_free || courseData.isTaken) &&
                                courseData.maxModuleSerialProgress + 1 >=
                                  module.serial &&
                                module.data.category === "VIDEO"
                                  ? "hover:text-black dark:hover:text-white cursor-pointer"
                                  : "cursor-not-allowed"
                              }
                            ${
                              (elem.is_free || courseData.isTaken) &&
                              courseData.maxModuleSerialProgress >=
                                module.serial - 1 &&
                              module.data.category === "CODE"
                                ? "hover:text-black dark:hover:text-white cursor-pointer"
                                : "cursor-not-allowed"
                            }
                              
                              ${
                                courseData.isTaken &&
                                courseData.maxModuleSerialProgress >=
                                  module.serial - 1 &&
                                module.data.category === "QUIZ"
                                  ? "hover:text-black dark:hover:text-white cursor-pointer"
                                  : "cursor-not-allowed"
                              }

                              ${
                                courseData.isTaken &&
                                courseData.maxModuleSerialProgress >=
                                  module.serial - 1 &&
                                module.data.category === "PDF"
                                  ? "hover:text-black dark:hover:text-white cursor-pointer"
                                  : "cursor-not-allowed"
                              }
                              
                              
                              ${
                                courseData.isTaken &&
                                courseData.maxModuleSerialProgress + 1 >=
                                  module.serial &&
                                module.data.category === "ASSIGNMENT"
                                  ? "hover:text-black dark:hover:text-white cursor-pointer"
                                  : "cursor-not-allowed"
                              }
                              ${
                                module.id === activeModule?.id
                                  ? "text-heading dark:text-white"
                                  : "text-paragraph/80 dark:text-[#737373]"
                              } `}
                            >
                              {module.data.category == "VIDEO" && "Video:"}{" "}
                              {module.data.category == "ASSIGNMENT" &&
                                "Assignment:"}{" "}
                              {module.data.category == "CODE" && "Code:"}{" "}
                              {module.data.category == "QUIZ" && "Quiz:"}{" "}
                              {module.data.category == "PDF" && "Pdf:"}{" "}
                              {module.title}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
