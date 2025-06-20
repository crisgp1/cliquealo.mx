import { useState, useCallback } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { MediaUpload, type MediaItem } from "~/components/ui/media-upload";
import { Card } from "~/components/ui/card";
import { toast } from "~/components/ui/toast";
import { 
  User, 
  Briefcase, 
  DollarSign, 
  Phone, 
  FileText, 
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

interface CreditApplicationFormProps {
  listingId?: string;
  listingTitle?: string;
  listingPrice?: number;
  onSuccess?: () => void;
}

interface FormData {
  // Información personal
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  curp: string;
  rfc: string;
  maritalStatus: string;
  dependents: string;
  
  // Información laboral
  employmentType: string;
  companyName: string;
  position: string;
  monthlyIncome: string;
  workExperience: string;
  workAddress: string;
  workPhone: string;
  
  // Información financiera
  requestedAmount: string;
  downPayment: string;
  preferredTerm: string;
  monthlyExpenses: string;
  otherDebts: string;
  bankName: string;
  accountType: string;
  
  // Contacto de emergencia
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactAddress: string;
}

const initialFormData: FormData = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  curp: "",
  rfc: "",
  maritalStatus: "",
  dependents: "0",
  employmentType: "",
  companyName: "",
  position: "",
  monthlyIncome: "",
  workExperience: "",
  workAddress: "",
  workPhone: "",
  requestedAmount: "",
  downPayment: "",
  preferredTerm: "48",
  monthlyExpenses: "",
  otherDebts: "0",
  bankName: "",
  accountType: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
  emergencyContactAddress: ""
};

