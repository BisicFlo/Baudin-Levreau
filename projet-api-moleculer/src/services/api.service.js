"use strict";

const ApiGateway = require("moleculer-web");


module.exports = {
	name: "api",
	mixins: [ ApiGateway],

	settings: {
		port: process.env.PORT || 9000,

        cors: {
            // Configures the Access-Control-Allow-Origin CORS header.
            origin: "*",
            // Configures the Access-Control-Allow-Methods CORS header.
            methods: ["GET", "PATCH", "OPTIONS", "POST", "PUT", "DELETE"],
            // Configures the Access-Control-Allow-Headers CORS header.
            allowedHeaders: ["Content-Type"],
            // Configures the Access-Control-Expose-Headers CORS header.
            exposedHeaders: [],
            // Configures the Access-Control-Allow-Credentials CORS header.
            credentials: false,
            // Configures the Access-Control-Max-Age CORS header.
            maxAge: 3600
        },

		routes: [
		{
				path: "/api/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					// The `name` comes from named param.
					// You can access it with `ctx.params.name` in action
					// "GET hi/:name": "greeter.welcome",
					// "POST user/:auth0_id": "user.create",
					"POST v1/product ": "products.create",
					"GET v1/product/:id_product ": "products.get",
					"PATCH v1/product/:id_product ": "products.edit",
					"PATCH v1/product/:id_product/increment ": "products.increment",
					"PATCH v1/product/:id_product/decrement ": "products.decrement",

					"POST v1/user" : "utilisateurs.create",
					"GET v1/user/:email" : "utilisateurs.get",
					"PATCH v1/user/:email" : "utilisateurs.edit",
					"POST v1/order/user/:id_user" : "commandes.create",
					"GET v1/order/:id_order" : "commandes.get_commande",
					"GET v1/order/user/:id_user" : "commandes.get_utilisateur",
					"PATCH v1/order/:id_order/product/:id_product/incremen" : "commandes.get_commande",
					"PATCH v1/order/:id_order/product/:id_product/decrement" : "commandes.decrement",
					"PATCH v1/order/:id_order" : "commande.validation",


				}
			},

			{
				path: "/status/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					// The `name` comes from named param.
					// You can access it with `ctx.params.name` in action
					// "GET hi/:name": "greeter.welcome",
					// "POST user/:auth0_id": "user.create",

					"GET server": "application.configuration",
					"GET health": "application.health",
					"GET database": "application.database",
					"GET reset": "application.reset"
				}
			},
			{
				bodyParsers: {
	                json: true,
	            },
				path: "/client/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					//	Example project
				}
			}
		]

	}
};
