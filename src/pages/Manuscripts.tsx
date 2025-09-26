import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserPlus, ArrowLeft, Bell, Download, Send, Undo2, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

// Mock data for manuscripts
const mockManuscripts = [
  {
    id: '234567',
    username: 'Dr. Sarah Chen',
    title: 'Advanced Machine Learning Applications in Medical Diagnosis',
    keywords: ['Machine Learning', 'Medical AI', 'Diagnosis', 'Healthcare'],
    authors: 'Sarah Chen*, Michael Rodriguez, Lisa Wang, David Kim',
    submissionDate: '2024-03-15',
    status: 'Under Review'
  },
  {
    id: '234568',
    username: 'Prof. James Wilson',
    title: 'Climate Change Impact on Marine Ecosystems: A Comprehensive Analysis',
    keywords: ['Climate Change', 'Marine Biology', 'Ecosystem', 'Environmental Science'],
    authors: 'James Wilson*, Emma Thompson, Robert Johnson',
    submissionDate: '2024-03-12',
    status: 'With Editor'
  },
  {
    id: '234569',
    username: 'Dr. Maria Garcia',
    title: 'Quantum Computing Algorithms for Cryptographic Security',
    keywords: ['Quantum Computing', 'Cryptography', 'Security', 'Algorithms'],
    authors: 'Maria Garcia*, Alex Chen, Sophie Anderson*',
    submissionDate: '2024-03-10',
    status: 'Decision in Process'
  },
  {
    id: '234570',
    username: 'Dr. Kevin Zhang',
    title: 'Sustainable Energy Solutions for Urban Development',
    keywords: ['Renewable Energy', 'Urban Planning', 'Sustainability', 'Smart Cities'],
    authors: 'Kevin Zhang*, Nina Patel, Carlos Martinez',
    submissionDate: '2024-03-08',
    status: 'Accept'
  },
  {
    id: '234571',
    username: 'Prof. Rachel Taylor',
    title: 'Neuroplasticity and Cognitive Enhancement in Aging Populations',
    keywords: ['Neuroscience', 'Aging', 'Cognitive Science', 'Brain Plasticity'],
    authors: 'Rachel Taylor*, Mohammad Ali, Jennifer Lee',
    submissionDate: '2024-03-05',
    status: 'Major Revision'
  }
];

// Mock data for waiting for review manuscripts
const mockWaitingReviewManuscripts = [
  {
    id: '234572',
    username: 'Dr. Alex Kumar',
    title: 'Artificial Intelligence in Drug Discovery: Novel Approaches and Applications',
    abstract: 'This study explores the integration of artificial intelligence techniques in pharmaceutical drug discovery processes. We present novel machine learning algorithms that can significantly reduce the time and cost associated with identifying potential drug candidates. Our approach combines deep learning models with molecular simulation to predict drug-target interactions with unprecedented accuracy.',
    keywords: ['AI', 'Drug Discovery', 'Machine Learning', 'Pharmaceuticals'],
    authors: 'Alex Kumar*, Jennifer Smith, Michael Brown, Sarah Davis',
    submissionDate: '2024-03-20',
    manuscriptFile: 'manuscript_234572.pdf',
    filesZip: '234572_all_files.zip'
  },
  {
    id: '234573',
    username: 'Prof. Lisa Wang',
    title: 'Blockchain Technology for Secure Healthcare Data Management',
    abstract: 'Healthcare data security remains a critical challenge in the digital age. This paper presents a comprehensive blockchain-based solution for managing patient data while ensuring privacy, security, and interoperability. We demonstrate how distributed ledger technology can revolutionize healthcare information systems and provide patients with greater control over their medical records.',
    keywords: ['Blockchain', 'Healthcare', 'Data Security', 'Privacy'],
    authors: 'Lisa Wang*, Robert Chen, Maria Rodriguez',
    submissionDate: '2024-03-18',
    manuscriptFile: 'manuscript_234573.pdf',
    filesZip: '234573_all_files.zip'
  },
  {
    id: '234574',
    username: 'Dr. John Thompson',
    title: 'Renewable Energy Integration in Smart Grid Systems',
    abstract: 'The transition to renewable energy sources presents unique challenges for power grid management. This research investigates advanced control algorithms for integrating solar and wind power into smart grid infrastructures. Our findings demonstrate improved grid stability and efficiency through the implementation of predictive analytics and real-time optimization techniques.',
    keywords: ['Smart Grid', 'Renewable Energy', 'Control Systems', 'Optimization'],
    authors: 'John Thompson*, Emily Wilson, David Lee, Anna Patel',
    submissionDate: '2024-03-16',
    manuscriptFile: 'manuscript_234574.pdf',
    filesZip: '234574_all_files.zip'
  },
  {
    id: '234575',
    username: 'Prof. Sarah Johnson',
    title: 'Advanced Materials for Sustainable Construction: A Comprehensive Review',
    abstract: 'The construction industry is rapidly evolving towards sustainable practices. This comprehensive review examines cutting-edge materials and technologies that can reduce the environmental impact of construction projects. We analyze bio-based materials, recycled composites, and smart building materials that contribute to energy efficiency and carbon footprint reduction.',
    keywords: ['Sustainable Construction', 'Advanced Materials', 'Green Building', 'Environmental Impact'],
    authors: 'Sarah Johnson*, Mark Davis, Rachel Green',
    submissionDate: '2024-03-14',
    manuscriptFile: 'manuscript_234575.pdf',
    filesZip: '234575_all_files.zip'
  }
];

