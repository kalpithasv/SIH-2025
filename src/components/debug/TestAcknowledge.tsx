import React, { useState } from 'react';
import { AcknowledgeModal } from '../ui/AcknowledgeModal';
import { Button } from '../ui/Button';
import apiService from '../../services/api';

export const TestAcknowledge: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestAcknowledge = async (comment: string, action: 'acknowledge' | 'resolve' | 'false_alarm' = 'acknowledge') => {
    console.log('🧪 Test Acknowledge called with:', { comment, action });
    
    setIsLoading(true);
    try {
      // Test with a known SOS ID or use a dummy one for debugging
      const testSosId = 'cmfi8ksql0003be20hz2mohra'; // Use a real SOS ID from your system
      
      console.log('🧪 About to call API with:', { testSosId, comment, action });
      
      switch (action) {
        case 'acknowledge':
          await apiService.acknowledgeSosRequest(testSosId, comment);
          break;
        case 'resolve':
          await apiService.resolveSosRequest(testSosId, comment);
          break;
        case 'false_alarm':
          await apiService.markSosAsFalseAlarm(testSosId, comment);
          break;
      }
      
      console.log('🧪 API call completed successfully');
      setModalOpen(false);
      
    } catch (error) {
      console.error('🧪 Test acknowledge failed:', error);
      alert(`Test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
      <h3 className="font-bold text-yellow-800 mb-2">🧪 Debug: Test Acknowledge Functionality</h3>
      <p className="text-sm text-yellow-700 mb-3">
        This component tests the acknowledge workflow. Click the button to open the modal and test the API call.
      </p>
      
      <Button onClick={() => setModalOpen(true)}>
        Test Acknowledge Modal
      </Button>
      
      <AcknowledgeModal
        isOpen={modalOpen}
        alertType="SOS"
        alertTitle="Test SOS Alert - Security Incident"
        onConfirm={handleTestAcknowledge}
        onCancel={() => setModalOpen(false)}
        isLoading={isLoading}
      />
    </div>
  );
};