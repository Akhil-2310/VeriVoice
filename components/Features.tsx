export default function Features() {
    const features = [
      {
        title: "Verified Nationality",
        description:
          "Every petition creator and signer must verify their nationality, ensuring authentic representation.",
        icon: "🛡️",
      },
      {
        title: "Government Transparency",
        description: "Government officials can view and respond to petitions from their citizens directly.",
        icon: "🏛️",
      },
      {
        title: "Global Reach",
        description: "Support for all nationalities worldwide, making it truly inclusive and representative.",
        icon: "🌍",
      },
      {
        title: "Secure Platform",
        description: "Built with security and privacy in mind, protecting user data and petition integrity.",
        icon: "🔒",
      },
      {
        title: "Real-time Updates",
        description: "Track petition progress, signatures, and government responses in real-time.",
        icon: "📊",
      },
      {
        title: "Easy to Use",
        description: "Intuitive interface makes creating and signing petitions simple for everyone.",
        icon: "✨",
      },
    ]
  
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Why Choose VeriVoice?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform ensures every voice is authentic, every petition is legitimate, and every signature counts.
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-300 p-8 rounded-xl hover:border-black transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  