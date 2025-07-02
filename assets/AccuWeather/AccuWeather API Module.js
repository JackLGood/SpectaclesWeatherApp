/* // NOTE: This file contains code for accessing an external API encapsulated as a JS module. You should not modify this file.
 * // Instead, you should modify the "AccuWeather API" script and access the functions through the imported class wrapper.
 */

// https://docs.snap.com/api/lens-studio/Classes/ScriptObjects/#RemoteApiResponse--statusCode
const statusMessageMap = {
    0: "Unknown Status Code - Please report this as a bug.",
    1: "Success",
    2: "Redirected",
    3: "Bad Request",
    4: "Access Denied",
    5: "API Call Not Found",
    6: "Timeout",
    7: "Request Too Large",
    8: "Server Processing Error",
    9: "Request Cancelled by Caller",
    10: "Internal Framework Error",
};

class RemoteApiService {
    constructor(remoteServiceModule) {
        this.remoteServiceModule = remoteServiceModule;
    }

    async performApiRequest(endpoint, request, paramsSchema) {
        request = request || {};

        for (const [name, optional] of paramsSchema || []) {
            const value = request.parameters && request.parameters[name];
            if (!optional && value == null) {
                throw new Error(`Required parameter ${name} is missing from request.`);
            }
        }

        const req = global.RemoteApiRequest.create();
        req.endpoint = endpoint;
        if (request.parameters) req.parameters = request.parameters;
        if (request.body) req.body = request.body;

        const response = await new Promise((resolve) => this.remoteServiceModule.performApiRequest(req, resolve));
        if (response.statusCode !== 1) {
            const message = statusMessageMap[response.statusCode] || statusMessageMap[0];
            throw new Error(`API Call Error - ${message}: ${response.body}.`);
        }

        return {
            statusCode: response.statusCode,
            metadata: response.metadata,
            bodyAsJson: () => JSON.parse(response.body),
            bodyAsString: () => response.body,
            bodyAsResource: () => response.asResource(),
        };
    }
}

/**
 * @typedef {Object} ApiCallResponse
 * @property {number} statusCode - The integer status code of the response. The meaning of possible status code values are defined as follows:
 * <ul>
 *   <li><strong>1:</strong> Success. This code corresponds to the 2XX HTTP response status codes.</li>
 *   <li><strong>2:</strong> Redirected. This code corresponds to the 3XX HTTP response status codes.</li>
 *   <li><strong>3:</strong> Bad request. This code corresponds to the 4XX HTTP response status codes other than 401, 403, 404, 408, 413, 414, and 431, which are mapped separately below.</li>
 *   <li><strong>4:</strong> Access denied. This code corresponds to the HTTP response status codes 401 and 403.</li>
 *   <li><strong>5:</strong> Not found. This code corresponds to the HTTP response status code 404. It is also returned when the API spec is not found by the remote API service.</li>
 *   <li><strong>6:</strong> Timeout. This code corresponds to the HTTP response status codes 408 and 504.</li>
 *   <li><strong>7:</strong> Request too large. This code corresponds to the HTTP response status codes 413, 414, and 431.</li>
 *   <li><strong>8:</strong> Server error. This code corresponds to the 5XX HTTP response status codes other than 504 (timeout).</li>
 *   <li><strong>9:</strong> Request cancelled by the caller.</li>
 *   <li><strong>10:</strong> Internal error happened inside the remote API framework (i.e., not from the remote service being called).</li>
 * </ul>
 * All other values have undefined meaning and should be treated as internal error (code 10).
 * @property {Object} metadata - The key-value pairs of the response metadata.
 * @property {function(): Object} bodyAsJson - Parses the response body as a JSON object.
 * @property {function(): string} bodyAsString - Reads the response body as a string.
 * @property {function(): DynamicResource} bodyAsResource - Converts the response body into a {@link https://docs.snap.com/api/lens-studio/Classes/ScriptObjects#DynamicResource|DynamicResource} object, which can be used by the {@link https://docs.snap.com/api/lens-studio/Classes/Assets#RemoteMediaModule|RemoteMediaModule} to load the media content.
 */

/**
 * ApiModule Remote API service.
 */
