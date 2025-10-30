import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-green-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Ritaj Football Club</h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Réservez votre terrain de foot en 2 clics
          </h2>
          
          <p className="text-xl text-gray-700 mb-8">
            Ritaj vous accueille <strong>tous les jours de 14h à 1h</strong>
          </p>

          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <span className="text-2xl mr-3">⚽</span>
                <div>
                  <h3 className="font-bold text-lg">2 terrains disponibles</h3>
                  <p className="text-gray-600">Terrain Gauche et Terrain Droit</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="text-2xl mr-3">🕐</span>
                <div>
                  <h3 className="font-bold text-lg">Horaires flexibles</h3>
                  <p className="text-gray-600">Créneaux d'1 heure de 14h à 1h du matin</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="text-2xl mr-3">💳</span>
                <div>
                  <h3 className="font-bold text-lg">Paiement à la caisse</h3>
                  <p className="text-gray-600">Réservez maintenant, payez sur place</p>
                </div>
              </div>
            </div>
          </div>

          <Link 
            href="/reserver"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold text-xl py-4 px-12 rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            Réserver un terrain
          </Link>

          <div className="mt-12 text-gray-600">
            <p className="mb-2">Besoin d'aide ?</p>
            <p className="text-2xl font-bold text-green-600">+33 7 45 59 76 46</p>
            <p className="text-sm">Gérant : <strong>Badr IDRISSI</strong></p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Ritaj Football Club - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  )
}