export interface Petition {
    id: string
    title: string
    description: string
    nationality: string
    creatorName: string
    createdAt: string
    signatures: number
    status: "active" | "closed" | "under_review"
    signers: Signer[]
  }
  
  export interface Signer {
    id: string
    name: string
    nationality: string
    signedAt: string
    verified: boolean
  }
  
  export interface NationalityVerification {
    nationality: string
    fullName: string
    selfVerified: boolean
  }
  
  export type NationalityVerificationType = NationalityVerification
  