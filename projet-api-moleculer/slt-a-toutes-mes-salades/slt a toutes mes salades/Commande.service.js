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



		// call "commandes.create" --id_utilisateur "id_utilisateur" --id_produit "id_produit" --quantite "quantite"
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
				} else {
					return new MoleculerError("Commandes", 417, "ERR_CRITIAL", { code: 417, message: "Commande is not valid" } )
				}
			}
		},


		//	call "commande.get" --id_commande
		get: {
			params: {
				id_commande: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_commande: ctx.params.id_commande })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var commande = db.get("commandes").find({ id_commande: ctx.params.id_commande }).value();;
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

		//	call "commandes.verify" --id_commande
		verify: {
			params: {
				id_commande: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id_commande: ctx.params.id_commande })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "commande.validation" --id_commande
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
								var commande = db.get("commandes").find({ id_commande: ctx.params.id_commande }).value();;
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

	}
};
