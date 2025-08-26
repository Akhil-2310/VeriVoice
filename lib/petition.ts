import { supabase } from "./supabase"
import type { Petition } from "@/types/petition"

export async function createPetition(petitionData: {
  title: string
  description: string
  nationality: string
  creatorName: string
}) {
  const { data, error } = await supabase
    .from("petitions")
    .insert({
      title: petitionData.title,
      description: petitionData.description,
      nationality: petitionData.nationality,
      creator_name: petitionData.creatorName,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create petition: ${error.message}`)
  }

  return data
}

export async function getAllPetitions(): Promise<Petition[]> {
  const { data: petitions, error: petitionsError } = await supabase
    .from("petitions")
    .select("*")
    .order("created_at", { ascending: false })

  if (petitionsError) {
    throw new Error(`Failed to fetch petitions: ${petitionsError.message}`)
  }

  // Get signers for each petition
  const petitionsWithSigners = await Promise.all(
    petitions.map(async (petition) => {
      const { data: signers, error: signersError } = await supabase
        .from("signers")
        .select("*")
        .eq("petition_id", petition.id)
        .order("signed_at", { ascending: false })

      if (signersError) {
        console.error(`Failed to fetch signers for petition ${petition.id}:`, signersError.message)
        return {
          ...petition,
          signers: [],
        }
      }

      return {
        ...petition,
        signers: signers.map((signer) => ({
          id: signer.id,
          name: signer.name,
          nationality: signer.nationality,
          signedAt: signer.signed_at,
          verified: signer.verified,
        })),
      }
    }),
  )

  return petitionsWithSigners.map((petition) => ({
    id: petition.id,
    title: petition.title,
    description: petition.description,
    nationality: petition.nationality,
    creatorName: petition.creator_name,
    createdAt: petition.created_at,
    signatures: petition.signatures,
    status: petition.status as "active" | "closed" | "under_review",
    signers: petition.signers,
  }))
}

export async function getPetitionById(id: string): Promise<Petition | null> {
  const { data: petition, error: petitionError } = await supabase.from("petitions").select("*").eq("id", id).single()

  if (petitionError) {
    if (petitionError.code === "PGRST116") {
      return null // Petition not found
    }
    throw new Error(`Failed to fetch petition: ${petitionError.message}`)
  }

  // Get signers for this petition
  const { data: signers, error: signersError } = await supabase
    .from("signers")
    .select("*")
    .eq("petition_id", id)
    .order("signed_at", { ascending: false })

  if (signersError) {
    throw new Error(`Failed to fetch signers: ${signersError.message}`)
  }

  return {
    id: petition.id,
    title: petition.title,
    description: petition.description,
    nationality: petition.nationality,
    creatorName: petition.creator_name,
    createdAt: petition.created_at,
    signatures: petition.signatures,
    status: petition.status as "active" | "closed" | "under_review",
    signers: signers.map((signer) => ({
      id: signer.id,
      name: signer.name,
      nationality: signer.nationality,
      signedAt: signer.signed_at,
      verified: signer.verified,
    })),
  }
}

export async function signPetition(
  petitionId: string,
  signerData: {
    name: string
    nationality: string
  },
) {
  const { data, error } = await supabase
    .from("signers")
    .insert({
      petition_id: petitionId,
      name: signerData.name,
      nationality: signerData.nationality,
      verified: true,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to sign petition: ${error.message}`)
  }

  return data
}

export async function checkIfUserSigned(petitionId: string, userName: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("signers")
    .select("id")
    .eq("petition_id", petitionId)
    .eq("name", userName)
    .limit(1)

  if (error) {
    console.error("Error checking if user signed:", error.message)
    return false
  }

  return data.length > 0
}
