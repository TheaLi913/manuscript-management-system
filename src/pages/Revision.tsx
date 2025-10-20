import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, RotateCcw, Download, Check, X, ChevronDown, ChevronUp } from "lucide-react";

// Mock data for revisions with ordinal and previous versions
const mockRevisions = [
  {
    id: '334567',
    ordinal: 1,
    username: 'Dr. Sarah Chen',
    title: 'Advanced Machine Learning Applications in Medical Diagnosis',
    previousTitle: 'Machine Learning Applications in Medical Diagnosis',
    keywords: ['Machine Learning', 'Medical AI', 'Diagnosis', 'Healthcare'],
    authors: 'Sarah Chen*, Michael Rodriguez, Lisa Wang, David Kim',
    previousAuthors: undefined,
    submissionDate: '2024-03-20',
    status: 'Under Review',
    abstract: 'This study explores the integration of advanced machine learning techniques in clinical decision-making processes, with focus on real-time diagnostic systems.',
    previousAbstract: 'This study explores the integration of machine learning techniques in clinical decision-making processes.',
    editor: 'Dr. John Smith',
    invitedDate: '2024-03-15',
    dueDate: '2024-04-15',
    manuscriptFile: 'manuscript_334567_rev1.pdf',
    filesZip: '334567_rev1_all_files.zip',
    reviewers: [
      { name: 'Dr. John Smith', status: 'accepted', deadline: '2024-04-15', decision: undefined },
      { name: 'Prof. Emily Chen', status: 'pending', deadline: '2024-04-20', decision: undefined }
    ]
  },
  {
    id: '334568',
    ordinal: 2,
    username: 'Prof. James Wilson',
    title: 'Climate Change Impact on Marine Ecosystems: A Comprehensive Analysis',
    previousTitle: 'Climate Change Impact on Marine Ecosystems',
    keywords: ['Climate Change', 'Marine Biology', 'Ecosystem'],
    authors: 'James Wilson*, Emma Thompson, Robert Johnson, Lisa Martinez',
    previousAuthors: 'James Wilson*, Emma Thompson, Robert Johnson',
    submissionDate: '2024-03-18',
    status: 'With Editor',
    abstract: 'This research examines the effects of rising ocean temperatures and acidification on marine biodiversity.',
    previousAbstract: undefined,
    editor: 'Prof. Emily Chen',
    invitedDate: '2024-03-12',
    dueDate: '2024-04-12',
    manuscriptFile: 'manuscript_334568_rev2.pdf',
    filesZip: '334568_rev2_all_files.zip',
    reviewers: [
      { name: 'Dr. Michael Lee', status: 'accepted', deadline: '2024-04-12', decision: undefined }
    ]
  },
  {
    id: '334569',
    ordinal: 1,
    username: 'Dr. Maria Garcia',
    title: 'Quantum Computing Algorithms for Cryptographic Security',
    previousTitle: undefined,
    keywords: ['Quantum Computing', 'Cryptography', 'Security'],
    authors: 'Maria Garcia*, Alex Chen, Sophie Anderson*',
    previousAuthors: undefined,
    submissionDate: '2024-03-16',
    status: 'Decision in Process',
    abstract: 'We present novel quantum algorithms designed to enhance cryptographic protocols against emerging threats.',
    previousAbstract: undefined,
    editor: 'Dr. Michael Rodriguez',
    invitedDate: '2024-03-10',
    dueDate: '2024-04-10',
    manuscriptFile: 'manuscript_334569_rev1.pdf',
    filesZip: '334569_rev1_all_files.zip',
    reviewers: [
      { name: 'Dr. Sarah Kim', status: 'completed', deadline: '2024-04-10', decision: 'Accept' },
      { name: 'Prof. David Lee', status: 'completed', deadline: '2024-04-10', decision: 'Minor Revision' }
    ]
  }
];

