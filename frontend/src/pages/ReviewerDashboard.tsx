import React, { useState } from 'react';
import { Building2, CheckCircle, XCircle, Clock} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

interface PendingSubmission {
  id: string;
  appName: string;
  developerName: string;
  submissionDate: string;
  checklistStatus: 'complete' | 'partial' | 'incomplete';
  checklistItems: {
    secureGuidelines: boolean;
    peerReview: boolean;
    passwordPolicy: boolean;
    firewallPolicy: boolean;
    ptReport: boolean;
    auditTrail: boolean;
  };
}

interface ModalData {
  isOpen: boolean;
  action: 'approve' | 'reject' | null;
  submissionId: string | null;
  appName: string;
}

// Mock data for pending submissions
const mockPendingSubmissions: PendingSubmission[] = [
  {
    id: '1',
    appName: 'Employee Portal',
    developerName: 'Devanshi',
    submissionDate: '2025-08-13',
    checklistStatus: 'complete',
    checklistItems: {
      secureGuidelines: true,
      peerReview: true,
      passwordPolicy: true,
      firewallPolicy: true,
      ptReport: true,
      auditTrail: true
    }
  },
  {
    id: '2',
    appName: 'Library Management System',
    developerName: 'Ansh',
    submissionDate: '2025-08-13',
    checklistStatus: 'partial',
    checklistItems: {
      secureGuidelines: true,
      peerReview: true,
      passwordPolicy: true,
      firewallPolicy: false,
      ptReport: true,
      auditTrail: false
    }
  }
];

export const ReviewerDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<PendingSubmission[]>(mockPendingSubmissions);
  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    action: null,
    submissionId: null,
    appName: ''
  });
  const [remarks, setRemarks] = useState('');

  const getChecklistStatusBadge = (status: PendingSubmission['checklistStatus']) => {
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

  const getChecklistStatusIcon = (status: PendingSubmission['checklistStatus']) => {
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

  const getCompletedItemsCount = (checklistItems: PendingSubmission['checklistItems']) => {
    return Object.values(checklistItems).filter(Boolean).length;
  };

  const handleActionClick = (action: 'approve' | 'reject', submissionId: string, appName: string) => {
    setModalData({
      isOpen: true,
      action,
      submissionId,
      appName
    });
    setRemarks('');
  };

  const handleModalClose = () => {
    setModalData({
      isOpen: false,
      action: null,
      submissionId: null,
      appName: ''
    });
    setRemarks('');
  };

  const handleConfirmAction = () => {
    const { action, submissionId, appName } = modalData;
    
    // Log the action to console (replace with API call later)
    console.log('Reviewer Action:', {
      action,
      submissionId,
      appName,
      remarks: remarks.trim(),
      timestamp: new Date().toISOString(),
      reviewerEmail: 'reviewer@bhel.com' // This would come from auth context
    });

    // Remove the submission from the list (simulate processing)
    setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
    
    // Show success message
    alert(`Application "${appName}" has been ${action}d successfully!`);
    
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
              <h1 className="text-xl font-bold text-gray-900">BHEL Reviewer Dashboard</h1>
              <p className="text-sm text-gray-600">Review and approve application submissions</p>
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
            <h3 className="text-2xl font-bold text-gray-900">{submissions.length}</h3>
            <p className="text-sm text-gray-600">Pending Reviews</p>
          </Card>
          
          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {submissions.filter(s => s.checklistStatus === 'complete').length}
            </h3>
            <p className="text-sm text-gray-600">Complete Checklists</p>
          </Card>
          
          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-3">
              <XCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {submissions.filter(s => s.checklistStatus !== 'complete').length}
            </h3>
            <p className="text-sm text-gray-600">Incomplete Checklists</p>
          </Card>
        </div>

        {/* Pending Submissions Table */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Pending Submissions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">App Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Developer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Checklist Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{submission.appName}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{submission.developerName}</td>
                    <td className="py-3 px-4 text-gray-600">{submission.submissionDate}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getChecklistStatusIcon(submission.checklistStatus)}
                        <span className={getChecklistStatusBadge(submission.checklistStatus)}>
                          {getCompletedItemsCount(submission.checklistItems)}/6 Complete
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleActionClick('approve', submission.id, submission.appName)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleActionClick('reject', submission.id, submission.appName)}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {submissions.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No pending submissions to review</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={modalData.isOpen}
        onClose={handleModalClose}
        title={`${modalData.action === 'approve' ? 'Approve' : 'Reject'} Application`}
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
              placeholder={`Enter ${modalData.action === 'approve' ? 'approval' : 'rejection'} remarks...`}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant={modalData.action === 'approve' ? 'success' : 'danger'}
              onClick={handleConfirmAction}
              className="flex-1"
              icon={modalData.action === 'approve' ? CheckCircle : XCircle}
            >
              Confirm {modalData.action === 'approve' ? 'Approval' : 'Rejection'}
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