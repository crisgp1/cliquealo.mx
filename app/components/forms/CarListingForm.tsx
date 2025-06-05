import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { ImageUpload } from "~/components/ui/image-upload";

// 🌐 Configuración centralizada de textos en español
const FORM_CONFIG = {
  validation: {
    makeRequired: "La marca es requerida",
    modelRequired: "El modelo es requerido",
    invalidYear: "Año inválido",
    priceGreaterThanZero: "El precio debe ser mayor a 0",
    mileageNonNegative: "El kilometraje no puede ser negativo",
    selectCondition: "Selecciona una condición",
    fuelTypeRequired: "El tipo de combustible es requerido",
    transmissionRequired: "La transmisión es requerida",
    descriptionMinLength: "La descripción debe tener al menos 10 caracteres",
    locationRequired: "La ubicación es requerida",
    validPhoneRequired: "Se requiere un número telefónico válido",
    validEmailRequired: "Se requiere un email válido",
    imageRequired: "Se requiere al menos una imagen"
  },
  ui: {
    vehicleInformation: "Información del Vehículo",
    additionalDetails: "Detalles Adicionales",
    contactInformation: "Información de Contacto",
    vehicleImages: "Imágenes del Vehículo"
  },
  fields: {
    make: "Marca *",
    model: "Modelo *",
    year: "Año *",
    price: "Precio *",
    mileage: "Kilometraje *",
    condition: "Condición *",
    fuelType: "Tipo de Combustible *",
    transmission: "Transmisión *",
    description: "Descripción *",
    location: "Ubicación *",
    phone: "Número de Teléfono *",
    email: "Email *"
  },
  placeholders: {
    selectMake: "Selecciona la marca",
    selectYear: "Selecciona el año",
    selectCondition: "Selecciona la condición",
    selectFuelType: "Selecciona el tipo de combustible",
    selectTransmission: "Selecciona la transmisión"
  },
  options: {
    makes: {
      toyota: "Toyota",
      honda: "Honda",
      ford: "Ford",
      chevrolet: "Chevrolet",
      bmw: "BMW",
      mercedesBenz: "Mercedes-Benz",
      audi: "Audi",
      tesla: "Tesla",
      other: "Otra"
    },
    condition: {
      new: "Nuevo",
      used: "Usado",
      certified: "Certificado Pre-Owned"
    },
    fuelType: {
      gasoline: "Gasolina",
      diesel: "Diésel",
      electric: "Eléctrico",
      hybrid: "Híbrido",
      plugInHybrid: "Híbrido Enchufable"
    },
    transmission: {
      automatic: "Automática",
      manual: "Manual",
      cvt: "CVT"
    }
  },
  actions: {
    saveDraft: "Guardar Borrador",
    publish: "Publicar Listado",
    publishing: "Publicando...",
    cancel: "Cancelar"
  },
  dialog: {
    saveDraftTitle: "Guardar como Borrador",
    saveDraftDescription: "Esto guardará tu listado como borrador. Puedes regresar y editarlo después antes de publicarlo."
  }
} as const;

