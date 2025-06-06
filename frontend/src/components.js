import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Home, Users, Calendar, GraduationCap, Bell, Search, LogOut, 
  Plus, Filter, ChevronLeft, ChevronRight, Brain, Target, 
  TrendingUp, AlertCircle, Clock, CheckCircle, BookOpen,
  FileText, BarChart3, Settings, User, Star, MessageSquare,
  Zap, Calendar as CalendarIcon, Award, Activity
} from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from 'date-fns';
import clsx from 'clsx';

// Helper functions for dates and colors
const getCurrentWeekDates = () => {
  const today = new Date();
  const currentWeek = [];
  const startOfCurrentWeek = new Date(today);
  startOfCurrentWeek.setDate(today.getDate() - today.getDay());
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfCurrentWeek);
    date.setDate(startOfCurrentWeek.getDate() + i);
    currentWeek.push(date);
  }
  return currentWeek;
};

const formatDateForSessions = (date) => {
  return date.toISOString();
};

const getProgressColor = (level) => {
  switch(level) {
    case 'Excellent': return 'text-green-600 bg-green-100';
    case 'Progressing': return 'text-blue-600 bg-blue-100';
    case 'Needs Support': return 'text-orange-600 bg-orange-100';
    default: return 'text-slate-600 bg-slate-100';
  }
};

const currentWeekDates = getCurrentWeekDates();

// Mock Data
const mockStudents = [
  {
    id: 1,
    name: "Emma Rodriguez",
    age: 8,
    grade: "3rd Grade", 
    avatar: "https://images.pexels.com/photos/6147369/pexels-photo-6147369.jpeg",
    status: "Active",
    primaryGoals: ["Articulation - /R/ sound production", "Language comprehension"],
    nextSession: formatDateForSessions(new Date(currentWeekDates[1].getTime()).setHours(10, 0, 0)),
    iepDue: "2025-02-15",
    evaluationDue: null,
    progressLevel: "Progressing",
    therapyType: "Individual",
    servicesPerWeek: 3,
    sessionLength: "30 min",
    accommodations: ["Extended time", "Visual supports", "Preferential seating"],
    recentProgress: { score: 78, trend: "up" }
  },
  {
    id: 2,
    name: "Marcus Johnson",
    age: 6,
    grade: "1st Grade",
    avatar: "https://images.pexels.com/photos/5212695/pexels-photo-5212695.jpeg",
    status: "Active",
    primaryGoals: ["Fluency improvement", "Social communication"],
    nextSession: formatDateForSessions(new Date(currentWeekDates[5].getTime()).setHours(10, 30, 0)),
    iepDue: null,
    evaluationDue: "2025-01-20",
    progressLevel: "Excellent",
    therapyType: "Group",
    servicesPerWeek: 2,
    sessionLength: "45 min",
    accommodations: ["Calm down breaks", "Peer support"],
    recentProgress: { score: 92, trend: "up" }
  },
  {
    id: 3,
    name: "Aisha Patel",
    age: 10,
    grade: "5th Grade",
    avatar: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846",
    status: "Active",
    primaryGoals: ["Voice quality", "Pragmatic language skills"],
    nextSession: formatDateForSessions(new Date(currentWeekDates[2].getTime()).setHours(9, 0, 0)),
    iepDue: "2025-01-25",
    evaluationDue: null,
    progressLevel: "Needs Support",
    therapyType: "Individual",
    servicesPerWeek: 4,
    sessionLength: "30 min",
    accommodations: ["Assistive technology", "Communication board"],
    recentProgress: { score: 65, trend: "stable" }
  },
  {
    id: 4,
    name: "Dylan Chen",
    age: 7,
    grade: "2nd Grade",
    avatar: "https://images.pexels.com/photos/8298453/pexels-photo-8298453.jpeg",
    status: "Active",
    primaryGoals: ["Phonological awareness", "Vocabulary expansion"],
    nextSession: formatDateForSessions(new Date(currentWeekDates[2].getTime()).setHours(14, 0, 0)),
    iepDue: null,
    evaluationDue: "2025-02-01",
    progressLevel: "Progressing",
    therapyType: "Individual",
    servicesPerWeek: 2,
    sessionLength: "30 min",
    accommodations: ["Visual schedule", "Reduced auditory distractions"],
    recentProgress: { score: 74, trend: "up" }
  },
  {
    id: 5,
    name: "Sofia Martinez",
    age: 9,
    grade: "4th Grade",
    avatar: "https://images.pexels.com/photos/7402835/pexels-photo-7402835.jpeg",
    status: "Active",
    primaryGoals: ["Language structure", "Reading comprehension"],
    nextSession: formatDateForSessions(new Date(currentWeekDates[4].getTime()).setHours(11, 0, 0)),
    iepDue: "2025-03-10",
    evaluationDue: null,
    progressLevel: "Excellent",
    therapyType: "Group",
    servicesPerWeek: 3,
    sessionLength: "45 min",
    accommodations: ["Text-to-speech", "Modified assignments"],
    recentProgress: { score: 88, trend: "up" }
  }
];

