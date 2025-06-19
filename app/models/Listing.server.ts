import { ObjectId } from 'mongodb'
import { db } from '~/lib/db.server'

export interface Listing {
  _id?: ObjectId
  user: ObjectId // admin que publicó
  title: string
  description?: string
  brand: string
  model: string
  year: number
  price: number
  images: string[] // array de URLs de imágenes
  videos?: string[] // array de URLs de videos
  likesCount: number
  viewsCount: number
  status: 'active' | 'sold' | 'reserved' | 'inactive'
  features?: string[] // características especiales
  mileage?: number // kilometraje
  fuelType?: 'gasolina' | 'diesel' | 'hibrido' | 'electrico'
  transmission?: 'manual' | 'automatico'
  bodyType?: 'sedan' | 'suv' | 'hatchback' | 'pickup' | 'coupe' | 'convertible'
  color?: string
  location?: {
    city: string
    state: string
  }
  contactInfo?: {
    phone?: string
    whatsapp?: string
    email?: string
  }
  createdAt: Date
  updatedAt: Date
  soldAt?: Date
  isFeatured?: boolean // para destacar ciertos autos
}

export const ListingModel = {
  // Crear listing (solo admins)
  async create(listingData: Omit<Listing, '_id' | 'likesCount' | 'viewsCount' | 'createdAt' | 'updatedAt' | 'status'>) {
    const listing = {
      ...listingData,
      user: new ObjectId(listingData.user),
      images: listingData.images || [],
      videos: listingData.videos || [],
      likesCount: 0,
      viewsCount: 0,
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection<Listing>('listings').insertOne(listing)
    return { ...listing, _id: result.insertedId }
  },

  // Buscar por ID
  async findById(id: string) {
    return await db.collection<Listing>('listings').findOne({ 
      _id: new ObjectId(id) 
    })
  },

  // Buscar con información del usuario que lo publicó
  async findByIdWithUser(id: string) {
    const result = await db.collection<Listing>('listings').aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'owner',
          pipeline: [{ $project: { passwordHash: 0 } }]
        }
      },
      { $unwind: '$owner' }
    ]).toArray()
    
    return result[0] || null
  },

  // Incrementar contador de vistas
  async incrementViews(id: string) {
    await db.collection<Listing>('listings').updateOne(
      { _id: new ObjectId(id) },
      { 
        $inc: { viewsCount: 1 },
        $set: { updatedAt: new Date() }
      }
    )
  },

  // Listar listings con filtros avanzados
  async findMany(filters: {
    search?: string
    brand?: string
    model?: string
    minYear?: number
    maxYear?: number
    minPrice?: number
    maxPrice?: number
    fuelType?: string
    transmission?: string
    bodyType?: string
    color?: string
    city?: string
    status?: Listing['status']
    isFeatured?: boolean
    limit?: number
    skip?: number
    sortBy?: 'recent' | 'price_low' | 'price_high' | 'popular' | 'views'
    userId?: string // para filtrar por usuario específico
  } = {}) {
    const {
      search,
      brand,
      model,
      minYear,
      maxYear,
      minPrice,
      maxPrice,
      fuelType,
      transmission,
      bodyType,
      color,
      city,
      status,
      isFeatured,
      limit = 20,
      skip = 0,
      sortBy = 'recent',
      userId
    } = filters

    const query: any = {}
    
    // Solo filtrar por status si se proporciona uno
    if (status) {
      query.status = status
    }

    // Filtro de búsqueda en múltiples campos
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { color: { $regex: search, $options: 'i' } }
      ]
    }

    // Filtros específicos
    if (brand) query.brand = { $regex: brand, $options: 'i' }
    if (model) query.model = { $regex: model, $options: 'i' }
    if (fuelType) query.fuelType = fuelType
    if (transmission) query.transmission = transmission
    if (bodyType) query.bodyType = bodyType
    if (color) query.color = { $regex: color, $options: 'i' }
    if (city) query['location.city'] = { $regex: city, $options: 'i' }
    if (userId) query.user = new ObjectId(userId)
    if (typeof isFeatured === 'boolean') query.isFeatured = isFeatured

    // Filtros de rango
    if (minYear || maxYear) {
      query.year = {}
      if (minYear) query.year.$gte = minYear
      if (maxYear) query.year.$lte = maxYear
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = minPrice
      if (maxPrice) query.price.$lte = maxPrice
    }

    // Definir orden
    let sortStage: any = { createdAt: -1 }
    switch (sortBy) {
      case 'price_low':
        sortStage = { price: 1 }
        break
      case 'price_high':
        sortStage = { price: -1 }
        break
      case 'popular':
        sortStage = { likesCount: -1, createdAt: -1 }
        break
      case 'views':
        sortStage = { viewsCount: -1, createdAt: -1 }
        break
      default:
        sortStage = { createdAt: -1 }
    }

    return await db.collection<Listing>('listings').aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'owner',
          pipeline: [{ $project: { passwordHash: 0, likedListings: 0 } }]
        }
      },
      { $unwind: '$owner' },
      { $sort: sortStage },
      { $skip: skip },
      { $limit: limit }
    ]).toArray()
  },

  // Listings destacados
  async findFeatured(limit = 6) {
    return await this.findMany({ 
      isFeatured: true, 
      limit,
      sortBy: 'popular'
    })
  },

  // Listings más gustados
  async findMostLiked(limit = 10, timeframe?: 'week' | 'month') {
    const query: any = { status: 'active', likesCount: { $gt: 0 } }
    
    if (timeframe) {
      const date = new Date()
      if (timeframe === 'week') {
        date.setDate(date.getDate() - 7)
      } else if (timeframe === 'month') {
        date.setMonth(date.getMonth() - 1)
      }
      query.createdAt = { $gte: date }
    }

    return await db.collection<Listing>('listings').aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'owner',
          pipeline: [{ $project: { passwordHash: 0 } }]
        }
      },
      { $unwind: '$owner' },
      { $sort: { likesCount: -1, createdAt: -1 } },
      { $limit: limit }
    ]).toArray()
  },

  // Buscar autos similares
  async findSimilar(listingId: string, limit = 6) {
    const listing = await this.findById(listingId)
    if (!listing) return []

    const priceRange = listing.price * 0.3 // ±30% del precio
    const yearRange = 3

    return await db.collection<Listing>('listings').aggregate([
      { 
        $match: { 
          _id: { $ne: new ObjectId(listingId) },
          status: 'active',
          $or: [
            { brand: listing.brand },
            { 
              brand: listing.brand, 
              year: { 
                $gte: listing.year - yearRange, 
                $lte: listing.year + yearRange 
              } 
            },
            {
              price: {
                $gte: listing.price - priceRange,
                $lte: listing.price + priceRange
              }
            }
          ]
        } 
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'owner',
          pipeline: [{ $project: { passwordHash: 0 } }]
        }
      },
      { $unwind: '$owner' },
      { $sort: { likesCount: -1, createdAt: -1 } },
      { $limit: limit }
    ]).toArray()
  },

  // Estadísticas por marca (solo activos)
  async getBrandStats() {
    return await db.collection<Listing>('listings').aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalLikes: { $sum: '$likesCount' },
          avgYear: { $avg: '$year' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]).toArray()
  },

  // Estadísticas por marca (todos los status) - para admin
  async getAllBrandStats() {
    return await db.collection<Listing>('listings').aggregate([
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalLikes: { $sum: '$likesCount' },
          avgYear: { $avg: '$year' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 50 }
    ]).toArray()
  },

  // Estadísticas generales
  async getStats() {
    const pipeline = [
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalViews: { $sum: '$viewsCount' },
          totalLikes: { $sum: '$likesCount' }
        }
      }
    ]

    const statusStats = await db.collection<Listing>('listings').aggregate(pipeline).toArray()
    const total = await db.collection<Listing>('listings').countDocuments()
    const recentCount = await db.collection<Listing>('listings').countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // últimos 30 días
    })

    return {
      total,
      recentCount,
      byStatus: statusStats.reduce((acc, stat) => {
        acc[stat._id] = {
          count: stat.count,
          avgPrice: stat.avgPrice,
          totalViews: stat.totalViews,
          totalLikes: stat.totalLikes
        }
        return acc
      }, {} as Record<string, any>)
    }
  },

  // Actualizar listing
  async update(id: string, updateData: Partial<Omit<Listing, '_id' | 'user' | 'createdAt' | 'likesCount' | 'viewsCount'>>) {
    const result = await db.collection<Listing>('listings').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date()
        } 
      }
    )
    return result.modifiedCount > 0
  },

  // Cambiar estado del listing
  async updateStatus(id: string, status: Listing['status'], soldAt?: Date) {
    const updateData: any = { 
      status,
      updatedAt: new Date()
    }
    
    if (status === 'sold' && soldAt) {
      updateData.soldAt = soldAt
    }

    const result = await db.collection<Listing>('listings').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    return result.modifiedCount > 0
  },

  // Marcar/desmarcar como destacado
  async toggleFeatured(id: string) {
    const listing = await this.findById(id)
    if (!listing) return false

    const result = await db.collection<Listing>('listings').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          isFeatured: !listing.isFeatured,
          updatedAt: new Date()
        } 
      }
    )
    return result.modifiedCount > 0
  },

  // Eliminar listing
  async delete(id: string) {
    // Primero remover de los likes de usuarios
    await db.collection('users').updateMany(
      { likedListings: new ObjectId(id) },
      { $pull: { likedListings: new ObjectId(id) } }
    )

    // Luego eliminar el listing
    const result = await db.collection<Listing>('listings').deleteOne({ 
      _id: new ObjectId(id) 
    })
    return result.deletedCount > 0
  },

  // Verificar si el usuario es dueño del listing
  async isOwner(listingId: string, userId: string) {
    const listing = await db.collection<Listing>('listings').findOne(
      { 
        _id: new ObjectId(listingId),
        user: new ObjectId(userId)
      },
      { projection: { _id: 1 } }
    )
    return !!listing
  },

  // Buscar por múltiples IDs
  async findByIds(ids: string[]) {
    const objectIds = ids.map(id => new ObjectId(id))
    return await db.collection<Listing>('listings')
      .find({ _id: { $in: objectIds } })
      .toArray()
  },

  // Duplicar listing (para admins)
  async duplicate(listingId: string, userId: string) {
    const originalListing = await this.findById(listingId)
    if (!originalListing) return null

    const { _id, createdAt, updatedAt, likesCount, viewsCount, ...listingData } = originalListing
    
    return await this.create({
      ...listingData,
      title: `${listingData.title} (Copia)`,
      user: new ObjectId(userId)
    })
  }
}