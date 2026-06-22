"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import logo from "@/Assets/logo.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar({ activePage = "home" }: { activePage?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
    <header
      className={`fixed top-0 right-0 left-0 z-50 border-b border-gray-100 ${
        mobileOpen ? "bg-white" : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="Galler" className="h-10 w-auto" priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = activePage === link.label.toLowerCase();
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative text-sm font-medium transition-colors hover:text-[#1a1a1a] ${
                  isActive ? "text-[#1a1a1a]" : "text-gray-500"
                }`}
              >
                {isActive && (
                  <span className="absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[var(--primary-orange)]" />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/admin/login"
            className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-medium text-[#1a1a1a] transition-colors hover:bg-gray-50"
          >
            Admin Portal
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-[#1a1a1a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2a2a2a]"
          >
            Get a quote
            <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded bg-[var(--primary-orange)]">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7h12m0 0L8 2m5 5L8 12"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#1a1a1a] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>
    </header>

    {/* Mobile Menu — slides in from right, full height below nav */}
    <div
      className={`fixed inset-x-0 top-20 z-40 h-[calc(100dvh-5rem)] md:hidden ${
        mobileOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!mobileOpen}
    >
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ease-out ${
          mobileOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={`absolute inset-y-0 right-0 flex w-full flex-col bg-white px-6 py-8 shadow-2xl transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-5">
          {navLinks.map((link) => {
            const isActive = activePage === link.label.toLowerCase();
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 text-base font-medium transition-colors ${
                  isActive ? "text-[#1a1a1a]" : "text-gray-600"
                }`}
              >
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-orange)]" />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>
        <hr className="my-6 border-gray-100" />
        <div className="flex flex-col gap-4">
          <Link
            href="/admin/login"
            onClick={() => setMobileOpen(false)}
            className="text-base font-medium text-[#1a1a1a]"
          >
            Admin Portal
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="inline-flex w-fit items-center rounded-full bg-[#1a1a1a] px-5 py-2.5 text-sm font-medium text-white"
          >
            Get a quote
            <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded bg-[var(--primary-orange)]">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
