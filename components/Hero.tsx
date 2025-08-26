import Link from "next/link"

export default function Hero() {
  return (
    <section className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Voice, <span className="text-gray-300">Verified</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-300">
            Create and sign petitions with verified nationality. Make your voice heard in a trusted, transparent
            platform where every signature counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create-petition"
              className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Create Petition
            </Link>
            <Link
              href="/petitions"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-black transition-colors"
            >
              View Petitions
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
