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
          "fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 border-r border-border bg-background-secondary transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ScrollArea className="h-full py-6 px-4">
          <nav className="space-y-1">
            {navSections.map((section) => (
              <div key={section.id} className="space-y-1">
                <button
                  onClick={() => {
                    toggleSection(section.id);
                    handleSectionClick(section.id);
                  }}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-foreground hover:bg-background-accent/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "transition-colors",
                        activeSection === section.id
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {section.icon}
                    </span>
                    <span>{section.title}</span>
                  </div>
                  {section.subsections && (
                    <span className="text-xs">
                      {expandedSections.includes(section.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </button>

                {/* Subsections */}
                {section.subsections && expandedSections.includes(section.id) && (
                  <div className="ml-7 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {section.subsections.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleSectionClick(section.id)}
                        className="block w-full text-left px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-background-accent/30 rounded-md transition-colors"
                      >
                        {sub.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </aside>
    </>
  );
};

export default DocsSidebar;
