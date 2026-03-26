import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1B3A2D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-2">Home<span className="text-[#D4A24E]">Hawk</span></h3>
            <p className="text-gray-300 text-sm">Professional property check-ins for Minnesota and Wisconsin lake homes.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[#D4A24E]">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/plans" className="block text-sm text-gray-300 hover:text-white">Plans and Pricing</Link>
              <Link href="/signin" className="block text-sm text-gray-300 hover:text-white">Sign In</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[#D4A24E]">Contact</h4>
            <p className="text-sm text-gray-300">info@homehawkservices.com</p>
            <p className="text-sm text-gray-300 mt-1">Minnesota and Wisconsin</p>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-8 pt-6 text-center">
          <p className="text-xs text-gray-400">2026 HomeHawk LLC. All rights reserved.</p>
          <p className="text-xs text-gray-500 mt-1">Peace of mind, one check-in at a time.</p>
        </div>
      </div>
    </footer>
  )
}
