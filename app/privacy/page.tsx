import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/common/Navbar";
import Footer from "@/app/components/common/Footer";
import { getContent } from "@/app/lib/getContent";

export const metadata: Metadata = {
  title: "Privacy Policy – Galler",
  description: "How Galler collects, uses, and protects your personal information.",
};

interface Section {
  heading: string;
  content: Array<
    | { type: "paragraph"; text: string }
    | { type: "bullets"; intro?: string; items: string[] }
  >;
}

const sections: Section[] = [
  {
    heading: "Information we collect",
    content: [
      { type: "paragraph", text: "We may collect the following types of information:" },
      {
        type: "bullets",
        items: [
          "Personal information (e.g., name, email address, phone number) — provided contact requests, or newsletters.",
          "Project information — details you share with us regarding your brand, business, or project requirements.",
          "Usage data — such as IP address, browser type, pages visited, and time spent on the site (collected automatically via cookies or analytics tools).",
        ],
      },
    ],
  },
  {
    heading: "How we use your information",
    content: [
      { type: "paragraph", text: "We use the information we collect to:" },
      { type: "paragraph", text: "Respond to your inquiries or project requests" },
      {
        type: "bullets",
        items: [
          "Provide and improve our services",
          "Communicate important updates or offers",
          "Analyse website performance and user behaviour",
          "Ensure legal compliance and prevent misuse",
        ],
      },
    ],
  },
  {
    heading: "Sharing your information",
    content: [
      {
        type: "paragraph",
        text: "We do not sell or trade your personal data. We may share your information with:",
      },
      {
        type: "bullets",
        items: [
          "Trusted third-party service providers (e.g., hosting, analytics, CRM tools) who assist in operating our business",
          "Law enforcement or government agencies if required by law",
        ],
      },
      {
        type: "paragraph",
        text: "All third-party services comply with applicable data protection laws.",
      },
    ],
  },
  {
    heading: "Cookies & tracking technologies",
    content: [
      {
        type: "paragraph",
        text: "Our website uses cookies and similar technologies to enhance user experience and gather usage statistics. You can manage or disable cookies in your browser settings.",
      },
    ],
  },
  {
    heading: "Data security",
    content: [
      {
        type: "paragraph",
        text: "We implement appropriate technical and organizational measures to safeguard your personal data from unauthorized access, alteration, or disclosure.",
      },
    ],
  },
  {
    heading: "Your rights",
    content: [
      { type: "paragraph", text: "You have the right to:" },
      {
        type: "bullets",
        items: [
          "Access or update your personal information",
          "Request deletion of your data",
          "Withdraw consent or opt-out of communications",
        ],
      },
    ],
  },
  {
    heading: "Third-party links",
    content: [
      {
        type: "paragraph",
        text: "Our website may contain links to third-party websites. We are not responsible for their content or privacy practices. We encourage you to review their privacy policies before sharing any data.",
      },
    ],
  },
  {
    heading: "Changes to this policy",
    content: [
      {
        type: "paragraph",
        text: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated date. We recommend checking back periodically to stay informed.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  const content = getContent();

  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Hero */}
        <div className="mx-auto max-w-3xl px-6 pt-20 pb-4 text-center">
          <h1 className="text-5xl font-black tracking-tight text-[#1a1a1a] sm:text-6xl">
            Privacy policy
          </h1>
          <p className="mt-4 text-sm text-gray-400">Last updated: 5 months ago</p>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-2xl px-6 py-16">
          {/* Intro paragraph */}
          <p className="mb-14 text-sm leading-relaxed text-gray-700">
            At <strong>Galler</strong>, we value your trust and are committed to protecting your
            personal information. This Privacy Policy explains how we collect, use, and safeguard
            the data you share with us when you interact with our digital platforms, services, and
            creative solutions.
          </p>

          {/* Sections */}
          <div className="flex flex-col gap-12">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-4 text-2xl font-black tracking-tight text-[#1a1a1a]">
                  {section.heading}
                </h2>
                <div className="flex flex-col gap-3">
                  {section.content.map((block, i) => {
                    if (block.type === "paragraph") {
                      return (
                        <p key={i} className="text-sm leading-relaxed text-gray-600">
                          {block.text}
                        </p>
                      );
                    }
                    return (
                      <ul key={i} className="flex flex-col gap-2">
                        {block.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3 text-sm text-gray-600">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                            <span dangerouslySetInnerHTML={{ __html: item }} />
                          </li>
                        ))}
                      </ul>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Contact us — special section with inline link */}
            <section>
              <h2 className="mb-4 text-2xl font-black tracking-tight text-[#1a1a1a]">
                Contact us
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">
                If you have any questions about this Privacy Policy or how we handle your data,
                please{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-[#1a1a1a] underline underline-offset-2 hover:text-primary transition-colors"
                >
                  contact us
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer content={content?.footer} />
    </>
  );
}
