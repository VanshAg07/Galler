import { resolveUploadSrc } from "@/app/lib/resolveUploadSrc";

export interface TeamMember {
  id: string;
  name: string;
  photo: string;
  linkedin: string;
  instagram: string;
  description: string;
}

interface AboutTeamSectionProps {
  heading?: string;
  subtitle?: string;
  members?: TeamMember[];
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-12h4v2a4 4 0 0 1 4-4zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function normalizeUrl(url?: string): string | null {
  const trimmed = url?.trim();
  if (!trimmed || trimmed === "#") return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function AboutTeamSection({
  heading = "OUR TEAM",
  subtitle,
  members = [],
}: AboutTeamSectionProps) {
  const visibleMembers = members.filter((member) => member.name || member.photo || member.description);
  if (visibleMembers.length === 0) return null;

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="text-center">
          <h2 className="font-serif text-3xl tracking-[0.15em] text-[#1a1a1a] sm:text-4xl">
            {heading}
          </h2>
          {subtitle ? (
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#555] sm:text-lg">{subtitle}</p>
          ) : null}
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10">
          {visibleMembers.map((member) => {
            const linkedinUrl = normalizeUrl(member.linkedin);
            const instagramUrl = normalizeUrl(member.instagram);
            const photoSrc = member.photo ? resolveUploadSrc(member.photo) : null;

            return (
              <li key={member.id} className="flex flex-col items-center text-center">
                <div className="relative h-40 w-40 overflow-hidden rounded-full bg-[#eef1f5] shadow-md sm:h-44 sm:w-44">
                  {photoSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoSrc}
                      alt={member.name || "Team member"}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-[#0b1f4a]/30">
                      {member.name?.charAt(0) || "?"}
                    </div>
                  )}
                </div>

                <h3 className="mt-5 text-xl font-medium tracking-wide text-[#1a1a1a] sm:text-2xl">
                  {member.name}
                </h3>

                {(linkedinUrl || instagramUrl) && (
                  <div className="mt-3 flex items-center justify-center gap-3">
                    {linkedinUrl ? (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#0b1f4a]/15 text-[#0b1f4a] transition-colors hover:border-[#0b1f4a] hover:bg-[#0b1f4a] hover:text-white"
                      >
                        <LinkedInIcon />
                      </a>
                    ) : null}
                    {instagramUrl ? (
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on Instagram`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#0b1f4a]/15 text-[#0b1f4a] transition-colors hover:border-[#0b1f4a] hover:bg-[#0b1f4a] hover:text-white"
                      >
                        <InstagramIcon />
                      </a>
                    ) : null}
                  </div>
                )}

                {member.description ? (
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#555] sm:text-[0.95rem]">
                    {member.description}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
