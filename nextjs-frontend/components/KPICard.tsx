"use client";

import React, { ReactNode, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/app/charts/GetChartData";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface KPICardProps {
  title: string;
  description?: string;
  body: string | ReactNode;
  isChart?: boolean;
  queryKey?: string;
}

const KPICard = ({
  title,
  description,
  body,
  isChart = false,
  queryKey,
}: KPICardProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date("2025-01-01T00:00:00Z"),
    to: new Date("2025-12-31T23:59:59Z"),
  });

  const [open, setOpen] = useState(false);

  const selectedRangeLabel = `${formatDate(dateRange?.from || new Date("2025-01-01T00:00:00Z"))} - ${formatDate(dateRange?.to || new Date("2025-12-31T23:59:59Z"))}`;

  function setRange(dateRange: DateRange) {
    const params = new URLSearchParams(searchParams.toString());

    if (dateRange.from == null || dateRange.to == null) return;
    params.set(`${queryKey}From`, dateRange.from.toISOString());
    params.set(`${queryKey}To`, dateRange.to.toISOString());

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        {isChart ? (
          <div className="flex gap-4 justify-between items-center">
            <CardTitle>{title}</CardTitle>
            {!open && (
              <button
                onClick={() => setOpen(true)}
                className="border border-gray-200 rounded-full w-auto h-auto font-semibold items-center justify-center p-2"
              >
                {selectedRangeLabel}
              </button>
            )}
            {open && (
              <div className="flex-col justify-center rounded-full w-auto h-auto gap-1">
                <Calendar
                  mode="range"
                  disabled={{ after: new Date() }}
                  selected={dateRange}
                  defaultMonth={dateRange?.from}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
                <Button
                  className={"hover:bg-auto w-full"}
                  disabled={dateRange == null}
                  onClick={() => {
                    if (dateRange == null) return;
                    setOpen(false);
                    setRange(dateRange);
                  }}
                >
                  Submit
                </Button>
              </div>
            )}
          </div>
        ) : (
          <CardTitle>{title}</CardTitle>
        )}
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  );
};

export default KPICard;
