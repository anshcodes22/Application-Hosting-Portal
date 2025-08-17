
import React, { useState } from 'react';
import { Building2, Users, FileText, History, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'reviewer' | 'hod' | 'dtg' | 'cdt' | 'hosting' | 'admin';
}

interface ApplicationStatus {
  id: string;
  appName: string;
  currentStage: 'developer' | 'reviewer' | 'hod' | 'dtg' | 'cdt' | 'hosting';
  currentApprover: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'hosted';
  lastUpdated: string;
}

interface AuditTrail {
  id: string;
  appName: string;
  actionTaken: 'approved' | 'rejected' | 'escalated' | 'hosted';
  by: string;
  dateTime: string;
  remarks?: string;
}

interface ModalData {
  isOpen: boolean;
  type: 'add' | 'edit' | null;
  user?: User;
}

// Mock data
const mockUsers: User[] = [
  { id: '1', name: 'John Developer', email: 'developer@bhel.com', role: 'developer' },
  { id: '2', name: 'Jane Reviewer', email: 'reviewer@bhel.com', role: 'reviewer' },
  { id: '3', name: 'Dr. Sarah Johnson', email: 'hod@bhel.com', role: 'hod' },
  { id: '4', name: 'Mike DTG', email: 'dtg@bhel.com', role: 'dtg' },
  { id: '5', name: 'Alex CDT', email: 'cdt@bhel.com', role: 'cdt' },
  { id: '6', name: 'Sam Hosting', email: 'hosting@bhel.com', role: 'hosting' },
  { id: '7', name: 'Admin User', email: 'admin@bhel.com', role: 'admin' },
];

const mockApplicationStatus: ApplicationStatus[] = [
  {
    id: '1',
    appName: 'Employee Portal v2.1',
    currentStage: 'hod',
    currentApprover: 'Dr. Sarah Johnson',
    status: 'pending',
    lastUpdated: '2024-01-15 10:30 AM'
  },
  {
    id: '2',
    appName: 'Customer Support Dashboard',
    currentStage: 'cdt',
    currentApprover: 'Alex CDT',
    status: 'pending',
    lastUpdated: '2024-01-14 02:15 PM'
  },
  {
    id: '3',
    appName: 'Financial Reporting Tool',
    currentStage: 'hosting',
    currentApprover: 'Sam Hosting',
    status: 'approved',
    lastUpdated: '2024-01-13 09:45 AM'
  },
  {
    id: '4',
    appName: 'Inventory Management System',
    currentStage: 'hosting',
    currentApprover: 'Sam Hosting',
    status: 'hosted',
    lastUpdated: '2024-01-12 11:20 AM'
  }
];

const mockAuditTrail: AuditTrail[] = [
  {
    id: '1',
    appName: 'Employee Portal v2.1',
    actionTaken: 'approved',
    by: 'Reviewer - Jane Reviewer',
    dateTime: '2024-01-15 10:30 AM',
    remarks: 'All checklist items completed'
  },
  {
    id: '2',
    appName: 'Customer Support Dashboard',
    actionTaken: 'escalated',
    by: 'HOD - Dr. Sarah Johnson',
    dateTime: '2024-01-14 02:15 PM',
    remarks: 'Additional security review required'
  },
  {
    id: '3',
    appName: 'Financial Reporting Tool',
    actionTaken: 'approved',
    by: 'CDT - Alex CDT',
    dateTime: '2024-01-13 09:45 AM'
  },
  {
    id: '4',
    appName: 'Inventory Management System',
    actionTaken: 'hosted',
    by: 'Hosting - Sam Hosting',
    dateTime: '2024-01-12 11:20 AM'
  }
];

