import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { ImageUpload } from "~/components/ui/image-upload";

// Simple validation functions (would use zod in a complete implementation)
const validateRequired = (value: any) => !!value;
const validateYear = (year: number) => year >= 1900 && year <= new Date().getFullYear() + 1;
const validatePrice = (price: number) => price > 0;
const validateMileage = (mileage: number) => mileage >= 0;
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string) => phone.length >= 10;
const validateImages = (images: string[]) => images.length > 0;

interface CarListingFormData {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: "new" | "used" | "certified";
  fuelType: string;
  transmission: string;
  description: string;
  location: string;
  contactPhone: string;
  contactEmail: string;
  images: string[];
}

interface CarListingFormProps {
  onSubmit: (data: CarListingFormData) => void;
  isLoading?: boolean;
  status?: "idle" | "success" | "error";
  defaultValues?: Partial<CarListingFormData>;
}

export function CarListingForm({ 
  onSubmit, 
  isLoading = false,
  status = "idle",
  defaultValues = {} 
}: CarListingFormProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<CarListingFormData>>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    condition: "used",
    fuelType: "",
    transmission: "",
    description: "",
    location: "",
    contactPhone: "",
    contactEmail: "",
    images: [],
    ...defaultValues
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (
    field: keyof CarListingFormData,
    value: string | number | string[]
  ) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ""
      });
    }
  };
  
  const handleSelectChange = (field: keyof CarListingFormData) => (value: string) => {
    handleChange(field, value);
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!validateRequired(formData.make)) {
      newErrors.make = "Make is required";
    }
    
    if (!validateRequired(formData.model)) {
      newErrors.model = "Model is required";
    }
    
    if (!validateYear(formData.year || 0)) {
      newErrors.year = "Invalid year";
    }
    
    if (!validatePrice(formData.price || 0)) {
      newErrors.price = "Price must be greater than 0";
    }
    
    if (!validateMileage(formData.mileage || 0)) {
      newErrors.mileage = "Mileage cannot be negative";
    }
    
    if (!validateRequired(formData.condition)) {
      newErrors.condition = "Please select a condition";
    }
    
    if (!validateRequired(formData.fuelType)) {
      newErrors.fuelType = "Fuel type is required";
    }
    
    if (!validateRequired(formData.transmission)) {
      newErrors.transmission = "Transmission is required";
    }
    
    if (!validateRequired(formData.description) || (formData.description?.length || 0) < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    
    if (!validateRequired(formData.location)) {
      newErrors.location = "Location is required";
    }
    
    if (!validatePhone(formData.contactPhone || "")) {
      newErrors.contactPhone = "Valid phone number is required";
    }
    
    if (!validateEmail(formData.contactEmail || "")) {
      newErrors.contactEmail = "Valid email is required";
    }
    
    if (!validateImages(formData.images as string[] || [])) {
      newErrors.images = "At least one image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData as CarListingFormData);
    }
  };
  
  // Generate years for select dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 2 }, (_, i) => currentYear + 1 - i);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="make">Make *</Label>
              <Select
                value={formData.make}
                onValueChange={handleSelectChange("make")}
              >
                <SelectTrigger 
                  id="make"
                  aria-invalid={!!errors.make}
                  aria-describedby={errors.make ? "make-error" : undefined}
                >
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toyota">Toyota</SelectItem>
                  <SelectItem value="honda">Honda</SelectItem>
                  <SelectItem value="ford">Ford</SelectItem>
                  <SelectItem value="chevrolet">Chevrolet</SelectItem>
                  <SelectItem value="bmw">BMW</SelectItem>
                  <SelectItem value="mercedes-benz">Mercedes-Benz</SelectItem>
                  <SelectItem value="audi">Audi</SelectItem>
                  <SelectItem value="tesla">Tesla</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.make && (
                <p id="make-error" role="alert" className="text-sm text-red-600 mt-1">
                  {errors.make}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleChange("model", e.target.value)}
                aria-invalid={!!errors.model}
                aria-describedby={errors.model ? "model-error" : undefined}
              />
              {errors.model && (
                <p id="model-error" role="alert" className="text-sm text-red-600 mt-1">
                  {errors.model}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="year">Year *</Label>
              <Select
                value={String(formData.year)}
                onValueChange={(value) => handleChange("year", parseInt(value, 10))}
              >
                <SelectTrigger 
                  id="year"
                  aria-invalid={!!errors.year}
                  aria-describedby={errors.year ? "year-error" : undefined}
                >
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.year && (
                <p id="year-error" role="alert" className="text-sm text-red-600 mt-1">
                  {errors.year}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ""}
                onChange={(e) => handleChange("price", parseFloat(e.target.value))}
                aria-invalid={!!errors.price}
                aria-describedby={errors.price ? "price-error" : undefined}
              />
              {errors.price && (
                <p id="price-error" role="alert" className="text-sm text-red-600 mt-1">
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="mileage">Mileage *</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage || ""}
                onChange={(e) => handleChange("mileage", parseFloat(e.target.value))}
                aria-invalid={!!errors.mileage}
                aria-describedby={errors.mileage ? "mileage-error" : undefined}
              />
              {errors.mileage && (
                <p id="mileage-error" role="alert" className="text-sm text-red-600 mt-1">
                  {errors.mileage}
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="condition">Condition *</Label>
              <Select
                value={formData.condition}
                onValueChange={handleSelectChange("condition")}
              >
                <SelectTrigger 
                  id="condition"
                  aria-invalid={!!errors.condition}
                  aria-describedby={errors.condition ? "condition-error" : undefined}
                >
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="certified">Certified Pre-Owned</SelectItem>
                </SelectContent>
              </Select>
              {errors.condition && (
                <p id="condition-error" role="alert" className="text-sm text-red-600 mt-1">
                  {errors.condition}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="fuelType">Fuel Type *</Label>
              <Select
                value={formData.fuelType}
                onValueChange={handleSelectChange("fuelType")}
              >
                <SelectTrigger 
                  id="fuelType"
                  aria-invalid={!!errors.fuelType}
                  aria-describedby={errors.fuelType ? "fuelType-error" : undefined}
                >
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="plug-in-hybrid">Plug-in Hybrid</SelectItem>
                </SelectContent>
              </Select>
              {errors.fuelType && (
                <p id="fuelType-error" role="alert" className="text-sm text-red-600 mt-1">
                  {errors.fuelType}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="transmission">Transmission *</Label>
              <Select
                value={formData.transmission}
                onValueChange={handleSelectChange("transmission")}
              >
                <SelectTrigger 
                  id="transmission"
                  aria-invalid={!!errors.transmission}
                  aria-describedby={errors.transmission ? "transmission-error" : undefined}
                >
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="cvt">CVT</SelectItem>
                </SelectContent>
              </Select>
              {errors.transmission && (
                <p id="transmission-error" role="alert" className="text-sm text-red-600 mt-1">
                  {errors.transmission}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "description-error" : undefined}
            />
            {errors.description && (
              <p id="description-error" role="alert" className="text-sm text-red-600 mt-1">
                {errors.description}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? "location-error" : undefined}
            />
            {errors.location && (
              <p id="location-error" role="alert" className="text-sm text-red-600 mt-1">
                {errors.location}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPhone">Phone Number *</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
                aria-invalid={!!errors.contactPhone}
                aria-describedby={errors.contactPhone ? "contactPhone-error" : undefined}
              />
              {errors.contactPhone && (
                <p id="contactPhone-error" role="alert" className="text-sm text-red-600 mt-1">
                  {errors.contactPhone}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="contactEmail">Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
                aria-invalid={!!errors.contactEmail}
                aria-describedby={errors.contactEmail ? "contactEmail-error" : undefined}
              />
              {errors.contactEmail && (
                <p id="contactEmail-error" role="alert" className="text-sm text-red-600 mt-1">
                  {errors.contactEmail}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            label="Upload Vehicle Images *"
            maxFiles={5}
            initialImages={formData.images as string[] || []}
            onImagesChange={(urls) => handleChange("images", urls)}
          />
          {errors.images && (
            <p role="alert" className="text-sm text-red-600 mt-1">
              {errors.images}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => setShowConfirmDialog(true)}>
          Save Draft
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          variant={status === "success" ? "success" : status === "error" ? "error" : "default"}
        >
          {isLoading ? "Publishing..." : "Publish Listing"}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Draft</DialogTitle>
            <DialogDescription>
              This will save your listing as a draft. You can come back and edit it later before publishing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowConfirmDialog(false);
              // Here you would implement draft saving functionality
              // For now we just close the dialog
            }}>
              Save Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}