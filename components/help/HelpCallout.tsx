import {
  Info,
  Lightbulb,
  AlertTriangle,
  XCircle,
  ShieldAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CalloutType = "info" | "tip" | "warning" | "error" | "danger";

interface HelpCalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const CONFIG: Record<
  CalloutType,
  {
    icon: LucideIcon;
    color: string;
    bg: string;
  }
> = {
  info: {
    icon: Info,
    color: "#007AFF",
    bg: "rgba(0, 122, 255, 0.08)",
  },
  tip: {
    icon: Lightbulb,
    color: "#34C759",
    bg: "rgba(52, 199, 89, 0.08)",
  },
  warning: {
    icon: AlertTriangle,
    color: "#FF9500",
    bg: "rgba(255, 149, 0, 0.08)",
  },
  error: {
    icon: XCircle,
    color: "#FF3B30",
    bg: "rgba(255, 59, 48, 0.08)",
  },
  danger: {
    icon: ShieldAlert,
    color: "#FF3B30",
    bg: "rgba(255, 59, 48, 0.12)",
  },
};

export default function HelpCallout({
  type = "info",
  title,
  children,
}: HelpCalloutProps) {
  const config = CONFIG[type];
  const Icon = config.icon;

  return (
    <div
      className="rounded-xl p-3.5 flex gap-3 mt-4"
      style={{
        backgroundColor: config.bg,
        borderLeft: `3px solid ${config.color}`,
      }}
    >
      <div className="shrink-0 pt-0.5">
        <Icon
          className="w-[18px] h-[18px]"
          strokeWidth={2.3}
          style={{ color: config.color }}
        />
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <p
            className="text-[14px] font-semibold leading-tight"
            style={{ color: config.color }}
          >
            {title}
          </p>
        )}
        <div
          className={`text-[14px] text-black/85 leading-relaxed ${
            title ? "mt-1" : ""
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}