type TabType = 'users' | 'applications' | 'audit';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [applications, setApplications] = useState<ApplicationStatus[]>(mockApplicationStatus);
  const [auditTrail, setAuditTrail] = useState<AuditTrail[]>(mockAuditTrail);
  const [modalData, setModalData] = useState<ModalData>({ isOpen: false, type: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form state for user modal
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'developer' as User['role']
  });

  const getStatusBadge = (status: ApplicationStatus['status']) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'escalated':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'hosted':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getActionBadge = (action: AuditTrail['actionTaken']) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (action) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'escalated':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'hosted':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleAddUser = () => {
    setModalData({ isOpen: true, type: 'add' });
    setUserForm({ name: '', email: '', password: '', role: 'developer' });
  };

  const handleEditUser = (user: User) => {
    setModalData({ isOpen: true, type: 'edit', user });
    setUserForm({ name: user.name, email: user.email, password: '', role: user.role });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      console.log('Admin Action:', {
        action: 'delete_user',
        userId,
        userName,
        timestamp: new Date().toISOString(),
        adminEmail: 'admin@bhel.com'
      });
    }
  };

  const handleModalClose = () => {
    setModalData({ isOpen: false, type: null });
    setUserForm({ name: '', email: '', password: '', role: 'developer' });
  };

  const handleUserSubmit = () => {
    if (!userForm.name || !userForm.email || (!modalData.user && !userForm.password)) {
      alert('Please fill in all required fields');
      return;
    }

    if (modalData.type === 'add') {
      const newUser: User = {
        id: Date.now().toString(),
        name: userForm.name,
        email: userForm.email,
        role: userForm.role
      };
      setUsers(prev => [...prev, newUser]);
      console.log('Admin Action:', {
        action: 'add_user',
        user: newUser,
        timestamp: new Date().toISOString(),
        adminEmail: 'admin@bhel.com'
      });
    } else if (modalData.type === 'edit' && modalData.user) {
      setUsers(prev => prev.map(user => 
        user.id === modalData.user!.id 
          ? { ...user, name: userForm.name, email: userForm.email, role: userForm.role }
          : user
      ));
      console.log('Admin Action:', {
        action: 'edit_user',
        userId: modalData.user.id,
        changes: { name: userForm.name, email: userForm.email, role: userForm.role },
        timestamp: new Date().toISOString(),
        adminEmail: 'admin@bhel.com'
      });
    }

    handleModalClose();
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.appName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || app.currentStage === filterStage;
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStage && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage users, applications, and audit trail</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'users' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management</span>
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'applications' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Global Application Status</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'audit' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Trail</span>
          </button>
        </div>

        {/* User Management Section */}
        {activeTab === 'users' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
              <Button onClick={handleAddUser} icon={Plus}>
                Add User
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEditUser(user)}
                            icon={Edit}
                          >
                            Edit Role
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            icon={Trash2}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Global Application Status Section */}
        {activeTab === 'applications' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Global Application Status</h2>
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Stages</option>
                  <option value="developer">Developer</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="hod">HOD</option>
                  <option value="dtg">DTG</option>
                  <option value="cdt">CDT</option>
                  <option value="hosting">Hosting</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="escalated">Escalated</option>
                  <option value="hosted">Hosted</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">App Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Current Stage</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Current Approver</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{app.appName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {app.currentStage}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{app.currentApprover}</td>
                      <td className="py-3 px-4">
                        <span className={getStatusBadge(app.status)}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{app.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Audit Trail Section */}
        {activeTab === 'audit' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Audit Trail</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">App Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Action Taken</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">By</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date/Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {auditTrail.map((audit) => (
                    <tr key={audit.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{audit.appName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={getActionBadge(audit.actionTaken)}>
                          {audit.actionTaken}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{audit.by}</td>
                      <td className="py-3 px-4 text-gray-600">{audit.dateTime}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {audit.remarks || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* User Modal */}
      <Modal
        isOpen={modalData.isOpen}
        onClose={handleModalClose}
        title={modalData.type === 'add' ? 'Add New User' : 'Edit User'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userForm.name}
              onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>
          
          {modalData.type === 'add' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={userForm.role}
              onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value as User['role'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="developer">Developer</option>
              <option value="reviewer">Reviewer</option>
              <option value="hod">HOD</option>
              <option value="dtg">DTG</option>
              <option value="cdt">CDT</option>
              <option value="hosting">Hosting</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="primary"
              onClick={handleUserSubmit}
              className="flex-1"
            >
              {modalData.type === 'add' ? 'Add User' : 'Update User'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleModalClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}; 