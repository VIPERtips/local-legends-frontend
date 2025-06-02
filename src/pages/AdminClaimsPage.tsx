
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { BusinessClaim } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const AdminClaimsPage: React.FC = () => {
  const [claims, setClaims] = useState<BusinessClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingClaim, setProcessingClaim] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchClaims = async () => {
    try {
      const response = await apiService.getClaims();
      console.log("admin",response.data.content)
      setClaims(response.data.content);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load claims",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleClaimAction = async (claimId: number, status: 'APPROVED' | 'REJECTED') => {
    setProcessingClaim(claimId);
    try {
      await apiService.updateClaimStatus(claimId, status);
      
      toast({
        title: "Success",
        description: `Claim ${status.toLowerCase()} successfully`,
      });
      
      fetchClaims(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${status.toLowerCase()} claim`,
        variant: "destructive",
      });
    } finally {
      setProcessingClaim(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING': return 'secondary';
      case 'APPROVED': return 'default';
      case 'REJECTED': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-appBg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-appBg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-appText mb-2">Business Claims</h1>
          <p className="text-gray-600">
            Review and manage business ownership claims from users.
          </p>
        </div>

        {claims.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No claims to review</p>
            <p className="text-gray-500 mt-2">All caught up!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {claims.map((claim) => (
              <Card key={claim.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-primary">
                        {claim.business.name}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">
                        Claimed by: {claim.userEmail}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted: {new Date(claim.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(claim.status)}>
                      {claim.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-appText mb-2">Business Details</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">Category:</span> {claim.business.category}</p>
                        <p><span className="font-medium">Location:</span> {claim.business.city}, {claim.business.state}</p>
                        <p><span className="font-medium">Phone:</span> {claim.business.phone}</p>
                        <p><span className="font-medium">Email:</span> {claim.business.email}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-appText mb-2">Evidence Provided</h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {claim.evidence}
                        </p>
                      </div>
                    </div>
                  </div>

                  {claim.status === 'PENDING' && (
                    <div className="flex space-x-4 mt-6 pt-4 border-t">
                      <Button
                        onClick={() => handleClaimAction(claim.id, 'APPROVED')}
                        disabled={processingClaim === claim.id}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {processingClaim === claim.id ? <LoadingSpinner size="sm" /> : 'Approve'}
                      </Button>
                      <Button
                        onClick={() => handleClaimAction(claim.id, 'REJECTED')}
                        disabled={processingClaim === claim.id}
                        variant="destructive"
                      >
                        {processingClaim === claim.id ? <LoadingSpinner size="sm" /> : 'Reject'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClaimsPage;
