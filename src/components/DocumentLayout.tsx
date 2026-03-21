import React from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import jkLogo from "@/assets/jkcement_logo.png";

interface DocumentLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DocumentLayout = ({ children, title }: DocumentLayoutProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="animate-in fade-in duration-700">
        {children}
      </main>
    </div>
  );
};

export default DocumentLayout;
