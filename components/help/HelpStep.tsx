interface HelpStepProps {
  number: number;
  title: string;
  children?: React.ReactNode;
}

export default function HelpStep({
  number,
  title,
  children,
}: HelpStepProps) {
  return (
    <div className="flex gap-3">
      {/* Left: Number circle + vertical connector */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-7 h-7 rounded-full bg-[#007AFF] text-white text-[14px] font-bold flex items-center justify-center">
          {number}
        </div>
        {children && (
          <div className="w-px flex-1 bg-[#C6C6C8]/50 mt-1.5 min-h-[12px]" />
        )}
      </div>

      {/* Right: Content */}
      <div className="flex-1 min-w-0 pb-3 last:pb-0">
        <p className="text-[15px] font-semibold text-black leading-tight">
          {title}
        </p>
        {children && (
          <div className="mt-1.5 text-[14px] text-black/85 leading-relaxed flex flex-col gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}