const mockSessions = [
  {
    id: 1,
    studentId: 1,
    date: formatDateForSessions(new Date(currentWeekDates[1].getTime()).setHours(10, 0, 0)),
    duration: 30,
    type: "Individual",
    goals: ["Articulation practice", "Homework review"],
    status: "Scheduled"
  },
  {
    id: 2,
    studentId: 3,
    date: formatDateForSessions(new Date(currentWeekDates[2].getTime()).setHours(9, 0, 0)),
    duration: 30,
    type: "Individual", 
    goals: ["Voice exercises", "Communication practice"],
    status: "Scheduled"
  },
  {
    id: 3,
    studentId: 4,
    date: formatDateForSessions(new Date(currentWeekDates[2].getTime()).setHours(14, 0, 0)),
    duration: 30,
    type: "Individual",
    goals: ["Phonics work", "Vocabulary building"],
    status: "Scheduled"
  },
  {
    id: 4,
    studentId: 1,
    date: formatDateForSessions(new Date(currentWeekDates[3].getTime()).setHours(9, 0, 0)),
    duration: 30,
    type: "Individual",
    goals: ["Articulation - /R/ sound practice"],
    status: "Scheduled"
  },
  {
    id: 5,
    studentId: 5,
    date: formatDateForSessions(new Date(currentWeekDates[4].getTime()).setHours(11, 0, 0)),
    duration: 30,
    type: "Individual",
    goals: ["Reading comprehension", "Language structure"],
    status: "Scheduled"
  },
  {
    id: 6,
    studentId: 2,
    date: formatDateForSessions(new Date(currentWeekDates[5].getTime()).setHours(10, 30, 0)),
    duration: 30,
    type: "Individual",
    goals: ["Fluency techniques", "Confidence building"],
    status: "Scheduled"
  }
];

const mockGroupSessions = [
  {
    id: 'group-1',
    name: "Social Communication Group",
    date: formatDateForSessions(new Date(currentWeekDates[1].getTime()).setHours(13, 0, 0)),
    duration: 45,
    type: "Group",
    studentIds: [2, 5],
    goals: ["Social interaction", "Turn-taking", "Conversation skills"],
    status: "Scheduled",
    description: "Focus on peer interaction and social communication skills",
    room: "Therapy Room A"
  },
  {
    id: 'group-2',
    name: "Articulation Practice Group",
    date: formatDateForSessions(new Date(currentWeekDates[2].getTime()).setHours(15, 30, 0)),
    duration: 60,
    type: "Group",
    studentIds: [1, 4],
    goals: ["Sound production", "Phonological awareness", "Peer modeling"],
    status: "Scheduled",
    description: "Group practice for /R/ and /S/ sound production",
    room: "Therapy Room B"
  },
  {
    id: 'group-3',
    name: "Language Enrichment Group",
    date: formatDateForSessions(new Date(currentWeekDates[3].getTime()).setHours(14, 0, 0)),
    duration: 50,
    type: "Group",
    studentIds: [3, 5, 2],
    goals: ["Vocabulary expansion", "Grammar practice", "Narrative skills"],
    status: "Scheduled",
    description: "Advanced language skills for upper elementary students",
    room: "Therapy Room C"
  },
  {
    id: 'group-4',
    name: "Fluency Support Group",
    date: formatDateForSessions(new Date(currentWeekDates[4].getTime()).setHours(10, 0, 0)),
    duration: 45,
    type: "Group",
    studentIds: [2, 4],
    goals: ["Fluency techniques", "Confidence building", "Breathing exercises"],
    status: "Scheduled",
    description: "Supportive environment for fluency practice",
    room: "Therapy Room A"
  },
  {
    id: 'group-5',
    name: "Reading Readiness Group",
    date: formatDateForSessions(new Date(currentWeekDates[5].getTime()).setHours(9, 30, 0)),
    duration: 40,
    type: "Group",
    studentIds: [1, 4, 3],
    goals: ["Pre-reading skills", "Phonemic awareness", "Letter-sound correspondence"],
    status: "Scheduled",
    description: "Foundation skills for reading success",
    room: "Therapy Room B"
  },
  {
    id: 'group-6',
    name: "Peer Communication Circle",
    date: formatDateForSessions(new Date(currentWeekDates[1].getTime()).setHours(11, 30, 0)),
    duration: 45,
    type: "Group",
    studentIds: [2, 3, 5],
    goals: ["Peer interaction", "Problem solving", "Social pragmatics"],
    status: "Scheduled",
    description: "Interactive group for social communication development",
    room: "Therapy Room C"
  }
];

// Item types for drag and drop
const ItemTypes = {
  STUDENT: 'student',
  SESSION: 'session'
};

