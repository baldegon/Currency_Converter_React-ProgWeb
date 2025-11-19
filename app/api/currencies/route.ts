export async function GET() {
  try {
    const apiUrl = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json"
    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error("Failed to fetch from currency API")
    }

    const data = await response.json()

    // The API returns an object with currency codes as keys
    // Transform it to our expected format
    const currencies = Object.entries(data).map(([code, name]: [string, any]) => ({
      code: code.toUpperCase(),
      name: typeof name === "string" ? name : code.toUpperCase(),
      symbol: getCurrencySymbol(code.toUpperCase()),
    }))

    return Response.json(currencies)
  } catch (error) {
    console.error("[v0] Error fetching currencies:", error)
    return Response.json({ error: "Failed to fetch currencies" }, { status: 500 })
  }
}

// Helper function to get currency symbols
function getCurrencySymbol(code: string): string {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    CHF: "CHF",
    CNY: "¥",
    SEK: "kr",
    NZD: "NZ$",
    MXN: "$",
    SGD: "S$",
    HKD: "HK$",
    NOK: "kr",
    KRW: "₩",
    INR: "₹",
    BRL: "R$",
    ZAR: "R",
    AED: "د.إ",
    SAR: "﷼",
    QAR: "﷼",
    KWD: "د.ك",
    BHD: ".د.ب",
    OMR: "ر.ع.",
    JOD: "د.ا",
    ILS: "₪",
    PKR: "₨",
    LKR: "Rs",
    THB: "฿",
    MYR: "RM",
    PHP: "₱",
    IDR: "Rp",
    VND: "₫",
    BDT: "Tk",
    NGN: "₦",
    GHS: "₵",
    KES: "KSh",
    ZWL: "Z$",
  }
  return symbols[code] || code
}
