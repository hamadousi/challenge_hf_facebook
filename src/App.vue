<template>
	<div id="app">
		<facebook></facebook>
	</div>
</template>

<script>
import Facebook from './components/Facebook.vue'
export default {
	name: 'app',
	components: {
		Facebook
	},
	mounted () {
        let vue = this;
        //Initialisation du SDK de facebook
        window.fbAsyncInit = function() {
	        FB.init({
	          appId            : '146459662751166',
	          autoLogAppEvents : true,
	          xfbml            : true,
	          version          : 'v2.10'
	        });
        }
  },
}
</script>