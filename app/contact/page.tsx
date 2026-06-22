import type { Metadata } from "next";
import { getContent } from "../lib/getContent";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ContactHero from "../components/contact/ContactHero";
import ContactMain from "../components/contact/ContactMain";
import ContactLocations from "../components/contact/ContactLocations";
import ContactDepartments from "../components/contact/ContactDepartments";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact — Galler Engineering",
  description:
    "Get in touch with Galler India for product inquiries, technical support, partnerships, and career opportunities.",
};

export default function ContactPage() {
  const content = getContent();
  const contactPage = content?.contactPage;

  return (
    <>
      <Navbar activePage="contact" />
      <main className="min-h-screen bg-white">
        <ContactHero
          heading={contactPage?.heading}
          description={contactPage?.description}
          backgroundImage={contactPage?.backgroundImage}
        />
        <ContactMain
          phone1={contactPage?.phone1}
          phone2={contactPage?.phone2}
          email1={contactPage?.email}
          address={contactPage?.address1}
        />
        <ContactLocations plants={contactPage?.plants} />
        <ContactDepartments />
      </main>
      <Footer content={content?.footer} />
    </>
  );
}
