import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv'; // If dotenv is not installed, we can just parse it manually, or better yet, since we just want to display it, we can just show the raw content or parse manually.

export async function load() {
    let envContent = '';
    
    const pathsToTry = [
        '/app/.env',
        path.resolve(process.cwd(), '../.env'),
        path.resolve(process.cwd(), '.env')
    ];

    let foundPath = null;
    for (const p of pathsToTry) {
        if (fs.existsSync(p)) {
            try {
                envContent = fs.readFileSync(p, 'utf-8');
                foundPath = p;
                break;
            } catch (e) {
                // Try next
            }
        }
    }

    if (!foundPath) {
        return { envVars: [], error: 'Could not find .env file.', raw: '' };
    }
    
    // Parse the env file manually for simple key=value pairs
    const envVars = [];
    const lines = envContent.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const splitIndex = trimmed.indexOf('=');
            if (splitIndex !== -1) {
                const key = trimmed.substring(0, splitIndex).trim();
                const value = trimmed.substring(splitIndex + 1).trim();
                envVars.push({ key, value });
            }
        }
    }
    
    return { envVars, raw: envContent, error: null };
}
