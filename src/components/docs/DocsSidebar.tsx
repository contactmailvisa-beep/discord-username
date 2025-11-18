import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavSection } from "@/pages/Docs";

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
          "fixed top-20 left-0 z-[1000] h-[calc(100vh-10rem)] w-[240px] p-3 transition-transform duration-300 lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex-1 flex flex-col bg-[#0a0a0a] rounded-3xl shadow-xl overflow-hidden border-2 border-[#22c55e]/50 shadow-[0_0_50px_rgba(34,197,94,0.6),0_0_100px_rgba(34,197,94,0.3)]">
          <div className="flex-1 overflow-hidden p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[11px] font-bold text-[#6b7280] uppercase tracking-widest">
                API & INTEGRATIONS
              </h2>
              <button
                onClick={onClose}
                className="lg:hidden text-[#6b7280] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-1.5 overflow-hidden">
              {navSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-3.5 text-[15px] font-medium rounded-xl transition-all duration-150 group",
                    activeSection === section.id
                      ? "bg-[#16a34a]/20 text-[#22c55e]"
                      : "text-[#9ca3af] hover:text-white hover:bg-[#1f1f1f]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "transition-colors",
                      activeSection === section.id ? "text-[#22c55e]" : "text-[#6b7280]"
                    )}>
                      {section.icon}
                    </span>
                    <span>{section.title}</span>
                  </div>
                  {activeSection === section.id && (
                    <ChevronRight className="w-4 h-4 text-[#22c55e]" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#1f1f1f] flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#6b7280]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
              <span className="font-medium">Powered by DUC</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DocsSidebar;
