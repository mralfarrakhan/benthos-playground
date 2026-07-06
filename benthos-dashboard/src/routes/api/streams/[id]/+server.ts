import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request }) => {
	const { id } = params;
	if (!id) {
		return error(400, 'Stream ID is required');
	}

	try {
		const yamlConfig = await request.text();
		
		const res = await fetch(`http://benthos:4195/streams/${id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/yaml'
			},
			body: yamlConfig
		});
		
		if (!res.ok) {
			const errorText = await res.text();
			return error(res.status, `Benthos API error: ${errorText}`);
		}
		
		return json({ success: true, id });
	} catch (e) {
		return error(500, String(e));
	}
};
