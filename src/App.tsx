import Header from "./components/layout/Header";
import { Toaster } from "./components/ui/sonner";
import Section from "./components/Section";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="h-screen w-full">
        <Header />
        <Section />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
