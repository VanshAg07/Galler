import aboutBanner from "@/Assets/aboutbanner.jpg";
import { resolveUploadSrc } from "@/app/lib/resolveUploadSrc";
import GoldAccentLine from "./GoldAccentLine";

interface Plant {
  name: string;
  address: string;
  image?: string;
}

interface ContactLocationsProps {
  plants?: Plant[];
}

const DEFAULT_PLANTS: Plant[] = [
  {
    name: "PLANT 1 – NOIDA",
    address: "A-37, Sector 58, Noida, Uttar Pradesh – 201301, India",
  },
  {
    name: "PLANT 2 – GREATER NOIDA",
    address: "D-14, UPSIDC Industrial Area, Greater Noida, Uttar Pradesh – 201306, India",
  },
  {
    name: "PLANT 3 – DEHRADUN",
    address: "Plot No. 12, Selakui Industrial Area, Dehradun, Uttarakhand – 248197, India",
  },
  {
    name: "PLANT 4 – BANGALORE",
    address:
      "No. 25, KIADB Industrial Area, Electronics City Phase 2, Bangalore, Karnataka – 560100, India",
  },
];

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Plot+No.+620,+Sector+8+Rd,+Sector+8,+Imt+Manesar,+Gurugram,+Haryana+122050,+India&hl=en&z=16&output=embed";

export default function ContactLocations({ plants = DEFAULT_PLANTS }: ContactLocationsProps) {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:gap-14 lg:px-10">
        {/* Our Location */}
        <div>
          <h2 className="font-serif text-2xl tracking-[0.1em] text-[#0b1f4a] sm:text-3xl">
            OUR LOCATION
          </h2>
          <GoldAccentLine className="mt-4" />
          <div className="mt-8 overflow-hidden rounded-sm border border-[#e5e5e5] shadow-sm">
            <iframe
              title="Galler India Pvt. Ltd. location"
              src={MAP_EMBED_URL}
              className="h-[320px] w-full border-0 sm:h-[380px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        {/* Our Plants */}
        <div>
          <h2 className="font-serif text-2xl tracking-[0.1em] text-[#0b1f4a] sm:text-3xl">
            OUR PLANTS
          </h2>
          <GoldAccentLine className="mt-4" />
          <ul className="mt-8 space-y-6">
            {plants.map((plant) => {
              const imageSrc = plant.image ? resolveUploadSrc(plant.image) : aboutBanner.src;

              return (
              <li key={plant.name} className="flex gap-4">
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-sm border border-[#e5e5e5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt=""
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="min-w-0 pt-1">
                  <p className="text-xs font-bold tracking-wider text-[#0b1f4a]">{plant.name}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#4a4a4a]">{plant.address}</p>
                </div>
              </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
