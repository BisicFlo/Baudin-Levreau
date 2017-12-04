const uuidv4 = require('uuid/v4');

var fields_reducers = {
	"id_utilisateur": (value) => value.length > 0
};


var CommandeModel = function(params) {
	this.id_commande = params.id_commande || uuidv4();
	this.id_utilisateur = params.id_utilisateur || "";
	this.id_produit = params.id_produit || "";
	this.quantite = params.quantite || 0;
}

CommandeModel.prototype.create = function() {

	var valid = true;

	var keys = Object.keys(fields_reducers);

	for (var i = 0; i < keys.length; i++)
	{
		if ( typeof this[keys[i]] != typeof undefined ) {
			if ( !fields_reducers[keys[i]](this[keys[i]]) )
			{
				valid = false;
			}
		}
		else
		{
			valid = false;
		}
	}

	if (valid) {
		return this;
	} else {
		return undefined;
	}
}

module.exports = CommandeModel;