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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, ArrowLeft, Bell, Download, Send, Undo2 } from 'lucide-react';
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

// Schema for send back form validation
const sendBackSchema = z.object({
  category: z.enum(['content-quality', 'form-formatting', 'ethics-compliance'], {
    required_error: "Please select a rejection reason category"
  }),
  reason: z.string().trim().min(10, "Detailed reason must be at least 10 characters").max(500, "Detailed reason must be less than 500 characters")
});

type SendBackFormData = z.infer<typeof sendBackSchema>;

const Manuscripts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for "All" tab filters
  const [titleFilter, setTitleFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // State for "Waiting for Review" tab filters
  const [waitingTitleFilter, setWaitingTitleFilter] = useState('');
  const [waitingAuthorFilter, setWaitingAuthorFilter] = useState('');

  // State for managing manuscript data
  const [waitingReviewManuscripts, setWaitingReviewManuscripts] = useState(mockWaitingReviewManuscripts);
  const [pendingReviewerManuscripts, setPendingReviewerManuscripts] = useState<typeof mockWaitingReviewManuscripts>([]);

  // Dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [sendBackDialogOpen, setSendBackDialogOpen] = useState(false);
  const [selectedManuscriptId, setSelectedManuscriptId] = useState<string>('');
  
  // Send back form state
  const [sendBackForm, setSendBackForm] = useState<SendBackFormData>({
    category: 'content-quality' as const,
    reason: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof SendBackFormData, string>>>({});
  

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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

  const handleSendToReviewer = (manuscriptId: string) => {
    setSelectedManuscriptId(manuscriptId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSendToReviewer = () => {
    const manuscript = waitingReviewManuscripts.find(m => m.id === selectedManuscriptId);
    if (manuscript) {
      // Remove from waiting review and add to pending reviewer
      setWaitingReviewManuscripts(prev => prev.filter(m => m.id !== selectedManuscriptId));
      setPendingReviewerManuscripts(prev => [...prev, manuscript]);
      
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
      
      const manuscript = waitingReviewManuscripts.find(m => m.id === selectedManuscriptId);
      if (manuscript) {
        // Remove from waiting review
        setWaitingReviewManuscripts(prev => prev.filter(m => m.id !== selectedManuscriptId));
        
        const categoryLabels = {
          'content-quality': 'Content & Quality',
          'form-formatting': 'Form & Formatting',
          'ethics-compliance': 'Ethics & Compliance'
        };
        
        toast({
          title: "Manuscript Sent Back",
          description: `Manuscript has been sent back to author for: ${categoryLabels[sendBackForm.category]}`,
        });
      }
      
      // Reset form and close dialog
      setSendBackForm({ category: 'content-quality', reason: '' });
      setSendBackDialogOpen(false);
      setSelectedManuscriptId('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof SendBackFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof SendBackFormData] = err.message;
          }
        });
        setFormErrors(errors);
      }
    }
  };


  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Manuscripts</h1>
              <p className="text-muted-foreground">
                Manage and review manuscript submissions
              </p>
            </div>

            <div className="bg-card rounded-lg border">
              <Tabs defaultValue="all" className="w-full">
                <div className="border-b border-border">
                  <TabsList className="h-12 w-full justify-start rounded-none bg-transparent p-0">
                    <TabsTrigger 
                      value="all" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      All
                    </TabsTrigger>
                     <TabsTrigger 
                      value="waiting-review" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Waiting for Review
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pending-reviewer" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Pending Reviewer
                    </TabsTrigger>
                    <TabsTrigger 
                      value="assigned-reviewer" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Assigned Reviewer
                    </TabsTrigger>
                    <TabsTrigger 
                      value="waiting-decision" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Waiting for Decision
                    </TabsTrigger>
                    <TabsTrigger 
                      value="completed" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Completed
                    </TabsTrigger>
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
                            <SelectItem value="all">All Statuses</SelectItem>
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
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-24">ID</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead className="min-w-96">Article Title</TableHead>
                          <TableHead>Author Info</TableHead>
                          <TableHead>Submission Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredManuscripts.map((manuscript) => (
                          <TableRow key={manuscript.id} className="hover:bg-muted/50">
                            <TableCell>
                              <button className="text-primary hover:underline font-medium">
                                {manuscript.id}
                              </button>
                            </TableCell>
                            <TableCell className="font-medium">
                              {manuscript.username}
                            </TableCell>
                            <TableCell>
                              <div>
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
                            </TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell>{manuscript.submissionDate}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(manuscript.status)}>
                                {manuscript.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-80">Article Title</TableHead>
                          <TableHead className="min-w-96">Abstract</TableHead>
                          <TableHead>Author Info</TableHead>
                          <TableHead>Submission Date</TableHead>
                          <TableHead>Manuscript</TableHead>
                          <TableHead>Files</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredWaitingReviewManuscripts.map((manuscript) => (
                          <TableRow key={manuscript.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div>
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
                            </TableCell>
                            <TableCell>
                              <div className="text-sm max-w-xs">
                                <p className="line-clamp-4">{manuscript.abstract}</p>
                              </div>
                            </TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell>{manuscript.submissionDate}</TableCell>
                            <TableCell>
                              <button className="text-primary hover:underline text-sm flex items-center gap-1">
                                <Download size={14} />
                                {manuscript.manuscriptFile}
                              </button>
                            </TableCell>
                            <TableCell>
                              <button className="text-primary hover:underline text-sm flex items-center gap-1">
                                <Download size={14} />
                                {manuscript.filesZip}
                              </button>
                            </TableCell>
                            <TableCell>
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
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="pending-reviewer" className="p-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Pending Reviewer tab content - Coming soon</p>
                  </div>
                </TabsContent>

                <TabsContent value="assigned-reviewer" className="p-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Assigned Reviewer tab content - Coming soon</p>
                  </div>
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