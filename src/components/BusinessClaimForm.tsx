
import React, { useState } from 'react';
import { apiService } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';
import { Building2, Shield, CheckCircle } from 'lucide-react';

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
        title: "Claim Submitted Successfully! 🎉",
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
      <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="pt-8 pb-6">
          <div className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-3">
              🎉 Claim Submitted Successfully!
            </h3>
            <p className="text-green-700 leading-relaxed">
              Your ownership claim for <span className="font-semibold">{businessName}</span> has been submitted and is under review.
              You will be notified once the claim is processed.
            </p>
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="text-sm text-green-600">
                ⏰ <strong>Processing Time:</strong> 2-3 business days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xl">Claim This Business</span>
            <p className="text-blue-100 text-sm font-normal mt-1">
              Verify your ownership to manage your business profile
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex items-start">
            <Building2 className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <p className="text-blue-800 font-medium">
                Are you the owner of <span className="font-bold">{businessName}</span>?
              </p>
              <p className="text-blue-700 text-sm mt-1">
                Claim your business to manage information, respond to reviews, and build trust with customers.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="evidence" className="text-gray-700 font-semibold flex items-center gap-2">
            📋 Evidence of Ownership
          </Label>
          <Textarea
            id="evidence"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Please provide detailed evidence that you own this business. Examples:
• Business license or registration documents
• Tax identification documents  
• Official business email verification
• Business bank account information
• Photos of business premises with signage
• Any other official documentation"
            rows={6}
            className="border-2 border-blue-200 focus:border-blue-400 rounded-lg resize-none"
          />
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            💡 <strong>Tip:</strong> The more detailed evidence you provide, the faster we can process your claim.
          </div>
        </div>

        <Button
          onClick={handleSubmitClaim}
          disabled={submitting || !evidence.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          {submitting ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2">Submitting Claim...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Shield className="h-5 w-5 mr-2" />
              Submit Ownership Claim
            </div>
          )}
        </Button>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>⚠️ Important:</strong> Claims are reviewed by our team and may take 2-3 business days to process.
            False claims may result in account suspension. All submissions are logged and verified.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessClaimForm;
