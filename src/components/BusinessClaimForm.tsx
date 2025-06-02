
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';
import { Building2, Shield, CheckCircle, Clock, XCircle } from 'lucide-react';

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
  const [existingClaim, setExistingClaim] = useState<any>(null);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchExistingClaims();
  }, [businessId]);

  const fetchExistingClaims = async () => {
    try {
      setLoadingClaims(true);
      const claims = await apiService.getClaims();
      const businessClaim = claims?.data?.content?.find((claim: any) => claim.id === businessId);
      console.log(businessClaim)
      setExistingClaim(businessClaim);
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoadingClaims(false);
    }
  };

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
      fetchExistingClaims();
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


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4 mr-1" />
            Approved
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-4 w-4 mr-1" />
            Rejected
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-4 w-4 mr-1" />
            Under Review
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loadingClaims) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-8 text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Checking claim status...</p>
        </CardContent>
      </Card>
    );
  }

  // Show existing claim status
  if (existingClaim) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Shield className="h-6 w-6" />
              </div>
              <span className="text-xl">Business Claim Status</span>
            </div>
            {getStatusBadge(existingClaim.status)}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div className="flex items-start">
                <Building2 className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-blue-800 font-medium">
                    Your claim for <span className="font-bold">{businessName}</span>
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    Status: <strong>{existingClaim.status}</strong>
                  </p>
                  <p className="text-blue-600 text-xs mt-2">
                    Submitted: {new Date(existingClaim.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {existingClaim.status === 'PENDING' && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-yellow-800">
                  <strong>⏰ Under Review:</strong> Your claim is being processed by our team. 
                  You will be notified once the review is complete.
                </p>
              </div>
            )}

            {existingClaim.status === 'APPROVED' && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-green-800">
                  <strong>🎉 Congratulations!</strong> Your business claim has been approved. 
                  You can now manage your business profile.
                </p>
              </div>
            )}

            {existingClaim.status === 'REJECTED' && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-800">
                  <strong>❌ Claim Rejected:</strong> Your claim was not approved. 
                  Please contact support if you believe this is an error.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

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
