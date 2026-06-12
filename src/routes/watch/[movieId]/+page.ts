import { MovieService } from '$lib/services/movies';
import { error } from '@sveltejs/kit';

export const ssr = false; // Video players strictly require browser APIs

export const load = async ({ params }) => {
	try {
		const movie = await MovieService.getById(params.movieId);
		return { movie };
	} catch (err) {
		error(404, 'Movie not found or unavailable.');
	}
};
