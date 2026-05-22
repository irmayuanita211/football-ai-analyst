'use client';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function Sidebar({ tabs, activeTab, onTabChange }: SidebarProps) {
  return (
    <>
      {/* Mobile: horizontal scrollable bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2 mr-4 shrink-0">
            <span className="text-2xl">⚽</span>
            <span className="text-lg font-bold text-gradient">FA</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-brand-500/10 border border-brand-500/30 text-brand-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: fixed left sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 z-40">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-800">
          <span className="text-3xl">⚽</span>
          <span className="text-xl font-bold text-gradient">FA</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-brand-500/10 border-l-4 border-brand-500 text-brand-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border-l-4 border-transparent'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">Made with ❤️</p>
        </div>
      </aside>
    </>
  );
}
