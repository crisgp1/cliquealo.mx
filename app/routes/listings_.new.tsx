import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, Link, useNavigation, useLoaderData, useSubmit } from "@remix-run/react";
import { ListingModel } from "~/models/Listing";
import { requireAdmin } from "~/lib/auth.server";
import { CarListingForm } from "~/components/forms/CarListingForm";
import { ChevronLeft } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { useState, useEffect } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { AnimationProvider } from "~/components/AnimationProvider";
import { toast } from "~/components/ui/toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";

// 🌐 Configuración de textos en español para la página
const PAGE_TEXTS = {
  header: {
    backToListings: "Volver a Listados",
    title: "Agregar Nuevo Listado de Auto",
    subtitle: "Ingresa los detalles a continuación para crear un nuevo listado de vehículo"
  },
  messages: {
    success: "¡Vehículo agregado exitosamente! Puedes agregar otro o ver el listado creado.",
    error: "Error al crear el listado"
  },
  dialog: {
    title: "Listado Creado Exitosamente",
    description: "¡Tu listado de vehículo ha sido creado exitosamente!",
    viewListing: "Ver Listado",
    createAnother: "Crear Otro Listado"
  }
} as const;

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const user = await requireAdmin(request);
    return json({ user });
  } catch (error) {
    console.error('Error in listings.new loader:', error);
    throw error;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireAdmin(request);
  const formData = await request.formData();
  
  // Extract form data
  const make = formData.get("make") as string;
  const model = formData.get("model") as string;
  const year = parseInt(formData.get("year") as string);
  const price = parseFloat(formData.get("price") as string);
  const mileage = parseFloat(formData.get("mileage") as string);
  const conditionValue = formData.get("condition") as "new" | "used" | "certified";
  const fuelTypeValue = formData.get("fuelType") as string;
  const transmissionValue = formData.get("transmission") as string;
  const locationValue = formData.get("location") as string;
  const description = formData.get("description") as string;
  
  // Convert to expected types for the model
  const fuelType = fuelTypeValue as "gasolina" | "diesel" | "hibrido" | "electrico" | undefined;
  const transmission = transmissionValue as "manual" | "automatico" | undefined;
  const location = locationValue ? {
    city: locationValue.split(',')[0]?.trim() || "",
    state: locationValue.split(',')[1]?.trim() || ""
  } : undefined;
  
  const contactPhone = formData.get("contactPhone") as string;
  const contactEmail = formData.get("contactEmail") as string;
  
  const contactInfo = {
    phone: contactPhone,
    email: contactEmail
  };
  const images = formData.get("images") as string;
  
  const title = `${year} ${make} ${model}`;
  
  // Validaciones
  if (!make || !model || !year || !price) {
    return json({ error: "Marca, modelo, año y precio son requeridos" }, { status: 400 });
  }
  
  if (year < 1900 || year > new Date().getFullYear() + 1) {
    return json({ error: "Año inválido" }, { status: 400 });
  }
  
  if (price < 0) {
    return json({ error: "El precio debe ser mayor a 0" }, { status: 400 });
  }
  
  try {
    const imageUrls = images 
      ? images.split(',').map(url => url.trim()).filter(Boolean)
      : [];
    
    const listing = await ListingModel.create({
      title,
      description: description?.trim() || "",
      brand: make.trim(),
      model: model.trim(),
      year,
      price,
      mileage,
      isFeatured: conditionValue === "certified",
      fuelType,
      transmission,
      location,
      contactInfo,
      images: imageUrls,
      user: user._id!
    });
    
    return json({
      success: true,
      message: PAGE_TEXTS.messages.success,
      listingId: listing._id
    });
  } catch (error) {
    console.error(error);
    return json({ error: PAGE_TEXTS.messages.error }, { status: 500 });
  }
}

export default function NewListing() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const isSubmitting = navigation.state === "submitting";
  
  const handleSubmit = (data: any) => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "images" && Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    
    const submit = useSubmit();
    submit(formData, { method: "post" });
  };
  
  useEffect(() => {
    if (actionData) {
      if ('success' in actionData && actionData.success) {
        setFormStatus("success");
        setSuccessMessage(actionData.message || PAGE_TEXTS.messages.success);
        setShowSuccessDialog(true);
        toast.success("¡Listado de vehículo creado exitosamente!");
      } else if ('error' in actionData) {
        setFormStatus("error");
        toast.error(actionData.error || PAGE_TEXTS.messages.error);
      }
    }
  }, [actionData]);

  useEffect(() => {
    if (isSubmitting) {
      setFormStatus("idle");
    }
  }, [isSubmitting]);
  
  return (
    <AnimationProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link 
                to="/admin/listings"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">{PAGE_TEXTS.header.backToListings}</span>
              </Link>

              <div className="flex items-center space-x-2">
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role}
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-300">{user.name}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-6">
            {/* Page Title */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {PAGE_TEXTS.header.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {PAGE_TEXTS.header.subtitle}
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <CardContent className="flex justify-between items-center p-4">
                  <p className="text-green-700 dark:text-green-300">{successMessage}</p>
                  {actionData && 'listingId' in actionData && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/listings/${actionData.listingId}`}>
                        {PAGE_TEXTS.dialog.viewListing}
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Error Message */}
            {actionData && 'error' in actionData && (
              <Card className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                <CardContent className="p-4">
                  <p className="text-red-700 dark:text-red-300">{actionData.error}</p>
                </CardContent>
              </Card>
            )}

          {/* Car Listing Form */}
          <CarListingForm
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            status={formStatus}
            defaultValues={{}}
          />

          {/* Success Dialog */}
          <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{PAGE_TEXTS.dialog.title}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-gray-700">{PAGE_TEXTS.dialog.description}</p>
              </div>
              <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                {actionData && 'listingId' in actionData && (
                  <Button asChild>
                    <Link to={`/listings/${actionData.listingId}`}>
                      {PAGE_TEXTS.dialog.viewListing}
                    </Link>
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowSuccessDialog(false);
                    setFormStatus("idle");
                  }}
                >
                  {PAGE_TEXTS.dialog.createAnother}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </main>
      </div>
    </AnimationProvider>
  );
}