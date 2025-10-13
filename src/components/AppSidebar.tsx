import { LayoutDashboard, FileText, LogOut, Languages } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { state } = useSidebar();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const menuItems = [
    {
      title: t('nav.dashboard'),
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: t('nav.manuscripts'),
      url: '/manuscripts',
      icon: FileText,
    },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar 
      className={`border-r border-border ${isCollapsed ? "w-14" : "w-60"}`}
      collapsible="icon"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-sm">{t('nav.journalPlatform')}</h2>
              <p className="text-xs text-muted-foreground">
                {user?.role} - {user?.username}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Button 
            variant="ghost" 
            size="sm"
            className={`${isCollapsed ? "w-10 h-10 p-0" : ""} gap-1`}
            onClick={toggleLanguage}
          >
            <Languages className="w-4 h-4" />
            {!isCollapsed && (
              <span className="text-xs">{language === 'en' ? '中文' : 'EN'}</span>
            )}
          </Button>
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>{t('nav.navigation')}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button 
          variant="outline" 
          className={`${isCollapsed ? "w-10 h-10 p-0" : "w-full"} justify-${isCollapsed ? "center" : "start"} gap-2`}
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && t('nav.logout')}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}