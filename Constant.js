export const UM  = {
    PRODUCT_NAME: 'routing-manager',
    PUBLIC_KEY: 'rm-public-key',
    TECHNICAL_AGENT: 'rm-technical-agent',
    UNIT_DEFINITION: {
        FLOW: 'rm-flow',
        FLOW_CONTAINER: 'rm-flow-container'
    }
};

export const HTTP = {
    OK:  200,
    CREATED: 201,
    NO_CONTENT:  202,
    UNAUTHORIZED: { message:{errorMessage:'Token expired or invalid', type: 'UNAUTHORIZED'}, status: 401 },
    FORBIDDEN: { message: {errorMessage:'Token is valid but don\'t have the required permissions for this request', type: 'FORBIDDEN'}, status: 403 },
    BAD_REQUEST: { message: {errorMessage:'Bad Request', type: 'BAD_REQUEST'}, status: 400 },
    SERVER_ERROR: { message: {errorMessage: 'Server error', type: 'SERVER_ERROR'}, status: 500},
    SERVICE_UNAVAILABLE: { message: {errorMessage:'Service Unavailable', type: 'SERVICE_UNAVAILABLE'}, status: 503 }
}

export const HEADERS = {
    authorization: "Authorization",
    bearer: "Bearer ",
    contentType: "Content-Type",
    contentDisposition: "Content-Disposition"
}

export const PRIVILEGES = {
    READ: 'RM_READ_ROUTE',
    MODIFY: 'RM_MODIFY_ROUTE',
    CREATE: 'RM_CREATE_ROUTE',
    DELETE: 'RM_DELETE_ROUTE'
}