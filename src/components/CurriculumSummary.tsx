import React from "react";
import { AnimationOnScroll } from "react-animation-on-scroll";
import {
  Code,
  Box,
  Layers,
  Search,
  Hash,
  GitMerge,
  Network,
  Cpu,
} from "lucide-react";

export default function CurriculumSummary() {
  const topics = [
    {
      title: "C++ ফান্ডামেন্টালস",
      description: "সিনট্যাক্স, ভেরিয়েবল, লুপ, ফাংশন ও অ্যারের খুঁটিনাটি বেসিক",
      icon: <Code className="w-6 h-6 text-[#B153E0]" strokeWidth={1.5} />,
      label: "বিগিনার",
    },
    {
      title: "OOP এবং ক্লাস বেসিক",
      description: "ক্লাস, অবজেক্ট এবং অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিং-এর গভীর জ্ঞান",
      icon: <Box className="w-6 h-6 text-[#B153E0]" strokeWidth={1.5} />,
      label: "কোর",
    },
    {
      title: "STL এবং প্রবলেম সলভিং টুলস",
      description: "STL কন্টেইনার, ইটারেটর, ম্যাপ, সেট এবং ভেক্টরের বাস্তব প্রয়োগ",
      icon: <Layers className="w-6 h-6 text-[#B153E0]" strokeWidth={1.5} />,
      label: "কোর",
    },
    {
      title: "সার্চিং, সর্টিং এবং প্যাটার্নস",
      description: "বাইনারি সার্চ, গ্রিডি প্যাটার্ন এবং প্র্যাকটিক্যাল প্রবলেম সলভিং স্ট্র্যাটেজি",
      icon: <Search className="w-6 h-6 text-[#B153E0]" strokeWidth={1.5} />,
      label: "কোর",
    },
    {
      title: "নাম্বার থিওরি এবং ম্যাথ",
      description: "কম্পেটিটিভ প্রোগ্রামিংয়ের জন্য প্রয়োজনীয় গাণিতিক এবং লজিক্যাল টুলস",
      icon: <Hash className="w-6 h-6 text-[#B153E0]" strokeWidth={1.5} />,
      label: "অ্যাডভান্সড",
    },
    {
      title: "রিকার্সন এবং ব্যাকট্র্যাকিং",
      description: "রিকার্সিভ থিংকিং এবং জটিল সমস্যা সমাধানের কার্যকর সার্চ স্ট্র্যাটেজি",
      icon: <GitMerge className="w-6 h-6 text-[#B153E0]" strokeWidth={1.5} />,
      label: "অ্যাডভান্সড",
    },
    {
      title: "গ্রাফ, ট্রি এবং ডেটা স্ট্রাকচার",
      description: "গ্রাফ ট্রাভার্সাল, ট্রি এবং আধুনিক ডেটা স্ট্রাকচারের বিস্তারিত আলোচনা",
      icon: <Network className="w-6 h-6 text-[#B153E0]" strokeWidth={1.5} />,
      label: "কন্টেস্ট রেডি",
    },
    {
      title: "ডাইনামিক প্রোগ্রামিং ও কন্টেস্ট থিংকিং",
      description: "স্টেট থিংকিং, ট্রানজিশন এবং অপটিমাইজেশন লজিকের মাধ্যমে কন্টেস্ট জয়",
      icon: <Cpu className="w-6 h-6 text-[#B153E0]" strokeWidth={1.5} />,
      label: "কন্টেস্ট রেডি",
    },
  ];

  return (
    <div className="bg-[#ca65fd]/10 dark:bg-[#0B060D] z-30 relative py-20 md:py-32">
      <div className="w-[90%] lg:w-[80%] mx-auto text-heading dark:text-darkHeading">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            আমরা যা <span className="text-[#B153E0]">শেখাবো</span>
          </h2>
          <p className="text-lg md:text-xl text-paragraph dark:text-darkParagraph max-w-4xl leading-relaxed">
            একজন দক্ষ প্রবলেম সলভার হিসেবে নিজেকে গড়ে তোলার জন্য যা যা প্রয়োজন — এক নজরে
            দেখে নাও আমাদের কোর্সের মূল ফোকাস এবং লার্নিং এরিয়াগুলো।
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {topics.map((topic, index) => (
            <AnimationOnScroll
              key={index}
              animateIn="animate__fadeInUp"
              delay={index * 100}
              animateOnce
            >
              <div className="group h-full flex flex-col p-6 rounded-2xl bg-white dark:bg-[#120B16] border border-gray-200 dark:border-gray-800/60 hover:dark:border-[#B153E0]/30 hover:border-[#B153E0]/30 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-[#B153E0]/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1A1020] group-hover:scale-110 transition-transform duration-300 ease-out">
                    {topic.icon}
                  </div>
                  <span className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-gray-100 dark:bg-[#1A1020] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800">
                    {topic.label}
                  </span>
                </div>
                <h4 className="text-lg font-semibold mb-2 group-hover:text-[#B153E0] transition-colors duration-300">
                  {topic.title}
                </h4>
                <p className="text-sm text-paragraph dark:text-darkParagraph leading-relaxed mt-auto">
                  {topic.description}
                </p>
              </div>
            </AnimationOnScroll>
          ))}
        </div>
      </div>
    </div>
  );
}
