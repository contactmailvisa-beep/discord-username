import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { NavSection } from "@/pages/Docs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocsSidebarProps {
  navSections: NavSection[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const DocsSidebar = ({
  navSections,
  activeSection,
  onSectionChange,
  isOpen,
  onClose
}: DocsSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    navSections[0]?.id || "introduction"
  ]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r border-[#1a1c20] bg-[#13141a] transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ScrollArea className="h-full py-6 px-3">
          <nav className="space-y-1">
            {navSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  activeSection === section.id
                    ? "bg-[#22c55e] text-white shadow-md"
                    : "text-[#a1a1aa] hover:text-white hover:bg-[#1a1c20]"
                )}
              >
                {section.icon}
                <span>{section.title}</span>
              </button>
            ))}
          </nav>
        </ScrollArea>
      </aside>
    </>
  );
};

export default DocsSidebar;
