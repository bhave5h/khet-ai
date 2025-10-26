// import { Moon, Sun } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";

// export function ThemeToggle() {
//   const [theme, setTheme] = useState<"dark" | "light">("light");

//   useEffect(() => {
//     const root = window.document.documentElement;
//     const initialColorValue = root.style.getPropertyValue("--initial-color-mode");
//     setTheme(initialColorValue as "dark" | "light" || "light");
//   }, []);

//   useEffect(() => {
//     const root = window.document.documentElement;
//     root.classList.remove("light", "dark");
//     root.classList.add(theme);
//   }, [theme]);

//   return (
//     <Button
//       variant="ghost"
//       size="icon"
//       onClick={() => setTheme(theme === "light" ? "dark" : "light")}
//       className="transition-farm"
//     >
//       <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//       <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//       <span className="sr-only">Toggle theme</span>
//     </Button>
//   );
// }


// import { Moon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useEffect } from "react";

// export function ThemeToggle() {
//   useEffect(() => {
//     const root = window.document.documentElement;
//     root.classList.remove("light");
//     root.classList.add("dark");
//   }, []);

//   return (
//     <Button
//       variant="ghost"
//       size="icon"
//       disabled
//       className="transition-farm cursor-default"
//     >
//       <Moon className="h-[1.2rem] w-[1.2rem]" />
//       <span className="sr-only">Dark theme enabled</span>
//     </Button>
//   );
// }
