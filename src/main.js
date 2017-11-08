import Vue from 'vue'
import App from './App.vue'

//Le code de chargement du SDK de facebook
(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk')
);

new Vue({
  el: '#app',
  render: h => h(App)
})
