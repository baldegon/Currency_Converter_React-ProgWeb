"use client"

import { useEffect, useState } from "react"
import { ArrowRightLeft } from "lucide-react"

interface Currency {
  id: string
  code: string
  name: string
  symbol: string
}

interface ConversionResult {
  from: string
  to: string
  amount: number
  rate: number
  convertedAmount: number
}

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>("EUR")
  const [amount, setAmount] = useState<string>("1")
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch("/api/currencies")
        if (!response.ok) throw new Error("Failed to fetch currencies")
        const data = await response.json()
        setCurrencies(data)
      } catch (err) {
        setError("Failed to load currencies")
        console.error(err)
      }
    }

    fetchCurrencies()
  }, [])

  // Perform conversion
  const handleConvert = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromCurrency,
          to: toCurrency,
          amount: Number.parseFloat(amount),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Conversion failed")
      }

      const data: ConversionResult = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed")
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  // Swap currencies
  const handleSwap = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  const fromCurrencyData = currencies.find((c) => c.code === fromCurrency)
  const toCurrencyData = currencies.find((c) => c.code === toCurrency)

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border border-blue-100">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Currency Converter</h1>
          <p className="text-gray-600">Convert between different currencies</p>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* From Currency */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            {currencies.map(currency => (
              <option key={currency.id} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleSwap}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition shadow-md"
            title="Swap currencies"
          >
            <ArrowRightLeft size={24} />
          </button>
        </div>

        {/* To Currency */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            {currencies.map(currency => (
              <option key={currency.id} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition mb-6"
        >
          {loading ? "Converting..." : "Convert"}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Conversion Result</p>
              <p className="text-2xl font-bold text-gray-900">
                {result.amount} {fromCurrencyData?.symbol || result.from}
              </p>
            </div>
            <div className="flex items-center justify-center text-gray-400 mb-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3">equals</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">You get</p>
              <p className="text-3xl font-bold text-blue-600">
                {result.convertedAmount} {toCurrencyData?.symbol || result.to}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Exchange rate: 1 {result.from} = {result.rate.toFixed(4)} {result.to}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
