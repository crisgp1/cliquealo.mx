import { useState, useCallback, useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
  Divider,
  Chip,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spacer,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  MapPin,
  Phone,
  Mail,
  Camera,
  CheckCircle,
  AlertCircle,
  Fuel,
  Settings,
  Calendar,
  DollarSign,
  Gauge,
  FileText,
  Save,
  Send,
  Search
} from "lucide-react";
import { ImageUpload } from "~/components/ui/image-upload";

// 🌐 Configuración centralizada de textos en español
const FORM_CONFIG = {
  validation: {
    makeRequired: "La marca es requerida",
    customMakeRequired: "Especifica la marca del vehículo",
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
    vehicleImages: "Imágenes del Vehículo",
    formProgress: "Progreso del Formulario"
  },
  fields: {
    make: "Marca",
    customMake: "Especificar Marca",
    model: "Modelo",
    year: "Año",
    price: "Precio (MXN)",
    mileage: "Kilometraje",
    condition: "Condición",
    fuelType: "Tipo de Combustible",
    transmission: "Transmisión",
    description: "Descripción",
    location: "Ubicación",
    phone: "Número de Teléfono",
    whatsapp: "WhatsApp",
    email: "Email"
  },
  placeholders: {
    make: "Selecciona la marca del vehículo",
    customMake: "Ej: BYD, Changan, JAC, etc.",
    model: "Ej: Civic, Corolla, F-150",
    year: "Selecciona el año",
    price: "Ej: 250000",
    mileage: "Ej: 50000",
    condition: "Selecciona la condición",
    fuelType: "Selecciona el tipo de combustible",
    transmission: "Selecciona la transmisión",
    description: "Describe las características, estado y detalles importantes del vehículo...",
    location: "Ej: Ciudad de México, CDMX",
    phone: "Ej: +52 55 1234 5678",
    whatsapp: "Ej: +52 55 1234 5678",
    email: "Ej: contacto@ejemplo.com"
  },
  options: {
    makes: [
      // Marcas Populares/Mainstream
      { key: "toyota", label: "Toyota", category: "popular" },
      { key: "honda", label: "Honda", category: "popular" },
      { key: "ford", label: "Ford", category: "popular" },
      { key: "chevrolet", label: "Chevrolet", category: "popular" },
      { key: "nissan", label: "Nissan", category: "popular" },
      { key: "volkswagen", label: "Volkswagen", category: "popular" },
      { key: "hyundai", label: "Hyundai", category: "popular" },
      { key: "kia", label: "Kia", category: "popular" },
      { key: "mazda", label: "Mazda", category: "popular" },
      { key: "subaru", label: "Subaru", category: "popular" },
      { key: "mitsubishi", label: "Mitsubishi", category: "popular" },
      { key: "suzuki", label: "Suzuki", category: "popular" },
      { key: "renault", label: "Renault", category: "popular" },
      { key: "peugeot", label: "Peugeot", category: "popular" },
      { key: "citroen", label: "Citroën", category: "popular" },
      { key: "fiat", label: "Fiat", category: "popular" },
      { key: "seat", label: "SEAT", category: "popular" },
      { key: "skoda", label: "Škoda", category: "popular" },
      
      // Marcas Premium/Lujo
      { key: "bmw", label: "BMW", category: "premium" },
      { key: "mercedes-benz", label: "Mercedes-Benz", category: "premium" },
      { key: "audi", label: "Audi", category: "premium" },
      { key: "lexus", label: "Lexus", category: "premium" },
      { key: "infiniti", label: "Infiniti", category: "premium" },
      { key: "acura", label: "Acura", category: "premium" },
      { key: "cadillac", label: "Cadillac", category: "premium" },
      { key: "lincoln", label: "Lincoln", category: "premium" },
      { key: "volvo", label: "Volvo", category: "premium" },
      { key: "jaguar", label: "Jaguar", category: "premium" },
      { key: "land-rover", label: "Land Rover", category: "premium" },
      { key: "porsche", label: "Porsche", category: "premium" },
      { key: "tesla", label: "Tesla", category: "premium" },
      { key: "genesis", label: "Genesis", category: "premium" },
      { key: "alfa-romeo", label: "Alfa Romeo", category: "premium" },
      
      // Marcas Exóticas/Superdeportivos
      { key: "ferrari", label: "Ferrari", category: "exotic" },
      { key: "lamborghini", label: "Lamborghini", category: "exotic" },
      { key: "mclaren", label: "McLaren", category: "exotic" },
      { key: "bugatti", label: "Bugatti", category: "exotic" },
      { key: "koenigsegg", label: "Koenigsegg", category: "exotic" },
      { key: "pagani", label: "Pagani", category: "exotic" },
      { key: "aston-martin", label: "Aston Martin", category: "exotic" },
      { key: "bentley", label: "Bentley", category: "exotic" },
      { key: "rolls-royce", label: "Rolls-Royce", category: "exotic" },
      { key: "maserati", label: "Maserati", category: "exotic" },
      { key: "lotus", label: "Lotus", category: "exotic" },
      
      // Marcas Comerciales/Trabajo
      { key: "isuzu", label: "Isuzu", category: "commercial" },
      { key: "hino", label: "Hino", category: "commercial" },
      { key: "freightliner", label: "Freightliner", category: "commercial" },
      { key: "kenworth", label: "Kenworth", category: "commercial" },
      { key: "peterbilt", label: "Peterbilt", category: "commercial" },
      { key: "volvo-trucks", label: "Volvo Trucks", category: "commercial" },
      { key: "mack", label: "Mack", category: "commercial" },
      { key: "international", label: "International", category: "commercial" },
      { key: "dina", label: "DINA", category: "commercial" },
      { key: "mercedes-benz-commercial", label: "Mercedes-Benz Commercial", category: "commercial" },
      { key: "iveco", label: "Iveco", category: "commercial" },
      { key: "scania", label: "Scania", category: "commercial" },
      { key: "man", label: "MAN", category: "commercial" },
      { key: "daf", label: "DAF", category: "commercial" },
      
      // Marcas Asiáticas Adicionales
      { key: "geely", label: "Geely", category: "asian" },
      { key: "byd", label: "BYD", category: "asian" },
      { key: "chery", label: "Chery", category: "asian" },
      { key: "omoda", label: "Omoda", category: "asian" },
      { key: "jaecoo", label: "Jaecoo", category: "asian" },
      { key: "great-wall", label: "Great Wall", category: "asian" },
      { key: "haval", label: "Haval", category: "asian" },
      { key: "wey", label: "WEY", category: "asian" },
      { key: "ora", label: "ORA", category: "asian" },
      { key: "tank", label: "Tank", category: "asian" },
      { key: "mg", label: "MG", category: "asian" },
      { key: "maxus", label: "Maxus", category: "asian" },
      { key: "jac", label: "JAC", category: "asian" },
      { key: "jetour", label: "Jetour", category: "asian" },
      { key: "dongfeng", label: "Dongfeng", category: "asian" },
      { key: "dfsk", label: "DFSK", category: "asian" },
      { key: "changan", label: "Changan", category: "asian" },
      { key: "foton", label: "Foton", category: "asian" },
      { key: "gac", label: "GAC", category: "asian" },
      { key: "hongqi", label: "Hongqi", category: "asian" },
      { key: "lynk-co", label: "Lynk & Co", category: "asian" },
      { key: "nio", label: "NIO", category: "asian" },
      { key: "xpeng", label: "XPeng", category: "asian" },
      { key: "li-auto", label: "Li Auto", category: "asian" },
      { key: "zeekr", label: "Zeekr", category: "asian" },
      { key: "polestar", label: "Polestar", category: "asian" },
      { key: "aiways", label: "Aiways", category: "asian" },
      { key: "baic", label: "BAIC", category: "asian" },
      { key: "brilliance", label: "Brilliance", category: "asian" },
      { key: "faw", label: "FAW", category: "asian" },
      { key: "ssangyong", label: "SsangYong", category: "asian" },
      { key: "mahindra", label: "Mahindra", category: "asian" },
      { key: "tata", label: "Tata", category: "asian" },
      { key: "proton", label: "Proton", category: "asian" },
      { key: "perodua", label: "Perodua", category: "asian" },
      
      // Marcas Americanas Adicionales
      { key: "gmc", label: "GMC", category: "american" },
      { key: "buick", label: "Buick", category: "american" },
      { key: "dodge", label: "Dodge", category: "american" },
      { key: "ram", label: "RAM", category: "american" },
      { key: "jeep", label: "Jeep", category: "american" },
      { key: "chrysler", label: "Chrysler", category: "american" },
      { key: "pontiac", label: "Pontiac", category: "american" },
      { key: "oldsmobile", label: "Oldsmobile", category: "american" },
      { key: "saturn", label: "Saturn", category: "american" },
      { key: "hummer", label: "Hummer", category: "american" },
      
      // Marcas Europeas Adicionales
      { key: "opel", label: "Opel", category: "european" },
      { key: "vauxhall", label: "Vauxhall", category: "european" },
      { key: "lada", label: "Lada", category: "european" },
      { key: "dacia", label: "Dacia", category: "european" },
      { key: "smart", label: "Smart", category: "european" },
      { key: "mini", label: "MINI", category: "european" },
      { key: "saab", label: "Saab", category: "european" },
      
      // Otras
      { key: "other", label: "Otra", category: "other" }
    ],
    condition: [
      { key: "new", label: "Nuevo" },
      { key: "used", label: "Usado" },
      { key: "certified", label: "Certificado Pre-Owned" }
    ],
    fuelType: [
      { key: "gasolina", label: "Gasolina" },
      { key: "diesel", label: "Diésel" },
      { key: "electrico", label: "Eléctrico" },
      { key: "hibrido", label: "Híbrido" },
      { key: "hibrido-enchufable", label: "Híbrido Enchufable" }
    ],
    transmission: [
      { key: "automatico", label: "Automática" },
      { key: "manual", label: "Manual" },
      { key: "cvt", label: "CVT" }
    ]
  },
  actions: {
    saveDraft: "Guardar Borrador",
    publish: "Publicar Listado",
    publishing: "Publicando...",
    savingDraft: "Guardando...",
    cancel: "Cancelar",
    continue: "Continuar",
    previous: "Anterior"
  },
  dialog: {
    saveDraftTitle: "Guardar como Borrador",
    saveDraftDescription: "Esto guardará tu listado como borrador. Puedes regresar y editarlo después antes de publicarlo.",
    confirmSave: "Sí, Guardar Borrador"
  }
} as const;

