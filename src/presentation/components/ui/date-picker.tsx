import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import { Calendar } from "@/presentation/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/presentation/components/ui/popover";
import { formatDateFromPattern } from "@/domain/utils/date";

interface DatePickerProps {
  value?: Date;
  onChange?: (value?: Date) => void;
  placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);

  const handleChangeDate = (date?: Date) => {
    setDate(date);
    onChange?.(date);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground !bg-background w-full justify-between gap-2 text-left font-normal"
        >
          {date ? formatDateFromPattern(date, "dd/MM/yyyy") : <span>{placeholder ?? "Sélectionner une date"}</span>}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleChangeDate} />
      </PopoverContent>
    </Popover>
  );
}
