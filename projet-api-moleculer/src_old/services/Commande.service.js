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
//call "commandes.create" --id_utilisateur c24741c6-c548-4122-a4dd-08cc4fdde25d --id_produit c24741c6-c548-4122-a4dd-08cc4fdde25d --quantite 5
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


		//	call "commandes.get" --id_commande 974ca58e-b190-4018-963a-a482e90d54b8
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
			//call "commandes.increment" --id_commande 23462a11-9c25-4879-b35e-66299229ac31
			increment: {
			params: {
				id_commande: "string",
			},
			handler(ctx) {
				return ctx.call("commandes.get", { id_commande: ctx.params.id_commande })
						.then((db_commande) => {
							//
							var commande = new Models.Commande(db_commande).create();

							commande.quantite = db_commande.quantite +1;

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
		}

















	}
};
