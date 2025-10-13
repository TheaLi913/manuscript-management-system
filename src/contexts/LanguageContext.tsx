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
    
    // Login Page
    'login.title': 'Journal Management',
    'login.subtitle': 'Sign in to your account to manage manuscripts',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.usernamePlaceholder': 'Enter your username',
    'login.passwordPlaceholder': 'Enter your password',
    'login.button': 'Login',
    'login.signingIn': 'Signing in...',
    'login.demoCredentials': 'Demo Credentials:',
    'login.editor': 'Editor',
    'login.reviewer': 'Reviewer',
    'login.successTitle': 'Login successful',
    'login.successDesc': 'Welcome to the Journal Management Platform',
    'login.failedTitle': 'Login failed',
    'login.failedDesc': 'Invalid username or password',
    'login.errorTitle': 'Login error',
    'login.errorDesc': 'An unexpected error occurred',
    
    // Dashboard Page
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back, {username}. Here\'s an overview of your {role} activities.',
    'dashboard.statistics': 'Manuscript Statistics',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.newSubmitted': 'New manuscript submitted',
    'dashboard.reviewCompleted': 'Review completed for MS-2024-001',
    'dashboard.decisionMade': 'Decision made on MS-2024-003',
    'dashboard.hoursAgo': '{hours} hours ago',
    'dashboard.dayAgo': '{days} day ago',
    'dashboard.daysAgo': '{days} days ago',
    'dashboard.viewAllManuscripts': 'View All Manuscripts',
    'dashboard.browseManage': 'Browse and manage submissions',
    'dashboard.assignReviewers': 'Assign Reviewers',
    'dashboard.submitReview': 'Submit Review',
    'dashboard.manageAssignments': 'Manage reviewer assignments',
    'dashboard.completePending': 'Complete pending reviews',
    
    // Dashboard Stats
    'stats.waitingForReview': 'Waiting for Review',
    'stats.pendingReviewer': 'Pending Reviewer',
    'stats.assignedReviewer': 'Assigned Reviewer',
    'stats.waitingForDecision': 'Waiting for Decision',
    'stats.completed': 'Completed',
    'stats.reviewInvitation': 'Review Invitation',
    'stats.reviewCompleted': 'Review Completed',
    'stats.rejected': 'Rejected',
    
    // Manuscripts Page
    'manuscripts.title': 'Manuscript Management',
    'manuscripts.overview': 'View and manage all manuscript submissions',
    'manuscripts.allManuscripts': 'All Manuscripts',
    'manuscripts.searchPlaceholder': 'Search by title, author, or ID...',
    'manuscripts.filterByStatus': 'Filter by Status',
    'manuscripts.allStatuses': 'All Statuses',
    'manuscripts.manuscriptId': 'Manuscript ID',
    'manuscripts.submitter': 'Submitter',
    'manuscripts.title2': 'Title',
    'manuscripts.keywords': 'Keywords',
    'manuscripts.authors': 'Authors',
    'manuscripts.submissionDate': 'Submission Date',
    'manuscripts.itemsPerPage': 'items per page',
    'manuscripts.showing': 'Showing',
    'manuscripts.to': 'to',
    'manuscripts.of': 'of',
    'manuscripts.results': 'results',
    
    // Manuscripts Tabs (Reviewer)
    'manuscripts.reviewInvitation': 'Review Invitation',
    'manuscripts.waitingForReview': 'Waiting for Review',
    'manuscripts.reviewCompleted': 'Review Completed',
    'manuscripts.rejectedInvitations': 'Rejected Invitations',
    
    // Manuscripts Tabs (Editor)
    'manuscripts.pendingReviewer': 'Pending Reviewer',
    'manuscripts.assignedReviewer': 'Assigned Reviewer',
    'manuscripts.waitingForDecision': 'Waiting for Decision',
    
    // Manuscripts Table Headers
    'manuscripts.abstract': 'Abstract',
    'manuscripts.editor': 'Editor',
    'manuscripts.invitedDate': 'Invited Date',
    'manuscripts.dueDate': 'Due Date',
    'manuscripts.reviewers': 'Reviewers',
    'manuscripts.reviewDeadline': 'Review Deadline',
    'manuscripts.rejectedDate': 'Rejected Date',
    'manuscripts.reason': 'Reason',
    
    // Manuscripts Actions
    'manuscripts.accept': 'Accept',
    'manuscripts.reject': 'Reject',
    'manuscripts.downloadManuscript': 'Download Manuscript',
    'manuscripts.downloadAllFiles': 'Download All Files',
    'manuscripts.submitReview': 'Submit Review',
    'manuscripts.viewReviews': 'View Reviews',
    'manuscripts.assignReviewer': 'Assign Reviewer',
    'manuscripts.sendBack': 'Send Back',
    'manuscripts.makeDecision': 'Make Decision',
    'manuscripts.viewDetails': 'View Details',
    'manuscripts.remindReviewer': 'Remind Reviewer',
    'manuscripts.revertDecision': 'Revert Decision',
    
    // Dialog Titles
    'dialog.rejectInvitation': 'Reject Review Invitation',
    'dialog.submitReview': 'Submit Review',
    'dialog.assignReviewer': 'Assign Reviewer',
    'dialog.sendBackToAuthor': 'Send Back to Author',
    'dialog.makeDecision': 'Make Decision',
    'dialog.reviewerDetails': 'Reviewer Details',
    'dialog.manuscriptDetails': 'Manuscript Details',
    
    // Form Labels
    'form.selectReason': 'Select rejection reason',
    'form.pleaseSelect': 'Please select...',
    'form.conflictOfInterest': 'Conflict of Interest',
    'form.notMyExpertise': 'Not My Expertise',
    'form.timeConstraints': 'Time Constraints',
    'form.other': 'Other',
    'form.specifyReason': 'Please specify the reason',
    'form.score': 'Score (0-10)',
    'form.decision': 'Decision',
    'form.selectDecision': 'Select decision',
    'form.majorRevision': 'Major Revision',
    'form.minorRevision': 'Minor Revision',
    'form.confidentialComments': 'Confidential Comments (for Editor only)',
    'form.publicComments': 'Public Comments (for Authors)',
    'form.selectReviewer': 'Select Reviewer',
    'form.selectDeadline': 'Select deadline',
    'form.addAnotherReviewer': 'Add Another Reviewer',
    'form.category': 'Category',
    'form.selectCategory': 'Select category',
    'form.contentQuality': 'Content Quality Issues',
    'form.formFormatting': 'Form & Formatting Issues',
    'form.ethicsCompliance': 'Ethics & Compliance Issues',
    'form.detailedReason': 'Detailed Reason',
    'form.explainReason': 'Please explain the reason for sending back',
    'form.finalDecision': 'Final Decision',
    'form.editorComments': 'Editor Comments',
    'form.commentsForAuthor': 'Comments for Author',
    
    // Notification Messages
    'notify.invitationAccepted': 'Review invitation accepted',
    'notify.reviewSubmitted': 'Review submitted successfully',
    'notify.reviewerAssigned': 'Reviewer(s) assigned successfully',
    'notify.manuscriptSentBack': 'Manuscript sent back to author',
    'notify.decisionMade': 'Decision made successfully',
    'notify.reminderSent': 'Reminder sent to reviewer',
    'notify.decisionReverted': 'Decision reverted successfully',
    
    // 404 Page
    'notFound.title': '404',
    'notFound.message': 'Oops! Page not found',
    'notFound.returnHome': 'Return to Home',
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
    
    // Login Page
    'login.title': '期刊管理系统',
    'login.subtitle': '登录您的账户以管理稿件',
    'login.username': '用户名',
    'login.password': '密码',
    'login.usernamePlaceholder': '请输入用户名',
    'login.passwordPlaceholder': '请输入密码',
    'login.button': '登录',
    'login.signingIn': '登录中...',
    'login.demoCredentials': '演示账户：',
    'login.editor': '编辑',
    'login.reviewer': '审稿人',
    'login.successTitle': '登录成功',
    'login.successDesc': '欢迎使用期刊管理平台',
    'login.failedTitle': '登录失败',
    'login.failedDesc': '用户名或密码无效',
    'login.errorTitle': '登录错误',
    'login.errorDesc': '发生意外错误',
    
    // Dashboard Page
    'dashboard.title': '仪表板',
    'dashboard.welcome': '欢迎回来，{username}。这是您的{role}活动概览。',
    'dashboard.statistics': '稿件统计',
    'dashboard.recentActivity': '最近活动',
    'dashboard.quickActions': '快速操作',
    'dashboard.newSubmitted': '新稿件已提交',
    'dashboard.reviewCompleted': 'MS-2024-001 的审稿已完成',
    'dashboard.decisionMade': 'MS-2024-003 已做出决定',
    'dashboard.hoursAgo': '{hours} 小时前',
    'dashboard.dayAgo': '{days} 天前',
    'dashboard.daysAgo': '{days} 天前',
    'dashboard.viewAllManuscripts': '查看所有稿件',
    'dashboard.browseManage': '浏览和管理投稿',
    'dashboard.assignReviewers': '分配审稿人',
    'dashboard.submitReview': '提交审稿',
    'dashboard.manageAssignments': '管理审稿人分配',
    'dashboard.completePending': '完成待审稿件',
    
    // Dashboard Stats
    'stats.waitingForReview': '等待审稿',
    'stats.pendingReviewer': '待分配审稿人',
    'stats.assignedReviewer': '已分配审稿人',
    'stats.waitingForDecision': '等待决定',
    'stats.completed': '已完成',
    'stats.reviewInvitation': '审稿邀请',
    'stats.reviewCompleted': '审稿已完成',
    'stats.rejected': '已拒绝',
    
    // Manuscripts Page
    'manuscripts.title': '稿件管理',
    'manuscripts.overview': '查看和管理所有稿件投稿',
    'manuscripts.allManuscripts': '所有稿件',
    'manuscripts.searchPlaceholder': '按标题、作者或ID搜索...',
    'manuscripts.filterByStatus': '按状态筛选',
    'manuscripts.allStatuses': '所有状态',
    'manuscripts.manuscriptId': '稿件编号',
    'manuscripts.submitter': '提交者',
    'manuscripts.title2': '标题',
    'manuscripts.keywords': '关键词',
    'manuscripts.authors': '作者',
    'manuscripts.submissionDate': '提交日期',
    'manuscripts.itemsPerPage': '条/页',
    'manuscripts.showing': '显示',
    'manuscripts.to': '至',
    'manuscripts.of': '共',
    'manuscripts.results': '条结果',
    
    // Manuscripts Tabs (Reviewer)
    'manuscripts.reviewInvitation': '审稿邀请',
    'manuscripts.waitingForReview': '等待审稿',
    'manuscripts.reviewCompleted': '审稿已完成',
    'manuscripts.rejectedInvitations': '已拒绝的邀请',
    
    // Manuscripts Tabs (Editor)
    'manuscripts.pendingReviewer': '待分配审稿人',
    'manuscripts.assignedReviewer': '已分配审稿人',
    'manuscripts.waitingForDecision': '等待决定',
    
    // Manuscripts Table Headers
    'manuscripts.abstract': '摘要',
    'manuscripts.editor': '编辑',
    'manuscripts.invitedDate': '邀请日期',
    'manuscripts.dueDate': '截止日期',
    'manuscripts.reviewers': '审稿人',
    'manuscripts.reviewDeadline': '审稿截止日期',
    'manuscripts.rejectedDate': '拒绝日期',
    'manuscripts.reason': '原因',
    
    // Manuscripts Actions
    'manuscripts.accept': '接受',
    'manuscripts.reject': '拒绝',
    'manuscripts.downloadManuscript': '下载稿件',
    'manuscripts.downloadAllFiles': '下载所有文件',
    'manuscripts.submitReview': '提交审稿',
    'manuscripts.assignReviewer': '分配审稿人',
    'manuscripts.sendBack': '退回',
    'manuscripts.makeDecision': '做出决定',
    'manuscripts.viewDetails': '查看详情',
    'manuscripts.remindReviewer': '提醒审稿人',
    'manuscripts.revertDecision': '撤销决定',
    'manuscripts.viewReviews': '查看审稿意见',
    
    // Dialog Titles
    'dialog.rejectInvitation': '拒绝审稿邀请',
    'dialog.submitReview': '提交审稿',
    'dialog.assignReviewer': '分配审稿人',
    'dialog.sendBackToAuthor': '退回作者',
    'dialog.makeDecision': '做出决定',
    'dialog.reviewerDetails': '审稿人详情',
    'dialog.manuscriptDetails': '稿件详情',
    
    // Form Labels
    'form.selectReason': '选择拒绝原因',
    'form.pleaseSelect': '请选择...',
    'form.conflictOfInterest': '利益冲突',
    'form.notMyExpertise': '非我的专业领域',
    'form.timeConstraints': '时间限制',
    'form.other': '其他',
    'form.specifyReason': '请说明原因',
    'form.score': '评分 (0-10)',
    'form.decision': '决定',
    'form.selectDecision': '选择决定',
    'form.majorRevision': '大修',
    'form.minorRevision': '小修',
    'form.confidentialComments': '保密意见（仅编辑可见）',
    'form.publicComments': '公开意见（作者可见）',
    'form.selectReviewer': '选择审稿人',
    'form.selectDeadline': '选择截止日期',
    'form.addAnotherReviewer': '添加另一个审稿人',
    'form.category': '类别',
    'form.selectCategory': '选择类别',
    'form.contentQuality': '内容质量问题',
    'form.formFormatting': '格式问题',
    'form.ethicsCompliance': '伦理合规问题',
    'form.detailedReason': '详细原因',
    'form.explainReason': '请说明退回的原因',
    'form.finalDecision': '最终决定',
    'form.editorComments': '编辑意见',
    'form.commentsForAuthor': '给作者的意见',
    
    // Notification Messages
    'notify.invitationAccepted': '审稿邀请已接受',
    'notify.reviewSubmitted': '审稿已成功提交',
    'notify.reviewerAssigned': '审稿人已成功分配',
    'notify.manuscriptSentBack': '稿件已退回作者',
    'notify.decisionMade': '决定已成功做出',
    'notify.reminderSent': '已向审稿人发送提醒',
    'notify.decisionReverted': '决定已成功撤销',
    
    // 404 Page
    'notFound.title': '404',
    'notFound.message': '哎呀！页面未找到',
    'notFound.returnHome': '返回首页',
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