// Funciones de validación simples
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
    
    // Limpiar error cuando el campo se actualiza
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
      newErrors.make = FORM_CONFIG.validation.makeRequired;
    }
    
    if (!validateRequired(formData.model)) {
      newErrors.model = FORM_CONFIG.validation.modelRequired;
    }
    
    if (!validateYear(formData.year || 0)) {
      newErrors.year = FORM_CONFIG.validation.invalidYear;
    }
    
    if (!validatePrice(formData.price || 0)) {
      newErrors.price = FORM_CONFIG.validation.priceGreaterThanZero;
    }
    
    if (!validateMileage(formData.mileage || 0)) {
      newErrors.mileage = FORM_CONFIG.validation.mileageNonNegative;
    }
    
    if (!validateRequired(formData.condition)) {
      newErrors.condition = FORM_CONFIG.validation.selectCondition;
    }
    
    if (!validateRequired(formData.fuelType)) {
      newErrors.fuelType = FORM_CONFIG.validation.fuelTypeRequired;
    }
    
    if (!validateRequired(formData.transmission)) {
      newErrors.transmission = FORM_CONFIG.validation.transmissionRequired;
    }
    
    if (!validateRequired(formData.description) || (formData.description?.length || 0) < 10) {
      newErrors.description = FORM_CONFIG.validation.descriptionMinLength;
    }
    
    if (!validateRequired(formData.location)) {
      newErrors.location = FORM_CONFIG.validation.locationRequired;
    }
    
    if (!validatePhone(formData.contactPhone || "")) {
      newErrors.contactPhone = FORM_CONFIG.validation.validPhoneRequired;
    }
    
    if (!validateEmail(formData.contactEmail || "")) {
      newErrors.contactEmail = FORM_CONFIG.validation.validEmailRequired;
    }
    
    if (!validateImages(formData.images as string[] || [])) {
      newErrors.images = FORM_CONFIG.validation.imageRequired;
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
  
  // Generar años para el dropdown de selección
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 2 }, (_, i) => currentYear + 1 - i);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{FORM_CONFIG.ui.vehicleInformation}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="make">{FORM_CONFIG.fields.make}</Label>
              <Select
                value={formData.make}
                onValueChange={handleSelectChange("make")}
              >
                <SelectTrigger 
                  id="make"
                  aria-invalid={!!errors.make}
                  aria-describedby={errors.make ? "make-error" : undefined}
                >
                  <SelectValue placeholder={FORM_CONFIG.placeholders.selectMake} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toyota">{FORM_CONFIG.options.makes.toyota}</SelectItem>
                  <SelectItem value="honda">{FORM_CONFIG.options.makes.honda}</SelectItem>
                  <SelectItem value="ford">{FORM_CONFIG.options.makes.ford}</SelectItem>
                  <SelectItem value="chevrolet">{FORM_CONFIG.options.makes.chevrolet}</SelectItem>
                  <SelectItem value="bmw">{FORM_CONFIG.options.makes.bmw}</SelectItem>
                  <SelectItem value="mercedes-benz">{FORM_CONFIG.options.makes.mercedesBenz}</SelectItem>
                  <SelectItem value="audi">{FORM_CONFIG.options.makes.audi}</SelectItem>
                  <SelectItem value="tesla">{FORM_CONFIG.options.makes.tesla}</SelectItem>
                  <SelectItem value="other">{FORM_CONFIG.options.makes.other}</SelectItem>
                </SelectContent>
              </Select>
              {errors.make && (
                <p id="make-error" role="alert" className="text-sm text-red-600 mt-1">
                  {errors.make}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="model">{FORM_CONFIG.fields.model}</Label>
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
              <Label htmlFor="year">{FORM_CONFIG.fields.year}</Label>
              <Select
                value={String(formData.year)}
                onValueChange={(value) => handleChange("year", parseInt(value, 10))}
              >
                <SelectTrigger 
                  id="year"
                  aria-invalid={!!errors.year}
                  aria-describedby={errors.year ? "year-error" : undefined}
                >
                  <SelectValue placeholder={FORM_CONFIG.placeholders.selectYear} />
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
              <Label htmlFor="price">{FORM_CONFIG.fields.price}</Label>
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
              <Label htmlFor="mileage">{FORM_CONFIG.fields.mileage}</Label>
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
              <Label htmlFor="condition">{FORM_CONFIG.fields.condition}</Label>
              <Select
                value={formData.condition}
                onValueChange={handleSelectChange("condition")}
              >
                <SelectTrigger 
                  id="condition"
                  aria-invalid={!!errors.condition}
                  aria-describedby={errors.condition ? "condition-error" : undefined}
                >
                  <SelectValue placeholder={FORM_CONFIG.placeholders.selectCondition} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">{FORM_CONFIG.options.condition.new}</SelectItem>
                  <SelectItem value="used">{FORM_CONFIG.options.condition.used}</SelectItem>
                  <SelectItem value="certified">{FORM_CONFIG.options.condition.certified}</SelectItem>
                </SelectContent>
              </Select>
              {errors.condition && (
                <p id="condition-error" role="alert" className="text-sm text-red-600 mt-1">
                  {errors.condition}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="fuelType">{FORM_CONFIG.fields.fuelType}</Label>
              <Select
                value={formData.fuelType}
                onValueChange={handleSelectChange("fuelType")}
              >
                <SelectTrigger 
                  id="fuelType"
                  aria-invalid={!!errors.fuelType}
                  aria-describedby={errors.fuelType ? "fuelType-error" : undefined}
                >
                  <SelectValue placeholder={FORM_CONFIG.placeholders.selectFuelType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">{FORM_CONFIG.options.fuelType.gasoline}</SelectItem>
                  <SelectItem value="diesel">{FORM_CONFIG.options.fuelType.diesel}</SelectItem>
                  <SelectItem value="electric">{FORM_CONFIG.options.fuelType.electric}</SelectItem>
                  <SelectItem value="hybrid">{FORM_CONFIG.options.fuelType.hybrid}</SelectItem>
                  <SelectItem value="plug-in-hybrid">{FORM_CONFIG.options.fuelType.plugInHybrid}</SelectItem>
                </SelectContent>
              </Select>
              {errors.fuelType && (
                <p id="fuelType-error" role="alert" className="text-sm text-red-600 mt-1">
                  {errors.fuelType}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="transmission">{FORM_CONFIG.fields.transmission}</Label>
              <Select
                value={formData.transmission}
                onValueChange={handleSelectChange("transmission")}
              >
                <SelectTrigger 
                  id="transmission"
                  aria-invalid={!!errors.transmission}
                  aria-describedby={errors.transmission ? "transmission-error" : undefined}
                >
                  <SelectValue placeholder={FORM_CONFIG.placeholders.selectTransmission} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">{FORM_CONFIG.options.transmission.automatic}</SelectItem>
                  <SelectItem value="manual">{FORM_CONFIG.options.transmission.manual}</SelectItem>
                  <SelectItem value="cvt">{FORM_CONFIG.options.transmission.cvt}</SelectItem>
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
          <CardTitle>{FORM_CONFIG.ui.additionalDetails}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description">{FORM_CONFIG.fields.description}</Label>
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
            <Label htmlFor="location">{FORM_CONFIG.fields.location}</Label>
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
          <CardTitle>{FORM_CONFIG.ui.contactInformation}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPhone">{FORM_CONFIG.fields.phone}</Label>
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
              <Label htmlFor="contactEmail">{FORM_CONFIG.fields.email}</Label>
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
          <CardTitle>{FORM_CONFIG.ui.vehicleImages}</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            label="Subir Imágenes del Vehículo *"
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
          {FORM_CONFIG.actions.saveDraft}
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          variant={status === "success" ? "success" : status === "error" ? "error" : "default"}
        >
          {isLoading ? FORM_CONFIG.actions.publishing : FORM_CONFIG.actions.publish}
        </Button>
      </div>

      {/* Diálogo de Confirmación */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{FORM_CONFIG.dialog.saveDraftTitle}</DialogTitle>
            <DialogDescription>
              {FORM_CONFIG.dialog.saveDraftDescription}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              {FORM_CONFIG.actions.cancel}
            </Button>
            <Button onClick={() => {
              setShowConfirmDialog(false);
              // Aquí implementarías la funcionalidad de guardar borrador
            }}>
              {FORM_CONFIG.actions.saveDraft}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}