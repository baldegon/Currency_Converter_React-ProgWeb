import CurrencyConverter from "@/components/currency-converter"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <CurrencyConverter />
    </main>
  )
}
