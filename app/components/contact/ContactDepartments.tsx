import { FaRegUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { SlEarphonesAlt } from "react-icons/sl";

interface Department {
  title: string;
  description: string;
  email: string;
  icon: "headset" | "gear" | "person";
}

interface ContactDepartmentsProps {
  departments?: Department[];
}

const DEFAULT_DEPARTMENTS: Department[] = [
  {
    title: "SALES ENQUIRIES",
    description: "For product information and quotations",
    email: "sales@gallerindia.com",
    icon: "headset",
  },
  {
    title: "TECHNICAL SUPPORT",
    description: "For technical assistance and product support",
    email: "support@gallerindia.com",
    icon: "gear",
  },
  {
    title: "CAREERS",
    description: "Explore career opportunities with us",
    email: "careers@gallerindia.com",
    icon: "person",
  },
];

function DepartmentIcon({ type }: { type: Department["icon"] }) {
  const icons = {
    headset: SlEarphonesAlt,
    gear: IoSettingsOutline,
    person: FaRegUser,
  };
  const Icon = icons[type];

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#e8e0d0] bg-white text-[#c9a227]">
      <Icon className="h-6 w-6" aria-hidden />
    </div>
  );
}

export default function ContactDepartments({
  departments = DEFAULT_DEPARTMENTS,
}: ContactDepartmentsProps) {
  return (
    <section className="border-t border-[#e5e5e5] bg-white py-14 sm:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 sm:grid-cols-3 sm:gap-0 lg:px-10">
        {departments.map((dept, index) => (
          <div
            key={dept.title}
            className={`flex gap-4 sm:gap-5 sm:px-8 ${
              index < departments.length - 1 ? "sm:border-r sm:border-[#e5e5e5]" : ""
            } ${index === 0 ? "sm:pl-0" : ""} ${index === departments.length - 1 ? "sm:pr-0" : ""}`}
          >
            <DepartmentIcon type={dept.icon} />
            <div className="min-w-0 pt-0.5">
              <h3 className="text-sm font-bold tracking-wider text-[#0b1f4a]">{dept.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4a4a4a]">{dept.description}</p>
              <a
                href={`mailto:${dept.email}`}
                className="mt-3 inline-block text-sm font-medium text-[#c9a227] transition-colors hover:text-[#a8871f]"
              >
                {dept.email}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
