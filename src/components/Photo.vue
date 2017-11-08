<template>
	<div>
		<div class="thumbnail " @click="selectPhoto">
			<div  class="image" :style="getUrlImage(picture)"><img class="image_select" src="../assets/cocher.png" v-show="select"></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Photo',
		props: ['picture'],
		data () {
			return {
				select: false
			}
		},
		methods: {
			/**
			* Fonction qui reagie si on clic sur  la photo
			* elle envoi un evennement pour le noeud parent
			* et met a jour la variable select.
			*
			*/
			selectPhoto: function () {
				this.select = !this.select;
				this.$emit('selectPhoto');
			},
			/**
			* Fonction qui reture un url pour afficher l'image
			* en background
			*
			* @return url //L'url pour le background
			*/
			getUrlImage: function (url) {
				return "background-image:url("+url+")";
			}
		}
	}
</script>
<style type="text/css">
	.thumbnail {
		width: 70%;
		margin-left:0px;
		margin-right: 0px;
		padding: 0px;
	}
	.image {
		background-size: cover;
		width: 100%;
		height: 200px;
	}
	.image_select {
		width: 30px;
		height: 30px;
	}
</style>