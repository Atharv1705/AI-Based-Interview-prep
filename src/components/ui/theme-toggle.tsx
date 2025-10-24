import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ButtonProps } from "@/components/ui/button"
import { useTheme } from "@/components/ui/theme-provider"
import { cn } from "@/lib/utils"

type ThemeToggleProps = Partial<ButtonProps>

export function ThemeToggle({ className, size = "icon", variant = "ghost", ...props }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  const handleClick: ButtonProps["onClick"] = (e) => {
    setTheme(theme === "light" ? "dark" : "light")
    // Call user provided onClick if present
    if (typeof props.onClick === "function") {
      // @ts-ignore
      props.onClick(e)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn("relative overflow-hidden z-10 p-0", className)}
      {...props}
    >
      <Sun className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}