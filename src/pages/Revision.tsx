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
import { Search, RotateCcw, Download, Check, X, ChevronDown, ChevronUp, Gavel, Send, UserPlus, Plus, CalendarIcon, User, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Mock data for reviewers
const mockReviewers = [
  { id: '1', name: 'Dr. Emma Wilson', expertise: 'Machine Learning' },
  { id: '2', name: 'Prof. David Chen', expertise: 'Computer Science' },
  { id: '3', name: 'Prof. Alan Smith', expertise: 'Cryptography' },
  { id: '4', name: 'Dr. Sarah Connor', expertise: 'Cybersecurity' },
  { id: '5', name: 'Dr. Kevin Liu', expertise: 'Quantum Computing' },
  { id: '6', name: 'Prof. Helen Carter', expertise: 'Biomedical Engineering' },
  { id: '7', name: 'Dr. Rachel Green', expertise: 'Environmental Science' },
  { id: '8', name: 'Prof. James Wilson', expertise: 'Materials Science' },
  { id: '9', name: 'Dr. Lisa Park', expertise: 'Neuroscience' },
  { id: '10', name: 'Prof. Mark Thompson', expertise: 'Physics' }
];

// Type for reviewer assignment
type ReviewerAssignment = {
  reviewerId: string;
  reviewerName: string;
  deadline: Date | undefined;
};

// Schema for assign reviewer form validation
const assignReviewerSchema = z.object({
  reviewers: z.array(z.object({
    reviewerId: z.string().min(1, "Please select a reviewer"),
    reviewerName: z.string(),
    deadline: z.date({ required_error: "Please select a deadline" })
  })).min(1, "At least one reviewer must be assigned")
});

// Mock data for revisions with ordinal and previous versions
const mockRevisions = [
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
    status: 'Decision in Process',
    abstract: 'This research examines the effects of rising ocean temperatures and acidification on marine biodiversity.',
    previousAbstract: undefined,
    editor: 'Prof. Emily Chen',
    invitedDate: '2024-03-12',
    dueDate: '2024-04-12',
    manuscriptFile: 'manuscript_334568_rev2.pdf',
    filesZip: '334568_rev2_all_files.zip',
    lastDecision: 'Minor Revision',
    revisionComments: 'Please address the references formatting and clarify the data collection timeline. Minor language editing needed.',
    lastReviewers: [
      { name: 'Dr. Kevin Zhang', status: 'completed' },
      { name: 'Prof. Maria Santos', status: 'completed' },
      { name: 'Dr. Thomas Mueller', status: 'completed' }
    ],
    reviewers: [
      { name: 'Dr. Michael Lee', status: 'completed', deadline: '2024-04-12', decision: 'Accept', score: 9, confidentialComments: 'Excellent revision addressing all major concerns. The methodology is now much clearer and the results are well-presented.', publicComments: 'The paper has been significantly improved. The revised methodology section clearly addresses previous concerns and the additional data strengthens your conclusions.' },
      { name: 'Prof. Maria Santos', status: 'completed', deadline: '2024-04-12', decision: 'Minor Revision', score: 7, confidentialComments: 'Good improvements overall but some minor language editing is still needed in the discussion section.', publicComments: 'The revision addresses most concerns. Please perform a careful language check on the discussion section and fix the remaining typographical errors.' },
      { name: 'Dr. Thomas Mueller', status: 'completed', deadline: '2024-04-14', decision: 'Accept', score: 8, confidentialComments: 'All previous issues have been adequately addressed. The paper is ready for publication.', publicComments: 'The authors have successfully addressed all previous comments. The paper now presents a comprehensive analysis of climate change impacts on marine ecosystems.' }
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
    lastDecision: 'Major Revision',
    revisionComments: 'The theoretical framework requires substantial revision. Include more comprehensive security analysis and performance benchmarks.',
    lastReviewers: [
      { name: 'Dr. Sarah Kim', status: 'completed' },
      { name: 'Prof. David Lee', status: 'completed' },
      { name: 'Dr. Emma Wilson', status: 'completed' }
    ],
    reviewers: [
      { name: 'Dr. Sarah Kim', status: 'completed', deadline: '2024-04-10', decision: 'Accept', score: 8, confidentialComments: 'The revised theoretical framework is solid. The authors have done an excellent job addressing the security analysis concerns.', publicComments: 'The manuscript has been significantly improved. The theoretical framework is now well-established and the security analysis is comprehensive.' },
      { name: 'Prof. David Lee', status: 'completed', deadline: '2024-04-10', decision: 'Minor Revision', score: 7, confidentialComments: 'Good revision but the performance benchmarks section could use more detail about the experimental setup.', publicComments: 'The paper is much improved. Please add more details about the experimental setup in the performance benchmarks section to enhance reproducibility.' },
      { name: 'Dr. Emma Wilson', status: 'completed', deadline: '2024-04-10', decision: 'Accept', score: 9, confidentialComments: 'Outstanding revision. All major concerns have been thoroughly addressed. Ready for publication.', publicComments: 'The authors have comprehensively addressed all previous comments. The paper presents novel and significant contributions to quantum cryptography.' }
    ]
  },
  {
    id: '334570',
    ordinal: 1,
    username: 'Dr. Robert Martinez',
    title: 'Deep Learning Approaches for Real-Time Sentiment Analysis in Social Media',
    previousTitle: undefined,
    keywords: ['Deep Learning', 'Sentiment Analysis', 'Social Media', 'NLP'],
    authors: 'Robert Martinez*, Jennifer Brown, Kevin Liu',
    previousAuthors: undefined,
    submissionDate: '2024-03-14',
    status: 'Decision in Process',
    abstract: 'This paper introduces a novel deep learning architecture for real-time sentiment analysis in social media platforms, achieving state-of-the-art performance.',
    previousAbstract: undefined,
    editor: 'Dr. John Smith',
    invitedDate: '2024-03-08',
    dueDate: '2024-04-08',
    manuscriptFile: 'manuscript_334570_rev1.pdf',
    filesZip: '334570_rev1_all_files.zip',
    lastDecision: 'Major Revision',
    revisionComments: 'The experimental validation needs to be more comprehensive. Include comparison with more baseline methods and provide error analysis.',
    lastReviewers: [
      { name: 'Dr. Helen Carter', status: 'completed' },
      { name: 'Prof. Alan Smith', status: 'completed' },
      { name: 'Dr. Lisa Park', status: 'completed' }
    ],
    reviewers: [
      { name: 'Dr. Helen Carter', status: 'completed', deadline: '2024-04-08', decision: 'Accept', score: 9, confidentialComments: 'Excellent revision. The additional baseline comparisons and error analysis significantly strengthen the paper.', publicComments: 'The revised manuscript now includes comprehensive experimental validation. The comparison with additional baselines and detailed error analysis greatly improve the quality of the work.' },
      { name: 'Prof. Alan Smith', status: 'completed', deadline: '2024-04-08', decision: 'Accept', score: 8, confidentialComments: 'All previous concerns have been addressed. The paper makes significant contributions to the field.', publicComments: 'The authors have successfully addressed all review comments. The experimental section is now thorough and the results are convincing.' },
      { name: 'Dr. Lisa Park', status: 'completed', deadline: '2024-04-08', decision: 'Minor Revision', score: 7, confidentialComments: 'Good improvements but the discussion of limitations could be expanded slightly.', publicComments: 'The paper has been significantly improved. Please expand the discussion of potential limitations and future work directions in the conclusion section.' }
    ]
  },
  {
    id: '334571',
    ordinal: 2,
    username: 'Prof. Anna Kowalski',
    title: 'Blockchain-Based Supply Chain Management: Security and Efficiency Analysis',
    previousTitle: 'Blockchain Applications in Supply Chain Management',
    keywords: ['Blockchain', 'Supply Chain', 'Security', 'Efficiency'],
    authors: 'Anna Kowalski*, Mark Davis, Rachel Green, Thomas Anderson',
    previousAuthors: 'Anna Kowalski*, Mark Davis, Rachel Green',
    submissionDate: '2024-03-12',
    status: 'Decision in Process',
    abstract: 'We propose a blockchain-based framework for supply chain management that ensures both security and operational efficiency through innovative consensus mechanisms.',
    previousAbstract: 'We propose a blockchain-based solution for supply chain management.',
    editor: 'Prof. Emily Chen',
    invitedDate: '2024-03-05',
    dueDate: '2024-04-05',
    manuscriptFile: 'manuscript_334571_rev2.pdf',
    filesZip: '334571_rev2_all_files.zip',
    lastDecision: 'Minor Revision',
    revisionComments: 'Please clarify the consensus mechanism implementation details and add more real-world case studies.',
    lastReviewers: [
      { name: 'Dr. Kevin Zhang', status: 'completed' },
      { name: 'Dr. Sarah Connor', status: 'completed' },
      { name: 'Prof. David Lee', status: 'completed' }
    ],
    reviewers: [
      { name: 'Dr. Kevin Zhang', status: 'completed', deadline: '2024-04-05', decision: 'Accept', score: 8, confidentialComments: 'The revised implementation details are clear and the additional case studies strengthen the practical applicability.', publicComments: 'The manuscript has been well-revised. The clarified consensus mechanism and additional case studies demonstrate strong practical value.' },
      { name: 'Dr. Sarah Connor', status: 'completed', deadline: '2024-04-05', decision: 'Accept', score: 9, confidentialComments: 'Outstanding work. The framework is innovative and well-validated. Ready for publication.', publicComments: 'Excellent revision addressing all concerns. The blockchain framework presents significant contributions to supply chain security and efficiency.' },
      { name: 'Prof. David Lee', status: 'completed', deadline: '2024-04-05', decision: 'Accept', score: 8, confidentialComments: 'All previous issues resolved. The paper is publication-ready.', publicComments: 'The authors have thoroughly addressed all review comments. The framework is well-designed and thoroughly evaluated.' }
    ]
  }
];

const getStatusColor = (status: string) => {
  const statusColorMap: { [key: string]: string } = {
    'Under Review': 'border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-950',
    'With Editor': 'border-purple-500 text-purple-700 bg-purple-50 dark:bg-purple-950',
    'Decision in Process': 'border-orange-500 text-orange-700 bg-orange-50 dark:bg-orange-950',
    'Accept': 'border-green-500 text-green-700 bg-green-50 dark:bg-green-950',
    'Reject': 'border-red-500 text-red-700 bg-red-50 dark:bg-red-950',
    'Major Revision': 'border-2 border-orange-600 text-orange-900 bg-orange-200 dark:bg-orange-800 dark:text-orange-50 font-bold shadow-sm dark:border-orange-500',
    'Minor Revision': 'border-yellow-500 text-yellow-700 bg-yellow-50 dark:bg-yellow-900 dark:text-yellow-200',
  };
  return statusColorMap[status] || 'border-gray-500 text-gray-700 bg-gray-50 dark:bg-gray-950';
};

const Revision = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

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

  // State for dialog management
  const [decideDialogOpen, setDecideDialogOpen] = useState(false);
  const [sendReviewerDialogOpen, setSendReviewerDialogOpen] = useState(false);
  const [assignReviewerDialogOpen, setAssignReviewerDialogOpen] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState<any>(null);

  // Decide form state
  const [decideForm, setDecideForm] = useState({
    decision: '' as 'Major Revision' | 'Minor Revision' | 'Accept' | 'Reject' | '',
    reason: '',
    comments: ''
  });
  const [decideFormErrors, setDecideFormErrors] = useState<Partial<Record<keyof typeof decideForm, string>>>({});

  // Assign reviewer form state
  const [reviewerAssignments, setReviewerAssignments] = useState<ReviewerAssignment[]>([{
    reviewerId: '',
    reviewerName: '',
    deadline: undefined
  }]);
  const [assignReviewerErrors, setAssignReviewerErrors] = useState<string[]>([]);

  // State for expanded cells
  const [expandedCells, setExpandedCells] = useState<{ [key: string]: boolean }>({});

  const toggleCell = (revisionId: string, field: string) => {
    const key = `${revisionId}-${field}`;
    setExpandedCells(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter states for each tab
  const [waitingIdFilter, setWaitingIdFilter] = useState('');
  const [waitingTitleFilter, setWaitingTitleFilter] = useState('');
  const [waitingDecisionFilter, setWaitingDecisionFilter] = useState('all');
  
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
          setWaitingDecisionFilter('all');
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
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
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Decision</label>
                        <Select value={waitingDecisionFilter} onValueChange={setWaitingDecisionFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Decisions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Decisions</SelectItem>
                            <SelectItem value="Major Revision">Major Revision</SelectItem>
                            <SelectItem value="Minor Revision">Minor Revision</SelectItem>
                          </SelectContent>
                        </Select>
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
                            <TableHead className="min-w-40">Last Decision</TableHead>
                            <TableHead className="min-w-72">Revision Comments</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockRevisions
                            .filter((revision) => {
                              if (waitingDecisionFilter !== 'all' && revision.lastDecision !== waitingDecisionFilter) {
                                return false;
                              }
                              return true;
                            })
                            .map((revision) => {
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
                                  <Badge variant="outline" className={getStatusColor(revision.lastDecision)}>
                                    {revision.lastDecision}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm max-w-xs line-clamp-3">
                                    {revision.revisionComments}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => {
                                        setSelectedRevision(revision);
                                        setDecideDialogOpen(true);
                                      }}
                                    >
                                      <Gavel className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => {
                                        setSelectedRevision(revision);
                                        setSendReviewerDialogOpen(true);
                                      }}
                                    >
                                      <Send className="h-4 w-4" />
                                    </Button>
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
                            <TableHead className="w-32">Revision ID</TableHead>
                            <TableHead className="min-w-60">Article Title</TableHead>
                            <TableHead className="min-w-80">Abstract</TableHead>
                            <TableHead>Submission Date</TableHead>
                            <TableHead className="w-32">Action</TableHead>
                            <TableHead>Last Reviewers</TableHead>
                            <TableHead>Reviewers</TableHead>
                            <TableHead>Review DDL</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockRevisions.map((revision) => (
                            <TableRow key={revision.id} className="hover:bg-muted/50">
                              <TableCell>
                                <button className="text-primary hover:underline font-medium">
                                  {revision.id}_{revision.ordinal}
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
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedRevision(revision);
                                          setAssignReviewerDialogOpen(true);
                                        }}
                                      >
                                        <UserPlus size={14} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Assign Reviewer</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell>
                                {(revision.lastReviewers?.length ?? 0) > 0 ? (
                                  <div className="space-y-1">
                                    {(revision.lastReviewers ?? []).map((reviewer, idx) => (
                                      <div key={idx} className="text-sm text-gray-700">
                                        {reviewer.name}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {(revision.reviewers?.length ?? 0) > 0 ? (
                                  <div className="space-y-1">
                                    {(revision.reviewers ?? []).map((reviewer, idx) => (
                                      <div key={idx} className="flex items-center gap-2 text-sm">
                                        <span className={`${
                                          reviewer.status === 'accepted' 
                                            ? 'text-blue-700 font-medium' 
                                            : reviewer.status === 'declined'
                                            ? 'text-gray-500 line-through'
                                            : 'text-gray-700'
                                        }`}>
                                          {reviewer.name}
                                        </span>
                                        {reviewer.status === 'accepted' && (
                                          <Check className="h-3 w-3 text-blue-700" />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {(revision.reviewers?.length ?? 0) > 0 ? (
                                  <div className="space-y-1">
                                    {(revision.reviewers ?? []).map((reviewer, idx) => (
                                      <div key={idx} className="text-sm">
                                        {reviewer.deadline}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
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
                            <TableHead className="w-32">Revision ID</TableHead>
                            <TableHead className="min-w-60">Article Title</TableHead>
                            <TableHead>Reviewers</TableHead>
                            <TableHead>Review DDL</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockRevisions.map((revision) => (
                            <TableRow key={revision.id} className="hover:bg-muted/50">
                              <TableCell>
                                <button className="text-primary hover:underline font-medium">
                                  {revision.id}_{revision.ordinal}
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
                                <div className="flex flex-col gap-1">
                                  {revision.reviewers?.map((reviewer, idx) => (
                                    <div key={idx} className="text-sm h-8 flex items-center">{reviewer.name}</div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  {revision.reviewers?.map((reviewer, idx) => (
                                    <div key={idx} className="text-sm h-8 flex items-center">{reviewer.deadline}</div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  {revision.reviewers?.map((reviewer, idx) => (
                                    <TooltipProvider key={idx}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <Bell className="h-4 w-4" />
                                              </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                              <AlertDialogHeader>
                                                <AlertDialogTitle>Send a reminder email</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                  Confirm that a reminder email will be sent to {reviewer.name} to prompt them in returning the review sooner?
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction 
                                                  onClick={() => {
                                                    toast({
                                                      title: "Reminder Sent",
                                                      description: `A reminder email has been sent to ${reviewer.name}.`,
                                                    });
                                                  }}
                                                >
                                                  Confirm
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Remind {reviewer.name}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  ))}
                                </div>
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
                            <TableHead className="w-32">Revision ID</TableHead>
                            <TableHead className="min-w-60">Article Title</TableHead>
                            <TableHead className="min-w-48">Reviewers</TableHead>
                            <TableHead className="min-w-32">Reviewer Result</TableHead>
                            <TableHead>Submission Date</TableHead>
                            <TableHead className="w-24">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockRevisions.map((revision) => (
                            <TableRow key={revision.id} className="hover:bg-muted/50">
                              <TableCell>
                                <button className="text-primary hover:underline font-medium">
                                  {revision.id}_{revision.ordinal}
                                </button>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{revision.title}</div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-4">
                                  {revision.reviewers?.filter(r => r.decision).map((reviewer, idx) => (
                                    <div key={idx} className="text-sm min-h-[100px] flex items-center">
                                      {reviewer.name}
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-4 max-w-md">
                                  {revision.reviewers?.filter(r => r.decision).map((reviewer, idx) => (
                                    <div key={idx} className="text-xs border-l-2 border-gray-200 pl-2 min-h-[100px]">
                                      <div className="text-sm font-medium mb-2">
                                        Score: {reviewer.score || 'N/A'}/10
                                      </div>
                                      <div className="text-sm font-medium mb-2">
                                        Decision: <span className={`${
                                          reviewer.decision === 'Accept' ? 'text-green-700' :
                                          reviewer.decision === 'Reject' ? 'text-red-700' :
                                          reviewer.decision === 'Minor Revision' ? 'text-orange-700' :
                                          reviewer.decision === 'Major Revision' ? 'text-yellow-700' :
                                          'text-gray-700'
                                        }`}>
                                          {reviewer.decision}
                                        </span>
                                      </div>
                                      <div className="text-blue-700 font-medium mb-1 text-xs">
                                        Confidential (Editor):
                                      </div>
                                      <div className="text-blue-600 mb-2 line-clamp-2">
                                        {reviewer.confidentialComments || 'No confidential comments provided.'}
                                      </div>
                                      <div className="text-gray-700 font-medium mb-1 text-xs">
                                        Public (Author):
                                      </div>
                                      <div className="text-gray-600 line-clamp-2">
                                        {reviewer.publicComments || 'No public comments provided.'}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-4">
                                  {revision.reviewers?.filter(r => r.decision).map((reviewer, idx) => (
                                    <div key={idx} className="text-sm min-h-[100px] flex items-center">
                                      {revision.submissionDate}
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedRevision(revision);
                                          setDecideDialogOpen(true);
                                        }}
                                      >
                                        <Gavel className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Decide</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
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
                          {mockRevisions.map((revision) => {
                            const titleCellKey = `${revision.id}-title`;
                            const abstractCellKey = `${revision.id}-abstract`;
                            const isTitleExpanded = expandedCells[titleCellKey];
                            const isAbstractExpanded = expandedCells[abstractCellKey];
                            const hasTitleChanged = revision.previousTitle && revision.previousTitle !== revision.title;
                            const hasAbstractChanged = revision.previousAbstract && revision.previousAbstract !== revision.abstract;
                            
                            return (
                              <TableRow key={revision.id} className="hover:bg-muted/50">
                                <TableCell className="align-middle">
                                  <button className="text-primary hover:underline font-medium">
                                    {revision.id}_{revision.ordinal}
                                  </button>
                                </TableCell>
                                <TableCell className="align-middle">
                                  <div className="flex items-start gap-2">
                                    <div className="flex-1">
                                      <div className="font-medium max-w-xs">{revision.title}</div>
                                      {hasTitleChanged && isTitleExpanded && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic max-w-xs">
                                          Previous: {revision.previousTitle}
                                        </div>
                                      )}
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {revision.keywords.map((keyword, index) => (
                                          <span key={index} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                                            {keyword}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    {hasTitleChanged && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleCell(revision.id, 'title')}
                                        className="shrink-0"
                                      >
                                        {isTitleExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="align-middle">
                                  <div className="flex items-start gap-2">
                                    <div className="flex-1">
                                      <div className="text-sm text-muted-foreground line-clamp-3 max-w-md">
                                        {revision.abstract}
                                      </div>
                                      {hasAbstractChanged && isAbstractExpanded && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic max-w-md">
                                          Previous: {revision.previousAbstract}
                                        </div>
                                      )}
                                    </div>
                                    {hasAbstractChanged && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleCell(revision.id, 'abstract')}
                                        className="shrink-0"
                                      >
                                        {isAbstractExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="align-middle">
                                  <button className="text-primary hover:underline font-medium text-sm">
                                    {revision.manuscriptFile}
                                  </button>
                                </TableCell>
                                <TableCell className="align-middle">{revision.editor}</TableCell>
                                <TableCell className="align-middle">{revision.invitedDate}</TableCell>
                                <TableCell className="align-middle">{revision.dueDate}</TableCell>
                                <TableCell className="align-middle">
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
                            );
                          })}
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

        {/* Decide Dialog */}
        <Dialog open={decideDialogOpen} onOpenChange={setDecideDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Decide</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Decision</Label>
                <RadioGroup
                  value={decideForm.decision}
                  onValueChange={(value) => setDecideForm(prev => ({ ...prev, decision: value as typeof decideForm.decision }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Major Revision" id="major-revision" />
                    <Label htmlFor="major-revision">Major Revision</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Minor Revision" id="minor-revision" />
                    <Label htmlFor="minor-revision">Minor Revision</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Accept" id="accept" />
                    <Label htmlFor="accept">Accept</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Reject" id="reject" />
                    <Label htmlFor="reject">Reject</Label>
                  </div>
                </RadioGroup>
                {decideFormErrors.decision && <p className="text-sm text-destructive">{decideFormErrors.decision}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="decide-reason">Reason Behind Decision</Label>
                <Textarea
                  id="decide-reason"
                  placeholder="Please provide the reason behind your decision..."
                  value={decideForm.reason}
                  onChange={(e) => setDecideForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="min-h-[80px]"
                />
                {decideFormErrors.reason && <p className="text-sm text-destructive">{decideFormErrors.reason}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="decide-comments">Review Comments to Author</Label>
                <Textarea
                  id="decide-comments"
                  placeholder="Enter comments to be returned to the author..."
                  value={decideForm.comments}
                  onChange={(e) => setDecideForm(prev => ({ ...prev, comments: e.target.value }))}
                  className="min-h-[80px]"
                />
                {decideFormErrors.comments && <p className="text-sm text-destructive">{decideFormErrors.comments}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setDecideDialogOpen(false);
                setDecideForm({ decision: '', reason: '', comments: '' });
                setDecideFormErrors({});
              }}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Basic validation
                const errors: Partial<Record<keyof typeof decideForm, string>> = {};
                if (!decideForm.decision) errors.decision = "Please select a decision";
                if (!decideForm.reason.trim()) errors.reason = "Please provide a reason for your decision";
                if (!decideForm.comments.trim()) errors.comments = "Please provide comments for the author";
                
                if (Object.keys(errors).length > 0) {
                  setDecideFormErrors(errors);
                  return;
                }

                toast({
                  title: "Decision Submitted",
                  description: `Your decision (${decideForm.decision}) for revision ${selectedRevision?.id}_${selectedRevision?.ordinal} has been submitted.`,
                });
                
                setDecideDialogOpen(false);
                setDecideForm({ decision: '', reason: '', comments: '' });
                setDecideFormErrors({});
              }}>
                Submit Decision
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Send to Reviewer Dialog */}
        <Dialog open={sendReviewerDialogOpen} onOpenChange={setSendReviewerDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send to Reviewer</DialogTitle>
              <DialogDescription>
                Select reviewers to send this revised manuscript to.
              </DialogDescription>
            </DialogHeader>
            {selectedRevision && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Revision ID:</p>
                  <p className="text-sm text-muted-foreground">{selectedRevision.id}_{selectedRevision.ordinal}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Title:</p>
                  <p className="text-sm text-muted-foreground">{selectedRevision.title}</p>
                </div>
                {/* Add reviewer selection form here */}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSendReviewerDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setSendReviewerDialogOpen(false)}>Send</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Reviewer Dialog */}
        <Dialog open={assignReviewerDialogOpen} onOpenChange={setAssignReviewerDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Assign Reviewer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {assignReviewerErrors.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                  {assignReviewerErrors.map((error, index) => (
                    <p key={index} className="text-sm text-destructive">{error}</p>
                  ))}
                </div>
              )}
              
              {reviewerAssignments.map((assignment, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Reviewer {index + 1}</h4>
                    {reviewerAssignments.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (reviewerAssignments.length > 1) {
                            setReviewerAssignments(prev => prev.filter((_, i) => i !== index));
                          }
                        }}
                      >
                        <X size={14} />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Reviewer Name</Label>
                    <Select
                      value={assignment.reviewerId}
                      onValueChange={(value) => {
                        const reviewer = mockReviewers.find(r => r.id === value);
                        if (reviewer) {
                          setReviewerAssignments(prev => prev.map((a, i) => 
                            i === index ? { ...a, reviewerId: value, reviewerName: reviewer.name } : a
                          ));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Search and select reviewer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockReviewers.map((reviewer) => (
                          <SelectItem key={reviewer.id} value={reviewer.id}>
                            <div>
                              <div className="font-medium">{reviewer.name}</div>
                              <div className="text-xs text-muted-foreground">{reviewer.expertise}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Review Deadline (Date & Time)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !assignment.deadline && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {assignment.deadline ? format(assignment.deadline, "PPP 'at' p") : <span>Pick a date and time</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={assignment.deadline}
                          onSelect={(date) => {
                            setReviewerAssignments(prev => prev.map((a, i) => 
                              i === index ? { ...a, deadline: date } : a
                            ));
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                        <div className="p-3 border-t">
                          <Label className="text-xs mb-2 block">Time</Label>
                          <Input
                            type="time"
                            value={assignment.deadline ? format(assignment.deadline, "HH:mm") : ""}
                            onChange={(e) => {
                              if (assignment.deadline && e.target.value) {
                                const [hours, minutes] = e.target.value.split(':');
                                const newDate = new Date(assignment.deadline);
                                newDate.setHours(parseInt(hours), parseInt(minutes));
                                setReviewerAssignments(prev => prev.map((a, i) => 
                                  i === index ? { ...a, deadline: newDate } : a
                                ));
                              }
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={() => {
                  setReviewerAssignments(prev => [...prev, {
                    reviewerId: '',
                    reviewerName: '',
                    deadline: undefined
                  }]);
                }}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Reviewer
              </Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setAssignReviewerDialogOpen(false);
                setReviewerAssignments([{ reviewerId: '', reviewerName: '', deadline: undefined }]);
                setAssignReviewerErrors([]);
              }}>
                Cancel
              </Button>
              <Button onClick={() => {
                try {
                  const validatedData = assignReviewerSchema.parse({ reviewers: reviewerAssignments });
                  setAssignReviewerErrors([]);
                  
                  if (selectedRevision) {
                    toast({
                      title: "Reviewers Assigned",
                      description: `${validatedData.reviewers.length} reviewer(s) have been assigned to revision ${selectedRevision.id}_${selectedRevision.ordinal}.`,
                    });
                  }
                  
                  // Reset form and close dialog
                  setReviewerAssignments([{ reviewerId: '', reviewerName: '', deadline: undefined }]);
                  setAssignReviewerDialogOpen(false);
                  setSelectedRevision(null);
                } catch (error) {
                  if (error instanceof z.ZodError) {
                    const errors: string[] = [];
                    error.errors.forEach((err) => {
                      errors.push(err.message);
                    });
                    setAssignReviewerErrors(errors);
                  }
                }
              }}>
                Assign Reviewers
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default Revision;
