<template>
	<div class="container">
		<p>Album: {{ name }} </p>
		<div class="row">
			<photo v-for="photo in photos.data"
					:picture="photo.picture"
					:key="photo.id"
					v-on:selectPhoto="photoSelectedDeselected(photo.source)"
					class="col-xs-6">
				
			</photo>
		</div>
		<div class="pagination">
			<a href="#" class="btn btn-primary" :disabled="previous" @click="getPreviousPage"> << </a>
			Page: {{ nombrePage }}
			<a  href="#" class="btn btn-primary" :disabled="next" @click="getNextPage"> >> </a>
		</div>
		<button class="btn btn-warning" @click="mesAlbums">Mes albums</button>
	</div>
</template>

<script>
import Photo from './Photo.vue'
export default {
	name: 'ShowAlbum',
	props: ['idAlbum','name'],
	data () {
		return {
			photos: {},
			nombrePage: 1,
			previous: false,
			next: true,
			uploadPhoto: []
		}
	},
	components: {
		Photo
	},
	mounted () {
		this.$nextTick(function () {
			this.getAlbumPhotos();
		})
	},
	methods: {
		/*
	* Fonction qui permet de recuperer les photos d'un album 
	*
	* Pour chaque album, on recupere : name,count,cover_photo{picture}, limit:'2'
	*/
	getAlbumPhotos:function () {
		//Url pour recupere les photos d'un album
		let url = this.idAlbum+'/photos';
		//Le parametre pour les donnees a renvoyer
		let params = {fields: 'source,picture',limit:'4'};
		let vue = this;
		//Appel de l'api facebook
		FB.api(url,params,function (reponse) {
			if(reponse && !reponse.error) {
				vue.photos = reponse;
				vue.isDesableNextPrevious(reponse.paging);
			}
		});
	},
	/**
	* Fonction qui permet d'indiquer au composant parent, de reafficher les albums
	*
	*/
	mesAlbums: function () {
		this.$emit('mesAlbums')
	},
	/*
	* Fonction qui permet d'ajouter ou de retirer une photo dans le tableau
	* des photos(selectionner ou deselectionner ) a telecharger et a envoyer
	*
	*/
	photoSelectedDeselected: function (sourcePhoto) {
		//Si la photo a ete ajoute, on le supprime du tablaux(cas de deselection d'une photo)
		if(this.uploadPhoto.includes(sourcePhoto)){
			let index = this.uploadPhoto.indexOf(sourcePhoto);
			this.uploadPhoto.splice(index,1);
		}
		else//Ajour du photo dans le tableau
			this.uploadPhoto.push(sourcePhoto);
		},
		/**
		* Fonction qui permet de recuperer la page suivante des photos d'un album
		*
		*/
		getNextPage: function () {
			let url ='';
			let vue = this;
			//Si le lien 'a' n'est pas en mode disable
			if(!this.next) {
				url = this.photos.paging.next;
				//Appel de l'api facebook
				FB.api(url,function (reponse) {
					if(reponse && !reponse.error) {
						vue.photos = reponse;
						vue.isDesableNextPrevious(reponse.paging);
						vue.nombrePage ++;
						vue.uploadPhoto = [];
					}
				});
			}
		},
		/**
		* Fonction qui permet de recuperer la page precedente des d'un album
		*
		*/
		getPreviousPage: function () {
			let url ='';
			let vue = this;
			//Si le lien a pour previous n'est pas en mode disable
			if(!this.previous) {
				url = this.photos.paging.previous;
				//Appel de l'api facebook
				FB.api(url,function (reponse) {
					if(reponse && !reponse.error) {
						vue.photos = reponse;
						vue.isDesableNextPrevious(reponse.paging);
						vue.nombrePage --;
						vue.uploadPhoto = [];
					}
				});
			}
		},
		/**
		* Fonction qui permet de a true ou false les variables next et previous
		* pour la pagination
		*
		* @param paging //Une pagination
		*/
		isDesableNextPrevious: function (paging) {
			this.next = paging.next ? false : true;
			this.previous = paging.previous ? false : true;
		}
	}
}
</script>

<style type="text/css">
	.pagination {
    	display: inline-block;
    }	

	.pagination button {
	    color: white;
	    float: left;
	    padding: 8px 16px;
	    text-decoration: none;
	    margin: 10px;
	}
</style>