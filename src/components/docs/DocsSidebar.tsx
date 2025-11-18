import { useState } from "react";
import { ChevronRight, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavSection } from "@/pages/Docs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const [openSections, setOpenSections] = useState<string[]>([]);

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
    onClose();
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
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
        <div className="flex-1 flex flex-col bg-[#0a0a0a] rounded-3xl shadow-xl overflow-hidden border-2 border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.6),0_0_40px_rgba(34,197,94,0.4),0_0_60px_rgba(34,197,94,0.3),0_0_80px_rgba(34,197,94,0.2)] animate-pulse-glow">
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
                section.subsections ? (
                  <Collapsible
                    key={section.id}
                    open={openSections.includes(section.id)}
                    onOpenChange={() => toggleSection(section.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center justify-between w-full px-4 py-3.5 text-[15px] font-medium rounded-xl transition-all duration-150 group",
                          activeSection === section.id || section.subsections.some(sub => sub.id === activeSection)
                            ? "bg-[#16a34a]/20 text-[#22c55e]"
                            : "text-[#9ca3af] hover:text-white hover:bg-[#1f1f1f]"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "transition-colors",
                            activeSection === section.id || section.subsections.some(sub => sub.id === activeSection)
                              ? "text-[#22c55e]"
                              : "text-[#6b7280]"
                          )}>
                            {section.icon}
                          </span>
                          <span>{section.title}</span>
                        </div>
                        <ChevronDown className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          openSections.includes(section.id) ? "rotate-180" : "",
                          activeSection === section.id || section.subsections.some(sub => sub.id === activeSection)
                            ? "text-[#22c55e]"
                            : "text-[#6b7280]"
                        )} />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-1 animate-accordion-down">
                      {section.subsections.map((subsection) => (
                        <button
                          key={subsection.id}
                          onClick={() => handleSectionClick(subsection.id)}
                          className={cn(
                            "flex items-center w-full pl-12 pr-4 py-2.5 text-[14px] font-medium rounded-xl transition-all duration-150",
                            activeSection === subsection.id
                              ? "bg-[#16a34a]/20 text-[#22c55e]"
                              : "text-[#9ca3af] hover:text-white hover:bg-[#1f1f1f]"
                          )}
                        >
                          <span>{subsection.title}</span>
                          {activeSection === subsection.id && (
                            <ChevronRight className="w-4 h-4 text-[#22c55e] ml-auto" />
                          )}
                        </button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
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
                )
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
