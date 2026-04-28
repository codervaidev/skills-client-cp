import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/Contexts/UserContext";
import FloatingCompiler from "@/components/FloatingCompiler";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { HindSiliguri } from "@/helpers";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import {
  successStories,
  getStoriesByBatch,
  SuccessStory as StoryType,
} from "@/data/successStories";
import WhatsAppWidget from "@/components/WhatsAppWidget";

// Component for Grid View Card
const GridCard = ({
  story,
  index = 0,
  animateDelay = false,
}: {
  story: StoryType;
  index?: number;
  animateDelay?: boolean;
}) => (
  <div
    className={`bg-white/95 dark:bg-[#161223] rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-purple/50 hover:shadow-[0_0_18px_rgba(138,43,226,0.35)] dark:hover:border-purple/70 dark:hover:shadow-[0_0_24px_rgba(138,43,226,0.45)] ${
      animateDelay ? "animate-card" : ""
    }`}
    style={animateDelay ? { animationDelay: `${index * 100}ms` } : undefined}
  >
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">
          Batch - {story.batch}
        </span>
        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium">
          {story.codeforces && `${story.codeforces.rating}`} ⭐
        </span>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-purple/10 mb-4 relative">
          {story.image && story.image !== "placeholder" ? (
            <Image
              src={story.image}
              alt={story.name}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-2xl font-bold">
              {story.name.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="text-xl font-semibold text-heading dark:text-darkHeading mb-2">
          {story.name}
        </h3>
      </div>

      <div className="mt-4 space-y-2">
        <div className="grid grid-cols-1 gap-2">
          {story.codeforces && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-2 relative">
                    <Image
                      src="/assets/success-story/codeforces-96x96.png"
                      alt="Codeforces"
                      className="object-contain"
                      width={20}
                      height={20}
                      priority
                      onError={(e) => {
                        // @ts-ignore
                        e.currentTarget.src =
                          "https://codeforces.org/s/0/favicon-32x32.png";
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-paragraph dark:text-darkParagraph">
                    Codeforces
                  </span>
                </div>

                <a
                  href={`https://codeforces.com/profile/${story.codeforces.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-purple transition-colors flex items-center gap-1 border-b border-dotted border-blue-400 dark:border-blue-500 hover:border-purple group"
                >
                  {story.codeforces.handle}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transform group-hover:translate-x-0.5 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>

                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold bg-purple/10 text-purple px-2 py-1 rounded">
                    {story.codeforces.rating}
                  </span>
                  {story.codeforces.rankName && (
                    <span className="text-sm mt-1 font-medium text-paragraph dark:text-darkParagraph text-right">
                      {story.codeforces.rankName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {story.codechef && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-2 relative">
                    <Image
                      src="/assets/success-story/codechef-100x100.png"
                      alt="CodeChef"
                      className="object-contain"
                      width={20}
                      height={20}
                      priority
                      onError={(e) => {
                        // @ts-ignore
                        e.currentTarget.src =
                          "https://cdn.codechef.com/images/favicon-32x32.png";
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-paragraph dark:text-darkParagraph">
                    CodeChef
                  </span>
                </div>

                <a
                  href={`https://www.codechef.com/users/${story.codechef.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-yellow transition-colors flex items-center gap-1 border-b border-dotted border-amber-400 dark:border-amber-500 hover:border-yellow group"
                >
                  {story.codechef.handle}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transform group-hover:translate-x-0.5 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>

                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold bg-yellow/10 text-yellow px-2 py-1 rounded">
                    {story.codechef.rating}
                  </span>
                  {story.codechef.rankName && (
                    <span className="text-sm mt-1 font-medium text-paragraph dark:text-darkParagraph text-right">
                      {story.codechef.rankName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Component for List View Card
const ListCard = ({
  story,
  index = 0,
  animateDelay = false,
}: {
  story: StoryType;
  index?: number;
  animateDelay?: boolean;
}) => (
  <div
    className={`bg-white/95 dark:bg-[#161223] rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-purple/50 hover:shadow-[0_0_18px_rgba(138,43,226,0.35)] dark:hover:border-purple/70 dark:hover:shadow-[0_0_24px_rgba(138,43,226,0.45)] ${
      animateDelay ? "animate-card" : ""
    }`}
    style={animateDelay ? { animationDelay: `${index * 100}ms` } : undefined}
  >
    <div className="p-4 flex flex-col md:flex-row items-center md:items-start gap-4">
      <div className="flex-shrink-0">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-purple/10 relative">
          {story.image && story.image !== "placeholder" ? (
            <Image
              src={story.image}
              alt={story.name}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-2xl font-bold">
              {story.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
          <h3 className="text-xl font-semibold text-heading dark:text-darkHeading text-center md:text-left">
            {story.name}
          </h3>

          <div className="flex gap-2 mt-2 md:mt-0 justify-center md:justify-start">
            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">
              Batch - {story.batch}
            </span>
            <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
              {story.codeforces && `${story.codeforces.rating}`} ⭐
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {story.codeforces && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-2 relative">
                    <Image
                      src="/assets/success-story/codeforces-96x96.png"
                      alt="Codeforces"
                      className="object-contain"
                      width={20}
                      height={20}
                      priority
                      onError={(e) => {
                        // @ts-ignore
                        e.currentTarget.src =
                          "https://codeforces.org/s/0/favicon-32x32.png";
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-paragraph dark:text-darkParagraph">
                    Codeforces
                  </span>
                </div>

                <a
                  href={`https://codeforces.com/profile/${story.codeforces.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-purple transition-colors flex items-center gap-1 border-b border-dotted border-blue-400 dark:border-blue-500 hover:border-purple group"
                >
                  {story.codeforces.handle}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transform group-hover:translate-x-0.5 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>

                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold bg-purple/10 text-purple px-2 py-1 rounded">
                    {story.codeforces.rating}
                  </span>
                  {story.codeforces.rankName && (
                    <span className="text-sm mt-1 font-medium text-paragraph dark:text-darkParagraph text-right">
                      {story.codeforces.rankName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {story.codechef && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-2 relative">
                    <Image
                      src="/assets/success-story/codechef-100x100.png"
                      alt="CodeChef"
                      className="object-contain"
                      width={20}
                      height={20}
                      priority
                      onError={(e) => {
                        // @ts-ignore
                        e.currentTarget.src =
                          "https://cdn.codechef.com/images/favicon-32x32.png";
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-paragraph dark:text-darkParagraph">
                    CodeChef
                  </span>
                </div>

                <a
                  href={`https://www.codechef.com/users/${story.codechef.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-yellow transition-colors flex items-center gap-1 border-b border-dotted border-amber-400 dark:border-amber-500 hover:border-yellow group"
                >
                  {story.codechef.handle}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transform group-hover:translate-x-0.5 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>

                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold bg-yellow/10 text-yellow px-2 py-1 rounded">
                    {story.codechef.rating}
                  </span>
                  {story.codechef.rankName && (
                    <span className="text-sm mt-1 font-medium text-paragraph dark:text-darkParagraph text-right">
                      {story.codechef.rankName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const SuccessStory = () => {
  const [user, setUser] = useContext<any>(UserContext);
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [storiesPerPage] = useState(6);
  const [filteredStories, setFilteredStories] = useState(successStories);
  const [viewType, setViewType] = useState("grid"); // 'grid' or 'list'
  const [mounted, setMounted] = useState(false);
  const [contentKey, setContentKey] = useState(0); // Used to force re-render with animations

  // Get unique batch numbers from the data
  const uniqueBatches = React.useMemo(() => {
    const batchSet = new Set<number>();
    successStories.forEach((story) => batchSet.add(story.batch));
    return Array.from(batchSet).sort((a, b) => a - b);
  }, []);

  useEffect(() => {
    // Set mounted to true after component mounts to prevent animation issues
    setMounted(true);
  }, []);

  // Handle batch change
  const handleBatchChange = (batch: string) => {
    if (batch === selectedBatch) return;

    // Apply fade-out effect first
    document
      .getElementById("content-container")
      ?.classList.add("animate-fade-out");

    // After fade-out, update the data and trigger fade-in
    setTimeout(() => {
      setSelectedBatch(batch);
      setCurrentPage(1);
      setContentKey((prev) => prev + 1); // Force re-render with animations
    }, 300);
  };

  // Handle pagination
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber === currentPage) return;

    // Apply fade-out effect first
    document
      .getElementById("content-container")
      ?.classList.add("animate-fade-out");

    // After fade-out, update the page and trigger fade-in
    setTimeout(() => {
      setCurrentPage(pageNumber);
      setContentKey((prev) => prev + 1); // Force re-render with animations
    }, 300);
  };

  // Handle view type change
  const handleViewTypeChange = (type: string) => {
    if (type === viewType) return;

    // Apply fade-out effect first
    document
      .getElementById("content-container")
      ?.classList.add("animate-fade-out");

    // After fade-out, update the view type and trigger fade-in
    setTimeout(() => {
      setViewType(type);
      setContentKey((prev) => prev + 1); // Force re-render with animations
    }, 300);
  };

  useEffect(() => {
    // Update filtered stories when the selected batch changes
    setFilteredStories(getStoriesByBatch(selectedBatch));
  }, [selectedBatch]);

  // Get current page stories
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = filteredStories.slice(
    indexOfFirstStory,
    indexOfLastStory,
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);
  const totalRatings = filteredStories.reduce(
    (sum, story) => sum + (story.codeforces?.rating || 0),
    0,
  );
  const avgRating = filteredStories.length
    ? Math.round(totalRatings / filteredStories.length)
    : 0;

  return (
    <div className={`${HindSiliguri.variable} font-hind overflow-x-hidden`}>
      <style jsx global>{`
        /* Remove any existing animation/transition styles that might conflict */
        .page-transition {
          transition: none;
        }

        /* Initial animation for content when page loads */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Animation for cards with staggered delay */
        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Animation for content to fade out */
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(10px);
          }
        }

        /* Apply animations to elements */
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-out {
          animation: fadeOut 0.3s ease-out forwards;
        }

        .animate-card {
          opacity: 0;
          animation: cardFadeIn 0.5s ease-out forwards;
        }

        /* Transition for buttons */
        .btn-transition {
          transition: all 0.2s ease;
        }
      `}</style>

      <Nav />
      <Toaster />
      {mounted && <FloatingCompiler />}

      {mounted && (
        <button
          style={{ zIndex: 999 }}
          onClick={() => {
            setUser({ ...user, openCompiler: true });
          }}
          className="fixed top-80 -left-2 bg-[#0B060D] bg-opacity-30 backdrop-blur-lg border border-gray-200/20 p-3 hover:bg-gray-300/20"
        >
          <svg
            width={40}
            height={40}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M15.5 9L15.6716 9.17157C17.0049 10.5049 17.6716 11.1716 17.6716 12C17.6716 12.8284 17.0049 13.4951 15.6716 14.8284L15.5 15"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
              ></path>
              <path
                d="M13.2942 7.17041L12.0001 12L10.706 16.8297"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
              ></path>
              <path
                d="M8.49994 9L8.32837 9.17157C6.99504 10.5049 6.32837 11.1716 6.32837 12C6.32837 12.8284 6.99504 13.4951 8.32837 14.8284L8.49994 15"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
              ></path>
              <path
                d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
              ></path>
            </g>
          </svg>
        </button>
      )}

      <div className="py-16 bg-white dark:bg-[#07030f] overflow-x-hidden">
        <div className="w-[90%] lgXl:w-[80%] mx-auto py-12 z-20 min-h-[80vh]">
          {/* Hero Section */}
          <div
            className={`mb-10 rounded-3xl border border-gray-200/70 dark:border-purple/20 bg-gradient-to-br from-[#f7f1ff] via-white to-[#f3fffb] dark:from-[#130a1f] dark:via-[#0f0a19] dark:to-[#0a1522] p-8 md:p-12 text-center relative overflow-hidden ${mounted ? "animate-fade-in" : ""}`}
            style={{ animationDelay: "0ms" }}
          >
            <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-purple/20 blur-3xl" />
            <div className="absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
            <h1 className="text-4xl md:text-5xl font-bold text-heading dark:text-darkHeading mb-4">
              Success Story Wall
            </h1>
            <p className="text-paragraph dark:text-darkParagraph text-lg max-w-3xl mx-auto">
              ৫-৬ মাসব্যাপী আমাদের কম্পিটিটিভ প্রোগ্রামিং কোর্সটি সফলভাবে শেষ
              করার পর, বিগত ব্যাচের অনেক শিক্ষার্থীই বিভিন্ন আন্তর্জাতিক ও
              জাতীয় অনলাইন জাজ প্ল্যাটফর্মে অসাধারণ দক্ষতা প্রদর্শন করেছে। আমরা
              তাদের মধ্য থেকে কিছু স্ট্যান্ডআউট পারফর্মারেরদের তুলে ধরছি, যারা
              কোর্স শেষে বাস্তব জাজ প্ল্যাটফর্মে নিজেদের মেধা ও পরিশ্রমের
              মাধ্যমে প্রমাণ করেছে
            </p>
            {/* Stats cards removed as requested */}
          </div>

          {/* Controls Section */}
          <div
            className={`flex flex-col md:flex-row justify-between items-center mb-8 gap-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-[#120d1d] p-4 md:p-5 ${mounted ? "animate-fade-in" : ""}`}
            style={{ animationDelay: "200ms" }}
          >
            {/* Filter Tabs */}
            <div className="inline-flex rounded-md shadow-sm flex-wrap">
              <button
                onClick={() => handleBatchChange("all")}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg btn-transition ${
                  selectedBatch === "all"
                    ? "bg-purple text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-paragraph dark:text-darkParagraph border border-gray-200 dark:border-gray-600"
                }`}
              >
                Batch-All
              </button>
              {uniqueBatches.map((batch, index) => (
                <button
                  key={batch}
                  onClick={() => handleBatchChange(batch.toString())}
                  className={`px-4 py-2 text-sm font-medium btn-transition ${
                    index === uniqueBatches.length - 1 ? "rounded-r-lg" : ""
                  } ${
                    selectedBatch === batch.toString()
                      ? "bg-purple text-white shadow-md"
                      : "bg-white dark:bg-gray-800 text-paragraph dark:text-darkParagraph border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  Batch-{batch}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => handleViewTypeChange("grid")}
                className={`p-2 rounded-l-lg btn-transition ${
                  viewType === "grid"
                    ? "bg-purple text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-paragraph dark:text-darkParagraph border border-gray-200 dark:border-gray-600"
                }`}
                aria-label="Grid view"
              >
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleViewTypeChange("list")}
                className={`p-2 rounded-r-lg btn-transition ${
                  viewType === "list"
                    ? "bg-purple text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-paragraph dark:text-darkParagraph border border-gray-200 dark:border-gray-600"
                }`}
                aria-label="List view"
              >
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Problem Solvers Grid/List View */}
          {mounted && (
            <div
              id="content-container"
              key={contentKey}
              className="animate-fade-in"
              onAnimationEnd={(e) => {
                if (e.animationName === "fadeOut") {
                  e.currentTarget.classList.remove("animate-fade-out");
                  e.currentTarget.classList.add("animate-fade-in");
                }
              }}
            >
              {viewType === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentStories.map((story, index) => (
                    <GridCard
                      key={story.id}
                      story={story}
                      index={index}
                      animateDelay={mounted}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {currentStories.map((story, index) => (
                    <ListCard
                      key={story.id}
                      story={story}
                      index={index}
                      animateDelay={mounted}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              className={`flex justify-center mt-10 ${mounted ? "animate-fade-in" : ""}`}
              style={{ animationDelay: "400ms" }}
            >
              <nav className="inline-flex items-center">
                <button
                  onClick={() =>
                    handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
                  }
                  disabled={currentPage === 1}
                  className="p-2 mr-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-paragraph dark:text-darkParagraph disabled:opacity-50 btn-transition"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`px-4 py-2 mx-1 rounded-md btn-transition ${
                      currentPage === idx + 1
                        ? "bg-purple text-white"
                        : "bg-white dark:bg-gray-800 text-paragraph dark:text-darkParagraph border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    handlePageChange(
                      currentPage < totalPages ? currentPage + 1 : totalPages,
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 ml-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-paragraph dark:text-darkParagraph disabled:opacity-50 btn-transition"
                >
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {mounted && 
        <WhatsAppWidget
          phoneNumber="8801768976036"
          name="CoderVai Team"
          position="Online | Replies instantly"
          welcomeMessage="আমরা এখানে একটিভ আছি! 👋 আপনাকে কিভাবে সাহায্য করতে পারি?"
          avatar="/wasup.svg"
        />
      }

      {mounted && <Footer />}
    </div>
  );
};

export default SuccessStory;
