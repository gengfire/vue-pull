<style scoped>
.load-more{height:0.42rem;}
.load-more>p{text-align:center;padding:.1rem;color:#999;}
</style>
<template>
  <div class="load-more">
    <p v-if="pulltips">{{pulltips}}</p>
  </div>
</template>