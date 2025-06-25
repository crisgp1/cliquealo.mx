import { ObjectId } from 'mongodb'
import { db } from '~/lib/db.server'

export interface BankPartner {
  _id?: ObjectId
  name: string
  logo?: string
  creditRate: number // Tasa de interés anual (EDITABLE)
  minTerm: number // Plazo mínimo en meses (FIJO)
  maxTerm: number // Plazo máximo en meses (FIJO)
  requirements: string[] // Requisitos específicos del banco (FIJO)
  processingTime: number // Tiempo de procesamiento en días (FIJO)
  isActive: boolean
  contactInfo?: {
    phone?: string
    email?: string
    website?: string
  }
  createdAt: Date
  updatedAt: Date
  createdBy: ObjectId // Admin que lo creó
}

export const BankPartnerModel = {
  // Crear nuevo aliado bancario
  async create(partnerData: Omit<BankPartner, '_id' | 'createdAt' | 'updatedAt'>) {
    const partner = {
      ...partnerData,
      createdBy: new ObjectId(partnerData.createdBy),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection<BankPartner>('bank_partners').insertOne(partner)
    return { ...partner, _id: result.insertedId }
  },

  // Buscar por ID
  async findById(id: string) {
    return await db.collection<BankPartner>('bank_partners').findOne({ 
      _id: new ObjectId(id) 
    })
  },

  // Listar todos los aliados bancarios
  async findAll(filters: {
    isActive?: boolean
    search?: string
    limit?: number
    skip?: number
  } = {}) {
    const {
      isActive,
      search,
      limit = 50,
      skip = 0
    } = filters

    const query: any = {}

    if (typeof isActive === 'boolean') {
      query.isActive = isActive
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'contactInfo.email': { $regex: search, $options: 'i' } }
      ]
    }

    return await db.collection<BankPartner>('bank_partners').aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creator',
          pipeline: [{ $project: { passwordHash: 0 } }]
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]).toArray()
  },

  // Obtener aliados bancarios activos para el simulador
  async findActiveForSimulator() {
    return await db.collection<BankPartner>('bank_partners').find({ 
      isActive: true 
    }).sort({ creditRate: 1 }).toArray() // Ordenar por tasa más baja primero
  },

  // Actualizar aliado bancario (solo tasa de interés y estado activo)
  async update(id: string, updateData: { creditRate?: number; isActive?: boolean }) {
    const result = await db.collection<BankPartner>('bank_partners').updateOne(
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

  // Actualizar solo la tasa de interés
  async updateCreditRate(id: string, creditRate: number) {
    const result = await db.collection<BankPartner>('bank_partners').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          creditRate,
          updatedAt: new Date()
        }
      }
    )
    return result.modifiedCount > 0
  },

  // Cambiar estado activo/inactivo
  async toggleActive(id: string) {
    const partner = await this.findById(id)
    if (!partner) return false

    const result = await db.collection<BankPartner>('bank_partners').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isActive: !partner.isActive,
          updatedAt: new Date()
        }
      }
    )
    return result.modifiedCount > 0
  },

  // Eliminar aliado bancario
  async delete(id: string) {
    const result = await db.collection<BankPartner>('bank_partners').deleteOne({ 
      _id: new ObjectId(id) 
    })
    return result.deletedCount > 0
  },

  // Obtener estadísticas
  async getStats() {
    const pipeline = [
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          avgRate: { $avg: '$creditRate' },
          minRate: { $min: '$creditRate' },
          maxRate: { $max: '$creditRate' }
        }
      }
    ]

    const result = await db.collection<BankPartner>('bank_partners').aggregate(pipeline).toArray()
    return result[0] || {
      total: 0,
      active: 0,
      avgRate: 0,
      minRate: 0,
      maxRate: 0
    }
  },

  // Buscar el mejor aliado para un monto y plazo específico
  async findBestMatch(amount: number, term: number) {
    return await db.collection<BankPartner>('bank_partners').find({
      isActive: true,
      minTerm: { $lte: term },
      maxTerm: { $gte: term }
    }).sort({ creditRate: 1 }).limit(3).toArray() // Top 3 mejores opciones
  }
}