export function CreditApplicationForm({ 
  listingId, 
  listingTitle, 
  listingPrice,
  onSuccess 
}: CreditApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [documents, setDocuments] = useState<MediaItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const actionData = useActionData();
  const navigation = useNavigation();

  // Configurar monto solicitado basado en el precio del auto
  useState(() => {
    if (listingPrice && !formData.requestedAmount) {
      setFormData(prev => ({
        ...prev,
        requestedAmount: listingPrice.toString(),
        downPayment: Math.round(listingPrice * 0.2).toString() // 20% de enganche sugerido
      }));
    }
  });

  const steps = [
    { number: 1, title: "Información Personal", icon: User },
    { number: 2, title: "Información Laboral", icon: Briefcase },
    { number: 3, title: "Información Financiera", icon: DollarSign },
    { number: 4, title: "Contacto de Emergencia", icon: Phone },
    { number: 5, title: "Documentos", icon: FileText }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentsChange = useCallback((items: MediaItem[]) => {
    setDocuments(items);
  }, []);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.email && formData.phone && 
                 formData.dateOfBirth && formData.curp && formData.maritalStatus);
      case 2:
        return !!(formData.employmentType && formData.monthlyIncome && formData.workExperience);
      case 3:
        return !!(formData.requestedAmount && formData.downPayment && 
                 formData.preferredTerm && formData.bankName && formData.accountType);
      case 4:
        return !!(formData.emergencyContactName && formData.emergencyContactRelationship && 
                 formData.emergencyContactPhone);
      case 5:
        return documents.length >= 2; // Al menos 2 documentos requeridos
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      toast.error("Por favor completa todos los campos requeridos");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(5)) {
      toast.error("Por favor completa todos los campos y sube los documentos requeridos");
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData = {
        listingId,
        personalInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: new Date(formData.dateOfBirth),
          curp: formData.curp.toUpperCase(),
          rfc: formData.rfc.toUpperCase(),
          maritalStatus: formData.maritalStatus,
          dependents: parseInt(formData.dependents)
        },
        employmentInfo: {
          employmentType: formData.employmentType,
          companyName: formData.companyName,
          position: formData.position,
          monthlyIncome: parseFloat(formData.monthlyIncome),
          workExperience: parseInt(formData.workExperience),
          workAddress: formData.workAddress,
          workPhone: formData.workPhone
        },
        financialInfo: {
          requestedAmount: parseFloat(formData.requestedAmount),
          downPayment: parseFloat(formData.downPayment),
          preferredTerm: parseInt(formData.preferredTerm),
          monthlyExpenses: parseFloat(formData.monthlyExpenses),
          otherDebts: parseFloat(formData.otherDebts),
          bankName: formData.bankName,
          accountType: formData.accountType
        },
        emergencyContact: {
          name: formData.emergencyContactName,
          relationship: formData.emergencyContactRelationship,
          phone: formData.emergencyContactPhone,
          address: formData.emergencyContactAddress
        },
        documents: documents.map(doc => ({
          id: doc.id,
          url: doc.url,
          type: 'other' as const, // Se puede mejorar para categorizar automáticamente
          name: doc.name || 'Documento',
          size: doc.size || 0,
          uploadedAt: new Date()
        }))
      };

      const response = await fetch('/credit/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      if (response.ok) {
        toast.success("Solicitud de crédito enviada exitosamente");
        onSuccess?.();
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al enviar la solicitud");
      }
    } catch (error) {
      toast.error("Error al enviar la solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(parseInt(number) || 0);
  };

  const handleCurrencyChange = (field: keyof FormData, value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    handleInputChange(field, numericValue);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Solicitud de Crédito Automotriz
        </h1>
        {listingTitle && (
          <p className="text-gray-600">
            Para: <span className="font-semibold">{listingTitle}</span>
            {listingPrice && (
              <span className="ml-2 text-green-600 font-bold">
                {formatCurrency(listingPrice.toString())}
              </span>
            )}
          </p>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const isValid = validateStep(step.number);
            
            return (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                  ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 
                    isCompleted ? 'bg-green-600 border-green-600 text-white' : 
                    'bg-gray-100 border-gray-300 text-gray-400'}
                `}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div className="text-center mt-2">
                  <div className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : 
                    isCompleted ? 'text-green-600' : 
                    'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  {isActive && !isValid && (
                    <div className="text-xs text-red-500 mt-1">
                      Campos requeridos
                    </div>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    absolute h-0.5 w-full top-6 left-1/2 transform -translate-y-1/2 -z-10
                    ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}
                  `} style={{ width: `calc(100% / ${steps.length} - 3rem)`, marginLeft: '1.5rem' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Form onSubmit={handleSubmit}>
        {/* Step 1: Información Personal */}
        {currentStep === 1 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Información Personal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Nombre Completo *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="33 1234 5678"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Fecha de Nacimiento *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="curp">CURP *</Label>
                <Input
                  id="curp"
                  value={formData.curp}
                  onChange={(e) => handleInputChange('curp', e.target.value.toUpperCase())}
                  placeholder="CURP de 18 caracteres"
                  maxLength={18}
                  required
                />
              </div>
              <div>
                <Label htmlFor="rfc">RFC</Label>
                <Input
                  id="rfc"
                  value={formData.rfc}
                  onChange={(e) => handleInputChange('rfc', e.target.value.toUpperCase())}
                  placeholder="RFC (opcional)"
                  maxLength={13}
                />
              </div>
              <div>
                <Label htmlFor="maritalStatus">Estado Civil *</Label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="single">Soltero(a)</option>
                  <option value="married">Casado(a)</option>
                  <option value="divorced">Divorciado(a)</option>
                  <option value="widowed">Viudo(a)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="dependents">Número de Dependientes</Label>
                <Input
                  id="dependents"
                  type="number"
                  min="0"
                  value={formData.dependents}
                  onChange={(e) => handleInputChange('dependents', e.target.value)}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Información Laboral */}
        {currentStep === 2 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Información Laboral
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="employmentType">Tipo de Empleo *</Label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleInputChange('employmentType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="employee">Empleado</option>
                  <option value="self_employed">Trabajador Independiente</option>
                  <option value="business_owner">Empresario</option>
                  <option value="retired">Jubilado</option>
                </select>
              </div>
              <div>
                <Label htmlFor="monthlyIncome">Ingresos Mensuales *</Label>
                <Input
                  id="monthlyIncome"
                  value={formData.monthlyIncome ? formatCurrency(formData.monthlyIncome) : ''}
                  onChange={(e) => handleCurrencyChange('monthlyIncome', e.target.value)}
                  placeholder="$0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="companyName">Nombre de la Empresa</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Empresa donde trabajas"
                />
              </div>
              <div>
                <Label htmlFor="position">Puesto</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="Tu puesto de trabajo"
                />
              </div>
              <div>
                <Label htmlFor="workExperience">Años de Experiencia Laboral *</Label>
                <Input
                  id="workExperience"
                  type="number"
                  min="0"
                  value={formData.workExperience}
                  onChange={(e) => handleInputChange('workExperience', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="workPhone">Teléfono del Trabajo</Label>
                <Input
                  id="workPhone"
                  type="tel"
                  value={formData.workPhone}
                  onChange={(e) => handleInputChange('workPhone', e.target.value)}
                  placeholder="33 1234 5678"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="workAddress">Dirección del Trabajo</Label>
                <Textarea
                  id="workAddress"
                  value={formData.workAddress}
                  onChange={(e) => handleInputChange('workAddress', e.target.value)}
                  placeholder="Dirección completa del lugar de trabajo"
                  rows={3}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Información Financiera */}
        {currentStep === 3 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Información Financiera
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="requestedAmount">Monto Solicitado *</Label>
                <Input
                  id="requestedAmount"
                  value={formData.requestedAmount ? formatCurrency(formData.requestedAmount) : ''}
                  onChange={(e) => handleCurrencyChange('requestedAmount', e.target.value)}
                  placeholder="$0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="downPayment">Enganche *</Label>
                <Input
                  id="downPayment"
                  value={formData.downPayment ? formatCurrency(formData.downPayment) : ''}
                  onChange={(e) => handleCurrencyChange('downPayment', e.target.value)}
                  placeholder="$0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="preferredTerm">Plazo Preferido (meses) *</Label>
                <select
                  value={formData.preferredTerm}
                  onChange={(e) => handleInputChange('preferredTerm', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="12">12 meses</option>
                  <option value="24">24 meses</option>
                  <option value="36">36 meses</option>
                  <option value="48">48 meses</option>
                  <option value="60">60 meses</option>
                  <option value="72">72 meses</option>
                </select>
              </div>
              <div>
                <Label htmlFor="monthlyExpenses">Gastos Mensuales</Label>
                <Input
                  id="monthlyExpenses"
                  value={formData.monthlyExpenses ? formatCurrency(formData.monthlyExpenses) : ''}
                  onChange={(e) => handleCurrencyChange('monthlyExpenses', e.target.value)}
                  placeholder="$0"
                />
              </div>
              <div>
                <Label htmlFor="otherDebts">Otras Deudas</Label>
                <Input
                  id="otherDebts"
                  value={formData.otherDebts ? formatCurrency(formData.otherDebts) : ''}
                  onChange={(e) => handleCurrencyChange('otherDebts', e.target.value)}
                  placeholder="$0"
                />
              </div>
              <div>
                <Label htmlFor="bankName">Banco Principal *</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  placeholder="Nombre del banco"
                  required
                />
              </div>
              <div>
                <Label htmlFor="accountType">Tipo de Cuenta *</Label>
                <select
                  value={formData.accountType}
                  onChange={(e) => handleInputChange('accountType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="checking">Cuenta de Cheques</option>
                  <option value="savings">Cuenta de Ahorros</option>
                </select>
              </div>
            </div>
          </Card>
        )}

        {/* Step 4: Contacto de Emergencia */}
        {currentStep === 4 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Contacto de Emergencia
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="emergencyContactName">Nombre Completo *</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  placeholder="Nombre del contacto de emergencia"
                  required
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactRelationship">Parentesco *</Label>
                <Input
                  id="emergencyContactRelationship"
                  value={formData.emergencyContactRelationship}
                  onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                  placeholder="Ej: Padre, Madre, Hermano, Cónyuge"
                  required
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactPhone">Teléfono *</Label>
                <Input
                  id="emergencyContactPhone"
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                  placeholder="33 1234 5678"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="emergencyContactAddress">Dirección</Label>
                <Textarea
                  id="emergencyContactAddress"
                  value={formData.emergencyContactAddress}
                  onChange={(e) => handleInputChange('emergencyContactAddress', e.target.value)}
                  placeholder="Dirección del contacto de emergencia"
                  rows={3}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 5: Documentos */}
        {currentStep === 5 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Documentos Requeridos
            </h2>
            
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-blue-900 mb-2">Documentos necesarios:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Identificación oficial (INE, Pasaporte)</li>
                  <li>• Comprobante de ingresos (recibos de nómina, estados de cuenta)</li>
                  <li>• Comprobante de domicilio (no mayor a 3 meses)</li>
                  <li>• Estados de cuenta bancarios (últimos 3 meses)</li>
                  <li>• CURP</li>
                </ul>
              </div>
              
              <MediaUpload
                label="Subir Documentos"
                maxFiles={10}
                onMediaChange={handleDocumentsChange}
                initialMedia={documents}
                accept={{
                  "image/jpeg": [".jpeg", ".jpg"],
                  "image/png": [".png"],
                  "image/webp": [".webp"],
                  "application/pdf": [".pdf"]
                }}
                maxSize={10 * 1024 * 1024} // 10MB
                allowVideos={false}
                uploadMode="inline"
              />
              
              {documents.length < 2 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">
                      Se requieren al menos 2 documentos para continuar
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>
          
          {currentStep < 5 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!validateStep(5) || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Enviar Solicitud
                </>
              )}
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}