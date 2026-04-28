import React, { useState, useEffect } from "react";
import {
  Video,
  FileText,
  HelpCircle,
  Code2,
  ChevronDown,
  Lock,
  PlayCircle,
  MessageCircle,
  Layout,
  BookOpen,
  Trophy,
  Zap,
} from "lucide-react";
import { englishToBanglaNumbers, countAssignmentsAndVideos } from "@/helpers";
import Link from "next/link";

interface StudyPlanLandingProps {
  courseData: any;
}

const StudyPlanLanding: React.FC<StudyPlanLandingProps> = ({ courseData }) => {
  const [openChapters, setOpenChapters] = useState<{ [key: number]: boolean }>({
    0: true,
  });

  const toggleChapter = (index: number) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
    if (isMobile) {
      setOpenChapters({ [index]: !openChapters[index] });
    } else {
      setOpenChapters((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    }
  };

  if (!courseData || !courseData.chapters) return null;

  const stats = [
    { label: "Modules", value: 391, icon: <Layout className="w-5 h-5" /> },
    { label: "Videos", value: 584, icon: <Video className="w-5 h-5" /> },
    { label: "Quizzes", value: 33, icon: <HelpCircle className="w-5 h-5" /> },
    { label: "PDFs", value: 35, icon: <FileText className="w-5 h-5" /> },
    {
      label: "Challenges",
      value: 8,
      icon: <Code2 className="w-5 h-5" />,
    },
  ];

  const getModuleIcon = (category: string) => {
    switch (category) {
      case "VIDEO":
        return <PlayCircle className="w-5 h-5 text-purple" />;
      case "PDF":
        return <FileText className="w-5 h-5 text-blue-400" />;
      case "QUIZ":
        return <HelpCircle className="w-5 h-5 text-yellow-500" />;
      case "CODE":
        return <Code2 className="w-5 h-5 text-green-400" />;
      case "ASSIGNMENT":
        return <BookOpen className="w-5 h-5 text-orange-400" />;
      default:
        return <Layout className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <section className="bg-[#0B060D] py-24 relative overflow-hidden" id="full-study-plan">
      {/* Background Glow */}
      <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-purple/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -left-64 w-[500px] h-[500px] bg-purple/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-[90%] lg:w-[85%] mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            স্মার্ট <span className="text-[#B153E0]">কারিকুলাম ও স্টাডি প্ল্যান</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-4xl leading-relaxed">
            বেসিক C++ থেকে শুরু করে অ্যাডভান্সড ডাটাস্ট্রাকচার ও অ্যালগরিদম — এক নজরে
            দেখে নাও আমাদের জিরো টু হিরো কমপ্লিট রোডম্যাপ।
          </p>
        </div>

        {/* PART A: Summary Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-row gap-4 mb-12">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 lg:p-6 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors"
            >
              <div className="p-3 bg-purple/10 rounded-xl mb-3 text-purple">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-500 font-medium uppercase tracking-wide mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Expand/Collapse All (Desktop Only) */}
        <div className="hidden lg:flex justify-end mb-6 gap-4">
          <button
            onClick={() => {
              const allOpen: Record<number, boolean> = {};
              courseData.chapters.forEach((_: any, i: number) => (allOpen[i] = true));
              setOpenChapters(allOpen);
            }}
            className="text-sm font-semibold text-gray-400 hover:text-purple transition-colors"
          >
            Expand all
          </button>
          <span className="text-gray-700">|</span>
          <button
            onClick={() => setOpenChapters({})}
            className="text-sm font-semibold text-gray-400 hover:text-purple transition-colors"
          >
            Collapse all
          </button>
        </div>

        <div className="flex flex-col gap-12 items-start relative">
          {/* PART B: Accordion Section - NOW FULL WIDTH */}
          <div className="w-full">
            <div className="space-y-4">
              {courseData.chapters.map((chapter: any, index: number) => {
                const chapterStats = countAssignmentsAndVideos(chapter.modules);
                const isOpen = openChapters[index];

                return (
                  <div
                    key={index}
                    className={`group border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ${
                      isOpen
                        ? "bg-white/[0.03] border-purple/30"
                        : "bg-transparent hover:border-white/20"
                    }`}
                  >
                    {/* Chapter Header */}
                    <button
                      onClick={() => toggleChapter(index)}
                      className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-6"
                    >
                      <div className="flex items-start gap-5 md:gap-8 flex-1">
                        {/* Module Number */}
                        <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl md:text-2xl font-bold text-white/50 group-hover:text-purple transition-colors">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                            {chapter.title}
                          </h4>
                          {/* Metadata */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            {chapterStats.videoCount > 0 && (
                              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                <Video className="w-4 h-4" />
                                {chapterStats.videoCount} Videos
                              </span>
                            )}
                            {chapterStats.quizCount > 0 && (
                              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                <HelpCircle className="w-4 h-4" />
                                {chapterStats.quizCount} Quizzes
                              </span>
                            )}
                            {chapterStats.codeCount > 0 && (
                              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                <Code2 className="w-4 h-4" />
                                {chapterStats.codeCount} Challenges
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expand/Collapse Control */}
                      <div className="flex items-center gap-4">
                        {chapter.is_free && (
                          <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">
                            FREE PREVIEW
                          </span>
                        )}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isOpen
                              ? "bg-purple text-white"
                              : "bg-white/5 text-gray-500"
                          }`}
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </div>
                      </div>
                    </button>

                    {/* Chapter Content */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen
                          ? "max-h-[3000px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="p-6 md:p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-6 md:gap-y-3">
                        {chapter.modules.map((mod: any, modIdx: number) => (
                          <div
                            key={modIdx}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-colors group/row"
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="opacity-70 group-hover/row:opacity-100 transition-opacity">
                                {getModuleIcon(mod.data.category)}
                              </div>
                              <span className="text-gray-300 text-sm md:text-base truncate">
                                {mod.title}
                              </span>
                            </div>
                            {chapter.is_free ? (
                              <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded uppercase">
                                Preivew
                              </span>
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-gray-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default StudyPlanLanding;
