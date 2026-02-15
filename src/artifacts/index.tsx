import React, { useState } from 'react';
import { Calendar, Filter, Plus, Search, AlertCircle, Clock, CheckCircle, XCircle, FileText, Upload, MessageSquare, User, PieChart, BarChart3 } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const DirectiveManagementSystem = () => {
  const [currentUser, setCurrentUser] = useState({ role: 'admin', name: 'Admin User' });
  const [directives, setDirectives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    loadDirectives();
  }, []);

  const loadDirectives = async () => {
    try {
      const result = await window.storage.get('directives_data');
      if (result && result.value) {
        const data = JSON.parse(result.value);
        setDirectives(data);
      } else {
        const initialData = [
          {
            id: 1,
            meeting: '경영회의',
            largeCategory: 'Investment',
            smallCategory: '상품기획',
            priority: 'High',
            content: '신제품 라인업 검토 및 투자안 수립',
            assignee: '김철수',
            registeredDate: '2026-02-01',
            dueDate: '2026-02-10',
            status: 'Open',
            updates: [],
            files: []
          },
          {
            id: 2,
            meeting: 'R&D 회의',
            largeCategory: 'Winning R&D',
            smallCategory: '개발(SW)',
            priority: 'Critical',
            content: 'AI 알고리즘 성능 개선 방안 보고',
            assignee: '이영희',
            registeredDate: '2026-02-05',
            dueDate: '2026-02-20',
            status: 'In-Progress',
            updates: [{ timestamp: '2026-02-14 09:30', type: 'update', user: '이영희', text: '초기 분석 완료, 프로토타입 개발 중' }],
            files: []
          },
          {
            id: 3,
            meeting: '전략회의',
            largeCategory: 'AX',
            smallCategory: '마케팅',
            priority: 'Medium',
            content: '브랜드 리뉴얼 전략 수립',
            assignee: '박민수',
            registeredDate: '2026-02-08',
            dueDate: '2026-02-25',
            status: 'Request for Closing',
            updates: [
              { timestamp: '2026-02-14 14:20', type: 'update', user: '박민수', text: '시장 조사 완료' },
              { timestamp: '2026-02-13 16:45', type: 'update', user: '박민수', text: '초안 작성 완료, 검토 요청' }
            ],
            files: []
          }
        ];
        setDirectives(initialData);
        await saveDirectives(initialData);
      }
    } catch (error) {
      console.log('첫 실행입니다. 초기 데이터를 생성합니다.');
      const initialData = [
        {
          id: 1,
          meeting: '경영회의',
          largeCategory: 'Investment',
          smallCategory: '상품기획',
          priority: 'High',
          content: '신제품 라인업 검토 및 투자안 수립',
          assignee: '김철수',
          registeredDate: '2026-02-01',
          dueDate: '2026-02-10',
          status: 'Open',
          updates: [],
          files: []
        },
        {
          id: 2,
          meeting: 'R&D 회의',
          largeCategory: 'Winning R&D',
          smallCategory: '개발(SW)',
          priority: 'Critical',
          content: 'AI 알고리즘 성능 개선 방안 보고',
          assignee: '이영희',
          registeredDate: '2026-02-05',
          dueDate: '2026-02-20',
          status: 'In-Progress',
          updates: [{ timestamp: '2026-02-14 09:30', type: 'update', user: '이영희', text: '초기 분석 완료, 프로토타입 개발 중' }],
          files: []
        },
        {
          id: 3,
          meeting: '전략회의',
          largeCategory: 'AX',
          smallCategory: '마케팅',
          priority: 'Medium',
          content: '브랜드 리뉴얼 전략 수립',
          assignee: '박민수',
          registeredDate: '2026-02-08',
          dueDate: '2026-02-25',
          status: 'Request for Closing',
          updates: [
            { timestamp: '2026-02-14 14:20', type: 'update', user: '박민수', text: '시장 조사 완료' },
            { timestamp: '2026-02-13 16:45', type: 'update', user: '박민수', text: '초안 작성 완료, 검토 요청' }
          ],
          files: []
        }
      ];
      setDirectives(initialData);
      await saveDirectives(initialData);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDirectives = async (data) => {
    try {
      await window.storage.set('directives_data', JSON.stringify(data));
    } catch (error) {
      console.error('데이터 저장 실패:', error);
    }
  };

  const updateDirectives = (newDirectives) => {
    setDirectives(newDirectives);
    saveDirectives(newDirectives);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDirective, setSelectedDirective] = useState(null);
  const [filters, setFilters] = useState({
    meeting: '',
    largeCategory: '',
    smallCategory: '',
    priority: '',
    status: '',
    assignee: ''
  });
  const [sortBy, setSortBy] = useState('dueDate');
  const [quickFilter, setQuickFilter] = useState('all');
  const [selectedChart, setSelectedChart] = useState(null);
  const [chartType, setChartType] = useState('meeting');

  const statusColors = {
    'Open': 'bg-gray-100 text-gray-800',
    'In-Progress': 'bg-blue-100 text-blue-800',
    'Request for Closing': 'bg-yellow-100 text-yellow-800',
    '추가 F/up Request': 'bg-purple-100 text-purple-800',
    'Closed': 'bg-green-100 text-green-800',
    'Re-Open': 'bg-orange-100 text-orange-800'
  };

  const priorityColors = {
    'Critical': 'text-red-600 font-bold',
    'High': 'text-orange-600 font-semibold',
    'Medium': 'text-yellow-600',
    'Low': 'text-green-600'
  };

  const isOverdue = (dueDate, status) => {
    const today = new Date();
    const due = new Date(dueDate);
    return status !== 'Closed' && due < today;
  };

  const isDueSoon = (dueDate, status) => {
    const today = new Date();
    const due = new Date(dueDate);
    const twoWeeks = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    return status !== 'Closed' && due >= today && due <= twoWeeks;
  };

  const filteredAndSortedDirectives = directives
    .filter(d => {
      if (quickFilter === 'open' && d.status !== 'Open') return false;
      if (quickFilter === 'inProgress' && d.status !== 'In-Progress') return false;
      if (quickFilter === 'requestForClosing' && d.status !== 'Request for Closing') return false;
      if (quickFilter === 'overdue' && !isOverdue(d.dueDate, d.status)) return false;
      if (quickFilter === 'dueSoon' && !isDueSoon(d.dueDate, d.status)) return false;
      
      return (
        (!filters.meeting || d.meeting === filters.meeting) &&
        (!filters.largeCategory || d.largeCategory === filters.largeCategory) &&
        (!filters.smallCategory || d.smallCategory === filters.smallCategory) &&
        (!filters.priority || d.priority === filters.priority) &&
        (!filters.status || d.status === filters.status) &&
        (!filters.assignee || d.assignee === filters.assignee)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === 'priority') {
        const priorities = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorities[b.priority] - priorities[a.priority];
      }
      return 0;
    });

  const stats = {
    total: directives.length,
    open: directives.filter(d => d.status === 'Open').length,
    inProgress: directives.filter(d => d.status === 'In-Progress').length,
    requestForClosing: directives.filter(d => d.status === 'Request for Closing').length,
    overdue: directives.filter(d => isOverdue(d.dueDate, d.status)).length,
    dueSoon: directives.filter(d => isDueSoon(d.dueDate, d.status)).length
  };

  const getChartData = () => {
    const groupBy = chartType === 'meeting' ? 'meeting' : 'largeCategory';
    const groups = {};
    
    directives.forEach(d => {
      const key = d[groupBy];
      if (!groups[key]) {
        groups[key] = {
          name: key,
          Open: 0,
          'In-Progress': 0,
          'Request for Closing': 0,
          '추가 F/up Request': 0,
          'Re-Open': 0,
          Closed: 0,
          total: 0
        };
      }
      groups[key][d.status]++;
      groups[key].total++;
    });
    
    return Object.values(groups);
  };

  const getAssigneeData = (filterKey) => {
    const groupBy = chartType === 'meeting' ? 'meeting' : 'largeCategory';
    const filtered = directives.filter(d => d[groupBy] === filterKey);
    const assignees = {};
    
    filtered.forEach(d => {
      if (!assignees[d.assignee]) {
        assignees[d.assignee] = {
          name: d.assignee,
          Open: 0,
          'In-Progress': 0,
          'Request for Closing': 0,
          '추가 F/up Request': 0,
          'Re-Open': 0,
          Closed: 0,
          total: 0
        };
      }
      assignees[d.assignee][d.status]++;
      assignees[d.assignee].total++;
    });
    
    return Object.values(assignees);
  };

  const COLORS = {
    'Open': '#9CA3AF',
    'In-Progress': '#3B82F6',
    'Request for Closing': '#EAB308',
    '추가 F/up Request': '#A855F7',
    'Closed': '#10B981',
    'Re-Open': '#F97316'
  };

  const CEODashboard = () => {
    const chartData = getChartData();
    const assigneeData = selectedChart ? getAssigneeData(selectedChart) : [];

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">현황 분석</h3>
            <div className="flex gap-2">
              <button
                onClick={() => { setChartType('meeting'); setSelectedChart(null); }}
                className={`px-4 py-2 rounded-md text-sm ${chartType === 'meeting' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                회의체별
              </button>
              <button
                onClick={() => { setChartType('largeCategory'); setSelectedChart(null); }}
                className={`px-4 py-2 rounded-md text-sm ${chartType === 'largeCategory' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                대영역별
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {chartData.map((data, idx) => {
              const pieData = [
                { name: 'Open', value: data.Open },
                { name: 'In-Progress', value: data['In-Progress'] },
                { name: 'Request for Closing', value: data['Request for Closing'] },
                { name: '추가 F/up Request', value: data['추가 F/up Request'] },
                { name: 'Re-Open', value: data['Re-Open'] },
                { name: 'Closed', value: data.Closed }
              ].filter(item => item.value > 0);

              const closedRate = data.total > 0 ? ((data.Closed / data.total) * 100).toFixed(1) : 0;

              return (
                <div 
                  key={idx} 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedChart === data.name ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
                  onClick={() => setSelectedChart(data.name)}
                >
                  <h4 className="font-semibold text-gray-900 mb-2 text-center">{data.name}</h4>
                  <div className="text-center text-sm text-gray-600 mb-2">
                    완료율: <span className="font-bold text-green-600">{closedRate}%</span> ({data.Closed}/{data.total})
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="mt-2 space-y-1">
                    {pieData.map((entry, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[entry.name] }}></div>
                          <span>{entry.name}</span>
                        </div>
                        <span className="font-semibold">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedChart && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedChart} - 담당자별 이행 현황
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={assigneeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Open" stackId="a" fill={COLORS['Open']} name="Open" />
                <Bar dataKey="In-Progress" stackId="a" fill={COLORS['In-Progress']} name="진행중" />
                <Bar dataKey="Request for Closing" stackId="a" fill={COLORS['Request for Closing']} name="완료요청" />
                <Bar dataKey="추가 F/up Request" stackId="a" fill={COLORS['추가 F/up Request']} name="추가F/up" />
                <Bar dataKey="Re-Open" stackId="a" fill={COLORS['Re-Open']} name="Re-Open" />
                <Bar dataKey="Closed" stackId="a" fill={COLORS['Closed']} name="Closed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  };

  const AddDirectiveModal = () => {
    const [formData, setFormData] = useState({
      meeting: '',
      largeCategory: '',
      smallCategory: '',
      priority: 'Medium',
      content: '',
      assignee: '',
      dueDate: ''
    });

    const handleSubmit = () => {
      if (!formData.meeting || !formData.largeCategory || !formData.smallCategory || 
          !formData.content || !formData.assignee || !formData.dueDate) {
        alert('모든 필드를 입력해주세요.');
        return;
      }
      const maxId = directives.length > 0 ? Math.max(...directives.map(d => d.id)) : 0;
      const today = new Date().toISOString().split('T')[0];
      const newDirective = {
        id: maxId + 1,
        ...formData,
        registeredDate: today,
        status: 'Open',
        updates: [],
        files: []
      };
      const newDirectives = [...directives, newDirective];
      updateDirectives(newDirectives);
      setShowAddModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900">새 지시사항 등록</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">회의체</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.meeting}
                  onChange={(e) => setFormData({...formData, meeting: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">대영역</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.largeCategory}
                  onChange={(e) => setFormData({...formData, largeCategory: e.target.value})}
                >
                  <option value="">선택</option>
                  <option>Investment</option>
                  <option>Winning R&D</option>
                  <option>AX</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">소영역</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.smallCategory}
                  onChange={(e) => setFormData({...formData, smallCategory: e.target.value})}
                >
                  <option value="">선택</option>
                  <option>공통(CSO/CFO/CHO/CTO)</option>
                  <option>상품기획</option>
                  <option>구매/SCM</option>
                  <option>개발(디자인/기구/HW/SW)</option>
                  <option>품질</option>
                  <option>제조</option>
                  <option>영업</option>
                  <option>마케팅</option>
                  <option>서비스</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.assignee}
                  onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">지시사항</label>
              <textarea
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                등록
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DirectiveDetailModal = ({ directive }) => {
    const [updateText, setUpdateText] = useState('');
    const [commentText, setCommentText] = useState('');
    const [newDueDatePeriod, setNewDueDatePeriod] = useState('1week');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState({
      meeting: directive.meeting,
      largeCategory: directive.largeCategory,
      smallCategory: directive.smallCategory,
      priority: directive.priority,
      content: directive.content,
      assignee: directive.assignee,
      dueDate: directive.dueDate
    });

    const calculateNewDueDate = (period) => {
      const today = new Date();
      const daysToAdd = {
        '1week': 7,
        '2weeks': 14,
        '3weeks': 21,
        '1month': 30,
        '2months': 60,
        '3months': 90
      };
      const newDate = new Date(today.getTime() + daysToAdd[period] * 24 * 60 * 60 * 1000);
      return newDate.toISOString().split('T')[0];
    };

    const handleStatusChange = (newStatus) => {
      const newDirectives = directives.map(d => 
        d.id === directive.id ? { ...d, status: newStatus } : d
      );
      updateDirectives(newDirectives);
      setSelectedDirective({ ...directive, status: newStatus });
    };

    const handleFileSelect = (e) => {
      const files = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...files]);
    };

    const handleRemoveFile = (index) => {
      setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    const handleAddUpdate = () => {
      if (!updateText.trim()) return;
      const fileNames = selectedFiles.map(f => f.name);
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 16).replace('T', ' ');
      const updated = {
        ...directive,
        updates: [...directive.updates, { 
          timestamp: timestamp,
          type: 'update',
          user: currentUser.name,
          text: updateText,
          files: fileNames
        }],
        files: [...directive.files, ...fileNames]
      };
      const newDirectives = directives.map(d => d.id === directive.id ? updated : d);
      updateDirectives(newDirectives);
      setSelectedDirective(updated);
      setUpdateText('');
      setSelectedFiles([]);
    };

    const handleAddComment = () => {
      if (!commentText.trim()) return;
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 16).replace('T', ' ');
      const updated = {
        ...directive,
        updates: [...directive.updates, { 
          timestamp: timestamp,
          type: 'comment',
          user: currentUser.name,
          text: commentText
        }]
      };
      const newDirectives = directives.map(d => d.id === directive.id ? updated : d);
      updateDirectives(newDirectives);
      setSelectedDirective(updated);
      setCommentText('');
    };

    const handleAdditionalFollowUp = () => {
      const newDate = calculateNewDueDate(newDueDatePeriod);
      const updated = {
        ...directive,
        status: '추가 F/up Request',
        dueDate: newDate
      };
      const newDirectives = directives.map(d => d.id === directive.id ? updated : d);
      updateDirectives(newDirectives);
      setSelectedDirective(updated);
    };

    const handleSaveEdit = () => {
      const updated = {
        ...directive,
        ...editData
      };
      const newDirectives = directives.map(d => d.id === directive.id ? updated : d);
      updateDirectives(newDirectives);
      setSelectedDirective(updated);
      setIsEditMode(false);
    };

    const handleCancelEdit = () => {
      setIsEditMode(false);
      setEditData({
        meeting: directive.meeting,
        largeCategory: directive.largeCategory,
        smallCategory: directive.smallCategory,
        priority: directive.priority,
        content: directive.content,
        assignee: directive.assignee,
        dueDate: directive.dueDate
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col" style={{ height: '90vh' }}>
          <div className="p-6 border-b flex justify-between items-center flex-shrink-0 bg-white">
            <div>
              <h3 className="text-xl font-bold text-gray-900">지시사항 상세</h3>
              <p className="text-sm text-gray-500 mt-1">ID: {directive.id}</p>
            </div>
            <div className="flex items-center gap-2">
              {currentUser.role === 'admin' && !isEditMode && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  수정
                </button>
              )}
              <button
                onClick={() => setSelectedDirective(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {isEditMode && currentUser.role === 'admin' ? (
                <div className="bg-blue-50 p-6 rounded-lg space-y-4 border-2 border-blue-300">
                  <h4 className="font-semibold text-lg text-gray-900 mb-4">지시사항 수정</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">회의체</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        value={editData.meeting}
                        onChange={(e) => setEditData({...editData, meeting: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">대영역</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        value={editData.largeCategory}
                        onChange={(e) => setEditData({...editData, largeCategory: e.target.value})}
                      >
                        <option>Investment</option>
                        <option>Winning R&D</option>
                        <option>AX</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">소영역</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        value={editData.smallCategory}
                        onChange={(e) => setEditData({...editData, smallCategory: e.target.value})}
                      >
                        <option>공통(CSO/CFO/CHO/CTO)</option>
                        <option>상품기획</option>
                        <option>구매/SCM</option>
                        <option>개발(디자인/기구/HW/SW)</option>
                        <option>품질</option>
                        <option>제조</option>
                        <option>영업</option>
                        <option>마케팅</option>
                        <option>서비스</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        value={editData.priority}
                        onChange={(e) => setEditData({...editData, priority: e.target.value})}
                      >
                        <option>Critical</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        value={editData.assignee}
                        onChange={(e) => setEditData({...editData, assignee: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        value={editData.dueDate}
                        onChange={(e) => setEditData({...editData, dueDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">지시사항</label>
                    <textarea
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      value={editData.content}
                      onChange={(e) => setEditData({...editData, content: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 font-medium"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">회의체:</span> {directive.meeting}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">대영역:</span> {directive.largeCategory}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">소영역:</span> {directive.smallCategory}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Priority:</span> 
                  <span className={`ml-2 ${priorityColors[directive.priority]}`}>{directive.priority}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">담당자:</span> {directive.assignee}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">등록일:</span> {directive.registeredDate}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Due Date:</span> {directive.dueDate}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700">Status:</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs ${statusColors[directive.status]}`}>
                    {directive.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">지시사항</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{directive.content}</p>
              </div>

              {currentUser.role !== 'ceo' && directive.status === 'Open' && (
                <button
                  onClick={() => {
                    handleStatusChange('In-Progress');
                    setSelectedDirective(null);
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  In-Progress로 전환
                </button>
              )}

              {currentUser.role !== 'ceo' && directive.status === 'In-Progress' && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">진척 현황</h4>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="진행 상황을 입력하세요..."
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">첨부 파일</label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-blue-400 transition-colors">
                          <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                          <span className="text-sm text-gray-600">파일을 선택하거나 드래그하세요</span>
                        </div>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </label>
                    </div>
                    {selectedFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-gray-500" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button
                              onClick={() => handleRemoveFile(idx)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAddUpdate}
                      className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                      진척 현황 업데이트
                    </button>
                    <button
                      onClick={() => {
                        if (updateText.trim()) {
                          handleAddUpdate();
                        }
                        handleStatusChange('Request for Closing');
                      }}
                      className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                    >
                      완료 요청
                    </button>
                  </div>
                </div>
              )}

              {currentUser.role !== 'ceo' && directive.status === '추가 F/up Request' && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">진척 현황</h4>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="진행 상황을 입력하세요..."
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">첨부 파일</label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-blue-400 transition-colors">
                          <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                          <span className="text-sm text-gray-600">파일을 선택하거나 드래그하세요</span>
                        </div>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </label>
                    </div>
                    {selectedFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-gray-500" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button
                              onClick={() => handleRemoveFile(idx)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAddUpdate}
                      className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                      진척 현황 업데이트
                    </button>
                    <button
                      onClick={() => {
                        if (updateText.trim()) {
                          handleAddUpdate();
                        }
                        handleStatusChange('Request for Closing');
                      }}
                      className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                    >
                      완료 요청
                    </button>
                  </div>
                </div>
              )}

              {currentUser.role !== 'ceo' && directive.status === 'Request for Closing' && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">진척 현황</h4>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="진행 상황을 입력하세요..."
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">첨부 파일</label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-blue-400 transition-colors">
                          <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                          <span className="text-sm text-gray-600">파일을 선택하거나 드래그하세요</span>
                        </div>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </label>
                    </div>
                    {selectedFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-gray-500" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button
                              onClick={() => handleRemoveFile(idx)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleAddUpdate}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                  >
                    진척 현황 업데이트
                  </button>
                </div>
              )}

              {currentUser.role !== 'ceo' && directive.status === 'Re-Open' && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">진척 현황</h4>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="진행 상황을 입력하세요..."
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">첨부 파일</label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-blue-400 transition-colors">
                          <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                          <span className="text-sm text-gray-600">파일을 선택하거나 드래그하세요</span>
                        </div>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </label>
                    </div>
                    {selectedFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-gray-500" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button
                              onClick={() => handleRemoveFile(idx)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAddUpdate}
                      className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                      진척 현황 업데이트
                    </button>
                    <button
                      onClick={() => {
                        if (updateText.trim()) {
                          handleAddUpdate();
                        }
                        handleStatusChange('Request for Closing');
                      }}
                      className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                    >
                      완료 요청
                    </button>
                  </div>
                </div>
              )}

              {directive.updates.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">진척 히스토리</h4>
                  <div className="space-y-3">
                    {directive.updates.map((item, idx) => (
                      <div key={idx} className={`p-3 rounded-md ${item.type === 'comment' ? 'bg-yellow-50 border-l-4 border-yellow-400' : 'bg-blue-50 border-l-4 border-blue-400'}`}>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                          <User size={14} />
                          <span className="font-semibold">[{item.user}]</span>
                          {item.type === 'comment' && <span className="text-yellow-700 font-medium">Comment</span>}
                          {item.type === 'update' && <span className="text-blue-700 font-medium">진척 현황</span>}
                          <span>•</span>
                          <span>{item.timestamp}</span>
                        </div>
                        <div className="text-sm text-gray-800">{item.text}</div>
                        {item.files && item.files.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {item.files.map((fileName, fileIdx) => (
                              <div key={fileIdx} className="flex items-center gap-2 text-xs text-gray-600">
                                <FileText size={14} />
                                <span>{fileName}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(currentUser.role === 'ceo' || currentUser.role === 'admin') && (directive.status === 'Request for Closing' || directive.status === '추가 F/up Request') && (
                <div className="space-y-3 bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">완료 처리</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">코멘트</label>
                    <textarea
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="코멘트를 입력하세요..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={async () => {
                        if (commentText.trim()) {
                          const now = new Date();
                          const timestamp = now.toISOString().slice(0, 16).replace('T', ' ');
                          const updatedWithComment = {
                            ...directive,
                            updates: [...directive.updates, { 
                              timestamp: timestamp,
                              type: 'comment',
                              user: currentUser.name,
                              text: commentText
                            }],
                            status: 'Closed'
                          };
                          const newDirectives = directives.map(d => d.id === directive.id ? updatedWithComment : d);
                          updateDirectives(newDirectives);
                          setSelectedDirective(updatedWithComment);
                          setCommentText('');
                        } else {
                          handleStatusChange('Closed');
                        }
                      }}
                      className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                    >
                      승인 및 종료
                    </button>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">추가 Follow-up 필요시</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                      value={newDueDatePeriod}
                      onChange={(e) => setNewDueDatePeriod(e.target.value)}
                    >
                      <option value="1week">1주</option>
                      <option value="2weeks">2주</option>
                      <option value="3weeks">3주</option>
                      <option value="1month">1개월</option>
                      <option value="2months">2개월</option>
                      <option value="3months">3개월</option>
                    </select>
                    <button
                      onClick={async () => {
                        if (commentText.trim()) {
                          const now = new Date();
                          const timestamp = now.toISOString().slice(0, 16).replace('T', ' ');
                          const newDate = calculateNewDueDate(newDueDatePeriod);
                          const updatedWithComment = {
                            ...directive,
                            updates: [...directive.updates, { 
                              timestamp: timestamp,
                              type: 'comment',
                              user: currentUser.name,
                              text: commentText
                            }],
                            status: '추가 F/up Request',
                            dueDate: newDate
                          };
                          const newDirectives = directives.map(d => d.id === directive.id ? updatedWithComment : d);
                          updateDirectives(newDirectives);
                          setSelectedDirective(updatedWithComment);
                          setCommentText('');
                        } else {
                          handleAdditionalFollowUp();
                        }
                      }}
                      className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
                    >
                      추가 Follow-up 요청
                    </button>
                  </div>
                </div>
              )}

              {(currentUser.role === 'ceo' || currentUser.role === 'admin') && directive.status === 'Closed' && (
                <div className="space-y-3 bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Re-Open</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Re-Open 사유</label>
                    <textarea
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Re-Open 사유를 입력하세요..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={async () => {
                      if (commentText.trim()) {
                        const now = new Date();
                        const timestamp = now.toISOString().slice(0, 16).replace('T', ' ');
                        const updatedWithComment = {
                          ...directive,
                          updates: [...directive.updates, { 
                            timestamp: timestamp,
                            type: 'comment',
                            user: currentUser.name,
                            text: `[Re-Open 사유] ${commentText}`
                          }],
                          status: 'Re-Open'
                        };
                        const newDirectives = directives.map(d => d.id === directive.id ? updatedWithComment : d);
                        updateDirectives(newDirectives);
                        setSelectedDirective(updatedWithComment);
                        setCommentText('');
                      } else {
                        alert('Re-Open 사유를 입력해주세요.');
                      }
                    }}
                    className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700"
                  >
                    Re-Open
                  </button>
                </div>
              )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-gray-600">데이터 로딩 중...</div>
        </div>
      ) : (
        <>
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">CEO 지시사항 관리 시스템</h1>
                  <p className="text-sm text-gray-500 mt-1">현재 사용자: {currentUser.name} ({currentUser.role})</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentUser({ role: 'admin', name: 'Admin User' })}
                    className={`px-4 py-2 rounded-md text-sm ${currentUser.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => setCurrentUser({ role: 'assignee', name: '담당자' })}
                    className={`px-4 py-2 rounded-md text-sm ${currentUser.role === 'assignee' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  >
                    담당자
                  </button>
                  <button
                    onClick={() => setCurrentUser({ role: 'ceo', name: 'CEO' })}
                    className={`px-4 py-2 rounded-md text-sm ${currentUser.role === 'ceo' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  >
                    CEO
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-6 py-8">
            {(currentUser.role === 'ceo' || currentUser.role === 'admin') && (
              <>
                <CEODashboard />
                <div className="h-8"></div>
              </>
            )}

            <div className="grid grid-cols-6 gap-4 mb-6">
              <div 
                className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${quickFilter === 'all' ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
                onClick={() => setQuickFilter('all')}
              >
                <div className="text-sm text-gray-500 mb-1">전체</div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              </div>
              <div 
                className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${quickFilter === 'open' ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
                onClick={() => setQuickFilter('open')}
              >
                <div className="text-sm text-gray-500 mb-1">Open</div>
                <div className="text-2xl font-bold text-gray-600">{stats.open}</div>
              </div>
              <div 
                className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${quickFilter === 'inProgress' ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
                onClick={() => setQuickFilter('inProgress')}
              >
                <div className="text-sm text-gray-500 mb-1">진행중</div>
                <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              </div>
              <div 
                className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${quickFilter === 'overdue' ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
                onClick={() => setQuickFilter('overdue')}
              >
                <div className="text-sm text-gray-500 mb-1">기한 초과</div>
                <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              </div>
              <div 
                className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${quickFilter === 'dueSoon' ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
                onClick={() => setQuickFilter('dueSoon')}
              >
                <div className="text-sm text-gray-500 mb-1">2주 이내</div>
                <div className="text-2xl font-bold text-orange-600">{stats.dueSoon}</div>
              </div>
              <div 
                className={`bg-red-50 rounded-lg shadow p-4 cursor-pointer transition-all ${quickFilter === 'requestForClosing' ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
                onClick={() => setQuickFilter('requestForClosing')}
              >
                <div className="text-sm text-gray-500 mb-1">완료 요청</div>
                <div className="text-2xl font-bold text-red-600">{stats.requestForClosing}</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">필터 및 정렬</h2>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus size={18} />
                    새 지시사항
                  </button>
                )}
              </div>
              <div className="p-4 grid grid-cols-4 gap-3">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">전체 상태</option>
                  <option>Open</option>
                  <option>In-Progress</option>
                  <option>Request for Closing</option>
                  <option>추가 F/up Request</option>
                  <option>Re-Open</option>
                  <option>Closed</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={filters.priority}
                  onChange={(e) => setFilters({...filters, priority: e.target.value})}
                >
                  <option value="">전체 Priority</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={filters.largeCategory}
                  onChange={(e) => setFilters({...filters, largeCategory: e.target.value})}
                >
                  <option value="">전체 대영역</option>
                  <option>Investment</option>
                  <option>Winning R&D</option>
                  <option>AX</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="dueDate">Due Date 순</option>
                  <option value="priority">Priority 순</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">회의체</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">대영역</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">소영역</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">지시사항</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">담당자</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">등록일</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAndSortedDirectives.map((directive) => {
                      const overdue = isOverdue(directive.dueDate, directive.status);
                      const dueSoon = isDueSoon(directive.dueDate, directive.status);
                      
                      return (
                        <tr
                          key={directive.id}
                          className={`hover:bg-gray-50 cursor-pointer ${overdue ? 'bg-red-50' : dueSoon ? 'bg-orange-50' : ''}`}
                          onClick={() => setSelectedDirective(directive)}
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{directive.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{directive.meeting}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{directive.largeCategory}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <div className="w-32 truncate" title={directive.smallCategory}>
                              {directive.smallCategory}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={priorityColors[directive.priority]}>{directive.priority}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{directive.content}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{directive.assignee}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{directive.registeredDate}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              {overdue && <AlertCircle size={16} className="text-red-600" />}
                              {dueSoon && <Clock size={16} className="text-orange-600" />}
                              <span className={overdue ? 'text-red-600 font-semibold' : dueSoon ? 'text-orange-600' : ''}>
                                {directive.dueDate}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${statusColors[directive.status]}`}>
                              {directive.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </main>

          {showAddModal && <AddDirectiveModal />}
          {selectedDirective && <DirectiveDetailModal directive={selectedDirective} />}
        </>
      )}
    </div>
  );
};

export default DirectiveManagementSystem;