const express = require('express');

express.response.error = function (error) {
    if (!error.code) {
        error = {
            message: error.toString(),
            code: 'server_error',
            status: 500
        };
    }

    this.status(error.status).json(error);
};

module.exports = {
    invalidId: {
        message: 'Invalid id',
        code: 'invalid_id',
        status: 400
    },
    notFound: {
        message: 'Entity not found',
        code: 'entity_not_found',
        status: 404
    },
    wrongCredentials: {
        message: 'Email or password are wrong',
        code: 'wrong_credentials',
        status: 404
    },
    accessDenied: {
        message: 'Access denied',
        code: 'access_denied',
        status: 403
    },
    createError: {
        message: 'Invalid data',
        code: 'invalid_data',
        status: 400
    },
    optionsError: {
        message: 'Invalid options',
        code: 'invalid_options',
        status: 400
    },
    AccountAlreadyExists: {
        message: 'The specified account already exists.',
        code: 'AccountAlreadyExists',
        status: 409
    },
    AccountBeingCreated: {
        message: 'The specified account is in the process of being created.',
        code: 'AccountBeingCreated',
        status: 409
    },
    AccountIsDisabled: {
        message: 'The specified account is disabled.',
        code: 'AccountIsDisabled',
        status: 403
    },
    InsufficientAccountPermissions: {
        message: 'The account being accessed does not have sufficient permissions to execute this operation.',
        code: 'InsufficientAccountPermissions',
        status: 403
    },
    AuthenticationFailed: {
        message: 'Server failed to authenticate the request.',
        code: 'AuthenticationFailed',
        status: 403
    },
    InvalidQueryParameterValue: {
        message: 'An invalid value was specified for one of the query parameters in the request URI.',
        code: 'InvalidQueryParameterValue',
        status: 400
    },
    InvalidUri: {
        message: 'The requested URI does not represent any resource on the server.',
        code: 'InvalidUri',
        status: 400
    },
    InternalError: {
        message: 'The server encountered an internal error.',
        code: 'InternalError',
        status: 500
    },
    InvalidInput: {
        message: 'One of the request inputs is not valid.',
        code: 'InvalidInput',
        status: 400
    },
    MissingRequiredQueryParameter: {
        message: 'A required query parameter was not specified for this request.',
        code: 'MissingRequiredQueryParameter',
        status: 400
    }
};