/* tslint:disable */
/* eslint-disable */
/**
 * Polar API
 * Read the docs at https://docs.polar.sh/api-reference
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  CustomerIDFilter,
  ExternalCustomerIDFilter1,
  HTTPValidationError,
  ListResourceEvent,
  ListResourceMeter,
  MetadataQueryValue,
  Meter,
  MeterCreate,
  MeterQuantities,
  MeterSortProperty,
  MeterUpdate,
  OrganizationIDFilter1,
  ResourceNotFound,
  TimeInterval,
} from '../models/index';

export interface MetersApiCreateRequest {
    body: MeterCreate;
}

export interface MetersApiEventsRequest {
    id: string;
    page?: number;
    limit?: number;
}

export interface MetersApiGetRequest {
    id: string;
}

export interface MetersApiListRequest {
    organizationId?: OrganizationIDFilter1 | null;
    query?: string | null;
    page?: number;
    limit?: number;
    sorting?: Array<MeterSortProperty> | null;
    metadata?: { [key: string]: MetadataQueryValue; } | null;
}

export interface MetersApiQuantitiesRequest {
    id: string;
    startTimestamp: string;
    endTimestamp: string;
    interval: TimeInterval;
    customerId?: CustomerIDFilter | null;
    exernalCustomerId?: ExternalCustomerIDFilter1 | null;
}

export interface MetersApiUpdateRequest {
    id: string;
    body: MeterUpdate;
}

/**
 * 
 */
export class MetersApi extends runtime.BaseAPI {

    /**
     * Create a meter.
     * Create Meter
     */
    async createRaw(requestParameters: MetersApiCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Meter>> {
        if (requestParameters['body'] == null) {
            throw new runtime.RequiredError(
                'body',
                'Required parameter "body" was null or undefined when calling create().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("pat", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("oat", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/meters/`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['body'],
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Create a meter.
     * Create Meter
     */
    async create(requestParameters: MetersApiCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Meter> {
        const response = await this.createRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get events matching the filter of a meter.
     * Get Meter Events
     */
    async eventsRaw(requestParameters: MetersApiEventsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListResourceEvent>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling events().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("pat", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("oat", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/meters/{id}/events`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Get events matching the filter of a meter.
     * Get Meter Events
     */
    async events(requestParameters: MetersApiEventsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListResourceEvent> {
        const response = await this.eventsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get a meter by ID.
     * Get Meter
     */
    async getRaw(requestParameters: MetersApiGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Meter>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling get().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("pat", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("oat", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/meters/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Get a meter by ID.
     * Get Meter
     */
    async get(requestParameters: MetersApiGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Meter> {
        const response = await this.getRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * List meters.
     * List Meters
     */
    async listRaw(requestParameters: MetersApiListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListResourceMeter>> {
        const queryParameters: any = {};

        if (requestParameters['organizationId'] != null) {
            queryParameters['organization_id'] = requestParameters['organizationId'];
        }

        if (requestParameters['query'] != null) {
            queryParameters['query'] = requestParameters['query'];
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['sorting'] != null) {
            queryParameters['sorting'] = requestParameters['sorting'];
        }

        if (requestParameters['metadata'] != null) {
            queryParameters['metadata'] = requestParameters['metadata'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("pat", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("oat", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/meters/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * List meters.
     * List Meters
     */
    async list(requestParameters: MetersApiListRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListResourceMeter> {
        const response = await this.listRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get quantities of a meter over a time period.
     * Get Meter Quantities
     */
    async quantitiesRaw(requestParameters: MetersApiQuantitiesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<MeterQuantities>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling quantities().'
            );
        }

        if (requestParameters['startTimestamp'] == null) {
            throw new runtime.RequiredError(
                'startTimestamp',
                'Required parameter "startTimestamp" was null or undefined when calling quantities().'
            );
        }

        if (requestParameters['endTimestamp'] == null) {
            throw new runtime.RequiredError(
                'endTimestamp',
                'Required parameter "endTimestamp" was null or undefined when calling quantities().'
            );
        }

        if (requestParameters['interval'] == null) {
            throw new runtime.RequiredError(
                'interval',
                'Required parameter "interval" was null or undefined when calling quantities().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['startTimestamp'] != null) {
            queryParameters['start_timestamp'] = requestParameters['startTimestamp'];
        }

        if (requestParameters['endTimestamp'] != null) {
            queryParameters['end_timestamp'] = requestParameters['endTimestamp'];
        }

        if (requestParameters['interval'] != null) {
            queryParameters['interval'] = requestParameters['interval'];
        }

        if (requestParameters['customerId'] != null) {
            queryParameters['customer_id'] = requestParameters['customerId'];
        }

        if (requestParameters['exernalCustomerId'] != null) {
            queryParameters['exernal_customer_id'] = requestParameters['exernalCustomerId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("pat", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("oat", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/meters/{id}/quantities`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Get quantities of a meter over a time period.
     * Get Meter Quantities
     */
    async quantities(requestParameters: MetersApiQuantitiesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<MeterQuantities> {
        const response = await this.quantitiesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Update a meter.
     * Update Meter
     */
    async updateRaw(requestParameters: MetersApiUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Meter>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling update().'
            );
        }

        if (requestParameters['body'] == null) {
            throw new runtime.RequiredError(
                'body',
                'Required parameter "body" was null or undefined when calling update().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("pat", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("oat", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/meters/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['body'],
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Update a meter.
     * Update Meter
     */
    async update(requestParameters: MetersApiUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Meter> {
        const response = await this.updateRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
