"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export const Navigation = () => {
    const pathname = usePathname();

    return (
        // Flexbox ensures alignment and spacing
        <nav className="flex justify-between items-center p-4 bg-black text-white">
            {/* Logo section */}
            <div className="logo flex-shrink-0">
                <Link href="/">
                    <img
                        src="/images/BEACH_TRACK_WHT_TP copy.png"
                        alt="BeachTrack Logo"
                        className="h-12 w-auto object-contain"
                    />
                </Link>
            </div>

            {/* Navigation and user actions */}
            <div className="nav-buttons flex items-center space-x-6">
                <a
                    href="/"
                    className={`${      
                        pathname === "/" ? "font-bold text-white" : "text-blue-400 hover:underline"
                    }`}
                >
                    Home
                </a>
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="text-white text-base cursor-pointer">
                            Sign in
                        </button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </nav>
    );
};
