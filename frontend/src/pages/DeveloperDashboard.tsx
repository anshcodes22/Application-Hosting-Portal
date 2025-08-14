import React, { useState } from 'react';
import { Building2, Send, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileDropZone } from '../components/FileDropZone';

interface FormData {
  warFile: File | null;
  checklist: {
    secureGuidelines: boolean;
    peerReview: boolean;
    passwordPolicy: boolean;
    firewallPolicy: boolean;
    ptReport: boolean;
    auditTrail: boolean;
  };
  internetFacing: 'yes' | 'no' | '';
}

interface Submission {
  id: string;
  appName: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
}

const checklistItems = [
  { key: 'secureGuidelines', label: 'Secure Software Development Guidelines' },
  { key: 'peerReview', label: 'Peer Code Review' },
  { key: 'passwordPolicy', label: 'Password Policy Compliance' },
  { key: 'firewallPolicy', label: 'Firewall Policy Compliance' },
  { key: 'ptReport', label: 'PT Report (Penetration Test)' },
  { key: 'auditTrail', label: 'Audit Trail Enabled' }
];

export const DeveloperDashboard: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    warFile: null,
    checklist: {
      secureGuidelines: false,
      peerReview: false,
      passwordPolicy: false,
      firewallPolicy: false,
      ptReport: false,
      auditTrail: false
    },
    internetFacing: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const handleFileSelect = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      warFile: file
    }));
  };

  const handleChecklistChange = (key: keyof FormData['checklist']) => {
    setFormData(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [key]: !prev.checklist[key]
      }
    }));
  };

  const handleInternetFacingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      internetFacing: e.target.value as 'yes' | 'no' | ''
    }));
  };

  const getStatusIcon = (status: Submission['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'under-review':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: Submission['status']) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'under-review':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.warFile) {
      alert('Please upload a WAR file');
      return;
    }
    
    if (!formData.internetFacing) {
      alert('Please select if the application is internet facing');
      return;
    }
    
    const checkedItems = Object.values(formData.checklist).filter(Boolean).length;
    if (checkedItems === 0) {
      alert('Please complete at least one checklist item');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newSubmission: Submission = {
        id: Date.now().toString(),
        appName: formData.warFile?.name?.replace('.war', '') || 'New Application',
        date: new Date().toLocaleDateString(),
        status: 'pending'
      };
      
      setSubmissions(prev => [newSubmission, ...prev]);
      
      console.log('Form submission data:', {
        fileName: formData.warFile?.name,
        fileSize: formData.warFile?.size,
        checklist: formData.checklist,
        internetFacing: formData.internetFacing,
        timestamp: new Date().toISOString()
      });
      
      alert('Application submitted successfully!');
      
      // Reset form
      setFormData({
        warFile: null,
        checklist: {
          secureGuidelines: false,
          peerReview: false,
          passwordPolicy: false,
          firewallPolicy: false,
          ptReport: false,
          auditTrail: false
        },
        internetFacing: ''
      });
      
      setIsSubmitting(false);
    }, 2000);
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
              <h1 className="text-xl font-bold text-gray-900">BHEL Developer Dashboard</h1>
              <p className="text-sm text-gray-600">Submit applications for hosting approval</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submission Form */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">New Application Submission</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* WAR File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WAR File Upload <span className="text-red-500">*</span>
                  </label>
                  <FileDropZone
                    onFileSelect={handleFileSelect}
                    selectedFile={formData.warFile}
                    accept=".war"
                  />
                </div>

                {/* Checklist */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Compliance Checklist
                  </label>
                  <div className="space-y-3">
                    {checklistItems.map((item) => (
                      <label key={item.key} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.checklist[item.key as keyof FormData['checklist']]}
                          onChange={() => handleChecklistChange(item.key as keyof FormData['checklist'])}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Internet Facing Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Internet Facing? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.internetFacing}
                    onChange={handleInternetFacingChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  icon={Send}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Recent Submissions */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Submissions</h2>
              <div className="space-y-3">
                {submissions.length > 0 ? (
                  submissions.slice(0, 3).map((submission) => (
                    <div key={submission.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {getStatusIcon(submission.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {submission.appName}
                        </p>
                        <p className="text-xs text-gray-500">{submission.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent submissions</p>
                    <p className="text-xs text-gray-400">Submit your first application to see it here</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* All Submissions Table */}
        <div className="mt-8">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">All Submissions</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">App Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.length > 0 ? (
                    submissions.map((submission) => (
                      <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{submission.appName}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{submission.date}</td>
                        <td className="py-3 px-4">
                          <span className={getStatusBadge(submission.status)}>
                            {submission.status.replace('-', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center">
                        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No submissions to display</p>
                        <p className="text-sm text-gray-400">Submit your first application to see it here</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};