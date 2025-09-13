import React, { useState } from 'react';
import { X, MessageSquare, AlertCircle } from 'lucide-react';

interface AcknowledgeModalProps {
  isOpen: boolean;
  alertType: 'SOS' | 'Community Report';
  alertTitle: string;
  onConfirm: (comment: string, action?: 'acknowledge' | 'resolve' | 'false_alarm') => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AcknowledgeModal: React.FC<AcknowledgeModalProps> = ({
  isOpen,
  alertType,
  alertTitle,
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  const [comment, setComment] = useState('');
  const [selectedAction, setSelectedAction] = useState<'acknowledge' | 'resolve' | 'false_alarm'>('acknowledge');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    console.log('📝 AcknowledgeModal: Form submitted');
    console.log('📝 AcknowledgeModal: Data:', { comment: comment.trim(), selectedAction });
    
    e.preventDefault();
    
    if (comment.trim()) {
      console.log('📝 AcknowledgeModal: Calling onConfirm with:', { comment: comment.trim(), selectedAction });
      onConfirm(comment.trim(), selectedAction);
    } else {
      console.log('⚠️ AcknowledgeModal: Comment is empty, not submitting');
    }
  };

  const handleCancel = () => {
    setComment('');
    setSelectedAction('acknowledge');
    onCancel();
  };

  const getActionInfo = () => {
    switch (selectedAction) {
      case 'acknowledge':
        return {
          title: 'Acknowledge',
          description: 'Admin acknowledges - emergency response will be dispatched',
          buttonText: 'Acknowledge SOS',
          buttonColor: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
        };
      case 'resolve':
        return {
          title: 'Mark as Resolved',
          description: 'Emergency is resolved - help has arrived safely',
          buttonText: 'Mark as Resolved',
          buttonColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        };
      case 'false_alarm':
        return {
          title: 'Mark as False Alarm',
          description: 'This was not a real emergency situation',
          buttonText: 'Mark as False Alarm',
          buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
    }
  };

  const actionInfo = getActionInfo();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {actionInfo.title} {alertType}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {alertTitle}
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Action Selection - only for SOS alerts */}
          {alertType === 'SOS' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Action to Take
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="action"
                    value="acknowledge"
                    checked={selectedAction === 'acknowledge'}
                    onChange={(e) => setSelectedAction(e.target.value as any)}
                    className="mr-2"
                    disabled={isLoading}
                  />
                  <span className="text-sm">Acknowledge - Admin response dispatched</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="action"
                    value="resolve"
                    checked={selectedAction === 'resolve'}
                    onChange={(e) => setSelectedAction(e.target.value as any)}
                    className="mr-2"
                    disabled={isLoading}
                  />
                  <span className="text-sm">Resolved - Emergency handled successfully</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="action"
                    value="false_alarm"
                    checked={selectedAction === 'false_alarm'}
                    onChange={(e) => setSelectedAction(e.target.value as any)}
                    className="mr-2"
                    disabled={isLoading}
                  />
                  <span className="text-sm">False Alarm - Not a real emergency</span>
                </label>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {actionInfo.description}
              </p>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="comment" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="h-4 w-4 mr-2" />
              Admin Comment *
            </label>
            <textarea
              id="comment"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter your comment about this acknowledgment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isLoading}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              This comment will be recorded for audit purposes.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${actionInfo.buttonColor}`}
              disabled={isLoading || !comment.trim()}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                actionInfo.buttonText
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};