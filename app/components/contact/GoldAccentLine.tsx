interface GoldAccentLineProps {
  className?: string;
  width?: string;
}

export default function GoldAccentLine({
  className = "",
  width = "w-24",
}: GoldAccentLineProps) {
  return (
    <div className={`flex items-center ${width} ${className}`} aria-hidden>
      <div className="h-px flex-1 bg-[#c9a227]" />
      <div className="mx-0.5 h-1 w-6 bg-[#c9a227]" />
      <div className="h-px flex-1 bg-[#c9a227]" />
    </div>
  );
}
