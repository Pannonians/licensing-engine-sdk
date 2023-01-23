import * as dotenv from 'dotenv';
import { createApi } from './http';
dotenv.config();
/**
 * Represents an licensing engine SDK.
 * @param {('domain'|'token')} authMethod - Method. Can be "domain" or "token".
 * @param {string} token - Bearer token. Required if authMethod is "token".
 * @returns {Promise<{data: string[]}>} - Returns an async axios response
 */
export const licensingEngineApi = (authMethod, token = null) => createApi(`${process.env.LICENSING_ENGINE_API_ORIGIN}`, authMethod, token);
