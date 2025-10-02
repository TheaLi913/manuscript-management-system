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
import { format } from 'date-fns';
import { CalendarIcon, Plus, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserPlus, ArrowLeft, Bell, Download, Send, Undo2, UserCheck, Gavel, Search, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
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
  },
  {
    id: '234590',
    username: 'Dr. Ahmed Hassan',
    title: 'Blockchain Implementation in Healthcare Data Management',
    keywords: ['Blockchain', 'Healthcare', 'Data Security', 'Privacy'],
    authors: 'Ahmed Hassan*, Sarah Kim, Michael Chang',
    submissionDate: '2024-03-20',
    status: 'Submitted to Journal'
  },
  {
    id: '234591',
    username: 'Prof. Elena Rodriguez',
    title: 'CRISPR Gene Editing: Ethical and Technical Considerations',
    keywords: ['CRISPR', 'Gene Editing', 'Bioethics', 'Biotechnology'],
    authors: 'Elena Rodriguez*, David Brown, Lisa Park*',
    submissionDate: '2024-03-18',
    status: 'Under Review'
  },
  {
    id: '234592',
    username: 'Dr. Thomas Mueller',
    title: 'Artificial Intelligence in Autonomous Vehicle Navigation',
    keywords: ['AI', 'Autonomous Vehicles', 'Navigation', 'Computer Vision'],
    authors: 'Thomas Mueller*, Jennifer Smith, Robert Davis',
    submissionDate: '2024-03-16',
    status: 'With Editor'
  },
  {
    id: '234593',
    username: 'Prof. Linda Wang',
    title: 'Renewable Energy Grid Integration: Challenges and Solutions',
    keywords: ['Renewable Energy', 'Smart Grid', 'Energy Storage', 'Sustainability'],
    authors: 'Linda Wang*, Mark Johnson, Anna Kowalski',
    submissionDate: '2024-03-14',
    status: 'Decision in Process'
  },
  {
    id: '234594',
    username: 'Dr. Carlos Hernandez',
    title: 'Precision Medicine in Cancer Treatment: A Data-Driven Approach',
    keywords: ['Precision Medicine', 'Cancer', 'Data Analysis', 'Personalized Treatment'],
    authors: 'Carlos Hernandez*, Maria Santos, Kevin Liu*',
    submissionDate: '2024-03-12',
    status: 'Minor Revision'
  },
  {
    id: '234595',
    username: 'Prof. Anna Petrov',
    title: 'Quantum Machine Learning for Drug Discovery',
    keywords: ['Quantum Computing', 'Machine Learning', 'Drug Discovery', 'Molecular Modeling'],
    authors: 'Anna Petrov*, James Wilson, Sophie Chen',
    submissionDate: '2024-03-10',
    status: 'Accept'
  },
  {
    id: '234596',
    username: 'Dr. Michael Brown',
    title: 'Sustainable Agriculture Technologies for Climate Resilience',
    keywords: ['Agriculture', 'Climate Change', 'Sustainability', 'Food Security'],
    authors: 'Michael Brown*, Rachel Green, David Lee',
    submissionDate: '2024-03-08',
    status: 'Rejected'
  },
  {
    id: '234597',
    username: 'Prof. Sarah Johnson',
    title: 'Deep Learning Applications in Medical Image Analysis',
    keywords: ['Deep Learning', 'Medical Imaging', 'Computer Vision', 'Healthcare'],
    authors: 'Sarah Johnson*, Alex Kumar, Lisa Anderson',
    submissionDate: '2024-03-06',
    status: 'Under Review'
  },
  {
    id: '234598',
    username: 'Dr. Robert Taylor',
    title: 'Cybersecurity in IoT Networks: Threats and Countermeasures',
    keywords: ['Cybersecurity', 'IoT', 'Network Security', 'Threat Detection'],
    authors: 'Robert Taylor*, Emma Wilson, Mohammad Ali',
    submissionDate: '2024-03-04',
    status: 'With Editor'
  },
  {
    id: '234599',
    username: 'Prof. Jennifer Davis',
    title: 'Nanotechnology Applications in Environmental Remediation',
    keywords: ['Nanotechnology', 'Environmental Science', 'Pollution Control', 'Remediation'],
    authors: 'Jennifer Davis*, Carlos Martinez, Nina Patel*',
    submissionDate: '2024-03-02',
    status: 'Major Revision'
  },
  {
    id: '234600',
    username: 'Dr. Kevin Liu',
    title: 'Robotics in Surgery: Precision and Safety Considerations',
    keywords: ['Robotics', 'Surgery', 'Medical Technology', 'Patient Safety'],
    authors: 'Kevin Liu*, Helen Carter, Thomas Anderson',
    submissionDate: '2024-02-28',
    status: 'Accept'
  },
  {
    id: '234601',
    username: 'Prof. Maria Santos',
    title: 'Virtual Reality in Education: Immersive Learning Experiences',
    keywords: ['Virtual Reality', 'Education', 'Immersive Learning', 'Educational Technology'],
    authors: 'Maria Santos*, John Thompson, Lisa Park',
    submissionDate: '2024-02-26',
    status: 'Rejected'
  },
  {
    id: '234602',
    username: 'Dr. David Chen',
    title: 'Stem Cell Therapy in Regenerative Medicine: Current Progress',
    keywords: ['Stem Cells', 'Regenerative Medicine', 'Cell Therapy', 'Tissue Engineering'],
    authors: 'David Chen*, Sarah Connor, Mark Davis*',
    submissionDate: '2024-02-24',
    status: 'Decision in Process'
  },
  {
    id: '234603',
    username: 'Prof. Lisa Anderson',
    title: 'Artificial Neural Networks for Financial Risk Assessment',
    keywords: ['Neural Networks', 'Finance', 'Risk Assessment', 'Machine Learning'],
    authors: 'Lisa Anderson*, Robert Garcia, Anna Kowalski',
    submissionDate: '2024-02-22',
    status: 'Under Review'
  },
  {
    id: '234604',
    username: 'Dr. Mark Thompson',
    title: 'Gene Therapy Approaches for Inherited Diseases',
    keywords: ['Gene Therapy', 'Genetic Diseases', 'Molecular Medicine', 'Treatment'],
    authors: 'Mark Thompson*, Jennifer Lee, Alex Kumar*',
    submissionDate: '2024-02-20',
    status: 'Minor Revision'
  }
];

