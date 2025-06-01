
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Business } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Trash2, Save, ArrowLeft, Building2 } from 'lucide-react';

const AdminBusinessesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: ''
  });

  useEffect(() => {
    if (id) {
      fetchBusiness();
    }
  }, [id]);

  const fetchBusiness = async () => {
    try {
      const response = await apiService.getBusiness(Number(id));
      // Handle the correct response structure
      const businessData = response;
      setBusiness(businessData);
      setFormData({
        name: businessData.name,
        description: businessData.description,
        category: businessData.category,
        address: businessData.address,
        city: businessData.city,
        state: businessData.state,
        zipCode: businessData.zipCode,
        phone: businessData.phone,
        email: businessData.email,
        website: businessData.website || ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load business details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await apiService.updateBusiness(Number(id), formData);
      toast({
        title: "Success! 🎉",
        description: "Business updated successfully",
      });
      fetchBusiness();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('⚠️ Are you sure you want to delete this business? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await apiService.deleteBusiness(Number(id));
      toast({
        title: "Success",
        description: "Business deleted successfully",
      });
      navigate('/businesses');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete business",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading business details...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="text-center p-8 shadow-xl border-0">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Business not found</h2>
          <p className="text-gray-600 mb-4">The business you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/businesses')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Businesses
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => navigate('/businesses')} 
            variant="outline" 
            className="mb-4 border-2 border-purple-200 hover:border-purple-400"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Businesses
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Manage Business
          </h1>
          <p className="text-gray-600">Update or delete business information</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-3">
              <Building2 className="h-6 w-6" />
              <span>Business Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-gray-700 font-semibold">Business Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-gray-700 font-semibold">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-700 font-semibold">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="border-2 border-purple-200 focus:border-purple-400 rounded-lg resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="address" className="text-gray-700 font-semibold">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-gray-700 font-semibold">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="state" className="text-gray-700 font-semibold">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-gray-700 font-semibold">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone" className="text-gray-700 font-semibold">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700 font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website" className="text-gray-700 font-semibold">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
                className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
              />
            </div>

            <div className="flex justify-between pt-6 border-t-2 border-gray-100">
              <Button
                onClick={handleDelete}
                disabled={deleting}
                variant="destructive"
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
              >
                {deleting ? <LoadingSpinner size="sm" /> : <Trash2 className="h-4 w-4" />}
                <span>{deleting ? 'Deleting...' : 'Delete Business'}</span>
              </Button>
              
              <Button
                onClick={handleUpdate}
                disabled={saving}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
              >
                {saving ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminBusinessesPage;
