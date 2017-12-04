"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "commandes",

	settings: {
 		state: {

 		}
	},

	actions: {

		// call "commandes.create" --id_utilisateur "id_utilisateur" --id_produit "id_produit" --quantite "number"
		// call "commandes.create" --id_utilisateur "id_utilisateur" --id_produit "id_produit" --quantite 6
		create: {
			params: {
				id_utilisateur: "string",
				id_produit: "string",
				quantite: "number"
			},
			handler(ctx) {
				var commande = new Models.Commande(ctx.params).create();
				console.log("Commande - create - ", commande);
				if (commande) {
					return Database()
						.then((db) => {
							return db.get("commandes")
								.push(commande)
								.write()
								.then(() => {
									return commande;
								})
								.catch(() => {
									return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
					});
				} 
				else {
					return new MoleculerError("Commandes", 417, "ERR_CRITIAL", { code: 417, message: "Commande is not valid" } )
				}
			}
		},


		//	call "commandes.get_commande" --id_commande 1871ce12-f54b-48ef-ba8d-db5ab68e6a11
		get_commande: {
			params: {
				id_commande: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_commande: ctx.params.id_commande })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var commande = db.get("commandes").find({ id: ctx.params.id_commande }).value();; //find({ id_commande: ctx.params.id_commande }).value();;
								return commande;
							})
							.catch(() => {
								return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Commandes", 404, "ERR_CRITIAL", { code: 404, message: "Commande doesn't exists" } )
					}
				})
			}
		},

		//	call "commandes.get_utilisateur" --id_utilisateur
		get_utilisateur: {
			params: {
				id_utilisateur: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verify_utilisateur", { id_utilisateur: ctx.params.id_utilisateur })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var value = db.get("commandes").find({ id: ctx.params.id_utilisateur }).value();;
								return value;
							})
							.catch(() => {
								return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Commandes", 404, "ERR_CRITIAL", { code: 404, message: "utilisateur n'a pas de commande "} )
					}
				})

			}
		},

		//	call "commandes.verify" --id_commande
		verify: {
			params: {
				id_commande: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id: ctx.params.id_commande })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		verify_utilisateur: {
			params: {
				id_utilisateur: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id_utilisateur: ctx.params.id_utilisateur })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "commandes.validation" --id_commande
		validation: {
			params: {
				id_commande: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_commande: ctx.params.id_commande })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var commande = db.get("commandes").find({ id: ctx.params.id_commande }).value();;
								return commande;
							})
							.catch(() => {
								return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Commandes", 404, "ERR_CRITIAL", { code: 404, message: "Commande doesn't exists" } )
					}
				})
			}
		},

		 // call "commandes.create" --id_utilisateur "id_utilisateur" --id_produit "id_produit" --quantite 6
		//	call "commandes.increment" --id_commande 6a933b21-aaa0-485c-86a0-349daf9ce9f1
		//call "commandes.get_commande" --id_commande 6a933b21-aaa0-485c-86a0-349daf9ce9f1
			increment: {
			params: {
				id_commande: "string",
			},
			handler(ctx) {
				return ctx.call("commandes.get_commande", { id_commande: ctx.params.id_commande })
						.then((db_commande) => {
							//
							//
							var commande = new Models.Commande(db_commande).create();
							commande.id_utilisateur = db_commande.id_utilisateur;
							commande.id_produit = db_commande.id_produit;
							commande.quantite = db_commande.quantite +1;
							//
							db_commande.quantite = db_commande.quantite +1
							//
							return Database()
								.then((db) => {
									return db.get("commandes")
										.find({ id: ctx.params.id_commande })
										.assign(commande)
										.write()
										.then(() => {
											return commande;
										})
										.catch(() => {
											return new MoleculerError("Commande", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		},
				//	call "commandes.decrement" --id_commande "id_commande" 
			decrement: {
			params: {
				id_commande: "string",
			},
			handler(ctx) {
				return ctx.call("products.get", { id_commande: ctx.params.id_commande })
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
										.find({ id: ctx.params.id_commande })
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
		/*
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


*/





	}
};
