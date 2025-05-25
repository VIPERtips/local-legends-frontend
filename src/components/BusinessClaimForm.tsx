
import React, { useState } from 'react';
import { apiService } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';
import { Building2 } from 'lucide-react';

interface BusinessClaimFormProps {
  businessId: number;
  businessName: string;
  onClaimSubmitted?: () => void;
}

const BusinessClaimForm: React.FC<BusinessClaimFormProps> = ({
  businessId,
  businessName,
  onClaimSubmitted
}) => {
  const [evidence, setEvidence] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const { toast } = useToast();

  const handleSubmitClaim = async () => {
    if (!evidence.trim()) {
      toast({
        title: "Evidence Required",
        description: "Please provide evidence of your ownership of this business",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await apiService.submitClaim(businessId, evidence);
      toast({
        title: "Claim Submitted",
        description: "Your ownership claim has been submitted for review",
      });
      setClaimed(true);
      setEvidence('');
      onClaimSubmitted?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit claim",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (claimed) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Claim Submitted Successfully
            </h3>
            <p className="text-green-700">
              Your ownership claim for {businessName} has been submitted and is under review.
              You will be notified once the claim is processed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>Claim This Business</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Are you the owner of {businessName}? Claim your business to manage its information
          and respond to reviews.
        </p>
        
        <div>
          <Label htmlFor="evidence">Evidence of Ownership</Label>
          <Textarea
            id="evidence"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Please provide evidence that you own this business (e.g., business license, tax documents, official email from business domain, etc.)"
            rows={4}
          />
        </div>

        <Button
          onClick={handleSubmitClaim}
          disabled={submitting || !evidence.trim()}
          className="w-full"
        >
          {submitting ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Submitting Claim...</span>
            </>
          ) : (
            'Submit Ownership Claim'
          )}
        </Button>

        <p className="text-xs text-gray-500">
          Claims are reviewed by our team and may take 2-3 business days to process.
          False claims may result in account suspension.
        </p>
      </CardContent>
    </Card>
  );
};

export default BusinessClaimForm;
