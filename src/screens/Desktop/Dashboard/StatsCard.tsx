import React from "react";
import { Card } from "../../../components/ui/card";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  iconColor: string;
}

export function StatsCard({ icon, title, value, iconColor }: StatsCardProps) {
  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`${iconColor} p-3 rounded-xl text-emerald`}>{icon}</div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
          <p
            className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-[200px]"
            title={value}
          >
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default StatsCard;
