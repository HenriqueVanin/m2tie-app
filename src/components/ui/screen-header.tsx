interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export function ScreenHeader({
  title,
  subtitle,
  gradientFrom = "from-emerald-600",
  gradientTo = "to-emerald-700",
}: ScreenHeaderProps) {
  return (
    <>
      {/* Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo}`}
      ></div>

      {/* Header */}
      <div className="relative z-10 p-6 pt-12">
        <div className="m-[0px]">
          <h1 className="text-white text-3xl mb-2 text-[24px]">{title}</h1>
          {subtitle && <p className="text-emerald-100">{subtitle}</p>}
        </div>
      </div>
    </>
  );
}
