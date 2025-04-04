import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';
import { theme } from '../../constants/Theme';
import UserCard from '@/components/UserCard';
import EmptyState from '@/components/EmptyState';
import { useRouter } from 'expo-router';
import { Users, Search, UserPlus, UserCheck } from 'lucide-react-native';

export default function NetworkScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { getActiveTheme } = useSettingsStore();
  const activeTheme = getActiveTheme();
  
  const [tab, setTab] = useState<'connections' | 'discover'>('connections');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock users for demo purposes
  const mockUsers = [
    {
      id: '1',
      username: 'johndoe',
      email: 'john@example.com',
      name: 'John Doe',
      bio: 'Software Engineer passionate about mobile development',
      profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
      profession: 'Software Engineer',
      skills: ['React Native', 'JavaScript', 'TypeScript'],
      connections: ['2'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      username: 'janedoe',
      email: 'jane@example.com',
      name: 'Jane Doe',
      bio: 'Frontend Developer with a love for clean UI and UX',
      profileImage: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe',
      profession: 'Frontend Developer',
      skills: ['React', 'CSS', 'Figma'],
      connections: ['1', '3'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      username: 'alexsmith',
      email: 'alex@example.com',
      name: 'Alex Smith',
      bio: 'Backend Developer and API wizard',
      profileImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
      profession: 'Backend Developer',
      skills: ['Node.js', 'Express', 'MongoDB'],
      connections: ['2'],
      pendingConnections: ['4'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      username: 'sarahj',
      email: 'sarah@example.com',
      name: 'Sarah Johnson',
      bio: 'Full Stack Dev exploring AI & ML',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      profession: 'Full Stack Developer',
      skills: ['Python', 'React', 'TensorFlow'],
      connections: [],
      pendingConnections: ['3'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      username: 'michaelb',
      email: 'michael@example.com',
      name: 'Michael Brown',
      bio: 'DevOps enthusiast with love for CI/CD',
      profileImage: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167',
      profession: 'DevOps Engineer',
      skills: ['Docker', 'Kubernetes', 'Jenkins'],
      connections: ['1'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '6',
      username: 'emilyr',
      email: 'emily@example.com',
      name: 'Emily Roberts',
      bio: 'UI/UX Designer crafting beautiful digital products',
      profileImage: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7',
      profession: 'UI/UX Designer',
      skills: ['Sketch', 'Adobe XD', 'Figma'],
      connections: ['2', '5'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '7',
      username: 'danielt',
      email: 'daniel@example.com',
      name: 'Daniel Thompson',
      bio: 'Security Analyst who loves ethical hacking',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
      profession: 'Security Analyst',
      skills: ['Kali Linux', 'Wireshark', 'Python'],
      connections: ['5'],
      pendingConnections: ['6'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '8',
      username: 'laurac',
      email: 'laura@example.com',
      name: 'Laura Clark',
      bio: 'Cloud Architect and AWS guru',
      profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
      profession: 'Cloud Architect',
      skills: ['AWS', 'Terraform', 'Serverless'],
      connections: ['7'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '9',
      username: 'nathanw',
      email: 'nathan@example.com',
      name: 'Nathan White',
      bio: 'Data Scientist turning data into insights',
      profileImage: 'https://images.unsplash.com/photo-1502767089025-6572583495b9',
      profession: 'Data Scientist',
      skills: ['Python', 'Pandas', 'Scikit-learn'],
      connections: ['8'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '10',
      username: 'oliviak',
      email: 'olivia@example.com',
      name: 'Olivia King',
      bio: 'Tech blogger and community builder',
      profileImage: 'https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9',
      profession: 'Tech Evangelist',
      skills: ['Content Writing', 'Public Speaking', 'Networking'],
      connections: ['1', '9'],
      pendingConnections: ['3'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '11',
      username: 'bradleyc',
      email: 'bradley@example.com',
      name: 'Bradley Cooper',
      bio: 'ML Engineer transforming ideas into reality',
      profileImage: 'https://images.unsplash.com/photo-1589571894960-20bbe2828b89',
      profession: 'ML Engineer',
      skills: ['TensorFlow', 'Keras', 'Python'],
      connections: ['4'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '12',
      username: 'rachelw',
      email: 'rachel@example.com',
      name: 'Rachel Wilson',
      bio: 'Creative designer who loves pixel-perfect work',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      profession: 'Graphic Designer',
      skills: ['Photoshop', 'Illustrator', 'InDesign'],
      connections: ['6'],
      pendingConnections: ['7'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '13',
      username: 'kevint',
      email: 'kevin@example.com',
      name: 'Kevin Turner',
      bio: 'Java developer building secure enterprise apps',
      profileImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
      profession: 'Software Developer',
      skills: ['Java', 'Spring Boot', 'MySQL'],
      connections: ['5'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '14',
      username: 'lisam',
      email: 'lisa@example.com',
      name: 'Lisa Martinez',
      bio: 'QA Engineer who breaks code for a living',
      profileImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
      profession: 'QA Engineer',
      skills: ['Selenium', 'Cypress', 'Jest'],
      connections: ['13'],
      pendingConnections: ['1'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '15',
      username: 'andreww',
      email: 'andrew@example.com',
      name: 'Andrew Walker',
      bio: 'Mobile Developer obsessed with animations',
      profileImage: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39',
      profession: 'Mobile Developer',
      skills: ['Flutter', 'Dart', 'Firebase'],
      connections: ['3', '14'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '16',
      username: 'chloek',
      email: 'chloe@example.com',
      name: 'Chloe Kim',
      bio: 'Product Manager who keeps teams on track',
      profileImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
      profession: 'Product Manager',
      skills: ['Agile', 'Jira', 'Scrum'],
      connections: ['6', '15'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '17',
      username: 'jamesr',
      email: 'james@example.com',
      name: 'James Rodriguez',
      bio: 'Game Developer creating immersive experiences',
      profileImage: 'https://images.unsplash.com/photo-1544005313-517f0e3f6c0e',
      profession: 'Game Developer',
      skills: ['Unity', 'C#', 'Blender'],
      connections: ['16'],
      pendingConnections: ['10'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '18',
      username: 'zoeb',
      email: 'zoe@example.com',
      name: 'Zoe Bell',
      bio: 'Web3 Developer riding the crypto wave',
      profileImage: 'https://images.unsplash.com/photo-1552058544-f2b08422138a',
      profession: 'Blockchain Developer',
      skills: ['Solidity', 'Ethereum', 'Web3.js'],
      connections: ['17'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '19',
      username: 'harryp',
      email: 'harry@example.com',
      name: 'Harry Potter',
      bio: 'Tech wizard learning MLOps',
      profileImage: 'https://images.unsplash.com/photo-1502764613149-7f1d229e2300',
      profession: 'MLOps Engineer',
      skills: ['MLflow', 'Airflow', 'Python'],
      connections: ['11', '12'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '20',
      username: 'ellad',
      email: 'ella@example.com',
      name: 'Ella Davis',
      bio: 'SEO expert helping businesses grow',
      profileImage: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126',
      profession: 'SEO Specialist',
      skills: ['Google Analytics', 'SEO', 'Content Strategy'],
      connections: ['18'],
      pendingConnections: ['1'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '21',
      username: 'williamh',
      email: 'william@example.com',
      name: 'William Harris',
      bio: 'IoT Developer connecting the physical world',
      profileImage: 'https://images.unsplash.com/photo-1542224566-0d48a49f9b6c',
      profession: 'IoT Engineer',
      skills: ['Arduino', 'Raspberry Pi', 'C++'],
      connections: ['19'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '22',
      username: 'sophiam',
      email: 'sophia@example.com',
      name: 'Sophia Martinez',
      bio: 'AR/VR dev working on immersive education',
      profileImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
      profession: 'AR/VR Developer',
      skills: ['Unity', 'C#', 'Unreal Engine'],
      connections: ['20'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '23',
      username: 'lukep',
      email: 'luke@example.com',
      name: 'Luke Patterson',
      bio: 'System Admin automating infrastructure',
      profileImage: 'https://images.unsplash.com/photo-1542327897-2c58b4b8c1a6',
      profession: 'System Administrator',
      skills: ['Linux', 'Ansible', 'Bash'],
      connections: ['22'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '24',
      username: 'isabellak',
      email: 'isabella@example.com',
      name: 'Isabella King',
      bio: 'No-code advocate helping startups launch fast',
      profileImage: 'https://images.unsplash.com/photo-1544005313-517f0e3f6c0e',
      profession: 'No-Code Developer',
      skills: ['Bubble', 'Webflow', 'Zapier'],
      connections: ['23'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '25',
      username: 'ethanj',
      email: 'ethan@example.com',
      name: 'Ethan Johnson',
      bio: 'Database guru managing petabytes of data',
      profileImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
      profession: 'Database Administrator',
      skills: ['PostgreSQL', 'MongoDB', 'SQL'],
      connections: ['24'],
      pendingConnections: [],
      createdAt: new Date().toISOString(),
    },
    {
    id: '26',
    username: 'graceh',
    email: 'grace@example.com',
    name: 'Grace Hall',
    bio: 'AI researcher decoding neural networks',
    profileImage: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7',
    profession: 'AI Researcher',
    skills: ['PyTorch', 'NLP', 'Deep Learning'],
    connections: ['15', '27'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '27',
    username: 'leonardd',
    email: 'leonard@example.com',
    name: 'Leonard Diaz',
    bio: 'Embedded Systems wizard',
    profileImage: 'https://images.unsplash.com/photo-1542327897-2c58b4b8c1a6',
    profession: 'Embedded Engineer',
    skills: ['C', 'Embedded C++', 'RTOS'],
    connections: ['26'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '28',
    username: 'victoriah',
    email: 'victoria@example.com',
    name: 'Victoria Hughes',
    bio: 'Marketing technologist with a growth mindset',
    profileImage: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe',
    profession: 'Growth Marketer',
    skills: ['SEO', 'Marketing Automation', 'A/B Testing'],
    connections: ['20'],
    pendingConnections: ['26'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '29',
    username: 'ryans',
    email: 'ryan@example.com',
    name: 'Ryan Scott',
    bio: 'Game Designer making worlds come alive',
    profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    profession: 'Game Designer',
    skills: ['Game Mechanics', 'Level Design', 'Unity'],
    connections: ['17'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '30',
    username: 'ashleym',
    email: 'ashley@example.com',
    name: 'Ashley Morgan',
    bio: 'Digital Artist and NFT creator',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    profession: 'Digital Artist',
    skills: ['Procreate', 'Illustrator', 'NFTs'],
    connections: ['18', '29'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '31',
    username: 'nicolasr',
    email: 'nicolas@example.com',
    name: 'Nicolas Rivera',
    bio: 'SRE automating reliability at scale',
    profileImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
    profession: 'Site Reliability Engineer',
    skills: ['Prometheus', 'Grafana', 'Go'],
    connections: ['13'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '32',
    username: 'amberl',
    email: 'amber@example.com',
    name: 'Amber Lee',
    bio: 'Design ops champion enabling creative teams',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    profession: 'DesignOps Manager',
    skills: ['Figma', 'Notion', 'Systems Thinking'],
    connections: ['6', '12'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '33',
    username: 'adamb',
    email: 'adam@example.com',
    name: 'Adam Brooks',
    bio: 'Firmware Engineer building smart devices',
    profileImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
    profession: 'Firmware Engineer',
    skills: ['Assembly', 'C', 'Debugging'],
    connections: ['27'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '34',
    username: 'oliverc',
    email: 'oliver@example.com',
    name: 'Oliver Clark',
    bio: 'VR artist shaping virtual experiences',
    profileImage: 'https://images.unsplash.com/photo-1552058544-f2b08422138a',
    profession: 'VR Artist',
    skills: ['3D Modeling', 'Tilt Brush', 'Unity'],
    connections: ['22'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '35',
    username: 'miaf',
    email: 'mia@example.com',
    name: 'Mia Foster',
    bio: 'Conversational AI dev building chatbots',
    profileImage: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126',
    profession: 'AI Engineer',
    skills: ['Dialogflow', 'GPT', 'Node.js'],
    connections: ['1', '19'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '36',
    username: 'isaacw',
    email: 'isaac@example.com',
    name: 'Isaac Wright',
    bio: 'Robotics engineer building the future',
    profileImage: 'https://images.unsplash.com/photo-1502767089025-6572583495b9',
    profession: 'Robotics Engineer',
    skills: ['ROS', 'Python', 'C++'],
    connections: ['21'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '37',
    username: 'samanthaj',
    email: 'samantha@example.com',
    name: 'Samantha James',
    bio: 'Voice UI designer improving accessibility',
    profileImage: 'https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9',
    profession: 'Voice UX Designer',
    skills: ['VUI', 'Alexa Skills', 'Adobe XD'],
    connections: ['32'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '38',
    username: 'tylere',
    email: 'tyler@example.com',
    name: 'Tyler Evans',
    bio: 'DevRel connecting devs to awesome tools',
    profileImage: 'https://images.unsplash.com/photo-1589571894960-20bbe2828b89',
    profession: 'Developer Advocate',
    skills: ['Docs', 'Open Source', 'Public Speaking'],
    connections: ['10', '35'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '39',
    username: 'naomip',
    email: 'naomi@example.com',
    name: 'Naomi Peterson',
    bio: 'Accessibility expert making the web inclusive',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    profession: 'Accessibility Specialist',
    skills: ['ARIA', 'WCAG', 'Screen Readers'],
    connections: ['37'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '40',
    username: 'justind',
    email: 'justin@example.com',
    name: 'Justin Davis',
    bio: 'Tech lead turning visions into products',
    profileImage: 'https://images.unsplash.com/photo-1502764613149-7f1d229e2300',
    profession: 'Tech Lead',
    skills: ['Leadership', 'Architecture', 'Code Reviews'],
    connections: ['1', '31'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '41',
    username: 'clarab',
    email: 'clara@example.com',
    name: 'Clara Bell',
    bio: 'Creative coder blending art & tech',
    profileImage: 'https://images.unsplash.com/photo-1552058544-f2b08422138a',
    profession: 'Creative Technologist',
    skills: ['p5.js', 'Generative Art', 'WebGL'],
    connections: ['30', '39'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '42',
    username: 'evank',
    email: 'evan@example.com',
    name: 'Evan Kim',
    bio: 'QA automation master',
    profileImage: 'https://images.unsplash.com/photo-1544005313-517f0e3f6c0e',
    profession: 'QA Engineer',
    skills: ['Playwright', 'Cypress', 'Jest'],
    connections: ['14'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '43',
    username: 'meganl',
    email: 'megan@example.com',
    name: 'Megan Lewis',
    bio: 'Strategist at the intersection of tech and business',
    profileImage: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39',
    profession: 'Tech Strategist',
    skills: ['Business Analysis', 'Tech Trends', 'Pitching'],
    connections: ['40'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '44',
    username: 'oscarb',
    email: 'oscar@example.com',
    name: 'Oscar Brown',
    bio: 'Linux kernel contributor and OSS fan',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    profession: 'Kernel Developer',
    skills: ['C', 'Linux', 'Git'],
    connections: ['31'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '45',
    username: 'hannahg',
    email: 'hannah@example.com',
    name: 'Hannah Green',
    bio: 'Instructional Designer crafting eLearning content',
    profileImage: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe',
    profession: 'Instructional Designer',
    skills: ['Articulate', 'Storyline', 'LMS'],
    connections: ['43'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '46',
    username: 'jacobb',
    email: 'jacob@example.com',
    name: 'Jacob Bennett',
    bio: 'Startup CTO who builds MVPs fast',
    profileImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    profession: 'CTO',
    skills: ['Lean Startup', 'React', 'Firebase'],
    connections: ['25', '28'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '47',
    username: 'ellieb',
    email: 'ellie@example.com',
    name: 'Ellie Brown',
    bio: 'Bioinformatician blending code and genomics',
    profileImage: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7',
    profession: 'Bioinformatician',
    skills: ['Python', 'R', 'BioPython'],
    connections: ['19'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '48',
    username: 'dylane',
    email: 'dylan@example.com',
    name: 'Dylan Edwards',
    bio: 'Cloud security consultant with a passion for privacy',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    profession: 'Cloud Security Consultant',
    skills: ['AWS', 'IAM', 'Encryption'],
    connections: ['8'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '49',
    username: 'madisonc',
    email: 'madison@example.com',
    name: 'Madison Carter',
    bio: 'Startup founder & indie hacker',
    profileImage: 'https://images.unsplash.com/photo-1542327897-2c58b4b8c1a6',
    profession: 'Founder',
    skills: ['SaaS', 'Marketing', 'Bootstrapping'],
    connections: ['46'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '50',
    username: 'brendank',
    email: 'brendan@example.com',
    name: 'Brendan Kelly',
    bio: 'Open source contributor and code mentor',
    profileImage: 'https://images.unsplash.com/photo-1502767089025-6572583495b9',
    profession: 'Software Engineer',
    skills: ['Node.js', 'Open Source', 'TypeScript'],
    connections: ['1', '38'],
    pendingConnections: [],
    createdAt: new Date().toISOString(),
  }
  ];
  
  // Filter out current user
  const filteredUsers = mockUsers.filter(u => u.id !== user?.id);
  
  // Get user connections
  const connections = user?.connections 
    ? filteredUsers.filter(u => user.connections.includes(u.id))
    : [];
  
  // Get discover users (not connected)
  const discoverUsers = filteredUsers.filter(u => !user?.connections.includes(u.id));
  
  // Apply search filter
  const searchedConnections = connections.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.profession && u.profession.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const searchedDiscoverUsers = discoverUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.profession && u.profession.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Get colors based on theme
  const colors = activeTheme === 'dark' ? {
    background: '#111827',
    card: '#1f2937',
    border: '#374151',
    text: '#f9fafb',
    textLight: '#9ca3af',
  } : {
    background: theme.colors.background,
    card: theme.colors.card,
    border: theme.colors.border,
    text: theme.colors.text,
    textLight: theme.colors.textLight,
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Network</Text>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Search size={20} color={colors.textLight} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search people..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.tabsContainer}>
        <Pressable
          style={[
            styles.tab,
            tab === 'connections' && [styles.activeTab, { borderBottomColor: theme.colors.primary }]
          ]}
          onPress={() => setTab('connections')}
        >
          <UserCheck 
            size={20} 
            color={tab === 'connections' ? theme.colors.primary : colors.textLight} 
          />
          <Text style={[
            styles.tabText,
            { color: colors.textLight },
            tab === 'connections' && { color: theme.colors.primary }
          ]}>
            Connections
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.tab,
            tab === 'discover' && [styles.activeTab, { borderBottomColor: theme.colors.primary }]
          ]}
          onPress={() => setTab('discover')}
        >
          <UserPlus 
            size={20} 
            color={tab === 'discover' ? theme.colors.primary : colors.textLight} 
          />
          <Text style={[
            styles.tabText,
            { color: colors.textLight },
            tab === 'discover' && { color: theme.colors.primary }
          ]}>
            Discover
          </Text>
        </Pressable>
      </View>
      
      {tab === 'connections' && (
        searchedConnections.length === 0 ? (
          <EmptyState
            icon={<Users size={64} color={colors.textLight} />}
            title={searchQuery ? "No results found" : "No connections yet"}
            message={
              searchQuery 
                ? "Try a different search term" 
                : "Connect with other users to grow your network"
            }
          />
        ) : (
          <ScrollView 
            style={styles.usersList}
            contentContainerStyle={styles.usersContent}
            showsVerticalScrollIndicator={false}
          >
            {searchedConnections.map(user => (
              <UserCard 
                key={user.id}
                user={user}
                onPress={() => router.push(`/profile/${user.id}`)}
              />
            ))}
          </ScrollView>
        )
      )}
      
      {tab === 'discover' && (
        searchedDiscoverUsers.length === 0 ? (
          <EmptyState
            icon={<Users size={64} color={colors.textLight} />}
            title={searchQuery ? "No results found" : "No users to discover"}
            message={
              searchQuery 
                ? "Try a different search term" 
                : "You're connected with everyone!"
            }
          />
        ) : (
          <ScrollView 
            style={styles.usersList}
            contentContainerStyle={styles.usersContent}
            showsVerticalScrollIndicator={false}
          >
            {searchedDiscoverUsers.map(user => (
              <UserCard 
                key={user.id}
                user={user}
                onPress={() => router.push(`/profile/${user.id}`)}
              />
            ))}
          </ScrollView>
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSizes.md,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    marginLeft: theme.spacing.sm,
  },
  usersList: {
    flex: 1,
  },
  usersContent: {
    padding: theme.spacing.lg,
  },
});