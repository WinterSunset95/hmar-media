import { tablesdb } from '$lib/appwrite';
import { Query } from 'appwrite';
import type { Movie } from '$lib/types';
import { PUBLIC_DATABASE_ID } from '$env/static/public';

const TABLE_ID = 'movies';
const JELLYFIN_BASE = "https://streaming.wintersunset95.in";
const JELLYFIN_API_KEY = import.meta.env.VITE_JELLYFIN_API_KEY || "";

type Provider = "jellyfin" | "inhouse"

export const MovieService = {
	/**
	 * Fetch the entire active movie catalog
	 */
	async getAll(limit = 25): Promise<Movie[]> {
		try {
			const response = await tablesdb.listRows<Movie>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: TABLE_ID,
				queries: [Query.limit(limit)]
      });
			return response.rows;
		} catch (error) {
			console.error('[MovieService.getAll] Failed to fetch movies:', error);
			throw error;
		}
	},

	/**
	 * Fetch a single movie by its ID
	 */
	async getById(movieId: string): Promise<Movie> {
		try {
			return await tablesdb.getRow<Movie>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: TABLE_ID,
				rowId: movieId
      });
		} catch (error) {
			console.error(`[MovieService.getById] Failed to fetch movie ${movieId}:`, error);
			throw error;
		}
	},

	/**
	 * New & Hot: Fetch movies sorted by release date descending
	 */
	async getNewAndHot(limit = 10): Promise<Movie[]> {
		try {
			const response = await tablesdb.listRows<Movie>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: TABLE_ID,
				queries: [
					Query.orderDesc('releaseDate'),
					Query.limit(limit)
				]
      });
			return response.rows;
		} catch (error) {
			console.error('[MovieService.getNewAndHot] Failed:', error);
			throw error;
		}
	},

	/**
	 * Search movies by titles or custom keywords
	 */
	async search(searchTerm: string, limit = 15): Promise<Movie[]> {
		if (!searchTerm.trim()) return [];
		
		try {
			const response = await tablesdb.listRows<Movie>({
				databaseId: PUBLIC_DATABASE_ID,
				tableId: TABLE_ID,
				queries: [
					// Appwrite searches on full-text indexed columns (searchKeywords)
					Query.or([
						Query.contains('title', searchTerm),
						Query.contains('searchKeywords', searchTerm)
					]),
					Query.limit(limit)
				]
      });
			return response.rows;
		} catch (error) {
			console.error(`[MovieService.search] Failed for term "${searchTerm}":`, error);
			throw error;
		}
	},

  /**
   * Get the URL of a poster
   * movie: Movie
   * provider: Provider
   */
  getPosterUrl(movie: Movie, provider?: Provider): string {
    if (!provider || provider === "jellyfin") {
      return `${JELLYFIN_BASE}/Items/${movie.posterId}/Images/Primary?api_key=${JELLYFIN_API_KEY}`;
    } else {
      if (movie.posterId && (movie.posterId.startsWith('http') || movie.posterId.startsWith('/'))) {
        return movie.posterId;
      }
      return `https://picsum.photos/seed/${movie.posterId ?? 'random'}/200/500`;
    }
  },

  /**
   * Get the streaming url for a movie
   * movie: Movie
   * provider: Provider
   */
  getStreamingLink(movie: Movie, provider?: Provider): string {
      if (!provider || provider === "jellyfin") {
          const queryParams = new URLSearchParams({
              api_key: JELLYFIN_API_KEY || "",
              MediaSourceId: movie.streamId || "",
              DeviceId: "hmar_media_web_client",
              VideoCodec: "h264",
              AudioCodec: "aac", // Drops Atmos 5.1 down to browser-friendly AAC
              TranscodingMaxAudioChannels: "2", // Forces stereo output
              RequireAvc: "true", // explicitly forbids raw copying of x265/HEVC video
              SegmentContainer: "ts",
              MinSegments: "1",
              BreakOnNonKeyFrames: "True",
              VideoBitrate: "15000000", // 15Mbps ceiling
              AudioBitrate: "320000"
          });

          return `${JELLYFIN_BASE}/Videos/${movie.streamId}/master.m3u8?${queryParams.toString()}`;
      }
      
      // Fallback in-house provider
      return `https://files.vidstack.io/sprite-fight/hls/stream.m3u8`;
  }
};
