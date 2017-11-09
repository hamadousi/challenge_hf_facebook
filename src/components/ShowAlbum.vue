<template>
	<div class="container">
		<p>Album: {{ name }} </p>
		<!--Section affichage des photos-->
		<div class="row">
			<photo v-for="photo in photos.data"
					:picture="photo.source"
					:key="photo.id"
					:end-upload="endUpload"
					v-on:selectPhoto="photoSelectedDeselected(photo.source)"
					class="col-xs-6">
				
			</photo>
		</div>
		<!--/Section affichage des photos-->
		<!--La bar de progression pour le telechargement des photos-->
		<progress-bar v-model="progressModel" v-show="progressModel"></progress-bar>
		<!--Section pour la pagination-->
		<div class="pagination">
			<a href="#" class="btn btn-primary" :disabled="previous" @click="getPreviousPage"> << </a>
			Page: {{ nombrePage }}
			<a  href="#" class="btn btn-primary" :disabled="next" @click="getNextPage"> >> </a>
		</div>
		<!--Section pour les buttons-->
		<button class="btn btn-warning" @click="mesAlbums">Mes albums</button>
		<button class="btn btn-warning" @click="confirmUpload" v-show="existPhotoToUpload">Envoyer les photos</button>
		<br/>
		<!--Section pour le composant alert-->
		<simplert :useRadius="true" :useIcon="true" ref="simplert"></simplert>
	</div>
</template>

<script>
import Photo from './Photo.vue'
import Firebase from 'firebase'
import ProgressBar from 'vue-progress-bar'
import Simplert from 'vue2-simplert'

//La variable de configuration de firebase
let config = {
	apiKey: "xxxxxxx",
    authDomain: "xxxxxxxx.firebaseapp.com",
    databaseURL: "xxxxxxxxxx.firebaseio.com",
    storageBucket: "xxxxxxxxx.appspot.com",
    messagingSenderId: "xxxxxxxxxxxxxxxx"
};
//Initialisation
let baseFire = Firebase.initializeApp(config);
//Recuperation de la base de donnees
let db = baseFire.database();
//Recuperation du noeud pour les images
let imagesRef = db.ref('images');

export default {
	name: 'ShowAlbum',
	props: ['idAlbum','name'],
	firebase:  {
		images : imagesRef
	},
	data () {
		return {
			photos: {},
			nombrePage: 1,
			previous: false,
			next: true,
			uploadPhoto: [],
			progressModel: 0,
			endUpload: false
		}
	},
	components: {
		Photo,
		ProgressBar,
		Simplert
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
		* Pour chaque album, on recupere : name,count,cover_photo{picture}, limit:'8'
		*/
		getAlbumPhotos:function () {
			//Url pour recupere les photos d'un album
			let url = this.idAlbum+'/photos';
			//Le parametre pour les donnees a renvoyer
			let params = {fields: 'source,picture',limit:'8'};
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
			//Ajour du photo dans le tableau
			else{
					//Pour afficher l'image coché
					if(this.endUpload)
						this.endUpload = false;
					this.uploadPhoto.push(sourcePhoto);
				}
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
		},
		/**
		* Fonction qui permet de demander a l'utilisateur 
		* de confirmer d'envoi de ses photos
		*
		*/
		confirmUpload: function () {
			let obj = {
				    title: 'Téléchargement',
				    message: 'Êtves-vous sûr d\'envoyer vos photos',
				    type: 'warning',
				    customCloseBtnText: 'Non',
				    useConfirmBtn: true,
				    customConfirmBtnText: 'Oui',
					onConfirm: this.photoUploaded
			}
			this.$refs.simplert.openSimplert(obj);
		},
		/*
		* Fonction qui permet d'envoyer les photos selectionnees 
		* sur firebase
		*
		*/
		photoUploaded: function () {
			let imageUpload = { 'image': ''};
			let okExiste= false;
			//Parcours des photos selectionnees
			for(let index in this.uploadPhoto) {
				//Verification si la photo n'existe pas dans firebase
				for(let indexbase in this.images) {
					//Si la phote existe dans firebase
					if( this.images[indexbase].image == this.uploadPhoto[index]){
						okExiste = true;
						break;
					}
				}
				//Si la photo n'existe pas, alors ajout dans firebase
				if(!okExiste){
					imageUpload.image = this.uploadPhoto[index];
					imagesRef.push(imageUpload); 
				}
				else okExiste =false;
				//Pour la progression de la bar
				this.progressModel += 1/this.uploadPhoto.length;
			}
			//Pour cacher la bar de progression
			let vm = this;
			setTimeout(function(){vm.progressModel=0;}, 4000);
			//Affichage de confirmation
        	toastr.success('Le téléchargement et l\'envoi a réussi');
        	this.uploadPhoto = [];
        	this.endUpload =true;

		}

	},
	computed: {
		/**
		* Fonction qui permet d'indiquer s'il y a au moins 
		* une photo a uploade afin afficher le button
		* qui permet d'envoyer les photos
		*
		* @return boolean
		*/
		existPhotoToUpload: function () {
			return this.uploadPhoto.length > 0;
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