import Nav from "@/components/Nav";
import { HindSiliguri } from "@/helpers";

import { useContext, useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { BsChevronRight } from "react-icons/bs";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BACKEND_URL, COURSE_ID_2, COURSE_ID } from "@/api.config";
import { useLmsPreference } from "@/hooks/useLmsPreference";
import { isLmsPreferenceCourse, getCoursesDashboardUrl } from "@/constants/lmsPreference";
import { appendTokenToUrl, getAuthToken } from "@/helpers";
import {
  apiConfig,
  calculateRemainingDays,
  countAssignmentsAndVideos,
  countModulesAssignmentsVideos,
  englishToBanglaNumbers,
  isLoggedIn,
} from "@/helpers";
import { useRouter } from "next/router";
import axios from "axios";
import { UserContext } from "@/Contexts/UserContext";
import toast, { Toaster } from "react-hot-toast";
import FloatingCompiler from "@/components/FloatingCompiler";
import Footer from "@/components/Footer";
import jwtDecode from "jwt-decode";
import Button from "@/components/Button";
import GradientButton from "@/components/GradientButton";
import { ButtonBase } from "@mui/material";
import Lottie from "react-lottie";
import celebrationLottieData from "./Animation - 1711894031153.json";
import { useSearchParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const settings = {
  dots: true,

  slidesToShow: 2,
  slidesToScroll: 1,
  infinite: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 700,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const lottieOptions = {
  loop: true,
  autoplay: true,
  animationData: celebrationLottieData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function CourseDetailsPage() {
  const searchParams = useSearchParams();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [initialPrice, setInitialPrice] = useState(0);
  const [accessCode, setAccessCode] = useState("");
  const [coursePurchaseSuccessful, setCoursePurchaseSuccessfull] =
    useState(false);
  const [activeTab, setActiveTab] = useState({
    studyPlan: true,
    instructor: false,
    courseComplete: false,
    successStudents: false,
  });
  const [conditionsChecked, setConditionsChecked] = useState(false);
  const [openFaqItems, setOpenFaqItems] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [openChapterItems, setOpenChapterItems] = useState<{
    [key: number]: boolean;
  }>({});
  const [expandedDescription, setExpandedDescription] = useState(false);

  // Toggle FAQ item
  const toggleFaqItem = (index: number) => {
    setOpenFaqItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Toggle Chapter item
  const toggleChapterItem = (index: number) => {
    setOpenChapterItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const changeTab = (tabName: string) => {
    let temp: any = {
      studyPlan: false,
      instructor: false,
      courseComplete: false,
      successStudents: false,
    };
    temp[tabName] = true;
    setActiveTab(temp);
  };
  const router = useRouter();
  const courseIdFromRoute = router.query?.courseId as string | undefined;
  const { lmsPreference } = useLmsPreference();
  const [user, setUser] = useContext<any>(UserContext);
  const [courseData, setCourseData] = useState({
    success: true,
    isTaken: false,
    isWishList: false,
    id: 3,
    title: "",
    x_price: 0,
    price: 0,
    language: "বাংলা",
    prebooking: 0,
    enrolled: 0,
    you_get: {
      you_get: "",
    },
    chips: {
      deadline: "2023-10-13T18:00:00.000Z",
      total_seats: "",
    },
    short_description: "",
    study_plan_chips: {
      module: 0,
      live_class: 0,
      assignment: 0,
      quiz: 0,
    },
    instructor_list: {
      instructors: [
        {
          name: "",
          credibility: "",
          image: {},
          imagePreviewLink: "",
          imageUploadedLink: "",
        },
      ],
    },
    faq_list: {
      faqs: [
        {
          question: "",
          answer: "",
        },
        {
          question: "",
          answer: "",
        },
      ],
    },
    description: "",
    feedback_list: {
      feedbacks: [
        {
          description: "",
          name: "",
          bio: "",
          image: {},
          imagePreviewLink: "",
          imageUploadedLink: "",
        },
      ],
    },
    intro_video: "",
    is_live: true,
    chapters: [
      {
        id: 6,
        COURSE_ID_2: 3,
        title: "",
        serial_string: "1",
        chips_list: {},
        is_free: true,
        is_live: true,
        modules: [
          {
            id: 6,
            chapter_id: 6,
            title: "",
            description: "",
            metadata: {},
            data: {
              category: "VIDEO",
              videoUrl: "https://www.youtube.com/embed/QgjkjsqAzvo",
              videoHost: "Youtube",
            },
            is_live: true,
            is_free: null,
          },
        ],
      },
    ],
  });
  useEffect(() => {
    if (courseData.isTaken == true) {
      setCoursePurchaseSuccessfull(true);
    } else {
      // setCoursePurchaseSuccessfull(false);
    }
  }, [courseData]);
  const calculateTimeLeft = () => {
    const now: any = new Date();
    const target: any = new Date(courseData?.chips?.deadline);
    const difference: any = target - now;

    // Handle negative difference (target date in the past)
    if (difference <= 0) {
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      return;
    }

    const remainingDays = Math.floor(difference / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const remainingMinutes = Math.floor(
      (difference % (1000 * 60 * 60)) / (1000 * 60),
    );
    const remainingSeconds = Math.floor((difference % (1000 * 60)) / 1000);

    setDays(remainingDays);
    setHours(remainingHours);
    setMinutes(remainingMinutes);
    setSeconds(remainingSeconds);
  };

  useEffect(() => {
    const intervalId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, [courseData]);

  const purchaseFreeCourse = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        BACKEND_URL + "/user/course/applyCoupon/" + COURSE_ID_2,
        {
          coupon: "PY100",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setUser({ ...user, loading: false });

        setPrebookButtonLoading(false);

        toast.success("You have sucessfully bought this course!");
        setCourseData({
          ...courseData,
          isTaken: true,
        });
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
        toast.error("Wrong Coupon Code!");
        setPrebookButtonLoading(false);
      });
  };

  const [prebookButtonLoading, setPrebookButtonLoading] = useState(false);

  const [openBuyCourse, setOpenBuyCourse] = useState(false);
  const [openPrebookCourse, setOpenPrebookCourse] = useState(false);
  const [openPrebookCourseSuccessful, setOpenPrebookCourseSuccessful] =
    useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [prebookingData, setPrebookingData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const fetchCourse = () => {
    setUser({ ...user, loading: true });
    const token = localStorage.getItem("token");
    axios
      .get(BACKEND_URL + "/user/course/getfull/" + COURSE_ID_2, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCourseData(res.data);
        setInitialPrice(res.data.price);
        // Only set access code if it exists
        if (res.data?.transaction_id) {
          setAccessCode(res.data.transaction_id);
        }
        if (!token) {
          if (localStorage.getItem("isWishList") === "true") {
            setCourseData({ ...res.data, isWishList: true });
          }
        }
        setUser({ ...user, loading: false });
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
      });
  };

  const buyCourse = () => {
    if (isLoggedIn() === false) {
      window.location.href = "https://www.codervai.com/auth/login";
    } else {
      setUser({ ...user, loading: true });
      const token = localStorage.getItem("token");

      axios
        .post(
          BACKEND_URL + "/user/payment/initiate/" + COURSE_ID_2,
          { eventId: courseData.price * 6251 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          window.location = res.data.data;
          // router.push("/course/12");
          //setUser({ ...user, loading: false });
        })
        .catch((err) => {
          setUser({ ...user, loading: false });
        });
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const prebookCourse = () => {
    setPrebookButtonLoading(true);

    const token = localStorage.getItem("token");
    axios
      .post(
        BACKEND_URL + "/user/course/prebook/" + COURSE_ID_2,
        {
          ...prebookingData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setUser({ ...user, loading: false });
        setOpenPrebookCourse(false);
        setPrebookButtonLoading(false);
        setOpenPrebookCourseSuccessful(true);
        setCourseData({ ...courseData, isWishList: true });
        localStorage.setItem("isWishList", "true");
        toast.success("This course has been prebooked!");
        // router.push("/course/12");
        //setUser({ ...user, loading: false });
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
        setPrebookButtonLoading(false);
      });
  };

  // Initialize first items as open
  useEffect(() => {
    setOpenFaqItems({ 0: true });
    setOpenChapterItems({ 0: true });
  }, [courseData]);

  return (
    <div className={`  ${HindSiliguri.variable} font-hind  overflow-x-hidden `}>
      <Nav></Nav>
      <Toaster />

      {coursePurchaseSuccessful && (
        <div>
          {/* forpc */}
          <div className="absolute  hidden lg:block right-0 top-0 z-[999999]">
            <Lottie options={lottieOptions} height={"50vh"} width={"30vw"} />
          </div>
          <div className="absolute hidden lg:block  left-0 bottom-0 z-[999999]">
            <Lottie options={lottieOptions} height={"50vh"} width={"30vw"} />
          </div>
          {/* forPhones */}
          <div className="absolute lg:hidden  right-0 top-0 z-[999999]">
            <Lottie options={lottieOptions} height={400} width={400} />
          </div>
          <div className="absolute  lg:hidden left-0 bottom-0 z-[999999]">
            <Lottie options={lottieOptions} height={400} width={400} />
          </div>
        </div>
      )}
      <FloatingCompiler />

      <Transition appear show={openBuyCourse} as={Fragment}>
        <Dialog
          as="div"
          className="relative "
          style={{ zIndex: 99999 }}
          onClose={() => {
            setOpenBuyCourse(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-700 ease-in-out"
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
                enter="ease-out duration-700 ease-in-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className=" w-[90vw]  lg:w-[40vw]  text-darkHeading transform overflow-hidden rounded-2xl bg-[#0B060D]/60 dark:bg-[#0B060D]/30 bg-opacity-30  backdrop-blur-lg border border-gray-200/20 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="text-lg font-medium leading-6 "
                  >
                    <div>Buy Course</div>
                  </Dialog.Title>
                  <div className=" flex flex-col-reverse md:flex-row justify-between gap-8">
                    <div className="pt-4  " style={{ flex: 3 }}>
                      <div className="flex gap-2">
                        <input
                          type="checkbox"
                          checked={conditionsChecked}
                          onChange={(e) => {
                            setConditionsChecked(e.target.checked);
                          }}
                        ></input>
                        <div>
                          I HAVE READ AND AGREE TO THE WEBSITE{"'"}S{" "}
                          <a
                            target="_blank"
                            className="text-blue-300 font-bold"
                            href="https://www.codervai.com/terms-and-conditions"
                          >
                            TERMS AND CONDITIONS
                          </a>{" "}
                          ,
                          <a
                            target="_blank"
                            className="text-blue-300 font-bold"
                            href="https://www.codervai.com/privacy-policy"
                          >
                            PRIVACY POLICY
                          </a>
                          , AND{" "}
                          <a
                            target="_blank"
                            className="text-blue-300 font-bold"
                            href="https://www.codervai.com/refund-policy"
                          >
                            REFUND POLICY
                          </a>
                          <span className="text-red-500">*</span>
                        </div>
                      </div>
                      <button
                        onClick={buyCourse}
                        className={` ${
                          conditionsChecked
                            ? "bg-[#1CAB55] hover:bg-opacity-50 ease-in-out duration-150"
                            : "bg-gray-600 cursor-not-allowed disabled"
                        }  text-darkHeading py-3 w-full mt-8 rounded-xl `}
                      >
                        কোর্সটি কিনুন
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={openPrebookCourse} as={Fragment}>
        <Dialog
          as="div"
          className="relative "
          style={{ zIndex: 99999 }}
          onClose={() => {
            setOpenPrebookCourse(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-700 ease-in-out"
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
                enter="ease-out duration-700 ease-in-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className=" lgXl:w-[40vw] text-darkHeading transform overflow-hidden  rounded-2xl bg-[#B2F100]/5  dark:bg-[#B2F100]/5  backdrop-blur-lg border border-[#B2F100]/60  text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="text-lg font-medium leading-6 p-6 "
                  >
                    <div className="flex items-center flex-col lg:flex-row">
                      <img src="/logo.png" alt="" className="py-6 lg:p-6" />
                      <div>
                        <p className="text-heading dark:text-darkHeading text-xl text-center lg:text-left">
                          Competitive Programming 3.0 TurboCharged
                        </p>
                        <p className="text-paragraph dark:text-darkParagraph mt-2 text-base text-center lg:text-left">
                          খুব শীঘ্রই আমাদের এই কোর্সটি আসছে তাই কোর্সের সম্বন্ধে
                          আগাম জেনে রাখার জন্য এখনি নিচে দেওয়া ফর্ম ফিল আপ করো
                        </p>
                      </div>
                    </div>
                  </Dialog.Title>
                  <div className="border-b border-t border-black/20 dark:border-gray-300/20 py-8 px-6">
                    <div className="flex  items-center ">
                      <p className="text-paragraph dark:text-darkParagraph mb-1 font-xl flex-1">
                        Name
                      </p>
                      <input
                        value={prebookingData.name}
                        onChange={(e) => {
                          setPrebookingData({
                            ...prebookingData,
                            name: e.target.value,
                          });
                        }}
                        className="w-full bg-white/0 border flex-[2] border-gray-500 dark:border-gray-200/20 outline-none text-heading dark:text-darkHeading px-4 py-2 text-xl rounded-lg"
                      />
                    </div>
                    <div className="flex  items-center my-6">
                      <p className="text-paragraph dark:text-darkParagraph mb-1 font-xl flex-1">
                        Phone Number
                      </p>
                      <input
                        type="number"
                        value={prebookingData.phone}
                        onChange={(e) => {
                          setPrebookingData({
                            ...prebookingData,
                            phone: e.target.value,
                          });
                        }}
                        className="w-full bg-white/0 border flex-[2] border-gray-500 dark:border-gray-200/20 outline-none text-heading dark:text-darkHeading px-4 py-2 text-xl rounded-lg"
                      />
                    </div>
                    <div className="flex  items-center ">
                      <p className="text-paragraph dark:text-darkParagraph mb-1 font-xl flex-1">
                        Email
                      </p>
                      <input
                        type="mail"
                        value={prebookingData.email}
                        onChange={(e) => {
                          setPrebookingData({
                            ...prebookingData,
                            email: e.target.value,
                          });
                        }}
                        className="w-full bg-white/0 border flex-[2] border-gray-500 dark:border-gray-200/20 outline-none text-heading dark:text-darkHeading px-4 py-2 text-xl rounded-lg"
                      />
                    </div>
                  </div>
                  <div className=" flex p-6 gap-4">
                    <button
                      onClick={() => {
                        setOpenPrebookCourse(false);
                      }}
                      className={` 
                       bg-[#fcfcfc0c] hover:bg-opacity-50 ease-in-out duration-150
                       border border-white/30
            backdrop-blur-lg
                       text-darkHeading py-3 w-full rounded-xl font-bold`}
                    >
                      Cancel
                    </button>
                    {/* <button
                      onClick={prebookCourse}
                      className={` 
         hover:bg-opacity-50 ease-in-out duration-150
                     
                       text-darkHeading py-3 w-full rounded-xl font-bold`}
                      style={{
                        background:
                          " linear-gradient(91deg, #4B6404 0%, #7BA502 50.98%, #A9E400 100%)",
                      }}
                    >
                      Prebook
                    </button> */}
                    <GradientButton
                      loading={prebookButtonLoading}
                      gradientStyle=" linear-gradient(91deg, #4B6404 0%, #7BA502 50.98%, #A9E400 100%)"
                      label="Prebook"
                      type=""
                      callBackFunction={prebookCourse}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={openPrebookCourseSuccessful} as={Fragment}>
        <Dialog
          as="div"
          className="relative "
          style={{ zIndex: 99999 }}
          onClose={() => {
            setOpenPrebookCourseSuccessful(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-700 ease-in-out"
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
                enter="ease-out duration-700 ease-in-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className=" lgXl:w-[40vw] text-darkHeading transform overflow-hidden  rounded-2xl bg-[#B2F100]/5  dark:bg-[#B2F100]/5  backdrop-blur-lg border border-[#B2F100]/60  text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="text-lg font-medium leading-6 p-6 "
                  >
                    <div className="flex items-center flex-col lg:flex-row">
                      <img src="/logo.png" alt="" className="py-6 lg:p-6" />
                      <div>
                        <p className="text-heading dark:text-darkHeading text-xl text-center lg:text-left">
                          Competitive Programming 3.0 TurboCharged
                        </p>
                        {/* <p className="text-paragraph dark:text-darkParagraph mt-2 text-base text-center lg:text-left">
                          খুব শীঘ্রয় আসছে আমাদের এই কোর্স তাই কোর্সের সম্বন্ধে
                          আগাম জেনে রাখার জন্য এখনি নিচে দেওয়া ফর্ম ফিল আপ করুন
                        </p> */}
                      </div>
                    </div>
                  </Dialog.Title>
                  <div className="border-b border-t border-black/20 dark:border-gray-300/20 py-8 px-6">
                    <p className="text-heading dark:text-darkHeading text-xl font-semibold">
                      Congratulations! তুমি প্রিবুক করেছ!{" "}
                    </p>
                    <p className="text-heading dark:text-darkHeading text-xl mt-4 font-semibold">
                      প্রোগ্রামিং এ তোমার আগ্রহ দেখে আমরা অত্যন্ত খুশী!
                      <br />
                      এখন যা যা করবে -
                      <br />
                      ১। প্রি বুকিং এর মেয়াদ শেষ হলে তোমার ফোন নাম্বার ও ইমেইলে
                      আমাদের সিক্রেট কুপন পাঠানো হবে।
                      <br />
                      ২। ঐ কুপন টা আমাদের ওয়েবসাইটে এসে এপ্লাই করলেই কুপন এপ্লাই
                      হয়ে হয়ে যাবে এবং আমাদের ছাড় এপ্লাই করতে পারবে।{" "}
                    </p>

                    <p className="text-heading dark:text-darkHeading text-xl font-semibold mt-4">
                      ধন্যবাদ।
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={coursePurchaseSuccessful} as={Fragment}>
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
            enter="ease-out duration-700 ease-in-out"
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
                enter="ease-out duration-700 ease-in-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="md:w-[50vw] lg:w-[40vw] text-darkHeading transform overflow-hidden  rounded-2xl bg-[#B2F100]/5  dark:bg-[#BBBBBB]/10 backdrop-blur-3xl border border-gray-300/30  text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="text-lg font-medium leading-6 p-2 "
                  >
                    <div className="flex justify-end">
                      <button
                        className="hover:bg-gray-300/20 p-2 mr-2 rounded"
                        onClick={() => {
                          setCoursePurchaseSuccessfull(false);
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
                  <div className="border-b border-t border-black/20 dark:border-gray-300/20 py-3 px-6">
                    <div className="flex flex-col items-center ">
                      <img
                        src="/Festive flags and hands with decorations.png"
                        alt=""
                      />
                      <p className="text-xl font-bold text-heading dark:text-darkHeading">
                        অভিনন্দন!
                      </p>
                      <p className="text-paragraph dark:text-darkParagraph text-sm text-center mt-1 font-bold">
                        তুমি সফলভাবে কোর্সটি পারচেস করতে পেরেছ! প্রোগ্রামিং এ
                        তোমার আগ্রহ দেখে আমরা অন্ত্যন্ত খুশি। এখন শুধু প্রয়োজন
                        ডেডিকেশন এর সাথে লেগে থাকা, ক্লাস গুলো ঠিক মত করা সাথে
                        এসাইনমেন্ট কুইজ ও প্রোগ্রামিং প্রব্লেম সলভের মাধ্যমে
                        নিজেকে একজন দক্ষ প্রোগ্রামার করে গড়ে তোলা। আর তোমাকে
                        সর্বাত্নক হেল্প করতে পাশে আছি আমরা কোডার ভাই পরিবার!
                      </p>
                    </div>

                    {/* after purchase tasks */}
                    <p className="text-heading dark:text-darkHeading text-lg my-3 font-semibold ">
                      এখন তোমার কি করনীয়
                    </p>
                    <div className="flex gap-4 items-center">
                      <div className="relative">
                        <div className=" px-2 py-2 rounded-full bg-[#B153E0]/[.14] inline-block">
                          <p className="px-4 py-1 rounded-full bg-[#B153E0]/[.32] font-bold text-xl inline-block">
                            1
                          </p>
                        </div>
                        {/* <div className="w-[2px] h-[50%] bg-white absolute top-[50%] left-[50%] "></div> */}
                      </div>
                      <p className="text-heading dark:text-darkHeading text-sm">
                        প্রথমত আমাদের ফেসবুক প্রাইভেট গ্রুপ ও Discord Server এ
                        জয়েন হওয়ার জন্য তোমার ফোনে পাঠানো ACCESS CODE টি Copy
                        করে বাকি ইনফরমেশন দিয়ে রিকোয়েস্ট দাও। ২৪ ঘন্টার মধ্যে
                        অ্যাপ্রুভ করা হবে।
                      </p>
                    </div>

                    {accessCode && (
                      <div className="flex items-center gap-4 mt-4 mb-4 bg-gray-200/10 p-4 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm mb-2 text-heading dark:text-darkHeading">
                            আপনার ACCESS CODE:
                          </p>
                          <p className="font-mono text-lg text-heading dark:text-darkHeading">
                            {accessCode}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(accessCode);
                            toast.success("Access code copied!");
                          }}
                          className="bg-[#B153E0]/20 hover:bg-[#B153E0]/30 p-2 rounded-lg transition-colors"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    )}

                    <div className="flex gap-4 items-center my-4">
                      <div className="z-[10]">
                        <div className=" px-2 py-2 rounded-full bg-[#B153E0]/[.14] inline-block z-[10]">
                          <p className="px-4 py-1 rounded-full bg-[#B153E0]/[.32] font-bold text-xl inline-block">
                            2
                          </p>
                        </div>
                      </div>
                      <p className="text-heading dark:text-darkHeading text-sm">
                        যুক্ত হয়ে যাও আমাদের{" "}
                        <a
                          className="text-heading dark:text-darkHeading font-bold underline"
                          href="https://www.facebook.com/groups/codervai.cp.batch03/"
                          target="_blank"
                        >
                          ফেইসবুক প্রাইভেট গ্রুপে{" "}
                        </a>
                      </p>
                    </div>
                    <div className="flex gap-4 items-center my-4">
                      <div className="">
                        <div className=" px-2 py-2 rounded-full bg-[#B153E0]/[.14] inline-block">
                          <p className="px-4 py-1 rounded-full bg-[#B153E0]/[.32] font-bold text-xl inline-block">
                            3
                          </p>
                        </div>
                      </div>
                      <p className="text-heading dark:text-darkHeading text-sm">
                        যুক্ত হয়ে যাও আমাদের{" "}
                        <a
                          className="text-heading dark:text-darkHeading font-bold underline"
                          href="https://discord.gg/u3m7PAnfeq"
                          target="_blank"
                        >
                          Discord Server এ{" "}
                        </a>
                      </p>
                    </div>
                    <div className="flex gap-4 items-center my-4">
                      <div className="">
                        <div className=" px-2 py-2 rounded-full bg-[#B153E0]/[.14] inline-block">
                          <p className="px-4 py-1 rounded-full bg-[#B153E0]/[.32] font-bold text-xl inline-block">
                            4
                          </p>
                        </div>
                      </div>
                      <p className="text-heading dark:text-darkHeading text-sm">
                        ⁠আমাদের ওরিয়েন্টেশন ক্লাস হবে 10 April রাত ৯.৩০ এ
                        ফেসবুক সিক্রেট গ্রুপে এবং ওয়েবসাইটেও।{" "}
                      </p>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="">
                        <div className=" px-2 py-2 rounded-full bg-[#B153E0]/[.14] inline-block">
                          <p className="px-4 py-1 rounded-full bg-[#B153E0]/[.32] font-bold text-xl inline-block">
                            5
                          </p>
                        </div>
                      </div>
                      <p className="text-heading dark:text-darkHeading text-sm">
                        ওয়েবসাইট থেকে লাইভ ক্লাস গুলো দেখার জন্য তোমার
                        প্রোফাইলে লাইভ ক্লাস মেন্যুতে যেতে হবে।
                      </p>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="">
                        <div className=" px-2 py-2 rounded-full bg-[#B153E0]/[.14] inline-block">
                          <p className="px-4 py-1 rounded-full bg-[#B153E0]/[.32] font-bold text-xl inline-block">
                            6
                          </p>
                        </div>
                      </div>
                      <p className="text-heading dark:text-darkHeading text-sm">
                        কোর্স শুরু হওয়ার আগে C এবং C++ সম্পর্কে তোমরা এখান থেকে
                        জেনে নিতে পারো। আগে থেকেই প্রিপেয়ার হয়ে গেলে !
                      </p>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="">
                        <div className=" px-2 py-2 rounded-full bg-[#B153E0]/[.14] inline-block">
                          <p className="px-4 py-1 rounded-full bg-[#B153E0]/[.32] font-bold text-xl inline-block">
                            7
                          </p>
                        </div>
                      </div>
                      <p className="text-heading dark:text-darkHeading text-sm">
                        Learn C from{" "}
                        <a
                          className="text-heading dark:text-darkHeading font-bold underline"
                          href="https://www.w3schools.com/c/"
                          target="_blank"
                        >
                          w3schools{" "}
                        </a>
                        and C++ from{" "}
                        <a
                          className="text-heading dark:text-darkHeading font-bold underline"
                          href="https://www.w3schools.com/cpp/"
                          target="_blank"
                        >
                          w3schools
                        </a>
                        !
                      </p>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="">
                        <div className=" px-2 py-2 rounded-full bg-[#B153E0]/[.14] inline-block">
                          <p className="px-4 py-1 rounded-full bg-[#B153E0]/[.32] font-bold text-xl inline-block">
                            8
                          </p>
                        </div>
                      </div>
                      <p className="text-heading dark:text-darkHeading text-sm">
                        কোর্স সম্পর্কে তোমার যাবতীয় যত জিজ্ঞাসা প্রশ্ন সব
                        আমাদের ফেসবুক গ্রুপে পোস্ট করতে পারো বা ওয়েবসাইট
                        সাপোর্ট মেন্যুতে গিয়ে টিকেট বানিয়ে আমাদের থেকে জেনে
                        নিতে পারো।
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <button
                      onClick={() => {
                        setCoursePurchaseSuccessfull(false);
                      }}
                      className={`bg-purple hover:bg-opacity-50 ease-in-out duration-150  text-darkHeading py-3 w-full  rounded-xl font-bold`}
                    >
                      Okay
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

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
      <div className="pt-20 bg-white  dark:bg-[#0B060D] overflow-x-hidden">
        <div className="w-[90%] lg:w-[90%] mx-auto py-12 z-20">
          <div className="flex flex-col-reverse lg:flex-row gap-24 justify-between relative">
            <svg
              viewBox="0 0 980 892"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute  -top-[200px] -left-[200px] w-full z-0 h-full"
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
                {courseData?.title}
              </h2>
              <div className="flex gap-8 items-center pb-6 border-b border-gray-300/80 dark:border-gray-300/10 relative ">
                {/* <div className="flex gap-3 mt-6 items-center bg-[#fddecc]  dark:bg-[#FFF1E9]/20 px-3 py-2 rounded-xl">
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
                {/* <div className="flex gap-3 mt-6 items-center bg-[#A144FF]/20 dark:bg-[#A144FF]/10 px-3 py-2 rounded-xl">
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

              <p className="mt-6 text-black/70 dark:text-[#A3A3A3] text-lg">
                {courseData.short_description}
              </p>

              <div className="mt-8  grid grid-cols-1 lg:grid-cols-2 gap-y-3 gap-x-3 lg:w-[80%]">
                <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5 ">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.48438 8.00171H7.5167L8.50108 5.67524L9.48438 8.00171ZM0 2.75C0 1.23122 1.23122 0 2.75 0H19.25C20.7688 0 22 1.23122 22 2.75V11.5372C20.7381 10.5728 19.161 10 17.4502 10C14.9973 10 12.8195 11.1775 11.4511 12.9981L4.2251 12.9981C3.81088 12.9981 3.4751 13.3339 3.4751 13.7481C3.4751 14.1623 3.81089 14.4981 4.2251 14.4981L10.5751 14.4981C10.1732 15.4173 9.9502 16.4326 9.9502 17.5C9.9502 19.1884 10.5081 20.7465 11.4496 22H2.75C1.23122 22 0 20.7688 0 19.25V2.75ZM9.19229 3.45768C9.07498 3.18012 8.80294 2.99972 8.50161 2.99966C8.20028 2.99961 7.92817 3.1799 7.81075 3.45741L5.05924 9.96029C4.89783 10.3418 5.07622 10.7819 5.45769 10.9433C5.83916 11.1047 6.27926 10.9263 6.44066 10.5448L6.88202 9.50171H10.1184L10.5591 10.5445C10.7204 10.9261 11.1604 11.1046 11.5419 10.9434C11.9235 10.7821 12.102 10.3421 11.9408 9.96057L9.19229 3.45768ZM3.4751 17.7511C3.4751 18.1653 3.81088 18.5011 4.22509 18.5011L8.7505 18.5012C9.16471 18.5012 9.5005 18.1654 9.5005 17.7512C9.5005 17.3369 9.16472 17.0012 8.75051 17.0011C4.2251 17.0011 3.4751 17.3369 3.4751 17.7511ZM15.5 3.74991C15.5 3.3357 15.1642 2.99991 14.75 2.99991C14.3358 2.99991 14 3.3357 14 3.74991V5H12.7523C12.3381 5 12.0023 5.33579 12.0023 5.75C12.0023 6.16421 12.3381 6.5 12.7523 6.5H14V7.7476C14 8.16181 14.3358 8.4976 14.75 8.4976C15.1642 8.4976 15.5 8.16181 15.5 7.7476V6.5H16.75C17.1642 6.5 17.5 6.16421 17.5 5.75C17.5 5.33579 17.1642 5 16.75 5H15.5V3.74991ZM23.9502 17.5C23.9502 21.0899 21.04 24 17.4502 24C13.8603 24 10.9502 21.0899 10.9502 17.5C10.9502 13.9101 13.8603 11 17.4502 11C21.04 11 23.9502 13.9101 23.9502 17.5ZM17.9502 13.5C17.9502 13.2239 17.7263 13 17.4502 13C17.1741 13 16.9502 13.2239 16.9502 13.5V17H13.4502C13.1741 17 12.9502 17.2239 12.9502 17.5C12.9502 17.7761 13.1741 18 13.4502 18H16.9502V21.5C16.9502 21.7761 17.1741 22 17.4502 22C17.7263 22 17.9502 21.7761 17.9502 21.5V18H21.4502C21.7263 18 21.9502 17.7761 21.9502 17.5C21.9502 17.2239 21.7263 17 21.4502 17H17.9502V13.5Z"
                      fill="#D95344"
                    />
                  </svg>
                  <div>
                    <p className="text-paragraph dark:text-darkParagraph text-xl">
                      চ্যাপ্টার সংখ্যা{" "}
                    </p>
                    <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                      40 টি
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5 ">
                  <svg
                    width="24"
                    height="18"
                    viewBox="0 0 24 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.75 0.5C1.95507 0.5 0.5 1.95508 0.5 3.75V14.25C0.5 16.0449 1.95507 17.5 3.75 17.5H13.25C15.0449 17.5 16.5 16.0449 16.5 14.25V3.75C16.5 1.95507 15.0449 0.5 13.25 0.5H3.75ZM21.6232 15.6431L18 12.0935V5.99889L21.6121 2.3706C22.3988 1.58044 23.748 2.13753 23.748 3.25251V14.7502C23.748 15.8577 22.4143 16.4181 21.6232 15.6431Z"
                      fill="#B2F100"
                    />
                  </svg>

                  <div>
                    <p className="text-paragraph dark:text-darkParagraph text-xl">
                      ভিডিও ডিউরেশন
                    </p>
                    <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                      50 ঘণ্টা
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5 ">
                  <svg
                    width="22"
                    height="24"
                    viewBox="0 0 22 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 2.75C4 1.23122 5.23122 0 6.75 0H14.75C16.2688 0 17.5 1.23122 17.5 2.75V3H19.75C20.7165 3 21.5 3.7835 21.5 4.75V7.75C21.5 10.0902 19.6085 11.9887 17.271 11.9999C16.5627 14.6458 14.2871 16.6507 11.5 16.9588V19H14.25C16.0449 19 17.5 20.4551 17.5 22.25V22.75C17.5 23.4404 16.9404 24 16.25 24H5.25C4.55964 24 4 23.4404 4 22.75V22.25C4 20.4551 5.45507 19 7.25 19H10V16.9588C7.21294 16.6507 4.93729 14.6458 4.22905 11.9999C1.89148 11.9887 0 10.0902 0 7.75V4.75C0 3.7835 0.783502 3 1.75 3H4V2.75ZM4 4.5H1.75C1.61193 4.5 1.5 4.61193 1.5 4.75V7.75C1.5 9.18593 2.60055 10.3648 4.00416 10.4892C4.00139 10.4098 4 10.3301 4 10.25V4.5ZM17.4958 10.4892C18.8995 10.3648 20 9.18593 20 7.75V4.75C20 4.61193 19.8881 4.5 19.75 4.5H17.5V10.25C17.5 10.3301 17.4986 10.4098 17.4958 10.4892Z"
                      fill="#FFA500"
                    />
                  </svg>

                  <div>
                    <p className="text-paragraph dark:text-darkParagraph text-xl">
                      কন্টেস্ট
                    </p>
                    <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                      10 টি
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5 ">
                  <svg
                    width="25"
                    height="18"
                    viewBox="0 0 25 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.89992 0.761631C6.35553 1.21724 6.35553 1.95593 5.89992 2.41155C2.25385 6.05761 2.25385 11.9691 5.89992 15.6151C6.35553 16.0707 6.35553 16.8094 5.89992 17.265C5.4443 17.7207 4.70561 17.7207 4.25 17.265C-0.307292 12.7078 -0.307292 5.31892 4.25 0.761631C4.70561 0.306019 5.4443 0.306019 5.89992 0.761631ZM20.7534 0.761631C25.3107 5.31892 25.3107 12.7078 20.7534 17.265C20.2978 17.7207 19.5591 17.7207 19.1035 17.265C18.6479 16.8094 18.6479 16.0707 19.1035 15.6151C22.7496 11.9691 22.7496 6.05761 19.1035 2.41155C18.6479 1.95593 18.6479 1.21724 19.1035 0.761631C19.5591 0.306019 20.2978 0.306019 20.7534 0.761631ZM9.36101 4.1139C9.81662 4.56951 9.81662 5.30821 9.36101 5.76382C7.57488 7.54994 7.57488 10.4458 9.36101 12.2319C9.81662 12.6876 9.81662 13.4262 9.36101 13.8819C8.9054 14.3375 8.1667 14.3375 7.71109 13.8819C5.01374 11.1845 5.01374 6.81125 7.71109 4.1139C8.1667 3.65829 8.9054 3.65829 9.36101 4.1139ZM17.479 4.1139C20.1764 6.81125 20.1764 11.1845 17.479 13.8819C17.0234 14.3375 16.2847 14.3375 15.8291 13.8819C15.3735 13.4262 15.3735 12.6876 15.8291 12.2319C17.6153 10.4458 17.6153 7.54994 15.8291 5.76382C15.3735 5.30821 15.3735 4.56951 15.8291 4.1139C16.2847 3.65829 17.0234 3.65829 17.479 4.1139ZM12.5951 7.3449C13.5616 7.3449 14.3451 8.1284 14.3451 9.0949C14.3451 10.0614 13.5616 10.8449 12.5951 10.8449C11.6286 10.8449 10.8451 10.0614 10.8451 9.0949C10.8451 8.1284 11.6286 7.3449 12.5951 7.3449Z"
                      fill="#EE4878"
                    />
                  </svg>

                  <div>
                    <p className="text-paragraph dark:text-darkParagraph text-xl">
                      লাইভ ক্লাস
                    </p>
                    <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                      16 টি
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5 ">
                  <svg
                    width="24"
                    height="20"
                    viewBox="0 0 24 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.43279 17.7134L14.4283 1.37476C14.6819 0.782437 15.3677 0.507854 15.96 0.761462C16.51 0.996955 16.786 1.60507 16.6196 2.16499L16.5733 2.29316L9.57778 18.6318C9.32417 19.2241 8.63841 19.4987 8.04609 19.2451C7.49607 19.0096 7.22003 18.4015 7.38645 17.8415L7.43279 17.7134L14.4283 1.37476L7.43279 17.7134ZM0.674717 9.17567L5.34138 4.509C5.797 4.05339 6.53569 4.05339 6.9913 4.509C7.41186 4.92957 7.44422 5.59134 7.08835 6.04901L6.9913 6.15892L3.14959 10.0006L6.9913 13.8423C7.44691 14.2979 7.44691 15.0366 6.9913 15.4923C6.57073 15.9128 5.90897 15.9452 5.45129 15.5893L5.34138 15.4923L0.674717 10.8256C0.254152 10.405 0.221801 9.74325 0.577663 9.28558L0.674717 9.17567L5.34138 4.509L0.674717 9.17567ZM17.0071 4.50756C17.4277 4.08701 18.0895 4.05469 18.5471 4.41057L18.657 4.50763L23.3247 9.17571C23.7454 9.59647 23.7775 10.2586 23.4213 10.7162L23.3241 10.8261L18.6564 15.4876C18.2005 15.9429 17.4618 15.9424 17.0065 15.4865C16.5862 15.0656 16.5543 14.4039 16.9105 13.9464L17.0076 13.8366L20.8493 10L17.007 6.15747C16.5514 5.70184 16.5515 4.96315 17.0071 4.50756Z"
                      fill="#2563EB"
                    />
                  </svg>

                  <div>
                    <p className="text-paragraph dark:text-darkParagraph text-xl">
                      কোডিং প্রব্লেম
                    </p>
                    <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                      300 টি
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5 ">
                  <svg
                    width="19"
                    height="24"
                    viewBox="0 0 19 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.6254 0.333611C17.3974 0.333611 18.8338 1.77003 18.8338 3.54194V20.4566C18.8338 22.2285 17.3974 23.6649 15.6254 23.6649H3.37533C1.60341 23.6649 0.166992 22.2285 0.166992 20.4566V3.54194C0.166992 1.77003 1.60341 0.333611 3.37533 0.333611L3.71532 0.333008V9.86135C3.71532 10.7341 4.63742 11.0444 5.25366 10.7239L5.35899 10.6608L7.80079 9.26397L10.298 10.6982C10.8177 11.0578 11.7686 10.8159 11.8727 10.0095L11.882 9.86135V0.333008L15.6254 0.333611ZM10.132 0.333008V8.58799L8.24012 7.50077C7.97558 7.37416 7.61582 7.37704 7.31518 7.52704L7.19041 7.60039L5.46532 8.58719V0.333008H10.132Z"
                      fill="#B153E0"
                    />
                  </svg>

                  <div>
                    <p className="text-paragraph dark:text-darkParagraph text-xl">
                      আর্কাইভ ক্লাস{" "}
                    </p>
                    <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                      30 টি
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-20 pb-6 border-b border-gray-300/20">
                <button
                  onClick={() => {
                    changeTab("studyPlan");
                  }}
                  className={`${
                    activeTab.studyPlan
                      ? "text-[#F1BA41] border-[#F1BA41] bg-[#F1BA41]/20 dark:text-[#F1BA41] dark:border-[#F1BA41] dark:bg-[#F1BA41]/5"
                      : "text-gray-600/70 border-gray-600/70 bg-gray-600/5 hover:text-gray-600/90 hover:border-gray-600/90 dark:text-gray-300/40 dark:border-gray-300/40 dark:hover:text-gray-300/70 dark:hover:border-gray-300/70"
                  } px-4 lg:px-8 py-3 border rounded-full duration-150 ease-in-out text-sm lg:text-base`}
                >
                  স্টাডি প্ল্যান
                </button>{" "}
                <button
                  onClick={() => {
                    changeTab("instructor");
                  }}
                  className={`${
                    activeTab.instructor
                      ? "text-[#F1BA41] border-[#F1BA41] bg-[#F1BA41]/20 dark:text-[#F1BA41] dark:border-[#F1BA41] dark:bg-[#F1BA41]/5"
                      : "text-gray-600/70 border-gray-600/70 bg-gray-600/5 hover:text-gray-600/90 hover:border-gray-600/90 dark:text-gray-300/40 dark:border-gray-300/40 dark:hover:text-gray-300/70 dark:hover:border-gray-300/70"
                  } px-4 lg:px-8 py-3 border rounded-full duration-150 ease-in-out text-sm lg:text-base`}
                >
                  ইন্সট্রাক্টর
                </button>{" "}
                <button
                  onClick={() => {
                    changeTab("courseComplete");
                  }}
                  className={`${
                    activeTab.courseComplete
                      ? "text-[#F1BA41] border-[#F1BA41] bg-[#F1BA41]/20 dark:text-[#F1BA41] dark:border-[#F1BA41] dark:bg-[#F1BA41]/5"
                      : "text-gray-600/70 border-gray-600/70 bg-gray-600/5 hover:text-gray-600/90 hover:border-gray-600/90 dark:text-gray-300/40 dark:border-gray-300/40 dark:hover:text-gray-300/70 dark:hover:border-gray-300/70"
                  } px-4 lg:px-8 py-3 border rounded-full duration-150 ease-in-out text-sm lg:text-base`}
                >
                  কোর্স সম্পর্কে বিস্তারিত
                </button>{" "}
                <button
                  onClick={() => {
                    changeTab("successStudents");
                  }}
                  className={`${
                    activeTab.successStudents
                      ? "text-[#F1BA41] border-[#F1BA41] bg-[#F1BA41]/20 dark:text-[#F1BA41] dark:border-[#F1BA41] dark:bg-[#F1BA41]/5"
                      : "text-gray-600/70 border-gray-600/70 bg-gray-600/5 hover:text-gray-600/90 hover:border-gray-600/90 dark:text-gray-300/40 dark:border-gray-300/40 dark:hover:text-gray-300/70 dark:hover:border-gray-300/70"
                  } px-4 lg:px-8 py-3 border rounded-full duration-150 ease-in-out text-sm lg:text-base`}
                >
                  সাকসেসফুল স্টুডেন্টস
                </button>{" "}
              </div>
              {activeTab.studyPlan && (
                <div>
                  <div className="my-8 flex lg:items-center gap-8 flex-col lg:flex-row ">
                    <p className="text-2xl lg:text-3xl font-semibold">
                      স্টাডি প্ল্যান
                    </p>
                    <div className="flex items-center px-4 py-2 text-lg border border-[#B153E0]/50 bg-[#B153E0]/5 gap-4 rounded flex-wrap">
                      <p>
                        {englishToBanglaNumbers(
                          countModulesAssignmentsVideos(courseData)
                            .totalModules,
                        )}{" "}
                        টি মডিউল
                      </p>

                      {/* <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="0.829956"
                          y="0.5"
                          width="4"
                          height="4"
                          rx="2"
                          fill="#FFA500"
                        />
                      </svg>
                      <p>
                        {englishToBanglaNumbers(
                          countModulesAssignmentsVideos(courseData)
                            .totalAssignments,
                        )}{" "}
                        টি এসাইনমেন্ট{" "}
                      </p> */}
                      <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="0.829956"
                          y="0.5"
                          width="4"
                          height="4"
                          rx="2"
                          fill="#FFA500"
                        />
                      </svg>
                      <p>
                        {englishToBanglaNumbers(
                          countModulesAssignmentsVideos(courseData).totalVideos,
                        )}{" "}
                        টি ভিডিও
                      </p>
                      <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="0.829956"
                          y="0.5"
                          width="4"
                          height="4"
                          rx="2"
                          fill="#FFA500"
                        />
                      </svg>
                      <p>
                        {englishToBanglaNumbers(
                          countModulesAssignmentsVideos(courseData).totalQuiz,
                        )}{" "}
                        টি কুইজ
                      </p>
                      <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="0.829956"
                          y="0.5"
                          width="4"
                          height="4"
                          rx="2"
                          fill="#FFA500"
                        />
                      </svg>
                      <p>
                        {englishToBanglaNumbers(
                          countModulesAssignmentsVideos(courseData).totalCodes,
                        )}{" "}
                        টি কোডিং চ্যালেঞ্জ
                      </p>
                      <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="0.829956"
                          y="0.5"
                          width="4"
                          height="4"
                          rx="2"
                          fill="#FFA500"
                        />
                      </svg>
                      <p>
                        {englishToBanglaNumbers(
                          countModulesAssignmentsVideos(courseData).totalPDF,
                        )}{" "}
                        টি পিডিএফ
                      </p>
                    </div>
                  </div>
                  <div className="">
                    {courseData?.chapters.map((elem: any, index: any) => (
                      <div
                        className={
                          "dark:bg-gray-200/5 bg-gray-400/20 border-gray-400/50 backdrop-blur-lg border dark:border-gray-200/20 mb-6 rounded-lg overflow-hidden"
                        }
                        key={Math.random()}
                      >
                        <div
                          className="p-5 cursor-pointer"
                          onClick={() => toggleChapterItem(index)}
                        >
                          <div className="flex justify-between">
                            <div
                              className="flex gap-4 flex-col lg:flex-row justify-start"
                              style={{ flex: 3 }}
                            >
                              {elem.is_free ? (
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
                                    !elem.is_free && "text-[#565656]"
                                  }`}
                                >
                                  {elem.title}
                                </p>
                                <div className="flex flex-wrap gap-3 lg:items-center mt-3 text-sm font-medium">
                                  {countAssignmentsAndVideos(elem.modules)
                                    .videoCount > 0 && (
                                    <div
                                      className={`flex items-center gap-3 ${!elem.is_free && "text-[#565656]"}`}
                                    >
                                      <svg
                                        width="13"
                                        height="12"
                                        viewBox="0 0 13 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <g clipPath="url(#clip0_261_8176)">
                                          <path
                                            d="M8.95996 3.75C8.95996 4.22 8.76307 4.67 8.41301 5.01C8.06295 5.36 7.6067 5.56 7.12996 5.56C6.65323 5.56 6.19697 5.36 5.84691 5.01C5.49685 4.67 5.29996 4.22 5.29996 3.75C5.29996 3.28 5.49685 2.83 5.84691 2.48C6.19697 2.13 6.65323 1.94 7.12996 1.94C7.6067 1.94 8.06295 2.13 8.41301 2.48C8.76307 2.83 8.95996 3.28 8.95996 3.75Z"
                                            fill={
                                              elem.is_free
                                                ? "#B153E0"
                                                : "#565656"
                                            }
                                          />
                                          <path
                                            d="M3.45996 7.2C3.45996 6.66 3.99996 6.12 4.72796 5.7C4.15996 6.09 3.45996 7.07 3.45996 8.15C3.45996 9.23 4.15996 10.21 4.72796 10.6C3.99996 10.18 3.45996 9.65 3.45996 9.1V7.2Z"
                                            fill={
                                              elem.is_free
                                                ? "#B153E0"
                                                : "#565656"
                                            }
                                          />
                                          <path
                                            d="M10.8 7.2C10.8 6.66 10.26 6.12 9.53196 5.7C10.1 6.09 10.8 7.07 10.8 8.15C10.8 9.23 10.1 10.21 9.53196 10.6C10.26 10.18 10.8 9.65 10.8 9.1V7.2Z"
                                            fill={
                                              elem.is_free
                                                ? "#B153E0"
                                                : "#565656"
                                            }
                                          />
                                          <path
                                            d="M7.12996 6.12C5.95196 6.12 4.22396 7.19 3.45996 8.82C4.22396 10.45 5.95196 11.52 7.12996 11.52C8.30796 11.52 10.036 10.45 10.8 8.82C10.036 7.19 8.30796 6.12 7.12996 6.12Z"
                                            fill={
                                              elem.is_free
                                                ? "#B153E0"
                                                : "#565656"
                                            }
                                          />
                                        </g>
                                      </svg>
                                      <p>
                                        {
                                          countAssignmentsAndVideos(
                                            elem.modules,
                                          ).videoCount
                                        }{" "}
                                        টি ভিডিও{" "}
                                      </p>
                                    </div>
                                  )}
                                  {countAssignmentsAndVideos(elem.modules)
                                    .quizCount > 0 && (
                                    <div
                                      className={`flex items-center gap-3 ${!elem.is_free && "text-[#565656]"}`}
                                    >
                                      <svg
                                        width="13"
                                        height="12"
                                        viewBox="0 0 13 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M6.5 0C3.18629 0 0.5 2.68629 0.5 6C0.5 9.31371 3.18629 12 6.5 12C9.81371 12 12.5 9.31371 12.5 6C12.5 2.68629 9.81371 0 6.5 0ZM7.35714 9L6.5 8.14286L4.07143 5.71429L4.92857 4.85714L6.5 6.42857L8.92857 4L9.78571 4.85714L7.35714 7.28571V9Z"
                                          fill={
                                            elem.is_free ? "#B153E0" : "#565656"
                                          }
                                        />
                                      </svg>
                                      <p>
                                        {
                                          countAssignmentsAndVideos(
                                            elem.modules,
                                          ).quizCount
                                        }{" "}
                                        টি কুইজ{" "}
                                      </p>
                                    </div>
                                  )}
                                  {countAssignmentsAndVideos(elem.modules)
                                    .codeCount > 0 && (
                                    <div
                                      className={`flex items-center gap-3 ${!elem.is_free && "text-[#565656]"}`}
                                    >
                                      <svg
                                        width="13"
                                        height="12"
                                        viewBox="0 0 13 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M4.83333 9L1.5 6L4.83333 3M8.16667 3L11.5 6L8.16667 9"
                                          stroke={
                                            elem.is_free ? "#B153E0" : "#565656"
                                          }
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                      <p>
                                        {
                                          countAssignmentsAndVideos(
                                            elem.modules,
                                          ).codeCount
                                        }{" "}
                                        টি কোডিং প্রব্লেম{" "}
                                      </p>
                                    </div>
                                  )}
                                  {countAssignmentsAndVideos(elem.modules)
                                    .pdfCount > 0 && (
                                    <div
                                      className={`flex items-center gap-3 ${!elem.is_free && "text-[#565656]"}`}
                                    >
                                      <svg
                                        width="13"
                                        height="12"
                                        viewBox="0 0 13 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M7.5 1H3.5C2.94772 1 2.5 1.44772 2.5 2V10C2.5 10.5523 2.94772 11 3.5 11H9.5C10.0523 11 10.5 10.5523 10.5 10V4L7.5 1Z"
                                          stroke={
                                            elem.is_free ? "#B153E0" : "#565656"
                                          }
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M7.5 1V4H10.5"
                                          stroke={
                                            elem.is_free ? "#B153E0" : "#565656"
                                          }
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M8.5 6.5H4.5"
                                          stroke={
                                            elem.is_free ? "#B153E0" : "#565656"
                                          }
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M8.5 8.5H4.5"
                                          stroke={
                                            elem.is_free ? "#B153E0" : "#565656"
                                          }
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M5.5 4.5H4.5"
                                          stroke={
                                            elem.is_free ? "#B153E0" : "#565656"
                                          }
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                      <p>
                                        {
                                          countAssignmentsAndVideos(
                                            elem.modules,
                                          ).pdfCount
                                        }{" "}
                                        টি পিডিএফ{" "}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {elem.is_free ? (
                                <p
                                  className="px-4 py-1 text-[#1CAB55] bg-[#1CAB55]/10 rounded-full text-sm"
                                  style={{ flex: 1 }}
                                >
                                  ফ্রি দেখুন
                                </p>
                              ) : (
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
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`transition-transform duration-500 ease-in-out transform ${openChapterItems[index] ? "rotate-180" : "rotate-0"}`}
                              >
                                <path
                                  d="M8 12L2 6H14L8 12Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`transition-all duration-500 ease-in-out px-6 overflow-hidden ${
                            openChapterItems[index]
                              ? "max-h-[2000px] opacity-100 transform translate-y-0"
                              : "max-h-0 opacity-0 transform -translate-y-4"
                          }`}
                        >
                          <div className="pt-6"></div>
                          {elem.modules.map((module: any) => (
                            <div
                              className="flex gap-4 items-center mb-4"
                              key={Math.random()}
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
                                    fill={elem.is_free ? "#B153E0" : "#565656"}
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
                                    fill={elem.is_free ? "#B153E0" : "#565656"}
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
                                    fill={elem.is_free ? "#B153E0" : "#565656"}
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
                                    fill={elem.is_free ? "#B153E0" : "#565656"}
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
                                    fill={elem.is_free ? "#B153E0" : "#565656"}
                                  />
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M7.85422 5.5H12.0442C13.5892 5.5 14.4492 6.39 14.4492 7.915V13.08C14.4492 14.63 13.5892 15.5 12.0452 15.5H7.85422C6.33422 15.5 5.44922 14.63 5.44922 13.08V7.915C5.44922 6.39 6.33422 5.5 7.85422 5.5ZM7.98922 7.83V7.825H9.48322C9.58732 7.825 9.68715 7.86635 9.76076 7.93996C9.83437 8.01357 9.87572 8.1134 9.87572 8.2175C9.87572 8.3216 9.83437 8.42143 9.76076 8.49504C9.68715 8.56865 9.58732 8.61 9.48322 8.61H7.98922C7.88578 8.61 7.78659 8.56891 7.71345 8.49577C7.64031 8.42263 7.59922 8.32343 7.59922 8.22C7.59922 8.11657 7.64031 8.01737 7.71345 7.94423C7.78659 7.87109 7.88578 7.83 7.98922 7.83ZM7.98922 10.87H11.9092C12.0127 10.87 12.1119 10.8289 12.185 10.7558C12.2581 10.6826 12.2992 10.5834 12.2992 10.48C12.2992 10.3766 12.2581 10.2774 12.185 10.2042C12.1119 10.1311 12.0127 10.09 11.9092 10.09H7.98922C7.88578 10.09 7.78659 10.1311 7.71345 10.2042C7.64031 10.2774 7.59922 10.3766 7.59922 10.48C7.59922 10.5834 7.64031 10.6826 7.71345 10.7558C7.78659 10.8289 7.88578 10.87 7.98922 10.87ZM7.98922 13.155H11.9092C12.1092 13.135 12.2592 12.965 12.2592 12.765C12.2605 12.6674 12.2254 12.5728 12.1606 12.4998C12.0959 12.4267 12.0063 12.3804 11.9092 12.37H7.98922C7.91552 12.3629 7.84131 12.3766 7.77497 12.4095C7.70864 12.4423 7.65281 12.4931 7.61381 12.556C7.5748 12.619 7.55417 12.6915 7.55424 12.7656C7.55431 12.8396 7.57509 12.9121 7.61422 12.975C7.69422 13.1 7.83922 13.175 7.98922 13.155Z"
                                    fill="white"
                                  />
                                </svg>
                              )}
                              <p className="text-black dark:text-[#737373] text-base">
                                {module.data.category === "VIDEO" && "Video:"}{" "}
                                {module.data.category === "ASSIGNMENT" &&
                                  "Assignment:"}{" "}
                                {module.data.category === "CODE" && "Code:"}{" "}
                                {module.data.category === "QUIZ" && "Quiz:"}{" "}
                                {module.data.category === "PDF" && "PDF:"}{" "}
                                {module.title}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab.instructor && (
                <div className="py-12 relative">
                  <svg
                    viewBox="0 0 904 1160"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute -left-[200px] -top-[200px] h-full w-full "
                    style={{ zIndex: "-1" }}
                  >
                    <g filter="url(#filter0_f_261_7930)">
                      <ellipse
                        cx="268.669"
                        cy="580.032"
                        rx="136.757"
                        ry="76.9931"
                        transform="rotate(-10.6934 268.669 580.032)"
                        fill="#B153E0"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_f_261_7930"
                        x="-366.482"
                        y="0.212158"
                        width="1270.3"
                        height="1159.64"
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
                          result="effect1_foregroundBlur_261_7930"
                        />
                      </filter>
                    </defs>
                  </svg>

                  <h2 className="text-2xl lg:text-4xl font-semibold pb-12 relative z-10">
                    কোর্স ইন্সট্রাক্টর
                  </h2>
                  {courseData.instructor_list.instructors.map((instructor) => (
                    <div
                      className=" my-7 rounded-xl cursor-pointer border border-purple/0 border-r-0 hover:border-r-1 hover:border-purple/30 duration-150 ease-in-out z-10"
                      key={Math.random()}
                      style={{
                        background: user.darkMode
                          ? "linear-gradient(120deg, rgba(202, 101, 253, 0.13) 0%, rgba(177, 83, 224, 0.00) 100%)"
                          : "linear-gradient(120deg, rgba(202, 101, 253, 0.4) 0%, rgba(177, 83, 224, 0.00) 100%)",
                      }}
                    >
                      <div
                        className=" rounded-xl px-4 lg:px-12  py-4  mx-[1px] dark:bg-[#0B060D]/30 relative top-[1px]"
                        style={{}}
                      >
                        <div className="flex  gap-4  justify-between items-center">
                          <div className="flex flex-col md:flex-row md:items-center gap-8 ">
                            {instructor.imageUploadedLink ? (
                              <img
                                src={instructor.imageUploadedLink}
                                alt=""
                                className="max-w-[200px] rounded-xl"
                              />
                            ) : (
                              <img
                                src="/Frame 1000004442.png"
                                alt=""
                                className="max-w-[100px]"
                              />
                            )}
                            <div>
                              <p className="text-2xl">{instructor.name}</p>
                              <p className=" text-paragraph dark:text-darkParagraph  mt-1">
                                {instructor.credibility
                                  .split("\n")
                                  .map((elem: any) => (
                                    <>
                                      {elem}
                                      <br />
                                    </>
                                  ))}
                              </p>
                            </div>
                          </div>
                          <BsChevronRight color="#B153E0" size={24} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab.courseComplete && (
                <div>
                  <h2 className="text-2xl lg:text-4xl font-semibold pt-12 border-t border-gray-300/10  relative z-10">
                    কোর্স সম্পর্কে বিস্তারিত
                  </h2>
                  <div className="my-6 text-black/70 dark:text-[#A3A3A3] text-lg relative z-10">
                    <div
                      className={`${!expandedDescription && "max-h-[150px] overflow-hidden relative"} transition-all duration-300`}
                    >
                      {courseData.description
                        .split("\n")
                        .map((paragraph, index) => (
                          <p key={index} className="mb-4">
                            {paragraph}
                          </p>
                        ))}
                    </div>
                    {courseData.description.length > 300 && (
                      <button
                        onClick={() =>
                          setExpandedDescription(!expandedDescription)
                        }
                        className="flex items-center gap-2 text-purple hover:text-purple/80 font-medium mt-2 transition-all"
                      >
                        {expandedDescription ? "সংক্ষিপ্ত করো" : "আরও পড়ো"}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`transition-transform duration-300 ${expandedDescription ? "rotate-180" : ""}`}
                        >
                          <path d="M8 12L2 6H14L8 12Z" fill="currentColor" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="mb-8">
                    <Link
                      href="/success-story"
                      className="inline-flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-purple to-[#8A2BE2] rounded-lg font-medium hover:opacity-90 transition-all"
                    >
                      সাকসেসফুল স্টুডেন্টসদের দেখো
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>

                  <div className=" pt-8 border-t border-gray-300/10 pb-8">
                    <p className="text-2xl lg:text-4xl pb-8 font-semibold">
                      শিক্ষার্থীরা যা বলছে
                    </p>

                    <div className="max-w-[80vw] lg:max-w-[40vw] lgXl:max-w-[50vw] mx-auto">
                      <Slider {...settings}>
                        {courseData.feedback_list.feedbacks.map(
                          (feedback: any) => (
                            <div
                              className="bg-gray-400/20 dark:bg-gray-300/10 backdrop-blur-lg rounded-lg p-6 "
                              key={Math.random()}
                            >
                              <svg
                                width="34"
                                height="23"
                                viewBox="0 0 34 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_25_7047)">
                                  <path
                                    d="M8.01195 8.3856C8.75922 7.05093 10.1173 5.6158 12.4273 4.24813C13.0727 3.88147 13.4804 3.21413 13.4804 2.51307C13.4804 1.07793 11.9859 0.076932 10.6277 0.677532C6.72055 2.37887 0.166016 6.61753 0.166016 15.3926C0.166016 19.3299 3.39268 22.5001 7.36662 22.5001C11.3405 22.5001 14.6009 19.3299 14.6009 15.3926C14.6009 11.7223 11.7138 8.71927 8.01195 8.3856Z"
                                    fill="#F1BA41"
                                  />
                                </g>
                                <g clipPath="url(#clip1_25_7047)">
                                  <path
                                    d="M27.0119 8.3856C27.7592 7.05093 29.1173 5.6158 31.4273 4.24813C32.0727 3.88147 32.4804 3.21413 32.4804 2.51307C32.4804 1.07793 30.9859 0.076932 29.6277 0.677532C25.7205 2.37887 19.166 6.61753 19.166 15.3926C19.166 19.3299 22.3927 22.5001 26.3666 22.5001C30.3405 22.5001 33.6009 19.3299 33.6009 15.3926C33.6009 11.7223 30.7138 8.71927 27.0119 8.3856Z"
                                    fill="#F1BA41"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_25_7047">
                                    <rect
                                      width="15"
                                      height="22"
                                      fill="white"
                                      transform="translate(0 0.5)"
                                    />
                                  </clipPath>
                                  <clipPath id="clip1_25_7047">
                                    <rect
                                      width="15"
                                      height="22"
                                      fill="white"
                                      transform="translate(19 0.5)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>

                              <p className="py-8 text-xl text-paragraph dark:text-darkParagraph">
                                {feedback.description}
                              </p>
                              <div className="flex gap-4">
                                <img
                                  src={feedback.imageUploadedLink}
                                  alt=""
                                  className="rounded-full max-w-[50px]"
                                />
                                <div>
                                  <p className="text-xl">{feedback.name}</p>
                                  <p className="text-paragraph dark:text-darkParagraph">
                                    {feedback.bio}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </Slider>
                    </div>
                  </div>

                  <div className=" pt-8 border-t border-gray-300/10 relative">
                    <svg
                      viewBox="0 0 852 1192"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute -top-[200px] -left-[200px] h-full"
                      style={{ zIndex: "-1" }}
                    >
                      <g filter="url(#filter0_f_275_7266)">
                        <ellipse
                          cx="189.598"
                          cy="595.691"
                          rx="163.368"
                          ry="91.9748"
                          transform="rotate(-10.6934 189.598 595.691)"
                          fill="#DE9931"
                          fillOpacity="0.75"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_f_275_7266"
                          x="-471.852"
                          y="0.339355"
                          width="1322.9"
                          height="1190.7"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feGaussianBlur
                            stdDeviation="250"
                            result="effect1_foregroundBlur_275_7266"
                          />
                        </filter>
                      </defs>
                    </svg>

                    <p className="text-xl lg:text-3xl mb-8 font-semibold">
                      সচরাচর জানতে চাও প্রশ্নের উত্তর
                    </p>
                    {courseData.faq_list.faqs.map((faq: any, index: any) => (
                      <div
                        className="dark:bg-gray-200/5 bg-gray-400/20 border-gray-400/50 backdrop-blur-lg border dark:border-gray-200/20 mb-4 rounded-lg overflow-hidden"
                        key={Math.random()}
                      >
                        <div
                          className="text-xl font-medium p-5 cursor-pointer flex justify-between items-center"
                          onClick={() => toggleFaqItem(index)}
                        >
                          {faq.question}
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`transition-all duration-700 ease-in-out ${openFaqItems[index] ? "rotate-180" : ""}`}
                          >
                            <path d="M8 12L2 6H14L8 12Z" fill="currentColor" />
                          </svg>
                        </div>
                        <div
                          className={`transition-all duration-500 ease-in-out px-5 overflow-hidden ${
                            openFaqItems[index]
                              ? "max-h-[500px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <p className="pt-5">{faq.answer}</p>
                          <div className="pb-5"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab.successStudents && (
                <div>
                  <h2 className="text-2xl lg:text-4xl font-semibold pt-12 border-t border-gray-300/10 relative z-10">
                    আমাদের সাকসেসফুল স্টুডেন্টস
                  </h2>
                  <div className="my-6 text-black/70 dark:text-[#A3A3A3] text-lg relative z-10">
                    <p>
                      ৫-৬ মাসব্যাপী আমাদের কম্পিটিটিভ প্রোগ্রামিং কোর্সটি
                      সফলভাবে শেষ করার পর, বিগত ব্যাচের অনেক শিক্ষার্থীই বিভিন্ন
                      আন্তর্জাতিক ও জাতীয় অনলাইন জাজ প্ল্যাটফর্মে অসাধারণ
                      দক্ষতা প্রদর্শন করেছে।
                    </p>
                    <p className="mt-4">
                      আমরা তাদের মধ্য থেকে কিছু স্ট্যান্ডআউট পারফর্মারেরদের তুলে
                      ধরছি, যারা কোর্স শেষে বাস্তব জাজ প্ল্যাটফর্মে নিজেদের মেধা
                      ও পরিশ্রমের মাধ্যমে প্রমাণ করেছে।
                    </p>
                  </div>

                  <div className="my-8">
                    <Link
                      href="/success-story"
                      className="inline-flex items-center gap-2 px-8 py-4 text-white bg-gradient-to-r from-purple to-[#8A2BE2] rounded-lg font-medium hover:opacity-90 transition-all text-lg"
                    >
                      সবাইকে দেখো
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div className="  text-heading dark:text-darkHeading bg-gray-400/30 dark:bg-gray-100/5 backdrop-blur-xl rounded-xl rounded-b-none  ">
                <iframe
                  className="rounded-t-xl w-full min-h-[200px] lg:min-h-[260px]"
                  src={
                    courseData.intro_video
                      ? courseData.intro_video +
                        "?rel=0&modestbranding=1&autohide=1&showinfo=0"
                      : ""
                  }
                  title={courseData?.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
                <div className="p-4">
                  <div className="flex flex-col lgXxl:flex-row items-center gap-4 md:gap-2 justify-between pt-2 pb-4 border-b border-gray-300/20">
                    <div>
                      <p className="font-bold text-base text-paragraph dark:text-darkParagraph text-center lgXxl:text-left">
                        কোর্স প্রাইস
                      </p>
                      <div className="flex items-center gap-4 ">
                        <div>
                          <p className="text-3xl font-bold ">
                            {" "}
                            {courseData?.price}/-
                          </p>
                        </div>
                        <div>
                          <p className="text-[#BE2853] line-through font-semibold text-lg">
                            {courseData?.x_price}/-
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 ">
                      <div className="flex items-center gap-4">
                        {/* <svg
                        width="15"
                        height="13"
                        viewBox="0 0 15 13"
                        fill="none"
                        className="w-12 h-auto"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.6733 11.8332H14.0067V10.4998C14.0067 9.39527 13.1112 8.49984 12.0067 8.49984C11.3696 8.49984 10.8021 8.7977 10.4358 9.26176M10.6733 11.8332H4.00667M10.6733 11.8332V10.4998C10.6733 10.0623 10.5891 9.64454 10.4358 9.26176M4.00667 11.8332H0.67334V10.4998C0.67334 9.39527 1.56877 8.49984 2.67334 8.49984C3.31041 8.49984 3.87791 8.7977 4.24417 9.26176M4.00667 11.8332V10.4998C4.00667 10.0623 4.09096 9.64454 4.24417 9.26176M4.24417 9.26176C4.73567 8.03385 5.93655 7.1665 7.34001 7.1665C8.74346 7.1665 9.94434 8.03385 10.4358 9.26176M9.34001 3.1665C9.34001 4.27107 8.44458 5.1665 7.34001 5.1665C6.23544 5.1665 5.34001 4.27107 5.34001 3.1665C5.34001 2.06193 6.23544 1.1665 7.34001 1.1665C8.44458 1.1665 9.34001 2.06193 9.34001 3.1665ZM13.34 5.1665C13.34 5.90288 12.7431 6.49984 12.0067 6.49984C11.2703 6.49984 10.6733 5.90288 10.6733 5.1665C10.6733 4.43012 11.2703 3.83317 12.0067 3.83317C12.7431 3.83317 13.34 4.43012 13.34 5.1665ZM4.00667 5.1665C4.00667 5.90288 3.40972 6.49984 2.67334 6.49984C1.93696 6.49984 1.34001 5.90288 1.34001 5.1665C1.34001 4.43012 1.93696 3.83317 2.67334 3.83317C3.40972 3.83317 4.00667 4.43012 4.00667 5.1665Z"
                          stroke="#B153E0"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg> */}
                        <div className="text-center lgXxl:text-left">
                          <p className="font-bold text-base text-paragraph dark:text-darkParagraph ">
                            এনরোলমেন্ট চলছে
                          </p>
                          {/* <p className="text-3xl font-bold ">
                            {courseData?.enrolled} জন
                          </p> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-y-3 gap-x-3 border-b border-gray-300/30">
                    {/* <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5 ">
                      <div>
                        <p className="text-paragraph dark:text-darkParagraph text-xl">
                          প্রি বুকিং চলবে
                        </p>
                        <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                          ৩১ মার্চ
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5 ">
                      <div>
                        <p className="text-paragraph dark:text-darkParagraph text-xl">
                          সময়
                        </p>
                        <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                          রাত ১২:০০ টা
                        </p>
                      </div>
                    </div> */}
                    <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5 ">
                      <div>
                        <p className="text-paragraph dark:text-darkParagraph text-xl">
                          এনরোলমেন্ট শুরু
                        </p>
                        <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                          23 মার্চ
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5 ">
                      <div>
                        <p className="text-paragraph dark:text-darkParagraph text-xl">
                          এনরোলমেন্ট শেষ
                        </p>
                        <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                          10 এপ্রিল
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5 ">
                      <div>
                        <p className="text-paragraph dark:text-darkParagraph text-xl">
                          ওরিয়েন্টেশন ক্লাস
                        </p>
                        <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                          10 এপ্রিল
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5 ">
                      <div>
                        <p className="text-paragraph dark:text-darkParagraph text-xl">
                          সময়
                        </p>
                        <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                          রাত ৯:৩০
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg mt-6 font-bold">
                    এই কোর্সে তুমি পাচ্ছো
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 gap-y-1 gap-x-16">
                    {courseData.you_get.you_get.split(",").map((item: any) => (
                      <div
                        className="flex gap-2 items-center"
                        key={Math.random()}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="min-w-[16px] min-h-[16px]"
                        >
                          <g opacity="0.7">
                            <path
                              d="M8.00065 14.6663C4.31865 14.6663 1.33398 11.6817 1.33398 7.99967C1.33398 4.31767 4.31865 1.33301 8.00065 1.33301C11.6827 1.33301 14.6673 4.31767 14.6673 7.99967C14.6673 11.6817 11.6827 14.6663 8.00065 14.6663ZM8.00065 13.333C9.41512 13.333 10.7717 12.7711 11.7719 11.7709C12.7721 10.7707 13.334 9.41414 13.334 7.99967C13.334 6.58519 12.7721 5.22863 11.7719 4.22844C10.7717 3.22824 9.41512 2.66634 8.00065 2.66634C6.58616 2.66634 5.22961 3.22824 4.22942 4.22844C3.22922 5.22863 2.66732 6.58519 2.66732 7.99967C2.66732 9.41414 3.22922 10.7707 4.22942 11.7709C5.22961 12.7711 6.58616 13.333 8.00065 13.333ZM7.33598 10.6663L4.50732 7.83767L5.44998 6.89501L7.33598 8.78101L11.1067 5.00967L12.05 5.95234L7.33598 10.6663Z"
                              fill="#B153E0"
                            />
                          </g>
                        </svg>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>

                  <a
                    href="https://drive.google.com/file/d/1aSbPa5mM9YgwLHfI7SpPE12hOuolUNpK/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 text-heading dark:text-darkHeading border border-purple/30 hover:border-purple/60 dark:border-purple/30 dark:hover:border-purple/60 transition-all duration-300 rounded-lg font-medium relative group overflow-hidden"
                    style={{
                      boxShadow: "0 0 10px rgba(177, 83, 224, 0.1)",
                    }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-purple via-[#B153E0] to-purple transition-opacity duration-300"></div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-purple"
                    >
                      <path
                        d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
                        fill="currentColor"
                      />
                    </svg>
                    See Course Outline
                  </a>

                  <div className="mt-4 border-t py-4 border-b  border-gray-300/30">
                    <div className="">
                      <div className="flex  text-sm justify-center">
                        <p className="text-heading dark:text-darkHeading mr-16  font-bold text-lg">
                          অবশিষ্ট সময়
                        </p>
                        <div className="flex gap-2 items-center">
                          <svg
                            width="12"
                            height="15"
                            viewBox="0 0 12 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.66536 1.5V6.16667H10.6654L5.33203 13.5V8.83333H1.33203L6.66536 1.5Z"
                              stroke="url(#paint0_linear_4530_4930)"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <defs>
                              <linearGradient
                                id="paint0_linear_4530_4930"
                                x1="5.9987"
                                y1="1.5"
                                x2="5.9987"
                                y2="13.5"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stop-color="#CF8E16" />
                                <stop offset="1" stop-color="#FFE49C" />
                              </linearGradient>
                            </defs>
                          </svg>

                          <p className="text-[#FDAF22] text-lg">তারাতারি কর</p>
                        </div>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <div className="flex flex-col items-center">
                          <p className="text-heading dark:text-darkHeading bg-black/30 dark:bg-gray-300/5 py-3 px-6 rounded-lg font-bold text-4xl w-[80px] text-center">
                            {days.toString().padStart(2, "0")}
                          </p>
                          <p className="mt-1 text-lg font-bold text-paragraph dark:text-darkParagraph">
                            দিন
                          </p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-heading dark:text-darkHeading bg-black/30 dark:bg-gray-300/5 py-3 px-6 rounded-lg font-bold text-4xl w-[80px] text-center">
                            {hours.toString().padStart(2, "0")}
                          </p>
                          <p className="mt-1 text-lg font-bold text-paragraph dark:text-darkParagraph">
                            ঘন্টা
                          </p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-heading dark:text-darkHeading bg-black/30 dark:bg-gray-300/5 py-3 px-6 rounded-lg font-bold text-4xl w-[80px] text-center">
                            {minutes.toString().padStart(2, "0")}
                          </p>
                          <p className="mt-1 text-lg font-bold text-paragraph dark:text-darkParagraph">
                            মিনিট
                          </p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-heading dark:text-darkHeading bg-black/30 dark:bg-gray-300/5 py-3 px-6 rounded-lg font-bold text-4xl w-[80px] text-center">
                            {seconds.toString().padStart(2, "0")}
                          </p>
                          <p className="mt-1 text-lg font-bold text-paragraph dark:text-darkParagraph">
                            সেকেন্ড
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* for prebooking comment out this section */}
                    {/* <button
                      onClick={() => {
                        let token: any = "";
                        token = localStorage.getItem("token")
                          ? localStorage.getItem("token")
                          : "";
                        if (token.length > 0) {
                          const decodedToken: any = jwtDecode(token);

                          setPrebookingData({
                            name: decodedToken.name,
                            phone: decodedToken.login,
                            email: decodedToken.profile?.email,
                          });
                        }
                        setOpenPrebookCourse(true);
                      }}
                      className={`${courseData.isWishList ? "bg-gray-400 cursor-not-allowed" : "bg-[#1CAB55] hover:bg-opacity-50 ease-in-out duration-150 "} text-darkHeading py-3 w-full mt-8 rounded-xl font-bold`}
                    >
                      {courseData.isWishList
                        ? "Prebooked"
                        : "Prebook This Course"}
                    </button> */}
                    {/* for prebooking comment out this section */}
                  </div>

                  {!courseData.isTaken && (
                    <div className="mt-6">
                      <p className="text-lg font-semibold mb-1">Enter Coupon</p>
                      <div className="flex items-center gap-2">
                        <input
                          className="w-full px-3 py-3 rounded bg-gray-200   dark:bg-gray-200/20 outline-none focus:ring ring-gray-400/80 dark:ring-gray-300/80"
                          placeholder=" Coupon Code"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                          }}
                        />

                        <button
                          onClick={() => {
                            if (isLoggedIn()) {
                              const token = localStorage.getItem("token");
                              // setPrebookButtonLoading(true);

                              // const token = localStorage.getItem("token");
                              // axios
                              //   .post(
                              //     BACKEND_URL +
                              //       "/user/course/applyCoupon/" +
                              //       COURSE_ID_2,
                              //     {
                              //       coupon: couponCode,
                              //     },
                              //     {
                              //       headers: {
                              //         Authorization: `Bearer ${token}`,
                              //       },
                              //     },
                              //   )
                              //   .then((res) => {
                              //     setUser({ ...user, loading: false });

                              //     setPrebookButtonLoading(false);

                              //     toast.success(
                              //       "You have sucessfully bought this course!",
                              //     );
                              //     setCourseData({
                              //       ...courseData,
                              //       isTaken: true,
                              //     });
                              //     // router.push("/course/12");
                              //     //setUser({ ...user, loading: false });
                              //   })
                              //   .catch((err) => {
                              //     setUser({ ...user, loading: false });
                              //     toast.error("Wrong Coupon Code!");
                              //     setPrebookButtonLoading(false);
                              //   });
                              if (couponCode == "CPEARLYBIRD") {
                                setCourseData({
                                  ...courseData,
                                  price: 4500,
                                });
                                toast.success("Discount Applied!");
                              }
                              else if (couponCode == "ACSCHAMPION50") {
                                setCourseData({
                                  ...courseData,
                                  price: 3250,
                                });
                                toast.success("Congratulations! You have won 50% discount as ACS Champion Student!");
                              }
                              else if (couponCode == "CUETCSE24") {
                                setCourseData({
                                  ...courseData,
                                  price: 3750,
                                });
                                toast.success("CUET CSE 2024 Special Discount Applied!");
                              }
                               else if (couponCode == "CPINSTRUCTORSPECIAL") {
                                setCourseData({
                                  ...courseData,
                                  price: 3250,
                                });
                                toast.success("Discount Applied!");
                              } else if (couponCode == "CPSUPERSPECIAL") {
                                setCourseData({
                                  ...courseData,
                                  price: 2500,
                                });
                                toast.success("Discount Applied!");
                              } else if (couponCode == "CPAGENTSPECIAL") {
                                setCourseData({
                                  ...courseData,
                                  price: 4000,
                                });
                                toast.success("Discount Applied!");
                              }
                              else if (couponCode == "CPGSTSPECIAL") {
                                setCourseData({
                                  ...courseData,
                                  price: 4500,
                                });
                                toast.success("GST Special! Discount Applied!");
                              }
                               else if (couponCode == "CPSPECIAL") {
                                setCourseData({
                                  ...courseData,
                                  price: 5000,
                                });
                                toast.success("Discount Applied!");
                              }
                              //  else if (
                              //   couponCode == "cvpc-habib-50" &&
                              //   token &&
                              //   jwtDecode<any>(token).profile.email ==
                              //     "h.r.sihab155@gmail.com"
                              // ) {
                              //   setCourseData({
                              //     ...courseData,
                              //     price: 3000,
                              //   });
                              //   toast.success("Discount Applied!");
                              // } else if (
                              //   couponCode == "cvpc-nadim-50" &&
                              //   token &&
                              //   jwtDecode<any>(token).profile.email ==
                              //     "azizul.haque.nadim.47@gmail.com"
                              // ) {
                              //   setCourseData({
                              //     ...courseData,
                              //     price: 3000,
                              //   });
                              //   toast.success("Discount Applied!");
                              // } else if (
                              //   couponCode == "cvpc-fahim-50" &&
                              //   token &&
                              //   jwtDecode<any>(token).profile.email ==
                              //     "alfahim.ru@gmail.com"
                              // ) {
                              //   setCourseData({
                              //     ...courseData,
                              //     price: 3000,
                              //   });
                              //   toast.success("Discount Applied!");
                              // } else if (
                              //   couponCode == "cvpc-rifat-50" &&
                              //   token &&
                              //   jwtDecode<any>(token).profile.email ==
                              //     "kazirifatalmuin246@gmail.com"
                              // ) {
                              //   setCourseData({
                              //     ...courseData,
                              //     price: 3000,
                              //   });
                              //   toast.success("Discount Applied!");
                              // } else if (
                              //   couponCode == "cvpc-niloy-100" &&
                              //   token &&
                              //   jwtDecode<any>(token).profile.email ==
                              //     "dasniloy2020@gmail.com"
                              // ) {
                              //   purchaseFreeCourse();
                              // } else if (
                              //   couponCode == "cvpc-samee-100" &&
                              //   token &&
                              //   jwtDecode<any>(token).profile.email ==
                              //     "samee.sevas@gmail.com"
                              // ) {
                              //   purchaseFreeCourse();
                              // } else if (
                              //   couponCode == "cvpc-ahmed-100" &&
                              //   token &&
                              //   jwtDecode<any>(token).profile.email ==
                              //     "istiaqueahmedarik@gmail.com"
                              // ) {
                              //   purchaseFreeCourse();
                              // } else if (
                              //   couponCode == "cvpc-tanim-100" &&
                              //   token &&
                              //   jwtDecode<any>(token).profile.email ==
                              //     "tanimahmed710@gmail.com"
                              // ) {
                              //   purchaseFreeCourse();
                              // } else if (
                              //   couponCode == "cvpc-roy-100" &&
                              //   token &&
                              //   jwtDecode<any>(token).profile.email ==
                              //     "anirbanroysourov5@gmail.com"
                              // ) {
                              //   purchaseFreeCourse();
                              // } else if (
                              //   couponCode == "cvpc-hasan-100" &&
                              //   token &&
                              //   jwtDecode<any>(token).profile.email ==
                              //     "mahditalukder123@gmail.com"
                              // ) {
                              //   purchaseFreeCourse();
                              // } else if (
                              //   couponCode == "CP100SPECIAL" &&
                              //   token &&
                              //   jwtDecode<any>(token).login == "01761986057"
                              // ) {
                              //   purchaseFreeCourse();
                              // } else if (
                              //   couponCode == "CPFREE87G5" &&
                              //   token &&
                              //   jwtDecode<any>(token).login == "01712842755"
                              // ) {
                              //   purchaseFreeCourse();
                              // } else if (
                              //   couponCode == "CPFREE87G5" &&
                              //   token &&
                              //   jwtDecode<any>(token).login == "01775120752"
                              // ) {
                              //   purchaseFreeCourse();
                              // } else if (
                              //   couponCode == "cvpc-hasan-100" &&
                              //   token &&
                              //   jwtDecode<any>(token).profile.email ==
                              //     "juubaerjaami@gmail.com"
                              // ) {
                              //   purchaseFreeCourse();
                              // }
                              else if (couponCode == "XCVRTUNT45") {
                                purchaseFreeCourse();
                              } else if (couponCode == "XCVRTUNT") {
                                setCourseData({
                                  ...courseData,
                                  price: 12,
                                });
                                toast.success("Discount Applied!");
                              } else {
                                toast.error("Wrong Coupon Code!");
                              }
                            } else {
                              toast.error("Please login first!");
                            }
                          }}
                          className={`py-2  flex gap-2 items-center  px-6 ${
                            prebookButtonLoading
                              ? "bg-gray-500 cursor-not-allowed"
                              : `bg-[#B153E0] cursor-pointer hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80`
                          }    rounded font-semibold text-white text-lg`}
                          disabled={prebookButtonLoading}
                        >
                          {prebookButtonLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : (
                            ""
                          )}{" "}
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                  {courseData.isTaken ? (
                    lmsPreference === "unlocked" &&
                    courseIdFromRoute &&
                    isLmsPreferenceCourse(courseIdFromRoute) ? (
                      <a
                        href={appendTokenToUrl(getCoursesDashboardUrl(courseIdFromRoute), getAuthToken())}
                        className=" flex justify-center text-darkHeading items-center bg-[#1CAB55] py-3 w-full mt-8 rounded-xl hover:bg-opacity-50 ease-in-out duration-150"
                      >
                        কোর্সে যান
                      </a>
                    ) : (
                      <Link
                        href={
                          courseIdFromRoute === COURSE_ID
                            ? "/course-cp-2"
                            : "/course/"
                        }
                        className=" flex justify-center text-darkHeading items-center bg-[#1CAB55] py-3 w-full mt-8 rounded-xl hover:bg-opacity-50 ease-in-out duration-150"
                      >
                        কোর্সে যান
                      </Link>
                    )
                  ) : (
                    <button
                      onClick={() => {
                        if (isLoggedIn()) {
                          setOpenBuyCourse(true);
                        } else {
                          window.location.href =
                            "https://www.codervai.com/auth/login?redirect=cp.codervai.com";
                        }
                      }}
                      className="bg-[#1CAB55] text-darkHeading py-3 w-full mt-8 rounded-xl hover:bg-opacity-50 ease-in-out duration-150"
                    >
                      কোর্সটি কিনুন
                    </button>
                  )}
                  <div className="flex gap-4">
                    {/* {!courseData.isTaken && (
                      <Link
                        href="/free-preview"
                        className=" block bg-gray-600 text-center hover:opacity-30 ease-in-out duration-150 text-darkHeading py-3 w-full mt-8 rounded-xl font-bold"
                      >
                        Free Preview
                      </Link>
                    )} */}
                    {/* {courseData.isTaken ? (
                      <Link
                        href="/course/12"
                        className=" flex justify-center text-darkHeading items-center bg-purple py-3 w-full mt-8 rounded-xl hover:bg-opacity-50 ease-in-out duration-150"
                      >
                        কোর্স দেখুন
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          if (isLoggedIn()) {
                            setOpenBuyCourse(true);
                          } else {
                            window.location.href =
                              "https://www.codervai.com/auth/login?redirect=cp.codervai.com";
                          }
                        }}
                        className="bg-purple text-darkHeading py-3 w-full mt-8 rounded-xl hover:bg-opacity-50 ease-in-out duration-150"
                      >
                        কোর্সটি কিনুন
                      </button>
                    )} */}

                    {/* for post enrollment comment out this section */}
                    {/* {courseData.isTaken && (
                      <Link
                        href="/course/"
                        className=" flex justify-center text-darkHeading items-center bg-purple py-3 w-full mt-8 rounded-xl hover:bg-opacity-50 ease-in-out duration-150"
                      >
                        কোর্স দেখুন
                      </Link>
                    )} */}
                    {/* for post enrollment comment out this section */}
                  </div>
                </div>
              </div>
              <div className="bg-gray-400/20 dark:bg-gray-300/10    flex items-center justify-between gap-8 py-3 px-4 lg:px-6 rounded-xl rounded-t-none">
                <p className="text-sm text-paragraph dark:text-darkParagraph">
                  কোর্সটি সম্পর্কে বিস্তারিত জানতে মেসেজ করতে পারো
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://wa.me/8801768976036"
                    target="_blank"
                    className="flex items-center bg-gray-400/30 dark:bg-gray-300/10 p-2 rounded-lg gap-3 hover:bg-gray-400/40 dark:hover:bg-gray-300/5 ease-in-out duration-150 text-sm text-paragraph dark:text-darkParagraph"
                  >
                    <div className="">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="16" cy="16" r="14" fill="#25D366" />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M16.0014 7C11.0297 7 7.00391 11.0276 7.00391 16.0016C7.00391 17.6357 7.44249 19.2053 8.25505 20.5611L7.02332 24.7941L11.3655 23.5807C12.6761 24.314 14.3093 24.7031 16.0014 24.7031C20.973 24.7031 25.0014 20.673 25.0014 16.0016C25.0014 11.3276 20.973 7 16.0014 7ZM16.0014 23.1562C14.5008 23.1562 13.0363 22.7538 11.7932 21.9983L11.5174 21.8341L8.8668 22.5689L9.61467 20.0003L9.43244 19.711C8.59373 18.4278 8.1497 17.239 8.1497 16.0016C8.1497 11.8783 11.6957 8.55078 16.0014 8.55078C20.3068 8.55078 23.8528 11.8783 23.8528 16.0016C23.8528 20.1224 20.3068 23.1562 16.0014 23.1562ZM20.5182 17.9473C20.3704 17.873 19.1219 17.2579 18.9865 17.2089C18.8512 17.1596 18.7523 17.1352 18.6534 17.2834C18.5544 17.4318 18.0645 18.0222 17.9779 18.1213C17.8914 18.2204 17.805 18.2325 17.6571 18.1581C17.5093 18.0837 16.6969 17.8121 15.7503 16.9747C15.0103 16.3227 14.519 15.5218 14.4323 15.3734C14.3458 15.2252 14.4231 15.1454 14.4976 15.0732C14.564 15.0084 14.6461 14.9042 14.7204 14.8179C14.7946 14.7316 14.8188 14.6699 14.868 14.5708C14.9172 14.4718 14.8928 14.3855 14.856 14.3112C14.8188 14.2368 14.3289 13.089 14.1804 12.7925C14.0369 12.5069 13.8902 12.5553 13.7979 12.5484C13.7113 12.5424 13.6124 12.5417 13.5134 12.5417C13.4145 12.5417 13.2546 12.5789 13.1193 12.7271C12.9839 12.8755 12.3237 13.493 12.3237 14.6406C12.3237 15.7883 13.1317 16.8869 13.2059 16.9859C13.2801 17.085 14.5142 18.9711 16.3782 19.9722C16.9143 20.2092 17.3337 20.356 17.6598 20.4667C18.1827 20.6491 18.6637 20.6223 19.0436 20.5838C19.4677 20.5405 20.4427 20.0003 20.5911 19.6546C20.7394 19.309 20.7394 19.0124 20.7024 18.9504C20.6653 18.8883 20.5664 18.8513 20.4182 18.777L20.5182 17.9473Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    Whatsapp
                  </a>
                  <a
                    href="https://www.facebook.com/codervaibd/"
                    target="_blank"
                    className="flex items-center bg-gray-400/30 dark:bg-gray-300/10 p-2 rounded-lg gap-3 hover:bg-gray-400/40 dark:hover:bg-gray-300/5 ease-in-out duration-150 text-sm text-paragraph dark:text-darkParagraph"
                  >
                    <div className="">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          fill="url(#paint0_linear_1630_2247)"
                        />
                        <path
                          d="M21.2137 20.2816L21.8356 16.3301H17.9452V13.767C17.9452 12.6857 18.4877 11.6311 20.2302 11.6311H22V8.26699C22 8.26699 20.3945 8 18.8603 8C15.6548 8 13.5617 9.89294 13.5617 13.3184V16.3301H10V20.2816H13.5617V29.8345C14.2767 29.944 15.0082 30 15.7534 30C16.4986 30 17.2302 29.944 17.9452 29.8345V20.2816H21.2137Z"
                          fill="white"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear_1630_2247"
                            x1="16"
                            y1="2"
                            x2="16"
                            y2="29.917"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#18ACFE" />
                            <stop offset="1" stop-color="#0163E0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    Facebook Page
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <WhatsAppWidget
        phoneNumber="8801768976036"
        name="CoderVai Team"
        position="Online | Replies instantly"
        welcomeMessage="আমরা এখানে একটিভ আছি! 👋 আপনাকে কিভাবে সাহায্য করতে পারি?"
        avatar="/wasup.svg"
      />
    </div>
  );
}
