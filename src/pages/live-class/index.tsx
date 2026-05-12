import Nav from "@/components/Nav";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { HindSiliguri, convertUnixTimestamp } from "@/helpers";
import axios from "axios";
import { UserContext } from "@/Contexts/UserContext";
import { BACKEND_URL, COURSE_ID, COURSE_ID_2 } from "@/api.config";
import FloatingCompiler from "@/components/FloatingCompiler";
import Footer from "@/components/Footer";
import jwtDecode from "jwt-decode";
import VideoPlayer, { getTrustedVideoUrl } from "@/components/VideoPlayer";

type LiveClassItem = {
  id: number;
  title?: string;
  description?: string;
  thumbnail?: string;
  instructor_name?: string;
  scheduled_at: number;
  duration?: string;
  interested?: boolean;
  data?: {
    recordedMeetingLink?: string;
  };
};

const CountdownTimer = ({ targetTimestamp }: { targetTimestamp: number }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetTimestamp * 1000 - Date.now();
      if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    setTimeLeft(calculateTimeLeft());
    return () => clearInterval(timer);
  }, [targetTimestamp]);

  return (
    <div className="mt-3 grid grid-cols-4 gap-2 text-center">
      {Object.entries(timeLeft).map(([key, value]) => (
        <div key={key} className="rounded-lg bg-gray-200/10 py-2">
          <p className="text-base font-semibold text-heading dark:text-darkHeading">{value}</p>
          <p className="text-xs text-paragraph dark:text-darkParagraph uppercase">{key}</p>
        </div>
      ))}
    </div>
  );
};

const getDurationInMinutes = (duration: any) => {
  if (!duration) return 60;
  if (typeof duration === "number") return duration;
  const match = String(duration).match(/(\d+(?:\.\d+)?)\s*Hour/i);
  if (match?.[1]) return parseFloat(match[1]) * 60;
  return parseInt(duration, 10) || 60;
};

const urlRegex = /(https?:\/\/[^\s<]+)/g;

const linkifyText = (text: string) =>
  text.replace(
    urlRegex,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-purple-600 underline break-all hover:opacity-80">${url}</a>`,
  );

const renderRichDescription = (content: string) =>
  content
    .split(/(<[^>]+>)/g)
    .map((part) => (part.startsWith("<") ? part : linkifyText(part)))
    .join("");

