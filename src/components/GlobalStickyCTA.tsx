import React, { useState } from "react";
import { Zap, X, Send, MessageCircle } from "lucide-react";
import Link from "next/link";

interface GlobalStickyCTAProps {
  courseData: any;
}

const GlobalStickyCTA: React.FC<GlobalStickyCTAProps> = ({ courseData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");

  if (!courseData) return null;

  const handleSendMessage = () => {
    const phoneNumber = "8801768976036";
    const formattedPhone = phoneNumber.replace(/\D/g, "");
    const welcomeMessage = "আমরা এখানে একটিভ আছি! 👋 আপনাকে কিভাবে সাহায্য করতে পারি?";
    const messageToSend = inputText.trim()
      ? `I want to know: ${inputText}`
      : welcomeMessage;
    
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageToSend)}`;
    window.open(whatsappUrl, "_blank");
    setInputText("");
  };

  const currentCourseId = (
    process.env.NEXT_PUBLIC_CURENT_COURSE_ID ||
    courseData?.id ||
    "15"
  )
    .toString()
    .replace(";", "")
    .trim();

  return (
    <div className="fixed bottom-4 left-4 right-4 lg:bottom-8 lg:right-4 xl:right-8 z-[100] lg:w-[240px] animate__animated animate__fadeInUp">
      {/* WhatsApp Chat Window */}
      {isOpen && (
        <div className="absolute bottom-[calc(100%+20px)] right-0 w-[calc(100vw-32px)] sm:w-[320px] rounded-2xl shadow-2xl bg-white overflow-hidden animate__animated animate__fadeInUp animate__faster border border-gray-200">
          {/* Header */}
          <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Course Advisor</h3>
                <p className="text-[10px] opacity-80">Replies within minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:opacity-80"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat area */}
          <div className="bg-[#e4e1de] p-4 h-[200px] flex flex-col">
            <div className="bg-white rounded-xl p-3 max-w-[85%] shadow-sm mb-auto">
              <p className="text-xs text-black leading-relaxed">
                আমরা এখানে একটিভ আছি! 👋 আপনাকে কিভাবে সাহায্য করতে পারি?
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-white flex items-center gap-2 border-t">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 py-1.5 px-3 text-xs border rounded-full focus:outline-none focus:border-[#25d366] text-black"
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#25d366] text-white p-2 rounded-full hover:bg-[#1da851]"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main CTA Card / Floating Bar */}
      <div className="bg-[#1C161D]/90 backdrop-blur-xl border border-white/10 rounded-[24px] lg:rounded-[32px] p-4 lg:p-6 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] relative overflow-visible">
        <div className="flex lg:flex-col items-center lg:items-stretch justify-between lg:justify-start gap-4 lg:gap-0 relative z-10">
          {/* Price Container */}
          <div className="lg:mb-5">
            <div className="flex items-baseline gap-2 mb-0.5 lg:mb-1">
              <span className="text-xl lg:text-3xl font-black text-white tracking-tighter">
                ৳{courseData.price}
              </span>
              <span className="text-[10px] lg:text-sm text-gray-500 line-through opacity-60">
                ৳{courseData.x_price}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 lg:px-2.5 lg:py-1 bg-green-500/10 text-green-400 text-[8px] lg:text-[10px] font-bold rounded-full border border-green-500/20">
              <Zap className="w-2.5 h-2.5 lg:w-3 lg:h-3 fill-current" />
              {Math.round(
                ((courseData.x_price - courseData.price) / courseData.x_price) *
                  100
              )}
              % DISCOUNT
            </div>
          </div>

          {/* Enroll Now Button */}
          <a
            href={`https://courses.codervai.com/course-details/${currentCourseId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 lg:flex-none flex items-center justify-center py-3 lg:py-4 bg-[#B153E0] hover:bg-[#A144FF] text-white rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm shadow-lg shadow-purple/20 transition-all active:scale-[0.98]"
          >
            এখনই এনরোল করো
          </a>
        </div>

        {/* Floating Bubble Merged on Edge */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute -top-3 -right-2 lg:top-auto lg:-bottom-2 lg:-right-2 w-10 h-10 lg:w-14 lg:h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 z-20 border-2 border-[#1C161D] ${
            isOpen ? "bg-red-500" : "bg-[#25d366]"
          }`}
        >
          {isOpen ? (
            <X className="text-white w-4 h-4 lg:w-6 lg:h-6" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="h-5 w-5 lg:h-7 lg:w-7 fill-white"
            >
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default GlobalStickyCTA;
