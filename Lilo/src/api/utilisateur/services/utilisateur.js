'use strict';

/**
 * utilisateur service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::utilisateur.utilisateur');