export default function LiveClass() {
  const [user, setUser] = useContext<any>(UserContext);
  const [liveClasses, setLiveClasses] = useState<{ list: LiveClassItem[]; serverTimeStamp: number }>({
    list: [],
    serverTimeStamp: Math.floor(Date.now() / 1000),
  });
  const [isMeeting, setMeeting] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [activeClassId, setActiveClassId] = useState<number | null>(null);

  const fetchEnrolledCourses = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setUser({ ...user, loading: true });
    jwtDecode<any>(token);

    axios
      .get(BACKEND_URL + "/user/course/getEnrolledCoursesByUserId", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const allCourses = res.data.data || [];
        const filteredCourses = allCourses.filter(
          (course: any) => course.id.toString() === COURSE_ID || course.id.toString() === COURSE_ID_2,
        );

        setEnrolledCourses(filteredCourses);
        const hasCourse15 = filteredCourses.some((course: any) => course.id.toString() === COURSE_ID_2);
        const hasCourse1 = filteredCourses.some((course: any) => course.id.toString() === COURSE_ID);

        if (hasCourse15) setSelectedCourseId(COURSE_ID_2);
        else if (hasCourse1) setSelectedCourseId(COURSE_ID);
        else {
          setSelectedCourseId(COURSE_ID);
          if (filteredCourses.length === 0) {
            toast.error("আপনি কোন কোর্সে অন্তর্ভুক্ত হননি। দয়া করে প্রয়োজনীয় কোর্সে অন্তর্ভুক্ত হোন।", {
              duration: 5000,
            });
          }
        }

        setUser({ ...user, loading: false });
      })
      .catch(() => {
        setUser({ ...user, loading: false });
        toast.error("কোর্স তথ্য লোড করা যায়নি। দয়া করে আবার চেষ্টা করুন।", { duration: 3000 });
      });
  };

  const fetchClasses = () => {
    if (!selectedCourseId) return;
    setUser({ ...user, loading: true });
    const token = localStorage.getItem("token");

    axios
      .get(BACKEND_URL + "/user/live/list/" + selectedCourseId, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.data;
        const sortedList = [...(data?.list || [])].sort((a: LiveClassItem, b: LiveClassItem) => {
          const timeDiff = (b.scheduled_at || 0) - (a.scheduled_at || 0);
          if (timeDiff !== 0) return timeDiff;
          return (b.id || 0) - (a.id || 0);
        });

        setLiveClasses({
          ...(data || {}),
          list: sortedList,
        });

        if (sortedList.length) setActiveClassId((prev: number | null) => prev ?? sortedList[0].id);
        setUser({ ...user, loading: false });
      })
      .catch(() => {
        setUser({ ...user, loading: false });
        toast.error("Failed to fetch live classes");
      });
  };

  const submitInterested = (id: number) => {
    setUser({ ...user, loading: true });
    const token = localStorage.getItem("token");

    axios
      .post(BACKEND_URL + `/user/live/interest/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        fetchClasses();
        toast.success("Marked as interested");
        setUser({ ...user, loading: false });
      })
      .catch(() => {
        setUser({ ...user, loading: false });
        toast.error("Failed to mark interest");
      });
  };

  const fetchMeetingProps = (liveId: number) => {
    setUser({ ...user, loading: true });
    const token = localStorage.getItem("token");

    axios
      .get(BACKEND_URL + "/user/meeting/getMeetingProps/" + liveId, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => initiateMeeting(res.data.data))
      .catch(() => {
        setUser({ ...user, loading: false });
        toast.error("Failed to join the meeting");
      });
  };

  const initiateMeeting = async (config: any) => {
    try {
      const ZoomMtg = (await import("@zoomus/websdk/index")).ZoomMtg;
      ZoomMtg.setZoomJSLib("https://source.zoom.us/2.16.0/lib", "/av");
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareWebSDK();
      ZoomMtg.i18n.load("en-US");
      ZoomMtg.i18n.reload("en-US");

      const zmmtgRoot = window.document.getElementById("zmmtg-root");
      if (zmmtgRoot) zmmtgRoot.style.display = "block";

      ZoomMtg.init({
        leaveUrl: config.leaveUrl,
        success: () => {
          setUser({ ...user, loading: false });
          setMeeting(true);
          ZoomMtg.join({
            signature: config.signature,
            sdkKey: config.sdkKey,
            meetingNumber: config.meetingNumber,
            passWord: config.passWord,
            userName: config.userName,
            userEmail: config.userEmail,
            tk: config.registrantToken,
            zak: config.zakToken,
            success: () => setUser({ ...user, loading: false }),
            error: () => {
              setUser({ ...user, loading: false });
              toast.error("Failed to join meeting");
            },
          });
        },
        error: () => {
          setUser({ ...user, loading: false });
          toast.error("Failed to initialize meeting");
        },
      });
    } catch {
      setUser({ ...user, loading: false });
      toast.error("Failed to load Zoom SDK");
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) fetchClasses();
  }, [selectedCourseId]);

  useEffect(() => {
    setActiveClassId(null);
  }, [selectedCourseId]);

  const sortedLiveClasses = useMemo(() => {
    return [...(liveClasses.list || [])].sort((a, b) => {
      const timeDiff = (b.scheduled_at || 0) - (a.scheduled_at || 0);
      if (timeDiff !== 0) return timeDiff;
      return (b.id || 0) - (a.id || 0);
    });
  }, [liveClasses.list]);

  const classesWithStatus = useMemo(() => {
    const currentTime = liveClasses.serverTimeStamp;
    return sortedLiveClasses.map((liveClass) => {
      const durationInSeconds = getDurationInMinutes(liveClass.duration) * 60;
      const isLive = liveClass.scheduled_at <= currentTime && liveClass.scheduled_at + durationInSeconds > currentTime;
      const isPast = liveClass.scheduled_at + durationInSeconds <= currentTime;
      return { ...liveClass, isLive, isPast, isUpcoming: !isLive && !isPast };
    });
  }, [liveClasses.serverTimeStamp, sortedLiveClasses]);

  const activeClass = useMemo(() => {
    if (!classesWithStatus.length) return null;
    return classesWithStatus.find((item: any) => item.id === activeClassId) || classesWithStatus[0];
  }, [classesWithStatus, activeClassId]);

  const hasTrustedRecording = useMemo(() => {
    const url = activeClass?.data?.recordedMeetingLink || "";
    return Boolean(getTrustedVideoUrl(url));
  }, [activeClass?.data?.recordedMeetingLink]);

  const getCourseName = (courseId: string) => {
    if (!courseId) return "No Course Selected";
    const course = enrolledCourses.find((item) => item.id.toString() === courseId);
    if (course?.title) return course.title;
    if (courseId === COURSE_ID) return "Basic Course";
    if (courseId === COURSE_ID_2) return "Current Batch";
    return `Course ${courseId}`;
  };

  if (isMeeting) return <div id="zmmtg-root" />;

  return (
    <div className={`${HindSiliguri.variable} font-hind overflow-x-hidden`}>
      <Nav />
      <Toaster />
      <FloatingCompiler />

      <button
        style={{ zIndex: 999 }}
        onClick={() => setUser({ ...user, openCompiler: true })}
        className="fixed top-80 -left-2 bg-[#0B060D] bg-opacity-30 backdrop-blur-lg border border-gray-200/20 p-3 hover:bg-gray-300/20"
      >
        <svg width={40} height={40} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 9L15.6716 9.17157C17.0049 10.5049 17.6716 11.1716 17.6716 12C17.6716 12.8284 17.0049 13.4951 15.6716 14.8284L15.5 15" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M13.2942 7.17041L12.0001 12L10.706 16.8297" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8.49994 9L8.32837 9.17157C6.99504 10.5049 6.32837 11.1716 6.32837 12C6.32837 12.8284 6.99504 13.4951 8.32837 14.8284L8.49994 15" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div className="pt-20 bg-white dark:bg-[#0B060D]">
        <div className="w-[92%] xl:w-[84%] mx-auto py-10 min-h-[80vh]">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-heading dark:text-darkHeading">Live Class Hub</h1>
              <p className="text-paragraph dark:text-darkParagraph mt-2">Watch class recordings, track upcoming sessions, and continue learning from one place.</p>
            </div>
            {enrolledCourses.length > 1 && (
              <select
                className="rounded-xl border border-gray-300/40 dark:border-gray-400/20 bg-white/70 dark:bg-gray-200/5 px-4 py-3 text-heading dark:text-darkHeading"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
              >
                {enrolledCourses.map((course: any) => (
                  <option key={course.id} value={course.id.toString()}>
                    {getCourseName(course.id.toString())}
                  </option>
                ))}
              </select>
            )}
          </div>

          {classesWithStatus.length > 0 ? (
            <div className="grid items-start gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8 rounded-2xl border border-gray-300/30 dark:border-gray-500/20 bg-gray-50/60 dark:bg-white/[0.03] p-5 md:p-6">
                {activeClass?.isPast && hasTrustedRecording && activeClass?.data?.recordedMeetingLink && (
                  <div className="mb-5 rounded-xl overflow-hidden border border-gray-300/30 dark:border-gray-500/20">
                    <VideoPlayer videoUrl={activeClass.data.recordedMeetingLink} />
                  </div>
                )}

                <div className="mb-4 flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${activeClass?.isLive ? "bg-green-500 text-white" : activeClass?.isPast ? "bg-gray-600 text-white" : "bg-purple-600 text-white"}`}>
                    {activeClass?.isLive ? "LIVE NOW" : activeClass?.isPast ? "PAST SESSION" : "UPCOMING"}
                  </span>
                  <span className="text-sm text-paragraph dark:text-darkParagraph">{convertUnixTimestamp((activeClass?.scheduled_at || 0) * 1000)} • {activeClass?.duration || "1 Hour"}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-semibold text-heading dark:text-darkHeading">{activeClass?.title || "Untitled Session"}</h2>
                <div
                  className="mt-2 text-paragraph dark:text-darkParagraph leading-7 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_a]:text-purple-600 [&_a]:underline [&_a:hover]:opacity-80 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                  dangerouslySetInnerHTML={{
                    __html: renderRichDescription(activeClass?.description || "No description available"),
                  }}
                />
                <p className="mt-3 text-sm text-paragraph dark:text-darkParagraph">Instructor: {activeClass?.instructor_name || "Instructor"} • {getCourseName(selectedCourseId)}</p>

                {activeClass?.isUpcoming && <CountdownTimer targetTimestamp={activeClass.scheduled_at} />}

                <div className="mt-6">
                  {activeClass?.isLive ? (
                    <button
                      onClick={() => fetchMeetingProps(activeClass.id)}
                      className="w-full md:w-auto rounded-xl bg-green-500 px-6 py-3 font-semibold text-white hover:opacity-90"
                    >
                      Join Live Class
                    </button>
                  ) : activeClass?.isUpcoming ? (
                    <button
                      onClick={() => submitInterested(activeClass.id)}
                      disabled={activeClass.interested}
                      className={`w-full md:w-auto rounded-xl px-6 py-3 font-semibold text-white ${activeClass.interested ? "bg-gray-500 cursor-not-allowed" : "bg-purple-600 hover:opacity-90"}`}
                    >
                      {activeClass.interested ? "Already Interested" : "Mark as Interested"}
                    </button>
                  ) : (
                    <button
                      disabled={!hasTrustedRecording}
                      className={`w-full md:w-auto rounded-xl px-6 py-3 font-semibold ${hasTrustedRecording ? "bg-gray-900 text-white dark:bg-white dark:text-black" : "bg-gray-500 text-white cursor-not-allowed"}`}
                    >
                      {hasTrustedRecording ? "Recording Ready Above" : "Recording Unavailable"}
                    </button>
                  )}
                </div>
              </div>

              <aside className="lg:col-span-4 rounded-2xl border border-gray-300/30 dark:border-gray-500/20 bg-gray-50/60 dark:bg-white/[0.03] p-4 md:p-5 lg:h-[calc(100vh-9rem)]">
                <h3 className="text-xl font-semibold text-heading dark:text-darkHeading">Class Playlist</h3>
                <p className="text-sm text-paragraph dark:text-darkParagraph mt-1 mb-4">Select a session to view details, join on time, or watch the recording.</p>

                <div className="h-[calc(100%-3.5rem)] overflow-y-auto space-y-3 pr-1">
                  {classesWithStatus.map((item: any) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveClassId(item.id)}
                      className={`w-full rounded-xl border p-3 text-left transition ${activeClass?.id === item.id ? "border-purple-500 bg-purple-500/10" : "border-gray-300/30 dark:border-gray-600/30 hover:border-purple-400/70"}`}
                    >
                      <div className="mb-2 overflow-hidden rounded-lg">
                        <img
                          src={item.thumbnail || "/Group 33514.png"}
                          alt={item.title || "Live class"}
                          className="h-28 w-full object-cover"
                        />
                      </div>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.isLive ? "bg-green-500 text-white" : item.isPast ? "bg-gray-500 text-white" : "bg-purple-500 text-white"}`}>
                          {item.isLive ? "LIVE" : item.isPast ? "PAST" : "UPCOMING"}
                        </span>
                        <span className="text-xs text-paragraph dark:text-darkParagraph">{item.duration || "1 Hour"}</span>
                      </div>
                      <p className="line-clamp-2 font-semibold text-heading dark:text-darkHeading">{item.title || "Untitled Session"}</p>
                      <p className="mt-1 text-xs text-paragraph dark:text-darkParagraph">{convertUnixTimestamp(item.scheduled_at * 1000)}</p>
                    </button>
                  ))}
                </div>
              </aside>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-300/30 dark:border-gray-500/20 bg-gray-50/60 dark:bg-white/[0.03] py-16 text-center">
              <p className="text-xl text-heading dark:text-darkHeading">No live classes available for this course yet.</p>
              <p className="mt-2 text-paragraph dark:text-darkParagraph">Check back later for upcoming sessions.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
