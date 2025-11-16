interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  gradientFrom?: string; // tailwind from-* class
  gradientTo?: string; // tailwind to-* class
}

export function ScreenHeader({
  title,
  subtitle,
  gradientFrom = "from-emerald-500",
  gradientTo = "to-emerald-700",
}: ScreenHeaderProps) {
  const gradientClass = `bg-gradient-to-br ${gradientFrom} via-emerald-600 ${gradientTo}`;
  return (
    <div className="relative z-10 p-6 pt-12">
      <div className="m-[0px]">
        <h1 className="text-white text-3xl mb-2 text-[24px]">{title}</h1>
        {subtitle && <p className="text-emerald-100">{subtitle}</p>}
      </div>
    </div>
  );
}
