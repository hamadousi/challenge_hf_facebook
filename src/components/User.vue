<template>
	<div>
		<div class="container">
			<p class="user_img"> <img :src="picture"></p>
			<p class="user_name">{{ name }}</p>
		</div>
		<div class="container">
			<br/>
			<div v-show="autorisationPhoto">
				<!--Affichage des albums-->
				<div v-show="!isShowAlbum">
					<div class="colAlbum">
						<album  v-for="album in orderedAlbums"
						        :key="album.id" 
								:name="album.name"
								:count="album.count"
								:picture="album.cover_photo.picture"
								v-on:showAlbum="getSelectAlbum(album.id,album.name)">
						</album>
					</div>
					<div class="pagination" v-show="!isShowAlbum">
						<a href="#" class="btn btn-primary" :disabled="previous" @click="getPreviousPage"> << </a>
						Page: {{ nombrePage }}
						<a  href="#" class="btn btn-primary" :disabled="next" @click="getNextPage"> >> </a>
					</div>
				</div>
				<!--/Affichage des albums-->
			</div>
		</div>
	</div>
</template>
<script>
import Album from './Album.vue'

export default {
	name: 'User',
	props: ['name','userId','picture','autorisationPhoto'],
	data () {
		return {
			albums:{},
			nombrePage: 1,
			previous: false,
			next: true,
			idAlbumSelect: 0,
			nameAlbumSelect:'',
			isShowAlbum: false
		}
	},
	components: {
		Album
	},
	mounted: function () {
		this.$nextTick(function () {
			//Recuperation des albums si l'utilisateur accepte
			if(this.autorisationPhoto){
				this.getAlbums();
			}
		});
	},
	methods: {
		/*
		* Fonction qui permet de recuperer les albums d'un user au chargement de la page
		*
		* Pour chaque album, on recupere : name,count,cover_photo{picture}, limit:'2'
		*/
		getAlbums:function () {
			let url = this.userId+'/albums';//Url pour recupere les album
			let params = {fields: 'name,count,cover_photo{picture}',limit:'2'};
			let vue = this;
			//Appel de l'api facebook
			FB.api(url,params,function (reponse) {
				if(reponse && !reponse.error) {
					//vue.$set(vue,'albums',reponse);
					vue.albums = reponse;
					vue.isDesableNextPrevious(reponse.paging);
				}
			});
		},
		/**
		* Fonction qui permet d'afficher un album selectionné
		* en mettant la variable isShowAlbum a true
		*
		* @param idAlbum //id de l'album selectionné
		* @param nameAlbum //nom de l'album selectionné
		*/
		getSelectAlbum: function (idAlbum,nameAlbum) {
			this.idAlbumSelect = idAlbum;
			this.nameAlbumSelect = nameAlbum;
			this.isShowAlbum = true;
		},
		/**
		* Fonction qui permet de reafficher tous les album
		* une que l'utiliseur consulte un album
		* en mettant isShowAlbum a false
		*
		*/
		showAllAlbum: function () {
			this.isShowAlbum = false;
		},
		/**
		* Fonction qui permet de recuperer la page suivante des alboums
		*
		*/
		getNextPage: function () {
			let url ='';
			let vue = this;
			//Si le lien 'a' n'est pas en mode disable
			if(!this.next) {
				url = this.albums.paging.next;
				//Appel de l'api facebook
				FB.api(url,function (reponse) {
					if(reponse && !reponse.error) {
						vue.albums = reponse;
						vue.isDesableNextPrevious(reponse.paging);
						vue.nombrePage ++;
					}
				});
			}
		},
		/**
		* Fonction qui permet de recuperer la page precedente des alboums
		*
		*/
		getPreviousPage: function () {
			let url ='';
			let vue = this;
			//Si le lien a pour previous n'est pas en mode disable
			if(!this.previous) {
				url = this.albums.paging.previous;
				//Appel de l'api facebook
				FB.api(url,function (reponse) {
					if(reponse && !reponse.error) {
						vue.albums = reponse;
						vue.isDesableNextPrevious(reponse.paging);
						vue.nombrePage --;
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
	},
	computed: {
		orderedAlbums: function () {
			return _.sortBy(this.albums.data,['name']);
		}
	}
}
</script>

<style type="text/css">
	.colAlbum {
		-webkit-column-count: 2;
        -moz-column-count: 2;
        column-count: 2;
        -moz-column-gap: 0em;
        -webkit-column-gap: 0em;
        column-gap: 0em;
	}
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
	.user_img {
		display : inline ;
		float : left ;
		text-align : left ;
		margin-top: 20px
    }
    .user_name {
    	margin-left: 10px;
		display : inline ;
		float : left ;
		text-align : left;
		margin-top: 20px;
    }
</style>