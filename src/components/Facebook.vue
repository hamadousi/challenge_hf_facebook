<template>
	<div>
		<div class="container">
			<div class="verticalButton" v-if="!connecter">
				<button class="btn btn-primary" @click="login">Authentification</button>
			</div>
			<div v-else>
				<user :user-id="user.id" 
	            		:name="user.name"
	            		:picture="user.picture.data.url"
	            		:autorisation-photo="autorisationPhoto">
	      </user>
			</div>
		</div>
	</div>
</template>

<script>
import User from './User.vue'
export default {
	name: 'Facebook',
	data () {
	    return {
	      connecter: false,
	      user: {},
	      permission:''
	    }
	},
	components: {
		User
	},
	methods: {
		/**
		* Fonction qui permet a un utilisateur de connecter 
		* en utilisant l'authentification facebook
		*
		*/
		login: function () {
		    let vue = this;
		    FB.login(function(response){
		    vue.statusChangeCallback(response);
		    },{scope: 'public_profile,email,user_photos'});
		},
		/**
		* Fonction qui permet de prendre le status d'un utlisateur 
		* s'il est connecté ou non
		*
		*/
		statusChangeCallback: function (response) {
	        if(response.status === 'connected'){
	        	this.getUser();
	        }
	        else {
	            this.connecter = false;
	        }
    	},
    	/**
		* Fonction qui permet de recuperer les donnees d'un utilisateur connecté. 
		* Donnees recuperer: id, name, picture, permissions
		* 
		*
		*/
    	getUser: function () {
	        let vue = this;
		    FB.api('/me',{fields: 'id,name,picture,permissions'}, function (response) {
		        //vue.$set(vue,'user',response);
		        vue.user = response;
		        vue.permissionPhoto(response.permissions.data);
		        vue.connecter = true;
		    });
    	},
    	/**
    	* Fonction qui permet de savoir si l'utisiateur a accepté
    	* l'autorisation de consulter ses photos
    	*
    	*/
    	permissionPhoto: function (permissions) {
	        for(let index in permissions){
	            if(permissions[index].permission === 'user_photos'){
	                this.permission = permissions[index].status;
	                break;
	            }
	        }
    	},
	},
	computed: {
		/**
		* Fonction qui permet de retourner le status l'autorisation
		* sur la consultation des photos de l'utilisateur connecté
		*
		* @return boolean 
		*/
		autorisationPhoto: function () {
	        if(this.permission === 'granted')
	            return true;
	        return false;
    	}
	}
}
</script>

<style type="text/css">
	.verticalButton {
		height: 200px;
		text-align:center;
		line-height:200px;
	}
</style>