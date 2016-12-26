var app = {
  config: {
    user_id: '88203791@N00',
    api_key: 'a23c354d297d7d6f1a09911036534ada',
    extras:  'url_t,url_c,url_l,url_o',
    name:    'Stefan Klauke',
    flickr:  'https://www.flickr.com/photos/88203791@N00/'
  }
}

Vue.use(VueLazyload, {
    preLoad: 2.3,
    // error: 'dist/404.png',
    loading: 'loading-spin.svg',
    listenEvents: [ 'scroll' ]
})

app.vm = new Vue({
  el: '#app',
  data: {
    config: app.config,
    photos: [],
    fullHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeigh
  },
  computed:{
    photoStyles : function(){
      var result = {};
      var vm = this;
      this.photos.forEach(function(photo){
        result[photo.id]={
          height: vm.fullHeight +'px',
          width: Math.floor(photo.width_l * vm.fullHeight/photo.height_l, 10) +'px'
        }
      })
      return result;
    }
  },
  beforeCreate: function () {
    var vm = this;

    return axios.get('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + app.config.api_key + '&format=json&nojsoncallback=1&user_id=' + app.config.user_id + '&extras=' + app.config.extras + '&media=photos&sort=interestingness-desc&per_page=500')
      .then(function (response) {
        vm.photos = response.data.photos.photo.map(function(photo){
          photo.url_c = photo.url_c ? photo.url_c : photo.url_o;
          photo.url_l = photo.url_l ? photo.url_l : photo.url_c;
          photo.url_o = photo.url_o ? photo.url_o : photo.url_l;
          photo.imgObj={
            // src: photo.url_o ? photo.url_o : photo.url_l,
            src: (vm.fullHeight < 600) ? photo.url_l  : photo.url_o,
            loading: photo.url_t
          }
          return photo
        });
        return vm.photos;
      })
  },
  mounted: function () {
    this.$nextTick(function() {
      window.addEventListener('resize', this.handleResize)
    });
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize: function(event){
      this.fullHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeigh;
    }
  }
})