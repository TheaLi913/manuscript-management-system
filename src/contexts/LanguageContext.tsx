import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.manuscripts': 'Manuscripts',
    'nav.logout': 'Logout',
    'nav.journalPlatform': 'Journal Platform',
    'nav.navigation': 'Navigation',
    
    // Common
    'common.search': 'Search',
    'common.reset': 'Reset',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.submit': 'Submit',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.date': 'Date',
    
    // Add more translations as needed
  },
  zh: {
    // Navigation
    'nav.dashboard': '仪表板',
    'nav.manuscripts': '稿件管理',
    'nav.logout': '退出登录',
    'nav.journalPlatform': '期刊平台',
    'nav.navigation': '导航',
    
    // Common
    'common.search': '搜索',
    'common.reset': '重置',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.submit': '提交',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.actions': '操作',
    'common.status': '状态',
    'common.date': '日期',
    
    // Add more translations as needed
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
