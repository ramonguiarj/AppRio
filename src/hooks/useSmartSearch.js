import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function normalizar(valor = "") {
  return String(valor).toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filtrar(lista, termo) {
  const consulta = normalizar(termo.trim());
  return lista.filter((item) => {
    const tags = Array.isArray(item.tags) ? item.tags.join(" ") : "";
    const texto = [item.name, item.nome, item.bairro, item.address, item.endereco, tags].filter(Boolean).join(" ");
    return normalizar(texto).includes(consulta);
  });
}

export function useSmartSearch(listaLocal, categoria, idioma = "pt") {
  const [termo, setTermo] = useState("");
  const [resultados, setResultados] = useState(listaLocal);
  const [carregando, setCarregando] = useState(false);
  const [origem, setOrigem] = useState("local");
  const [erro, setErro] = useState(null);
  const timerRef = useRef(null);
  const controllerRef = useRef(null);
  const sequenceRef = useRef(0);

  useEffect(() => () => { clearTimeout(timerRef.current); controllerRef.current?.abort(); }, []);

  const ordenados = useMemo(
    () => [...listaLocal].sort((a, b) => (b.rating || b.avaliacao || 0) - (a.rating || a.avaliacao || 0)),
    [listaLocal]
  );

  const buscar = useCallback((novoTermo) => {
    const consulta = String(novoTermo || "").slice(0, 120);
    setTermo(consulta);
    setErro(null);
    clearTimeout(timerRef.current);
    controllerRef.current?.abort();
    const sequence = ++sequenceRef.current;

    if (!consulta.trim()) {
      setResultados(ordenados);
      setOrigem("local");
      setCarregando(false);
      return;
    }

    const locais = filtrar(listaLocal, consulta);
    if (locais.length) {
      setResultados(locais);
      setOrigem("local");
      setCarregando(false);
      return;
    }

    setResultados([]);
    setOrigem("vazio");
    setCarregando(consulta.trim().length >= 3);
    if (consulta.trim().length < 3) return;

    timerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      controllerRef.current = controller;
      try {
        const params = new URLSearchParams({ q: consulta.trim(), categoria, idioma });
        const response = await fetch(`/api/search-places?${params}`, { signal: controller.signal });
        const data = await response.json();
        if (sequence !== sequenceRef.current) return;
        if (!response.ok) throw new Error("search_failed");
        const lugares = (data.lugares || []).map((place) => ({
          id: place.id,
          name: place.nome || "",
          cat: categoria,
          bairro: place.endereco || "",
          lat: place.lat,
          lng: place.lng,
          rating: place.avaliacao || 0,
          price: "",
          tip: "",
          origem: "google",
        }));
        setResultados(lugares);
        setOrigem(lugares.length ? "google" : "vazio");
      } catch (error) {
        if (error.name !== "AbortError" && sequence === sequenceRef.current) {
          setErro(idioma === "en" ? "Search is temporarily unavailable. Please try again." : idioma === "es" ? "La búsqueda no está disponible ahora. Inténtalo de nuevo." : "A busca está temporariamente indisponível. Tente novamente.");
          setOrigem("vazio");
        }
      } finally {
        if (sequence === sequenceRef.current) setCarregando(false);
      }
    }, 350);
  }, [listaLocal, ordenados, categoria, idioma]);

  return { termo, resultados, results: resultados, carregando, origem, erro, buscar };
}