// Funciones de validación
const validateRequired = (value: any) => !!value;
const validateYear = (year: number) => year >= 1900 && year <= new Date().getFullYear() + 1;
const validatePrice = (price: number) => price > 0;
const validateMileage = (mileage: number) => mileage >= 0;
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string) => phone.length >= 10;
const validateImages = (images: string[]) => images.length > 0;

interface CarListingFormData {
  make: string;
  customMake?: string; // Campo para especificar marca personalizada
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
  contactWhatsapp: string;
  contactEmail: string;
  images: string[];
}

interface HeroCarListingFormProps {
  onSubmit: (data: CarListingFormData) => void;
  onSaveDraft?: (data: CarListingFormData) => void;
  isLoading?: boolean;
  status?: "idle" | "success" | "error";
  defaultValues?: Partial<CarListingFormData>;
}

export function HeroCarListingForm({ 
  onSubmit, 
  onSaveDraft,
  isLoading = false,
  status = "idle",
  defaultValues = {} 
}: HeroCarListingFormProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [formData, setFormData] = useState<Partial<CarListingFormData>>({
    make: "",
    customMake: "",
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
    contactWhatsapp: "",
    contactEmail: "",
    images: [],
    ...defaultValues
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [makeSearchValue, setMakeSearchValue] = useState("");
  
  // Calcular progreso del formulario
  const calculateProgress = useCallback(() => {
    let requiredFields = [
      'make', 'model', 'year', 'price', 'mileage', 'condition',
      'fuelType', 'transmission', 'description', 'location',
      'contactPhone', 'contactWhatsapp', 'contactEmail', 'images'
    ];
    
    // Si seleccionó "Otra" marca, agregar customMake a los campos requeridos
    if (formData.make === "other") {
      requiredFields.push('customMake');
    }
    
    const filledFields = requiredFields.filter(field => {
      const value = formData[field as keyof CarListingFormData];
      if (field === 'images') {
        return Array.isArray(value) && value.length > 0;
      }
      return value !== "" && value !== 0 && value !== undefined && value !== null;
    });
    
    return Math.round((filledFields.length / requiredFields.length) * 100);
  }, [formData]);

  // Filtrar marcas basado en la búsqueda
  const filteredMakes = useMemo(() => {
    if (!makeSearchValue) return FORM_CONFIG.options.makes;
    
    return FORM_CONFIG.options.makes.filter(make =>
      make.label.toLowerCase().includes(makeSearchValue.toLowerCase()) ||
      make.key.toLowerCase().includes(makeSearchValue.toLowerCase())
    );
  }, [makeSearchValue]);

  // Crear lista ordenada de marcas con separadores
  const organizedMakes = useMemo(() => {
    const categories = [
      { key: "popular", label: "🚗 Marcas Populares", items: filteredMakes.filter(make => make.category === "popular") },
      { key: "premium", label: "✨ Marcas Premium", items: filteredMakes.filter(make => make.category === "premium") },
      { key: "exotic", label: "🏎️ Marcas Exóticas", items: filteredMakes.filter(make => make.category === "exotic") },
      { key: "commercial", label: "🚛 Vehículos Comerciales", items: filteredMakes.filter(make => make.category === "commercial") },
      { key: "asian", label: "🌏 Marcas Asiáticas", items: filteredMakes.filter(make => make.category === "asian") },
      { key: "american", label: "🇺🇸 Marcas Americanas", items: filteredMakes.filter(make => make.category === "american") },
      { key: "european", label: "🇪🇺 Marcas Europeas", items: filteredMakes.filter(make => make.category === "european") },
      { key: "other", label: "📋 Otras Marcas", items: filteredMakes.filter(make => make.category === "other") },
    ];

    const result = [];
    
    for (const category of categories) {
      if (category.items.length > 0) {
        // Add category header
        result.push({
          key: `${category.key}-header`,
          label: category.label,
          isHeader: true,
          category: category.key
        });
        
        // Add category items
        result.push(...category.items.map(item => ({
          ...item,
          isHeader: false
        })));
      }
    }
    
    return result;
  }, [filteredMakes]);

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
  
  // Validación completa del formulario
  const validateForm = (isDraft: boolean = false): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!isDraft) {
      if (!validateRequired(formData.make)) {
        newErrors.make = FORM_CONFIG.validation.makeRequired;
      }
      
      // Si seleccionó "Otra" marca, validar que especifique cuál
      if (formData.make === "other" && !validateRequired(formData.customMake)) {
        newErrors.customMake = FORM_CONFIG.validation.customMakeRequired;
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
      
      if (!validatePhone(formData.contactWhatsapp || "")) {
        newErrors.contactWhatsapp = "Se requiere un número de WhatsApp válido";
      }
      
      if (!validateEmail(formData.contactEmail || "")) {
        newErrors.contactEmail = FORM_CONFIG.validation.validEmailRequired;
      }
      
      if (!validateImages(formData.images as string[] || [])) {
        newErrors.images = FORM_CONFIG.validation.imageRequired;
      }
    } else {
      // Para borradores, solo validamos marca y modelo como mínimo
      if (!validateRequired(formData.make)) {
        newErrors.make = FORM_CONFIG.validation.makeRequired;
      }
      
      // Si seleccionó "Otra" marca, validar que especifique cuál (incluso en borradores)
      if (formData.make === "other" && !validateRequired(formData.customMake)) {
        newErrors.customMake = FORM_CONFIG.validation.customMakeRequired;
      }
      
      if (!validateRequired(formData.model)) {
        newErrors.model = FORM_CONFIG.validation.modelRequired;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm(false)) {
      onSubmit(formData as CarListingFormData);
    }
  };
  
  const handleSaveDraft = () => {
    if (validateForm(true) && onSaveDraft) {
      onSaveDraft(formData as CarListingFormData);
      onClose();
    }
  };
  
  // Generar años para el dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 2 }, (_, i) => ({
    key: String(currentYear + 1 - i),
    label: String(currentYear + 1 - i)
  }));

  const progress = calculateProgress();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto"
      >
        {/* Progress Bar */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-lg">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                {FORM_CONFIG.ui.formProgress}
              </h3>
              <Chip 
                color={progress === 100 ? "success" : progress > 50 ? "warning" : "default"}
                variant="flat"
                size="sm"
              >
                {progress}% Completado
              </Chip>
            </div>
            <Progress 
              value={progress} 
              color={progress === 100 ? "success" : progress > 50 ? "warning" : "primary"}
              className="w-full"
              size="md"
            />
          </CardBody>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del Vehículo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {FORM_CONFIG.ui.vehicleInformation}
                  </h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* Primera fila: Marca, Modelo, Año */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Autocomplete
                    label={FORM_CONFIG.fields.make}
                    placeholder={FORM_CONFIG.placeholders.make}
                    selectedKey={formData.make || null}
                    onSelectionChange={(key) => {
                      // Don't allow selection of header items
                      const selectedItem = organizedMakes.find(item => item.key === key);
                      if (selectedItem && !selectedItem.isHeader) {
                        handleChange("make", key as string || "");
                      }
                    }}
                    onInputChange={setMakeSearchValue}
                    isInvalid={!!errors.make}
                    errorMessage={errors.make}
                    variant="bordered"
                    size="lg"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <Search className="w-4 h-4 text-gray-400" />
                      </div>
                    }
                    classNames={{
                      base: "w-full",
                      listboxWrapper: "max-h-[320px]",
                      selectorButton: "text-gray-400",
                    }}
                    listboxProps={{
                      emptyContent: "No se encontraron marcas"
                    }}
                  >
                    {organizedMakes.map((item) => (
                      <AutocompleteItem
                        key={item.key}
                        textValue={item.label}
                        className={item.isHeader ? "opacity-60 cursor-default pointer-events-none" : ""}
                        isDisabled={item.isHeader}
                      >
                        {item.isHeader ? (
                          <div className="font-semibold text-xs text-gray-500 uppercase tracking-wide">
                            {item.label}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{item.label}</span>
                          </div>
                        )}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>

                  {/* Campo condicional para especificar marca personalizada */}
                  {formData.make === "other" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        label={FORM_CONFIG.fields.customMake}
                        placeholder={FORM_CONFIG.placeholders.customMake}
                        value={formData.customMake || ""}
                        onValueChange={(value) => handleChange("customMake", value)}
                        isInvalid={!!errors.customMake}
                        errorMessage={errors.customMake}
                        variant="bordered"
                        size="lg"
                        classNames={{
                          input: "text-gray-700",
                          inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:border-blue-500",
                        }}
                      />
                    </motion.div>
                  )}

                  <Input
                    label={FORM_CONFIG.fields.model}
                    placeholder={FORM_CONFIG.placeholders.model}
                    value={formData.model || ""}
                    onValueChange={(value) => handleChange("model", value)}
                    isInvalid={!!errors.model}
                    errorMessage={errors.model}
                    variant="bordered"
                    size="lg"
                    classNames={{
                      input: "text-gray-700",
                      inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:border-blue-500",
                    }}
                  />

                  <Select
                    label={FORM_CONFIG.fields.year}
                    placeholder={FORM_CONFIG.placeholders.year}
                    selectedKeys={formData.year ? [String(formData.year)] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      handleChange("year", parseInt(selectedKey, 10));
                    }}
                    isInvalid={!!errors.year}
                    errorMessage={errors.year}
                    variant="bordered"
                    size="lg"
                    classNames={{
                      trigger: "border-gray-200 hover:border-blue-400 focus:border-blue-500",
                    }}
                  >
                    {years.map((year) => (
                      <SelectItem key={year.key}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Segunda fila: Precio y Kilometraje */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={FORM_CONFIG.fields.price}
                    placeholder={FORM_CONFIG.placeholders.price}
                    type="number"
                    value={formData.price ? String(formData.price) : ""}
                    onValueChange={(value) => handleChange("price", parseFloat(value) || 0)}
                    isInvalid={!!errors.price}
                    errorMessage={errors.price}
                    variant="bordered"
                    size="lg"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                      </div>
                    }
                    classNames={{
                      input: "text-gray-700",
                      inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:border-blue-500",
                    }}
                  />

                  <Input
                    label={FORM_CONFIG.fields.mileage}
                    placeholder={FORM_CONFIG.placeholders.mileage}
                    type="number"
                    value={formData.mileage ? String(formData.mileage) : ""}
                    onValueChange={(value) => handleChange("mileage", parseFloat(value) || 0)}
                    isInvalid={!!errors.mileage}
                    errorMessage={errors.mileage}
                    variant="bordered"
                    size="lg"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <Gauge className="w-4 h-4 text-gray-400" />
                      </div>
                    }
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-gray-400 text-sm">km</span>
                      </div>
                    }
                    classNames={{
                      input: "text-gray-700",
                      inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:border-blue-500",
                    }}
                  />
                </div>

                {/* Tercera fila: Condición, Combustible, Transmisión */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    label={FORM_CONFIG.fields.condition}
                    placeholder={FORM_CONFIG.placeholders.condition}
                    selectedKeys={formData.condition ? [formData.condition] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      handleChange("condition", selectedKey as "new" | "used" | "certified");
                    }}
                    isInvalid={!!errors.condition}
                    errorMessage={errors.condition}
                    variant="bordered"
                    size="lg"
                    classNames={{
                      trigger: "border-gray-200 hover:border-blue-400 focus:border-blue-500",
                    }}
                  >
                    {FORM_CONFIG.options.condition.map((condition) => (
                      <SelectItem key={condition.key}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label={FORM_CONFIG.fields.fuelType}
                    placeholder={FORM_CONFIG.placeholders.fuelType}
                    selectedKeys={formData.fuelType ? [formData.fuelType] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      handleChange("fuelType", selectedKey);
                    }}
                    isInvalid={!!errors.fuelType}
                    errorMessage={errors.fuelType}
                    variant="bordered"
                    size="lg"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <Fuel className="w-4 h-4 text-gray-400" />
                      </div>
                    }
                    classNames={{
                      trigger: "border-gray-200 hover:border-blue-400 focus:border-blue-500",
                    }}
                  >
                    {FORM_CONFIG.options.fuelType.map((fuel) => (
                      <SelectItem key={fuel.key}>
                        {fuel.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label={FORM_CONFIG.fields.transmission}
                    placeholder={FORM_CONFIG.placeholders.transmission}
                    selectedKeys={formData.transmission ? [formData.transmission] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      handleChange("transmission", selectedKey);
                    }}
                    isInvalid={!!errors.transmission}
                    errorMessage={errors.transmission}
                    variant="bordered"
                    size="lg"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <Settings className="w-4 h-4 text-gray-400" />
                      </div>
                    }
                    classNames={{
                      trigger: "border-gray-200 hover:border-blue-400 focus:border-blue-500",
                    }}
                  >
                    {FORM_CONFIG.options.transmission.map((trans) => (
                      <SelectItem key={trans.key}>
                        {trans.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Detalles Adicionales */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {FORM_CONFIG.ui.additionalDetails}
                  </h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                <Textarea
                  label={FORM_CONFIG.fields.description}
                  placeholder={FORM_CONFIG.placeholders.description}
                  value={formData.description || ""}
                  onValueChange={(value) => handleChange("description", value)}
                  isInvalid={!!errors.description}
                  errorMessage={errors.description}
                  variant="bordered"
                  size="lg"
                  minRows={4}
                  maxRows={8}
                  classNames={{
                    input: "text-gray-700",
                    inputWrapper: "border-gray-200 hover:border-green-400 focus-within:border-green-500",
                  }}
                />
                
                <Input
                  label={FORM_CONFIG.fields.location}
                  placeholder={FORM_CONFIG.placeholders.location}
                  value={formData.location || ""}
                  onValueChange={(value) => handleChange("location", value)}
                  isInvalid={!!errors.location}
                  errorMessage={errors.location}
                  variant="bordered"
                  size="lg"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                  }
                  classNames={{
                    input: "text-gray-700",
                    inputWrapper: "border-gray-200 hover:border-green-400 focus-within:border-green-500",
                  }}
                />
              </CardBody>
            </Card>
          </motion.div>

          {/* Información de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {FORM_CONFIG.ui.contactInformation}
                  </h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label={FORM_CONFIG.fields.phone}
                    placeholder={FORM_CONFIG.placeholders.phone}
                    type="tel"
                    value={formData.contactPhone || ""}
                    onValueChange={(value) => handleChange("contactPhone", value)}
                    isInvalid={!!errors.contactPhone}
                    errorMessage={errors.contactPhone}
                    variant="bordered"
                    size="lg"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <Phone className="w-4 h-4 text-gray-400" />
                      </div>
                    }
                    classNames={{
                      input: "text-gray-700",
                      inputWrapper: "border-gray-200 hover:border-purple-400 focus-within:border-purple-500",
                    }}
                  />
                  
                  <Input
                    label={FORM_CONFIG.fields.whatsapp}
                    placeholder={FORM_CONFIG.placeholders.whatsapp}
                    type="tel"
                    value={formData.contactWhatsapp || ""}
                    onValueChange={(value) => handleChange("contactWhatsapp", value)}
                    isInvalid={!!errors.contactWhatsapp}
                    errorMessage={errors.contactWhatsapp}
                    variant="bordered"
                    size="lg"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-gray-400 text-sm font-medium">📱</span>
                      </div>
                    }
                    classNames={{
                      input: "text-gray-700",
                      inputWrapper: "border-gray-200 hover:border-purple-400 focus-within:border-purple-500",
                    }}
                  />
                  
                  <Input
                    label={FORM_CONFIG.fields.email}
                    placeholder={FORM_CONFIG.placeholders.email}
                    type="email"
                    value={formData.contactEmail || ""}
                    onValueChange={(value) => handleChange("contactEmail", value)}
                    isInvalid={!!errors.contactEmail}
                    errorMessage={errors.contactEmail}
                    variant="bordered"
                    size="lg"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <Mail className="w-4 h-4 text-gray-400" />
                      </div>
                    }
                    classNames={{
                      input: "text-gray-700",
                      inputWrapper: "border-gray-200 hover:border-purple-400 focus-within:border-purple-500",
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Imágenes del Vehículo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Camera className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {FORM_CONFIG.ui.vehicleImages}
                  </h2>
                </div>
              </CardHeader>
              <CardBody>
                <ImageUpload
                  label="Subir Imágenes del Vehículo * (máximo 30)"
                  maxFiles={30}
                  initialImages={formData.images as string[] || []}
                  onImagesChange={(urls) => handleChange("images", urls)}
                />
                {errors.images && (
                  <p className="text-danger text-sm mt-2">
                    {errors.images}
                  </p>
                )}
              </CardBody>
            </Card>
          </motion.div>

          {/* Botones de Acción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-end pt-6"
          >
            {onSaveDraft && (
              <Button
                type="button"
                variant="bordered"
                size="lg"
                onClick={onOpen}
                isDisabled={isLoading}
                startContent={<Save className="w-4 h-4" />}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {isLoading ? FORM_CONFIG.actions.savingDraft : FORM_CONFIG.actions.saveDraft}
              </Button>
            )}
            
            <Button
              type="submit"
              size="lg"
              color="primary"
              isDisabled={isLoading}
              isLoading={isLoading}
              startContent={!isLoading && <Send className="w-4 h-4" />}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold"
            >
              {isLoading ? FORM_CONFIG.actions.publishing : FORM_CONFIG.actions.publish}
            </Button>
          </motion.div>
        </form>
      </motion.div>

      {/* Modal de Confirmación para Guardar Borrador */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">{FORM_CONFIG.dialog.saveDraftTitle}</h3>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-600">
              {FORM_CONFIG.dialog.saveDraftDescription}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={onClose}
              className="text-gray-600"
            >
              {FORM_CONFIG.actions.cancel}
            </Button>
            <Button
              color="primary"
              onPress={handleSaveDraft}
              startContent={<Save className="w-4 h-4" />}
            >
              {FORM_CONFIG.dialog.confirmSave}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}