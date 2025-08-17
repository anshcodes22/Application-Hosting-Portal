import React, { useState } from 'react';
import { Building2, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

interface PendingApproval {
  id: string;
  appName: string;
  reviewerName: string;
  submissionDate: string;
  checklistStatus: 'complete' | 'partial' | 'incomplete';
}

interface ModalData {
  isOpen: boolean;
  action: 'approve' | 'escalate' | null;
  approvalId: string | null;
  appName: string;
}

// Mock data for pending approvals
const mockPendingApprovals: PendingApproval[] = [
  {
    id: '1',
    appName: 'Employee Portal v2.1',
    reviewerName: 'John Smith',
    submissionDate: '2024-01-15',
    checklistStatus: 'complete'
  },
  {
    id: '2',
    appName: 'Inventory Management System',
    reviewerName: 'Sarah Johnson',
    submissionDate: '2024-01-14',
    checklistStatus: 'partial'
  },
  {
    id: '3',
    appName: 'Customer Support Dashboard',
    reviewerName: 'Mike Wilson',
    submissionDate: '2024-01-13',
    checklistStatus: 'incomplete'
  },
  {
    id: '4',
    appName: 'Financial Reporting Tool',
    reviewerName: 'Emily Davis',
    submissionDate: '2024-01-12',
    checklistStatus: 'complete'
  },
  {
    id: '5',
    appName: 'HR Management System',
    reviewerName: 'David Brown',
    submissionDate: '2024-01-11',
    checklistStatus: 'partial'
  }
];

export const HODDashboard: React.FC = () => {
  const [approvals, setApprovals] = useState<PendingApproval[]>(mockPendingApprovals);
  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    action: null,
    approvalId: null,
    appName: ''
  });
  const [remarks, setRemarks] = useState('');

  const getChecklistStatusBadge = (status: PendingApproval['checklistStatus']) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'complete':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'partial':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'incomplete':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getChecklistStatusIcon = (status: PendingApproval['checklistStatus']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'partial':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'incomplete':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleActionClick = (action: 'approve' | 'escalate', approvalId: string, appName: string) => {
    setModalData({
      isOpen: true,
      action,
      approvalId,
      appName
    });
    setRemarks('');
  };

  const handleModalClose = () => {
    setModalData({
      isOpen: false,
      action: null,
      approvalId: null,
      appName: ''
    });
    setRemarks('');
  };

  const handleConfirmAction = () => {
    const { action, approvalId, appName } = modalData;
    
    // Log the action to console (replace with API call later)
    console.log('HOD Action:', {
      action,
      approvalId,
      appName,
      remarks: remarks.trim(),
      timestamp: new Date().toISOString(),
      hodEmail: 'hod@bhel.com' // This would come from auth context
    });

    // Remove the approval from the list (simulate processing)
    setApprovals((prev: PendingApproval[]) => prev.filter((approval: PendingApproval) => approval.id !== approvalId));
    
    // Show success message
    const actionText = action === 'approve' ? 'approved' : 'escalated';
    alert(`Application "${appName}" has been ${actionText} successfully!`);
    
    // Close modal
    handleModalClose();
  };

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
              <h1 className="text-xl font-bold text-gray-900">HOD Dashboard</h1>
              <p className="text-sm text-gray-600">Review and approve pending applications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{approvals.length}</h3>
            <p className="text-sm text-gray-600">Pending Approvals</p>
          </Card>
          
          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {approvals.filter(a => a.checklistStatus === 'complete').length}
            </h3>
            <p className="text-sm text-gray-600">Complete Reviews</p>
          </Card>
          
          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {approvals.filter(a => a.checklistStatus !== 'complete').length}
            </h3>
            <p className="text-sm text-gray-600">Incomplete Reviews</p>
          </Card>
        </div>

        {/* Pending Approvals Table */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">App Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Reviewer Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Submission Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Checklist Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvals.map((approval) => (
                  <tr key={approval.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{approval.appName}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{approval.reviewerName}</td>
                    <td className="py-3 px-4 text-gray-600">{approval.submissionDate}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getChecklistStatusIcon(approval.checklistStatus)}
                        <span className={getChecklistStatusBadge(approval.checklistStatus)}>
                          {approval.checklistStatus.charAt(0).toUpperCase() + approval.checklistStatus.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleActionClick('approve', approval.id, approval.appName)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleActionClick('escalate', approval.id, approval.appName)}
                        >
                          Escalate
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {approvals.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No pending approvals to review</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={modalData.isOpen}
        onClose={handleModalClose}
        title={`${modalData.action === 'approve' ? 'Approve' : 'Escalate'} Application`}
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              You are about to <strong>{modalData.action}</strong> the application:
            </p>
            <p className="font-medium text-gray-900">{modalData.appName}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks (Optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={`Enter ${modalData.action === 'approve' ? 'approval' : 'escalation'} remarks...`}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant={modalData.action === 'approve' ? 'success' : 'danger'}
              onClick={handleConfirmAction}
              className="flex-1"
              icon={modalData.action === 'approve' ? CheckCircle : AlertTriangle}
            >
              Confirm {modalData.action === 'approve' ? 'Approval' : 'Escalation'}
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