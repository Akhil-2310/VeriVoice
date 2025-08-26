"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NationalityVerification from "@/components/NationalityVerification"
import { getPetitionById, signPetition, checkIfUserSigned } from "@/lib/petitions"
import type { Petition, NationalityVerification as NationalityVerificationType } from "@/types/petition"

export default function PetitionDetailPage() {
  const params = useParams()
  const [petition, setPetition] = useState<Petition | null>(null)
  const [showVerification, setShowVerification] = useState(false)
  const [hasSigned, setHasSigned] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSigningLoading, setIsSigningLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPetition = async () => {
      try {
        setIsLoading(true)
        const data = await getPetitionById(params.id as string)
        setPetition(data)

        // Check if user has already signed (in a real app, you'd check against authenticated user)
        if (data) {
          const userSigned = await checkIfUserSigned(data.id, "Anonymous User")
          setHasSigned(userSigned)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load petition")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadPetition()
    }
  }, [params.id])

  const handleSignPetition = () => {
    if (!petition) return
    setShowVerification(true)
  }

  const handleVerificationComplete = async (verification: NationalityVerificationType) => {
    if (!petition) return

    try {
      setIsSigningLoading(true)
      await signPetition(petition.id, {
        name: verification.fullName,
        nationality: verification.nationality,
      })

      // Reload petition data to get updated signature count
      const updatedPetition = await getPetitionById(petition.id)
      if (updatedPetition) {
        setPetition(updatedPetition)
      }

      setHasSigned(true)
      setShowVerification(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign petition")
    } finally {
      setIsSigningLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-white text-black border-2 border-black"
      case "under_review":
        return "bg-gray-200 text-black border-2 border-gray-400"
      case "closed":
        return "bg-gray-400 text-white border-2 border-gray-600"
      default:
        return "bg-gray-100 text-black border-2 border-gray-300"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="h-32 bg-gray-300 rounded mb-8"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white border-2 border-black rounded-lg p-6">
            <div className="flex items-center">
              <span className="text-black mr-2">❌</span>
              <span className="text-black">{error}</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!petition) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black mb-4">Petition Not Found</h1>
            <p className="text-gray-600">The petition you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border-2 border-gray-300 rounded-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(petition.status)}`}>
                {petition.status.replace("_", " ").toUpperCase()}
              </span>
              <span className="text-sm text-gray-500 bg-gray-100 border border-gray-300 px-3 py-1 rounded-full">
                {petition.nationality} Petition
              </span>
            </div>

            <h1 className="text-3xl font-bold text-black mb-4">{petition.title}</h1>

            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>
                Created by <strong>{petition.creatorName}</strong>
              </span>
              <span>•</span>
              <span>{formatDate(petition.createdAt)}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{petition.description}</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="mb-8">
            <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-black">Signatures</h3>
                <span className="text-2xl font-bold text-black">{petition.signatures}</span>
              </div>

              {petition.status === "active" && !hasSigned && (
                <button
                  onClick={handleSignPetition}
                  disabled={isSigningLoading}
                  className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSigningLoading ? "Signing..." : "Sign This Petition"}
                </button>
              )}

              {hasSigned && (
                <div className="bg-white border-2 border-black rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-black mr-2">✅</span>
                    <span className="text-black font-medium">Thank you for signing this petition!</span>
                  </div>
                </div>
              )}

              {petition.status !== "active" && (
                <div className="bg-gray-200 border-2 border-gray-400 rounded-lg p-4">
                  <span className="text-gray-600">This petition is no longer accepting signatures.</span>
                </div>
              )}
            </div>
          </div>

          {/* Recent Signers */}
          {petition.signers.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-black mb-4">Recent Signers</h3>
              <div className="space-y-3">
                {petition.signers.slice(0, 5).map((signer) => (
                  <div key={signer.id} className="flex items-center justify-between py-2 border-b border-gray-300">
                    <div>
                      <span className="font-medium text-black">{signer.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({signer.nationality})</span>
                    </div>
                    <div className="text-sm text-gray-500">{formatDate(signer.signedAt)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="border-t-2 border-gray-300 pt-6">
            <h3 className="text-lg font-semibold text-black mb-4">Share This Petition</h3>
            <div className="flex space-x-4">
              <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                Share on Facebook
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                Share on Twitter
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>

      {showVerification && (
        <NationalityVerification
          requiredNationality={petition.nationality}
          onComplete={handleVerificationComplete}
          onCancel={() => setShowVerification(false)}
        />
      )}

      <Footer />
    </div>
  )
}
