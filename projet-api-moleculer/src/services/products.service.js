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

	actions: {

		//	call "products.create" --title "Title" --description "description" --price "number"
		create: {
			params: {
				title: "string",
				description: "string",
				price: "number"
				
			},
			handler(ctx) {
				var product = new Models.Product(ctx.params).create();
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
									return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
					});
				} else {
					return new MoleculerError("Products", 417, "ERR_CRITIAL", { code: 417, message: "Product is not valid" } )
				}
			}
		},


		//	call "products.get" --id_product "id_product"
		get: {
			params: {
				id_product: "string"
			},
			handler(ctx) {
				return ctx.call("products.verify", { id_product: ctx.params.id_product })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var user = db.get("products").find({ id: ctx.params.id_product }).value();;
								return user;
							})
							.catch(() => {
								return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Products", 404, "ERR_CRITIAL", { code: 404, message: "product doesn't exists" } )
					}
				})
			}
		},

		//	call "products.verify" --id_product "id_product"
		verify: {
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

		//	call "products.edit" --id_product "id_product" --title "NewTitle" --description "description"--price "number"
		edit: {
			params: {
				id_product: "string",
				title: "string",
				description: "string",
				price: "number",
			},
			handler(ctx) {
				return ctx.call("products.get", { id_product: ctx.params.id_product })
						.then((db_product) => {
							//
							var product = new Models.Product(db_product).create();
							product.title = ctx.params.title || db_product.title;
							product.description = ctx.params.description || db_product.description;
							product.price = ctx.params.price || db_product.price;
							//
							return Database()
								.then((db) => {
									return db.get("products")
										.find({ id: ctx.params.id_product })
										.assign(product)
										.write()
										.then(() => {
											return product;
										})
										.catch(() => {
											return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		},

//___________________________________________________________________
		//	call "products.increment" --id_product "id_product" 

			increment: {
			params: {
				id_product: "string",
			},
			handler(ctx) {
				return ctx.call("products.get", { id_product: ctx.params.id_product })
						.then((db_product) => {
							//
							var product = new Models.Product(db_product).create();
							product.title = db_product.title;
							product.description = db_product.description;
							product.price = db_product.price;
							product.quantity = db_product.quantity +1;
							//
							return Database()
								.then((db) => {
									return db.get("products")
										.find({ id: ctx.params.id_product })
										.assign(product)
										.write()
										.then(() => {
											return product;
										})
										.catch(() => {
											return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		},
//___________________________________________________________________
		//	call "products.decrement" --id_product "id_product" 
			decrement: {
			params: {
				id_product: "string",
			},
			handler(ctx) {
				return ctx.call("products.get", { id_product: ctx.params.id_product })
						.then((db_product) => {
							//
							var product = new Models.Product(db_product).create();
							product.title = db_product.title;
							product.description = db_product.description;
							product.price = db_product.price;
							if (db_product.quantity - 1 < 0) {
								return new MoleculerError("Products", 444, "ERR_CRITIAL", { code: 444, message: "Mega Critical Error , quantity can not be negative" } )
							} else {
								product.quantity = db_product.quantity -1;
							}
							//
							return Database()
								.then((db) => {
									return db.get("products")
										.find({ id: ctx.params.id_product })
										.assign(product)
										.write()
										.then(() => {
											return product;
										})
										.catch(() => {
											return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		}

	}
};

