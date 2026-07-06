import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const res = await fetch('http://benthos:4195/streams');
		const data = await res.json();
		return json(data);
	} catch (e) {
		return error(500, JSON.stringify(e, null, 2));
	}
};
