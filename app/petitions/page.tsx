"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getAllPetitions } from "@/lib/petitions"
import type { Petition } from "@/types/petition"

export default function PetitionsPage() {
  const [petitions, setPetitions] = useState<Petition[]>([])
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPetitions = async () => {
      try {
        setIsLoading(true)
        const data = await getAllPetitions()
        setPetitions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load petitions")
      } finally {
        setIsLoading(false)
      }
    }

    loadPetitions()
  }, [])

  const filteredPetitions = petitions.filter((petition) => {
    const matchesFilter = filter === "all" || petition.status === filter
    const matchesSearch =
      petition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      petition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      petition.nationality.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

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
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border-2 border-gray-300 rounded-lg p-6">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              ))}
            </div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">All Petitions</h1>
          <p className="text-gray-600">Browse and sign petitions from verified citizens worldwide.</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search petitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="under_review">Under Review</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Petitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPetitions.map((petition) => (
            <div
              key={petition.id}
              className="bg-white border-2 border-gray-300 rounded-lg hover:border-black transition-colors"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(petition.status)}`}>
                    {petition.status.replace("_", " ").toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">{petition.nationality}</span>
                </div>

                <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">{petition.title}</h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{petition.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>By {petition.creatorName}</span>
                  <span>{formatDate(petition.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium text-black">{petition.signatures}</span>
                    <span className="text-gray-500"> signatures</span>
                  </div>
                  <Link
                    href={`/petitions/${petition.id}`}
                    className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    View & Sign
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPetitions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No petitions found matching your criteria.</p>
            <Link
              href="/create-petition"
              className="inline-block mt-4 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Create the First Petition
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
