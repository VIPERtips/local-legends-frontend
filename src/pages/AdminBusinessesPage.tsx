
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
import { Trash2, Save } from 'lucide-react';

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
      const businessData = response.data;
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
        title: "Success",
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
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await apiService.deleteBusiness(Number(id));
      toast({
        title: "Success",
        description: "Business deleted successfully",
      });
      navigate('/admin/businesses');
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
      <div className="min-h-screen bg-appBg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-appBg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-appText mb-2">Business not found</h2>
          <p className="text-gray-600">The business you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-appBg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-appText mb-2">Manage Business</h1>
          <p className="text-gray-600">Update or delete business information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Business Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="flex justify-between pt-6 border-t">
              <Button
                onClick={handleDelete}
                disabled={deleting}
                variant="destructive"
                className="flex items-center space-x-2"
              >
                {deleting ? <LoadingSpinner size="sm" /> : <Trash2 className="h-4 w-4" />}
                <span>{deleting ? 'Deleting...' : 'Delete Business'}</span>
              </Button>
              
              <Button
                onClick={handleUpdate}
                disabled={saving}
                className="flex items-center space-x-2"
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
