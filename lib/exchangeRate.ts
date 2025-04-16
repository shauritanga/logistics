export async function getExchangeRate() {
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/USD`
    );
    const data = await response.json();
    console.log(data);
    return data.rates.TZS;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    // Fallback to a reasonable rate if API fails
    return 2500;
  }
}
