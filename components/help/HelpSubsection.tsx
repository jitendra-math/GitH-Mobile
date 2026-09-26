interface HelpSubsectionProps {
  id?: string;
  title: string;
  children: React.ReactNode;
}

export default function HelpSubsection({
  id,
  title,
  children,
}: HelpSubsectionProps) {
  return (
    <div className="mt-5 first:mt-0 scroll-mt-32" id={id}>
      <h3 className="text-[15px] font-semibold text-black tracking-tight leading-tight">
        {title}
      </h3>
      <div className="mt-2.5 flex flex-col gap-3 text-[14px] text-black/85 leading-relaxed">
        {children}
      </div>
    </div>
  );
}