// Mock data for pending reviewer manuscripts
const mockPendingReviewManuscripts = [
  {
    id: '234576',
    username: 'Dr. Michael Brown',
    title: 'Advanced Neural Networks for Natural Language Processing',
    abstract: 'Natural language processing has seen significant advancements with the introduction of transformer architectures. This research presents novel neural network designs that improve upon existing models in terms of efficiency and accuracy. We demonstrate state-of-the-art performance on various NLP benchmarks while reducing computational requirements.',
    keywords: ['Neural Networks', 'NLP', 'Transformers', 'Deep Learning'],
    authors: 'Michael Brown*, Jessica Lee, Robert Taylor, Amanda White',
    submissionDate: '2024-02-28',
    reviewers: [
      { name: 'Dr. Emma Wilson', status: 'accepted' },
      { name: 'Prof. David Chen', status: 'declined' },
      { name: 'Dr. Lisa Park', status: 'accepted' }
    ],
    reviewDeadlines: ['2024-04-15', '2024-04-18', '2024-04-22']
  },
  {
    id: '234577',
    username: 'Prof. Jennifer Davis',
    title: 'Quantum Cryptography: Security in the Post-Quantum Era',
    abstract: 'As quantum computers become more powerful, traditional cryptographic methods face unprecedented threats. This study investigates quantum-resistant cryptographic protocols and their practical implementation. We present a comprehensive analysis of post-quantum cryptography and propose novel security frameworks for future digital communications.',
    keywords: ['Quantum Cryptography', 'Post-Quantum Security', 'Encryption', 'Cybersecurity'],
    authors: 'Jennifer Davis*, Mark Johnson, Lisa Anderson',
    submissionDate: '2024-02-25',
    reviewers: [
      { name: 'Prof. Alan Smith', status: 'accepted' },
      { name: 'Dr. Sarah Connor', status: 'pending' },
      { name: 'Dr. Kevin Liu', status: 'declined' }
    ],
    reviewDeadlines: ['2024-04-10', '2024-04-12', '2024-04-20']
  },
  {
    id: '234578',
    username: 'Dr. Robert Garcia',
    title: 'Sustainable Agriculture Technologies for Climate Adaptation',
    abstract: 'Climate change poses significant challenges to global food security. This research explores innovative agricultural technologies that can help farmers adapt to changing climate conditions. We present precision farming techniques, drought-resistant crop varieties, and smart irrigation systems that optimize resource usage while maintaining productivity.',
    keywords: ['Sustainable Agriculture', 'Climate Adaptation', 'Precision Farming', 'Food Security'],
    authors: 'Robert Garcia*, Maria Santos, Carlos Hernandez',
    submissionDate: '2024-02-22',
    reviewers: [],
    reviewDeadlines: []
  },
  {
    id: '234579',
    username: 'Dr. Anna Kowalski',
    title: 'Biomedical Engineering Applications in Regenerative Medicine',
    abstract: 'Regenerative medicine represents a paradigm shift in healthcare, offering potential cures for previously incurable conditions. This comprehensive review examines the latest biomedical engineering approaches in tissue engineering, stem cell therapy, and organ regeneration. We analyze current clinical trials and discuss future prospects for personalized regenerative treatments.',
    keywords: ['Regenerative Medicine', 'Biomedical Engineering', 'Tissue Engineering', 'Stem Cells'],
    authors: 'Anna Kowalski*, Thomas Mueller, Sophie Zhang',
    submissionDate: '2024-02-20',
    reviewers: [
      { name: 'Prof. Helen Carter', status: 'pending' },
      { name: 'Dr. Rachel Green', status: 'accepted' }
    ],
    reviewDeadlines: ['2024-04-05', '2024-04-08']
  }
];

// Mock reviewer data
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

