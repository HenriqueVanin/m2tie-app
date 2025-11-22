"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-4 rounded-xl shadow-md bg-card max-w-xs mx-auto sm:max-w-md sm:p-6",
        className
      )}
      classNames={{
        months:
          "flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center items-start",
        month: "space-y-4 w-full",
        caption: "flex justify-between items-center px-2 py-1 relative",
        caption_label: "text-base font-medium text-foreground",
        nav: "flex items-center gap-2",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-input text-foreground p-0 rounded-md border border-border hover:bg-secondary focus:ring-2 focus:ring-ring transition"
        ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse",
        head_row: "flex w-full",
        head_cell:
          "text-muted-foreground rounded-md w-9 h-9 font-normal text-xs flex items-center justify-center",
        row: "flex w-full",
        cell: "h-9 w-9 text-center p-0 relative focus-within:z-10",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-base rounded-md transition aria-selected:opacity-100"
        ),
        day_range_start: "ring-2 ring-primary",
        day_range_end: "ring-2 ring-primary",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
        day_today: "bg-accent text-accent-foreground border border-primary",
        day_outside: "text-muted-foreground opacity-40",
        day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
        day_range_middle: "bg-accent text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-5 w-5" />,
        IconRight: () => <ChevronRight className="h-5 w-5" />,
      }}
      {...props}
    />
  );
}
