import Link from "next/link";

interface AboutSectionTwoProps {
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
}

const DEFAULT_TITLE = "WE PUT OUR CLIENT'S REQUIREMENTS IN THE FOREFRONT.";
const DEFAULT_P1 =
  "We at Galler thrive on innovation and pushing the bounds of technology to solve our customers' most pressing challenges. We combine designing, developing, and manufacturing to produce leading product solutions.";
const DEFAULT_P2 =
  "Galler is a leading, end to end engineering solutions and product company. As a disruptive innovation company Galler navigates the business landscape via industry knowledge and digital capabilities.";

export default function AboutSectionTwo({
  title = DEFAULT_TITLE,
  paragraph1 = DEFAULT_P1,
  paragraph2 = DEFAULT_P2,
}: AboutSectionTwoProps) {
  return (
    <section className="bg-[#f2f2f2] py-14 sm:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-14 lg:px-10">
        <div className="lg:col-span-7">
          {/* <nav className="mb-8 text-sm text-[#7a7a7a]">
            <Link href="/" className="transition-colors hover:text-[#1a1a1a]">
              Home
            </Link>
            <span className="mx-2">›</span>
            <span className="font-medium text-[#1a1a1a]">About Us</span>
          </nav> */}

          <h2 className="max-w-2xl text-3xl leading-tight font-medium tracking-wide text-[#1f1f1f] sm:text-4xl">
            {title}
          </h2>

          <div className="mt-6 max-w-2xl space-y-5 text-[1.04rem] leading-relaxed text-[#2e2e2e]">
            <p>{paragraph1}</p>
            <p>{paragraph2}</p>
          </div>
        </div>

        <div className="lg:col-span-5 lg:justify-self-center">
          <div className="relative h-52 w-52 sm:h-64 sm:w-64 md:h-72 md:w-72">
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-[#0f2c5d] via-[#5f6f90] to-[#101a35] opacity-90" />
            <span className="absolute inset-0 flex items-center justify-center text-[11rem] leading-none font-black text-white mix-blend-screen sm:text-[13rem] md:text-[15rem]">
              G
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
