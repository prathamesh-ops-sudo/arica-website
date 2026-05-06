import React from "react";
import { Button } from "@/components/ui/button";

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const CalendarDay: React.FC<{ day: number | string; isHeader?: boolean; isHighlighted?: boolean }> = ({
  day,
  isHeader,
  isHighlighted,
}) => {
  return (
    <div
      className={`col-span-1 row-span-1 flex h-8 w-8 items-center justify-center ${
        isHeader ? "" : "rounded-xl"
      } ${isHighlighted ? "bg-[#3D70B7] text-white" : "text-muted-foreground"}`}
    >
      <span className={`font-medium ${isHeader ? "text-xs" : "text-sm"}`}>
        {day}
      </span>
    </div>
  );
};

export function BookingCalendar() {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();
  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(
    currentYear,
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const renderCalendarDays = () => {
    const days: React.ReactNode[] = [
      ...dayNames.map((day) => (
        <CalendarDay key={`header-${day}`} day={day} isHeader />
      )),
      ...Array(firstDayOfWeek)
        .fill(null)
        .map((_, i) => (
          <div
            key={`empty-start-${i}`}
            className="col-span-1 row-span-1 h-8 w-8"
          />
        )),
      ...Array(daysInMonth)
        .fill(null)
        .map((_, i) => (
          <CalendarDay
            key={`date-${i + 1}`}
            day={i + 1}
            isHighlighted={i + 1 === currentDay}
          />
        )),
    ];

    return days;
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-[#3D70B7]/20 bg-card p-6 hover:border-[#3D70B7]/40 transition-colors overflow-hidden">
      <div className="grid h-full gap-5">
        <div>
          <h2 className="mb-4 text-lg md:text-2xl font-semibold">
            Schedule a Security Consultation
          </h2>
          <p className="mb-2 text-xs md:text-sm text-muted-foreground">
            Book a free 30-minute consultation with our security experts.
          </p>
          <a href="mailto:contact@aricatech.com?subject=Security%20Consultation%20Request">
            <Button className="mt-3 rounded-2xl bg-[#3D70B7] hover:bg-[#3D70B7]/90 text-white">
              Book Now
            </Button>
          </a>
        </div>
        <div>
          <div className="w-full rounded-[24px] border border-[#3D70B7]/20 p-2 transition-colors duration-100 group-hover:border-[#3D70B7]/40">
            <div
              className="rounded-2xl border-2 border-[#3D70B7]/10 p-3"
              style={{ boxShadow: "0px 2px 1.5px 0px rgba(61,112,183,0.2) inset" }}
            >
              <div className="flex items-center space-x-2">
                <p className="text-sm">
                  <span className="font-medium">
                    {currentMonth}, {currentYear}
                  </span>
                </p>
                <span className="h-1 w-1 rounded-full bg-[#3D70B7]">&nbsp;</span>
                <p className="text-xs text-muted-foreground">30 min call</p>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-2 px-2 md:px-4">
                {renderCalendarDays()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
