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

const Manuscripts = () => {
  const { user } = useAuth();
  const [titleFilter, setTitleFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const filteredManuscripts = mockManuscripts.filter(manuscript => {
    const matchesTitle = manuscript.title.toLowerCase().includes(titleFilter.toLowerCase());
    const matchesAuthor = manuscript.authors.toLowerCase().includes(authorFilter.toLowerCase());
    const matchesStatus = statusFilter === '' || statusFilter === 'all' || manuscript.status === statusFilter;
    return matchesTitle && matchesAuthor && matchesStatus;
  });

  const handleSearch = () => {
    // Search functionality is already implemented through the filter state
  };

  const handleReset = () => {
    setTitleFilter('');
    setAuthorFilter('');
    setStatusFilter('all');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
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
                  <div className="text-center py-8 text-muted-foreground">
                    Waiting for Review tab content will be implemented next.
                  </div>
                </TabsContent>

                <TabsContent value="waiting-decision" className="p-6">
                  <div className="text-center py-8 text-muted-foreground">
                    Waiting for Decision tab content will be implemented next.
                  </div>
                </TabsContent>

                <TabsContent value="completed" className="p-6">
                  <div className="text-center py-8 text-muted-foreground">
                    Completed tab content will be implemented next.
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Manuscripts;