// Mock data for review invitations (Reviewer role)
const mockReviewInvitations = [
  {
    id: '234567',
    title: 'Advanced Machine Learning Applications in Medical Diagnosis',
    abstract: 'This study explores the integration of machine learning techniques in clinical decision-making processes. We present novel algorithms that can assist healthcare professionals in diagnosing complex medical conditions with improved accuracy.',
    keywords: ['Machine Learning', 'Medical AI', 'Diagnosis', 'Healthcare'],
    editor: 'Dr. John Smith',
    invitedDate: '2024-03-15',
    dueDate: '2024-04-15',
    manuscriptFile: 'manuscript_234567.pdf'
  },
  {
    id: '234568',
    title: 'Climate Change Impact on Marine Ecosystems: A Comprehensive Analysis',
    abstract: 'This research examines the effects of rising ocean temperatures and acidification on marine biodiversity. Through extensive field studies and data analysis, we demonstrate significant shifts in species distribution and ecosystem dynamics.',
    keywords: ['Climate Change', 'Marine Biology', 'Ecosystem', 'Environmental Science'],
    editor: 'Prof. Emily Chen',
    invitedDate: '2024-03-12',
    dueDate: '2024-04-12',
    manuscriptFile: 'manuscript_234568.pdf'
  },
  {
    id: '234569',
    title: 'Quantum Computing Algorithms for Cryptographic Security',
    abstract: 'We present novel quantum algorithms designed to enhance cryptographic protocols against emerging threats. Our approach leverages quantum entanglement and superposition to create unbreakable encryption systems.',
    keywords: ['Quantum Computing', 'Cryptography', 'Security', 'Algorithms'],
    editor: 'Dr. Michael Rodriguez',
    invitedDate: '2024-03-10',
    dueDate: '2024-04-10',
    manuscriptFile: 'manuscript_234569.pdf'
  },
  {
    id: '234570',
    title: 'Sustainable Energy Solutions for Urban Development',
    abstract: 'This paper investigates innovative renewable energy integration strategies for smart cities. We analyze the economic feasibility and environmental impact of solar, wind, and geothermal energy systems in urban settings.',
    keywords: ['Renewable Energy', 'Urban Planning', 'Sustainability', 'Smart Cities'],
    editor: 'Prof. Sarah Johnson',
    invitedDate: '2024-03-08',
    dueDate: '2024-04-08',
    manuscriptFile: 'manuscript_234570.pdf'
  },
  {
    id: '234571',
    title: 'Neuroplasticity and Cognitive Enhancement in Aging Populations',
    abstract: 'Our longitudinal study explores brain plasticity mechanisms in elderly individuals. We present evidence of cognitive improvement through targeted intervention strategies and lifestyle modifications.',
    keywords: ['Neuroscience', 'Aging', 'Cognitive Science', 'Brain Plasticity'],
    editor: 'Dr. Lisa Wang',
    invitedDate: '2024-03-05',
    dueDate: '2024-04-05',
    manuscriptFile: 'manuscript_234571.pdf'
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
  },
  {
    id: '234605',
    username: 'Dr. Emma Thompson',
    title: 'Machine Learning for Climate Change Prediction and Mitigation',
    abstract: 'Climate change poses unprecedented challenges requiring innovative solutions. This research presents novel machine learning approaches for predicting climate patterns and evaluating mitigation strategies. Our models integrate satellite data, atmospheric measurements, and socioeconomic factors to provide comprehensive climate assessments for policy makers.',
    keywords: ['Climate Change', 'Machine Learning', 'Environmental Science', 'Policy'],
    authors: 'Emma Thompson*, Robert Garcia, Lisa Park*',
    submissionDate: '2024-03-12',
    manuscriptFile: 'manuscript_234605.pdf',
    filesZip: '234605_all_files.zip'
  },
  {
    id: '234606',
    username: 'Prof. Michael Chang',
    title: 'Quantum Cryptography for Next-Generation Security Systems',
    abstract: 'As quantum computing advances, traditional cryptographic methods face new vulnerabilities. This paper explores quantum cryptography protocols that leverage quantum mechanical properties to ensure unbreakable security. We present practical implementations and performance evaluations of quantum key distribution systems.',
    keywords: ['Quantum Cryptography', 'Security', 'Quantum Computing', 'Encryption'],
    authors: 'Michael Chang*, Sarah Kim, David Brown',
    submissionDate: '2024-03-10',
    manuscriptFile: 'manuscript_234606.pdf',
    filesZip: '234606_all_files.zip'
  },
  {
    id: '234607',
    username: 'Dr. Nina Patel',
    title: 'Bioengineering Approaches to Tissue Regeneration',
    abstract: 'Tissue engineering represents a promising frontier in regenerative medicine. This study investigates novel bioengineering approaches for tissue regeneration, including 3D bioprinting, scaffold design, and stem cell integration. Our findings demonstrate significant improvements in tissue viability and functional recovery.',
    keywords: ['Bioengineering', 'Tissue Regeneration', '3D Bioprinting', 'Stem Cells'],
    authors: 'Nina Patel*, Carlos Martinez, Jennifer Lee*',
    submissionDate: '2024-03-08',
    manuscriptFile: 'manuscript_234607.pdf',
    filesZip: '234607_all_files.zip'
  },
  {
    id: '234608',
    username: 'Prof. David Lee',
    title: 'Artificial Intelligence in Personalized Medicine',
    abstract: 'Personalized medicine aims to tailor treatments to individual patients based on their genetic, environmental, and lifestyle factors. This research explores AI-driven approaches for personalized treatment recommendations, drug selection, and outcome prediction. Our platform demonstrates improved patient outcomes and reduced adverse effects.',
    keywords: ['Personalized Medicine', 'AI', 'Genomics', 'Healthcare'],
    authors: 'David Lee*, Anna Kowalski, Mark Thompson',
    submissionDate: '2024-03-06',
    manuscriptFile: 'manuscript_234608.pdf',
    filesZip: '234608_all_files.zip'
  },
  {
    id: '234609',
    username: 'Dr. Rachel Green',
    title: 'Sustainable Energy Storage Solutions for Renewable Systems',
    abstract: 'Energy storage is crucial for the widespread adoption of renewable energy sources. This paper examines advanced battery technologies, including solid-state batteries, flow batteries, and hybrid storage systems. We evaluate their performance, cost-effectiveness, and environmental impact for large-scale deployment.',
    keywords: ['Energy Storage', 'Battery Technology', 'Renewable Energy', 'Sustainability'],
    authors: 'Rachel Green*, Thomas Anderson, Maria Santos',
    submissionDate: '2024-03-04',
    manuscriptFile: 'manuscript_234609.pdf',
    filesZip: '234609_all_files.zip'
  },
  {
    id: '234610',
    username: 'Prof. James Wilson',
    title: 'Nanotechnology Applications in Cancer Therapy',
    abstract: 'Nanotechnology offers promising solutions for targeted cancer therapy with reduced side effects. This research investigates nanoparticle-based drug delivery systems, including liposomes, polymeric nanoparticles, and gold nanoparticles. Our studies demonstrate enhanced tumor targeting and improved therapeutic efficacy.',
    keywords: ['Nanotechnology', 'Cancer Therapy', 'Drug Delivery', 'Targeted Treatment'],
    authors: 'James Wilson*, Helen Carter, Kevin Liu*',
    submissionDate: '2024-03-02',
    manuscriptFile: 'manuscript_234610.pdf',
    filesZip: '234610_all_files.zip'
  },
  {
    id: '234611',
    username: 'Dr. Sophie Chen',
    title: 'Robotics and Automation in Modern Manufacturing',
    abstract: 'The manufacturing industry is undergoing a digital transformation driven by robotics and automation technologies. This study examines the integration of collaborative robots, AI-driven quality control, and predictive maintenance systems. Our analysis shows significant improvements in productivity, quality, and worker safety.',
    keywords: ['Robotics', 'Manufacturing', 'Automation', 'Industry 4.0'],
    authors: 'Sophie Chen*, Mohammad Ali, Jennifer Davis',
    submissionDate: '2024-02-28',
    manuscriptFile: 'manuscript_234611.pdf',
    filesZip: '234611_all_files.zip'
  },
  {
    id: '234612',
    username: 'Prof. Robert Davis',
    title: 'Virtual and Augmented Reality in Medical Training',
    abstract: 'Medical education is being revolutionized by virtual and augmented reality technologies. This paper explores immersive training platforms for surgical procedures, anatomy education, and patient diagnosis. Our evaluation demonstrates enhanced learning outcomes and skill retention among medical students and professionals.',
    keywords: ['Virtual Reality', 'Medical Education', 'Training', 'Healthcare Technology'],
    authors: 'Robert Davis*, Lisa Anderson, Alex Kumar',
    submissionDate: '2024-02-26',
    manuscriptFile: 'manuscript_234612.pdf',
    filesZip: '234612_all_files.zip'
  }
];

