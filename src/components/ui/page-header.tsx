import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900 dark:text-white text-2xl font-bold">
            {title}
          </h1>
          {description && (
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex gap-3">{children}</div>}
      </div>
    </div>
  );
}

interface PageHeaderWithSearchProps extends PageHeaderProps {
  searchComponent: React.ReactNode;
}

export function PageHeaderWithSearch({
  title,
  description,
  children,
  searchComponent,
}: PageHeaderWithSearchProps) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900 dark:text-white text-2xl font-bold">
            {title}
          </h1>
          {description && (
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex gap-3">{children}</div>}
      </div>
      {searchComponent && <div>{searchComponent}</div>}
    </div>
  );
}
