interface ConvertRequest {
  from: string
  to: string
  amount: number
}

export async function POST(request: Request) {
  try {
    const body: ConvertRequest = await request.json()
    const { from, to, amount } = body

    if (!from || !to || amount === undefined) {
      return Response.json({ error: "Missing required parameters" }, { status: 400 })
    }

    if (Number.parseFloat(String(amount)) <= 0) {
      return Response.json({ error: "Amount must be greater than 0" }, { status: 400 })
    }

    const apiUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from.toLowerCase()}.json`
    const response = await fetch(apiUrl)

    if (!response.ok) {
      return Response.json({ error: "Failed to fetch exchange rate" }, { status: 500 })
    }

    const data = await response.json()

    // The API returns { currencyCode: { targetCurrency: rate, ... } }
    const rates = data[from.toLowerCase()]
    if (!rates || !rates[to.toLowerCase()]) {
      return Response.json({ error: `Exchange rate for ${to} not found` }, { status: 404 })
    }

    const rate = rates[to.toLowerCase()]
    const convertedAmount = amount * rate

    return Response.json({
      from,
      to,
      amount,
      rate,
      convertedAmount: Number.parseFloat(convertedAmount.toFixed(2)),
    })
  } catch (error) {
    console.error("[v0] Conversion error:", error)
    return Response.json({ error: "Failed to convert currency" }, { status: 500 })
  }
}
