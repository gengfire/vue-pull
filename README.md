# pull

npm install vue-pull

index.vue
```html
  <template>
    <ul id="pullup">
      <li v-for="li in list"></li>
    </ul>
  </template>
```
<pre><code>
  import Vue from 'vue';
  import pull from 'vue-pull';
  Vue.use(pull);
  
  fetchData(callback){
      fetch('',{
        page: this.page
      })
      .then(res=>{
        if (res.status !== 200) return
        callback && callback();
        this.$pull(document.querySelector('#pullup'), 'up', res.data.has_next?loaded=>{
          this.page ++;
          this.fetchData(()=>{
            loaded && loaded();
          });
        }:'done');
      });
  }
  </code></pre>