// Login Component
export const Login = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    setting: '',
    role: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login - in real app would authenticate
    onLogin({
      name: formData.name || 'Dr. Sarah Johnson',
      email: formData.email,
      role: 'Speech Language Pathologist'
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Achieve</h1>
          </div>
          <h2 className="text-xl text-slate-600">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <select
                    name="setting"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.setting}
                    onChange={handleInputChange}
                  >
                    <option value="">What setting do you work in?</option>
                    <option value="school">School District</option>
                    <option value="clinic">Private Clinic</option>
                    <option value="hospital">Hospital</option>
                    <option value="home">Home Health</option>
                  </select>
                </div>
                <div>
                  <select
                    name="role"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="">What is your role in that setting?</option>
                    <option value="slp">Speech Language Pathologist</option>
                    <option value="assistant">SLP Assistant</option>
                    <option value="supervisor">Clinical Supervisor</option>
                  </select>
                </div>
              </>
            )}
            
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {isSignUp && (
            <div className="text-sm text-slate-600">
              <p>Password must contain:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>At least 6 characters</li>
                <li>At least 1 uppercase letter</li>
                <li>At least 1 number</li>
              </ul>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-500 text-sm"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Draggable Student Component
const DraggableStudent = ({ student }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.STUDENT,
    item: student,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={clsx(
        "p-3 rounded-lg border-2 border-dashed cursor-move hover:shadow-md transition-shadow",
        student.color,
        isDragging ? 'opacity-50' : 'opacity-100'
      )}
    >
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
        <span className="font-medium text-slate-900">{student.name}</span>
      </div>
    </div>
  );
};

// Draggable Session Component
const DraggableSession = ({ session, onDelete, onRemoveStudentFromGroup }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SESSION,
    item: session,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={clsx(
        "p-2 rounded border-2 cursor-move hover:shadow-md transition-shadow relative group",
        session.color,
        isDragging ? 'opacity-50' : 'opacity-100'
      )}
    >
      {session.type === 'individual' ? (
        <div>
          <div className="font-medium text-xs">{session.student}</div>
          <div className="text-xs text-slate-600">{session.duration}min</div>
        </div>
      ) : (
        <div>
          <div className="font-medium text-xs mb-1">{session.name}</div>
          <div className="text-xs text-slate-600 mb-1">{session.duration}min</div>
          <div className="space-y-1">
            {session.students.map((student, idx) => (
              <div key={idx} className="text-xs bg-white/50 px-1 rounded flex items-center justify-between">
                <span>{student}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveStudentFromGroup(session.id, student);
                  }}
                  className="text-red-500 hover:text-red-700 ml-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(session.id);
        }}
        className="absolute top-1 right-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <AlertCircle className="h-3 w-3" />
      </button>
    </div>
  );
};

// Drop Zone Component
const DropZone = ({ day, time, sessions, onDrop, onDelete, onRemoveStudentFromGroup, onCreateGroup, isCompact = false }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [ItemTypes.STUDENT, ItemTypes.SESSION],
    drop: (item, monitor) => {
      const itemType = monitor.getItemType();
      onDrop(item, day, time, itemType);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  if (isCompact) {
    return (
      <div
        ref={drop}
        className={clsx(
          "w-full h-full relative",
          isOver ? 'bg-blue-100' : 'bg-transparent'
        )}
      >
        {sessions.map(session => (
          <div
            key={session.id}
            className={clsx(
              "absolute inset-0 text-xs p-1 rounded border cursor-pointer hover:shadow-sm",
              session.color,
              "overflow-hidden"
            )}
            title={`${session.student || session.name} - ${time} (${session.duration}min)`}
          >
            <div className="truncate font-medium">
              {session.type === 'individual' ? session.student : session.name}
            </div>
            {session.type === 'group' && (
              <div className="text-xs opacity-75 truncate">
                {session.students.join(', ')}
              </div>
            )}
          </div>
        ))}
        
        {sessions.length === 0 && isOver && (
          <div className="absolute inset-0 bg-blue-200 border-2 border-dashed border-blue-400 rounded flex items-center justify-center">
            <span className="text-xs text-blue-700">Drop here</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={drop}
      className={clsx(
        "p-2 min-h-[80px] border-l border-slate-200",
        isOver ? 'bg-blue-100' : 'bg-white'
      )}
    >
      <div className="space-y-1">
        {sessions.map(session => (
          <DraggableSession
            key={session.id}
            session={session}
            onDelete={() => onDelete(session.id, day, time)}
            onRemoveStudentFromGroup={onRemoveStudentFromGroup}
          />
        ))}
      </div>

      {/* Empty slot indicator */}
      {sessions.length === 0 && (
        <div className="h-full flex items-center justify-center">
          <button
            onClick={() => onCreateGroup(day, time)}
            className="text-slate-400 hover:text-slate-600 text-xs"
          >
            + Add
          </button>
        </div>
      )}
    </div>
  );
};

// Navigation Component
const Navigation = ({ currentTab, onTabChange, onLogout, currentUser }) => {
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, path: '/' },
    { id: 'caseload', name: 'Caseload', icon: Users, path: '/caseload' },
    { id: 'schedule', name: 'Schedule', icon: Calendar, path: '/schedule' }
  ];

  return (
    <nav className="bg-slate-900 text-white h-16 flex items-center justify-between px-6 shadow-lg">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Achieve</h1>
        </div>
        
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors",
                currentTab === tab.id
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">
          <Bell className="h-5 w-5" />
        </button>
        <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">
          <Search className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-medium text-white">{currentUser?.name}</div>
            <div className="text-xs text-slate-400">Speech Therapist</div>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

// Dashboard Component
export const Dashboard = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('dashboard');

  const upcomingIEPs = mockStudents.filter(student => 
    student.iepDue && new Date(student.iepDue) <= addDays(new Date(), 30)
  );

  const upcomingEvaluations = mockStudents.filter(student => 
    student.evaluationDue && new Date(student.evaluationDue) <= addDays(new Date(), 30)
  );

  const todaySessions = mockSessions.filter(session =>
    format(new Date(session.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const todayGroupSessions = mockGroupSessions.filter(session =>
    format(new Date(session.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    switch(tab) {
      case 'caseload':
        navigate('/caseload');
        break;
      case 'schedule':
        navigate('/schedule');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation 
        currentTab={currentTab} 
        onTabChange={handleTabChange} 
        onLogout={onLogout}
        currentUser={currentUser}
      />
      
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back, {currentUser?.name}</h1>
          <p className="text-slate-600">Here's what's happening with your caseload today</p>
        </div>

        {/* AI Insights Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="h-6 w-6" />
            <h2 className="text-xl font-semibold">AI Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm opacity-90">This Week's Focus</div>
              <div className="font-semibold">3 students showing rapid progress in articulation goals</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm opacity-90">Scheduling Optimization</div>
              <div className="font-semibold">Consider grouping Emma and Sofia for social skills practice</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm opacity-90">Data Pattern</div>
              <div className="font-semibold">Morning sessions show 23% better engagement</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Students</p>
                <p className="text-2xl font-bold text-slate-900">{mockStudents.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Today's Sessions</p>
                <p className="text-2xl font-bold text-slate-900">{todaySessions.length + todayGroupSessions.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Upcoming IEPs</p>
                <p className="text-2xl font-bold text-slate-900">{upcomingIEPs.length}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Evaluations Due</p>
                <p className="text-2xl font-bold text-slate-900">{upcomingEvaluations.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming IEPs */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Upcoming IEPs</h3>
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
            
            {upcomingIEPs.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No upcoming IEPs</p>
            ) : (
              <div className="space-y-3">
                {upcomingIEPs.map(student => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-slate-900">{student.name}</p>
                        <p className="text-sm text-slate-600">Grade {student.grade}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-600">
                        Due {format(new Date(student.iepDue), 'MMM dd')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Sessions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Today's Sessions</h3>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            
            {todaySessions.length === 0 && todayGroupSessions.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No sessions scheduled for today</p>
            ) : (
              <div className="space-y-3">
                {/* Individual Sessions */}
                {todaySessions.map(session => {
                  const student = mockStudents.find(s => s.id === session.studentId);
                  return (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img src={student?.avatar} alt={student?.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-slate-900">{student?.name}</p>
                          <p className="text-sm text-slate-600">{session.type} • {session.duration} min</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600">
                          {format(new Date(session.date), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })}
                
                {/* Group Sessions */}
                {todayGroupSessions.map(session => {
                  const students = session.studentIds.map(id => mockStudents.find(s => s.id === id)).filter(Boolean);
                  return (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Users className="h-5 w-5 text-purple-600" />
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">GROUP</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{session.name}</p>
                          <div className="flex items-center space-x-1 text-sm text-slate-600">
                            <span>{session.duration} min •</span>
                            <span>{students.map(s => s.name).join(', ')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-purple-600">
                          {format(new Date(session.date), 'h:mm a')}
                        </p>
                        <p className="text-xs text-slate-500">{session.room}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ScheduleGrid Component - Bird's Eye View with Drag & Drop (5-minute increments)
export const ScheduleGrid = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [scheduleData, setScheduleData] = useState(() => {
    // Initialize schedule data structure with 5-minute increments
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    // Generate 5-minute time slots from 7:00 AM to 5:00 PM (10 hours = 120 slots)
    const generateTimeSlots = () => {
      const slots = [];
      const startHour = 7; // 7:00 AM
      const endHour = 17; // 5:00 PM
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 5) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          slots.push(timeString);
        }
      }
      return slots;
    };
    
    const timeSlots = generateTimeSlots();
    
    const initialData = {};
    days.forEach(day => {
      initialData[day] = {};
      timeSlots.forEach(time => {
        initialData[day][time] = [];
      });
    });

    // Populate with existing sessions and groups (using precise times)
    const sessions = [
      // Individual Sessions with precise timing
      { id: 'ind-1', student: 'Emma Rodriguez', type: 'individual', color: 'bg-blue-200 border-blue-400', day: 'Monday', time: '09:35', duration: 30 },
      { id: 'ind-2', student: 'Aisha Patel', type: 'individual', color: 'bg-green-200 border-green-400', day: 'Tuesday', time: '08:20', duration: 30 },
      { id: 'ind-3', student: 'Dylan Chen', type: 'individual', color: 'bg-yellow-200 border-yellow-400', day: 'Tuesday', time: '14:10', duration: 30 },
      { id: 'ind-4', student: 'Emma Rodriguez', type: 'individual', color: 'bg-blue-200 border-blue-400', day: 'Wednesday', time: '10:15', duration: 30 },
      { id: 'ind-5', student: 'Sofia Martinez', type: 'individual', color: 'bg-purple-200 border-purple-400', day: 'Thursday', time: '11:25', duration: 30 },
      { id: 'ind-6', student: 'Marcus Johnson', type: 'individual', color: 'bg-red-200 border-red-400', day: 'Friday', time: '09:45', duration: 30 },

      // Group Sessions with precise timing
      { 
        id: 'group-1', 
        name: 'Social Communication',
        students: ['Marcus Johnson', 'Sofia Martinez'], 
        type: 'group', 
        color: 'bg-pink-200 border-pink-400', 
        day: 'Monday', 
        time: '13:30', 
        duration: 45 
      },
      { 
        id: 'group-2', 
        name: 'Articulation Practice',
        students: ['Emma Rodriguez', 'Dylan Chen'], 
        type: 'group', 
        color: 'bg-cyan-200 border-cyan-400', 
        day: 'Tuesday', 
        time: '15:15', 
        duration: 45 
      },
      { 
        id: 'group-3', 
        name: 'Language Enrichment',
        students: ['Aisha Patel', 'Sofia Martinez'], 
        type: 'group', 
        color: 'bg-orange-200 border-orange-400', 
        day: 'Wednesday', 
        time: '14:05', 
        duration: 50 
      },
      { 
        id: 'group-4', 
        name: 'Fluency Support',
        students: ['Marcus Johnson', 'Dylan Chen'], 
        type: 'group', 
        color: 'bg-teal-200 border-teal-400', 
        day: 'Thursday', 
        time: '10:40', 
        duration: 35 
      },
      { 
        id: 'group-5', 
        name: 'Reading Readiness',
        students: ['Emma Rodriguez', 'Aisha Patel'], 
        type: 'group', 
        color: 'bg-indigo-200 border-indigo-400', 
        day: 'Friday', 
        time: '08:50', 
        duration: 40 
      }
    ];

    // Place sessions in the grid
    sessions.forEach(session => {
      if (initialData[session.day] && initialData[session.day][session.time]) {
        initialData[session.day][session.time].push(session);
      }
    });

    return initialData;
  });

  const [availableStudents] = useState([
    { id: 1, name: 'Emma Rodriguez', color: 'bg-blue-200 border-blue-400' },
    { id: 2, name: 'Marcus Johnson', color: 'bg-red-200 border-red-400' },
    { id: 3, name: 'Aisha Patel', color: 'bg-green-200 border-green-400' },
    { id: 4, name: 'Dylan Chen', color: 'bg-yellow-200 border-yellow-400' },
    { id: 5, name: 'Sofia Martinez', color: 'bg-purple-200 border-purple-400' }
  ]);

  const handleDrop = (item, targetDay, targetTime, itemType) => {
    if (itemType === ItemTypes.STUDENT) {
      // Create new individual session
      const newSession = {
        id: `new-${Date.now()}`,
        student: item.name,
        type: 'individual',
        color: item.color,
        day: targetDay,
        time: targetTime,
        duration: 30
      };

      setScheduleData(prev => ({
        ...prev,
        [targetDay]: {
          ...prev[targetDay],
          [targetTime]: [...prev[targetDay][targetTime], newSession]
        }
      }));
    } else if (itemType === ItemTypes.SESSION) {
      // Move existing session
      setScheduleData(prev => {
        const newData = { ...prev };
        
        // Remove from source
        Object.keys(newData).forEach(day => {
          Object.keys(newData[day]).forEach(time => {
            newData[day][time] = newData[day][time].filter(s => s.id !== item.id);
          });
        });
        
        // Add to target
        const updatedItem = { ...item, day: targetDay, time: targetTime };
        newData[targetDay][targetTime] = [...newData[targetDay][targetTime], updatedItem];
        
        return newData;
      });
    }
  };

  const removeStudentFromGroup = (groupId, studentName) => {
    setScheduleData(prev => {
      const newData = { ...prev };
      
      // Find the group and remove the student
      Object.keys(newData).forEach(day => {
        Object.keys(newData[day]).forEach(time => {
          newData[day][time] = newData[day][time].map(session => {
            if (session.id === groupId && session.type === 'group') {
              return {
                ...session,
                students: session.students.filter(s => s !== studentName)
              };
            }
            return session;
          });
        });
      });
      
      return newData;
    });
  };

  const createNewGroup = (day, time) => {
    const newGroup = {
      id: `group-new-${Date.now()}`,
      name: 'New Group',
      students: [],
      type: 'group',
      color: 'bg-gray-200 border-gray-400',
      day,
      time,
      duration: 30
    };

    setScheduleData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [time]: [...prev[day][time], newGroup]
      }
    }));
  };

  const deleteSession = (sessionId, day, time) => {
    setScheduleData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [time]: prev[day][time].filter(s => s.id !== sessionId)
      }
    }));
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Generate time slots for display - show every 15 minutes for better readability
  const generateDisplayTimeSlots = () => {
    const slots = [];
    const startHour = 7;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const displayTimeSlots = generateDisplayTimeSlots();

  // Get all sessions for a 15-minute block (includes 3 five-minute slots)
  const getSessionsForTimeBlock = (day, baseTime) => {
    const [baseHour, baseMinute] = baseTime.split(':').map(Number);
    const sessions = [];
    
    // Check the 15-minute block (3 five-minute slots)
    for (let offset = 0; offset < 15; offset += 5) {
      const minute = baseMinute + offset;
      const timeSlot = `${baseHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      if (scheduleData[day] && scheduleData[day][timeSlot]) {
        sessions.push(...scheduleData[day][timeSlot].map(session => ({ ...session, exactTime: timeSlot })));
      }
    }
    
    return sessions;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-slate-50">
        <Navigation currentUser={currentUser} onLogout={onLogout} />
        
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Schedule Grid</h1>
              <p className="text-slate-600">Drag and drop to manage your weekly schedule (5-minute precision)</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/schedule')}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-slate-700"
              >
                <Calendar className="h-4 w-4" />
                <span>Calendar View</span>
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                <span>New Session</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Student Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 sticky top-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Students</h3>
                <p className="text-sm text-slate-600 mb-4">Drag students to precise time slots</p>
                
                <div className="space-y-3">
                  {availableStudents.map(student => (
                    <DraggableStudent key={student.id} student={student} />
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-2">Time Precision</h4>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p>• 5-minute increments</p>
                    <p>• Precise therapy timing</p>
                    <p>• Example: 9:35-10:05</p>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <button className="w-full bg-green-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-700">
                      Create Group
                    </button>
                    <button className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700">
                      Add Time Slot
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Grid */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Week Header */}
                <div className="bg-slate-50 p-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                      Week of {format(startOfWeek(selectedWeek), 'MMM dd, yyyy')}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedWeek(addDays(selectedWeek, -7))}
                        className="p-2 hover:bg-slate-200 rounded-lg"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setSelectedWeek(addDays(selectedWeek, 7))}
                        className="p-2 hover:bg-slate-200 rounded-lg"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grid Header */}
                <div className="grid grid-cols-6 border-b border-slate-200">
                  <div className="p-3 bg-slate-50 font-medium text-slate-600 text-sm">Time</div>
                  {days.map(day => (
                    <div key={day} className="p-3 bg-slate-50 font-medium text-slate-600 text-sm border-l border-slate-200">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grid Body with 5-minute precision */}
                <div className="max-h-[700px] overflow-y-auto">
                  {displayTimeSlots.map(time => {
                    const [hour, minute] = time.split(':').map(Number);
                    return (
                      <div key={time} className="grid grid-cols-6 border-b border-slate-100 min-h-[60px]">
                        {/* Time Column */}
                        <div className="p-2 bg-slate-50 border-r border-slate-200 flex items-center">
                          <span className="font-medium text-slate-900 text-sm">{formatTime(time)}</span>
                        </div>

                        {/* Day Columns - Each represents a 15-minute block but accepts 5-minute drops */}
                        {days.map(day => {
                          const sessions = getSessionsForTimeBlock(day, time);
                          return (
                            <div key={`${day}-${time}`} className="relative">
                              {/* Create 3 drop zones for 5-minute increments within this 15-minute block */}
                              {[0, 5, 10].map(offset => {
                                const exactMinute = minute + offset;
                                const exactTime = `${hour.toString().padStart(2, '0')}:${exactMinute.toString().padStart(2, '0')}`;
                                const sessionsAtExactTime = scheduleData[day]?.[exactTime] || [];
                                
                                return (
                                  <div key={exactTime} className="h-5 border-b border-slate-100">
                                    <DropZone
                                      day={day}
                                      time={exactTime}
                                      sessions={sessionsAtExactTime}
                                      onDrop={handleDrop}
                                      onDelete={deleteSession}
                                      onRemoveStudentFromGroup={removeStudentFromGroup}
                                      onCreateGroup={createNewGroup}
                                      isCompact={true}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <h4 className="font-medium text-slate-900 mb-3">Legend & Instructions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                      <span className="text-sm text-slate-600">Individual Session</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-pink-200 border border-pink-400 rounded"></div>
                      <span className="text-sm text-slate-600">Group Session</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-200 border border-gray-400 rounded border-dashed"></div>
                      <span className="text-sm text-slate-600">Available Slot</span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><strong>5-Minute Precision:</strong></p>
                    <p>• Drag students to any 5-minute slot</p>
                    <p>• Sessions can start at :00, :05, :10, etc.</p>
                    <p>• Perfect for precise therapy timing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

// Caseload Component
export const Caseload = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('caseload');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    switch(tab) {
      case 'dashboard':
        navigate('/');
        break;
      case 'schedule':
        navigate('/schedule');
        break;
      default:
        navigate('/caseload');
    }
  };

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.grade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation 
        currentTab={currentTab} 
        onTabChange={handleTabChange} 
        onLogout={onLogout}
        currentUser={currentUser}
      />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">My Caseload</h1>
            <p className="text-slate-600">Manage all students in your caseload</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select 
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Students</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <div key={student.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                 onClick={() => navigate(`/student/${student.id}`)}>
              <div className="flex items-center space-x-4 mb-4">
                <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{student.name}</h3>
                  <p className="text-slate-600 text-sm">{student.grade} • Age {student.age}</p>
                </div>
                <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", getProgressColor(student.progressLevel))}>
                  {student.progressLevel}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">Primary Goals</p>
                  <div className="space-y-1">
                    {student.primaryGoals.slice(0, 2).map((goal, index) => (
                      <p key={index} className="text-sm text-slate-600">• {goal}</p>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                  <div className="text-sm">
                    <p className="text-slate-500">Next Session</p>
                    <p className="font-medium text-slate-900">
                      {format(new Date(student.nextSession), 'MMM dd, h:mm a')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Progress</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium">{student.recentProgress.score}%</span>
                      <TrendingUp className={clsx("h-3 w-3", 
                        student.recentProgress.trend === 'up' ? 'text-green-500' : 'text-slate-400')} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No students found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Schedule Component (Calendar View)
export const Schedule = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('schedule');
  const [viewType, setViewType] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    switch(tab) {
      case 'dashboard':
        navigate('/');
        break;
      case 'caseload':
        navigate('/caseload');
        break;
      default:
        navigate('/schedule');
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewType === 'day') {
      newDate.setDate(currentDate.getDate() + direction);
    } else if (viewType === 'week') {
      newDate.setDate(currentDate.getDate() + (direction * 7));
    } else {
      newDate.setMonth(currentDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  const getViewDates = () => {
    if (viewType === 'day') {
      return [currentDate];
    } else if (viewType === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return eachDayOfInterval({ start, end });
    }
  };

  const getSessionsForDate = (date) => {
    const individualSessions = mockSessions.filter(session => 
      format(new Date(session.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    
    const groupSessions = mockGroupSessions.filter(session => 
      format(new Date(session.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    
    return { individualSessions, groupSessions };
  };

  const handleSessionClick = (session) => {
    if (session.type === 'Group' || session.studentIds) {
      navigate(`/live-session/${session.id}`);
    } else {
      navigate(`/live-session/${session.id}`);
    }
  };

  const renderSessionCard = (session, isGroupSession = false) => {
    if (isGroupSession) {
      const students = session.studentIds.map(id => mockStudents.find(s => s.id === id)).filter(Boolean);
      return (
        <div 
          key={session.id} 
          className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500 cursor-pointer hover:bg-purple-100 transition-colors"
          onClick={() => handleSessionClick(session)}
        >
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-600" />
            <span className="text-purple-600 font-medium text-sm">GROUP</span>
          </div>
          <div className="text-purple-600 font-medium">
            {format(new Date(session.date), 'h:mm a')}
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-900">{session.name}</p>
            <p className="text-sm text-slate-600">{session.duration} minutes • {session.room}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-slate-500">Students:</span>
              {students.map((student, index) => (
                <span key={student.id} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {student.name}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
              {session.status}
            </span>
          </div>
        </div>
      );
    } else {
      const student = mockStudents.find(s => s.id === session.studentId);
      return (
        <div 
          key={session.id} 
          className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={() => handleSessionClick(session)}
        >
          <div className="text-blue-600 font-medium">
            {format(new Date(session.date), 'h:mm a')}
          </div>
          <img src={student?.avatar} alt={student?.name} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1">
            <p className="font-medium text-slate-900">{student?.name}</p>
            <p className="text-sm text-slate-600">{session.type} • {session.duration} minutes</p>
          </div>
          <div className="text-right">
            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
              {session.status}
            </span>
          </div>
        </div>
      );
    }
  };

  const viewDates = getViewDates();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation 
        currentTab={currentTab} 
        onTabChange={handleTabChange} 
        onLogout={onLogout}
        currentUser={currentUser}
      />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Schedule</h1>
            <p className="text-slate-600">Manage your therapy sessions</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/schedule-grid')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Grid View</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              <span>New Session</span>
            </button>
          </div>
        </div>

        {/* Schedule Controls */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigateDate(-1)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h2 className="text-lg font-semibold text-slate-900">
                {viewType === 'day' && format(currentDate, 'EEEE, MMMM dd, yyyy')}
                {viewType === 'week' && `Week of ${format(startOfWeek(currentDate), 'MMM dd, yyyy')}`}
                {viewType === 'month' && format(currentDate, 'MMMM yyyy')}
              </h2>
              <button 
                onClick={() => navigateDate(1)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {['day', 'week', 'month'].map(type => (
                <button
                  key={type}
                  onClick={() => setViewType(type)}
                  className={clsx(
                    "px-3 py-1 rounded-lg text-sm font-medium capitalize",
                    viewType === type 
                      ? "bg-blue-600 text-white" 
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        {viewType === 'day' ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">
                {format(currentDate, 'EEEE, MMMM dd')}
              </h3>
              <div className="space-y-3">
                {(() => {
                  const { individualSessions, groupSessions } = getSessionsForDate(currentDate);
                  const allSessions = [
                    ...individualSessions.map(session => ({ ...session, isGroup: false })),
                    ...groupSessions.map(session => ({ ...session, isGroup: true }))
                  ].sort((a, b) => new Date(a.date) - new Date(b.date));

                  if (allSessions.length === 0) {
                    return <p className="text-slate-500 text-center py-8">No sessions scheduled for this day</p>;
                  }

                  return allSessions.map(session => 
                    renderSessionCard(session, session.isGroup)
                  );
                })()}
              </div>
            </div>
          </div>
        ) : viewType === 'week' ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-slate-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-4 text-center font-medium text-slate-600 border-r border-slate-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {viewDates.map(date => {
                const { individualSessions, groupSessions } = getSessionsForDate(date);
                const allSessions = [
                  ...individualSessions,
                  ...groupSessions
                ].sort((a, b) => new Date(a.date) - new Date(b.date));

                return (
                  <div key={date.toISOString()} className="min-h-[120px] p-2 border-r border-slate-200 last:border-r-0">
                    <div className={clsx(
                      "text-sm font-medium mb-2",
                      isToday(date) ? "text-blue-600" : "text-slate-900"
                    )}>
                      {format(date, 'd')}
                    </div>
                    <div className="space-y-1">
                      {allSessions.slice(0, 3).map(session => {
                        const isGroup = session.studentIds !== undefined;
                        if (isGroup) {
                          return (
                            <div 
                              key={session.id} 
                              className="text-xs p-1 bg-purple-100 text-purple-700 rounded truncate cursor-pointer hover:bg-purple-200"
                              onClick={() => handleSessionClick(session)}
                            >
                              {format(new Date(session.date), 'h:mm a')} {session.name}
                            </div>
                          );
                        } else {
                          const student = mockStudents.find(s => s.id === session.studentId);
                          return (
                            <div 
                              key={session.id} 
                              className="text-xs p-1 bg-blue-100 text-blue-700 rounded truncate cursor-pointer hover:bg-blue-200"
                              onClick={() => handleSessionClick(session)}
                            >
                              {format(new Date(session.date), 'h:mm a')} {student?.name}
                            </div>
                          );
                        }
                      })}
                      {allSessions.length > 3 && (
                        <div className="text-xs text-slate-500">
                          +{allSessions.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-slate-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-4 text-center font-medium text-slate-600 border-r border-slate-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {viewDates.map(date => {
                const { individualSessions, groupSessions } = getSessionsForDate(date);
                const allSessions = [
                  ...individualSessions,
                  ...groupSessions
                ].sort((a, b) => new Date(a.date) - new Date(b.date));

                return (
                  <div key={date.toISOString()} className={clsx(
                    "min-h-[100px] p-2 border-r border-b border-slate-200 last:border-r-0",
                    !isSameMonth(date, currentDate) && "bg-slate-50"
                  )}>
                    <div className={clsx(
                      "text-sm font-medium mb-1",
                      isToday(date) ? "text-blue-600" : 
                      isSameMonth(date, currentDate) ? "text-slate-900" : "text-slate-400"
                    )}>
                      {format(date, 'd')}
                    </div>
                    <div className="space-y-1">
                      {allSessions.slice(0, 2).map(session => {
                        const isGroup = session.studentIds !== undefined;
                        return (
                          <div 
                            key={session.id} 
                            className={clsx(
                              "text-xs p-1 rounded truncate cursor-pointer",
                              isGroup 
                                ? "bg-purple-100 text-purple-700 hover:bg-purple-200" 
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            )}
                            onClick={() => handleSessionClick(session)}
                          >
                            {format(new Date(session.date), 'h:mm a')}
                            {isGroup ? ` (Group)` : ''}
                          </div>
                        );
                      })}
                      {allSessions.length > 2 && (
                        <div className="text-xs text-slate-500">
                          +{allSessions.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};