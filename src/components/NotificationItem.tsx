import { BACKEND_URL } from "@/api.config";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useLmsPreference } from "@/hooks/useLmsPreference";
import { isLmsPreferenceCourse, getCoursesLmsUrl } from "@/constants/lmsPreference";

type Props = {
  populateFn: (notification: any) => void;
  notification: any;
};

const MONTH_NAMES = [
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

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = MONTH_NAMES[date.getMonth()];
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${day.toString().padStart(2, "")} ${month} ${year},  ${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}${ampm}`;
};

export default function NotificationItem({
  populateFn: populate,
  notification,
}: Props) {
  const router = useRouter();
  const { lmsPreference } = useLmsPreference();
  const [isReadState, setIsReadState] = useState(notification.is_read);
  const [mouseIn, setMouseIn] = useState(false);
  const courseId = notification.course_id != null ? String(notification.course_id) : undefined;
  const chapterId = notification?.data?.moduleData?.chapterId;
  const moduleId = notification?.data?.moduleData?.moduleId;
  const readNotification = (notification: any): void => {
    const token = localStorage.getItem("token");

    axios
      .post(
        `${BACKEND_URL}/user/notification/markAsRead/${notification.id}?courseId=${notification.course_id}`,
        null,
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        },
      )
      .then(() => {
        setIsReadState(true); // on success update state without loading whole page
      });
  };

  useEffect(() => {
    setIsReadState(notification.is_read);
  }, [notification]);

  return (
    <div
      className={`flex items-start justify-between hover:opacity-70 cursor-pointer ${isReadState ? "dark:bg-gray-300/5 bg-gray-400/30" : "dark:bg-gray-300/20 bg-gray-400/80"} ease-in-out duration-150 backdrop-blur-lg rounded-lg my-4`}
      onMouseEnter={() => {
        setMouseIn(true);
      }}
      onMouseLeave={() => {
        setMouseIn(false);
      }}
    >
      <div className={`flex items-center gap-8 p-8`}>
        <svg
          width="20"
          height="23"
          viewBox="0 0 20 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.4673 19.5024C13.2242 21.1987 11.7652 22.5025 10.0016 22.5025C8.23812 22.5025 6.77911 21.1987 6.536 19.5024H13.4673ZM10.0016 0.5C14.6114 0.5 18.3642 4.16899 18.4991 8.74605V9.00124H18.5029L18.5026 13.113L19.9167 16.7573C19.9548 16.8557 19.9806 16.9583 19.9936 17.0627L20.0033 17.2203C20.0033 17.883 19.4996 18.4281 18.8542 18.4937L18.7233 18.5003H1.27644C1.11773 18.5003 0.960407 18.4708 0.812492 18.4133C0.194816 18.173 -0.130655 17.506 0.0422008 16.8807L0.0834777 16.7563L1.49965 13.112L1.50041 9.00124C1.50041 4.30614 5.30654 0.5 10.0016 0.5Z"
            fill={isReadState ? "#B1ACA9" : "#EE6800"}
          />
        </svg>

        <div
          className="w-full"
          onClick={(): void => {
            console.log(notification);
            if (
              notification.type === "ADMIN_SIDE" ||
              notification.type === "ANNOUNCEMENT"
            ) {
              populate(notification);
            } else if (notification.type === "LIVE") {
              const token = localStorage.getItem("token");

              window.location.href =
                "https://live.codervai.com/?id=" +
                notification?.data?.moduleData?.liveId +
                "&token=" +
                token;
            } else if (notification.type === "ASSIGNMENT") {
              if (lmsPreference === "unlocked" && courseId && isLmsPreferenceCourse(courseId) && chapterId != null && moduleId != null) {
                window.location.href = getCoursesLmsUrl(courseId, Number(chapterId), Number(moduleId));
              } else {
                router.push(`/course/${chapterId}/${moduleId}`);
              }
            } else if (notification.type === "THREADS") {
              if (lmsPreference === "unlocked" && courseId && isLmsPreferenceCourse(courseId) && chapterId != null && moduleId != null) {
                window.location.href = getCoursesLmsUrl(courseId, Number(chapterId), Number(moduleId)) + `?discussionId=${notification?.data?.moduleData?.discussionId || ""}`;
              } else {
                router.push(
                  `/course/${chapterId}/${moduleId}?discussionId=${notification?.data?.moduleData?.discussionId}`,
                );
              }
            }

            if (notification.type === "COURSE_UPDATE") {
              if (lmsPreference === "unlocked" && courseId && isLmsPreferenceCourse(courseId) && chapterId != null) {
                window.location.href = getCoursesLmsUrl(courseId, Number(chapterId));
              } else {
                router.push(`/course/${chapterId}/`);
              }
            }
            if (notification.type !== "COURSE_UPDATE") {
              readNotification(notification);
            }
          }}
        >
          <p className="text-heading dark:text-darkHeading text-xl">
            {notification.type === "THREADS"
              ? `${{ 1: "Teacher", 2: "Teacher", 3: "Student" }[parseInt(notification.data.body)]} has replied to your comment`
              : notification?.data?.title}
          </p>

          <p className="text-paragraph dark:text-darkParagraph">
            {/* 21 নভেম্বর 2022 <span className="ml-4"></span>বিকেল
            ৫:৪৫ */}
            {formatTimestamp(notification.timestamp * 1000)}
          </p>
        </div>
      </div>
      {mouseIn && !isReadState && (
        <button
          className="hover:opacity-70 m-8"
          onClick={() => {
            readNotification(notification);
          }}
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
