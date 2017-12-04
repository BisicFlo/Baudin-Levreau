"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "products",

	settings: {
 		state: {

 		}
	},



actions:  {
	//	call "products.create" --title "Title"
	create: {
		params: {
			title: "string",
			description: "string",
			price: "number"

			},
			handler(ctx) {
				var product = new Models.Todo(ctx.params).create();
				console.log("Products - create - ", product);
				if (product) {
					return Database()
						.then((db) => {
							return db.get("products")
								.push(product)
								.write()
								.then(() => {
									return product;
								})
								.catch(() => {
									return new MoleculerError("products", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
					});
				} else {
					return new MoleculerError("products", 417, "ERR_CRITIAL", { code: 417, message: "Todo is not valid" } )
				}
			}
		},

		//	call "products.getAll"
		getAll: {
			params: {

			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.values().__wrapped__;
					});
			}
		},


		//	call "products.get" --id_product
		get: {
			params: {
				id_product: "string"
			},
			handler(ctx) {
				return ctx.call("products.verify", { id_product: ctx.params.id_todo })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var user = db.get("products").find({ id: ctx.params.id_todo }).value();;
								return user;
							})
							.catch(() => {
								return new MoleculerError("products", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("products", 404, "ERR_CRITIAL", { code: 404, message: "product doesn't exists" } )
					}
				})
			}
		},

		//	call "products.verify" --id_product
			params: {
				id_product: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("products")
										.filter({ id: ctx.params.id_product })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "products.edit" --id_product  --name --completed
		edit: {
			params: {
				id_product: "string",
				name: "string",
				completed: "boolean"
			},
			handler(ctx) {
				return ctx.call("todos.get", { id_product: ctx.params.id_product })
						.then((db_product) => {
							//
							var product = new Models.Todo(db_product).create();
							product.name = ctx.params.name || db_product.name;
							product.completed = ctx.params.completed || false;
							//
							return Database()
								.then((db) => {
									return db.get("todos")
										.find({ id: ctx.params.id_product })
										.assign(product)
										.write()
										.then(() => {
											return product;
										})
										.catch(() => {
											return new MoleculerError("Product", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		}



	}
};




/*
			handler(ctx) {

				var product = new Models.Produit(ctx.params).create();
				if (product) {
					return Database().then((db) => {
						return db.get("products")
									.push(food)
									.write()
									.then(() => {
										return product;
										})
									.catch(() => {
											return "Dooommmmage";
										})
					});
				} else {

					return new MoleculerError("Produit",409,
						"ERROR",
						{

							code:409,
							message: "Product model is not valid"
						}
					);
				}

			}
		}
	}
};


actions:  {
	create: {
		params: {
			"title": "string",
			"description": "string",
			"price": "numbre"


			},	
			handler(ctx) {

				var product = new Models.Produit(ctx.params).create();
				if (product) {
					return " u u u "
				} else {

					return new MoleculerError("Produit",409,
						"ERROR",
						{

							code:409,
							message: "Product model is not valid"
						}
					);
				}

			}
		}
	}
};
*/