// Mock data for pending reviewer manuscripts
const mockPendingReviewManuscripts = [
  {
    id: '234576',
    title: 'Advanced Neural Networks for Natural Language Processing',
    abstract: 'Natural language processing has seen significant advancements with the introduction of transformer architectures. This research presents novel neural network designs that improve upon existing models in terms of efficiency and accuracy.',
    keywords: ['Neural Networks', 'NLP', 'Transformers', 'Deep Learning'],
    acceptedDate: '2024-03-20',
    dueDate: '2024-04-20',
    editor: 'Dr. John Smith',
    manuscriptFile: 'manuscript_234576.pdf'
  },
  {
    id: '234577',
    title: 'Quantum Cryptography: Security in the Post-Quantum Era',
    abstract: 'As quantum computers become more powerful, traditional cryptographic methods face unprecedented threats. This study investigates quantum-resistant cryptographic protocols and their practical implementation.',
    keywords: ['Quantum Cryptography', 'Post-Quantum Security', 'Encryption', 'Cybersecurity'],
    acceptedDate: '2024-03-18',
    dueDate: '2024-04-18',
    editor: 'Prof. Emily Chen',
    manuscriptFile: 'manuscript_234577.pdf'
  },
  {
    id: '234578',
    title: 'Sustainable Agriculture Technologies for Climate Adaptation',
    abstract: 'Climate change poses significant challenges to global food security. This research explores innovative agricultural technologies that can help farmers adapt to changing climate conditions.',
    keywords: ['Sustainable Agriculture', 'Climate Adaptation', 'Precision Farming', 'Food Security'],
    acceptedDate: '2024-03-15',
    dueDate: '2024-04-15',
    editor: 'Dr. Michael Rodriguez',
    manuscriptFile: 'manuscript_234578.pdf'
  },
  {
    id: '234579',
    title: 'Biomedical Engineering Applications in Regenerative Medicine',
    abstract: 'Regenerative medicine represents a paradigm shift in healthcare, offering potential cures for previously incurable conditions. This comprehensive review examines the latest biomedical engineering approaches.',
    keywords: ['Regenerative Medicine', 'Biomedical Engineering', 'Tissue Engineering', 'Stem Cells'],
    acceptedDate: '2024-03-12',
    dueDate: '2024-04-12',
    editor: 'Prof. Sarah Johnson',
    manuscriptFile: 'manuscript_234579.pdf'
  },
  {
    id: '234580',
    title: 'Deep Learning for Medical Image Analysis',
    abstract: 'Medical imaging plays a crucial role in modern healthcare. This research explores deep learning approaches for automated disease detection and diagnosis from medical images, demonstrating improved accuracy over traditional methods.',
    keywords: ['Deep Learning', 'Medical Imaging', 'Computer Vision', 'Healthcare'],
    acceptedDate: '2024-03-10',
    dueDate: '2024-04-10',
    editor: 'Dr. Lisa Wang',
    manuscriptFile: 'manuscript_234580.pdf'
  },
  {
    id: '234581',
    title: 'Smart Grid Technologies for Energy Distribution',
    abstract: 'The integration of renewable energy sources requires advanced grid management systems. This paper presents smart grid technologies that optimize energy distribution and improve grid reliability.',
    keywords: ['Smart Grid', 'Energy Distribution', 'Renewable Energy', 'Optimization'],
    acceptedDate: '2024-03-08',
    dueDate: '2024-04-08',
    editor: 'Dr. John Smith',
    manuscriptFile: 'manuscript_234581.pdf'
  },
  {
    id: '234582',
    title: 'Nanotechnology in Drug Delivery Systems',
    abstract: 'Nanotechnology offers revolutionary approaches to drug delivery. This study investigates nanoparticle-based delivery systems that enhance drug efficacy while minimizing side effects.',
    keywords: ['Nanotechnology', 'Drug Delivery', 'Pharmaceuticals', 'Nanoparticles'],
    acceptedDate: '2024-03-06',
    dueDate: '2024-04-06',
    editor: 'Prof. Emily Chen',
    manuscriptFile: 'manuscript_234582.pdf'
  },
  {
    id: '234583',
    title: 'Artificial Intelligence in Autonomous Vehicles',
    abstract: 'Autonomous vehicles represent the future of transportation. This research examines AI algorithms for vehicle perception, decision-making, and control in complex traffic scenarios.',
    keywords: ['AI', 'Autonomous Vehicles', 'Machine Learning', 'Transportation'],
    acceptedDate: '2024-03-04',
    dueDate: '2024-04-04',
    editor: 'Dr. Michael Rodriguez',
    manuscriptFile: 'manuscript_234583.pdf'
  },
  {
    id: '234613',
    username: 'Dr. Alan Foster',
    title: 'Machine Learning for Autonomous Systems',
    abstract: 'Autonomous systems require sophisticated decision-making capabilities to operate safely in complex environments. This research develops machine learning algorithms for autonomous navigation, obstacle avoidance, and task planning. Our approach combines reinforcement learning with computer vision to create robust autonomous behaviors.',
    keywords: ['Machine Learning', 'Autonomous Systems', 'Robotics', 'Computer Vision'],
    authors: 'Alan Foster*, Catherine Smith, Daniel Kim',
    submissionDate: '2024-02-18',
    reviewers: [
      { name: 'Dr. Emma Wilson', status: 'pending' },
      { name: 'Prof. Mark Thompson', status: 'accepted' }
    ],
    reviewDeadlines: ['2024-04-03', '2024-04-06']
  },
  {
    id: '234614',
    username: 'Prof. Maria Rodriguez',
    title: 'Precision Medicine in Oncology: Genomic Approaches',
    abstract: 'Cancer treatment is increasingly personalized based on tumor genomics and patient characteristics. This study investigates genomic biomarkers for treatment selection and outcome prediction in various cancer types. Our analysis of large-scale genomic datasets reveals novel therapeutic targets and resistance mechanisms.',
    keywords: ['Precision Medicine', 'Oncology', 'Genomics', 'Cancer Treatment'],
    authors: 'Maria Rodriguez*, Kevin Zhang, Lisa Chen*',
    submissionDate: '2024-02-16',
    reviewers: [],
    reviewDeadlines: []
  },
  {
    id: '234615',
    username: 'Dr. Thomas Anderson',
    title: 'Sustainable Manufacturing Processes in the Circular Economy',
    abstract: 'The circular economy paradigm requires manufacturing processes that minimize waste and maximize resource efficiency. This research examines sustainable manufacturing technologies, including additive manufacturing, bio-based materials, and closed-loop recycling systems. Our framework demonstrates significant environmental and economic benefits.',
    keywords: ['Sustainable Manufacturing', 'Circular Economy', 'Resource Efficiency', 'Environmental Impact'],
    authors: 'Thomas Anderson*, Sophie Brown, Mark Wilson',
    submissionDate: '2024-02-14',
    reviewers: [
      { name: 'Dr. Rachel Green', status: 'accepted' },
      { name: 'Prof. James Wilson', status: 'pending' },
      { name: 'Dr. Kevin Liu', status: 'accepted' }
    ],
    reviewDeadlines: ['2024-04-01', '2024-04-04', '2024-04-07']
  },
  {
    id: '234616',
    username: 'Prof. Helen Carter',
    title: 'Biomaterials for Neural Interface Applications',
    abstract: 'Neural interfaces require biocompatible materials that can maintain stable connections with neural tissue. This study develops novel biomaterials for brain-computer interfaces, focusing on conductivity, biocompatibility, and long-term stability. Our materials show promising results in both in vitro and in vivo studies.',
    keywords: ['Biomaterials', 'Neural Interfaces', 'Brain-Computer Interface', 'Biocompatibility'],
    authors: 'Helen Carter*, Mohammad Ali, Jennifer Park*',
    submissionDate: '2024-02-12',
    reviewers: [
      { name: 'Prof. David Chen', status: 'declined' },
      { name: 'Dr. Lisa Park', status: 'pending' }
    ],
    reviewDeadlines: ['2024-03-30', '2024-04-02']
  },
  {
    id: '234617',
    username: 'Dr. Carlos Martinez',
    title: 'Smart Cities: IoT Infrastructure and Data Analytics',
    abstract: 'Smart cities leverage IoT technologies and data analytics to improve urban services and quality of life. This research presents a comprehensive IoT infrastructure for smart city applications, including traffic management, energy optimization, and environmental monitoring. Our platform demonstrates scalability and cost-effectiveness.',
    keywords: ['Smart Cities', 'IoT', 'Data Analytics', 'Urban Technology'],
    authors: 'Carlos Martinez*, Nina Patel, David Lee',
    submissionDate: '2024-02-10',
    reviewers: [],
    reviewDeadlines: []
  },
  {
    id: '234618',
    username: 'Prof. Jennifer Lee',
    title: 'Artificial Intelligence in Financial Risk Management',
    abstract: 'Financial institutions face increasing complexity in risk assessment and management. This study develops AI-driven approaches for credit risk evaluation, market risk prediction, and fraud detection. Our machine learning models demonstrate superior performance compared to traditional statistical methods.',
    keywords: ['AI', 'Financial Risk', 'Machine Learning', 'Risk Management'],
    authors: 'Jennifer Lee*, Robert Taylor, Anna Kowalski',
    submissionDate: '2024-02-08',
    reviewers: [
      { name: 'Dr. Emma Wilson', status: 'accepted' },
      { name: 'Prof. Alan Smith', status: 'pending' },
      { name: 'Dr. Sarah Connor', status: 'accepted' }
    ],
    reviewDeadlines: ['2024-03-28', '2024-03-31', '2024-04-03']
  }
];

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
    },
    {
      id: '234619',
      title: 'Advanced Robotics in Healthcare Applications',
      abstract: 'Healthcare robotics is transforming patient care and medical procedures. This research investigates advanced robotic systems for surgery, rehabilitation, and patient assistance.',
      keywords: ['Robotics', 'Healthcare', 'Surgery', 'Medical Technology'],
      authors: 'Dr. Robot Master*, Prof. Medical Tech, Dr. Healthcare Innovation',
      submissionDate: '2024-02-10',
      reviewers: [
        { name: 'Dr. Robotics Expert', status: 'accepted' },
        { name: 'Prof. Medical Engineering', status: 'accepted' },
        { name: 'Dr. Surgery Specialist', status: 'accepted' }
      ],
      reviewDeadlines: ['2024-03-26', '2024-03-28', '2024-03-30']
    },
    {
      id: '234620',
      title: 'Sustainable Energy Systems for Smart Cities',
      abstract: 'Smart cities require sustainable energy solutions to support growing urban populations. This study examines integrated energy systems combining solar, wind, and storage technologies.',
      keywords: ['Smart Cities', 'Sustainable Energy', 'Urban Planning', 'Energy Storage'],
      authors: 'Prof. Energy Guru*, Dr. City Planner, Dr. Sustainability Expert',
      submissionDate: '2024-02-08',
      reviewers: [
        { name: 'Dr. Energy Systems', status: 'accepted' },
        { name: 'Prof. Urban Technology', status: 'accepted' },
        { name: 'Dr. Renewable Expert', status: 'accepted' }
      ],
      reviewDeadlines: ['2024-03-24', '2024-03-26', '2024-03-28']
    },
    {
      id: '234621',
      title: 'Artificial Intelligence in Financial Trading Systems',
      abstract: 'Financial markets are increasingly automated through AI trading systems. This research develops sophisticated algorithms for market prediction and automated trading.',
      keywords: ['AI', 'Financial Trading', 'Market Prediction', 'Automated Systems'],
      authors: 'Dr. Finance AI*, Prof. Trading Systems, Dr. Market Analysis',
      submissionDate: '2024-02-06',
      reviewers: [
        { name: 'Prof. Financial AI', status: 'accepted' },
        { name: 'Dr. Market Expert', status: 'accepted' },
        { name: 'Dr. Trading Specialist', status: 'accepted' }
      ],
      reviewDeadlines: ['2024-03-22', '2024-03-24', '2024-03-26']
    },
    {
      id: '234622',
      title: 'Biotechnology Applications in Environmental Restoration',
      abstract: 'Environmental restoration increasingly relies on biotechnology solutions. This study explores bioremediation techniques using engineered microorganisms for pollution cleanup.',
      keywords: ['Biotechnology', 'Environmental Restoration', 'Bioremediation', 'Pollution Control'],
      authors: 'Prof. Bio Expert*, Dr. Environmental Science, Dr. Microbiology',
      submissionDate: '2024-02-04',
      reviewers: [
        { name: 'Dr. Biotechnology', status: 'accepted' },
        { name: 'Prof. Environmental Engineering', status: 'accepted' },
        { name: 'Dr. Remediation Expert', status: 'accepted' }
      ],
      reviewDeadlines: ['2024-03-20', '2024-03-22', '2024-03-24']
    },
    {
      id: '234623',
      title: 'Neural Interface Technologies for Paralysis Treatment',
      abstract: 'Neural interfaces offer hope for paralysis patients by restoring communication between brain and muscles. This research develops advanced brain-computer interfaces.',
      keywords: ['Neural Interfaces', 'Brain-Computer Interface', 'Paralysis Treatment', 'Neurotechnology'],
      authors: 'Dr. Neural Tech*, Prof. Neuroscience, Dr. Medical Devices',
      submissionDate: '2024-02-02',
      reviewers: [
        { name: 'Prof. Neurotechnology', status: 'accepted' },
        { name: 'Dr. Brain Interface', status: 'accepted' },
        { name: 'Dr. Neural Engineering', status: 'accepted' }
      ],
      reviewDeadlines: ['2024-03-18', '2024-03-20', '2024-03-22']
    },
    {
      id: '234624',
      title: 'Quantum Sensors for Medical Diagnostics',
      abstract: 'Quantum sensors provide unprecedented sensitivity for medical diagnostics. This study develops quantum-enhanced imaging and detection systems for early disease diagnosis.',
      keywords: ['Quantum Sensors', 'Medical Diagnostics', 'Quantum Imaging', 'Early Detection'],
      authors: 'Prof. Quantum Medicine*, Dr. Sensor Technology, Dr. Medical Physics',
      submissionDate: '2024-01-30',
      reviewers: [
        { name: 'Dr. Quantum Physics', status: 'accepted' },
        { name: 'Prof. Medical Imaging', status: 'accepted' },
        { name: 'Dr. Diagnostic Systems', status: 'accepted' }
      ],
      reviewDeadlines: ['2024-03-16', '2024-03-18', '2024-03-20']
    }
  ];

