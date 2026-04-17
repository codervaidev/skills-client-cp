// it will be replace by new ranking page

import React, { use, useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { PulseLoader, SyncLoader } from "react-spinners";

type Props = {};

import { Toaster, toast } from "react-hot-toast";
import { UserContext } from "@/Contexts/UserContext";
import axios from "axios";
import { BACKEND_URL, COURSE_ID, COURSE_ID_2 } from "@/api.config";
import Nav from "@/components/Nav";
import { HindSiliguri } from "@/helpers";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import FloatingCompiler from "@/components/FloatingCompiler";
import Footer from "@/components/Footer";
import jwtDecode from "jwt-decode";

export default function Ranking({}: Props) {
  const [user, setUser] = useContext<any>(UserContext);
  const [token, setToken] = useState<any>("");
  const [currentPage, setCurrentPage] = useState<any>(0);
  const [firstThree, setFirstThree] = useState<any>([]);
  const [myPosition, setMyposition] = useState<any>({});
  const [positions, setPositions] = useState<any>([]);
  const [firstCalled, setFirstCalled] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(COURSE_ID);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [hasNoRankingData, setHasNoRankingData] = useState(false);
  
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const fetchEnrolledCourses = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    setUser({ ...user, loading: true });
    
    // Get user_id from token - not needed for request body but kept for reference
    const decoded = jwtDecode<any>(token);
    const userId = decoded.id;
    
    console.log("Fetching enrolled courses for user ID:", userId);
    
    axios
      .get(BACKEND_URL + "/user/course/getEnrolledCoursesByUserId", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Get all courses from API response
        const allCourses = res.data.data || [];
        console.log("All enrolled courses:", allCourses);
        
        // Use all courses without filtering
        setEnrolledCourses(allCourses);
        
        // Set default selection to the first course in the list if available
        if (allCourses.length > 0) {
          console.log("Setting selected course to:", allCourses[0].id);
          setSelectedCourseId(allCourses[0].id.toString());
        } else {
          console.log("No courses found - defaulting to COURSE_ID:", COURSE_ID);
          setSelectedCourseId(COURSE_ID);
          
          // Show toast message if no courses are found
          toast.error("আপনি কোন কোর্সে অন্তর্ভুক্ত হননি। দয়া করে প্রয়োজনীয় কোর্সে অন্তর্ভুক্ত হোন।", {
            duration: 5000,
          });
        }
        
        console.log("Selected course ID set to:", selectedCourseId);
        
        setUser({ ...user, loading: false });
      })
      .catch((err) => {
        console.error("Error fetching enrolled courses:", err);
        setUser({ ...user, loading: false });
        
        // Show error message
        toast.error("কোর্স তথ্য লোড করা যায়নি। দয়া করে আবার চেষ্টা করুন।", {
          duration: 3000,
        });
      });
  };

  const fetchRanking = () => {
    const token = localStorage.getItem("token");
    setUser({ ...user, loading: true });
    setPositions([]);
    setCurrentPage(0);
    setHasNoRankingData(false);
    
    axios
      .get(
        BACKEND_URL +
          `/user/course/getRanking/${selectedCourseId}?offset=${currentPage}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        // Check if the response has empty data
        if (!res.data.data.allPositions.length && 
            !res.data.data.top3Positions.length && 
            Object.keys(res.data.data.myData).length === 0) {
          setHasNoRankingData(true);
          setUser({ ...user, loading: false });
          return;
        }
        
        const tempPositions = [...positions, ...res.data.data.allPositions];

        const sortedData = tempPositions.sort((a, b) => {
          // Parse the rank values as numbers for proper comparison
          const rankA = parseInt(a.rank, 10);
          const rankB = parseInt(b.rank, 10);

          // Sort by rank in ascending order
          if (rankA < rankB) return -1;
          if (rankA > rankB) return 1;
          return 0; // If ranks are equal, maintain original order
        });
        setPositions(sortedData);

        setFirstThree(res.data.data.top3Positions);
        setMyposition(res.data.data.myData);

        setUser({ ...user, loading: false });
        setFirstCalled(true);
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
        toast.error("র‍্যাঙ্কিং ডাটা লোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।", {
          duration: 3000,
        });
      });
  };
  
  const fetchMoreRanking = () => {
    if (hasNoRankingData) return;
    
    const token = localStorage.getItem("token");

    axios
      .get(
        BACKEND_URL +
          `/user/course/getRanking/${selectedCourseId}?offset=${currentPage * 10}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        // If there are no more positions to load
        if (!res.data.data.allPositions.length) {
          return;
        }
        
        const tempPositions = [...positions, ...res.data.data.allPositions];
        const sortedData = tempPositions.sort((a, b) => {
          // Parse the rank values as numbers for proper comparison
          const rankA = parseInt(a.rank, 10);
          const rankB = parseInt(b.rank, 10);

          // Sort by rank in ascending order
          if (rankA < rankB) return -1;
          if (rankA > rankB) return 1;
          return 0; // If ranks are equal, maintain original order
        });
        setPositions(sortedData);

        setUser({ ...user, loading: false });
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
      });
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEnrolledCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchRanking();
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (currentPage > 0) {
      fetchMoreRanking();
    }
  }, [currentPage]);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage(0);
    setPositions([]);
    setFirstCalled(false);
  };

  useEffect(() => {
    console.log("Selected course ID changed to:", selectedCourseId);
  }, [selectedCourseId]);

  // Check if we have top 3 positions data to display
  const hasTop3Data = firstThree && firstThree.length > 0;

  return (
    <ProtectedRoute>
      <div
        className={`  ${HindSiliguri.variable} font-hind   overflow-x-hidden `}
      >
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
        <div className="py-16 bg-white dark:bg-[#000] overflow-x-hidden">
          <div className="w-[90%] lgXl:w-[80%] mx-auto py-12 z-20 min-h-[80vh]">
            <div className="flex justify-between items-center mb-7">
              <p className="text-3xl font-semibold text-heading dark:text-darkHeading">
                কোডার ভাই কোর্স র‍্যাংকিং 
              </p>
              {enrolledCourses.length > 1 && (
                <div className="flex items-center gap-2">
                  <label className="text-heading dark:text-darkHeading">কোর্স নির্বাচন করুন:</label>
                  <select 
                    className="bg-gray-400/20 dark:bg-gray-200/5 text-heading dark:text-darkHeading p-2 rounded-lg"
                    value={selectedCourseId}
                    onChange={(e) => handleCourseChange(e.target.value)}
                  >
                    {enrolledCourses.map((course: any) => (
                      <option key={course.id} value={course.id.toString()}>
                        {course.title || `কোর্স ${course.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* No ranking data message */}
            {hasNoRankingData && (
              <div className="text-center py-12">
                <div className="flex flex-col items-center justify-center gap-4">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#B153E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15848 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="#B153E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 17H12.01" stroke="#B153E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-xl font-semibold text-heading dark:text-darkHeading">
                    এই কোর্সের জন্য কোনো র‍্যাঙ্কিং ডাটা পাওয়া যায়নি
                  </p>
                  <p className="text-heading dark:text-darkHeading">
                    আপনি যখন অ্যাসাইনমেন্ট, কোডিং চ্যালেঞ্জ ও কুইজ সম্পন্ন করবেন, তখন র‍্যাঙ্কিং তৈরি হবে।
                  </p>
                </div>
              </div>
            )}

            {!hasNoRankingData && (
              <>
                {/* Top 3 positions display */}
                <div className="flex flex-col lg:flex-row justify-between gap-8 items-end">
                  <div
                    className="flex flex-col gap-1 py-2 items-center border border-gray-300/20 w-full rounded-lg text-white"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(225, 225, 221, 0.5), rgba(60, 55, 55, 1))",
                    }}
                  >
                    <svg
                      width="20"
                      height="24"
                      viewBox="0 0 20 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.7527 9.8076V6.3284C15.7527 6.1828 15.6623 6.0604 15.5345 5.9844L20 0H11.4382L10 1.8984L8.56182 0H0L4.46455 5.984C4.33682 6.06 4.24636 6.1828 4.24636 6.3284V9.8076C2.20955 11.2748 0.909091 13.5032 0.909091 16C0.909091 20.418 4.97955 24 10 24C10.31 24 10.6155 23.986 10.9173 23.9592C15.5068 23.5548 19.0909 20.146 19.0909 16C19.0909 13.5032 17.7895 11.2748 15.7527 9.8076ZM14.0118 0.4H16.8882L12.8764 5.6956L11.4382 3.7972L14.0118 0.4ZM14.3145 7.594L14.7568 7.0108C14.7809 7.0608 14.7941 7.1152 14.7941 7.1724V8.86C14.7937 8.9122 14.7815 8.96381 14.7584 9.01186C14.7352 9.05991 14.7015 9.10346 14.6591 9.14C13.2955 8.4208 11.7055 8 10 8C8.35774 8.00024 6.74663 8.39451 5.34 9.1404C5.25475 9.06625 5.20623 8.96547 5.205 8.86V7.1724C5.205 7.1152 5.21909 7.0604 5.24227 7.0108L5.68455 7.5944L14.3145 7.594ZM3.11182 0.4H5.98818L11.1355 7.194H8.25909L3.11182 0.4ZM10 22.8C5.73227 22.8 2.27273 19.7556 2.27273 16C2.27273 12.2448 5.73227 9.2 10 9.2C14.2668 9.2 17.7273 12.2448 17.7273 16C17.7273 19.7556 14.2668 22.8 10 22.8Z"
                        fill="#E1E1DD"
                      />
                      <path
                        d="M10.1088 9.81836C6.16974 9.81836 2.97656 12.6328 2.97656 16.1056C2.97656 17.1416 3.26611 18.1156 3.76929 18.9768C3.50752 18.2755 3.37389 17.5421 3.37338 16.804C3.37338 13.1228 6.60474 10.114 10.7038 9.84516C10.506 9.82895 10.3075 9.82001 10.1088 9.81836ZM12.9711 21.2556C12.2747 21.6662 11.5097 21.9788 10.7038 22.182C11.8294 22.06 12.9066 21.7068 13.8484 21.1508C17.1225 19.214 18.0111 15.3508 15.8334 12.5204C15.7225 12.3764 15.6025 12.2412 15.4802 12.108C17.4925 15.2024 16.4425 19.2024 12.9711 21.2556Z"
                        fill="#E1E1DD"
                      />
                      <path
                        d="M12.9326 18.882H8.7944V17.972C8.79452 17.6501 8.93984 17.3415 9.19844 17.1138C9.45703 16.8862 9.80773 16.7582 10.1735 16.758C10.5358 16.7581 10.8945 16.6954 11.2292 16.5735C11.5639 16.4515 11.8681 16.2728 12.1243 16.0474C12.3804 15.822 12.5836 15.5543 12.7223 15.2598C12.8609 14.9653 12.9322 14.6496 12.9321 14.3308C12.9321 13.148 12.2503 11.5996 9.82895 11.5996C8.21577 11.5996 7.07031 12.6776 7.07031 14.3308H8.7944C8.7944 13.7064 9.3294 13.13 10.0226 13.13C10.848 13.13 11.208 13.608 11.208 14.0276C11.2079 14.3494 11.0626 14.658 10.804 14.8855C10.5453 15.113 10.1946 15.2408 9.82895 15.2408C9.46664 15.2408 9.10788 15.3036 8.77316 15.4256C8.43844 15.5477 8.13431 15.7265 7.87814 15.952C7.62197 16.1774 7.41878 16.4451 7.28017 16.7397C7.14156 17.0343 7.07025 17.35 7.07031 17.6688V20.3992H12.9321L12.9326 18.882Z"
                        fill="#E1E1DD"
                      />
                    </svg>
                    <svg
                      width="100"
                      height="100"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="49.5"
                        fill="#474747"
                        stroke="#3B3636"
                      />
                      <path
                        d="M49.9987 44.6673C55.8897 44.6673 60.6654 39.8917 60.6654 34.0007C60.6654 28.1096 55.8897 23.334 49.9987 23.334C44.1077 23.334 39.332 28.1096 39.332 34.0007C39.332 39.8917 44.1077 44.6673 49.9987 44.6673Z"
                        fill="url(#paint0_linear_3129_2867)"
                      />
                      <path
                        d="M71.3346 64.666C71.3346 71.2927 71.3346 76.666 50.0013 76.666C28.668 76.666 28.668 71.2927 28.668 64.666C28.668 58.0393 38.22 52.666 50.0013 52.666C61.7826 52.666 71.3346 58.0393 71.3346 64.666Z"
                        fill="url(#paint1_linear_3129_2867)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_3129_2867"
                          x1="49.9987"
                          y1="23.334"
                          x2="49.9987"
                          y2="44.6673"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FBC63B" />
                          <stop offset="0.0001" stop-color="#E1E1DD" />
                          <stop offset="1" stop-color="#3C3737" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_3129_2867"
                          x1="50.0013"
                          y1="52.666"
                          x2="50.0013"
                          y2="76.666"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FBC63B" />
                          <stop offset="0.0001" stop-color="#E1E1DD" />
                          <stop offset="1" stop-color="#3C3737" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <p className="text-lg font-bold">
                      {hasTop3Data && firstThree[1]?.name || "তথ্য অনুপলব্ধ"}
                    </p>
                    <p className="text-lg font-bold">
                      {hasTop3Data && firstThree[1]?.score || "-"}
                    </p>
                  </div>
                  <div
                    className="flex flex-col gap-1 py-6 items-center border border-gray-300/20 w-full bg-[#FFC700]/40 rounded-lg text-white"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(251, 198, 59, 0.8), rgba(254, 166, 14, 0.8))",
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 1H14.5L12.5 6.15C13.5872 6.37257 14.6115 6.83327 15.4994 7.49896C16.3873 8.16465 17.1166 9.0188 17.635 10L21 1ZM7.5 1H1L4.365 10C4.88338 9.0188 5.61273 8.16465 6.50061 7.49896C7.38849 6.83327 8.41283 6.37257 9.5 6.15L7.5 1Z"
                        stroke="#FFC700"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M18.5 13.5C18.5 17.642 15.142 21 11 21C6.858 21 3.5 17.642 3.5 13.5C3.5 12.236 3.8125 11.045 4.365 10C4.88338 9.0188 5.61273 8.16465 6.50061 7.49896C7.38849 6.83327 8.41283 6.37257 9.5 6.15C9.985 6.0515 10.4865 6 11 6C11.5135 6 12.015 6.0515 12.5 6.15C13.5872 6.37257 14.6115 6.83327 15.4994 7.49896C16.3873 8.16465 17.1166 9.0188 17.635 10C18.2049 11.0785 18.5019 12.2802 18.5 13.5Z"
                        stroke="#FFC700"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11 16.5V10L9.5 10.5M11 16.5H13M11 16.5H9"
                        stroke="#FFC700"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <svg
                      width="100"
                      height="100"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="49.5"
                        fill="#CEA713"
                        stroke="#F9CA1D"
                      />
                      <path
                        d="M49.9987 44.6673C55.8897 44.6673 60.6654 39.8917 60.6654 34.0007C60.6654 28.1096 55.8897 23.334 49.9987 23.334C44.1077 23.334 39.332 28.1096 39.332 34.0007C39.332 39.8917 44.1077 44.6673 49.9987 44.6673Z"
                        fill="url(#paint0_linear_3129_2859)"
                      />
                      <path
                        d="M71.3346 64.666C71.3346 71.2927 71.3346 76.666 50.0013 76.666C28.668 76.666 28.668 71.2927 28.668 64.666C28.668 58.0393 38.22 52.666 50.0013 52.666C61.7826 52.666 71.3346 58.0393 71.3346 64.666Z"
                        fill="url(#paint1_linear_3129_2859)"
                      />
                      <defs>
                      <linearGradient
                          id="paint0_linear_3129_2859"
                          x1="49.9987"
                          y1="23.334"
                          x2="49.9987"
                          y2="44.6673"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FBC63B" />
                          <stop offset="1" stop-color="#FEA60E" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_3129_2859"
                          x1="50.0013"
                          y1="52.666"
                          x2="50.0013"
                          y2="76.666"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FBC63B" />
                          <stop offset="1" stop-color="#FEA60E" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <p className="text-lg font-bold">
                      {hasTop3Data && firstThree[0]?.name || "তথ্য অনুপলব্ধ"}
                    </p>
                    <p className="text-lg font-bold">
                      {hasTop3Data && firstThree[0]?.score || "-"}
                    </p>
                  </div>

                  <div
                    className="flex flex-col gap-1 py-2 items-center border border-gray-300/20 w-full rounded-lg text-white"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(255, 147, 112, 0.5), rgba(204, 112, 82, 0.5))",
                    }}
                  >
                    <svg
                      width="20"
                      height="24"
                      viewBox="0 0 20 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.7128 0L11.332 6.75971H13.9986L19.9984 0H16.7128Z"
                        fill="#428BC1"
                      />
                      <path
                        d="M14.0011 0L8.66797 6.75971H11.3346L16.7153 0H14.0011Z"
                        fill="#E8E8E8"
                      />
                      <path
                        d="M11.3332 0L6 6.75971H8.66658L13.9997 0H11.3332Z"
                        fill="#ED4C5C"
                      />
                      <path
                        d="M10.0006 24.0008C15.4181 24.0008 19.8098 20.3118 19.8098 15.7611C19.8098 11.2105 15.4181 7.52148 10.0006 7.52148C4.58314 7.52148 0.191406 11.2105 0.191406 15.7611C0.191406 20.3118 4.58314 24.0008 10.0006 24.0008Z"
                        fill="#D3976E"
                      />
                      <path
                        d="M5.09262 5.24023C4.85453 5.24023 4.66406 5.40023 4.66406 5.60022V8.96007C4.66406 9.16006 4.85453 9.32006 5.09262 9.32006H14.9018C15.1399 9.32006 15.3304 9.16006 15.3304 8.96007V5.60022C15.3304 5.40023 15.1399 5.24023 14.9018 5.24023H5.09262ZM14.4733 7.88012C14.4733 8.08011 14.2828 8.2401 14.0447 8.2401H5.99735C5.75927 8.2401 5.5688 8.08011 5.5688 7.88012V6.36019C5.5688 6.16019 5.75927 6.0002 5.99735 6.0002H14.0447C14.2828 6.0002 14.4733 6.16019 14.4733 6.36019V7.88012Z"
                        fill="#D3976E"
                      />
                      <path
                        opacity="0.5"
                        d="M1.56993 16.7199C1.56993 12.2401 5.66504 8.60022 10.903 8.28023C10.6649 8.28023 10.3792 8.24023 10.1411 8.24023C5.14124 8.24023 1.09375 11.6401 1.09375 15.8799C1.09375 17.1198 1.47469 18.3198 2.09372 19.3598C1.7604 18.5198 1.56993 17.6398 1.56993 16.7199Z"
                        fill="#3E4347"
                      />
                      <path
                        opacity="0.33"
                        d="M13.7562 22.1186C18.1847 19.6387 19.518 14.7989 16.9466 11.0391L17.3752 11.519C20.137 14.9589 18.9942 19.6387 14.8514 21.9986C13.6134 22.7186 12.2325 23.1185 10.8516 23.2385C11.8991 22.9985 12.8515 22.6386 13.7562 22.1186Z"
                        fill="white"
                      />
                      <path
                        d="M5.99981 6.75971H8.66639L3.28561 0H0L5.99981 6.75971Z"
                        fill="#ED4C5C"
                      />
                      <path
                        d="M8.66985 6.75971H11.3364L6.00326 0H3.28906L8.66985 6.75971Z"
                        fill="#E8E8E8"
                      />
                      <path
                        opacity="0.5"
                        d="M10.427 1.12109L9.09375 2.80102L12.2365 6.76085H13.9984L14.4745 6.20087L10.427 1.12109Z"
                        fill="#3E4347"
                      />
                      <path
                        d="M11.3332 6.75971H13.9997L8.66658 0H6L11.3332 6.75971Z"
                        fill="#428BC1"
                      />
                      <path
                        opacity="0.5"
                        d="M9.76385 11.7994C8.76388 11.7994 7.95439 12.4793 7.95439 13.2793H6.66871C6.66871 13.3993 6.62109 13.5193 6.62109 13.6393H8.43056C8.43056 12.7993 9.24006 12.1193 10.24 12.1193C10.621 12.1193 10.9543 12.2393 11.24 12.3993C10.9067 12.0793 10.3829 11.7994 9.76385 11.7994ZM12.5733 15.9192C13.3352 15.3592 13.8113 14.5592 13.8113 13.6793C13.8113 12.7593 13.3352 11.9194 12.5257 11.3594C13.0495 11.8794 13.3828 12.5593 13.3828 13.2793C13.3828 14.1593 12.9066 14.9992 12.1447 15.5192C12.9066 16.0792 13.3828 16.8791 13.3828 17.7591C13.3828 19.399 11.7638 20.759 9.81147 20.759C8.95435 20.759 8.14485 20.479 7.52583 20.039C8.19247 20.679 9.14482 21.1189 10.2876 21.1189C12.24 21.1189 13.859 19.759 13.859 18.1191C13.8113 17.2791 13.3352 16.4792 12.5733 15.9192Z"
                        fill="#3E4347"
                      />
                      <path
                        opacity="0.33"
                        d="M10.2428 10.6783C11.0999 10.6783 11.9094 10.9583 12.5284 11.3983C11.8618 10.7583 10.9094 10.3184 9.76663 10.3184C7.81431 10.3184 6.19531 11.6783 6.19531 13.3182H6.67149C6.90958 11.8383 8.38572 10.6783 10.2428 10.6783ZM12.0047 13.6782C12.0047 13.1582 11.7189 12.7183 11.2428 12.4383C11.4332 12.6783 11.5761 12.9582 11.5761 13.2782C11.5761 14.1182 10.7666 14.7982 9.76663 14.7982V16.3181C9.90948 16.3181 10.0523 16.3581 10.1952 16.3581V15.1981C11.1952 15.1981 12.0047 14.5182 12.0047 13.6782ZM10.2428 19.678C11.2428 19.678 12.0523 18.998 12.0523 18.158C12.0523 17.638 11.7666 17.1981 11.2904 16.9181C11.4809 17.1581 11.6237 17.4381 11.6237 17.758C11.6237 18.598 10.8142 19.278 9.81425 19.278C9.43331 19.278 9.09998 19.158 8.81428 18.998C9.09998 19.438 9.62378 19.678 10.2428 19.678ZM8.0524 18.198C8.00478 18.078 8.00478 17.958 8.00478 17.838H6.19531C6.19531 18.758 6.67149 19.598 7.48099 20.1579C6.95719 19.638 6.62387 18.958 6.62387 18.238L8.0524 18.198Z"
                        fill="white"
                      />
                    </svg>

                    <svg
                      width="100"
                      height="100"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="49.5"
                        fill="url(#paint0_linear_3129_2892)"
                        fill-opacity="0.5"
                        stroke="#683A2A"
                      />
                      <path
                        d="M49.9987 44.6673C55.8897 44.6673 60.6654 39.8917 60.6654 34.0007C60.6654 28.1096 55.8897 23.334 49.9987 23.334C44.1077 23.334 39.332 28.1096 39.332 34.0007C39.332 39.8917 44.1077 44.6673 49.9987 44.6673Z"
                        fill="url(#paint1_linear_3129_2892)"
                      />
                      <path
                        d="M71.3346 64.666C71.3346 71.2927 71.3346 76.666 50.0013 76.666C28.668 76.666 28.668 71.2927 28.668 64.666C28.668 58.0393 38.22 52.666 50.0013 52.666C61.7826 52.666 71.3346 58.0393 71.3346 64.666Z"
                        fill="url(#paint2_linear_3129_2892)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_3129_2892"
                          x1="-1.39698e-07"
                          y1="50.0003"
                          x2="100"
                          y2="50.0003"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FF9370" />
                          <stop offset="1" stop-color="#CC7052" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_3129_2892"
                          x1="49.9987"
                          y1="23.334"
                          x2="49.9987"
                          y2="44.6673"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.0001" stop-color="#80523E" />
                          <stop offset="1" stop-color="#693B2C" />
                        </linearGradient>
                        <linearGradient
                          id="paint2_linear_3129_2892"
                          x1="50.0013"
                          y1="52.666"
                          x2="50.0013"
                          y2="76.666"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.0001" stop-color="#80523E" />
                          <stop offset="1" stop-color="#693B2C" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <p className="text-lg font-bold">
                      {hasTop3Data && firstThree[2]?.name || "তথ্য অনুপলব্ধ"}
                    </p>
                    <p className="text-lg font-bold">
                      {hasTop3Data && firstThree[2]?.score || "-"}
                    </p>
                  </div>
                </div>

                {/* My Position section - only show if myPosition has data */}
                {Object.keys(myPosition).length > 0 ? (
                  <>
                    <div className="overflow-x-scroll my-10 scrollbar-hide">
                      <div className="min-w-[700px]">
                        <div className="flex justify-between items-center py-4 text-heading dark:text-darkHeading rounded-lg bg-gray-400/20 backdrop-blur-lg dark:bg-gray-200/5">
                          <div className="flex-1 flex justify-center">
                            <p>Rank</p>
                          </div>
                          <div className="flex-1 flex justify-center">
                            <p>Name</p>
                          </div>
                          <div className="flex-1 flex justify-center">
                            <p>Score</p>
                          </div>
                          <div className="flex-1 flex justify-center">
                            <p>Codeforces Account</p>
                          </div>
                        </div>
                        <div className="my-4 bg-gray-300/30 h-[1px]"></div>
                        <div
                          key={Math.random()}
                          className="flex justify-between text-heading mb-3 dark:text-darkHeading py-4 rounded-lg bg-gray-400/20 backdrop-blur-lg dark:bg-gray-200/20"
                        >
                          <div className="flex-1 flex justify-center">
                            <p>{myPosition.rank}</p>
                          </div>
                          <div className="flex-1 flex justify-center">
                            <p>{myPosition.name}</p>
                          </div>
                          <div className="flex-1 flex justify-center">
                            <p>{myPosition.score}</p>
                          </div>
                          <div className="flex-1 flex justify-center">
                            <a
                              target="_blank"
                              className="underline"
                              href={`https://codeforces.com/profile/${myPosition.cf_handle}`}
                            >
                              {myPosition.cf_handle}
                            </a>
                          </div>
                        </div>
                        <div className="my-4 bg-gray-300/30 h-[1px]"></div>

                        {/* All positions */}
                        {positions.length > 0 ? (
                          <InfiniteScroll
                            dataLength={positions.length}
                            next={() => {
                              if (firstCalled) {
                                setCurrentPage((prev: any) => prev + 1);
                              }
                            }}
                            hasMore={true}
                            loader={
                              <div className="text-center mt-8">
                                <SyncLoader
                                  color={"#B153E0"}
                                  loading={true}
                                  size={6}
                                  aria-label="Loading Spinner"
                                  data-testid="loader"
                                />
                              </div>
                            }
                          >
                            {positions.map((position: any, index: number) => (
                              <div
                                key={Math.random()}
                                className={`flex justify-between text-heading mb-3 dark:text-darkHeading py-4 rounded-lg bg-gray-400/20 backdrop-blur-lg ${
                                  index + 1 == myPosition.rank
                                    ? "dark:bg-gray-200/20"
                                    : "dark:bg-gray-200/5"
                                }`}
                              >
                                <div className="flex-1 flex justify-center">
                                  <p>{index + 1}</p>
                                </div>
                                <div className="flex-1 flex justify-center">
                                  <p>{position.name}</p>
                                </div>
                                <div className="flex-1 flex justify-center">
                                  <p>{position.score}</p>
                                </div>
                                <div className="flex-1 flex justify-center">
                                  <a
                                    target="_blank"
                                    className="underline"
                                    href={`https://codeforces.com/profile/${position.cf_handle}`}
                                  >
                                    {position.cf_handle}
                                  </a>
                                </div>
                              </div>
                            ))}
                          </InfiniteScroll>
                        ) : (
                          <div className="text-center py-8 text-heading dark:text-darkHeading">
                            <p>অন্য কোন অংশগ্রহণকারীর ডাটা পাওয়া যায়নি</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-heading dark:text-darkHeading">
                    <p className="text-lg mt-4">
                      আপনার র‍্যাঙ্কিং ডাটা পাওয়া যায়নি। কুইজ, অ্যাসাইনমেন্ট এবং কোডিং চ্যালেঞ্জগুলি সম্পন্ন করুন।
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
