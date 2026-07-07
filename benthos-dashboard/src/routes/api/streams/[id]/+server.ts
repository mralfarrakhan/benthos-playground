import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;
	if (!id) return error(400, 'Stream ID is required');

	try {
		// Fetch stream configuration (Benthos returns YAML/JSON for a specific stream config)
		// We explicitly ask for YAML to avoid unformatted JSON strings with escaped \n
		const res = await fetch(`http://benthos:4195/streams/${id}`, {
			headers: {
				'Accept': 'application/yaml'
			}
		});
		if (!res.ok) {
			const errorText = await res.text();
			return error(res.status, `Benthos API error: ${errorText}`);
		}
		
		let config = await res.text();
		
		try {
			// Benthos might return the config as a JSON-encoded string (e.g. "\"input:\\n...\"")
			// or as a JSON object if YAML isn't requested properly.
			const parsed = JSON.parse(config);
			if (typeof parsed === 'string') {
				// It was a JSON-encoded YAML string, so unescape it
				config = parsed;
			} else if (typeof parsed === 'object') {
				// It was a JSON object, pretty print it
				config = JSON.stringify(parsed, null, 2);
			}
		} catch (e) {
			// Not JSON, presumably it's raw YAML already. Leave it as is.
		}

		return json({ id, config });
	} catch (e) {
		return error(500, String(e));
	}
};

export const POST: RequestHandler = async ({ params, request }) => {
	const { id } = params;
	if (!id) return error(400, 'Stream ID is required');

	try {
		const yamlConfig = await request.text();
		const res = await fetch(`http://benthos:4195/streams/${id}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/yaml' },
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

export const PUT: RequestHandler = async ({ params, request }) => {
	const { id } = params;
	if (!id) return error(400, 'Stream ID is required');

	try {
		const yamlConfig = await request.text();
		// Benthos uses PUT for full replacement of a stream config sometimes, or POST is enough.
		// We'll use PUT proxy to POST if PUT isn't supported, but Benthos supports PUT /streams/{id}.
		const res = await fetch(`http://benthos:4195/streams/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/yaml' },
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

export const DELETE: RequestHandler = async ({ params }) => {
	const { id } = params;
	if (!id) return error(400, 'Stream ID is required');

	try {
		const res = await fetch(`http://benthos:4195/streams/${id}`, {
			method: 'DELETE'
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