// Mock data for Waiting for Decision tab (manuscripts with completed reviews)
const mockWaitingDecisionManuscripts = [
  {
    id: '234582',
    title: 'Deep Learning Applications in Medical Image Analysis',
    authors: 'Dr. Medical Smith*, Prof. AI Jones, Dr. Vision Brown',
    submissionDate: '2024-01-20',
    reviewers: [
      { 
        name: 'Dr. Expert One', 
        score: 8, 
        decision: 'Accept',
        confidentialComments: 'This manuscript presents novel and significant contributions to medical image analysis. The methodology is sound and the results are impressive.',
        publicComments: 'The authors have provided comprehensive analysis and validation. Minor revisions suggested for clarity in section 3.2.',
        submissionDate: '2024-03-25'
      },
      { 
        name: 'Prof. Expert Two', 
        score: 7, 
        decision: 'Minor Revision',
        confidentialComments: 'Good work overall, but some concerns about the dataset size and generalizability need to be addressed.',
        publicComments: 'Please expand the discussion on limitations and provide more details on the validation methodology.',
        submissionDate: '2024-03-22'
      },
      { 
        name: 'Dr. Expert Three', 
        score: 9, 
        decision: 'Accept',
        confidentialComments: 'Excellent research with clear clinical relevance. Recommend acceptance with minor formatting adjustments.',
        publicComments: 'Outstanding contribution to the field. Please address the minor formatting issues noted in the attached comments.',
        submissionDate: '2024-03-28'
      }
    ]
  },
  {
    id: '234583',
    title: 'Blockchain Security in Financial Systems',
    authors: 'Prof. Crypto Lee*, Dr. Security Wang, Dr. Finance Chen',
    submissionDate: '2024-01-15',
    reviewers: [
      { 
        name: 'Dr. Blockchain Expert', 
        score: 6, 
        decision: 'Major Revision',
        confidentialComments: 'The core idea is interesting but the paper lacks sufficient technical depth and proper evaluation against existing methods.',
        publicComments: 'Significant improvements needed in the technical implementation section. Please provide comprehensive comparison with state-of-the-art methods.',
        submissionDate: '2024-03-20'
      },
      { 
        name: 'Prof. Security Master', 
        score: 5, 
        decision: 'Reject',
        confidentialComments: 'While the topic is relevant, the execution falls short of publication standards. Major methodological flaws identified.',
        publicComments: 'The paper requires substantial revision of the methodology and additional experimental validation.',
        submissionDate: '2024-03-18'
      },
      { 
        name: 'Dr. Finance Specialist', 
        score: 7, 
        decision: 'Minor Revision',
        confidentialComments: 'Good practical insights but needs better integration with existing financial security frameworks.',
        publicComments: 'Please strengthen the literature review and provide more detailed analysis of real-world applicability.',
        submissionDate: '2024-03-24'
      }
    ]
  },
  {
    id: '234625',
    title: 'Sustainable Agriculture Through Precision Farming',
    authors: 'Prof. Farm Tech*, Dr. Crop Science, Dr. Environmental Systems',
    submissionDate: '2024-01-12',
    reviewers: [
      { 
        name: 'Dr. Agriculture Expert', 
        score: 8, 
        decision: 'Accept',
        confidentialComments: 'Comprehensive study on precision farming with strong practical implications. Methodology is robust and results are significant.',
        publicComments: 'Excellent work that will advance sustainable agriculture practices. Minor formatting issues in references section.',
        submissionDate: '2024-03-15'
      },
      { 
        name: 'Prof. Environmental Science', 
        score: 9, 
        decision: 'Accept',
        confidentialComments: 'Outstanding contribution to sustainable agriculture. Clear environmental benefits demonstrated.',
        publicComments: 'Highly recommend acceptance. This work provides valuable insights for sustainable farming practices.',
        submissionDate: '2024-03-12'
      },
      { 
        name: 'Dr. Technology Integration', 
        score: 7, 
        decision: 'Minor Revision',
        confidentialComments: 'Good integration of technology solutions. Some concerns about scalability need addressing.',
        publicComments: 'Please provide more analysis on scalability and cost-effectiveness for small-scale farmers.',
        submissionDate: '2024-03-18'
      }
    ]
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

// Reviewer Manuscripts Component
const ReviewerManuscripts = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('review-invitation');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>(null);
  
  // Filter states for Review Invitation tab
  const [filterId, setFilterId] = useState('');
  const [filterTitle, setFilterTitle] = useState('');
  const [filterEditor, setFilterEditor] = useState('');
  const [filteredInvitations, setFilteredInvitations] = useState(mockReviewInvitations);

  // Filter states for Pending Review tab
  const [pendingFilterId, setPendingFilterId] = useState('');
  const [pendingFilterTitle, setPendingFilterTitle] = useState('');
  const [pendingFilterEditor, setPendingFilterEditor] = useState('');
  const [filteredPendingReviews, setFilteredPendingReviews] = useState(mockPendingReviewManuscripts);

  // Get unique editors for dropdown
  const uniqueEditors = Array.from(new Set(mockReviewInvitations.map(inv => inv.editor)));
  const uniquePendingEditors = Array.from(new Set(mockPendingReviewManuscripts.map(m => m.editor)));

  // Handle search
  const handleSearch = () => {
    const filtered = mockReviewInvitations.filter(invitation => {
      const matchesId = !filterId || invitation.id.toLowerCase().includes(filterId.toLowerCase());
      const matchesTitle = !filterTitle || invitation.title.toLowerCase().includes(filterTitle.toLowerCase());
      const matchesEditor = !filterEditor || invitation.editor === filterEditor;
      
      return matchesId && matchesTitle && matchesEditor;
    });
    
    setFilteredInvitations(filtered);
    toast({
      title: "Search Applied",
      description: `Found ${filtered.length} manuscript(s)`,
    });
  };

  // Handle reset
  const handleReset = () => {
    setFilterId('');
    setFilterTitle('');
    setFilterEditor('');
    setFilteredInvitations(mockReviewInvitations);
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared",
    });
  };

  // Handle search for Pending Review tab
  const handlePendingSearch = () => {
    const filtered = mockPendingReviewManuscripts.filter(manuscript => {
      const matchesId = !pendingFilterId || manuscript.id.toLowerCase().includes(pendingFilterId.toLowerCase());
      const matchesTitle = !pendingFilterTitle || manuscript.title.toLowerCase().includes(pendingFilterTitle.toLowerCase());
      const matchesEditor = !pendingFilterEditor || pendingFilterEditor === 'all' || manuscript.editor === pendingFilterEditor;
      
      return matchesId && matchesTitle && matchesEditor;
    });
    
    setFilteredPendingReviews(filtered);
    toast({
      title: "Search Applied",
      description: `Found ${filtered.length} manuscript(s)`,
    });
  };

  // Handle reset for Pending Review tab
  const handlePendingReset = () => {
    setPendingFilterId('');
    setPendingFilterTitle('');
    setPendingFilterEditor('');
    setFilteredPendingReviews(mockPendingReviewManuscripts);
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Manuscripts</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="review-invitation">Review Invitation</TabsTrigger>
              <TabsTrigger value="pending-review">Pending Review</TabsTrigger>
              <TabsTrigger value="completed-review">Completed Review</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="review-invitation" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ID</label>
                    <Input 
                      placeholder="Enter manuscript ID" 
                      value={filterId}
                      onChange={(e) => setFilterId(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input 
                      placeholder="Enter title keywords" 
                      value={filterTitle}
                      onChange={(e) => setFilterTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Editor Name</label>
                    <Select value={filterEditor} onValueChange={setFilterEditor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select editor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Editors</SelectItem>
                        {uniqueEditors.map((editor) => (
                          <SelectItem key={editor} value={editor}>
                            {editor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end gap-2">
                    <Button onClick={handleSearch} className="flex-1">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="flex-1">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Manuscript ID</TableHead>
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
                      {filteredInvitations.map((invitation) => (
                        <TableRow key={invitation.id} className="hover:bg-muted/50">
                          <TableCell>
                            <button className="text-primary hover:underline font-medium">
                              {invitation.id}
                            </button>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium max-w-xs">{invitation.title}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {invitation.keywords.map((keyword, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground line-clamp-3 max-w-md">
                              {invitation.abstract}
                            </div>
                          </TableCell>
                          <TableCell>
                            <button 
                              className="text-primary hover:underline font-medium text-sm"
                              onClick={() => {
                                // In a real app, this would open the actual PDF URL
                                window.open(`/manuscripts/${invitation.manuscriptFile}`, '_blank');
                                toast({
                                  title: "Opening PDF",
                                  description: `Opening ${invitation.manuscriptFile} in new tab`,
                                });
                              }}
                            >
                              {invitation.manuscriptFile}
                            </button>
                          </TableCell>
                          <TableCell>{invitation.editor}</TableCell>
                          <TableCell>{invitation.invitedDate}</TableCell>
                          <TableCell>{invitation.dueDate}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                                          <Check className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Accept Review Invitation</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to accept the review invitation for manuscript {invitation.id}?
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => {
                                            toast({
                                              title: "Invitation Accepted",
                                              description: `You have accepted the review invitation for manuscript ${invitation.id}.`,
                                            });
                                          }}>
                                            Accept
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Accept Invitation</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => {
                                        setSelectedInvitationId(invitation.id);
                                        setRejectDialogOpen(true);
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Reject Invitation</p>
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
              </div>
            </TabsContent>

            <TabsContent value="pending-review" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ID</label>
                    <Input 
                      placeholder="Enter manuscript ID" 
                      value={pendingFilterId}
                      onChange={(e) => setPendingFilterId(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input 
                      placeholder="Enter title keywords" 
                      value={pendingFilterTitle}
                      onChange={(e) => setPendingFilterTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Editor Name</label>
                    <Select value={pendingFilterEditor} onValueChange={setPendingFilterEditor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select editor" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="all">All Editors</SelectItem>
                        {uniquePendingEditors.map((editor) => (
                          <SelectItem key={editor} value={editor}>
                            {editor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end gap-2">
                    <Button onClick={handlePendingSearch} className="flex-1">
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                    <Button onClick={handlePendingReset} variant="outline" className="flex-1">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Manuscript ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Abstract</TableHead>
                        <TableHead>File</TableHead>
                        <TableHead>Accepted Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Editor</TableHead>
                        <TableHead>Submit Review</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPendingReviews.map((manuscript) => (
                        <TableRow key={manuscript.id}>
                          <TableCell className="font-medium">{manuscript.id}</TableCell>
                          <TableCell>{manuscript.title}</TableCell>
                          <TableCell className="max-w-xs">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="truncate cursor-help">
                                    {manuscript.abstract}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-md">
                                  <p>{manuscript.abstract}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>
                            <a
                              href={`/manuscripts/${manuscript.manuscriptFile}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {manuscript.manuscriptFile}
                            </a>
                          </TableCell>
                          <TableCell>{manuscript.acceptedDate}</TableCell>
                          <TableCell>{manuscript.dueDate}</TableCell>
                          <TableCell>{manuscript.editor}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Send className="mr-2 h-4 w-4" />
                              Submit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="completed-review" className="mt-6">
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <Input placeholder="Search manuscripts..." className="max-w-sm" />
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by decision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Decisions</SelectItem>
                      <SelectItem value="accept">Accept</SelectItem>
                      <SelectItem value="minor-revision">Minor Revision</SelectItem>
                      <SelectItem value="major-revision">Major Revision</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Manuscript ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Authors</TableHead>
                        <TableHead>Completed Date</TableHead>
                        <TableHead>Decision</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No completed reviews found
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rejected" className="mt-6">
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <Input placeholder="Search manuscripts..." className="max-w-sm" />
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reasons</SelectItem>
                      <SelectItem value="conflict-of-interest">Conflict of Interest</SelectItem>
                      <SelectItem value="not-expertise">Not My Expertise</SelectItem>
                      <SelectItem value="time-constraints">Time Constraints</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Manuscript ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Authors</TableHead>
                        <TableHead>Invited Date</TableHead>
                        <TableHead>Rejected Date</TableHead>
                        <TableHead>Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No rejected invitations found
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Dialog for Reject Review Invitation */}
          <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Reject Review Invitation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reject-reason">Reason for Rejection (Required)</Label>
                  <Textarea
                    id="reject-reason"
                    placeholder="Please provide a reason for rejecting this review invitation..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setRejectDialogOpen(false);
                  setRejectReason('');
                  setSelectedInvitationId(null);
                }}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  if (!rejectReason.trim()) {
                    toast({
                      title: "Reason Required",
                      description: "Please provide a reason for rejecting the invitation.",
                      variant: "destructive",
                    });
                    return;
                  }
                  toast({
                    title: "Invitation Rejected",
                    description: `You have rejected the review invitation for manuscript ${selectedInvitationId}.`,
                  });
                  setRejectDialogOpen(false);
                  setRejectReason('');
                  setSelectedInvitationId(null);
                }}>
                  Reject
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

const Manuscripts = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render different content based on user role
  if (user.role === 'Reviewer') {
    return <ReviewerManuscripts />;
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

  // State for "Waiting for Decision" tab filters
  const [decisionIdFilter, setDecisionIdFilter] = useState('');
  const [decisionTitleFilter, setDecisionTitleFilter] = useState('');
  const [decisionReviewerFilter, setDecisionReviewerFilter] = useState('all');

  // State for "Completed" tab filters
  const [completedTitleFilter, setCompletedTitleFilter] = useState('');
  const [completedAuthorFilter, setCompletedAuthorFilter] = useState('');
  const [completedStatusFilter, setCompletedStatusFilter] = useState('all');

  // Assigned reviewer filters
  const [assignedIdFilter, setAssignedIdFilter] = useState('');
  const [assignedTitleFilter, setAssignedTitleFilter] = useState('');
  const [assignedReviewerFilter, setAssignedReviewerFilter] = useState('all');

  // Pagination states for each tab
  const [allCurrentPage, setAllCurrentPage] = useState(1);
  const [waitingCurrentPage, setWaitingCurrentPage] = useState(1);
  const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
  const [assignedCurrentPage, setAssignedCurrentPage] = useState(1);
  const [decisionCurrentPage, setDecisionCurrentPage] = useState(1);
  const [completedCurrentPage, setCompletedCurrentPage] = useState(1);
  
  const itemsPerPage = 10;

  // State for managing manuscript data
  const [waitingReviewManuscripts, setWaitingReviewManuscripts] = useState(mockWaitingReviewManuscripts);
  const [pendingReviewManuscripts, setPendingReviewManuscripts] = useState(mockPendingReviewManuscripts);

  // Dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [sendBackDialogOpen, setSendBackDialogOpen] = useState(false);
  const [assignReviewerDialogOpen, setAssignReviewerDialogOpen] = useState(false);
  const [decideDialogOpen, setDecideDialogOpen] = useState(false);
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

  // Decide form state
  const [decideForm, setDecideForm] = useState({
    decision: '' as 'Major Revision' | 'Minor Revision' | 'Accept' | 'Reject' | '',
    reason: '',
    comments: ''
  });
  const [decideFormErrors, setDecideFormErrors] = useState<Partial<Record<keyof typeof decideForm, string>>>({});

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

  // Apply search filters to waiting for decision manuscripts
  const filteredWaitingDecisionManuscripts = mockWaitingDecisionManuscripts.filter(manuscript => {
    const matchesId = manuscript.id.toLowerCase().includes(decisionIdFilter.toLowerCase());
    const matchesTitle = manuscript.title.toLowerCase().includes(decisionTitleFilter.toLowerCase());
    const matchesReviewer = decisionReviewerFilter === 'all' || 
      manuscript.reviewers.some(reviewer => reviewer.name === decisionReviewerFilter);
    return matchesId && matchesTitle && matchesReviewer;
  });

  // Assigned reviewer filters
  const filteredAssignedManuscripts = mockAssignedManuscripts.filter(manuscript => {
    const matchesId = manuscript.id.toLowerCase().includes(assignedIdFilter.toLowerCase());
    const matchesTitle = manuscript.title.toLowerCase().includes(assignedTitleFilter.toLowerCase());
    const matchesReviewer = assignedReviewerFilter === 'all' || 
      manuscript.reviewers.some(reviewer => reviewer.name.toLowerCase().includes(assignedReviewerFilter.toLowerCase()));
    return matchesId && matchesTitle && matchesReviewer;
  });

  // Filter completed manuscripts (Accept or Reject status)
  const filteredCompletedManuscripts = mockManuscripts.filter(manuscript => {
    const isCompleted = manuscript.status === 'Accept' || manuscript.status === 'Rejected';
    const matchesTitle = manuscript.title.toLowerCase().includes(completedTitleFilter.toLowerCase());
    const matchesAuthor = manuscript.authors.toLowerCase().includes(completedAuthorFilter.toLowerCase());
    const matchesStatus = completedStatusFilter === 'all' || manuscript.status === completedStatusFilter;
    return isCompleted && matchesTitle && matchesAuthor && matchesStatus;
  });

  // Pagination logic for all tabs
  const paginateData = (data: any[], currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (dataLength: number) => Math.ceil(dataLength / itemsPerPage);

  const paginatedAllManuscripts = paginateData(filteredManuscripts, allCurrentPage);
  const paginatedWaitingManuscripts = paginateData(filteredWaitingReviewManuscripts, waitingCurrentPage);
  const paginatedPendingManuscripts = paginateData(filteredPendingReviewManuscripts, pendingCurrentPage);
  const paginatedAssignedManuscripts = paginateData(filteredAssignedManuscripts, assignedCurrentPage);
  const paginatedDecisionManuscripts = paginateData(filteredWaitingDecisionManuscripts, decisionCurrentPage);
  const paginatedCompletedManuscripts = paginateData(filteredCompletedManuscripts, completedCurrentPage);

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

  const handleDecisionReset = () => {
    setDecisionIdFilter('');
    setDecisionTitleFilter('');
    setDecisionReviewerFilter('all');
  };

  const handleCompletedReset = () => {
    setCompletedTitleFilter('');
    setCompletedAuthorFilter('');
    setCompletedStatusFilter('all');
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
        id: manuscript.id,
        title: manuscript.title,
        abstract: manuscript.abstract,
        keywords: manuscript.keywords,
        acceptedDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        editor: 'Dr. John Smith', // Default editor
        manuscriptFile: manuscript.manuscriptFile
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

  const handleAssignReviewer = (manuscriptId: string) => {
    setSelectedManuscriptId(manuscriptId);
    setAssignReviewerDialogOpen(true);
  };

  const handleAddReviewer = () => {
    setReviewerAssignments(prev => [...prev, {
      reviewerId: '',
      reviewerName: '',
      deadline: undefined
    }]);
  };

  const handleRemoveReviewer = (index: number) => {
    if (reviewerAssignments.length > 1) {
      setReviewerAssignments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleReviewerSelect = (index: number, reviewerId: string, reviewerName: string) => {
    setReviewerAssignments(prev => prev.map((assignment, i) => 
      i === index ? { ...assignment, reviewerId, reviewerName } : assignment
    ));
  };

  const handleDeadlineSelect = (index: number, deadline: Date | undefined) => {
    setReviewerAssignments(prev => prev.map((assignment, i) => 
      i === index ? { ...assignment, deadline } : assignment
    ));
  };

  const handleAssignReviewerSubmit = () => {
    try {
      const validatedData = assignReviewerSchema.parse({ reviewers: reviewerAssignments });
      setAssignReviewerErrors([]);
      
      const manuscript = pendingReviewManuscripts.find(m => m.id === selectedManuscriptId);
      if (manuscript) {
        // For now, just show success message
        // In a real app, this would assign reviewers to the manuscript
        toast({
          title: "Reviewers Assigned",
          description: `${validatedData.reviewers.length} reviewer(s) have been assigned to the manuscript.`,
        });
      }
      
      // Reset form and close dialog
      setReviewerAssignments([{ reviewerId: '', reviewerName: '', deadline: undefined }]);
      setAssignReviewerDialogOpen(false);
      setSelectedManuscriptId('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: string[] = [];
        error.errors.forEach((err) => {
          errors.push(err.message);
        });
        setAssignReviewerErrors(errors);
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
                        {paginatedAllManuscripts.map((manuscript) => (
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

                  {/* Pagination for All tab */}
                  {getTotalPages(filteredManuscripts.length) > 1 && (
                    <div className="flex justify-center mt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setAllCurrentPage(Math.max(1, allCurrentPage - 1))}
                              className={allCurrentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: getTotalPages(filteredManuscripts.length) }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setAllCurrentPage(page)}
                                isActive={page === allCurrentPage}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setAllCurrentPage(Math.min(getTotalPages(filteredManuscripts.length), allCurrentPage + 1))}
                              className={allCurrentPage === getTotalPages(filteredManuscripts.length) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
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
                        {filteredPendingReviewManuscripts.map((manuscript) => (
                          <TableRow key={manuscript.id} className="hover:bg-muted/50">
                            <TableCell>
                              <button className="text-primary hover:underline font-medium">
                                {manuscript.id}
                              </button>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{manuscript.title}</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {manuscript.keywords.map((keyword, index) => (
                                  <span
                                    key={index}
                                    className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground line-clamp-3">
                                {manuscript.abstract}
                              </div>
                            </TableCell>
                            <TableCell>{manuscript.submissionDate}</TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleAssignReviewer(manuscript.id)}
                                    >
                                      <UserCheck size={14} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Assign Reviewer</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              {manuscript.reviewers.length > 0 ? (
                                <div className="space-y-1">
                                  {manuscript.reviewers.map((reviewer, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
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
                              {manuscript.reviewDeadlines.length > 0 ? (
                                <div className="space-y-1">
                                  {manuscript.reviewDeadlines.map((deadline, index) => (
                                    <div key={index} className="text-sm">
                                      {deadline}
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Article Title</TableHead>
                        <TableHead>Submission Date</TableHead>
                        <TableHead>Reviewers & Deadlines</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssignedManuscripts.map((manuscript) => (
                        <TableRow key={manuscript.id}>
                          <TableCell className="font-medium">{manuscript.id}</TableCell>
                          <TableCell>
                            <div className="max-w-xs">
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
                          </TableCell>
                          <TableCell>{manuscript.submissionDate}</TableCell>
                          <TableCell>
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {filteredAssignedManuscripts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No manuscripts found with assigned reviewers.
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="waiting-decision" className="p-6">
                  {/* Search and Filter Section */}
                  <div className="mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">ID</label>
                        <Input
                          placeholder="Search by ID..."
                          value={decisionIdFilter}
                          onChange={(e) => setDecisionIdFilter(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Title</label>
                        <Input
                          placeholder="Search by title..."
                          value={decisionTitleFilter}
                          onChange={(e) => setDecisionTitleFilter(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Reviewer Name</label>
                        <Select value={decisionReviewerFilter} onValueChange={setDecisionReviewerFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reviewer..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Reviewers</SelectItem>
                            {Array.from(new Set(mockWaitingDecisionManuscripts.flatMap(m => m.reviewers.map(r => r.name)))).map((reviewerName) => (
                              <SelectItem key={reviewerName} value={reviewerName}>
                                {reviewerName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => {}}>Search</Button>
                      <Button variant="outline" onClick={handleDecisionReset}>Reset</Button>
                    </div>
                  </div>

                  {/* Table Section */}
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">ID</TableHead>
                          <TableHead className="min-w-60">Article Title</TableHead>
                          <TableHead className="min-w-48">Reviewers</TableHead>
                          <TableHead className="min-w-32">Score</TableHead>
                          <TableHead className="min-w-96">Comments</TableHead>
                          <TableHead>Submission Date</TableHead>
                          <TableHead className="w-24">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredWaitingDecisionManuscripts.map((manuscript) => (
                          <TableRow key={manuscript.id} className="hover:bg-muted/50">
                            <TableCell>
                              <button className="text-primary hover:underline font-medium">
                                {manuscript.id}
                              </button>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{manuscript.title}</div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-4">
                                {manuscript.reviewers.map((reviewer, index) => (
                                  <div key={index} className="text-sm min-h-[70px] flex items-center">
                                    {reviewer.name}
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-4">
                                {manuscript.reviewers.map((reviewer, index) => (
                                  <div key={index} className="text-sm min-h-[70px] flex flex-col justify-center">
                                    <div className="font-medium">{reviewer.score}/10</div>
                                    <div className={`text-xs ${
                                      reviewer.decision === 'Accept' ? 'text-green-700' :
                                      reviewer.decision === 'Reject' ? 'text-red-700' :
                                      reviewer.decision === 'Minor Revision' ? 'text-orange-700' :
                                      reviewer.decision === 'Major Revision' ? 'text-yellow-700' :
                                      'text-gray-700'
                                    }`}>
                                      {reviewer.decision}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-4 max-w-md">
                                {manuscript.reviewers.map((reviewer, index) => (
                                  <div key={index} className="text-xs border-l-2 border-gray-200 pl-2 min-h-[70px]">
                                    <div className="text-blue-700 font-medium mb-1">
                                      Confidential (Editor):
                                    </div>
                                    <div className="text-blue-600 mb-2 line-clamp-1">
                                      {reviewer.confidentialComments}
                                    </div>
                                    <div className="text-gray-700 font-medium mb-1">
                                      Public (Author):
                                    </div>
                                    <div className="text-gray-600 line-clamp-1">
                                      {reviewer.publicComments}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-4">
                                {manuscript.reviewers.map((reviewer, index) => (
                                  <div key={index} className="text-sm min-h-[70px] flex items-center">
                                    {reviewer.submissionDate}
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
                                         setSelectedManuscriptId(manuscript.id);
                                         setDecideDialogOpen(true);
                                       }}
                                     >
                                      <Gavel size={14} />
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

                    {filteredWaitingDecisionManuscripts.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No manuscripts waiting for decision found.
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="completed" className="p-6">
                  {/* Search and Filter Section */}
                  <div className="mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Title</label>
                        <Input
                          placeholder="Search by title..."
                          value={completedTitleFilter}
                          onChange={(e) => setCompletedTitleFilter(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Author Name</label>
                        <Input
                          placeholder="Search by author..."
                          value={completedAuthorFilter}
                          onChange={(e) => setCompletedAuthorFilter(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Status</label>
                        <Select value={completedStatusFilter} onValueChange={setCompletedStatusFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Accept">Accept</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSearch}>Search</Button>
                      <Button variant="outline" onClick={handleCompletedReset}>Reset</Button>
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
                        {filteredCompletedManuscripts.map((manuscript) => (
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
                            <TableCell className="text-sm text-muted-foreground">
                              {manuscript.submissionDate}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(manuscript.status)}>
                                {manuscript.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {filteredCompletedManuscripts.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No completed manuscripts found.
                      </div>
                    )}
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

        {/* Dialog for Decide */}
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
                  description: `Your decision (${decideForm.decision}) for manuscript ${selectedManuscriptId} has been submitted.`,
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
      </div>
    </SidebarProvider>
  );
};

export default Manuscripts;