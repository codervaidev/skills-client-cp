import Nav from "@/components/Nav";
import React, { useState, useContext, useEffect, Fragment } from "react";
import { HindSiliguri } from "@/helpers";
import axios from "axios";
import { BACKEND_URL, COURSE_ID } from "@/api.config";
import { UserContext } from "@/Contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { isLoggedIn } from "@/helpers";
import FloatingCompiler from "@/components/FloatingCompiler";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Footer from "@/components/Footer";
import InfiniteScroll from "react-infinite-scroll-component";
import { PulseLoader, SyncLoader } from "react-spinners";
import { Dialog, Transition } from "@headlessui/react";
import NotificationItem from "@/components/NotificationItem";

type Props = {};
function formatTimestamp(timestamp: any) {
  const date = new Date(timestamp);

  // Get the day, month, year
  const day = date.getDate();
  const year = date.getFullYear();

  // Get the month name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];

  // Get the hours and minutes
  let hours = date.getHours();
  let minutes: any = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Add leading zero to minutes if needed
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Format the date string
  const formattedDate = `${day} ${month} ${year},  ${hours}:${minutes}${ampm}`;

  return formattedDate;
}

export default function NotificationPage({}: Props) {
  const [user, setUser] = useContext<any>(UserContext);
  const [token, setToken] = useState<any>("");
  const [firstCalled, setFirstCalled] = useState(false);
  const [currentPage, setCurrentPage] = useState<any>(0);
  const [notifications, setNotifications] = useState<any>([]);
  const [hasMoreNotifications, setHasMoreNotifications] = useState<any>(true);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationTime, setNotificationTime] = useState("");
  const [notificationBody, setNotificationBody] = useState("");
  const notificationPerpageLimit = 10;

  function populateNotificationDialog(notification: any): void {
    setNotificationTitle(notification.data.title ?? "<N/A>");
    setNotificationTime(formatTimestamp(notification.timestamp * 1000));
    setNotificationBody(notification.data.body ?? "<N/A>");
    setShowNotificationDialog(true);
  }

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const markAllAsRead = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        BACKEND_URL + `/user/notification/markAllAsRead?courseId=${COURSE_ID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        fetchNotifications();
      })
      .catch((err) => {});
  };

  const fetchNotifications = () => {
    const token = localStorage.getItem("token");
    setUser({ ...user, loading: true });

    axios
      .get(
        BACKEND_URL +
          `/user/notification/list?offset=${currentPage}&limit=${notificationPerpageLimit}&courseId=${COURSE_ID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setNotifications(res.data.data);
        if (res.data.data.length < notificationPerpageLimit) {
          setHasMoreNotifications(false);
        }
        setUser({ ...user, loading: false });
        setFirstCalled(true);
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
      });
  };
  const fetchMoreNotifications = () => {
    const token = localStorage.getItem("token");

    axios
      .get(
        BACKEND_URL +
          `/user/notification/list?offset=${currentPage * notificationPerpageLimit}&limit=${notificationPerpageLimit}&courseId=${COURSE_ID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        if (res.data.data.length < notificationPerpageLimit) {
          setHasMoreNotifications(false);
        }
        let tempNotifications = [...notifications, ...res.data.data];
        setNotifications(tempNotifications);

        setUser({ ...user, loading: false });
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
      });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchNotifications();
  }, []);

  useEffect(() => {
    fetchMoreNotifications();
  }, [currentPage]);

  return (
    <ProtectedRoute>
      <div
        className={`  ${HindSiliguri.variable} font-hind   overflow-x-hidden`}
      >
        <Nav></Nav>

        <FloatingCompiler />
        <Transition appear show={showNotificationDialog} as={Fragment}>
          <Dialog
            as="div"
            className="relative "
            style={{ zIndex: 99999 }}
            onClose={() => {}}
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
              <div className="flex min-h-full items-center justify-center text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
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
                          onClick={(): void => {
                            setShowNotificationDialog(false);
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
                      <p className="text-2xl font-bold text-heading dark:text-darkHeading">
                        {notificationTitle}
                      </p>
                      <p className="text-xs text-gray-700 pb-4">
                        {notificationTime}
                      </p>
             
                      <div
                        className="text-paragraph dark:text-darkParagraph text-sm mt-1 font-semibold"
                        dangerouslySetInnerHTML={{ __html: notificationBody }}
                      ></div>
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

        <div className="py-16 bg-white dark:bg-black overflow-x-hidden">
          <div className="w-[90%] lgXl:w-[80%] mx-auto py-12 z-20">
            <div className="min-h-[80vh]">
              <p className="text-heading dark:text-darkHeading text-3xl">
                আপনার নোটিফিকেশানস
              </p>
              <p className="text-paragraph dark:text-darkParagraph mt-2 ">
                এখানে আপনি আপনার সমস্ত নোটিফিকেশানস দেখতে পাবেন
              </p>
              {/* <div className="mt-10">
                <div className="flex items-center  gap-8 hover:opacity-70 ease-in-out duration-150 cursor-pointer dark:bg-gray-300/20 bg-gray-400/80  backdrop-blur-lg  rounded-lg my-4 p-8">
                  <svg
                    width="20"
                    height="23"
                    viewBox="0 0 20 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.4673 19.5024C13.2242 21.1987 11.7652 22.5025 10.0016 22.5025C8.23812 22.5025 6.77911 21.1987 6.536 19.5024H13.4673ZM10.0016 0.5C14.6114 0.5 18.3642 4.16899 18.4991 8.74605V9.00124H18.5029L18.5026 13.113L19.9167 16.7573C19.9548 16.8557 19.9806 16.9583 19.9936 17.0627L20.0033 17.2203C20.0033 17.883 19.4996 18.4281 18.8542 18.4937L18.7233 18.5003H1.27644C1.11773 18.5003 0.960407 18.4708 0.812492 18.4133C0.194816 18.173 -0.130655 17.506 0.0422008 16.8807L0.0834777 16.7563L1.49965 13.112L1.50041 9.00124C1.50041 4.30614 5.30654 0.5 10.0016 0.5Z"
                      fill="#EE6800"
                    />
                  </svg>

                  <div className=" w-full ">
                    <p className="text-heading dark:text-darkHeading text-xl">
                      মুহিদ আপনাকে একটি মন্তব্যে উল্লেখ করেছে!
                    </p>

                    <p className="text-paragraph dark:text-darkParagraph">
                      21 নভেম্বর 2022 <span className="ml-4"></span>বিকেল ৫:৪৫
                    </p>
                  </div>
                </div>
                <div className="flex items-center  gap-8 hover:opacity-70 ease-in-out duration-150 cursor-pointer dark:bg-gray-300/5 bg-gray-400/30  backdrop-blur-lg  rounded-lg my-4 p-8">
                  <svg
                    height={30}
                    width={30}
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
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.94513 1.25H15.0549C16.4225 1.24998 17.5248 1.24996 18.3918 1.36652C19.2919 1.48754 20.0497 1.74643 20.6517 2.34835C21.2536 2.95027 21.5125 3.70814 21.6335 4.60825C21.75 5.47522 21.75 6.57754 21.75 7.94513V16.0549C21.75 17.4225 21.75 18.5248 21.6335 19.3918C21.5125 20.2919 21.2536 21.0497 20.6517 21.6517C20.0497 22.2536 19.2919 22.5125 18.3918 22.6335C17.5248 22.75 16.4225 22.75 15.0549 22.75H8.94513C8.63162 22.75 8.33204 22.75 8.04605 22.7486C8.03082 22.7495 8.01546 22.75 8 22.75C7.98169 22.75 7.96353 22.7493 7.94555 22.7481C7.02806 22.7424 6.25306 22.7202 5.60825 22.6335C4.70814 22.5125 3.95027 22.2536 3.34835 21.6517C2.74643 21.0497 2.48754 20.2919 2.36652 19.3918C2.2704 18.6768 2.25356 17.8018 2.25062 16.75H2C1.58579 16.75 1.25 16.4142 1.25 16C1.25 15.5858 1.58579 15.25 2 15.25H2.25V12.75H2C1.58579 12.75 1.25 12.4142 1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H2.25V8.75H2C1.58579 8.75 1.25 8.41421 1.25 8C1.25 7.58579 1.58579 7.25 2 7.25H2.25062C2.25356 6.19818 2.2704 5.32319 2.36652 4.60825C2.48754 3.70814 2.74643 2.95027 3.34835 2.34835C3.95027 1.74643 4.70814 1.48754 5.60825 1.36652C6.47522 1.24996 7.57754 1.24998 8.94513 1.25ZM3.75 8.75H4C4.41421 8.75 4.75 8.41421 4.75 8C4.75 7.58579 4.41421 7.25 4 7.25H3.75078C3.75398 6.2042 3.77029 5.42437 3.85315 4.80812C3.9518 4.07435 4.13225 3.68577 4.40901 3.40901C4.68577 3.13225 5.07434 2.9518 5.80812 2.85315C6.2098 2.79914 6.68097 2.77341 7.25 2.76115V21.2389C6.68097 21.2266 6.2098 21.2009 5.80812 21.1469C5.07434 21.0482 4.68577 20.8678 4.40901 20.591C4.13225 20.3142 3.9518 19.9257 3.85315 19.1919C3.77029 18.5756 3.75398 17.7958 3.75078 16.75H4C4.41421 16.75 4.75 16.4142 4.75 16C4.75 15.5858 4.41421 15.25 4 15.25H3.75V12.75H4C4.41421 12.75 4.75 12.4142 4.75 12C4.75 11.5858 4.41421 11.25 4 11.25H3.75V8.75ZM8.75 21.25C8.83184 21.25 8.91516 21.25 9 21.25H15C16.4354 21.25 17.4365 21.2484 18.1919 21.1469C18.9257 21.0482 19.3142 20.8678 19.591 20.591C19.8678 20.3142 20.0482 19.9257 20.1469 19.1919C20.2484 18.4365 20.25 17.4354 20.25 16V8C20.25 6.56458 20.2484 5.56347 20.1469 4.80812C20.0482 4.07435 19.8678 3.68577 19.591 3.40901C19.3142 3.13225 18.9257 2.9518 18.1919 2.85315C17.4365 2.75159 16.4354 2.75 15 2.75H9C8.91516 2.75 8.83184 2.75001 8.75 2.75004V21.25ZM10.75 6.5C10.75 6.08579 11.0858 5.75 11.5 5.75H16.5C16.9142 5.75 17.25 6.08579 17.25 6.5C17.25 6.91421 16.9142 7.25 16.5 7.25H11.5C11.0858 7.25 10.75 6.91421 10.75 6.5ZM10.75 10C10.75 9.58579 11.0858 9.25 11.5 9.25H16.5C16.9142 9.25 17.25 9.58579 17.25 10C17.25 10.4142 16.9142 10.75 16.5 10.75H11.5C11.0858 10.75 10.75 10.4142 10.75 10Z"
                        fill={user.darkMode ? "#E2E8F0" : "black"}
                      ></path>{" "}
                    </g>
                  </svg>
                  <div className=" w-full ">
                    <p className="text-heading dark:text-darkHeading text-xl">
                      মুহিদ আপনাকে একটি মন্তব্যে উল্লেখ করেছে!
                    </p>

                    <p className="text-paragraph dark:text-darkParagraph">
                      21 নভেম্বর 2022 <span className="ml-4"></span>বিকেল ৫:৪৫
                    </p>
                  </div>
                </div>
              </div> */}
              <div className="mt-10">
                {notifications.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      className="text-white hover:opacity-70 hover:underline"
                      onClick={markAllAsRead}
                    >
                      Mark All Read
                    </button>
                  </div>
                )}
                {firstCalled && notifications.length === 0 ? (
                  <div className="text-center mt-8">
                    <p className="text-heading dark:text-darkHeading text-xl">
                      You have no notifications
                    </p>
                  </div>
                ) : (
                  <InfiniteScroll
                    dataLength={notifications.length}
                    next={() => {
                      if (firstCalled) {
                        setCurrentPage((prev: any) => prev + 1);
                      }
                    }}
                    hasMore={hasMoreNotifications}
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
                    {notifications.map((notification: any, index: any) => (
                      <NotificationItem
                        key={index}
                        populateFn={populateNotificationDialog} // fn to update parent component
                        notification={notification}
                      />
                    ))}
                    {/* {positions?.map((position: any, index: number) => (
                    <div
                      key={Math.random()}
                      className={`flex justify-between text-heading mb-3 dark:text-darkHeading  py-4 rounded-lg bg-gray-400/20 backdrop-blur-lg  ${
                        index + 1 == myPosition.rank
                          ? "dark:bg-gray-200/20"
                          : "dark:bg-gray-200/5"
                      }`}
                    >
                      <div className="flex-1 flex justify-center">
                        <p>{index + 1}</p>
                      </div>
                      <div className="flex-1 flex justify-center">
                        <p> {position.name}</p>
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
                  ))} */}
                  </InfiniteScroll>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
