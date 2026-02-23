import { UserContext } from "@/Contexts/UserContext";
import FloatingCompiler from "@/components/FloatingCompiler";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import "animate.css/animate.min.css";
import { AnimationOnScroll } from "react-animation-on-scroll";
import VisibilitySensor from "react-visibility-sensor";
import Tilt from "react-parallax-tilt";
import { Toaster } from "react-hot-toast";
import TimelineItem from "@/components/TimelineItem";
import Typewriter from "typewriter-effect";
import ProblemSolversSection from "@/components/ProblemSolversSection";
import { getTopSuccessStories, SuccessStory } from "@/data/successStories";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import WhatsAppWidget from "@/components/WhatsAppWidget";

import {
  Logo1,
  Logo2,
  Logo3,
  Logo4,
  CompilerButton,
  GradientEllipse1,
  GradientEllipse2,
  VideoPlayIcon,
  TriangleIcon,
  ZeroToHeroIcon,
  GooglersIcon,
  CourseUnlockingIcon,
  VideoContentIcon,
  UserIcon,
  LiveClassIcon,
  CourseIntroIcon,
} from "@/components/Icons";
import AnimatedSuccessStories from "@/components/AnimatedSuccessStories";
import { useLmsPreference } from "@/hooks/useLmsPreference";
import { useHasPurchasedLmsPreferenceCourses } from "@/hooks/useHasPurchasedLmsPreferenceCourses";
import LmsPreferenceModal from "@/components/LmsPreferenceModal";
import { isLoggedIn } from "@/helpers";

const inter = Inter({ subsets: ["latin"] });

const logo1: JSX.Element = <Logo1 />;
const logo2: JSX.Element = <Logo2 />;
const logo3: JSX.Element = <Logo3 />;
const logo4: JSX.Element = <Logo4 />;

const HindSiliguri = localFont({
  src: [
    {
      path: "fonts/Hind_Siliguri/HindSiliguri-Bold.ttf",
      weight: "700",
    },
    {
      path: "fonts/Hind_Siliguri/HindSiliguri-Light.ttf",
      weight: "300",
    },
    {
      path: "fonts/Hind_Siliguri/HindSiliguri-Regular.ttf",
      weight: "400",
    },
    {
      path: "fonts/Hind_Siliguri/HindSiliguri-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "fonts/Hind_Siliguri/HindSiliguri-Medium.ttf",
      weight: "500",
    },
  ],
  variable: "--font-HindSiliguri",
});

