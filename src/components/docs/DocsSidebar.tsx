import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-72 border-r border-[#2d2e32] bg-[#1a1b1e] transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ScrollArea className="h-full">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-bold text-[#8b8d94] uppercase tracking-wider">
                API & INTEGRATIONS
              </h2>
              <button
                onClick={onClose}
                className="lg:hidden text-[#8b8d94] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {navSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                    activeSection === section.id
                      ? "bg-[#22c55e]/10 text-[#22c55e]"
                      : "text-[#8b8d94] hover:text-white hover:bg-[#25262b]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {section.icon}
                    <span>{section.title}</span>
                  </div>
                  {activeSection === section.id && (
                    <ChevronRight className="w-4 h-4 text-[#22c55e]" />
                  )}
                </button>
              ))}
            </nav>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-[#2d2e32]">
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-[#8b8d94]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
                <span>Powered by DUC</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
};

export default DocsSidebar;
