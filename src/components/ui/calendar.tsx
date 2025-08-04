
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, DropdownProps } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { ScrollArea } from "./scroll-area"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium hidden",
        caption_dropdowns: "flex justify-center gap-2",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-0"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        Dropdown: (props: DropdownProps) => {
          const { fromYear, fromMonth, fromDate, toYear, toMonth, toDate } =
            props.from || {};
          const {
            caption,
            value,
            onChange,
            children,
            "aria-label": ariaLabel,
          } = props;
          const options = React.Children.toArray(
            children
          ) as React.ReactElement<React.HTMLProps<HTMLOptionElement>>[];

          const handleChange = (newValue: string) => {
            if (props.name === "months") {
              const newDate = new Date(props.displayMonth);
              newDate.setMonth(parseInt(newValue));
              onChange?.({
                target: { value: newDate.getMonth().toString() },
              } as any);
            } else if (props.name === "years") {
              const newDate = new Date(props.displayMonth);
              newDate.setFullYear(parseInt(newValue));
               onChange?.({
                target: { value: newDate.getFullYear().toString() },
              } as any);
            }
          };
          
          const currentYear = new Date().getFullYear();
          const yearOptions = Array.from({ length: toYear ? toYear - currentYear + 1 : 11 }, (_, i) => {
            const year = fromYear ? fromYear + i : currentYear + i;
            return { label: year.toString(), value: year.toString() };
          });


          return (
            <Select
              value={String(value)}
              onValueChange={handleChange}
              aria-label={ariaLabel}
            >
              <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder={caption}>{caption}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-48">
                  {props.name === "months" ? options.map((option) => (
                    <SelectItem
                      key={option.props.value}
                      value={option.props.value as string}
                    >
                      {option.props.children}
                    </SelectItem>
                  )) : yearOptions.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          );
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
