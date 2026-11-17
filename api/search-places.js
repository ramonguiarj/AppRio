const CATEGORIAS = {
  hospedagem: "hotel",
  alimentacao: "restaurant",
  diversao: "live music venue OR bar",
  turismo: "tourist attraction",
  praias: "beach",
  compras: "shopping",
  transporte: "public transport",
  servicos: "tourist services",
};
const IDIOMAS = { pt: "pt-BR", en: "en", es: "es" };

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ erro: "Método não permitido." });
  }

  const q = typeof req.query?.q === "string" ? req.query.q.trim() : "";
  const categoria = typeof req.query?.categoria === "string" ? req.query.categoria : "";
  const idioma = typeof req.query?.idioma === "string" ? req.query.idioma : "pt";

  if (q.length < 3 || q.length > 120) {
    return res.status(400).json({ erro: "A busca deve ter entre 3 e 120 caracteres." });
  }
  if (!Object.hasOwn(CATEGORIAS, categoria) || !Object.hasOwn(IDIOMAS, idioma)) {
    return res.status(400).json({ erro: "Categoria ou idioma inválido." });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return res.status(503).json({ erro: "Busca externa indisponível." });

  try {
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.location",
      },
      body: JSON.stringify({
        textQuery: `${q} ${CATEGORIAS[categoria]} Rio de Janeiro`,
        languageCode: IDIOMAS[idioma],
        regionCode: "BR",
        locationBias: {
          circle: { center: { latitude: -22.955, longitude: -43.19 }, radius: 12000 },
        },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) return res.status(502).json({ erro: "Busca externa indisponível." });
    const data = await response.json();
    const lugares = (data.places || []).filter((place) => Number.isFinite(place.location?.latitude) && Number.isFinite(place.location?.longitude)).map((place) => ({
      id: place.id,
      nome: place.displayName?.text ?? "",
      endereco: place.formattedAddress ?? "",
      avaliacao: place.rating ?? null,
      lat: place.location?.latitude ?? null,
      lng: place.location?.longitude ?? null,
      origem: "google",
    }));
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ lugares });
  } catch {
    return res.status(502).json({ erro: "Busca externa indisponível." });
  }
}