export default function Home() {
  const [user, setUser] = useContext<any>(UserContext);
  const [activeBoxIndex, setActiveBoxIndex] = useState(0);
  const [titlX, setTiltX] = useState(0);
  const [titlY, setTiltY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { lmsPreference, loading: lmsLoading, setLmsPreference, error: lmsError } = useLmsPreference();
  const { hasPurchased: hasPurchasedLmsCourses, loading: enrolledLoading } = useHasPurchasedLmsPreferenceCourses();

  //get the top success stories
  const topSuccessStories = getTopSuccessStories(15);

  // Only show LMS preference modal if user is logged in, has no preference yet, and has purchased at least one of the LMS preference courses (18, 15, 1)
  const showLmsModal =
    mounted &&
    isLoggedIn() &&
    lmsPreference === null &&
    !lmsLoading &&
    hasPurchasedLmsCourses &&
    !enrolledLoading;

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    pauseOnHover: true,
    dotsClass: "slick-dots custom-dots",
  };

  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <main className={`${HindSiliguri.variable} font-hind`}>
      <Nav></Nav>
      <LmsPreferenceModal
        isOpen={showLmsModal}
        onClose={() => {}}
        setLmsPreference={setLmsPreference}
        error={lmsError}
      />
      <Toaster />

      <FloatingCompiler />

      <button
        style={{ zIndex: 999 }}
        onClick={() => {
          setUser({ ...user, openCompiler: true });
        }}
        className="fixed top-80 -left-2 bg-[#0B060D] bg-opacity-30  backdrop-blur-lg border border-gray-200/20 p-3 hover:bg-gray-300/20 "
      >
        <CompilerButton />
      </button>

      <div className="bg-[#F3F3F3] dark:bg-black pt-20 overflow-x-hidden">
        <div className="w-[90%] lg:w-[80%] mx-auto py-4 z-20">
          <div className="flex justify-between items-center flex-col-reverse lg:flex-row gap-20 pt-10 lg:pt-0 relative ">
            <GradientEllipse1 />

            <GradientEllipse2 />

            <div
              className="text-heading dark:text-darkHeading flex flex-col gap-4 z-10"
              style={{ width: "400px" }}
            >
              <p className="text-[#B153E0]">কম্পেটিটিভ প্রোগ্রামিং কোর্স</p>
              <div>
                <h2 className="text-2xl lg:text-4xl">
                  <div className="min-w-0 w-full">
                    <h2 className="text-2xl lg:text-4xl relative">
                      <div
                        className="typewriter-container"
                        style={{
                          minWidth: "500px",
                          whiteSpace: "normal",
                          overflowWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
                        <Typewriter
                          options={{
                            strings: [
                              'Competitive Programming <span class="text-[#B153E0]">3.0</span> TurboCharged',
                            ],
                            autoStart: true,
                            loop: true,
                            delay: 75,
                            deleteSpeed: 50,
                            cursor: "|",
                            wrapperClassName: "typewriter-wrapper",
                          }}
                        />
                      </div>
                    </h2>
                  </div>
                </h2>
              </div>

              <p className="">
                প্রতিযোগিতামূলক প্রোগ্রামিং শিখে নাও বিশ্বসেরা দেশসেরা সব
                প্রোগ্রামার দের হাত ধরে
              </p>
              <div className="flex">
                <Link
                  href="/course-details/15"
                  className="flex gap-4 items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md py-3 px-8 rounded-lg border-2 border-[#B153E0]"
                >
                  <VideoPlayIcon />
                  <p className="text-white font-semibold text-base">
                    কোর্স এর বিস্তারিত জেনে নাও
                  </p>
                </Link>
              </div>
            </div>
            <div className="w-full max-w-md mx-auto relative lg:top-10">
              {mounted && <AnimatedSuccessStories stories={topSuccessStories} />}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black z-30 relative">
          <svg
            width="1475"
            height="915"
            viewBox="0 0 1475 915"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 -left-60 lg:left-0"
          >
            <g filter="url(#filter0_f_117_9675)">
              <ellipse
                cx="769"
                cy="208.5"
                rx="269"
                ry="206.5"
                fill="#B153E0"
                fillOpacity="0.5"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_117_9675"
                x="0"
                y="-498"
                width="1538"
                height="1413"
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
                  result="effect1_foregroundBlur_117_9675"
                />
              </filter>
            </defs>
          </svg>

          <AnimationOnScroll animateIn="animate__fadeIn" animateOnce>
            {/* Add the new batch information section */}
            <div className="w-[90%] lg:w-[80%] mx-auto mt-24 text-heading dark:text-darkHeading py-20 z-10">
              <div className="flex gap-8 md:gap-20 justify-center flex-col items-center lg:flex-row text-center">
                {/* <img
                  src="/cpbatchhashtrasnparent.png"
                  alt=""
                  className="max-w-[90px] max-h-[90px] lg:max-w-[100px] lg:max-h-[100px] flex-1"
                /> */}
                <div className="relative">
                  <h2 className="text-2xl lg:text-4xl">
                    {" "}
                    <span className="text-[#B153E0]">ব্যাচ</span> ইনফরমেশন{" "}
                  </h2>
                  <p className="text-paragraph dark:text-darkParagraph mt-2">
                    আমাদের ব্যাচের টাইমলাইন
                  </p>
                  {/* <p>আমাদের কোর্সের সব ফিচার দেখে নাও</p> */}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-10 lg:w-[60%] mx-auto">
                <TimelineItem
                  icon={logo1}
                  date="18 মার্চ 2025"
                  label="প্রিবুকিং শুরু"
                />
                <TimelineItem
                  icon={logo2}
                  date="23 মার্চ ২০২৫"
                  label="প্রিবুকিং শেষ"
                />
                <TimelineItem
                  icon={logo3}
                  date="23 মার্চ 2025 রাত 10 টা থেকে"
                  label="এনরোলমেন্ট শুরু"
                  isHighlighted
                />
                <TimelineItem
                  icon={logo4}
                  date="05 এপ্রিল 2025"
                  label="এনরোলমেন্ট শেষ"
                  isHighlighted
                />
                <TimelineItem
                  icon={logo3}
                  date="10 এপ্রিল 2025"
                  label="ওরিয়েন্টেশন ক্লাস"
                />

                <TimelineItem
                  // put a live class icon with svg
                  icon={<TriangleIcon />}
                  date="এনরোলমেন্ট এর পর থেকে"
                  label="আর্কাইভ ক্লাস দেখতে পারবে"
                />
              </div>
              <p className="mt-8  text-gray-400 text-center">
                তুমি যদি আগ্রহী হয়ে থাকো, আমাদের{" "}
                <span className="text-[#B153E0] font-semibold">
                  ব্যাচ ০৩ এ প্রিবুকিং
                </span>{" "}
                চলছে, এখনি{" "}
                <Link
                  href="/course-details/15"
                  className="text-[#B153E0] font-semibold"
                >
                  রেজিস্টার
                </Link>{" "}
                করে ফেলো!
              </p>
            </div>
          </AnimationOnScroll>

          {/* //put some space here */}

          {/* <div className="h-20"></div> */}

          <AnimationOnScroll animateIn="animate__fadeIn" animateOnce>
            <div className="w-[90%] lg:w-[80%] mx-auto mt-24 text-heading dark:text-darkHeading py-20 z-10">
              {/* Original এক নজরে আমাদের section */}
              <div className="flex gap-8 md:gap-20 justify-center flex-col items-center lg:flex-row text-center">
                <img
                  src="/eye icon.png"
                  alt=""
                  className="max-w-[90px] max-h-[90px] lg:max-w-[100px] lg:max-h-[100px] flex-1"
                />
                <div className="relative">
                  <h2 className="text-2xl lg:text-4xl">এক নজরে আমাদের</h2>
                  <h2 className="text-2xl lg:text-4xl">
                    <span className="text-[#B153E0]">
                      কম্পেটিটিভ প্রোগ্রামিং
                    </span>{" "}
                    কোর্স
                  </h2>
                  {/* <p>আমাদের কোর্সের সব ফিচার দেখে নাও</p> */}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lgXl:grid-cols-4  mt-24 ">
                <div className="md:border-r border-b border-gray-100/10 px-20  py-12 pt-16 ">
                  <div className="flex flex-col items-center text-center  hover:scale-110 transition-all ease-in-out duration-300">
                    <ZeroToHeroIcon darkMode={user.darkMode} />
                    <p className="text-xl mt-6">জিরো থেকে হিরো</p>
                    <p className="text-sm mt-8 text-paragraph dark:text-darkParagraph">
                      শূন্য থেকে প্রোগ্রামিং শিখিয়ে তোমাকে এক্সপার্ট করে তোলা
                      হবে এখানে
                    </p>
                  </div>
                </div>
                <div className=" lgXl:border-r border-b border-gray-100/10">
                  <div className="flex flex-col items-center  px-20 text-center py-12 pt-16  hover:scale-110 transition-all ease-in-out duration-300">
                    <GooglersIcon darkMode={user.darkMode} />
                    <p className="text-xl mt-6">
                      Googler সহ বিশ্বসেরা কোডাররা ক্লাস
                    </p>
                    <p className="text-sm mt-8 text-paragraph dark:text-darkParagraph">
                      কম্পেটিটিভ প্রোগ্রামিং করে গুগলে চাকরিরত সহ র‍্যাংকিং এ
                      দেশের টপ কোডার রা ক্লাস নিবে এখানে
                    </p>
                  </div>
                </div>
                <div className=" md:border-r border-b border-gray-100/10">
                  <div className="flex flex-col items-center  px-20 text-center py-12 pt-16 hover:scale-110 transition-all ease-in-out duration-300">
                    <CourseUnlockingIcon darkMode={user.darkMode} />
                    <p className="text-xl mt-6">কোর্স আনলকিং</p>
                    <p className="text-sm mt-8 text-paragraph dark:text-darkParagraph">
                      নির্দিস্ট সময় পর পর কোর্স কন্টেন্ট গুলো আনলক হবে যেন
                      প্রব্লেম সলভিং এর একটা অভ্যাস তৈরি হয়
                    </p>
                  </div>
                </div>
                <div className=" border-b border-gray-100/10">
                  <div className="flex flex-col items-center  px-20 text-center py-12 pt-16 hover:scale-110 transition-all ease-in-out duration-300">
                    <VideoContentIcon darkMode={user.darkMode} />
                    <p className="text-xl mt-6">৫০+ ঘণ্টার ভিডিও কন্টেন্ট</p>
                    <p className="text-sm mt-8 text-paragraph dark:text-darkParagraph">
                      আন্তর্জাতিক মান সম্মত স্টুডিও কোয়ালিটি ভিডিও থাকবে এখানে
                    </p>
                  </div>
                </div>
                <div className=" md:border-r border-b lgXl:border-b-0 border-gray-100/10">
                  <div className="flex flex-col items-center hover:scale-110 transition-all ease-in-out duration-300   px-20 text-center py-12 pb-16">
                    <UserIcon darkMode={user.darkMode} />
                    <p className="text-xl mt-6">৩০+ এক্সপার্ট ক্লাস আর্কাইভ</p>
                    <p className="text-sm mt-8 text-paragraph dark:text-darkParagraph">
                      বিগত বছরের সেইম টিচার প্যানেলের নেয়া লাইভ ক্লাস গুলোর একটা
                      আর্কাইভ দেয়া হবে
                    </p>
                  </div>
                </div>
                <div className="border-b lgXl:border-b-0  lgXl:border-r  border-gray-100/10">
                  <div className="flex flex-col items-center hover:scale-110 transition-all ease-in-out duration-300  px-20 text-center py-12 pb-16">
                    <CourseUnlockingIcon darkMode={user.darkMode} />
                    <p className="text-xl mt-6">
                      ৩০০+ কোডিং সমস্যা ও তার ভিডিও সলিউশন
                    </p>
                    <p className="text-sm mt-8 text-paragraph dark:text-darkParagraph">
                      আমাদের নিজেদের বানানো কাস্টম কোডিং প্রব্লেম ও তার ভিডিও
                      সলিউশন সহ ৩০০+ সমস্যা সমাধান করা হবে এখানে
                    </p>
                  </div>
                </div>
                <div className="hover:scale-110 transition-all ease-in-out duration-300">
                  <div className="flex flex-col items-center hover:scale-110 transition-all ease-in-out duration-300 px-20 text-center py-12 pb-16">
                    <LiveClassIcon darkMode={user.darkMode} />
                    <p className="text-xl mt-6"> লাইভ ক্লাস</p>
                    <p className="text-sm mt-8 text-paragraph dark:text-darkParagraph">
                      কোর্স চলাকালীন রেকর্ড ক্লাসের পাশাপাশি প্রচুর লাইভ ক্লাস
                      সাপোর্ট থাকবে এখানে
                    </p>
                  </div>
                </div>
                <div className="md:border-l border-gray-100/10">
                  <div className="flex flex-col items-center hover:scale-110 transition-all ease-in-out duration-300    px-20 text-center py-12 pb-16">
                    <ZeroToHeroIcon darkMode={user.darkMode} />
                    <p className="text-xl mt-6">কোর্স র‍্যাংকিং</p>
                    <p className="text-sm mt-8 text-paragraph dark:text-darkParagraph">
                      কোর্সে ভর্তি হওয়া তোমার সহপাঠীদের সাথে তোমার অবস্থান তুলনা
                      করার জন্যে থাকবে র‍্যাংকিং
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimationOnScroll>
        </div>

        <div className="bg-[#ca65fd]/20 dark:bg-[#0B060D] z-30 relative">
          <AnimationOnScroll animateIn="animate__fadeIn" animateOnce>
            <div className="w-[90%] lg:w-[80%] mx-auto  text-heading dark:text-darkHeading pt-40 py-20 md:py-32">
              <div
                className="rounded-xl "
                style={{
                  background: "linear-gradient( #CA65FD70 0%, #B153E000 100%)",
                }}
              >
                <div
                  className=" rounded-xl px-16 py-20 pb-20 mx-[1px] dark:bg-[#050207]/60 relative top-[1px] "
                  style={{}}
                >
                  <div className="flex justify-between gap-16 flex-col lg:flex-row items-center">
                    <div className="flex-1">
                      <Tilt>
                        {user.darkMode ? (
                          <img src="/mid_section_code.png" alt="" />
                        ) : (
                          <img src="/mid_section_code.png" alt="" />
                        )}
                      </Tilt>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl lg:text-4xl ">
                        কম্পেটিটিভ প্রোগ্রামিং <br /> এর{" "}
                        <span className="text-[#B153E0]">পরিচিতি</span>
                      </h2>
                      <p className="my-6 text-xl">
                        প্রোগ্রামার দের অলিম্পিকস হল ACM:ICPC যেখানে প্রতি বছর
                        বিশ্বের সবচেয়ে বেস্ট বেস্ট প্রোগ্রামাররা নিজেদের সাথে
                        প্রতিযোগিতা করে
                      </p>
                      <p className="text-paragraph dark:text-darkParagraph">
                        বাংলাদেশ থেকে খুব কম সংখ্যক শিক্ষার্থী প্রতি বছর ই
                        কম্পেটিটিভ প্রোগ্রামিং বা CP এর অলম্পিকশ্ ACM ICPC এর
                        World Finale তে অংশগ্রহণ করে World Finalist থেকে শুরু
                        করে ASIA CHAPMION ও হচ্ছে। যার মধ্যে আমাদের ২ জন
                        ইন্সট্রাক্টর ও রয়েছে। কম্পেটিটিভ প্রোগ্রামিং এর জনপ্রিয়
                        ওয়েব সাইট গুলার র‍্যাংকিং এ বাংলাদেশের শিক্ষার্থীদের
                        অবস্থান অনেক পেছনে হলেও বাংলাদেশের আনাচে কানাচে কিছু
                        এক্সট্রা অর্ডিনারি মানুষজন প্রোগ্রামিং এর এই অজানা জগতের
                        অজানা রহস্য গুলার পেছনে ছুটতে থাকে পরিশ্রম করতে থাকে আর
                        ঠিকই নিজের স্বপ্ন কে পূরণ করে দেশকে গর্বিত করে
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimationOnScroll>
        </div>
        <div className="bg-[#ca65fd]/20 dark:bg-[#0B060D] z-30 relative">
          <AnimationOnScroll animateIn="animate__fadeIn" animateOnce>
            <div className="w-[90%] lg:w-[80%] mx-auto  text-heading dark:text-darkHeading py-20 md:py-32">
              <div className="flex flex-col lg:flex-row text-center lg:text-left justify-between items-center  pb-10 gap-6 lg:gap-0 border-b border-gray-100/20">
                <div className="flex-1">
                  <div className="flex justify-center lg:justify-start">
                    <img src="/code_rectangle.png" alt="" />
                  </div>

                  <h2 className="text-2xl lg:text-4xl mt-6">
                    কম্পেটিটিভ প্রোগ্রামিং{" "}
                    <span className="text-[#B153E0] block">কেন করব ?</span>{" "}
                  </h2>
                </div>
                <div className="flex-1 hidden lg:block"></div>
                <div className="flex-1">
                  <p>
                    খেলাধুলা এর জগতে অলিম্পিকস এর নাম শুনে নাই এমন কাউ কে খুঁজে
                    পাওয়া না গেলেও এমন অনেক কেই খুঁজে পাওয়া যাবে যারা
                    প্রোগ্রামিং এর জগত এর অলিম্পিকস খ্যাত ACM:ICPC সম্পর্কে
                    জানেই না।
                  </p>
                </div>
              </div>
              <div className="flex gap-20  justify-between flex-col items-center lg:items-start lg:flex-row pt-20">
                <div
                  className="rounded-xl max-w-[400px] text-center hover:scale-110 transition-all ease-in-out duration-300"
                  style={{
                    background:
                      "linear-gradient(rgba(202, 101, 253, 0.44) 0%, rgba(177, 83, 224, 0) 100%)",
                  }}
                >
                  <div
                    className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/80 relative top-[1px]"
                    style={{}}
                  >
                    <div className="">
                      <p className="text-heading dark:text-darkHeading text-center text-xl">
                        গ্রাজুয়েশনের আগেই{" "}
                        <span className="text-[#B153E0]">FAANG</span> থেকে অফার
                      </p>
                      <p className="text-paragraph dark:text-darkParagraph mt-8">
                        CP তে সেরাদের FACEBOOK, AMAZON, APPLE, NETFLIX, GOOGLE
                        যাদের আমরা FAANG হিসাবে চিনে থাকি তারা অফারলেটার দেয়
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="rounded-xl max-w-[400px] text-center  hover:scale-110 transition-all ease-in-out duration-300"
                  style={{
                    background:
                      "linear-gradient(rgba(202, 101, 253, 0.44) 0%, rgba(177, 83, 224, 0) 100%)",
                  }}
                >
                  <div
                    className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/80 relative top-[1px]"
                    style={{}}
                  >
                    <div className="">
                      <p className="text-heading dark:text-darkHeading text-center text-xl">
                        সমস্যা সমাধান এর দক্ষতা বাড়ায়
                      </p>
                      <p className="text-paragraph dark:text-darkParagraph mt-8">
                        CP সমস্যা সমাধানের লজিক শেখায়, স্টেপ বাই স্টেপ যেকোন
                        সমস্যা কে এপ্রোচ করা শেখায়। ব্রেইন কে ক্রিটিকাল থিংকিং
                        করতে ট্রেইন করে।একটা সমস্যা কে ভিন্ন ভিন্ন এঙ্গেল থেকে
                        দেখতে শেখায়,এক্সট্রিম প্রেশার এর আন্ডারে কাজ করতে শেখায়
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="rounded-xl max-w-[400px] text-center  hover:scale-110 transition-all ease-in-out duration-300"
                  style={{
                    background:
                      "linear-gradient(rgba(202, 101, 253, 0.44) 0%, rgba(177, 83, 224, 0) 100%)",
                  }}
                >
                  <div
                    className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/80 relative top-[1px]"
                    style={{}}
                  >
                    <div className="">
                      <p className="text-heading dark:text-darkHeading text-center text-xl">
                        ক্যারিয়ার গঠনে মুখ্য ভূমিকা
                      </p>
                      <p className="text-paragraph dark:text-darkParagraph mt-8">
                        CP তোমাকে শক্তপোক্ত একটা রেজুমে গড়তে সাহায্য করে যা
                        ভবিষ্যতের ড্রিম কোম্পানি ডাক পেতে এগিয়ে রাখবে লাখো
                        ক্যান্ডিডেট থেকে যারা CP করে নাই
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimationOnScroll>
        </div>

        <div className="bg-[#ca65fd]/20 dark:bg-[#08060D] z-30 relative">
          <AnimationOnScroll animateIn="animate__fadeIn" animateOnce>
            <div className="w-[90%] lg:w-[80%] mx-auto  text-heading dark:text-darkHeading py-20 md:py-32">
              <div
                className="rounded-xl text-center"
                style={{
                  background: "linear-gradient( #CA65FD70 0%, #B153E000 100%)",
                }}
              >
                <div
                  className=" rounded-xl px-6 py-20 pb-20 mx-[1px] dark:bg-[#050207]/60 relative top-[1px] "
                  style={{}}
                >
                  <div className="w-[90%] lg:w-[60%] mx-auto">
                    <div className="flex justify-center">
                      <img src="/verified_sign.png" alt="" />
                    </div>
                    <h2 className="text-2xl lg:text-4xl mt-8">
                      আমাদের উদ্যেশ্য কি
                    </h2>
                    <p className="text-xl mt-8">
                      আমরা চাই FAANG এর মত বিগ টেক কোম্পানি গুলাতে তুমি যেন
                      বাংলাদেশ এর প্রতিনিধিত্ব করতে পার সাথে ভবিষ্যতে যারা ওখানে
                      যাওয়ার স্বপ্ন দেখে তাদের পথ প্রদর্শক হতে পার
                    </p>
                    <p className="my-12">
                      সেই লক্ষে পৌঁছাতে তোমাকে এই অজানা জগতের সাথে পরিচয় করয়ে
                      দেবে পরিচিত সব ওয়েবসাইটের বাংলাদেশের প্রতিনিধিত্ব কারী আর
                      GOOGLE থেকে অফার পেয়ে সেখানে চাকুরীরত বেস্ট সব
                      ইনস্ট্রাক্টররা যারা সবাই বুয়েট CSE পরিবারের সদস্য। বাংলা
                      ভাষায় শিখিয়ে দিবে কিভাবে নিজেকে অন্য সবার থেকে আলাদা করা
                      যায়,কিভাবে নিজেকে এই কঠিন কিন্তু এমেজিং জগতে টিকিয়ে রাখা
                      যায়, কিভাবে নিজেকে মোটিভেটেড রাখা যায়, কিভাবে CODEFORCES,
                      HACKERRANK, CODECHEF, ATCODER, LeetCode, HackerEarth, CSES
                      এই প্ল্যাটফর্ম গুলাতে রেটিং/র‍্যাঙ্কিং বাড়ানো যায়
                    </p>
                    <div className="flex justify-center ">
                      <Link
                        href="/course-details/12"
                        className="flex gap-3 items-center bg-gray-300/10 hover:bg-gray-300/20 duration-150 ease-in-out backdrop-blur-lg py-2 px-8 rounded-lg"
                      >
                        <CourseIntroIcon />
                        <p>কোর্স ইন্ট্রো ভিডিও দেখো</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimationOnScroll>
        </div>

        <div className="bg-[#ca65fd]/20 dark:bg-[#0B060D] z-30 relative">
          <div className="w-[90%] lg:w-[80%] mx-auto  text-heading dark:text-darkHeading py-20 md:py-32">
            <div className="flex flex-col  items-center pb-10 border-b border-black/30 dark:border-gray-300/10">
              <img src="/glowing_bulb.png" alt="" />

              <p className="text-2xl lg:text-4xl mt-4 mb-2">
                কোর্সটি <span className="text-[#B153E0]">কীভাবে কাজ করবে</span>
              </p>
              <p className="text-paragraph dark:text-darkParagraph ">
                আমরা যেভাবে তোমাদের পাশে থাকব
              </p>
            </div>
            <div className="grid grid-cols-1 lgMd:grid-cols-2 mt-20 lg:mt-32 gap-x-20 gap-y-12  justify-items-center">
              <VisibilitySensor
                onChange={(isVisible: any) => {
                  if (isVisible) {
                    setActiveBoxIndex(1);
                  }
                }}
              >
                <div
                  className={`rounded-xl  text-center lg:justify-self-start ${activeBoxIndex == 1 ? "opacity-100" : "opacity-40"
                    } transition-all duration-300  ease-in-out`}
                  style={{
                    background:
                      activeBoxIndex == 1
                        ? "linear-gradient(274deg, rgba(202, 101, 253, 0.13) 0%, rgba(177, 83, 224, 0.00) 100%)"
                        : "linear-gradient(274deg, rgba(255, 255, 255, 0.12) 0%, rgba(177, 83, 224, 0.00) 100%)",
                  }}
                >
                  <div
                    className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/30 relative top-[1px] "
                    style={{}}
                  >
                    <svg
                      width="480"
                      height="198"
                      viewBox="0 0 503 198"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute left-[100%] top-40 hidden lgMd:block "
                    >
                      <g filter="url(#filter0_d_794_44)">
                        <path
                          d="M5 1C6.49762 5.38757 23.9935 10.0201 29.294 12.1493C46.8075 19.1846 64.4083 23.6157 83.8561 27.8362C121.083 35.9149 159.881 39.5441 198.556 43.2637C283.567 51.4398 392.711 49.3583 458.323 92.0744C500.039 119.233 497.983 150.766 497.983 189"
                          stroke={
                            activeBoxIndex == 1 || activeBoxIndex == 2
                              ? "#B153E0"
                              : "#808080"
                          }
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="12 12"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_d_794_44"
                          x="-0.000244141"
                          y="-0.000244141"
                          width="502.993"
                          height="198"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="4" />
                          <feGaussianBlur stdDeviation="2" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_794_44"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_794_44"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>

                    <div className="flex flex-col items-center">
                      <div
                        className={`px-2 py-2 rounded-full ${activeBoxIndex === 1
                            ? "bg-[#B153E0]/[.14]"
                            : "bg-gray-300/20"
                          }  `}
                      >
                        <p
                          className={`px-4 py-1 rounded-full  font-bold text-xl  ${activeBoxIndex === 1
                              ? "bg-[#B153E0]/[.32]"
                              : "bg-gray-300/40"
                            }`}
                        >
                          1
                        </p>
                      </div>
                      <p className="my-6 text-2xl">
                        সেরাদের ও সেরা ইন্সট্রাক্টর প্যানেল
                      </p>
                      <p className="text-paragraph dark:text-darkParagraph">
                        গুগলার থেকে শুরু করে বাংলাদেশের সবচেয়ে সেরা টিচার
                        প্যানেল যারা সবাই বুয়েট সি এস ই এর শিক্ষার্থী ছিল তোমাকে
                        দিবে সেরা কন্টেন্ট ও সেরা সাপোর্ট যা আর কোথাও নেই
                      </p>
                    </div>
                  </div>
                </div>
              </VisibilitySensor>
              <div className="hidden lg:block"></div>
              <div className="hidden lg:block"></div>
              <VisibilitySensor
                onChange={(isVisible: any) => {
                  if (isVisible) {
                    setActiveBoxIndex(2);
                  }
                }}
              >
                <div
                  className={`rounded-xl  text-center lg:justify-self-end ${activeBoxIndex == 2 ? "opacity-100" : "opacity-40"
                    } transition-all duration-300  ease-in-out`}
                  style={{
                    background:
                      activeBoxIndex == 2
                        ? "linear-gradient(rgba(202, 101, 253, 0.44) 0%, rgba(177, 83, 224, 0) 100%)"
                        : "linear-gradient(rgba(255, 255, 255, 0.12) 0%, rgba(177, 83, 224, 0.00) 100%)",
                  }}
                >
                  <div
                    className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/80 relative top-[1px] "
                    style={{}}
                  >
                    <svg
                      width="495"
                      height="200"
                      viewBox="0 0 495 200"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute top-[90%] -left-[88px] hidden lgMd:block"
                    >
                      <path
                        d="M494 1C494 16.1996 483.818 31.8545 478.773 46.5437C471.112 68.8527 454.029 88.223 433.094 106.004C389.353 143.153 285.069 127.428 218.855 134.91C48.9868 154.104 74.1208 161.948 1 199"
                        stroke={
                          activeBoxIndex == 2 || activeBoxIndex == 3
                            ? "#B153E0"
                            : "#808080"
                        }
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="12 12"
                      />
                    </svg>

                    <div className="flex flex-col items-center">
                      <div
                        className={`px-2 py-2 rounded-full ${activeBoxIndex === 2
                            ? "bg-[#B153E0]/[.14]"
                            : "bg-gray-300/20"
                          }  `}
                      >
                        <p
                          className={`px-4 py-1 rounded-full  font-bold text-xl  ${activeBoxIndex === 2
                              ? "bg-[#B153E0]/[.32]"
                              : "bg-gray-300/40"
                            }`}
                        >
                          2
                        </p>
                      </div>
                      <p className="my-6 text-2xl">
                        জিরো থেকে হিরো হওয়ার কমপ্লিট গাইডলাইন
                      </p>
                      <p className="text-paragraph dark:text-darkParagraph">
                        তোমাকে একদম জিরো থেকে হিরো বানানোর জন্যে প্রথমত সি++ এর
                        বেসিক থেকে শুরু করে ডেটা স্ট্রাকচার ও ফাইনালি কম্পেটিটিভ
                        প্রোগ্রামিং এর জটিল টপিকগুলো একদম ধরে ধরে শিখিয়ে দেয়া
                        হবে
                      </p>
                    </div>
                  </div>
                </div>
              </VisibilitySensor>
              <div className="hidden lg:block"></div>
              <div className="hidden lg:block"></div>
              <VisibilitySensor
                onChange={(isVisible: any) => {
                  if (isVisible) {
                    setActiveBoxIndex(3);
                  }
                }}
              >
                <div
                  className={`rounded-xl  text-center lg:justify-self-start ${activeBoxIndex == 3 ? "opacity-100" : "opacity-40"
                    } transition-all duration-300  ease-in-out`}
                  style={{
                    background:
                      activeBoxIndex == 3
                        ? "linear-gradient(274deg, rgba(202, 101, 253, 0.13) 0%, rgba(177, 83, 224, 0.00) 100%)"
                        : "linear-gradient(274deg, rgba(255, 255, 255, 0.12) 0%, rgba(177, 83, 224, 0.00) 100%)",
                  }}
                >
                  <div
                    className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/30 relative top-[1px]"
                    style={{}}
                  >
                    <svg
                      width="495"
                      height="206"
                      viewBox="0 0 495 206"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute top-[100%] -right-[88px]  hidden lgMd:block"
                    >
                      <path
                        d="M1 1C9.15724 26.195 18.3459 49.6077 32.7232 68.7302C45.9632 86.34 64.0264 98.1142 79.7546 110.151C95.4355 122.151 110.859 132.697 127.985 139.429C159.676 151.885 191.361 162.919 223.984 168.571C261.6 175.089 298.471 175.857 336.306 175.857C378.639 175.857 419.692 181.984 461.539 190.429C469.159 191.966 475.721 192.841 482.38 198.254C485.98 201.18 489.843 205 494 205"
                        stroke={
                          activeBoxIndex == 3 || activeBoxIndex == 4
                            ? "#B153E0"
                            : "#808080"
                        }
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="12 12"
                      />
                    </svg>

                    <div className="flex flex-col items-center">
                      <div
                        className={`px-2 py-2 rounded-full ${activeBoxIndex === 3
                            ? "bg-[#B153E0]/[.14]"
                            : "bg-gray-300/20"
                          }  `}
                      >
                        <p
                          className={`px-4 py-1 rounded-full  font-bold text-xl  ${activeBoxIndex === 3
                              ? "bg-[#B153E0]/[.32]"
                              : "bg-gray-300/40"
                            }`}
                        >
                          3
                        </p>
                      </div>
                      <p className="my-6 text-2xl">
                        আন্তর্জাতিক মান সম্পন্ন কোর্স কন্টেন্ট আনলকিং
                      </p>
                      <p className="text-paragraph dark:text-darkParagraph">
                        একটি নির্দিষ্ট সময় পর পর তোমাদের কোর্স কন্টেন্ট গুলো
                        আনলক করা হবে যেন তোমার শেখার পথে তোমাকে আমরা তোমাকে
                        রুটিন করে তোমাকে অভ্যস্থ করিয়ে ফেলতে পারি যেন শেখা টা
                        তোমার একটা অভ্যাসে পরিণত হয়ে যায়
                      </p>
                    </div>
                  </div>
                </div>
              </VisibilitySensor>
              <div className="hidden lg:block"></div>
              <div className="hidden lg:block"></div>
              <VisibilitySensor
                onChange={(isVisible: any) => {
                  if (isVisible) {
                    setActiveBoxIndex(4);
                  }
                }}
              >
                <div
                  className={`rounded-xl  text-center lg:justify-self-end ${activeBoxIndex == 4 ? "opacity-100" : "opacity-40"
                    } transition-all duration-300  ease-in-out`}
                  style={{
                    background:
                      activeBoxIndex == 4
                        ? "linear-gradient(120deg, rgba(202, 101, 253, 0.13) 0%, rgba(177, 83, 224, 0.00) 100%)"
                        : "linear-gradient(120deg, rgba(255, 255, 255, 0.12) 0%, rgba(177, 83, 224, 0.00) 100%)",
                  }}
                >
                  <div
                    className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/30 relative top-[1px]"
                    style={{}}
                  >
                    {" "}
                    <svg
                      width="495"
                      height="200"
                      viewBox="0 0 495 200"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute top-[100%] -left-[88px] hidden lgMd:block"
                    >
                      <path
                        d="M494 1C494 16.1996 483.818 31.8545 478.773 46.5437C471.112 68.8527 454.029 88.223 433.094 106.004C389.353 143.153 285.069 127.428 218.855 134.91C48.9868 154.104 74.1208 161.948 1 199"
                        stroke={
                          activeBoxIndex == 4 || activeBoxIndex == 5
                            ? "#B153E0"
                            : "#808080"
                        }
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="12 12"
                      />
                    </svg>
                    <div className="flex flex-col items-center">
                      <div
                        className={`px-2 py-2 rounded-full ${activeBoxIndex === 4
                            ? "bg-[#B153E0]/[.14]"
                            : "bg-gray-300/20"
                          }  `}
                      >
                        <p
                          className={`px-4 py-1 rounded-full  font-bold text-xl  ${activeBoxIndex === 4
                              ? "bg-[#B153E0]/[.32]"
                              : "bg-gray-300/40"
                            }`}
                        >
                          4
                        </p>
                      </div>
                      <p className="my-6 text-2xl">
                        পরীক্ষার মাধ্যমে নিজেকে যাচাই করার সুযোগ
                      </p>
                      <p className="text-paragraph dark:text-darkParagraph">
                        প্রতিটি মডিউল এর ভিডিও গুলোর পর তোমাকে নিজেকে যাচাই করার
                        জন্যে থাকবে প্রচুর টপিক ভিত্তিক কুইজ আর তার সম্পুর্ন
                        সমাধান ব্যাখ্যা যেন ভুল হলেও কেন ভুল হয়েছে তার কারণটি
                        বুঝে নিজেকে শুধরে নিতে পার
                      </p>
                    </div>
                  </div>
                </div>
              </VisibilitySensor>
              <div className="hidden lg:block"></div>
              <div className="hidden lg:block"></div>
              <VisibilitySensor
                onChange={(isVisible: any) => {
                  if (isVisible) {
                    setActiveBoxIndex(5);
                  }
                }}
              >
                <div
                  className={`rounded-xl  text-center lg:justify-self-start ${activeBoxIndex == 5 ? "opacity-100" : "opacity-40"
                    } transition-all duration-300  ease-in-out`}
                  style={{
                    background:
                      activeBoxIndex == 5
                        ? "linear-gradient(274deg, rgba(202, 101, 253, 0.13) 0%, rgba(177, 83, 224, 0.00) 100%)"
                        : "linear-gradient(274deg, rgba(255, 255, 255, 0.12) 0%, rgba(177, 83, 224, 0.00) 100%)",
                  }}
                >
                  <div
                    className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/30 relative top-[1px]"
                    style={{}}
                  >
                    {" "}
                    <svg
                      width="495"
                      height="206"
                      viewBox="0 0 495 206"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute top-[100%] -right-[88px] hidden lgMd:block"
                    >
                      <path
                        d="M1 1C9.15724 26.195 18.3459 49.6077 32.7232 68.7302C45.9632 86.34 64.0264 98.1142 79.7546 110.151C95.4355 122.151 110.859 132.697 127.985 139.429C159.676 151.885 191.361 162.919 223.984 168.571C261.6 175.089 298.471 175.857 336.306 175.857C378.639 175.857 419.692 181.984 461.539 190.429C469.159 191.966 475.721 192.841 482.38 198.254C485.98 201.18 489.843 205 494 205"
                        stroke={
                          activeBoxIndex == 5 || activeBoxIndex == 6
                            ? "#B153E0"
                            : "#808080"
                        }
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="12 12"
                      />
                    </svg>
                    <div className="flex flex-col items-center">
                      <div
                        className={`px-2 py-2 rounded-full ${activeBoxIndex === 5
                            ? "bg-[#B153E0]/[.14]"
                            : "bg-gray-300/20"
                          }  `}
                      >
                        <p
                          className={`px-4 py-1 rounded-full  font-bold text-xl  ${activeBoxIndex === 5
                              ? "bg-[#B153E0]/[.32]"
                              : "bg-gray-300/40"
                            }`}
                        >
                          5
                        </p>
                      </div>
                      <p className="my-6 text-2xl">
                        কোর্স চলাকালীন রেগুলার লাইভ ক্লাস
                      </p>
                      <p className="text-paragraph dark:text-darkParagraph">
                        এক্সট্রিম স্টুডেন্ট সাপোর্ট যেখানে রেগুলার তোমাদের জন্যে
                        কোর্স এর টিচার প্যানেল সরাসরি ২ ঘণ্টা লাইভ জুম কল এ বসে
                        তোমাদের সমস্যা সমাধান করবে যেন কোন ভাবেই তুমি আটিকিয়ে না
                        যাও বা তোমার শেখার গতি বাধাপ্রাপ্ত না হয়
                      </p>
                    </div>
                  </div>
                </div>
              </VisibilitySensor>
              <div className="hidden lg:block"></div>
              <div className="hidden lg:block"></div>
              <VisibilitySensor
                onChange={(isVisible: any) => {
                  if (isVisible) {
                    setActiveBoxIndex(6);
                  }
                }}
              >
                <div
                  className={`rounded-xl  text-center lg:justify-self-end ${activeBoxIndex == 6 ? "opacity-100" : "opacity-40"
                    } transition-all duration-300  ease-in-out`}
                  style={{
                    background:
                      activeBoxIndex == 6
                        ? "linear-gradient(124deg, rgba(202, 101, 253, 0.13) 0%, rgba(177, 83, 224, 0.00) 100%)"
                        : "linear-gradient(124deg, rgba(255, 255, 255, 0.12) 0%, rgba(177, 83, 224, 0.00) 100%)",
                  }}
                >
                  <div
                    className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/30 relative top-[1px]"
                    style={{}}
                  >
                    <svg
                      width="495"
                      height="200"
                      viewBox="0 0 495 200"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute top-[100%] -left-[88px] hidden lgMd:block"
                    >
                      <path
                        d="M494 1C494 16.1996 483.818 31.8545 478.773 46.5437C471.112 68.8527 454.029 88.223 433.094 106.004C389.353 143.153 285.069 127.428 218.855 134.91C48.9868 154.104 74.1208 161.948 1 199"
                        stroke={
                          activeBoxIndex == 6 || activeBoxIndex == 7
                            ? "#B153E0"
                            : "#808080"
                        }
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="12 12"
                      />
                    </svg>
                    <div className="flex flex-col items-center">
                      <div
                        className={`px-2 py-2 rounded-full ${activeBoxIndex === 6
                            ? "bg-[#B153E0]/[.14]"
                            : "bg-gray-300/20"
                          }  `}
                      >
                        <p
                          className={`px-4 py-1 rounded-full  font-bold text-xl  ${activeBoxIndex === 6
                              ? "bg-[#B153E0]/[.32]"
                              : "bg-gray-300/40"
                            }`}
                        >
                          6
                        </p>
                      </div>
                      <p className="my-6 text-2xl">অল ইন ওয়ান সাপোর্ট</p>
                      <p className="text-paragraph dark:text-darkParagraph">
                        এক ওয়েবসাইট থেকেই কোড লিখা,কোড প্রাকটিস করা, কোড রান করা
                        সহ সাবমিট করে সাবমিট হিস্ট্রি থেকে শুরু করে সব ভার্ডিক্ট
                        পেয়ে যাবে সো আলাদা করে অন্য ওয়েবসাইটে যাওয়ার প্রয়োজন
                        থাকবে না
                      </p>
                    </div>
                  </div>
                </div>
              </VisibilitySensor>
              <div className="hidden lg:block"></div>
              <div className="hidden lg:block"></div>
              <VisibilitySensor
                onChange={(isVisible: any) => {
                  if (isVisible) {
                    setActiveBoxIndex(7);
                  }
                }}
              >
                <div
                  className={`rounded-xl  text-center lg:justify-self-start ${activeBoxIndex == 7 ? "opacity-100" : "opacity-40"
                    } transition-all duration-300  ease-in-out`}
                  style={{
                    background:
                      activeBoxIndex == 7
                        ? "linear-gradient(274deg, rgba(202, 101, 253, 0.13) 0%, rgba(177, 83, 224, 0.00) 100%)"
                        : "linear-gradient(274deg, rgba(255, 255, 255, 0.12) 0%, rgba(177, 83, 224, 0.00) 100%)",
                  }}
                >
                  <div
                    className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/30 relative top-[1px]"
                    style={{}}
                  >
                    {" "}
                    <svg
                      width="495"
                      height="206"
                      viewBox="0 0 495 206"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute top-[100%] -right-[88px] hidden lgMd:block"
                    >
                      <path
                        d="M1 1C9.15724 26.195 18.3459 49.6077 32.7232 68.7302C45.9632 86.34 64.0264 98.1142 79.7546 110.151C95.4355 122.151 110.859 132.697 127.985 139.429C159.676 151.885 191.361 162.919 223.984 168.571C261.6 175.089 298.471 175.857 336.306 175.857C378.639 175.857 419.692 181.984 461.539 190.429C469.159 191.966 475.721 192.841 482.38 198.254C485.98 201.18 489.843 205 494 205"
                        stroke={
                          activeBoxIndex == 7 || activeBoxIndex == 8
                            ? "#B153E0"
                            : "#808080"
                        }
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="12 12"
                      />
                    </svg>
                    <div className="flex flex-col items-center">
                      <div
                        className={`px-2 py-2 rounded-full ${activeBoxIndex === 7
                            ? "bg-[#B153E0]/[.14]"
                            : "bg-gray-300/20"
                          }  `}
                      >
                        <p
                          className={`px-4 py-1 rounded-full  font-bold text-xl  ${activeBoxIndex === 7
                              ? "bg-[#B153E0]/[.32]"
                              : "bg-gray-300/40"
                            }`}
                        >
                          7
                        </p>
                      </div>
                      <p className="my-6 text-2xl">
                        এসাইনমেন্ট ও এর সমাধান ভিডিও সমাধান
                      </p>
                      <p className="text-paragraph dark:text-darkParagraph">
                        প্রতিটা মডিউল শেষে তোমাদের প্রাকটিস এর জন্যে থাকবে
                        কাস্টম এসাইনমেন্ট আর সেই এসাইনমেন্ট না পারলে থাকবে
                        সেগুলোর সমাধান ভিডিও ও একচুয়াল কোড সমাধান
                      </p>
                    </div>
                  </div>
                </div>
              </VisibilitySensor>
              <div className="hidden lg:block"></div>
              <div className="hidden lg:block"></div>
              <VisibilitySensor
                onChange={(isVisible: any) => {
                  if (isVisible) {
                    setActiveBoxIndex(8);
                  }
                }}
              >
                <div
                  className={`rounded-xl  text-center lg:justify-self-end ${activeBoxIndex == 8 ? "opacity-100" : "opacity-40"
                    } transition-all duration-300  ease-in-out`}
                  style={{
                    background:
                      activeBoxIndex == 8
                        ? "linear-gradient(124deg, rgba(202, 101, 253, 0.13) 0%, rgba(177, 83, 224, 0.00) 100%)"
                        : "linear-gradient(124deg, rgba(255, 255, 255, 0.12) 0%, rgba(177, 83, 224, 0.00) 100%)",
                  }}
                >
                  <div
                    className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/30 relative top-[1px]"
                    style={{}}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`px-2 py-2 rounded-full ${activeBoxIndex === 8
                            ? "bg-[#B153E0]/[.14]"
                            : "bg-gray-300/20"
                          }  `}
                      >
                        <p
                          className={`px-4 py-1 rounded-full  font-bold text-xl  ${activeBoxIndex === 8
                              ? "bg-[#B153E0]/[.32]"
                              : "bg-gray-300/40"
                            }`}
                        >
                          8
                        </p>
                      </div>
                      <p className="my-6 text-2xl">ওয়েবসাইটে ডাউট সেকশন</p>
                      <p className="text-paragraph dark:text-darkParagraph">
                        প্রতিটি কোর্স কন্টেন্ট এর সাথে থাকবে ডিসকাশন ফোরাম
                        যেখানে কন্টেন্ট রিলেটেড যেকোন ডাউট আস্ক করতে পারবে
                      </p>
                    </div>
                  </div>
                </div>
              </VisibilitySensor>
              <div className="hidden lg:block"></div>
              <div className="hidden lg:block"></div>
            </div>
          </div>
        </div>

        <div className="bg-[#ca65fd]/20 dark:bg-[#0B060D] z-30 relative">
          <AnimationOnScroll animateIn="animate__fadeIn" animateOnce>
            <div className="w-[90%] lg:w-[80%] mx-auto  text-heading dark:text-darkHeading py-20 md:py-32">
              <div className="pb-10 border-b border-gray-100/20 flex flex-col items-center">
                <div className="text-center">
                  <img src="/glowing_king.png" alt="" />
                </div>
                <h2 className="text-2xl md:text-4xl my-6">
                  কোর্স ইন্সট্রাক্টর
                </h2>
                <p className="text-xl">দেখে নাও আমাদের সেরা প্যানেল</p>
              </div>
              <div className="pt-20">
                <div className="grid grid-cols-1 lgXl:grid-cols-2 justify-center gap-16">
                  <div
                    className="rounded-xl text-center"
                    style={{
                      background:
                        "linear-gradient(#D6BBFB40 0%,  #FFFFFF00 100%)",
                    }}
                  >
                    <div
                      className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/90 relative top-[1px] h-full"
                      style={{}}
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-10 items-center lg:items-start">
                        <div className="text-center flex-1">
                          <div className="flex justify-center">
                            <img
                              src="/CP instructors/Arghya Pal_Random.png "
                              alt=""
                              className="rounded-xl w-full lg:w-[250px]"
                            />
                          </div>
                          <p className="mt-6 text-2xl">Arghya Pal</p>
                          <p className="mt-2 text-xl text-paragraph dark:text-darkParagraph">
                            Instructor at CoderVai
                          </p>
                        </div>
                        <div className="text-paragraph dark:text-darkParagraph text-left flex-1">
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Software Engineer at Google
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              ACM ICPC WORLD Finalist- 2 Times in a Row
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              ACM ICPC ASIA CHAMPION 2019
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Former RED CODER at CODEFORCES
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">BUET CSE{"'"}15</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="rounded-xl text-center"
                    style={{
                      background:
                        "linear-gradient(#D6BBFB40 0%,  #FFFFFF00 100%)",
                    }}
                  >
                    <div
                      className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/90 relative top-[1px] h-full"
                      style={{}}
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-10 items-center lg:items-start">
                        <div className="text-center flex-1">
                          <div className="flex justify-center">
                            <img
                              src="/CP instructors/Muttaqueen_Random.png "
                              alt=""
                              className="rounded-xl w-full lg:w-[250px]"
                            />
                          </div>
                          <p className="mt-6 text-2xl">Tanveer Muttaqueen</p>
                          <p className="mt-2 text-xl text-paragraph dark:text-darkParagraph">
                            Instructor at CoderVai
                          </p>
                          {/* <p className="my-5 text-paragraph dark:text-darkParagraph">
                            লিনিয়ার, কয়েনবেস এবং পোস্টস্ক্রিপ্টের জন্য
                            ফ্রন্টেন্ড ডেভ গঠন করে
                          </p> */}
                          {/* <div className="flex justify-center gap-8">
                            <svg
                              width="21"
                              height="17"
                              viewBox="0 0 21 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.7918 16.8028C14.3371 16.8028 18.4652 10.5501 18.4652 5.12941C18.4652 4.95363 18.4613 4.77394 18.4535 4.59816C19.2566 4.01741 19.9496 3.29807 20.5 2.47394C19.7521 2.80669 18.958 3.02401 18.1449 3.11847C19.0011 2.60528 19.6421 1.79908 19.9492 0.849329C19.1438 1.32665 18.263 1.66337 17.3445 1.84503C16.7257 1.18749 15.9075 0.75212 15.0164 0.606232C14.1253 0.460345 13.211 0.612065 12.4148 1.03794C11.6186 1.46381 10.9848 2.14011 10.6115 2.96228C10.2382 3.78445 10.1462 4.7067 10.3496 5.58644C8.71874 5.5046 7.12328 5.08094 5.66665 4.34294C4.21002 3.60493 2.92474 2.56905 1.89414 1.30245C1.37033 2.20556 1.21005 3.27423 1.44586 4.29127C1.68167 5.3083 2.29589 6.1974 3.16367 6.77784C2.51219 6.75716 1.87498 6.58176 1.30469 6.26613V6.31691C1.3041 7.26465 1.63175 8.18335 2.23192 8.91683C2.8321 9.65032 3.66777 10.1533 4.59687 10.3403C3.99338 10.5055 3.35999 10.5295 2.7457 10.4107C3.00788 11.2257 3.51798 11.9386 4.20481 12.4498C4.89164 12.961 5.72093 13.245 6.57695 13.2622C5.12369 14.4038 3.32848 15.023 1.48047 15.02C1.15274 15.0195 0.825333 14.9994 0.5 14.9599C2.37738 16.1643 4.56128 16.804 6.7918 16.8028Z"
                                fill="#787878"
                              />
                            </svg>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_501_15571)">
                                <path
                                  d="M19.0195 0.677734H1.97656C1.16016 0.677734 0.5 1.32227 0.5 2.11914V19.2324C0.5 20.0293 1.16016 20.6777 1.97656 20.6777H19.0195C19.8359 20.6777 20.5 20.0293 20.5 19.2363V2.11914C20.5 1.32227 19.8359 0.677734 19.0195 0.677734ZM6.43359 17.7207H3.46484V8.17383H6.43359V17.7207ZM4.94922 6.87305C3.99609 6.87305 3.22656 6.10352 3.22656 5.1543C3.22656 4.20508 3.99609 3.43555 4.94922 3.43555C5.89844 3.43555 6.66797 4.20508 6.66797 5.1543C6.66797 6.09961 5.89844 6.87305 4.94922 6.87305ZM17.543 17.7207H14.5781V13.0801C14.5781 11.9746 14.5586 10.5488 13.0352 10.5488C11.4922 10.5488 11.2578 11.7559 11.2578 13.002V17.7207H8.29688V8.17383H11.1406V9.47852H11.1797C11.5742 8.72852 12.543 7.93555 13.9844 7.93555C16.9883 7.93555 17.543 9.91211 17.543 12.4824V17.7207Z"
                                  fill="#787878"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_501_15571">
                                  <rect
                                    width="20"
                                    height="20"
                                    fill="white"
                                    transform="translate(0.5 0.677734)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.5 0.677734C4.97939 0.677734 0.5 5.15713 0.5 10.6777C0.5 16.1984 4.97939 20.6777 10.5 20.6777C16.0098 20.6777 20.5 16.1984 20.5 10.6777C20.5 5.15713 16.0098 0.677734 10.5 0.677734ZM17.1052 5.28728C18.2983 6.74064 19.0141 8.5953 19.0358 10.6018C18.7538 10.5476 15.9338 9.97273 13.0922 10.3307C13.0271 10.1897 12.9729 10.0378 12.9078 9.88598C12.7343 9.47386 12.5391 9.05086 12.3438 8.64955C15.4891 7.36973 16.9208 5.52589 17.1052 5.28728ZM10.5 2.15279C12.6692 2.15279 14.654 2.96624 16.1616 4.3003C16.0097 4.51722 14.7191 6.24173 11.6822 7.38055C10.2831 4.81005 8.73213 2.70593 8.4935 2.38055C9.13338 2.22871 9.80587 2.15279 10.5 2.15279ZM6.86662 2.95539C7.09437 3.25908 8.61281 5.37405 10.0336 7.8903C6.0423 8.95323 2.51736 8.93155 2.13774 8.93155C2.69089 6.28511 4.48047 4.08337 6.86662 2.95539ZM1.95336 10.6886C1.95336 10.6018 1.95336 10.515 1.95336 10.4283C2.32213 10.4391 6.46529 10.4934 10.7278 9.21355C10.9773 9.69073 11.205 10.1788 11.4219 10.6669C11.3134 10.6994 11.1941 10.732 11.0857 10.7645C6.68221 12.1853 4.33948 16.0682 4.14425 16.3935C2.7885 14.886 1.95336 12.8795 1.95336 10.6886ZM10.5 19.2244C8.526 19.2244 6.70391 18.5519 5.26139 17.4239C5.41323 17.1094 7.14856 13.7689 11.9642 12.0877C11.9859 12.0769 11.9968 12.0769 12.0184 12.066C13.2223 15.1788 13.7104 17.7927 13.8406 18.541C12.8102 18.9857 11.6822 19.2244 10.5 19.2244ZM15.2614 17.7602C15.1746 17.2395 14.7191 14.745 13.6019 11.6755C16.2809 11.2525 18.6236 11.9467 18.9165 12.0444C18.5478 14.4196 17.1811 16.4695 15.2614 17.7602Z"
                                fill="#787878"
                              />
                            </svg>
                          </div> */}
                        </div>
                        <div className="text-paragraph dark:text-darkParagraph text-left flex-1">
                          {/* <div className="text-heading dark:text-darkHeading flex gap-2 items-center">
                            <p>34টি কোর্স </p>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="2"
                                cy="2.17773"
                                r="2"
                                fill="#D9D9D9"
                              />
                            </svg>
                            <p>159 ঘন্টা</p>
                          </div> */}

                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Software Engineer at Google
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">ACM ICPC WORLD Finalist</p>
                          </div>

                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">BUET CSE{"'"}15</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="rounded-xl text-center"
                    style={{
                      background:
                        "linear-gradient(#D6BBFB40 0%,  #FFFFFF00 100%)",
                    }}
                  >
                    <div
                      className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/90 relative top-[1px] h-full"
                      style={{}}
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-10 items-center lg:items-start">
                        <div className="text-center flex-1">
                          <div className="flex justify-center">
                            <img
                              src="/CP instructors/Sachin_Random.png "
                              alt=""
                              className="rounded-xl w-full lg:w-[250px]"
                            />
                          </div>
                          <p className="mt-6 text-2xl">Sachin Deb</p>
                          <p className="mt-2 text-xl text-paragraph dark:text-darkParagraph">
                            Instructor, Course Designer and Moderator at
                            CoderVai
                          </p>
                          <p className="my-5 text-paragraph dark:text-darkParagraph">
                            Hi, I am Sachin, a 4th year undergraduate student at
                            BUET. I am interested in Competitive Programming,
                            full stack development and Machine Learning. I am
                            currently working as a instructor in this platform.
                          </p>
                          {/* <div className="flex justify-center gap-8">
                            <svg
                              width="21"
                              height="17"
                              viewBox="0 0 21 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.7918 16.8028C14.3371 16.8028 18.4652 10.5501 18.4652 5.12941C18.4652 4.95363 18.4613 4.77394 18.4535 4.59816C19.2566 4.01741 19.9496 3.29807 20.5 2.47394C19.7521 2.80669 18.958 3.02401 18.1449 3.11847C19.0011 2.60528 19.6421 1.79908 19.9492 0.849329C19.1438 1.32665 18.263 1.66337 17.3445 1.84503C16.7257 1.18749 15.9075 0.75212 15.0164 0.606232C14.1253 0.460345 13.211 0.612065 12.4148 1.03794C11.6186 1.46381 10.9848 2.14011 10.6115 2.96228C10.2382 3.78445 10.1462 4.7067 10.3496 5.58644C8.71874 5.5046 7.12328 5.08094 5.66665 4.34294C4.21002 3.60493 2.92474 2.56905 1.89414 1.30245C1.37033 2.20556 1.21005 3.27423 1.44586 4.29127C1.68167 5.3083 2.29589 6.1974 3.16367 6.77784C2.51219 6.75716 1.87498 6.58176 1.30469 6.26613V6.31691C1.3041 7.26465 1.63175 8.18335 2.23192 8.91683C2.8321 9.65032 3.66777 10.1533 4.59687 10.3403C3.99338 10.5055 3.35999 10.5295 2.7457 10.4107C3.00788 11.2257 3.51798 11.9386 4.20481 12.4498C4.89164 12.961 5.72093 13.245 6.57695 13.2622C5.12369 14.4038 3.32848 15.023 1.48047 15.02C1.15274 15.0195 0.825333 14.9994 0.5 14.9599C2.37738 16.1643 4.56128 16.804 6.7918 16.8028Z"
                                fill="#787878"
                              />
                            </svg>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_501_15571)">
                                <path
                                  d="M19.0195 0.677734H1.97656C1.16016 0.677734 0.5 1.32227 0.5 2.11914V19.2324C0.5 20.0293 1.16016 20.6777 1.97656 20.6777H19.0195C19.8359 20.6777 20.5 20.0293 20.5 19.2363V2.11914C20.5 1.32227 19.8359 0.677734 19.0195 0.677734ZM6.43359 17.7207H3.46484V8.17383H6.43359V17.7207ZM4.94922 6.87305C3.99609 6.87305 3.22656 6.10352 3.22656 5.1543C3.22656 4.20508 3.99609 3.43555 4.94922 3.43555C5.89844 3.43555 6.66797 4.20508 6.66797 5.1543C6.66797 6.09961 5.89844 6.87305 4.94922 6.87305ZM17.543 17.7207H14.5781V13.0801C14.5781 11.9746 14.5586 10.5488 13.0352 10.5488C11.4922 10.5488 11.2578 11.7559 11.2578 13.002V17.7207H8.29688V8.17383H11.1406V9.47852H11.1797C11.5742 8.72852 12.543 7.93555 13.9844 7.93555C16.9883 7.93555 17.543 9.91211 17.543 12.4824V17.7207Z"
                                  fill="#787878"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_501_15571">
                                  <rect
                                    width="20"
                                    height="20"
                                    fill="white"
                                    transform="translate(0.5 0.677734)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.5 0.677734C4.97939 0.677734 0.5 5.15713 0.5 10.6777C0.5 16.1984 4.97939 20.6777 10.5 20.6777C16.0098 20.6777 20.5 16.1984 20.5 10.6777C20.5 5.15713 16.0098 0.677734 10.5 0.677734ZM17.1052 5.28728C18.2983 6.74064 19.0141 8.5953 19.0358 10.6018C18.7538 10.5476 15.9338 9.97273 13.0922 10.3307C13.0271 10.1897 12.9729 10.0378 12.9078 9.88598C12.7343 9.47386 12.5391 9.05086 12.3438 8.64955C15.4891 7.36973 16.9208 5.52589 17.1052 5.28728ZM10.5 2.15279C12.6692 2.15279 14.654 2.96624 16.1616 4.3003C16.0097 4.51722 14.7191 6.24173 11.6822 7.38055C10.2831 4.81005 8.73213 2.70593 8.4935 2.38055C9.13338 2.22871 9.80587 2.15279 10.5 2.15279ZM6.86662 2.95539C7.09437 3.25908 8.61281 5.37405 10.0336 7.8903C6.0423 8.95323 2.51736 8.93155 2.13774 8.93155C2.69089 6.28511 4.48047 4.08337 6.86662 2.95539ZM1.95336 10.6886C1.95336 10.6018 1.95336 10.515 1.95336 10.4283C2.32213 10.4391 6.46529 10.4934 10.7278 9.21355C10.9773 9.69073 11.205 10.1788 11.4219 10.6669C11.3134 10.6994 11.1941 10.732 11.0857 10.7645C6.68221 12.1853 4.33948 16.0682 4.14425 16.3935C2.7885 14.886 1.95336 12.8795 1.95336 10.6886ZM10.5 19.2244C8.526 19.2244 6.70391 18.5519 5.26139 17.4239C5.41323 17.1094 7.14856 13.7689 11.9642 12.0877C11.9859 12.0769 11.9968 12.0769 12.0184 12.066C13.2223 15.1788 13.7104 17.7927 13.8406 18.541C12.8102 18.9857 11.6822 19.2244 10.5 19.2244ZM15.2614 17.7602C15.1746 17.2395 14.7191 14.745 13.6019 11.6755C16.2809 11.2525 18.6236 11.9467 18.9165 12.0444C18.5478 14.4196 17.1811 16.4695 15.2614 17.7602Z"
                                fill="#787878"
                              />
                            </svg>
                          </div> */}
                        </div>
                        <div className="text-paragraph dark:text-darkParagraph text-left flex-1">
                          {/* <div className="text-heading dark:text-darkHeading flex gap-2 items-center">
                            <p>34টি কোর্স </p>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="2"
                                cy="2.17773"
                                r="2"
                                fill="#D9D9D9"
                              />
                            </svg>
                            <p>159 ঘন্টা</p>
                          </div> */}

                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Have Strong Competitive Programming Background.
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              ICPC Regionals 7th(2021) and 10th(2022)
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">CF: Candidate Master</p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Leetcode: Guardian(top: .06%)
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">BUET CSE{"'"}18</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="rounded-xl text-center"
                    style={{
                      background:
                        "linear-gradient(#D6BBFB40 0%,  #FFFFFF00 100%)",
                    }}
                  >
                    <div
                      className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/90 relative top-[1px] h-full"
                      style={{}}
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-10 items-center lg:items-start">
                        <div className="text-center flex-1">
                          <div className="flex justify-center">
                            <img
                              src="/CP instructors/Sohaib_Random.png "
                              alt=""
                              className="rounded-xl w-full lg:w-[250px]"
                            />
                          </div>
                          <p className="mt-6 text-2xl">Sohaib Bin Musa</p>
                          <p className="mt-2 text-xl text-paragraph dark:text-darkParagraph">
                            Instructor, Problem Setter, Moderator at CoderVai
                          </p>
                          <p className="my-5 text-paragraph dark:text-darkParagraph">
                            Hey, I am Sohaib and I will be your instructor in
                            this course. I am currently studying CSE in BUET. I
                            am involved in Competitive Programming for the past
                            5 years. I am also researching algorithms for Bio
                            Informatics.
                          </p>
                          {/* <div className="flex justify-center gap-8">
                            <svg
                              width="21"
                              height="17"
                              viewBox="0 0 21 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.7918 16.8028C14.3371 16.8028 18.4652 10.5501 18.4652 5.12941C18.4652 4.95363 18.4613 4.77394 18.4535 4.59816C19.2566 4.01741 19.9496 3.29807 20.5 2.47394C19.7521 2.80669 18.958 3.02401 18.1449 3.11847C19.0011 2.60528 19.6421 1.79908 19.9492 0.849329C19.1438 1.32665 18.263 1.66337 17.3445 1.84503C16.7257 1.18749 15.9075 0.75212 15.0164 0.606232C14.1253 0.460345 13.211 0.612065 12.4148 1.03794C11.6186 1.46381 10.9848 2.14011 10.6115 2.96228C10.2382 3.78445 10.1462 4.7067 10.3496 5.58644C8.71874 5.5046 7.12328 5.08094 5.66665 4.34294C4.21002 3.60493 2.92474 2.56905 1.89414 1.30245C1.37033 2.20556 1.21005 3.27423 1.44586 4.29127C1.68167 5.3083 2.29589 6.1974 3.16367 6.77784C2.51219 6.75716 1.87498 6.58176 1.30469 6.26613V6.31691C1.3041 7.26465 1.63175 8.18335 2.23192 8.91683C2.8321 9.65032 3.66777 10.1533 4.59687 10.3403C3.99338 10.5055 3.35999 10.5295 2.7457 10.4107C3.00788 11.2257 3.51798 11.9386 4.20481 12.4498C4.89164 12.961 5.72093 13.245 6.57695 13.2622C5.12369 14.4038 3.32848 15.023 1.48047 15.02C1.15274 15.0195 0.825333 14.9994 0.5 14.9599C2.37738 16.1643 4.56128 16.804 6.7918 16.8028Z"
                                fill="#787878"
                              />
                            </svg>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_501_15571)">
                                <path
                                  d="M19.0195 0.677734H1.97656C1.16016 0.677734 0.5 1.32227 0.5 2.11914V19.2324C0.5 20.0293 1.16016 20.6777 1.97656 20.6777H19.0195C19.8359 20.6777 20.5 20.0293 20.5 19.2363V2.11914C20.5 1.32227 19.8359 0.677734 19.0195 0.677734ZM6.43359 17.7207H3.46484V8.17383H6.43359V17.7207ZM4.94922 6.87305C3.99609 6.87305 3.22656 6.10352 3.22656 5.1543C3.22656 4.20508 3.99609 3.43555 4.94922 3.43555C5.89844 3.43555 6.66797 4.20508 6.66797 5.1543C6.66797 6.09961 5.89844 6.87305 4.94922 6.87305ZM17.543 17.7207H14.5781V13.0801C14.5781 11.9746 14.5586 10.5488 13.0352 10.5488C11.4922 10.5488 11.2578 11.7559 11.2578 13.002V17.7207H8.29688V8.17383H11.1406V9.47852H11.1797C11.5742 8.72852 12.543 7.93555 13.9844 7.93555C16.9883 7.93555 17.543 9.91211 17.543 12.4824V17.7207Z"
                                  fill="#787878"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_501_15571">
                                  <rect
                                    width="20"
                                    height="20"
                                    fill="white"
                                    transform="translate(0.5 0.677734)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.5 0.677734C4.97939 0.677734 0.5 5.15713 0.5 10.6777C0.5 16.1984 4.97939 20.6777 10.5 20.6777C16.0098 20.6777 20.5 16.1984 20.5 10.6777C20.5 5.15713 16.0098 0.677734 10.5 0.677734ZM17.1052 5.28728C18.2983 6.74064 19.0141 8.5953 19.0358 10.6018C18.7538 10.5476 15.9338 9.97273 13.0922 10.3307C13.0271 10.1897 12.9729 10.0378 12.9078 9.88598C12.7343 9.47386 12.5391 9.05086 12.3438 8.64955C15.4891 7.36973 16.9208 5.52589 17.1052 5.28728ZM10.5 2.15279C12.6692 2.15279 14.654 2.96624 16.1616 4.3003C16.0097 4.51722 14.7191 6.24173 11.6822 7.38055C10.2831 4.81005 8.73213 2.70593 8.4935 2.38055C9.13338 2.22871 9.80587 2.15279 10.5 2.15279ZM6.86662 2.95539C7.09437 3.25908 8.61281 5.37405 10.0336 7.8903C6.0423 8.95323 2.51736 8.93155 2.13774 8.93155C2.69089 6.28511 4.48047 4.08337 6.86662 2.95539ZM1.95336 10.6886C1.95336 10.6018 1.95336 10.515 1.95336 10.4283C2.32213 10.4391 6.46529 10.4934 10.7278 9.21355C10.9773 9.69073 11.205 10.1788 11.4219 10.6669C11.3134 10.6994 11.1941 10.732 11.0857 10.7645C6.68221 12.1853 4.33948 16.0682 4.14425 16.3935C2.7885 14.886 1.95336 12.8795 1.95336 10.6886ZM10.5 19.2244C8.526 19.2244 6.70391 18.5519 5.26139 17.4239C5.41323 17.1094 7.14856 13.7689 11.9642 12.0877C11.9859 12.0769 11.9968 12.0769 12.0184 12.066C13.2223 15.1788 13.7104 17.7927 13.8406 18.541C12.8102 18.9857 11.6822 19.2244 10.5 19.2244ZM15.2614 17.7602C15.1746 17.2395 14.7191 14.745 13.6019 11.6755C16.2809 11.2525 18.6236 11.9467 18.9165 12.0444C18.5478 14.4196 17.1811 16.4695 15.2614 17.7602Z"
                                fill="#787878"
                              />
                            </svg>
                          </div> */}
                        </div>
                        <div className="text-paragraph dark:text-darkParagraph text-left flex-1">
                          {/* <div className="text-heading dark:text-darkHeading flex gap-2 items-center">
                            <p>34টি কোর্স </p>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="2"
                                cy="2.17773"
                                r="2"
                                fill="#D9D9D9"
                              />
                            </svg>
                            <p>159 ঘন্টা</p>
                          </div> */}

                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Expert in Algorithms, Software Development, DL
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              ICPC regionals 10th (2022)
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">CF : Master</p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">BdPho 7th (2018)</p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">BDMO runners up (2017)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="rounded-xl text-center"
                    style={{
                      background:
                        "linear-gradient(#D6BBFB40 0%,  #FFFFFF00 100%)",
                    }}
                  >
                    <div
                      className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/90 relative top-[1px] h-full"
                      style={{}}
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-10 items-center lg:items-start">
                        <div className="text-center flex-1">
                          <div className="flex justify-center">
                            <img
                              src="/CP instructors/Rudro Debnath.jpg"
                              alt=""
                              className="rounded-xl w-full lg:w-[250px] "
                            />
                          </div>
                          <p className="mt-6 text-2xl">Rudro Debnath</p>
                          <p className="mt-2 text-xl text-paragraph dark:text-darkParagraph">
                            Tester, Content Creator at CoderVai
                          </p>
                          <p className="my-5 text-paragraph dark:text-darkParagraph">
                            Hi, I{"'"}m Rudro Debnath, a 4th year undergraduate
                            student at BU. I am interested in Competitive
                            Programming, web development and Machine Learning.
                          </p>
                          {/* <div className="flex justify-center gap-8">
                            <svg
                              width="21"
                              height="17"
                              viewBox="0 0 21 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.7918 16.8028C14.3371 16.8028 18.4652 10.5501 18.4652 5.12941C18.4652 4.95363 18.4613 4.77394 18.4535 4.59816C19.2566 4.01741 19.9496 3.29807 20.5 2.47394C19.7521 2.80669 18.958 3.02401 18.1449 3.11847C19.0011 2.60528 19.6421 1.79908 19.9492 0.849329C19.1438 1.32665 18.263 1.66337 17.3445 1.84503C16.7257 1.18749 15.9075 0.75212 15.0164 0.606232C14.1253 0.460345 13.211 0.612065 12.4148 1.03794C11.6186 1.46381 10.9848 2.14011 10.6115 2.96228C10.2382 3.78445 10.1462 4.7067 10.3496 5.58644C8.71874 5.5046 7.12328 5.08094 5.66665 4.34294C4.21002 3.60493 2.92474 2.56905 1.89414 1.30245C1.37033 2.20556 1.21005 3.27423 1.44586 4.29127C1.68167 5.3083 2.29589 6.1974 3.16367 6.77784C2.51219 6.75716 1.87498 6.58176 1.30469 6.26613V6.31691C1.3041 7.26465 1.63175 8.18335 2.23192 8.91683C2.8321 9.65032 3.66777 10.1533 4.59687 10.3403C3.99338 10.5055 3.35999 10.5295 2.7457 10.4107C3.00788 11.2257 3.51798 11.9386 4.20481 12.4498C4.89164 12.961 5.72093 13.245 6.57695 13.2622C5.12369 14.4038 3.32848 15.023 1.48047 15.02C1.15274 15.0195 0.825333 14.9994 0.5 14.9599C2.37738 16.1643 4.56128 16.804 6.7918 16.8028Z"
                                fill="#787878"
                              />
                            </svg>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_501_15571)">
                                <path
                                  d="M19.0195 0.677734H1.97656C1.16016 0.677734 0.5 1.32227 0.5 2.11914V19.2324C0.5 20.0293 1.16016 20.6777 1.97656 20.6777H19.0195C19.8359 20.6777 20.5 20.0293 20.5 19.2363V2.11914C20.5 1.32227 19.8359 0.677734 19.0195 0.677734ZM6.43359 17.7207H3.46484V8.17383H6.43359V17.7207ZM4.94922 6.87305C3.99609 6.87305 3.22656 6.10352 3.22656 5.1543C3.22656 4.20508 3.99609 3.43555 4.94922 3.43555C5.89844 3.43555 6.66797 4.20508 6.66797 5.1543C6.66797 6.09961 5.89844 6.87305 4.94922 6.87305ZM17.543 17.7207H14.5781V13.0801C14.5781 11.9746 14.5586 10.5488 13.0352 10.5488C11.4922 10.5488 11.2578 11.7559 11.2578 13.002V17.7207H8.29688V8.17383H11.1406V9.47852H11.1797C11.5742 8.72852 12.543 7.93555 13.9844 7.93555C16.9883 7.93555 17.543 9.91211 17.543 12.4824V17.7207Z"
                                  fill="#787878"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_501_15571">
                                  <rect
                                    width="20"
                                    height="20"
                                    fill="white"
                                    transform="translate(0.5 0.677734)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.5 0.677734C4.97939 0.677734 0.5 5.15713 0.5 10.6777C0.5 16.1984 4.97939 20.6777 10.5 20.6777C16.0098 20.6777 20.5 16.1984 20.5 10.6777C20.5 5.15713 16.0098 0.677734 10.5 0.677734ZM17.1052 5.28728C18.2983 6.74064 19.0141 8.5953 19.0358 10.6018C18.7538 10.5476 15.9338 9.97273 13.0922 10.3307C13.0271 10.1897 12.9729 10.0378 12.9078 9.88598C12.7343 9.47386 12.5391 9.05086 12.3438 8.64955C15.4891 7.36973 16.9208 5.52589 17.1052 5.28728ZM10.5 2.15279C12.6692 2.15279 14.654 2.96624 16.1616 4.3003C16.0097 4.51722 14.7191 6.24173 11.6822 7.38055C10.2831 4.81005 8.73213 2.70593 8.4935 2.38055C9.13338 2.22871 9.80587 2.15279 10.5 2.15279ZM6.86662 2.95539C7.09437 3.25908 8.61281 5.37405 10.0336 7.8903C6.0423 8.95323 2.51736 8.93155 2.13774 8.93155C2.69089 6.28511 4.48047 4.08337 6.86662 2.95539ZM1.95336 10.6886C1.95336 10.6018 1.95336 10.515 1.95336 10.4283C2.32213 10.4391 6.46529 10.4934 10.7278 9.21355C10.9773 9.69073 11.205 10.1788 11.4219 10.6669C11.3134 10.6994 11.1941 10.732 11.0857 10.7645C6.68221 12.1853 4.33948 16.0682 4.14425 16.3935C2.7885 14.886 1.95336 12.8795 1.95336 10.6886ZM10.5 19.2244C8.526 19.2244 6.70391 18.5519 5.26139 17.4239C5.41323 17.1094 7.14856 13.7689 11.9642 12.0877C11.9859 12.0769 11.9968 12.0769 12.0184 12.066C13.2223 15.1788 13.7104 17.7927 13.8406 18.541C12.8102 18.9857 11.6822 19.2244 10.5 19.2244ZM15.2614 17.7602C15.1746 17.2395 14.7191 14.745 13.6019 11.6755C16.2809 11.2525 18.6236 11.9467 18.9165 12.0444C18.5478 14.4196 17.1811 16.4695 15.2614 17.7602Z"
                                fill="#787878"
                              />
                            </svg>
                          </div> */}
                        </div>
                        <div className="text-paragraph dark:text-darkParagraph text-left flex-1">
                          {/* <div className="text-heading dark:text-darkHeading flex gap-2 items-center">
                            <p>34টি কোর্স </p>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="2"
                                cy="2.17773"
                                r="2"
                                fill="#D9D9D9"
                              />
                            </svg>
                            <p>159 ঘন্টা</p>
                          </div> */}

                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Expert in Competitive Programming
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">University Of Barishal</p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">BUET IUPC 2022 (15th)</p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              ICPC 21 & 22 Dhaka Regional Participant
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Codeforces-Expert (Max- 1882)
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              LeetCode- Knight (Max- 2008, Top- 2.66%)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="rounded-xl text-center"
                    style={{
                      background:
                        "linear-gradient(#D6BBFB40 0%,  #FFFFFF00 100%)",
                    }}
                  >
                    <div
                      className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/90 relative top-[1px] h-full"
                      style={{}}
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-10 items-center lg:items-start">
                        <div className="text-center flex-1">
                          <div className="flex justify-center">
                            <img
                              src="/CP instructors/Tithi Saha.jpg "
                              alt=""
                              className="rounded-xl w-full lg:w-[250px]"
                            />
                          </div>
                          <p className="mt-6 text-2xl">Tithi Saha</p>
                          <p className="mt-2 text-xl text-paragraph dark:text-darkParagraph">
                            Content Creator at CoderVai
                          </p>
                          <p className="my-5 text-paragraph dark:text-darkParagraph">
                            Hi, I{"'"}m Tithi Saha, a 4th year undergraduate
                            student at dept. of CSE, SUST. I{"'"}m interested in
                            Web Development, Machine Learning, Human and
                            Computer Interaction and Security. I{"'"}m currently
                            working as a content creator in this platform.
                          </p>
                          {/* <div className="flex justify-center gap-8">
                            <svg
                              width="21"
                              height="17"
                              viewBox="0 0 21 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.7918 16.8028C14.3371 16.8028 18.4652 10.5501 18.4652 5.12941C18.4652 4.95363 18.4613 4.77394 18.4535 4.59816C19.2566 4.01741 19.9496 3.29807 20.5 2.47394C19.7521 2.80669 18.958 3.02401 18.1449 3.11847C19.0011 2.60528 19.6421 1.79908 19.9492 0.849329C19.1438 1.32665 18.263 1.66337 17.3445 1.84503C16.7257 1.18749 15.9075 0.75212 15.0164 0.606232C14.1253 0.460345 13.211 0.612065 12.4148 1.03794C11.6186 1.46381 10.9848 2.14011 10.6115 2.96228C10.2382 3.78445 10.1462 4.7067 10.3496 5.58644C8.71874 5.5046 7.12328 5.08094 5.66665 4.34294C4.21002 3.60493 2.92474 2.56905 1.89414 1.30245C1.37033 2.20556 1.21005 3.27423 1.44586 4.29127C1.68167 5.3083 2.29589 6.1974 3.16367 6.77784C2.51219 6.75716 1.87498 6.58176 1.30469 6.26613V6.31691C1.3041 7.26465 1.63175 8.18335 2.23192 8.91683C2.8321 9.65032 3.66777 10.1533 4.59687 10.3403C3.99338 10.5055 3.35999 10.5295 2.7457 10.4107C3.00788 11.2257 3.51798 11.9386 4.20481 12.4498C4.89164 12.961 5.72093 13.245 6.57695 13.2622C5.12369 14.4038 3.32848 15.023 1.48047 15.02C1.15274 15.0195 0.825333 14.9994 0.5 14.9599C2.37738 16.1643 4.56128 16.804 6.7918 16.8028Z"
                                fill="#787878"
                              />
                            </svg>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_501_15571)">
                                <path
                                  d="M19.0195 0.677734H1.97656C1.16016 0.677734 0.5 1.32227 0.5 2.11914V19.2324C0.5 20.0293 1.16016 20.6777 1.97656 20.6777H19.0195C19.8359 20.6777 20.5 20.0293 20.5 19.2363V2.11914C20.5 1.32227 19.8359 0.677734 19.0195 0.677734ZM6.43359 17.7207H3.46484V8.17383H6.43359V17.7207ZM4.94922 6.87305C3.99609 6.87305 3.22656 6.10352 3.22656 5.1543C3.22656 4.20508 3.99609 3.43555 4.94922 3.43555C5.89844 3.43555 6.66797 4.20508 6.66797 5.1543C6.66797 6.09961 5.89844 6.87305 4.94922 6.87305ZM17.543 17.7207H14.5781V13.0801C14.5781 11.9746 14.5586 10.5488 13.0352 10.5488C11.4922 10.5488 11.2578 11.7559 11.2578 13.002V17.7207H8.29688V8.17383H11.1406V9.47852H11.1797C11.5742 8.72852 12.543 7.93555 13.9844 7.93555C16.9883 7.93555 17.543 9.91211 17.543 12.4824V17.7207Z"
                                  fill="#787878"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_501_15571">
                                  <rect
                                    width="20"
                                    height="20"
                                    fill="white"
                                    transform="translate(0.5 0.677734)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.5 0.677734C4.97939 0.677734 0.5 5.15713 0.5 10.6777C0.5 16.1984 4.97939 20.6777 10.5 20.6777C16.0098 20.6777 20.5 16.1984 20.5 10.6777C20.5 5.15713 16.0098 0.677734 10.5 0.677734ZM17.1052 5.28728C18.2983 6.74064 19.0141 8.5953 19.0358 10.6018C18.7538 10.5476 15.9338 9.97273 13.0922 10.3307C13.0271 10.1897 12.9729 10.0378 12.9078 9.88598C12.7343 9.47386 12.5391 9.05086 12.3438 8.64955C15.4891 7.36973 16.9208 5.52589 17.1052 5.28728ZM10.5 2.15279C12.6692 2.15279 14.654 2.96624 16.1616 4.3003C16.0097 4.51722 14.7191 6.24173 11.6822 7.38055C10.2831 4.81005 8.73213 2.70593 8.4935 2.38055C9.13338 2.22871 9.80587 2.15279 10.5 2.15279ZM6.86662 2.95539C7.09437 3.25908 8.61281 5.37405 10.0336 7.8903C6.0423 8.95323 2.51736 8.93155 2.13774 8.93155C2.69089 6.28511 4.48047 4.08337 6.86662 2.95539ZM1.95336 10.6886C1.95336 10.6018 1.95336 10.515 1.95336 10.4283C2.32213 10.4391 6.46529 10.4934 10.7278 9.21355C10.9773 9.69073 11.205 10.1788 11.4219 10.6669C11.3134 10.6994 11.1941 10.732 11.0857 10.7645C6.68221 12.1853 4.33948 16.0682 4.14425 16.3935C2.7885 14.886 1.95336 12.8795 1.95336 10.6886ZM10.5 19.2244C8.526 19.2244 6.70391 18.5519 5.26139 17.4239C5.41323 17.1094 7.14856 13.7689 11.9642 12.0877C11.9859 12.0769 11.9968 12.0769 12.0184 12.066C13.2223 15.1788 13.7104 17.7927 13.8406 18.541C12.8102 18.9857 11.6822 19.2244 10.5 19.2244ZM15.2614 17.7602C15.1746 17.2395 14.7191 14.745 13.6019 11.6755C16.2809 11.2525 18.6236 11.9467 18.9165 12.0444C18.5478 14.4196 17.1811 16.4695 15.2614 17.7602Z"
                                fill="#787878"
                              />
                            </svg>
                          </div> */}
                        </div>
                        <div className="text-paragraph dark:text-darkParagraph text-left flex-1">
                          {/* <div className="text-heading dark:text-darkHeading flex gap-2 items-center">
                            <p>34টি কোর্স </p>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="2"
                                cy="2.17773"
                                r="2"
                                fill="#D9D9D9"
                              />
                            </svg>
                            <p>159 ঘন্টা</p>
                          </div> */}

                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Expert in Web Development
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Dept. of CSE, Shahjalal University of Science and
                              Technology, Sylhet
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Hack NSU Season 4 (2022), Champion
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              bdApps Nation Hackathon 2022, 2nd Runner-up at
                              Sylhet region
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              SUST SWE Technovent 2023 Brain Station 23
                              Hackathon, 4th
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="rounded-xl text-center"
                    style={{
                      background:
                        "linear-gradient(#D6BBFB40 0%,  #FFFFFF00 100%)",
                    }}
                  >
                    <div
                      className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/90 relative top-[1px] h-full"
                      style={{}}
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-10 items-center lg:items-start">
                        <div className="text-center flex-1">
                          <div className="flex justify-center">
                            <img
                              src="/CP instructors/Abrar Hasnat.jpg "
                              alt=""
                              className="rounded-xl w-full lg:w-[250px]"
                            />
                          </div>
                          <p className="mt-6 text-2xl">Abrar Hasnat </p>
                          <p className="mt-2 text-xl text-paragraph dark:text-darkParagraph">
                            Tester, Doubt solver, Content Maker at CoderVai
                          </p>
                          <p className="my-5 text-paragraph dark:text-darkParagraph">
                            Hi, I{"'"}m Abrar Hasnat, a 4th year undergrad
                            student at department of CSE,BUET. I{"'"}m
                            interested in Competitive Programming, full stack
                            development and Machine Learning.
                          </p>
                          {/* <div className="flex justify-center gap-8">
                            <svg
                              width="21"
                              height="17"
                              viewBox="0 0 21 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.7918 16.8028C14.3371 16.8028 18.4652 10.5501 18.4652 5.12941C18.4652 4.95363 18.4613 4.77394 18.4535 4.59816C19.2566 4.01741 19.9496 3.29807 20.5 2.47394C19.7521 2.80669 18.958 3.02401 18.1449 3.11847C19.0011 2.60528 19.6421 1.79908 19.9492 0.849329C19.1438 1.32665 18.263 1.66337 17.3445 1.84503C16.7257 1.18749 15.9075 0.75212 15.0164 0.606232C14.1253 0.460345 13.211 0.612065 12.4148 1.03794C11.6186 1.46381 10.9848 2.14011 10.6115 2.96228C10.2382 3.78445 10.1462 4.7067 10.3496 5.58644C8.71874 5.5046 7.12328 5.08094 5.66665 4.34294C4.21002 3.60493 2.92474 2.56905 1.89414 1.30245C1.37033 2.20556 1.21005 3.27423 1.44586 4.29127C1.68167 5.3083 2.29589 6.1974 3.16367 6.77784C2.51219 6.75716 1.87498 6.58176 1.30469 6.26613V6.31691C1.3041 7.26465 1.63175 8.18335 2.23192 8.91683C2.8321 9.65032 3.66777 10.1533 4.59687 10.3403C3.99338 10.5055 3.35999 10.5295 2.7457 10.4107C3.00788 11.2257 3.51798 11.9386 4.20481 12.4498C4.89164 12.961 5.72093 13.245 6.57695 13.2622C5.12369 14.4038 3.32848 15.023 1.48047 15.02C1.15274 15.0195 0.825333 14.9994 0.5 14.9599C2.37738 16.1643 4.56128 16.804 6.7918 16.8028Z"
                                fill="#787878"
                              />
                            </svg>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_501_15571)">
                                <path
                                  d="M19.0195 0.677734H1.97656C1.16016 0.677734 0.5 1.32227 0.5 2.11914V19.2324C0.5 20.0293 1.16016 20.6777 1.97656 20.6777H19.0195C19.8359 20.6777 20.5 20.0293 20.5 19.2363V2.11914C20.5 1.32227 19.8359 0.677734 19.0195 0.677734ZM6.43359 17.7207H3.46484V8.17383H6.43359V17.7207ZM4.94922 6.87305C3.99609 6.87305 3.22656 6.10352 3.22656 5.1543C3.22656 4.20508 3.99609 3.43555 4.94922 3.43555C5.89844 3.43555 6.66797 4.20508 6.66797 5.1543C6.66797 6.09961 5.89844 6.87305 4.94922 6.87305ZM17.543 17.7207H14.5781V13.0801C14.5781 11.9746 14.5586 10.5488 13.0352 10.5488C11.4922 10.5488 11.2578 11.7559 11.2578 13.002V17.7207H8.29688V8.17383H11.1406V9.47852H11.1797C11.5742 8.72852 12.543 7.93555 13.9844 7.93555C16.9883 7.93555 17.543 9.91211 17.543 12.4824V17.7207Z"
                                  fill="#787878"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_501_15571">
                                  <rect
                                    width="20"
                                    height="20"
                                    fill="white"
                                    transform="translate(0.5 0.677734)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.5 0.677734C4.97939 0.677734 0.5 5.15713 0.5 10.6777C0.5 16.1984 4.97939 20.6777 10.5 20.6777C16.0098 20.6777 20.5 16.1984 20.5 10.6777C20.5 5.15713 16.0098 0.677734 10.5 0.677734ZM17.1052 5.28728C18.2983 6.74064 19.0141 8.5953 19.0358 10.6018C18.7538 10.5476 15.9338 9.97273 13.0922 10.3307C13.0271 10.1897 12.9729 10.0378 12.9078 9.88598C12.7343 9.47386 12.5391 9.05086 12.3438 8.64955C15.4891 7.36973 16.9208 5.52589 17.1052 5.28728ZM10.5 2.15279C12.6692 2.15279 14.654 2.96624 16.1616 4.3003C16.0097 4.51722 14.7191 6.24173 11.6822 7.38055C10.2831 4.81005 8.73213 2.70593 8.4935 2.38055C9.13338 2.22871 9.80587 2.15279 10.5 2.15279ZM6.86662 2.95539C7.09437 3.25908 8.61281 5.37405 10.0336 7.8903C6.0423 8.95323 2.51736 8.93155 2.13774 8.93155C2.69089 6.28511 4.48047 4.08337 6.86662 2.95539ZM1.95336 10.6886C1.95336 10.6018 1.95336 10.515 1.95336 10.4283C2.32213 10.4391 6.46529 10.4934 10.7278 9.21355C10.9773 9.69073 11.205 10.1788 11.4219 10.6669C11.3134 10.6994 11.1941 10.732 11.0857 10.7645C6.68221 12.1853 4.33948 16.0682 4.14425 16.3935C2.7885 14.886 1.95336 12.8795 1.95336 10.6886ZM10.5 19.2244C8.526 19.2244 6.70391 18.5519 5.26139 17.4239C5.41323 17.1094 7.14856 13.7689 11.9642 12.0877C11.9859 12.0769 11.9968 12.0769 12.0184 12.066C13.2223 15.1788 13.7104 17.7927 13.8406 18.541C12.8102 18.9857 11.6822 19.2244 10.5 19.2244ZM15.2614 17.7602C15.1746 17.2395 14.7191 14.745 13.6019 11.6755C16.2809 11.2525 18.6236 11.9467 18.9165 12.0444C18.5478 14.4196 17.1811 16.4695 15.2614 17.7602Z"
                                fill="#787878"
                              />
                            </svg>
                          </div> */}
                        </div>
                        <div className="text-paragraph dark:text-darkParagraph text-left flex-1">
                          {/* <div className="text-heading dark:text-darkHeading flex gap-2 items-center">
                            <p>34টি কোর্স </p>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="2"
                                cy="2.17773"
                                r="2"
                                fill="#D9D9D9"
                              />
                            </svg>
                            <p>159 ঘন্টা</p>
                          </div> */}

                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Expert in Competitive Programming, Software
                              development.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="rounded-xl text-center"
                    style={{
                      background:
                        "linear-gradient(#D6BBFB40 0%,  #FFFFFF00 100%)",
                    }}
                  >
                    <div
                      className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/90 relative top-[1px] h-full"
                      style={{}}
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-10 items-center lg:items-start">
                        <div className="text-center flex-1">
                          <div className="flex justify-center">
                            <img
                              src="/CP instructors/Jubaer Jami.jpg "
                              alt=""
                              className="rounded-xl w-full lg:w-[250px]"
                            />
                          </div>
                          <p className="mt-6 text-2xl">Jubaer Jami</p>
                          <p className="mt-2 text-xl text-paragraph dark:text-darkParagraph">
                            Developer at CoderVai
                          </p>
                          <p className="my-5 text-paragraph dark:text-darkParagraph">
                            Breathing Life into Cool Ideas.
                          </p>
                          {/* <div className="flex justify-center gap-8">
                            <svg
                              width="21"
                              height="17"
                              viewBox="0 0 21 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.7918 16.8028C14.3371 16.8028 18.4652 10.5501 18.4652 5.12941C18.4652 4.95363 18.4613 4.77394 18.4535 4.59816C19.2566 4.01741 19.9496 3.29807 20.5 2.47394C19.7521 2.80669 18.958 3.02401 18.1449 3.11847C19.0011 2.60528 19.6421 1.79908 19.9492 0.849329C19.1438 1.32665 18.263 1.66337 17.3445 1.84503C16.7257 1.18749 15.9075 0.75212 15.0164 0.606232C14.1253 0.460345 13.211 0.612065 12.4148 1.03794C11.6186 1.46381 10.9848 2.14011 10.6115 2.96228C10.2382 3.78445 10.1462 4.7067 10.3496 5.58644C8.71874 5.5046 7.12328 5.08094 5.66665 4.34294C4.21002 3.60493 2.92474 2.56905 1.89414 1.30245C1.37033 2.20556 1.21005 3.27423 1.44586 4.29127C1.68167 5.3083 2.29589 6.1974 3.16367 6.77784C2.51219 6.75716 1.87498 6.58176 1.30469 6.26613V6.31691C1.3041 7.26465 1.63175 8.18335 2.23192 8.91683C2.8321 9.65032 3.66777 10.1533 4.59687 10.3403C3.99338 10.5055 3.35999 10.5295 2.7457 10.4107C3.00788 11.2257 3.51798 11.9386 4.20481 12.4498C4.89164 12.961 5.72093 13.245 6.57695 13.2622C5.12369 14.4038 3.32848 15.023 1.48047 15.02C1.15274 15.0195 0.825333 14.9994 0.5 14.9599C2.37738 16.1643 4.56128 16.804 6.7918 16.8028Z"
                                fill="#787878"
                              />
                            </svg>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_501_15571)">
                                <path
                                  d="M19.0195 0.677734H1.97656C1.16016 0.677734 0.5 1.32227 0.5 2.11914V19.2324C0.5 20.0293 1.16016 20.6777 1.97656 20.6777H19.0195C19.8359 20.6777 20.5 20.0293 20.5 19.2363V2.11914C20.5 1.32227 19.8359 0.677734 19.0195 0.677734ZM6.43359 17.7207H3.46484V8.17383H6.43359V17.7207ZM4.94922 6.87305C3.99609 6.87305 3.22656 6.10352 3.22656 5.1543C3.22656 4.20508 3.99609 3.43555 4.94922 3.43555C5.89844 3.43555 6.66797 4.20508 6.66797 5.1543C6.66797 6.09961 5.89844 6.87305 4.94922 6.87305ZM17.543 17.7207H14.5781V13.0801C14.5781 11.9746 14.5586 10.5488 13.0352 10.5488C11.4922 10.5488 11.2578 11.7559 11.2578 13.002V17.7207H8.29688V8.17383H11.1406V9.47852H11.1797C11.5742 8.72852 12.543 7.93555 13.9844 7.93555C16.9883 7.93555 17.543 9.91211 17.543 12.4824V17.7207Z"
                                  fill="#787878"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_501_15571">
                                  <rect
                                    width="20"
                                    height="20"
                                    fill="white"
                                    transform="translate(0.5 0.677734)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.5 0.677734C4.97939 0.677734 0.5 5.15713 0.5 10.6777C0.5 16.1984 4.97939 20.6777 10.5 20.6777C16.0098 20.6777 20.5 16.1984 20.5 10.6777C20.5 5.15713 16.0098 0.677734 10.5 0.677734ZM17.1052 5.28728C18.2983 6.74064 19.0141 8.5953 19.0358 10.6018C18.7538 10.5476 15.9338 9.97273 13.0922 10.3307C13.0271 10.1897 12.9729 10.0378 12.9078 9.88598C12.7343 9.47386 12.5391 9.05086 12.3438 8.64955C15.4891 7.36973 16.9208 5.52589 17.1052 5.28728ZM10.5 2.15279C12.6692 2.15279 14.654 2.96624 16.1616 4.3003C16.0097 4.51722 14.7191 6.24173 11.6822 7.38055C10.2831 4.81005 8.73213 2.70593 8.4935 2.38055C9.13338 2.22871 9.80587 2.15279 10.5 2.15279ZM6.86662 2.95539C7.09437 3.25908 8.61281 5.37405 10.0336 7.8903C6.0423 8.95323 2.51736 8.93155 2.13774 8.93155C2.69089 6.28511 4.48047 4.08337 6.86662 2.95539ZM1.95336 10.6886C1.95336 10.6018 1.95336 10.515 1.95336 10.4283C2.32213 10.4391 6.46529 10.4934 10.7278 9.21355C10.9773 9.69073 11.205 10.1788 11.4219 10.6669C11.3134 10.6994 11.1941 10.732 11.0857 10.7645C6.68221 12.1853 4.33948 16.0682 4.14425 16.3935C2.7885 14.886 1.95336 12.8795 1.95336 10.6886ZM10.5 19.2244C8.526 19.2244 6.70391 18.5519 5.26139 17.4239C5.41323 17.1094 7.14856 13.7689 11.9642 12.0877C11.9859 12.0769 11.9968 12.0769 12.0184 12.066C13.2223 15.1788 13.7104 17.7927 13.8406 18.541C12.8102 18.9857 11.6822 19.2244 10.5 19.2244ZM15.2614 17.7602C15.1746 17.2395 14.7191 14.745 13.6019 11.6755C16.2809 11.2525 18.6236 11.9467 18.9165 12.0444C18.5478 14.4196 17.1811 16.4695 15.2614 17.7602Z"
                                fill="#787878"
                              />
                            </svg>
                          </div> */}
                        </div>
                        <div className="text-paragraph dark:text-darkParagraph text-left flex-1">
                          {/* <div className="text-heading dark:text-darkHeading flex gap-2 items-center">
                            <p>34টি কোর্স </p>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="2"
                                cy="2.17773"
                                r="2"
                                fill="#D9D9D9"
                              />
                            </svg>
                            <p>159 ঘন্টা</p>
                          </div> */}

                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Expert in NextJS, MERN Stack, Full Stack
                              Development.
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Working as Lead Frontend Developer at WarrantyWorx
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              NASA Space App Challenge 2021 Regional Champion
                              and Global Honorable Mention with Project
                              SolarSpec
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">BUET ME{"'"}19</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="rounded-xl text-center"
                    style={{
                      background:
                        "linear-gradient(#D6BBFB40 0%,  #FFFFFF00 100%)",
                    }}
                  >
                    <div
                      className=" rounded-xl px-6 py-8 pb-20 mx-[1px] dark:bg-[#0B060D]/90 relative top-[1px] h-full"
                      style={{}}
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-10 items-center lg:items-start">
                        <div className="text-center flex-1">
                          <div className="flex justify-center">
                            <img
                              src="/CP instructors/Mehrab Bhai.jpg "
                              alt=""
                              className="rounded-xl w-full lg:w-[250px]"
                            />
                          </div>
                          <p className="mt-6 text-2xl">Md. Mehrab Haque</p>
                          <p className="mt-2 text-xl text-paragraph dark:text-darkParagraph">
                            Developer at CoderVai
                          </p>
                          <p className="my-5 text-paragraph dark:text-darkParagraph">
                            Loves building things
                          </p>
                          {/* <div className="flex justify-center gap-8">
                            <svg
                              width="21"
                              height="17"
                              viewBox="0 0 21 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.7918 16.8028C14.3371 16.8028 18.4652 10.5501 18.4652 5.12941C18.4652 4.95363 18.4613 4.77394 18.4535 4.59816C19.2566 4.01741 19.9496 3.29807 20.5 2.47394C19.7521 2.80669 18.958 3.02401 18.1449 3.11847C19.0011 2.60528 19.6421 1.79908 19.9492 0.849329C19.1438 1.32665 18.263 1.66337 17.3445 1.84503C16.7257 1.18749 15.9075 0.75212 15.0164 0.606232C14.1253 0.460345 13.211 0.612065 12.4148 1.03794C11.6186 1.46381 10.9848 2.14011 10.6115 2.96228C10.2382 3.78445 10.1462 4.7067 10.3496 5.58644C8.71874 5.5046 7.12328 5.08094 5.66665 4.34294C4.21002 3.60493 2.92474 2.56905 1.89414 1.30245C1.37033 2.20556 1.21005 3.27423 1.44586 4.29127C1.68167 5.3083 2.29589 6.1974 3.16367 6.77784C2.51219 6.75716 1.87498 6.58176 1.30469 6.26613V6.31691C1.3041 7.26465 1.63175 8.18335 2.23192 8.91683C2.8321 9.65032 3.66777 10.1533 4.59687 10.3403C3.99338 10.5055 3.35999 10.5295 2.7457 10.4107C3.00788 11.2257 3.51798 11.9386 4.20481 12.4498C4.89164 12.961 5.72093 13.245 6.57695 13.2622C5.12369 14.4038 3.32848 15.023 1.48047 15.02C1.15274 15.0195 0.825333 14.9994 0.5 14.9599C2.37738 16.1643 4.56128 16.804 6.7918 16.8028Z"
                                fill="#787878"
                              />
                            </svg>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_501_15571)">
                                <path
                                  d="M19.0195 0.677734H1.97656C1.16016 0.677734 0.5 1.32227 0.5 2.11914V19.2324C0.5 20.0293 1.16016 20.6777 1.97656 20.6777H19.0195C19.8359 20.6777 20.5 20.0293 20.5 19.2363V2.11914C20.5 1.32227 19.8359 0.677734 19.0195 0.677734ZM6.43359 17.7207H3.46484V8.17383H6.43359V17.7207ZM4.94922 6.87305C3.99609 6.87305 3.22656 6.10352 3.22656 5.1543C3.22656 4.20508 3.99609 3.43555 4.94922 3.43555C5.89844 3.43555 6.66797 4.20508 6.66797 5.1543C6.66797 6.09961 5.89844 6.87305 4.94922 6.87305ZM17.543 17.7207H14.5781V13.0801C14.5781 11.9746 14.5586 10.5488 13.0352 10.5488C11.4922 10.5488 11.2578 11.7559 11.2578 13.002V17.7207H8.29688V8.17383H11.1406V9.47852H11.1797C11.5742 8.72852 12.543 7.93555 13.9844 7.93555C16.9883 7.93555 17.543 9.91211 17.543 12.4824V17.7207Z"
                                  fill="#787878"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_501_15571">
                                  <rect
                                    width="20"
                                    height="20"
                                    fill="white"
                                    transform="translate(0.5 0.677734)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.5 0.677734C4.97939 0.677734 0.5 5.15713 0.5 10.6777C0.5 16.1984 4.97939 20.6777 10.5 20.6777C16.0098 20.6777 20.5 16.1984 20.5 10.6777C20.5 5.15713 16.0098 0.677734 10.5 0.677734ZM17.1052 5.28728C18.2983 6.74064 19.0141 8.5953 19.0358 10.6018C18.7538 10.5476 15.9338 9.97273 13.0922 10.3307C13.0271 10.1897 12.9729 10.0378 12.9078 9.88598C12.7343 9.47386 12.5391 9.05086 12.3438 8.64955C15.4891 7.36973 16.9208 5.52589 17.1052 5.28728ZM10.5 2.15279C12.6692 2.15279 14.654 2.96624 16.1616 4.3003C16.0097 4.51722 14.7191 6.24173 11.6822 7.38055C10.2831 4.81005 8.73213 2.70593 8.4935 2.38055C9.13338 2.22871 9.80587 2.15279 10.5 2.15279ZM6.86662 2.95539C7.09437 3.25908 8.61281 5.37405 10.0336 7.8903C6.0423 8.95323 2.51736 8.93155 2.13774 8.93155C2.69089 6.28511 4.48047 4.08337 6.86662 2.95539ZM1.95336 10.6886C1.95336 10.6018 1.95336 10.515 1.95336 10.4283C2.32213 10.4391 6.46529 10.4934 10.7278 9.21355C10.9773 9.69073 11.205 10.1788 11.4219 10.6669C11.3134 10.6994 11.1941 10.732 11.0857 10.7645C6.68221 12.1853 4.33948 16.0682 4.14425 16.3935C2.7885 14.886 1.95336 12.8795 1.95336 10.6886ZM10.5 19.2244C8.526 19.2244 6.70391 18.5519 5.26139 17.4239C5.41323 17.1094 7.14856 13.7689 11.9642 12.0877C11.9859 12.0769 11.9968 12.0769 12.0184 12.066C13.2223 15.1788 13.7104 17.7927 13.8406 18.541C12.8102 18.9857 11.6822 19.2244 10.5 19.2244ZM15.2614 17.7602C15.1746 17.2395 14.7191 14.745 13.6019 11.6755C16.2809 11.2525 18.6236 11.9467 18.9165 12.0444C18.5478 14.4196 17.1811 16.4695 15.2614 17.7602Z"
                                fill="#787878"
                              />
                            </svg>
                          </div> */}
                        </div>
                        <div className="text-paragraph dark:text-darkParagraph text-left flex-1">
                          {/* <div className="text-heading dark:text-darkHeading flex gap-2 items-center">
                            <p>34টি কোর্স </p>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="2"
                                cy="2.17773"
                                r="2"
                                fill="#D9D9D9"
                              />
                            </svg>
                            <p>159 ঘন্টা</p>
                          </div> */}

                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Expert in ReactJS, DevOps, Full Stack Development,
                              PERN Stack
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              NASA Space App Challenge 2020 Global Winner
                              Honorable Mention with Project Satellight
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Champion (DevOps Category), BUET CSE Fest 2022
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              Top 30 at ideaTHON-2020 with the startup
                              Eco-Transformer
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              NASA EO Dashboard Hackathon-2021 Global Finalist
                              with Project PixelGrow.
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">
                              {" "}
                              Hult-2023 Campus Finalist with project named
                              Garmeta
                            </p>
                          </div>
                          <div className="flex gap-6  my-5">
                            <div>
                              <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="w-[20px] h-[22px]"
                                  d="M17 8.67773L10 1.67773L1 10.6777H3V17.6777C3 18.2082 3.21071 18.7169 3.58579 19.0919C3.96086 19.467 4.46957 19.6777 5 19.6777H12.5M7 19.6777V13.6777C7 13.1473 7.21071 12.6386 7.58579 12.2635C7.96086 11.8884 8.46957 11.6777 9 11.6777H11C11.661 11.6777 12.248 11.9977 12.612 12.4927M17 12.6777L15 16.6777H19L17 20.6777"
                                  stroke="#6A6A6A"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-base">BUET CSE{"'"}18</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimationOnScroll>
        </div>
        <div className="bg-[#ca65fd]/20 dark:bg-[#0B060D] z-30 relative">
          <AnimationOnScroll animateIn="animate__fadeIn" animateOnce>
            <div className="w-[90%] lg:w-[80%] mx-auto  text-heading dark:text-darkHeading py-20 md:py-32">
              <div className="pb-10 border-b border-gray-100/20 flex flex-col items-center">
                <div className="text-center">
                  <img src="/Seo.png" alt="" />
                </div>
                <h2 className="text-2xl md:text-4xl my-6">Founders</h2>
                <p className="text-xl">The Team behind this Initiative</p>
              </div>
              <div className="pt-20">
                <div className="flex flex-col justify-between lgXl:flex-row gap-12">
                  <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8">
                    <div className="flex justify-center">
                      <img
                        className="w-60  lg:w-full"
                        src="/emran_image.png"
                        alt=""
                      />
                    </div>
                    <div>
                      <svg
                        width="57"
                        height="57"
                        viewBox="0 0 57 57"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="28.375"
                          cy="28.2803"
                          r="28.25"
                          fill="#EE4878"
                          fill-opacity="0.15"
                        />
                        <path
                          d="M40.6037 38.8208H31.2103C30.2925 35.7919 29.8336 32.6528 29.8336 29.4036C29.8336 26.0993 30.6704 23.4834 32.3439 21.5559C34.0715 19.5733 36.6088 18.582 39.9558 18.582V23.208C37.2566 23.208 35.907 24.8877 35.907 28.2471V29.8166H40.6037V38.8208ZM26.9185 38.8208H17.5251C16.6073 35.7919 16.1484 32.6528 16.1484 29.4036C16.1484 26.0993 16.9852 23.4834 18.6587 21.5559C20.3863 19.5733 22.9236 18.582 26.2706 18.582V23.208C23.5714 23.208 22.2218 24.8877 22.2218 28.2471V29.8166H26.9185V38.8208Z"
                          fill="#EE4878"
                        />
                      </svg>
                      <p className="text-white text-xl mt-4">
                        Love to Teach, Lead,
                        <br />
                        Organise and Build
                      </p>

                      <p className="text-white font-bold text-2xl mt-10">
                        Emran Mostofa
                      </p>
                      <p className="text-white/40 mt-1">
                        Founder and CEO at CoderVai
                      </p>
                      <div className="flex gap-8 items-center mt-6">
                        <svg
                          width="25"
                          height="25"
                          viewBox="0 0 25 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.913 5.63832C16.3442 4.3208 14.3728 3.57794 12.3247 3.53249C10.2765 3.48704 8.27414 4.14172 6.64843 5.38835C5.02271 6.63498 3.87097 8.39895 3.3835 10.3888C2.89603 12.3786 3.10202 14.4752 3.96742 16.3321C4.83283 18.189 6.30586 19.6951 8.14311 20.6015C9.98035 21.5079 12.0719 21.7603 14.072 21.3172C16.0722 20.874 17.8612 19.7616 19.1436 18.164C20.426 16.5663 21.125 14.579 21.125 12.5303H13.125"
                            stroke="#6A6A6A"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <p className="text-white/40">
                          Founder at Binary School
                        </p>
                      </div>
                      <div className="flex gap-8 items-center mt-3">
                        <svg
                          width="25"
                          height="25"
                          viewBox="0 0 25 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.913 5.63832C16.3442 4.3208 14.3728 3.57794 12.3247 3.53249C10.2765 3.48704 8.27414 4.14172 6.64843 5.38835C5.02271 6.63498 3.87097 8.39895 3.3835 10.3888C2.89603 12.3786 3.10202 14.4752 3.96742 16.3321C4.83283 18.189 6.30586 19.6951 8.14311 20.6015C9.98035 21.5079 12.0719 21.7603 14.072 21.3172C16.0722 20.874 17.8612 19.7616 19.1436 18.164C20.426 16.5663 21.125 14.579 21.125 12.5303H13.125"
                            stroke="#6A6A6A"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <p className="text-white/40">BUET CSE{"'"}15</p>
                      </div>
                      <div className="flex gap-4 mt-10">
                        <a href="" target="_blank">
                          <svg
                            width="21"
                            height="17"
                            viewBox="0 0 21 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.4168 16.6549C13.9621 16.6549 18.0902 10.4022 18.0902 4.98146C18.0902 4.80568 18.0863 4.62599 18.0785 4.45021C18.8816 3.86946 19.5746 3.15012 20.125 2.32599C19.3771 2.65874 18.583 2.87606 17.7699 2.97052C18.6261 2.45733 19.2671 1.65113 19.5742 0.70138C18.7688 1.17871 17.888 1.51542 16.9695 1.69708C16.3507 1.03954 15.5325 0.604171 14.6414 0.458283C13.7503 0.312395 12.836 0.464116 12.0398 0.889988C11.2436 1.31586 10.6098 1.99216 10.2365 2.81433C9.86325 3.63651 9.77119 4.55875 9.97461 5.43849C8.34374 5.35665 6.74828 4.93299 5.29165 4.19499C3.83502 3.45698 2.54974 2.4211 1.51914 1.1545C0.995333 2.05761 0.835047 3.12628 1.07086 4.14332C1.30667 5.16035 1.92089 6.04945 2.78867 6.6299C2.13719 6.60921 1.49998 6.43381 0.929688 6.11818V6.16896C0.929104 7.1167 1.25675 8.0354 1.85692 8.76888C2.4571 9.50237 3.29277 10.0054 4.22187 10.1924C3.61838 10.3575 2.98499 10.3816 2.3707 10.2627C2.63288 11.0778 3.14298 11.7906 3.82981 12.3019C4.51664 12.8131 5.34593 13.0971 6.20195 13.1143C4.74869 14.2558 2.95348 14.875 1.10547 14.8721C0.777739 14.8716 0.450333 14.8515 0.125 14.8119C2.00238 16.0164 4.18628 16.6561 6.4168 16.6549Z"
                              fill="#787878"
                            />
                          </svg>
                        </a>
                        <a href="" target="_blank">
                          <svg
                            width="21"
                            height="21"
                            viewBox="0 0 21 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_1630_2047)">
                              <path
                                d="M18.6445 0.530273H1.60156C0.785156 0.530273 0.125 1.1748 0.125 1.97168V19.085C0.125 19.8818 0.785156 20.5303 1.60156 20.5303H18.6445C19.4609 20.5303 20.125 19.8818 20.125 19.0889V1.97168C20.125 1.1748 19.4609 0.530273 18.6445 0.530273ZM6.05859 17.5732H3.08984V8.02637H6.05859V17.5732ZM4.57422 6.72559C3.62109 6.72559 2.85156 5.95605 2.85156 5.00684C2.85156 4.05762 3.62109 3.28809 4.57422 3.28809C5.52344 3.28809 6.29297 4.05762 6.29297 5.00684C6.29297 5.95215 5.52344 6.72559 4.57422 6.72559ZM17.168 17.5732H14.2031V12.9326C14.2031 11.8271 14.1836 10.4014 12.6602 10.4014C11.1172 10.4014 10.8828 11.6084 10.8828 12.8545V17.5732H7.92188V8.02637H10.7656V9.33105H10.8047C11.1992 8.58105 12.168 7.78809 13.6094 7.78809C16.6133 7.78809 17.168 9.76465 17.168 12.335V17.5732Z"
                                fill="#787878"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_1630_2047">
                                <rect
                                  width="20"
                                  height="20"
                                  fill="white"
                                  transform="translate(0.125 0.530273)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </a>
                        <a href="" target="_blank">
                          <svg
                            width="21"
                            height="21"
                            viewBox="0 0 21 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M10.125 0.530273C4.60439 0.530273 0.125 5.00967 0.125 10.5303C0.125 16.0509 4.60439 20.5303 10.125 20.5303C15.6348 20.5303 20.125 16.0509 20.125 10.5303C20.125 5.00967 15.6348 0.530273 10.125 0.530273ZM16.7302 5.13982C17.9233 6.59318 18.6391 8.44784 18.6608 10.4543C18.3788 10.4001 15.5588 9.82527 12.7172 10.1832C12.6521 10.0422 12.5979 9.89034 12.5328 9.73852C12.3593 9.3264 12.1641 8.9034 11.9688 8.50209C15.1141 7.22227 16.5458 5.37843 16.7302 5.13982ZM10.125 2.00533C12.2942 2.00533 14.279 2.81878 15.7866 4.15284C15.6347 4.36975 14.3441 6.09427 11.3072 7.23309C9.90806 4.66259 8.35713 2.55847 8.1185 2.23309C8.75838 2.08125 9.43087 2.00533 10.125 2.00533ZM6.49162 2.80793C6.71937 3.11162 8.23781 5.22659 9.65863 7.74284C5.6673 8.80577 2.14236 8.78409 1.76274 8.78409C2.31589 6.13765 4.10547 3.93591 6.49162 2.80793ZM1.57836 10.5411C1.57836 10.4543 1.57836 10.3676 1.57836 10.2808C1.94713 10.2916 6.09029 10.3459 10.3528 9.06609C10.6023 9.54327 10.83 10.0313 11.0469 10.5194C10.9384 10.552 10.8191 10.5845 10.7107 10.617C6.30721 12.0378 3.96448 15.9207 3.76925 16.2461C2.4135 14.7385 1.57836 12.732 1.57836 10.5411ZM10.125 19.0769C8.151 19.0769 6.32891 18.4045 4.88639 17.2765C5.03823 16.962 6.77356 13.6214 11.5892 11.9403C11.6109 11.9294 11.6218 11.9294 11.6434 11.9186C12.8473 15.0313 13.3354 17.6452 13.4656 18.3936C12.4352 18.8383 11.3072 19.0769 10.125 19.0769ZM14.8864 17.6127C14.7996 17.0921 14.3441 14.5975 13.2269 11.5281C15.9059 11.1051 18.2486 11.7993 18.5415 11.8969C18.1728 14.2721 16.8061 16.322 14.8864 17.6127Z"
                              fill="#787878"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8">
                    <div className="flex justify-center">
                      <img
                        className="w-60 lg:w-full"
                        src="/apar_image_2.png"
                        alt=""
                      />
                    </div>
                    <div>
                      <svg
                        width="57"
                        height="57"
                        viewBox="0 0 57 57"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="28.375"
                          cy="28.2803"
                          r="28.25"
                          fill="#EE4878"
                          fill-opacity="0.15"
                        />
                        <path
                          d="M40.6037 38.8208H31.2103C30.2925 35.7919 29.8336 32.6528 29.8336 29.4036C29.8336 26.0993 30.6704 23.4834 32.3439 21.5559C34.0715 19.5733 36.6088 18.582 39.9558 18.582V23.208C37.2566 23.208 35.907 24.8877 35.907 28.2471V29.8166H40.6037V38.8208ZM26.9185 38.8208H17.5251C16.6073 35.7919 16.1484 32.6528 16.1484 29.4036C16.1484 26.0993 16.9852 23.4834 18.6587 21.5559C20.3863 19.5733 22.9236 18.582 26.2706 18.582V23.208C23.5714 23.208 22.2218 24.8877 22.2218 28.2471V29.8166H26.9185V38.8208Z"
                          fill="#EE4878"
                        />
                      </svg>
                      <p className="text-white text-xl mt-4">
                        There is no such thing as
                        <br /> bad luck life will push you <br /> where your
                        goodness lies
                      </p>

                      <p className="text-white font-bold text-2xl mt-10">
                        Numeri Sattar Apar
                      </p>
                      <p className="text-white/40 mt-1">
                        Founder and Chairman at CoderVai
                      </p>
                      <div className="flex gap-8 items-center mt-6">
                        <svg
                          width="25"
                          height="25"
                          viewBox="0 0 25 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.913 5.63832C16.3442 4.3208 14.3728 3.57794 12.3247 3.53249C10.2765 3.48704 8.27414 4.14172 6.64843 5.38835C5.02271 6.63498 3.87097 8.39895 3.3835 10.3888C2.89603 12.3786 3.10202 14.4752 3.96742 16.3321C4.83283 18.189 6.30586 19.6951 8.14311 20.6015C9.98035 21.5079 12.0719 21.7603 14.072 21.3172C16.0722 20.874 17.8612 19.7616 19.1436 18.164C20.426 16.5663 21.125 14.579 21.125 12.5303H13.125"
                            stroke="#6A6A6A"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <p className="text-white/40">CEO @ APAR{"'"}S</p>
                      </div>
                      <div className="flex gap-8 items-center mt-3">
                        <svg
                          width="25"
                          height="25"
                          viewBox="0 0 25 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.913 5.63832C16.3442 4.3208 14.3728 3.57794 12.3247 3.53249C10.2765 3.48704 8.27414 4.14172 6.64843 5.38835C5.02271 6.63498 3.87097 8.39895 3.3835 10.3888C2.89603 12.3786 3.10202 14.4752 3.96742 16.3321C4.83283 18.189 6.30586 19.6951 8.14311 20.6015C9.98035 21.5079 12.0719 21.7603 14.072 21.3172C16.0722 20.874 17.8612 19.7616 19.1436 18.164C20.426 16.5663 21.125 14.579 21.125 12.5303H13.125"
                            stroke="#6A6A6A"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <p className="text-white/40">Managing Director ACS</p>
                      </div>
                      <div className="flex gap-8 items-center mt-3">
                        <svg
                          width="25"
                          height="25"
                          viewBox="0 0 25 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.913 5.63832C16.3442 4.3208 14.3728 3.57794 12.3247 3.53249C10.2765 3.48704 8.27414 4.14172 6.64843 5.38835C5.02271 6.63498 3.87097 8.39895 3.3835 10.3888C2.89603 12.3786 3.10202 14.4752 3.96742 16.3321C4.83283 18.189 6.30586 19.6951 8.14311 20.6015C9.98035 21.5079 12.0719 21.7603 14.072 21.3172C16.0722 20.874 17.8612 19.7616 19.1436 18.164C20.426 16.5663 21.125 14.579 21.125 12.5303H13.125"
                            stroke="#6A6A6A"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <p className="text-white/40">BUET CE{"'"}15</p>
                      </div>
                      <div className="flex gap-4 mt-10">
                        <a href="" target="_blank">
                          <svg
                            width="21"
                            height="17"
                            viewBox="0 0 21 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.4168 16.6549C13.9621 16.6549 18.0902 10.4022 18.0902 4.98146C18.0902 4.80568 18.0863 4.62599 18.0785 4.45021C18.8816 3.86946 19.5746 3.15012 20.125 2.32599C19.3771 2.65874 18.583 2.87606 17.7699 2.97052C18.6261 2.45733 19.2671 1.65113 19.5742 0.70138C18.7688 1.17871 17.888 1.51542 16.9695 1.69708C16.3507 1.03954 15.5325 0.604171 14.6414 0.458283C13.7503 0.312395 12.836 0.464116 12.0398 0.889988C11.2436 1.31586 10.6098 1.99216 10.2365 2.81433C9.86325 3.63651 9.77119 4.55875 9.97461 5.43849C8.34374 5.35665 6.74828 4.93299 5.29165 4.19499C3.83502 3.45698 2.54974 2.4211 1.51914 1.1545C0.995333 2.05761 0.835047 3.12628 1.07086 4.14332C1.30667 5.16035 1.92089 6.04945 2.78867 6.6299C2.13719 6.60921 1.49998 6.43381 0.929688 6.11818V6.16896C0.929104 7.1167 1.25675 8.0354 1.85692 8.76888C2.4571 9.50237 3.29277 10.0054 4.22187 10.1924C3.61838 10.3575 2.98499 10.3816 2.3707 10.2627C2.63288 11.0778 3.14298 11.7906 3.82981 12.3019C4.51664 12.8131 5.34593 13.0971 6.20195 13.1143C4.74869 14.2558 2.95348 14.875 1.10547 14.8721C0.777739 14.8716 0.450333 14.8515 0.125 14.8119C2.00238 16.0164 4.18628 16.6561 6.4168 16.6549Z"
                              fill="#787878"
                            />
                          </svg>
                        </a>
                        <a href="" target="_blank">
                          <svg
                            width="21"
                            height="21"
                            viewBox="0 0 21 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_1630_2047)">
                              <path
                                d="M18.6445 0.530273H1.60156C0.785156 0.530273 0.125 1.1748 0.125 1.97168V19.085C0.125 19.8818 0.785156 20.5303 1.60156 20.5303H18.6445C19.4609 20.5303 20.125 19.8818 20.125 19.0889V1.97168C20.125 1.1748 19.4609 0.530273 18.6445 0.530273ZM6.05859 17.5732H3.08984V8.02637H6.05859V17.5732ZM4.57422 6.72559C3.62109 6.72559 2.85156 5.95605 2.85156 5.00684C2.85156 4.05762 3.62109 3.28809 4.57422 3.28809C5.52344 3.28809 6.29297 4.05762 6.29297 5.00684C6.29297 5.95215 5.52344 6.72559 4.57422 6.72559ZM17.168 17.5732H14.2031V12.9326C14.2031 11.8271 14.1836 10.4014 12.6602 10.4014C11.1172 10.4014 10.8828 11.6084 10.8828 12.8545V17.5732H7.92188V8.02637H10.7656V9.33105H10.8047C11.1992 8.58105 12.168 7.78809 13.6094 7.78809C16.6133 7.78809 17.168 9.76465 17.168 12.335V17.5732Z"
                                fill="#787878"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_1630_2047">
                                <rect
                                  width="20"
                                  height="20"
                                  fill="white"
                                  transform="translate(0.125 0.530273)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </a>
                        <a href="" target="_blank">
                          <svg
                            width="21"
                            height="21"
                            viewBox="0 0 21 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M10.125 0.530273C4.60439 0.530273 0.125 5.00967 0.125 10.5303C0.125 16.0509 4.60439 20.5303 10.125 20.5303C15.6348 20.5303 20.125 16.0509 20.125 10.5303C20.125 5.00967 15.6348 0.530273 10.125 0.530273ZM16.7302 5.13982C17.9233 6.59318 18.6391 8.44784 18.6608 10.4543C18.3788 10.4001 15.5588 9.82527 12.7172 10.1832C12.6521 10.0422 12.5979 9.89034 12.5328 9.73852C12.3593 9.3264 12.1641 8.9034 11.9688 8.50209C15.1141 7.22227 16.5458 5.37843 16.7302 5.13982ZM10.125 2.00533C12.2942 2.00533 14.279 2.81878 15.7866 4.15284C15.6347 4.36975 14.3441 6.09427 11.3072 7.23309C9.90806 4.66259 8.35713 2.55847 8.1185 2.23309C8.75838 2.08125 9.43087 2.00533 10.125 2.00533ZM6.49162 2.80793C6.71937 3.11162 8.23781 5.22659 9.65863 7.74284C5.6673 8.80577 2.14236 8.78409 1.76274 8.78409C2.31589 6.13765 4.10547 3.93591 6.49162 2.80793ZM1.57836 10.5411C1.57836 10.4543 1.57836 10.3676 1.57836 10.2808C1.94713 10.2916 6.09029 10.3459 10.3528 9.06609C10.6023 9.54327 10.83 10.0313 11.0469 10.5194C10.9384 10.552 10.8191 10.5845 10.7107 10.617C6.30721 12.0378 3.96448 15.9207 3.76925 16.2461C2.4135 14.7385 1.57836 12.732 1.57836 10.5411ZM10.125 19.0769C8.151 19.0769 6.32891 18.4045 4.88639 17.2765C5.03823 16.962 6.77356 13.6214 11.5892 11.9403C11.6109 11.9294 11.6218 11.9294 11.6434 11.9186C12.8473 15.0313 13.3354 17.6452 13.4656 18.3936C12.4352 18.8383 11.3072 19.0769 10.125 19.0769ZM14.8864 17.6127C14.7996 17.0921 14.3441 14.5975 13.2269 11.5281C15.9059 11.1051 18.2486 11.7993 18.5415 11.8969C18.1728 14.2721 16.8061 16.322 14.8864 17.6127Z"
                              fill="#787878"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimationOnScroll>
        </div>
        <div className="bg-[#ca65fd]/10 dark:bg-[#0B060D] z-30 relative">
          <svg
            width="1311"
            height="953"
            viewBox="0 0 1311 953"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 z-0"
          >
            <g filter="url(#filter0_f_249_7574)">
              <ellipse
                cx="709.691"
                cy="328.77"
                rx="211.288"
                ry="118.953"
                transform="rotate(-10.6934 709.691 328.77)"
                fill="#B153E0"
                fillOpacity="0.48"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_249_7574"
                x="0.884995"
                y="-294.55"
                width="1417.61"
                height="1246.64"
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
                  result="effect1_foregroundBlur_249_7574"
                />
              </filter>
            </defs>
          </svg>

          {/* Top Problem Solvers Section */}
          <AnimationOnScroll animateIn="animate__fadeIn" animateOnce>
            <ProblemSolversSection />
          </AnimationOnScroll>

          <AnimationOnScroll animateIn="animate__fadeIn" animateOnce>
            <div className="w-[90%] lg:w-[80%] mx-auto  text-heading dark:text-darkHeading py-20 md:py-32">
              <div className="flex flex-col items-center gap-8 z-10 relative">
                <img src="/text_bubble.png" alt="" />

                <p className="text-2xl md:text-4xl">
                  সচরাচর জানতে চাও প্রশ্নের উত্তর
                </p>
              </div>
              <div className="mt-8 lg:mt-16">
                <div className="collapse collapse-plus dark:bg-gray-200/5 bg-gray-400/20 border-gray-400/50 backdrop-blur-lg border dark:border-gray-200/20">
                  <input
                    type="radio"
                    name="my-accordion-3"
                    defaultChecked={true}
                  />
                  <div className="collapse-title text-xl font-medium">
                    কোর্সটি কিভাবে চলবে?
                  </div>
                  <div className="collapse-content">
                    <p>
                      আমাদের কোর্সটি তে রেকর্ডেড ভিডিও কন্টেন্ট,কাস্টম কোডিং
                      প্রব্লেম সহ অন্যান্য কন্টেন্ট গুলো নির্দিস্ট সময় পর পর
                      আনলক হবে আর সাথে রেগুলার লাইভ ক্লাস গুলো এনাউন্স করা হবে
                      যেখানে স্টুডেন্টরা সরাসরি জুম লাইভ ক্লাসে এসে ডাউট সহ
                      কনসেপ্ট ক্লিয়ার করে নিয়ে এগিয়ে যাবে সাথে রেগুলার কোডিং
                      কনটেস্ট আয়োজন করা হবে যা
                    </p>
                  </div>
                </div>

                <div className="collapse collapse-plus dark:bg-gray-200/5 bg-gray-400/20 border-gray-400/50 backdrop-blur-lg border dark:border-gray-200/20 mt-6">
                  <input type="radio" name="my-accordion-3" />
                  <div className="collapse-title text-xl font-medium">
                    কোর্সটি কাদের জন্যে ?
                  </div>
                  <div className="collapse-content">
                    <p>
                      যারা কম্পেটিটিভ প্রোগ্রামিং শিখতে আগ্রহী কিন্তু সঠিক
                      গাইডলাইন পাচ্ছে না। কম্পেটিটীভ প্রোগ্রামিং করেছে কিন্তু
                      মাঝপথে দিশেহারা হয়ে ছেড়ে দিয়েছে। যারা কলেজ এ থাকা অবস্থায়
                      প্রোগ্রামিং শিখে এগিয়ে থাকতে চায়। যারা বিশ্ব-বিদ্যালয় এ সি
                      এস ই নিয়ে ভর্তি হয়েছে কিন্তু প্রোগ্রামিং না পারায় পিছিয়ে
                      যাচ্ছে একাডমিক রেজাল্ট খারাপ হচ্ছে । যারা নিজেদের ভবিষ্যতে
                      GOOGLE,FACEBOOK,AMAZOM সহ বিশ্বসেরা ড্রিম কোম্পানি গুলোতে
                      চাকরি পেয়ে চায় তাড়াই আমাদের কোর্সে ভর্তি হতে পারবে
                    </p>
                  </div>
                </div>
                <div className="collapse collapse-plus dark:bg-gray-200/5 bg-gray-400/20 border-gray-400/50 backdrop-blur-lg border dark:border-gray-200/20 mt-6">
                  <input type="radio" name="my-accordion-3" />
                  <div className="collapse-title text-xl font-medium">
                    আমি প্রোগ্রামিং তেমন পারি না আমি কি কোর্স টি করতে পারব ?
                  </div>
                  <div className="collapse-content">
                    <p>
                      আমাদের কোর্সটি এইবার নতুন করে সাজানো হয়েছে যেন একদম শূন্য
                      থেকেও প্রোগ্রামিং শিখে কোর্সটিতে এগিয়ে যাওয়া যায়।C++ এর
                      একদম বেসিক থেকে ধরে এডভ্যান্স প্রব্লেম সলভ করার জন্যে যা
                      যা প্রয়োজন তার সব ই এড করা হয়েছে এই কোর্সে তাই যারা একদমই
                      প্রোগ্রামিং পারে না তারাও আমাদের এই কোর্সটি করতে পারবে
                    </p>
                  </div>
                </div>
                <div className="collapse collapse-plus dark:bg-gray-200/5 bg-gray-400/20 border-gray-400/50 backdrop-blur-lg border dark:border-gray-200/20 mt-6">
                  <input type="radio" name="my-accordion-3" />
                  <div className="collapse-title text-xl font-medium">
                    আমি মোটামুটি প্রোগ্রামিং পারি আর নিয়মিত সিপি করার ট্রাই করি
                    আমার কি এই কোর্সটি করা উচিত?
                  </div>
                  <div className="collapse-content">
                    <p>
                      আমাদের কোর্সে ক্লাস নিবে যারা বুয়েট সি এস ই থেকে পড়ে এখন
                      গুগলে আছে আর কোডফোর্সেস সহ প্রোগ্রামিং এর অলিম্পিকস ACM
                      ICPC তে WORLD FInalist সহ ASIA WEST Champion পর্যন্ত
                      হয়েছে। তারা CP এর কমপ্লেক্স টপিক ডায়নামিক প্রোগ্রামিং সহ
                      গেম থিওরি গুলো বুঝিয়ে দিবে তাই এডভ্যান্স জিনিসপত্র ও
                      শেখানো হবে আমাদের এই কোর্সে তাই যারা CP এর কমপ্লেক্স
                      টপিকগুলো শিখতে চাইলে জয়েন করে ফেলতে পার
                    </p>
                  </div>
                </div>
                <div className="collapse collapse-plus dark:bg-gray-200/5 bg-gray-400/20 border-gray-400/50 backdrop-blur-lg border dark:border-gray-200/20 mt-6">
                  <input type="radio" name="my-accordion-3" />
                  <div className="collapse-title text-xl font-medium">
                    কোর্স চলাকালীন কোন সমস্যায় পড়লে কিভাবে হেল্প পাব?
                  </div>
                  <div className="collapse-content">
                    <p>
                      তোমাদের জন্যে প্রতিটি কন্টেন্ট এর নিচে ডিসকাশন সেকশন থাকবে
                      যেখানে তোমারা ঐ কন্টেন্ট রিলেটেড প্রশ্ন করতে পারবে। সাথে
                      রেগুলার জুম লাইভ ক্লাস নেয়া হবে যেখানে তুমি সরাসরি লাইভে
                      এসে তোমার ডাউট সলভ করে নিতে পারবে আর আমাদের ফেইসবুক
                      কমিউনিটি তো থাকবেই সার্বক্ষনিক ও আজীবন তোমাকে সাপোর্ট দিতে
                      । সো সমস্যা তোমার আর সলভ করার দায়িত্ব আমাদের।
                    </p>
                  </div>
                </div>
                <div className="collapse collapse-plus dark:bg-gray-200/5 bg-gray-400/20 border-gray-400/50 backdrop-blur-lg border dark:border-gray-200/20 mt-6">
                  <input type="radio" name="my-accordion-3" />
                  <div className="collapse-title text-xl font-medium">
                    কোর্সটির কন্টেন্ট গুলো কত দিন এক্সেস থাকবে?
                  </div>
                  <div className="collapse-content">
                    <p>
                      কোর্সটির ডিউরেশন ৪ মাস কিন্তু তোমাদের সবার নিজেদের
                      পারসোনাল কাজ থাকায় আমরা কন্টেন্ট গুলো পুরো ১ বছর তোমাদের
                      প্রোফাইলে এক্সেস দিব তাই তুমি তোমার নিজের রুটিনের সাথে
                      মিলিয়ে কন্টেন্ট গুলো নিজের মত এক্সেস করতে পারবে
                    </p>
                  </div>
                </div>
                <div className="collapse collapse-plus dark:bg-gray-200/5 bg-gray-400/20 border-gray-400/50 backdrop-blur-lg border dark:border-gray-200/20 mt-6">
                  <input type="radio" name="my-accordion-3" />
                  <div className="collapse-title text-xl font-medium">
                    কোর্সটি শেষে কি সার্টিফিকেট দেয়া হবে ?
                  </div>
                  <div className="collapse-content">
                    <p>
                      কোর্সটি তুমি শেষ করতে পারলে তোমাকে কোর্স কমপ্লিশন
                      সার্টিফিকেট দেয়া হবে যা তুমি সবার সাথে শেয়ার করতে পারবে বা
                      নিজের অর্জনের তালিকায় এড করতে পারবে
                    </p>
                  </div>
                </div>
                <div className="collapse collapse-plus dark:bg-gray-200/5 bg-gray-400/20 border-gray-400/50 backdrop-blur-lg border dark:border-gray-200/20 mt-6">
                  <input type="radio" name="my-accordion-3" />
                  <div className="collapse-title text-xl font-medium">
                    কোর্সটি কি রিফান্ড নেয়া যাবে?
                  </div>
                  <div className="collapse-content">
                    <p>
                      না আমাদের কোর্সে কোন রিফান্ড এর ব্যবস্থা নেই তাই বুঝে শুনে
                      কোর্সটি পারচেস করবা টিচার আর সিলেবাস দেখে নিয়ে
                    </p>
                  </div>
                </div>
                <div className="collapse collapse-plus dark:bg-gray-200/5 bg-gray-400/20 border-gray-400/50 backdrop-blur-lg border dark:border-gray-200/20 mt-6">
                  <input type="radio" name="my-accordion-3" />
                  <div className="collapse-title text-xl font-medium">
                    কোর্সটিতে জয়েন করে আমার বন্ধু বান্ধবীদের সাথে শেয়ার করা
                    যাবে?
                  </div>
                  <div className="collapse-content">
                    <p>
                      কোনভাবেই কোর্স বা তোমার আইডি তুমি কারো সাথে শেয়ার করতে
                      পারবে না । করলে আমরা আমাদের এন্ড থেকে থেকে আইডি রিমুভ করে
                      দেয়া হবে সাথে কোর্স এক্সেস ও বন্ধ করে দেয়া হবে আর এক
                      ডিভাইস থেকে অন্য ডিভাইসে লগইন করলে অটোমেটিক তোমাকে আগের
                      ডিভাইস থেকে রিমুভ করে দেয়া হবে
                    </p>
                  </div>
                </div>
                <div className="collapse collapse-plus dark:bg-gray-200/5 bg-gray-400/20 border-gray-400/50 backdrop-blur-lg border dark:border-gray-200/20 mt-6">
                  <input type="radio" name="my-accordion-3" />
                  <div className="collapse-title text-xl font-medium">
                    কোর্সটি করার পর আমি কি করব কিভাবে এগিয়ে যাব ?
                  </div>
                  <div className="collapse-content">
                    <p>
                      তুমি সফলভাবে কোর্সটী কমপ্লিট করতে পারলে প্রব্লেম সলভিং
                      তোমার একটি অভ্যাসে পরিণত হবে। তুমি এর পর কোডফোর্সেস এ
                      নিয়মিত কন্টেস্ট করবে সাথে অন্যান্য প্ল্যাটফর্মেও কন্টেস্ট
                      করার ট্রাই করবে আর নিজের র‍্যাংকিং এগিয়ে নেয়ার ট্রাই করবে
                      এভাবেই এগিয়ে যাবে সাথে কোথাও কোন সমস্যার মুখোমুখি হলে
                      আমাদের কমিউনিটি তে হেল্প চাইবে
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimationOnScroll>
        </div>

        <div className="mt-30">
          <img src="/Group 33531.png" alt="" className="w-[100vw]" />
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
    </main>
  );
}
