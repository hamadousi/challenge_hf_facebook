<template>
	<div>
		<div class="thumbnail " @click="getAlbum">
			<div class="caption "> {{ name }} </div>
			<div class="image" v-bind:style="getUrlImage(picture)"></div>
			<div class="caption">{{ count }}</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'Album',
		props: ['name', 'count','picture'],
		data () {
			return {

			}
		},
		methods: {
			getAlbum: function () {
				this.$emit('showAlbum');
			},
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
	
</style>