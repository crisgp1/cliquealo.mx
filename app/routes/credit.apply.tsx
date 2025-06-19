import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, useSearchParams } from "@remix-run/react"
import { CreditApplicationModel } from "~/models/CreditApplication.server"
import { getUserId, requireUser } from "~/lib/session.server"
import { UserModel } from "~/models/User.server"
import { ListingModel } from "~/models/Listing.server"
import { CreditApplicationForm } from "~/components/forms/CreditApplicationForm"

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request)
  if (!userId) {
    // Redirigir a registro con parámetros para volver después
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const returnUrl = `/credit/apply?${searchParams.toString()}`
    return redirect(`/auth/register?returnTo=${encodeURIComponent(returnUrl)}`)
  }

  const url = new URL(request.url)
  const listingId = url.searchParams.get("listing")
  
  let listing = null
  if (listingId) {
    listing = await ListingModel.findById(listingId)
  }

  return json({ 
    user: await UserModel.findById(userId),
    listing 
  })
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request)
  const userId = user._id!.toString()
  
  try {
    const applicationData = await request.json()
    
    // Validar datos requeridos
    if (!applicationData.personalInfo?.fullName || 
        !applicationData.personalInfo?.email || 
        !applicationData.personalInfo?.phone ||
        !applicationData.employmentInfo?.monthlyIncome ||
        !applicationData.financialInfo?.requestedAmount) {
      return json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Validar CURP (18 caracteres)
    if (applicationData.personalInfo.curp?.length !== 18) {
      return json({ error: "CURP debe tener 18 caracteres" }, { status: 400 })
    }

    // Validar que el monto solicitado sea positivo
    if (applicationData.financialInfo.requestedAmount <= 0) {
      return json({ error: "El monto solicitado debe ser mayor a 0" }, { status: 400 })
    }

    // Validar que el enganche no sea mayor al monto solicitado
    if (applicationData.financialInfo.downPayment >= applicationData.financialInfo.requestedAmount) {
      return json({ error: "El enganche no puede ser mayor o igual al monto solicitado" }, { status: 400 })
    }

    // Verificar si ya existe una solicitud pendiente para este usuario y listing
    if (applicationData.listingId) {
      const existingApplications = await CreditApplicationModel.findByUserId(userId, 1, 0)
      const pendingApplication = existingApplications.find(app => 
        app.listingId?.toString() === applicationData.listingId && 
        ['pending', 'under_review'].includes(app.status)
      )
      
      if (pendingApplication) {
        return json({ 
          error: "Ya tienes una solicitud pendiente para este vehículo" 
        }, { status: 400 })
      }
    }

    // Crear la solicitud
    const application = await CreditApplicationModel.create({
      userId,
      listingId: applicationData.listingId || undefined,
      personalInfo: {
        ...applicationData.personalInfo,
        dateOfBirth: new Date(applicationData.personalInfo.dateOfBirth)
      },
      employmentInfo: applicationData.employmentInfo,
      financialInfo: applicationData.financialInfo,
      emergencyContact: applicationData.emergencyContact,
      documents: applicationData.documents || []
    })

    return json({ 
      success: true, 
      applicationId: application._id?.toString(),
      message: "Solicitud de crédito enviada exitosamente" 
    })

  } catch (error) {
    console.error("Error creating credit application:", error)
    return json({ 
      error: "Error interno del servidor" 
    }, { status: 500 })
  }
}

export default function CreditApply() {
  const { user, listing } = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  
  const handleSuccess = () => {
    // Redirigir a la página de mis solicitudes
    window.location.href = "/credit/my-applications"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CreditApplicationForm
        listingId={listing?._id?.toString()}
        listingTitle={listing ? `${listing.brand} ${listing.model} ${listing.year}` : undefined}
        listingPrice={listing?.price}
        onSuccess={handleSuccess}
      />
    </div>
  )
}