const statusOptions = [
  'Submitted to Journal',
  'With Editor',
  'Send Back to Author',
  'Under Review',
  'Required Reviews Complete',
  'Decision in Process',
  'Major Revision',
  'Minor Revision',
  'Accept',
  'Rejected',
  'Revision Submitted'
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Accept':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Under Review':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Major Revision':
    case 'Minor Revision':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Decision in Process':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Function to get reviewer name styling based on status
const getReviewerNameStyle = (status: string) => {
  switch (status) {
    case 'accepted':
      return 'text-blue-700 font-medium';
    case 'declined':
      return 'text-gray-500 line-through';
    case 'pending':
    default:
      return 'text-gray-700';
  }
};

// Schema for send back form validation
const sendBackSchema = z.object({
  category: z.enum(['content-quality', 'form-formatting', 'ethics-compliance'], {
    required_error: "Please select a rejection reason category"
  }),
  reason: z.string().trim().min(10, "Detailed reason must be at least 10 characters").max(500, "Detailed reason must be less than 500 characters")
});

type SendBackFormData = z.infer<typeof sendBackSchema>;

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

type AssignReviewerFormData = z.infer<typeof assignReviewerSchema>;

const Manuscripts = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const { toast } = useToast();
  
  // State for "All" tab filters
  const [titleFilter, setTitleFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // State for "Waiting for Review" tab filters
  const [waitingTitleFilter, setWaitingTitleFilter] = useState('');
  const [waitingAuthorFilter, setWaitingAuthorFilter] = useState('');

  // State for "Pending Review" tab filters
  const [pendingIdFilter, setPendingIdFilter] = useState('');
  const [pendingTitleFilter, setPendingTitleFilter] = useState('');
  const [pendingReviewerFilter, setPendingReviewerFilter] = useState('all');

  // State for "Assigned Reviewer" tab filters
  const [assignedIdFilter, setAssignedIdFilter] = useState('');
  const [assignedTitleFilter, setAssignedTitleFilter] = useState('');
  const [assignedReviewerFilter, setAssignedReviewerFilter] = useState('all');

  // State for managing manuscript data
  const [waitingReviewManuscripts, setWaitingReviewManuscripts] = useState(mockWaitingReviewManuscripts);
  const [pendingReviewManuscripts, setPendingReviewManuscripts] = useState(mockPendingReviewManuscripts);

  // Dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [sendBackDialogOpen, setSendBackDialogOpen] = useState(false);
  const [assignReviewerDialogOpen, setAssignReviewerDialogOpen] = useState(false);
  const [selectedManuscriptId, setSelectedManuscriptId] = useState<string>('');
  
  // Send back form state
  const [sendBackForm, setSendBackForm] = useState<SendBackFormData>({
    category: 'content-quality' as const,
    reason: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof SendBackFormData, string>>>({});

  // Assign reviewer form state
  const [reviewerAssignments, setReviewerAssignments] = useState<ReviewerAssignment[]>([{
    reviewerId: '',
    reviewerName: '',
    deadline: undefined
  }]);
  const [assignReviewerErrors, setAssignReviewerErrors] = useState<string[]>([]);

  // Mock data for Assigned Reviewer tab (manuscripts with 3+ accepted reviewers)
  const mockAssignedManuscripts = [
    {
      id: '234580',
      title: 'Machine Learning Approaches for Climate Change Prediction',
      abstract: 'This study presents novel machine learning algorithms for predicting climate change patterns using satellite data and atmospheric measurements.',
      keywords: ['Climate Change', 'Machine Learning', 'Satellite Data', 'Environmental Science'],
      authors: 'Dr. Climate Smith*, Prof. Earth Jones, Dr. Weather Brown',
      submissionDate: '2024-02-15',
      reviewers: [
        { name: 'Dr. Green Expert', status: 'accepted' },
        { name: 'Prof. Climate Master', status: 'accepted' },
        { name: 'Dr. ML Specialist', status: 'accepted' },
        { name: 'Prof. Data Scientist', status: 'declined' }
      ],
      reviewDeadlines: ['2024-04-01', '2024-04-03', '2024-04-05', '2024-04-07']
    },
    {
      id: '234581',
      title: 'Quantum Computing Applications in Drug Discovery',
      abstract: 'Exploring the potential of quantum computing algorithms to accelerate drug discovery processes through molecular simulation and optimization.',
      keywords: ['Quantum Computing', 'Drug Discovery', 'Molecular Simulation', 'Optimization'],
      authors: 'Dr. Quantum Lee*, Prof. Drug Hunter, Dr. Molecule Expert',
      submissionDate: '2024-02-12',
      reviewers: [
        { name: 'Prof. Quantum Master', status: 'accepted' },
        { name: 'Dr. Pharma Expert', status: 'accepted' },
        { name: 'Dr. Computing Guru', status: 'accepted' }
      ],
      reviewDeadlines: ['2024-03-28', '2024-03-30', '2024-04-02']
    }
  ];

  // Filter functions
  const filteredManuscripts = mockManuscripts.filter(manuscript => {
    const matchesTitle = manuscript.title.toLowerCase().includes(titleFilter.toLowerCase());
    const matchesAuthor = manuscript.authors.toLowerCase().includes(authorFilter.toLowerCase());
    const matchesStatus = statusFilter === '' || statusFilter === 'all' || manuscript.status === statusFilter;
    return matchesTitle && matchesAuthor && matchesStatus;
  });

  const filteredWaitingReviewManuscripts = waitingReviewManuscripts.filter(manuscript => {
    const matchesTitle = manuscript.title.toLowerCase().includes(waitingTitleFilter.toLowerCase());
    const matchesAuthor = manuscript.authors.toLowerCase().includes(waitingAuthorFilter.toLowerCase());
    return matchesTitle && matchesAuthor;
  });

  // Filter pending manuscripts (only show those with fewer than 3 accepted reviewers)
  const pendingManuscriptsFiltered = pendingReviewManuscripts.filter(manuscript => {
    const acceptedCount = manuscript.reviewers.filter(r => r.status === 'accepted').length;
    return acceptedCount < 3;
  });

  // Apply search filters to pending manuscripts
  const filteredPendingReviewManuscripts = pendingManuscriptsFiltered.filter(manuscript => {
    const matchesId = manuscript.id.toLowerCase().includes(pendingIdFilter.toLowerCase());
    const matchesTitle = manuscript.title.toLowerCase().includes(pendingTitleFilter.toLowerCase());
    const matchesReviewer = pendingReviewerFilter === 'all' || 
      manuscript.reviewers.some(reviewer => reviewer.name.toLowerCase().includes(pendingReviewerFilter.toLowerCase()));
    return matchesId && matchesTitle && matchesReviewer;
  });

  const filteredAssignedManuscripts = mockAssignedManuscripts.filter(manuscript => {
    const matchesId = manuscript.id.toLowerCase().includes(assignedIdFilter.toLowerCase());
    const matchesTitle = manuscript.title.toLowerCase().includes(assignedTitleFilter.toLowerCase());
    const matchesReviewer = assignedReviewerFilter === 'all' || 
      manuscript.reviewers.some(reviewer => reviewer.name.toLowerCase().includes(assignedReviewerFilter.toLowerCase()));
    return matchesId && matchesTitle && matchesReviewer;
  });

  // Handler functions
  const handleSearch = () => {
    // Search functionality is already implemented through the filter state
  };

  const handleReset = () => {
    setTitleFilter('');
    setAuthorFilter('');
    setStatusFilter('all');
  };

  const handleWaitingReset = () => {
    setWaitingTitleFilter('');
    setWaitingAuthorFilter('');
  };

  const handlePendingReset = () => {
    setPendingIdFilter('');
    setPendingTitleFilter('');
    setPendingReviewerFilter('all');
  };

  const handleAssignedReset = () => {
    setAssignedIdFilter('');
    setAssignedTitleFilter('');
    setAssignedReviewerFilter('all');
  };

  const handleRemindReviewer = (manuscriptId: string, reviewerName: string) => {
    toast({
      title: "Reminder Sent",
      description: `A reminder email has been sent to ${reviewerName}.`,
    });
  };

  const handleSendToReviewer = (manuscriptId: string) => {
    setSelectedManuscriptId(manuscriptId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSendToReviewer = () => {
    const manuscript = waitingReviewManuscripts.find(m => m.id === selectedManuscriptId);
    if (manuscript) {
      // Remove from waiting review and add to pending reviewer
      setWaitingReviewManuscripts(prev => prev.filter(m => m.id !== selectedManuscriptId));
      const newPendingManuscript = {
        ...manuscript,
        reviewers: [],
        reviewDeadlines: []
      };
      setPendingReviewManuscripts(prev => [...prev, newPendingManuscript]);
      
      toast({
        title: "Success",
        description: "Manuscript has been sent to reviewer successfully.",
      });
    }
    setConfirmDialogOpen(false);
    setSelectedManuscriptId('');
  };

  const handleSendBackToAuthor = (manuscriptId: string) => {
    setSelectedManuscriptId(manuscriptId);
    setSendBackDialogOpen(true);
  };

  const handleSendBackSubmit = () => {
    try {
      sendBackSchema.parse(sendBackForm);
      setFormErrors({});
      
      // Remove manuscript from waiting review
      setWaitingReviewManuscripts(prev => prev.filter(m => m.id !== selectedManuscriptId));
      
      toast({
        title: "Success",
        description: "Manuscript has been sent back to author successfully.",
      });
      
      setSendBackDialogOpen(false);
      setSelectedManuscriptId('');
      setSendBackForm({ category: 'content-quality', reason: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof SendBackFormData, string>> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            const field = err.path[0] as keyof SendBackFormData;
            fieldErrors[field] = err.message;
          }
        });
        setFormErrors(fieldErrors);
      }
    }
  };

  const handleAssignReviewer = (manuscriptId: string) => {
    setSelectedManuscriptId(manuscriptId);
    setAssignReviewerDialogOpen(true);
  };

  const handleReviewerSelect = (index: number, reviewerId: string, reviewerName: string) => {
    setReviewerAssignments(prev => prev.map((assignment, i) => 
      i === index ? { ...assignment, reviewerId, reviewerName } : assignment
    ));
  };

  const handleDeadlineSelect = (index: number, date: Date | undefined) => {
    setReviewerAssignments(prev => prev.map((assignment, i) => 
      i === index ? { ...assignment, deadline: date } : assignment
    ));
  };

  const handleAddReviewer = () => {
    setReviewerAssignments(prev => [...prev, { reviewerId: '', reviewerName: '', deadline: undefined }]);
  };

  const handleRemoveReviewer = (index: number) => {
    setReviewerAssignments(prev => prev.filter((_, i) => i !== index));
  };

  const handleAssignReviewerSubmit = () => {
    try {
      assignReviewerSchema.parse({ reviewers: reviewerAssignments });
      setAssignReviewerErrors([]);
      
      // Find the manuscript and update it
      const manuscript = pendingReviewManuscripts.find(m => m.id === selectedManuscriptId);
      if (manuscript) {
        const newReviewers = reviewerAssignments.map(assignment => ({
          name: assignment.reviewerName,
          status: 'accepted' as const
        }));
        
        const newDeadlines = reviewerAssignments.map(assignment => 
          assignment.deadline ? format(assignment.deadline, 'yyyy-MM-dd') : ''
        );
        
        setPendingReviewManuscripts(prev => prev.map(m => 
          m.id === selectedManuscriptId 
            ? { ...m, reviewers: [...m.reviewers, ...newReviewers], reviewDeadlines: [...m.reviewDeadlines, ...newDeadlines] }
            : m
        ));
        
        toast({
          title: "Success",
          description: "Reviewers have been assigned successfully.",
        });
      }
      
      setAssignReviewerDialogOpen(false);
      setSelectedManuscriptId('');
      setReviewerAssignments([{ reviewerId: '', reviewerName: '', deadline: undefined }]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => err.message);
        setAssignReviewerErrors(errors);
      }
    }
  };

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-auto">
              <Tabs defaultValue="all" className="h-full">
                <div className="border-b">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="waiting-review">Waiting for Review</TabsTrigger>
                    <TabsTrigger value="pending-reviewer">Pending Review</TabsTrigger>
                    <TabsTrigger value="assigned-reviewer">Assigned Reviewer</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="p-6">
                  {/* Search and Filter Section */}
                  <div className="mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Title</label>
                        <Input
                          placeholder="Search by title..."
                          value={titleFilter}
                          onChange={(e) => setTitleFilter(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Author Name</label>
                        <Input
                          placeholder="Search by author..."
                          value={authorFilter}
                          onChange={(e) => setAuthorFilter(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Status</label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSearch}>Search</Button>
                      <Button variant="outline" onClick={handleReset}>Reset</Button>
                    </div>
                  </div>

                  {/* Table Section */}
                  <div className="border rounded-lg overflow-hidden">
                    <ResizablePanelGroup direction="horizontal" className="h-[600px]">
                      <ResizablePanel defaultSize={8} minSize={5}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">ID</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredManuscripts.map((manuscript) => (
                               <div key={`id-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-20 flex items-start">
                                 <button className="text-primary hover:underline font-medium">
                                   {manuscript.id}
                                 </button>
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={45} minSize={30}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Article Title</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredManuscripts.map((manuscript) => (
                               <div key={`title-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-20 flex flex-col justify-start">
                                 <div className="font-medium mb-1">{manuscript.title}</div>
                                 <div className="flex flex-wrap gap-1">
                                   {manuscript.keywords.map((keyword, index) => (
                                     <span
                                       key={index}
                                       className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded"
                                     >
                                       {keyword}
                                     </span>
                                   ))}
                                 </div>
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={20} minSize={15}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Author Info</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredManuscripts.map((manuscript) => (
                               <div key={`author-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-20 flex flex-col justify-start">
                                 <div className="text-sm">
                                   {manuscript.authors.split(', ').map((author, index) => (
                                     <span key={index}>
                                       {author}
                                       {index < manuscript.authors.split(', ').length - 1 && ', '}
                                     </span>
                                   ))}
                                 </div>
                                 <div className="text-xs text-muted-foreground mt-1">
                                   * Corresponding Author
                                 </div>
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={12} minSize={10}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Submission Date</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredManuscripts.map((manuscript) => (
                               <div key={`date-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-20 flex items-start">
                                 {manuscript.submissionDate}
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={15} minSize={10}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Status</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredManuscripts.map((manuscript) => (
                               <div key={`status-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-20 flex items-start">
                                 <Badge variant="outline" className={getStatusColor(manuscript.status)}>
                                   {manuscript.status}
                                 </Badge>
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </div>
                </TabsContent>

                <TabsContent value="waiting-review" className="p-6">
                  {/* Search and Filter Section */}
                  <div className="mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Title</label>
                        <Input
                          placeholder="Search by title..."
                          value={waitingTitleFilter}
                          onChange={(e) => setWaitingTitleFilter(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Author Name</label>
                        <Input
                          placeholder="Search by author..."
                          value={waitingAuthorFilter}
                          onChange={(e) => setWaitingAuthorFilter(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => {}}>Search</Button>
                      <Button variant="outline" onClick={handleWaitingReset}>Reset</Button>
                    </div>
                  </div>

                  {/* Table Section */}
                  <div className="border rounded-lg overflow-hidden">
                    <ResizablePanelGroup direction="horizontal" className="h-[600px]">
                      <ResizablePanel defaultSize={25} minSize={15}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Article Title</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredWaitingReviewManuscripts.map((manuscript) => (
                               <div key={`title-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-32 flex flex-col justify-start">
                                 <div className="font-medium mb-1">{manuscript.title}</div>
                                 <div className="flex flex-wrap gap-1">
                                   {manuscript.keywords.map((keyword, index) => (
                                     <span
                                       key={index}
                                       className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded"
                                     >
                                       {keyword}
                                     </span>
                                   ))}
                                 </div>
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>

                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={25} minSize={15}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Abstract</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredWaitingReviewManuscripts.map((manuscript) => (
                               <div key={`abstract-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-32 flex items-start">
                                 <div className="text-sm max-w-xs">
                                   <p className="line-clamp-4">{manuscript.abstract}</p>
                                 </div>
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={18} minSize={12}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Author Info</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredWaitingReviewManuscripts.map((manuscript) => (
                               <div key={`author-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-32 flex flex-col justify-start">
                                 <div className="text-sm">
                                   {manuscript.authors.split(', ').map((author, index) => (
                                     <span key={index}>
                                       {author}
                                       {index < manuscript.authors.split(', ').length - 1 && ', '}
                                     </span>
                                   ))}
                                 </div>
                                 <div className="text-xs text-muted-foreground mt-1">
                                   * Corresponding Author
                                 </div>
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={10} minSize={8}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Submission Date</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredWaitingReviewManuscripts.map((manuscript) => (
                               <div key={`date-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-32 flex items-start">
                                 {manuscript.submissionDate}
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={10} minSize={8}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Manuscript</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredWaitingReviewManuscripts.map((manuscript) => (
                               <div key={`manuscript-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-32 flex items-start">
                                 <button className="text-primary hover:underline text-sm flex items-center gap-1">
                                   <Download size={14} />
                                   {manuscript.manuscriptFile}
                                 </button>
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={8} minSize={6}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Files</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredWaitingReviewManuscripts.map((manuscript) => (
                               <div key={`files-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-32 flex items-start">
                                 <button className="text-primary hover:underline text-sm flex items-center gap-1">
                                   <Download size={14} />
                                   {manuscript.filesZip}
                                 </button>
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={4} minSize={3}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Actions</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredWaitingReviewManuscripts.map((manuscript) => (
                               <div key={`actions-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-32 flex items-start">
                                 <div className="flex gap-2">
                                   <TooltipProvider>
                                     <Tooltip>
                                       <TooltipTrigger asChild>
                                         <Button
                                           variant="outline"
                                           size="sm"
                                           onClick={() => handleSendToReviewer(manuscript.id)}
                                         >
                                           <Send size={14} />
                                         </Button>
                                       </TooltipTrigger>
                                       <TooltipContent>
                                         <p>Send to Reviewer</p>
                                       </TooltipContent>
                                     </Tooltip>
                                   </TooltipProvider>
                                   <TooltipProvider>
                                     <Tooltip>
                                       <TooltipTrigger asChild>
                                         <Button
                                           variant="outline"
                                           size="sm"
                                           onClick={() => handleSendBackToAuthor(manuscript.id)}
                                         >
                                           <Undo2 size={14} />
                                         </Button>
                                       </TooltipTrigger>
                                       <TooltipContent>
                                         <p>Send Back to Author</p>
                                       </TooltipContent>
                                     </Tooltip>
                                   </TooltipProvider>
                                 </div>
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </div>
                </TabsContent>

                <TabsContent value="pending-reviewer" className="p-6">
                  {/* Search and Filter Section */}
                  <div className="mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">ID</label>
                        <Input
                          placeholder="Search by ID..."
                          value={pendingIdFilter}
                          onChange={(e) => setPendingIdFilter(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Title</label>
                        <Input
                          placeholder="Search by title..."
                          value={pendingTitleFilter}
                          onChange={(e) => setPendingTitleFilter(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Reviewer Name</label>
                        <Select value={pendingReviewerFilter} onValueChange={setPendingReviewerFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reviewer..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Reviewers</SelectItem>
                            {mockReviewers.map((reviewer) => (
                              <SelectItem key={reviewer.id} value={reviewer.name}>
                                {reviewer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => {}}>Search</Button>
                      <Button variant="outline" onClick={handlePendingReset}>Reset</Button>
                    </div>
                  </div>

                  {/* Table Section */}
                  <div className="border rounded-lg overflow-hidden">
                    <ResizablePanelGroup direction="horizontal" className="h-[600px]">
                      <ResizablePanel defaultSize={8} minSize={5}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">ID</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredPendingReviewManuscripts.map((manuscript) => (
                               <div key={`id-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-32 flex items-start">
                                 <button className="text-primary hover:underline font-medium">
                                   {manuscript.id}
                                 </button>
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={30} minSize={20}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Article Title</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredPendingReviewManuscripts.map((manuscript) => (
                               <div key={`title-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-32 flex flex-col justify-start">
                                 <div className="font-medium mb-1">{manuscript.title}</div>
                                 <div className="text-sm text-muted-foreground mt-1">{manuscript.authors}</div>
                                 <div className="flex flex-wrap gap-1 mt-2">
                                   {manuscript.keywords.map((keyword, index) => (
                                     <Badge key={index} variant="secondary" className="text-xs">
                                       {keyword}
                                     </Badge>
                                   ))}
                                 </div>
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={12} minSize={8}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Submission Date</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredPendingReviewManuscripts.map((manuscript) => (
                               <div key={`date-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-32 flex items-start">
                                 {manuscript.submissionDate}
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={40} minSize={30}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Reviewers & Deadlines</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredPendingReviewManuscripts.map((manuscript) => (
                               <div key={`reviewers-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-32 flex flex-col justify-start">
                                 <div className="space-y-2">
                                   {manuscript.reviewers.length > 0 ? (
                                     manuscript.reviewers.map((reviewer, index) => (
                                       <div key={index} className="flex items-center justify-between py-1">
                                         <div className="flex items-center gap-2 text-sm">
                                           <span className={getReviewerNameStyle(reviewer.status)}>
                                             {reviewer.name}
                                           </span>
                                           {reviewer.status === 'accepted' && <Check className="h-3 w-3 text-blue-700" />}
                                           {reviewer.status === 'declined' && <X className="h-3 w-3 text-red-500" />}
                                         </div>
                                         <div className="flex items-center gap-3">
                                           <span className="text-sm">
                                             {manuscript.reviewDeadlines[index] || 'No deadline'}
                                           </span>
                                           {reviewer.status === 'accepted' && (
                                             <TooltipProvider>
                                               <Tooltip>
                                                 <TooltipTrigger asChild>
                                                   <AlertDialog>
                                                     <AlertDialogTrigger asChild>
                                                       <Button variant="ghost" size="sm">
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
                                                           onClick={() => handleRemindReviewer(manuscript.id, reviewer.name)}
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
                                           )}
                                         </div>
                                       </div>
                                     ))
                                   ) : (
                                     <div className="text-sm text-muted-foreground">No reviewers assigned</div>
                                   )}
                                 </div>
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={10} minSize={8}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Actions</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredPendingReviewManuscripts.map((manuscript) => (
                               <div key={`actions-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-32 flex items-start">
                                 <TooltipProvider>
                                   <Tooltip>
                                     <TooltipTrigger asChild>
                                       <Button
                                         variant="outline"
                                         size="sm"
                                         onClick={() => handleAssignReviewer(manuscript.id)}
                                       >
                                         <UserPlus size={14} />
                                       </Button>
                                     </TooltipTrigger>
                                     <TooltipContent>
                                       <p>Assign Reviewer</p>
                                     </TooltipContent>
                                   </Tooltip>
                                 </TooltipProvider>
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </div>

                  {filteredPendingReviewManuscripts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No manuscripts found that need reviewer assignment.
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="assigned-reviewer" className="p-6">
                  {/* Search and Filter Section */}
                  <div className="mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">ID</label>
                        <Input
                          placeholder="Search by ID..."
                          value={assignedIdFilter}
                          onChange={(e) => setAssignedIdFilter(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Title</label>
                        <Input
                          placeholder="Search by title..."
                          value={assignedTitleFilter}
                          onChange={(e) => setAssignedTitleFilter(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Reviewer Name</label>
                        <Select value={assignedReviewerFilter} onValueChange={setAssignedReviewerFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reviewer..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Reviewers</SelectItem>
                            {mockReviewers.map((reviewer) => (
                              <SelectItem key={reviewer.id} value={reviewer.name}>
                                {reviewer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSearch}>Search</Button>
                      <Button variant="outline" onClick={handleAssignedReset}>Reset</Button>
                    </div>
                  </div>

                  {/* Assigned Reviewer Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <ResizablePanelGroup direction="horizontal" className="h-[600px]">
                      <ResizablePanel defaultSize={10} minSize={8}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">ID</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredAssignedManuscripts.map((manuscript) => (
                               <div key={`id-${manuscript.id}`} className="p-3 hover:bg-muted/50 font-medium h-32 flex items-start">
                                 {manuscript.id}
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={40} minSize={30}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Article Title</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredAssignedManuscripts.map((manuscript) => (
                               <div key={`title-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-32 flex flex-col justify-start">
                                 <div className="font-medium">{manuscript.title}</div>
                                 <div className="text-sm text-muted-foreground mt-1">{manuscript.authors}</div>
                                 <div className="flex flex-wrap gap-1 mt-2">
                                   {manuscript.keywords.map((keyword, index) => (
                                     <Badge key={index} variant="secondary" className="text-xs">
                                       {keyword}
                                     </Badge>
                                   ))}
                                 </div>
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={15} minSize={10}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Submission Date</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredAssignedManuscripts.map((manuscript) => (
                               <div key={`date-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-32 flex items-start">
                                 {manuscript.submissionDate}
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={35} minSize={25}>
                        <div className="h-full flex flex-col">
                          <div className="border-b bg-muted/50 p-3 font-medium sticky top-0">Reviewers & Deadlines</div>
                          <div className="flex-1 divide-y overflow-auto">
                             {filteredAssignedManuscripts.map((manuscript) => (
                               <div key={`reviewers-${manuscript.id}`} className="p-3 hover:bg-muted/50 h-32 flex flex-col justify-start">
                                 <div className="space-y-2">
                                   {manuscript.reviewers.filter(r => r.status === 'accepted').map((reviewer, index) => (
                                     <div key={index} className="flex items-center justify-between py-1">
                                       <div className="flex items-center gap-2 text-sm">
                                         <span className="text-blue-700 font-medium">
                                           {reviewer.name}
                                         </span>
                                         <Check className="h-3 w-3 text-blue-700" />
                                       </div>
                                       <div className="flex items-center gap-3">
                                         <span className="text-sm">
                                           {manuscript.reviewDeadlines[index] || 'No deadline'}
                                         </span>
                                         <TooltipProvider>
                                           <Tooltip>
                                             <TooltipTrigger asChild>
                                               <AlertDialog>
                                                 <AlertDialogTrigger asChild>
                                                   <Button variant="ghost" size="sm">
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
                                                       onClick={() => handleRemindReviewer(manuscript.id, reviewer.name)}
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
                                       </div>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             ))}
                          </div>
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </div>

                  {filteredAssignedManuscripts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No manuscripts found with assigned reviewers.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>

        {/* Confirmation Dialog for Send to Reviewer */}
        <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
              <AlertDialogDescription>
                Confirm submission of this manuscript for review?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmSendToReviewer}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog for Assign Reviewer */}
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
                        onClick={() => handleRemoveReviewer(index)}
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
                          handleReviewerSelect(index, value, reviewer.name);
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
                    <Label>Review Deadline</Label>
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
                          {assignment.deadline ? format(assignment.deadline, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={assignment.deadline}
                          onSelect={(date) => handleDeadlineSelect(index, date)}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={handleAddReviewer}
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
              <Button onClick={handleAssignReviewerSubmit}>
                Assign Reviewers
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog for Send Back to Author */}
        <Dialog open={sendBackDialogOpen} onOpenChange={setSendBackDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Send Back to Author</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Rejection Reason Category</Label>
                <RadioGroup
                  value={sendBackForm.category}
                  onValueChange={(value) => setSendBackForm(prev => ({ ...prev, category: value as SendBackFormData['category'] }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="content-quality" id="content-quality" />
                    <Label htmlFor="content-quality">Content & Quality</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="form-formatting" id="form-formatting" />
                    <Label htmlFor="form-formatting">Form & Formatting</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ethics-compliance" id="ethics-compliance" />
                    <Label htmlFor="ethics-compliance">Ethics & Compliance</Label>
                  </div>
                </RadioGroup>
                {formErrors.category && <p className="text-sm text-destructive">{formErrors.category}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Detailed Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide detailed reason for sending back..."
                  value={sendBackForm.reason}
                  onChange={(e) => setSendBackForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="min-h-[100px]"
                />
                {formErrors.reason && <p className="text-sm text-destructive">{formErrors.reason}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSendBackDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendBackSubmit}>
                Send Back
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default Manuscripts;