const getStatusColor = (status: string) => {
  const statusColorMap: { [key: string]: string } = {
    'Under Review': 'border-blue-500 text-blue-700',
    'With Editor': 'border-purple-500 text-purple-700',
    'Decision in Process': 'border-orange-500 text-orange-700',
    'Accept': 'border-green-500 text-green-700',
    'Reject': 'border-red-500 text-red-700',
    'Major Revision': 'border-yellow-500 text-yellow-700',
    'Minor Revision': 'border-amber-500 text-amber-700',
  };
  return statusColorMap[status] || 'border-gray-500 text-gray-700';
};

const Revision = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const editorTabs = [
    { value: "waiting-review", label: t("revision.waitingForReview") },
    { value: "pending-reviewer", label: t("revision.pendingReviewer") },
    { value: "assigned-reviewer", label: t("revision.assignedReviewer") },
    { value: "waiting-decision", label: t("revision.waitingForDecision") },
  ];

  const reviewerTabs = [
    { value: "review-invitation", label: t("revision.reviewInvitation") },
    { value: "pending-reviewer", label: t("revision.pendingReview") },
    { value: "completed-reviewer", label: t("revision.completedReview") },
    { value: "rejected", label: t("revision.rejected") },
  ];

  const tabs = user?.role === "Editor" ? editorTabs : reviewerTabs;
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  // State for expanded cells
  const [expandedCells, setExpandedCells] = useState<{ [key: string]: boolean }>({});

  const toggleCell = (revisionId: string, field: string) => {
    const key = `${revisionId}-${field}`;
    setExpandedCells(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter states for each tab
  const [waitingIdFilter, setWaitingIdFilter] = useState('');
  const [waitingTitleFilter, setWaitingTitleFilter] = useState('');
  
  const [pendingIdFilter, setPendingIdFilter] = useState('');
  const [pendingTitleFilter, setPendingTitleFilter] = useState('');
  const [pendingReviewerFilter, setPendingReviewerFilter] = useState('all');
  
  const [assignedIdFilter, setAssignedIdFilter] = useState('');
  const [assignedTitleFilter, setAssignedTitleFilter] = useState('');
  const [assignedReviewerFilter, setAssignedReviewerFilter] = useState('all');
  
  const [decisionIdFilter, setDecisionIdFilter] = useState('');
  const [decisionTitleFilter, setDecisionTitleFilter] = useState('');
  const [decisionReviewerFilter, setDecisionReviewerFilter] = useState('all');

  // Reviewer filters
  const [invitationIdFilter, setInvitationIdFilter] = useState('');
  const [invitationTitleFilter, setInvitationTitleFilter] = useState('');
  const [invitationEditorFilter, setInvitationEditorFilter] = useState('all');
  
  const [reviewerPendingIdFilter, setReviewerPendingIdFilter] = useState('');
  const [reviewerPendingTitleFilter, setReviewerPendingTitleFilter] = useState('');
  const [reviewerPendingEditorFilter, setReviewerPendingEditorFilter] = useState('all');
  
  const [completedIdFilter, setCompletedIdFilter] = useState('');
  const [completedTitleFilter, setCompletedTitleFilter] = useState('');
  const [completedEditorFilter, setCompletedEditorFilter] = useState('all');
  const [completedDecisionFilter, setCompletedDecisionFilter] = useState('all');
  
  const [rejectedIdFilter, setRejectedIdFilter] = useState('');
  const [rejectedTitleFilter, setRejectedTitleFilter] = useState('');
  const [rejectedEditorFilter, setRejectedEditorFilter] = useState('all');
  const [rejectedReasonFilter, setRejectedReasonFilter] = useState('all');

  const handleReset = (tab: string) => {
    if (user?.role === "Editor") {
      switch(tab) {
        case 'waiting-review':
          setWaitingIdFilter('');
          setWaitingTitleFilter('');
          break;
        case 'pending-reviewer':
          setPendingIdFilter('');
          setPendingTitleFilter('');
          setPendingReviewerFilter('all');
          break;
        case 'assigned-reviewer':
          setAssignedIdFilter('');
          setAssignedTitleFilter('');
          setAssignedReviewerFilter('all');
          break;
        case 'waiting-decision':
          setDecisionIdFilter('');
          setDecisionTitleFilter('');
          setDecisionReviewerFilter('all');
          break;
      }
    } else {
      switch(tab) {
        case 'review-invitation':
          setInvitationIdFilter('');
          setInvitationTitleFilter('');
          setInvitationEditorFilter('all');
          break;
        case 'pending-reviewer':
          setReviewerPendingIdFilter('');
          setReviewerPendingTitleFilter('');
          setReviewerPendingEditorFilter('all');
          break;
        case 'completed-reviewer':
          setCompletedIdFilter('');
          setCompletedTitleFilter('');
          setCompletedEditorFilter('all');
          setCompletedDecisionFilter('all');
          break;
        case 'rejected':
          setRejectedIdFilter('');
          setRejectedTitleFilter('');
          setRejectedEditorFilter('all');
          setRejectedReasonFilter('all');
          break;
      }
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{t("revision.title")}</h1>
              <p className="text-muted-foreground">{t("revision.description")}</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {user?.role === "Editor" ? (
                <>
                  {/* Waiting for Review Tab */}
                  <TabsContent value="waiting-review" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ID</label>
                        <Input 
                          placeholder="Enter revision ID" 
                          value={waitingIdFilter}
                          onChange={(e) => setWaitingIdFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input 
                          placeholder="Enter title keywords" 
                          value={waitingTitleFilter}
                          onChange={(e) => setWaitingTitleFilter(e.target.value)}
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <Button className="flex-1">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                        <Button variant="outline" onClick={() => handleReset('waiting-review')} className="flex-1">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-32">Revision ID</TableHead>
                            <TableHead className="min-w-80">Article Title</TableHead>
                            <TableHead className="min-w-96">Abstract</TableHead>
                            <TableHead className="min-w-48">Author Info</TableHead>
                            <TableHead>Submission Date</TableHead>
                            <TableHead>Manuscript</TableHead>
                            <TableHead>Files</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockRevisions.map((revision) => {
                            const titleExpanded = expandedCells[`${revision.id}-title`];
                            const abstractExpanded = expandedCells[`${revision.id}-abstract`];
                            const authorsExpanded = expandedCells[`${revision.id}-authors`];
                            
                            return (
                              <TableRow key={revision.id} className="hover:bg-muted/50">
                                <TableCell>
                                  <button className="text-primary hover:underline font-medium">
                                    {revision.id}_{revision.ordinal}
                                  </button>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <div className="font-medium mb-1 flex items-center gap-2">
                                        {revision.title}
                                      </div>
                                      {titleExpanded && revision.previousTitle && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t">
                                          <span className="font-medium">Previous: </span>
                                          {revision.previousTitle}
                                        </div>
                                      )}
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {revision.keywords.map((keyword, index) => (
                                          <span key={index} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                                            {keyword}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    {revision.previousTitle && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 flex-shrink-0"
                                        onClick={() => toggleCell(revision.id, 'title')}
                                      >
                                        {titleExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="text-sm max-w-xs flex-1">
                                      <p className={titleExpanded || authorsExpanded ? "" : "line-clamp-4"}>{revision.abstract}</p>
                                      {abstractExpanded && revision.previousAbstract && (
                                        <div className="text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t">
                                          <span className="font-medium">Previous: </span>
                                          {revision.previousAbstract}
                                        </div>
                                      )}
                                    </div>
                                    {revision.previousAbstract && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 flex-shrink-0"
                                        onClick={() => toggleCell(revision.id, 'abstract')}
                                      >
                                        {abstractExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <div className="text-sm">{revision.authors}</div>
                                      {authorsExpanded && revision.previousAuthors && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t">
                                          <span className="font-medium">Previous: </span>
                                          {revision.previousAuthors}
                                        </div>
                                      )}
                                      <div className="text-xs text-muted-foreground mt-1">* Corresponding Author</div>
                                    </div>
                                    {revision.previousAuthors && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 flex-shrink-0"
                                        onClick={() => toggleCell(revision.id, 'authors')}
                                      >
                                        {authorsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>{revision.submissionDate}</TableCell>
                                <TableCell>
                                  <button className="text-primary hover:underline text-sm flex items-center gap-1">
                                    <Download size={14} />
                                    {revision.manuscriptFile}
                                  </button>
                                </TableCell>
                                <TableCell>
                                  <button className="text-primary hover:underline text-sm flex items-center gap-1">
                                    <Download size={14} />
                                    {revision.filesZip}
                                  </button>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Send</Button>
                                    <Button variant="outline" size="sm">Return</Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  {/* Pending Reviewer Tab */}
                  <TabsContent value="pending-reviewer" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ID</label>
                        <Input 
                          placeholder="Search by ID..." 
                          value={pendingIdFilter}
                          onChange={(e) => setPendingIdFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input 
                          placeholder="Search by title..." 
                          value={pendingTitleFilter}
                          onChange={(e) => setPendingTitleFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Reviewer Name</label>
                        <Select value={pendingReviewerFilter} onValueChange={setPendingReviewerFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reviewer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Reviewers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end gap-2">
                        <Button className="flex-1">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                        <Button variant="outline" onClick={() => handleReset('pending-reviewer')} className="flex-1">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-20">ID</TableHead>
                            <TableHead className="min-w-60">Article Title</TableHead>
                            <TableHead className="min-w-80">Abstract</TableHead>
                            <TableHead>Submission Date</TableHead>
                            <TableHead className="w-32">Action</TableHead>
                            <TableHead>Reviewers</TableHead>
                            <TableHead>Review DDL</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockRevisions.map((revision) => (
                            <TableRow key={revision.id} className="hover:bg-muted/50">
                              <TableCell>
                                <button className="text-primary hover:underline font-medium">
                                  {revision.id}
                                </button>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium mb-1">{revision.title}</div>
                                <div className="flex flex-wrap gap-1">
                                  {revision.keywords.map((keyword, index) => (
                                    <span key={index} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                                      {keyword}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm line-clamp-3">{revision.abstract}</div>
                              </TableCell>
                              <TableCell>{revision.submissionDate}</TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">Assign</Button>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {revision.reviewers?.map((reviewer, idx) => (
                                    <div key={idx} className="text-sm">
                                      <Badge variant="outline" className="text-xs">
                                        {reviewer.name} ({reviewer.status})
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {revision.reviewers?.map((reviewer, idx) => (
                                    <div key={idx} className="text-sm">{reviewer.deadline}</div>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  {/* Assigned Reviewer Tab */}
                  <TabsContent value="assigned-reviewer" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ID</label>
                        <Input 
                          placeholder="Search by ID..." 
                          value={assignedIdFilter}
                          onChange={(e) => setAssignedIdFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input 
                          placeholder="Search by title..." 
                          value={assignedTitleFilter}
                          onChange={(e) => setAssignedTitleFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Reviewer Name</label>
                        <Select value={assignedReviewerFilter} onValueChange={setAssignedReviewerFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reviewer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Reviewers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end gap-2">
                        <Button className="flex-1">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                        <Button variant="outline" onClick={() => handleReset('assigned-reviewer')} className="flex-1">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-20">ID</TableHead>
                            <TableHead className="min-w-60">Article Title</TableHead>
                            <TableHead>Reviewers</TableHead>
                            <TableHead>Review Status</TableHead>
                            <TableHead>Review DDL</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockRevisions.map((revision) => (
                            <TableRow key={revision.id} className="hover:bg-muted/50">
                              <TableCell>
                                <button className="text-primary hover:underline font-medium">
                                  {revision.id}
                                </button>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium mb-1">{revision.title}</div>
                                <div className="flex flex-wrap gap-1">
                                  {revision.keywords.map((keyword, index) => (
                                    <span key={index} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                                      {keyword}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {revision.reviewers?.map((reviewer, idx) => (
                                    <div key={idx} className="text-sm">{reviewer.name}</div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {revision.reviewers?.map((reviewer, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {reviewer.status}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {revision.reviewers?.map((reviewer, idx) => (
                                    <div key={idx} className="text-sm">{reviewer.deadline}</div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">Remind</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  {/* Waiting for Decision Tab */}
                  <TabsContent value="waiting-decision" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ID</label>
                        <Input 
                          placeholder="Search by ID..." 
                          value={decisionIdFilter}
                          onChange={(e) => setDecisionIdFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input 
                          placeholder="Search by title..." 
                          value={decisionTitleFilter}
                          onChange={(e) => setDecisionTitleFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Reviewer Name</label>
                        <Select value={decisionReviewerFilter} onValueChange={setDecisionReviewerFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reviewer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Reviewers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end gap-2">
                        <Button className="flex-1">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                        <Button variant="outline" onClick={() => handleReset('waiting-decision')} className="flex-1">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-20">ID</TableHead>
                            <TableHead className="min-w-60">Article Title</TableHead>
                            <TableHead>Reviewers</TableHead>
                            <TableHead>Review Result</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockRevisions.map((revision) => (
                            <TableRow key={revision.id} className="hover:bg-muted/50">
                              <TableCell>
                                <button className="text-primary hover:underline font-medium">
                                  {revision.id}
                                </button>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium mb-1">{revision.title}</div>
                                <div className="flex flex-wrap gap-1">
                                  {revision.keywords.map((keyword, index) => (
                                    <span key={index} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                                      {keyword}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {revision.reviewers?.map((reviewer, idx) => (
                                    <div key={idx} className="text-sm">{reviewer.name}</div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {revision.reviewers?.filter(r => r.decision).map((reviewer, idx) => (
                                    <Badge key={idx} variant="outline" className={getStatusColor(reviewer.decision || '')}>
                                      {reviewer.decision}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">Decide</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </>
              ) : (
                <>
                  {/* Review Invitation Tab */}
                  <TabsContent value="review-invitation" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ID</label>
                        <Input 
                          placeholder="Enter revision ID" 
                          value={invitationIdFilter}
                          onChange={(e) => setInvitationIdFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input 
                          placeholder="Enter title keywords" 
                          value={invitationTitleFilter}
                          onChange={(e) => setInvitationTitleFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Editor Name</label>
                        <Select value={invitationEditorFilter} onValueChange={setInvitationEditorFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select editor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Editors</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end gap-2">
                        <Button className="flex-1">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                        <Button variant="outline" onClick={() => handleReset('review-invitation')} className="flex-1">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Revision ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Abstract</TableHead>
                            <TableHead>File</TableHead>
                            <TableHead>Editor</TableHead>
                            <TableHead>Invited Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockRevisions.map((revision) => (
                            <TableRow key={revision.id} className="hover:bg-muted/50">
                              <TableCell>
                                <button className="text-primary hover:underline font-medium">
                                  {revision.id}
                                </button>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium max-w-xs">{revision.title}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {revision.keywords.map((keyword, index) => (
                                    <span key={index} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                                      {keyword}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-muted-foreground line-clamp-3 max-w-md">
                                  {revision.abstract}
                                </div>
                              </TableCell>
                              <TableCell>
                                <button className="text-primary hover:underline font-medium text-sm">
                                  {revision.manuscriptFile}
                                </button>
                              </TableCell>
                              <TableCell>{revision.editor}</TableCell>
                              <TableCell>{revision.invitedDate}</TableCell>
                              <TableCell>{revision.dueDate}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  {/* Pending Reviewer Tab (Reviewer) */}
                  <TabsContent value="pending-reviewer" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ID</label>
                        <Input 
                          placeholder="Search by ID..." 
                          value={reviewerPendingIdFilter}
                          onChange={(e) => setReviewerPendingIdFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input 
                          placeholder="Search by title..." 
                          value={reviewerPendingTitleFilter}
                          onChange={(e) => setReviewerPendingTitleFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Editor Name</label>
                        <Select value={reviewerPendingEditorFilter} onValueChange={setReviewerPendingEditorFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select editor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Editors</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end gap-2">
                        <Button className="flex-1">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                        <Button variant="outline" onClick={() => handleReset('pending-reviewer')} className="flex-1">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Revision ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Abstract</TableHead>
                            <TableHead>Editor</TableHead>
                            <TableHead>Accepted Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockRevisions.map((revision) => (
                            <TableRow key={revision.id} className="hover:bg-muted/50">
                              <TableCell>
                                <button className="text-primary hover:underline font-medium">
                                  {revision.id}
                                </button>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium max-w-xs">{revision.title}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {revision.keywords.map((keyword, index) => (
                                    <span key={index} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                                      {keyword}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-muted-foreground line-clamp-3 max-w-md">
                                  {revision.abstract}
                                </div>
                              </TableCell>
                              <TableCell>{revision.editor}</TableCell>
                              <TableCell>{revision.invitedDate}</TableCell>
                              <TableCell>{revision.dueDate}</TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">Submit Review</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  {/* Completed Reviewer Tab */}
                  <TabsContent value="completed-reviewer" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ID</label>
                        <Input 
                          placeholder="Search by ID..." 
                          value={completedIdFilter}
                          onChange={(e) => setCompletedIdFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input 
                          placeholder="Search by title..." 
                          value={completedTitleFilter}
                          onChange={(e) => setCompletedTitleFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Editor Name</label>
                        <Select value={completedEditorFilter} onValueChange={setCompletedEditorFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select editor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Editors</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Suggested Decision</label>
                        <Select value={completedDecisionFilter} onValueChange={setCompletedDecisionFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select decision" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Decisions</SelectItem>
                            <SelectItem value="Accept">Accept</SelectItem>
                            <SelectItem value="Minor Revision">Minor Revision</SelectItem>
                            <SelectItem value="Major Revision">Major Revision</SelectItem>
                            <SelectItem value="Reject">Reject</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end gap-2">
                        <Button className="flex-1">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                        <Button variant="outline" onClick={() => handleReset('completed-reviewer')} className="flex-1">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Revision ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Editor</TableHead>
                            <TableHead>Submitted Date</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Suggested Decision</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockRevisions.filter(r => r.reviewers?.some(rev => rev.decision)).map((revision) => (
                            <TableRow key={revision.id} className="hover:bg-muted/50">
                              <TableCell>
                                <button className="text-primary hover:underline font-medium">
                                  {revision.id}
                                </button>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium max-w-xs">{revision.title}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {revision.keywords.map((keyword, index) => (
                                    <span key={index} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                                      {keyword}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>{revision.editor}</TableCell>
                              <TableCell>{revision.submissionDate}</TableCell>
                              <TableCell>8/10</TableCell>
                              <TableCell>
                                {revision.reviewers?.filter(r => r.decision).map((reviewer, idx) => (
                                  <Badge key={idx} variant="outline" className={getStatusColor(reviewer.decision || '')}>
                                    {reviewer.decision}
                                  </Badge>
                                ))}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  {/* Rejected Tab */}
                  <TabsContent value="rejected" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ID</label>
                        <Input 
                          placeholder="Search by ID..." 
                          value={rejectedIdFilter}
                          onChange={(e) => setRejectedIdFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input 
                          placeholder="Search by title..." 
                          value={rejectedTitleFilter}
                          onChange={(e) => setRejectedTitleFilter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Editor Name</label>
                        <Select value={rejectedEditorFilter} onValueChange={setRejectedEditorFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select editor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Editors</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Reason</label>
                        <Select value={rejectedReasonFilter} onValueChange={setRejectedReasonFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Reasons</SelectItem>
                            <SelectItem value="Conflict of Interest">Conflict of Interest</SelectItem>
                            <SelectItem value="Not My Expertise">Not My Expertise</SelectItem>
                            <SelectItem value="Time Constraints">Time Constraints</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end gap-2">
                        <Button className="flex-1">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                        <Button variant="outline" onClick={() => handleReset('rejected')} className="flex-1">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Revision ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Editor</TableHead>
                            <TableHead>Invited Date</TableHead>
                            <TableHead>Rejected Date</TableHead>
                            <TableHead>Reason</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              No rejected revisions
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Revision;