class ApiModule extends RemoteApiService {
    /**
     * Performs daily_forecast API call.
     *
     * @param {Object} request - The request object for the API call.
     * @param {Object} request.parameters - Parameters for the API call.
     * @param {string} request.parameters.lat - lat parameter value.
     * @param {string} request.parameters.lng - lng parameter value.
     * @param {string} request.parameters.days - days parameter value.
     * @param {string=} request.body - Body content for the API request, if applicable. Typically a JSON string.
     * @returns {Promise<ApiCallResponse>} - A promise that resolves to the API response.
     *
     * @example
     * daily_forecast({
     *   parameters: {
     *     "lat": "value1",
     *     "lng": "value2",
     *     "days": "value3",
     *   },
     *   body: JSON.stringify({
     *     "additionalInfo": "Some info"
     *   })
     * }).then(response => {
     *     print(response.bodyAsJson());
     * }).catch(error => {
     *     print(error);
     * });
     */
    daily_forecast(request) {
        return this.performApiRequest("daily_forecast", request, [
            ["lat", true],
            ["lng", true],
            ["days", true],
        ]);
    }

    /**
     * Performs hourly_forecast API call.
     *
     * @param {Object} request - The request object for the API call.
     * @param {Object} request.parameters - Parameters for the API call.
     * @param {string} request.parameters.lat - lat parameter value.
     * @param {string} request.parameters.lng - lng parameter value.
     * @param {string} request.parameters.hours - hours parameter value.
     * @param {string=} request.body - Body content for the API request, if applicable. Typically a JSON string.
     * @returns {Promise<ApiCallResponse>} - A promise that resolves to the API response.
     *
     * @example
     * hourly_forecast({
     *   parameters: {
     *     "lat": "value1",
     *     "lng": "value2",
     *     "hours": "value3",
     *   },
     *   body: JSON.stringify({
     *     "additionalInfo": "Some info"
     *   })
     * }).then(response => {
     *     print(response.bodyAsJson());
     * }).catch(error => {
     *     print(error);
     * });
     */
    hourly_forecast(request) {
        return this.performApiRequest("hourly_forecast", request, [
            ["lat", true],
            ["lng", true],
            ["hours", true],
        ]);
    }

    /**
     * Performs current_condition_and_forecast API call.
     *
     * @param {Object} request - The request object for the API call.
     * @param {Object} request.parameters - Parameters for the API call.
     * @param {string} request.parameters.lat - lat parameter value.
     * @param {string} request.parameters.lng - lng parameter value.
     * @param {string} request.parameters.hourly_forecast_hours - hourly_forecast_hours parameter value.
     * @param {string} request.parameters.daily_forecast_days - daily_forecast_days parameter value.
     * @param {string=} request.body - Body content for the API request, if applicable. Typically a JSON string.
     * @returns {Promise<ApiCallResponse>} - A promise that resolves to the API response.
     *
     * @example
     * current_condition_and_forecast({
     *   parameters: {
     *     "lat": "value1",
     *     "lng": "value2",
     *     "hourly_forecast_hours": "value3",
     *     "daily_forecast_days": "value4",
     *   },
     *   body: JSON.stringify({
     *     "additionalInfo": "Some info"
     *   })
     * }).then(response => {
     *     print(response.bodyAsJson());
     * }).catch(error => {
     *     print(error);
     * });
     */
    current_condition_and_forecast(request) {
        return this.performApiRequest("current_condition_and_forecast", request, [
            ["lat", true],
            ["lng", true],
            ["hourly_forecast_hours", true],
            ["daily_forecast_days", true],
        ]);
    }

    /**
     * Performs current_condition API call.
     *
     * @param {Object} request - The request object for the API call.
     * @param {Object} request.parameters - Parameters for the API call.
     * @param {string} request.parameters.lat - lat parameter value.
     * @param {string} request.parameters.lng - lng parameter value.
     * @param {string=} request.body - Body content for the API request, if applicable. Typically a JSON string.
     * @returns {Promise<ApiCallResponse>} - A promise that resolves to the API response.
     *
     * @example
     * current_condition({
     *   parameters: {
     *     "lat": "value1",
     *     "lng": "value2",
     *   },
     *   body: JSON.stringify({
     *     "additionalInfo": "Some info"
     *   })
     * }).then(response => {
     *     print(response.bodyAsJson());
     * }).catch(error => {
     *     print(error);
     * });
     */
    current_condition(request) {
        return this.performApiRequest("current_condition", request, [
            ["lat", true],
            ["lng", true],
        ]);
    }
}

module.exports.ApiModule = ApiModule;
