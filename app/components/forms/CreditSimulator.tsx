import { useState, useEffect } from "react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { 
  Calculator, 
  Building2, 
  Percent, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface BankPartner {
  _id: string;
  name: string;
  logo?: string;
  creditRate: number;
  minTerm: number;
  maxTerm: number;
  processingTime: number;
  requirements: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

interface CreditSimulatorProps {
  bankPartners: BankPartner[];
  initialAmount?: number;
  listing?: any; // Información del listing si está disponible
  onApplyCredit?: (bankId: string, simulation: any) => void;
}

interface SimulationResult {
  bank: BankPartner;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  isEligible: boolean;
}

export function CreditSimulator({
  bankPartners,
  initialAmount = 0,
  listing,
  onApplyCredit
}: CreditSimulatorProps) {
  const [amount, setAmount] = useState(initialAmount.toString());
  const [term, setTerm] = useState("48");
  const [downPayment, setDownPayment] = useState("");
  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Calcular simulación cuando cambien los parámetros
  useEffect(() => {
    if (amount && parseFloat(amount) > 0 && term && selectedBankId) {
      simulateCredit();
    } else {
      setSimulation(null);
    }
  }, [amount, term, downPayment, selectedBankId, bankPartners]);

  const simulateCredit = () => {
    setIsSimulating(true);
    
    const loanAmount = parseFloat(amount) - (parseFloat(downPayment) || 0);
    const termMonths = parseInt(term);
    
    if (loanAmount <= 0 || !selectedBankId) {
      setSimulation(null);
      setIsSimulating(false);
      return;
    }

    const selectedBank = bankPartners.find(bank => bank._id === selectedBankId);
    
    if (!selectedBank || termMonths < selectedBank.minTerm || termMonths > selectedBank.maxTerm) {
      setSimulation(null);
      setIsSimulating(false);
      return;
    }

    const monthlyRate = selectedBank.creditRate / 100 / 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
                          (Math.pow(1 + monthlyRate, termMonths) - 1);
    const totalPayment = monthlyPayment * termMonths;
    const totalInterest = totalPayment - loanAmount;

    const result: SimulationResult = {
      bank: selectedBank,
      monthlyPayment,
      totalPayment,
      totalInterest,
      isEligible: true
    };

    setSimulation(result);
    setIsSimulating(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatRate = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  const handleCurrencyChange = (value: string, setter: (value: string) => void) => {
    const numericValue = value.replace(/[^\d]/g, '');
    setter(numericValue);
  };

  const handleApplyCredit = () => {
    if (onApplyCredit && simulation) {
      onApplyCredit(simulation.bank._id, {
        amount: parseFloat(amount),
        downPayment: parseFloat(downPayment) || 0,
        term: parseInt(term),
        monthlyPayment: simulation.monthlyPayment,
        totalPayment: simulation.totalPayment,
        interestRate: simulation.bank.creditRate,
        bankName: simulation.bank.name
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Información del Vehículo (si está disponible) */}
      {listing && (
        <Card className="p-6 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">🚗</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{listing.title}</h3>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-2xl font-bold text-blue-600">
                  ${listing.price.toLocaleString()} MXN
                </span>
                <span className="text-sm text-gray-600">
                  {listing.brand} {listing.model} • {listing.year}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {listing.year && (
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-sm text-gray-600">Año</div>
                <div className="font-semibold text-gray-900">{listing.year}</div>
              </div>
            )}
            {listing.mileage && (
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-sm text-gray-600">Kilometraje</div>
                <div className="font-semibold text-gray-900">{listing.mileage.toLocaleString()} km</div>
              </div>
            )}
            {listing.fuelType && (
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-sm text-gray-600">Combustible</div>
                <div className="font-semibold text-gray-900 capitalize">{listing.fuelType}</div>
              </div>
            )}
            {listing.transmission && (
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-sm text-gray-600">Transmisión</div>
                <div className="font-semibold text-gray-900 capitalize">{listing.transmission}</div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Simulador */}
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <Calculator className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Simulador de Crédito Automotriz
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="amount">Precio del Vehículo *</Label>
            <Input
              id="amount"
              value={amount ? formatCurrency(parseFloat(amount)) : ''}
              onChange={(e) => handleCurrencyChange(e.target.value, setAmount)}
              placeholder="$500,000"
              required
            />
          </div>

          <div>
            <Label htmlFor="downPayment">Enganche</Label>
            <Input
              id="downPayment"
              value={downPayment ? formatCurrency(parseFloat(downPayment)) : ''}
              onChange={(e) => handleCurrencyChange(e.target.value, setDownPayment)}
              placeholder="$100,000"
            />
            {amount && downPayment && (
              <p className="text-xs text-gray-500 mt-1">
                {((parseFloat(downPayment) / parseFloat(amount)) * 100).toFixed(1)}% del precio
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="term">Plazo (meses) *</Label>
            <select
              id="term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
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
            <Label htmlFor="bankPartner">Escoge tu Aliado *</Label>
            <select
              id="bankPartner"
              value={selectedBankId}
              onChange={(e) => setSelectedBankId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecciona un banco</option>
              {bankPartners.map((bank) => (
                <option key={bank._id} value={bank._id}>
                  {bank.name} - {formatRate(bank.creditRate)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Información sobre tasas cuando hay listing */}
        {listing && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">
                Tasas de Nuestros Aliados Bancarios
              </span>
            </div>
            <p className="text-sm text-green-700">
              Las tasas de interés se calculan automáticamente usando las tasas preferenciales de nuestros aliados bancarios registrados en el sistema.
              Verás las mejores opciones disponibles con sus respectivas tasas en los resultados de simulación.
            </p>
          </div>
        )}

        {amount && parseFloat(amount) > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Precio del vehículo:</span>
                <p className="font-semibold text-blue-900">
                  {formatCurrency(parseFloat(amount))}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Enganche:</span>
                <p className="font-semibold text-blue-900">
                  {formatCurrency(parseFloat(downPayment) || 0)}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Monto a financiar:</span>
                <p className="font-semibold text-blue-900">
                  {formatCurrency(parseFloat(amount) - (parseFloat(downPayment) || 0))}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Resultado de Simulación */}
      {simulation && (
        <div>
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">
              Resumen del Crédito
            </h3>
          </div>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              {simulation.bank.logo ? (
                <img
                  src={simulation.bank.logo}
                  alt={simulation.bank.name}
                  className="w-12 h-12 rounded-lg object-cover mr-3"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <h4 className="font-semibold text-gray-900">{simulation.bank.name}</h4>
                <div className="flex items-center text-sm text-green-600">
                  <Percent className="w-3 h-3 mr-1" />
                  {formatRate(simulation.bank.creditRate)} anual
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Pago Mensual</div>
                <div className="font-bold text-2xl text-blue-600">
                  {formatCurrency(simulation.monthlyPayment)}
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total a Pagar</div>
                <div className="font-semibold text-lg">
                  {formatCurrency(simulation.totalPayment)}
                </div>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total de Intereses</div>
                <div className="font-semibold text-lg text-orange-600">
                  {formatCurrency(simulation.totalInterest)}
                </div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Procesamiento</div>
                <div className="flex items-center justify-center text-sm">
                  <Clock className="w-4 h-4 mr-1 text-gray-400" />
                  {simulation.bank.processingTime} días
                </div>
              </div>
            </div>

            {simulation.bank.requirements.length > 0 && (
              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-900 mb-3">Requisitos:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {simulation.bank.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      {req}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleApplyCredit}
              className="w-full"
              size="lg"
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Solicitar Crédito con {simulation.bank.name}
            </Button>

            {simulation.bank.contactInfo && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {simulation.bank.contactInfo.phone && (
                    <span>📞 {simulation.bank.contactInfo.phone}</span>
                  )}
                  {simulation.bank.contactInfo.website && (
                    <span>🌐 Sitio web</span>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* No hay opciones disponibles */}
      {amount && parseFloat(amount) > 0 && selectedBankId && !simulation && !isSimulating && (
        <Card className="p-8 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-orange-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Opción de financiamiento no disponible
          </h3>
          <p className="text-gray-600 mb-4">
            Los parámetros ingresados no son compatibles con el banco seleccionado.
          </p>
          <div className="text-sm text-gray-500">
            <p>Intenta ajustar:</p>
            <ul className="mt-2 space-y-1">
              <li>• El plazo de financiamiento</li>
              <li>• El monto del enganche</li>
              <li>• Seleccionar otro aliado bancario</li>
            </ul>
          </div>
        </Card>
      )}

      {/* Información adicional */}
      <Card className="p-6 bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-3">Información Importante</h4>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• Las tasas de interés mostradas son referenciales y pueden variar según tu perfil crediticio.</p>
          <p>• Los cálculos no incluyen seguros, comisiones adicionales o gastos de escrituración.</p>
          <p>• La aprobación del crédito está sujeta a evaluación crediticia del banco.</p>
          <p>• Te recomendamos comparar todas las opciones antes de tomar una decisión.</p>
        </div>
      </Card>
    </div>
  );
}