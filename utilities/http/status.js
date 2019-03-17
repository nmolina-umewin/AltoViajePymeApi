"use strict";

// 100s
const CONTINUE = 100; // Continue
const SWITCHING_PROTOCOLS = 101; // Switching Protocols
const PROCESSING = 102; // Processing

// 200s
const OK = 200; // OK
const SUCCESS = 200; // SUCCESS
const CREATED = 201; // Created
const ACCEPTED = 202; // Accepted
const NON_AUTHORITATIVE_INFORMATION = 203; // Non Authoritative Information
const NO_CONTENT = 204; // No Content
const RESET_CONTENT = 205; // Reset Content
const PARTIAL_CONTENT = 206; // Partial Content
const MULTI_STATUS = 207; // Multi-Status

// 300s
const MULTIPLE_CHOICES = 300; // Multiple Choices
const MOVED_PERMANENTLY = 301; // Moved Permanently
const MOVED_TEMPORARILY = 302; // Moved Temporarily
const SEE_OTHER = 303; // See Other
const NOT_MODIFIED = 304; // Not Modified
const USE_PROXY = 305; // Use Proxy
const TEMPORARY_REDIRECT = 307; // Temporary Redirect
const PERMANENT_REDIRECT = 308; // Permanent Redirect

// 400s
const BAD_REQUEST = 400; // Bad Request
const UNAUTHORIZED = 401; // Unauthorized
const PAYMENT_REQUIRED = 402; // Payment Required
const FORBIDDEN = 403; // Forbidden
const NOT_FOUND = 404; // Not Found
const METHOD_NOT_ALLOWED = 405; // Method Not Allowed
const NOT_ACCEPTABLE = 406; // Not Acceptable
const PROXY_AUTHENTICATION_REQUIRED = 407; // Proxy Authentication Required
const REQUEST_TIMEOUT = 408; // Request Timeout
const CONFLICT = 409; // Conflict
const GONE = 410; // Gone
const LENGTH_REQUIRED = 411; // Length Required
const PRECONDITION_FAILED = 412; // Precondition Failed
const REQUEST_TOO_LONG = 413; // Request Entity Too Large
const REQUEST_URI_TOO_LONG = 414; // Request-URI Too Long
const UNSUPPORTED_MEDIA_TYPE = 415; // Unsupported Media Type
const REQUESTED_RANGE_NOT_SATISFIABLE = 416; // Requested Range Not Satisfiable
const EXPECTATION_FAILED = 417; // Expectation Failed
const INSUFFICIENT_SPACE_ON_RESOURCE = 419; // Insufficient Space on Resource
const METHOD_FAILURE = 420; // Method Failure
const UNPROCESSABLE_ENTITY = 422; // Unprocessable Entity
const LOCKED = 423; // Locked
const FAILED_DEPENDENCY = 424; // Failed Dependency
const PRECONDITION_REQUIRED = 428; // Precondition Required
const TOO_MANY_REQUESTS = 429; // Too Many Requests
const REQUEST_HEADER_FIELDS_TOO_LARGE = 431; // Request Header Fields Too Large

// 500s
const INTERNAL_SERVER_ERROR = 500; // Server Error
const NOT_IMPLEMENTED = 501; // Not Implemented
const BAD_GATEWAY = 502; // Bad Gateway
const SERVICE_UNAVAILABLE = 503; // Service Unavailable
const GATEWAY_TIMEOUT = 504; // Gateway Timeout
const HTTP_VERSION_NOT_SUPPORTED = 505; // HTTP Version Not Supported
const INSUFFICIENT_STORAGE = 507; // Insufficient Storage
const NETWORK_AUTHENTICATION_REQUIRED = 511; // Network Authentication Required

function isInformational(status) {
    return status >= CONTINUE && status < SUCCESS;
}

function isSuccess(status) {
    return status >= SUCCESS && status < MULTIPLE_CHOICES;
}

function isRedirection(status) {
    return status >= MULTIPLE_CHOICES && status < BAD_REQUEST;
}

function isClientError(status) {
    return status >= BAD_REQUEST && status < INTERNAL_SERVER_ERROR;
}

function isServerError(status) {
    return status >= INTERNAL_SERVER_ERROR;
}

function isError(status) {
    return status >= BAD_REQUEST;
}

module.exports = {
    CONTINUE,
    SWITCHING_PROTOCOLS,
    PROCESSING,
    OK,
    SUCCESS,
    CREATED,
    ACCEPTED,
    NON_AUTHORITATIVE_INFORMATION,
    NO_CONTENT,
    RESET_CONTENT,
    PARTIAL_CONTENT,
    MULTI_STATUS,
    MULTIPLE_CHOICES,
    MOVED_PERMANENTLY,
    MOVED_TEMPORARILY,
    SEE_OTHER,
    NOT_MODIFIED,
    USE_PROXY,
    TEMPORARY_REDIRECT,
    PERMANENT_REDIRECT,
    BAD_REQUEST,
    UNAUTHORIZED,
    PAYMENT_REQUIRED,
    FORBIDDEN,
    NOT_FOUND,
    METHOD_NOT_ALLOWED,
    NOT_ACCEPTABLE,
    PROXY_AUTHENTICATION_REQUIRED,
    REQUEST_TIMEOUT,
    CONFLICT,
    GONE,
    LENGTH_REQUIRED,
    PRECONDITION_FAILED,
    REQUEST_TOO_LONG,
    REQUEST_URI_TOO_LONG,
    UNSUPPORTED_MEDIA_TYPE,
    REQUESTED_RANGE_NOT_SATISFIABLE,
    EXPECTATION_FAILED,
    INSUFFICIENT_SPACE_ON_RESOURCE,
    METHOD_FAILURE,
    UNPROCESSABLE_ENTITY,
    LOCKED,
    FAILED_DEPENDENCY,
    PRECONDITION_REQUIRED,
    TOO_MANY_REQUESTS,
    REQUEST_HEADER_FIELDS_TOO_LARGE,
    INTERNAL_SERVER_ERROR,
    NOT_IMPLEMENTED,
    BAD_GATEWAY,
    SERVICE_UNAVAILABLE,
    GATEWAY_TIMEOUT,
    HTTP_VERSION_NOT_SUPPORTED,
    INSUFFICIENT_STORAGE,
    NETWORK_AUTHENTICATION_REQUIRED,
    isInformational,
    isSuccess,
    isRedirection,
    isClientError,
    isServerError,
    isError
};
