import React from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingCompiler from "@/components/FloatingCompiler";
import { HindSiliguri } from "@/helpers";
import { Toaster } from "react-hot-toast";

type Props = { children: React.ReactNode };

export default function DashboardLayout({ children }: Props) {
    return (
        <div className={`${HindSiliguri.variable} overflow-x-hidden font-hind min-h-screen flex flex-col`}>
            <Nav />
            <Toaster />
            <FloatingCompiler />

            <div className="flex-grow bg-gray-50 dark:bg-[#0B060D]">
                <div className="max-w-[1400px] mx-auto">
                    {children}
                </div>
            </div>

            <Footer />
        </div>
    );
}
