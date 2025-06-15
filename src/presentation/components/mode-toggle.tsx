import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useId } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const id = useId();

  return (
    <label
      className="group border-input bg-card dark:bg-background text-foreground hover:bg-accent hover:text-accent-foreground peer-focus-visible:border-ring peer-focus-visible:ring-ring/50 relative inline-flex size-9 items-center justify-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px]"
      htmlFor={id}
      role="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
    >
      <Moon
        size={16}
        className="shrink-0 scale-0 opacity-0 transition-all group-peer-checked:scale-100 group-peer-checked:opacity-100"
        aria-hidden="true"
      />
      <Sun
        size={16}
        className="absolute shrink-0 scale-100 opacity-100 transition-all group-peer-checked:scale-0 group-peer-checked:opacity-0"
        aria-hidden="true"
      />
    </label>
  );
}
