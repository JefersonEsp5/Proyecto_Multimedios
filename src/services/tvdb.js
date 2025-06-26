// src/services/tvdb.js
const API_KEY = "982d1ecc-d171-4565-9a7b-bad631dcc8c8";
const BASE_URL = "https://api4.thetvdb.com/v4";

let token = localStorage.getItem("tvdb_token");

// Función para hacer peticiones autenticadas
async function makeAuthenticatedRequest(url, options = {}) {
  try {
    // Si no tenemos token, autenticamos primero
    if (!token) {
      token = await authenticate();
      if (!token) throw new Error("No se pudo obtener el token");
    }

    // Configuración por defecto para las peticiones
    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const response = await fetch(`${BASE_URL}${url}`, defaultOptions);

    // Si el token ha expirado (401), intentamos renovarlo y repetir la petición
    if (response.status === 401) {
      token = await authenticate();
      if (!token) throw new Error("No se pudo renovar el token");
      
      defaultOptions.headers.Authorization = `Bearer ${token}`;
      const retryResponse = await fetch(`${BASE_URL}${url}`, defaultOptions);
      
      if (!retryResponse.ok) throw new Error(`Error ${retryResponse.status}: ${retryResponse.statusText}`);
      return await retryResponse.json();
    }

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

    return await response.json();
  } catch (error) {
    console.error(`Error en la petición a ${url}:`, error);
    throw error;
  }
}

// Autenticación
async function authenticate() {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apikey: API_KEY })
    });

    if (!response.ok) throw new Error("Error en la autenticación");

    const data = await response.json();
    token = data.data.token;
    localStorage.setItem("tvdb_token", token);
    return token;
  } catch (error) {
    console.error("Error al autenticarse:", error);
    return null;
  }
}

// Obtener películas populares
async function getPopularMovies(page = 1) {
  try {
    const data = await makeAuthenticatedRequest(`/movies?page=${page}`);
    
    // Procesamos los datos para adaptarlos a nuestra interfaz
    return data.data.map(movie => ({
      id: movie.id,
      title: movie.name,
      poster: movie.image ? `https://artworks.thetvdb.com${movie.image}` : 'https://via.placeholder.com/300x450?text=No+Poster',
      rating: movie.score ? movie.score.toFixed(1) : 'N/A',
      year: movie.year,
      description: movie.overview
    }));
  } catch (error) {
    console.error("Error al obtener películas populares:", error);
    return [];
  }
}

// Obtener información extendida de una película
async function getMovieDetails(movieId) {
  try {
    const data = await makeAuthenticatedRequest(`/movies/${movieId}/extended`);
    return data.data;
  } catch (error) {
    console.error("Error al obtener detalles de la película:", error);
    return null;
  }
}

// Obtener series populares
async function getPopularSeries(page = 1, limit = 30) {
  try {
    const data = await makeAuthenticatedRequest(`/series?page=${page}`);
    
    // Procesamos los datos para adaptarlos a nuestra interfaz
    const processedSeries = data.data.map(series => ({
      id: series.id,
      title: series.name || 'Título no disponible',
      poster: series.image ? `https://artworks.thetvdb.com${series.image}` : null,
      rating: series.score ? series.score.toFixed(1) : 'N/A',
      year: series.year || 'Año no disponible',
      description: series.overview || 'Descripción no disponible'
    }));

    // Filtramos series sin imagen y limitamos el resultado
    return processedSeries
      .filter(series => series.poster)
      .slice(0, limit);
  } catch (error) {
    console.error("Error al obtener series populares:", error);
    return [];
  }
}

// Obtener información extendida de una serie
async function getSeriesDetails(seriesId) {
  try {
    const data = await makeAuthenticatedRequest(`/series/${seriesId}/extended`);
    return data.data;
  } catch (error) {
    console.error("Error al obtener detalles de la serie:", error);
    return null;
  }
}
// --- Nueva función de búsqueda genérica ---
// --- FUNCIÓN searchMedia CON LOGS DETALLADOS ---
async function searchMedia(query) {
        console.log(`TVDB Service: Query received in searchMedia: ${query}`);
        try {
            const url = `/search?query=${encodeURIComponent(query)}`;
            console.log(`TVDB Service: Search URL constructed: ${url}`);
            const response = await makeAuthenticatedRequest(url);
            console.log("TVDB Service: RAW API search response:", response);

            if (response && response.data) {
                const TVDB_ARTWORKS_BASE_URL = "https://api4.thetvdb.com";
                const processedResults = response.data.map(item => {
                    let posterUrl = item.image || item.poster || null; // Use the correct property for poster from the raw API response

                    // --- FIX: Clean up the poster URL here ---
                    if (posterUrl && typeof posterUrl === 'string') {
                        // Remove any potential duplicate base URLs
                        if (posterUrl.startsWith(TVDB_ARTWORKS_BASE_URL) && posterUrl.indexOf(TVDB_ARTWORKS_BASE_URL, 1) !== -1) {
                            posterUrl = posterUrl.substring(TVDB_ARTWORKS_BASE_URL.length);
                        }
                        // Ensure it has the correct base URL if it's a relative path or missing it
                        if (posterUrl && !posterUrl.startsWith('http')) { // If it's not an absolute URL already
                            posterUrl = TVDB_ARTWORKS_BASE_URL + (posterUrl.startsWith('/') ? '' : '/') + posterUrl;
                        }
                    }
                    // --- END FIX ---

                    return {
                        id: item.id,
                        type: item.type, // Assuming 'movie' or 'series' directly from API
                        title: item.name || item.title || 'N/A', // Use item.name for series, item.title for movies
                        poster: posterUrl,
                        year: item.year || 'N/A',
                        rating: item.score ? item.score.toFixed(1) : 'N/A', // Assuming score is a number
                        description: item.overview || 'No description available.',
                        // Add other fields you need
                    };
                });
                console.log(`TVDB Service: Processed results count: ${processedResults.length}`);
                console.log("TVDB Service: First processed results (sample):", processedResults.slice(0, 3));
                return processedResults;
            }
            return [];
        } catch (error) {
            console.error("TVDB Service: Error searching media:", error);
            throw new Error(`Failed to search media: ${error.message}`);
        } finally {
            console.log("TVDB Service: --- EXITING searchMedia ---");
        }
    }


export { 
  getPopularMovies, 
  getMovieDetails,
  getPopularSeries,
  getSeriesDetails,
  searchMedia
};