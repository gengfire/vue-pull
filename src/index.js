function pull (Vue){
  let pullArr = [],
  nomore = false,
  vueConstructor = Vue.extend(require('./pull.vue')),

  pull = function($ele, type='up', fns) {
    if ('function' !== typeof fns) nomore = true;
    if (pullArr.indexOf(type)>=0 && !nomore) return;
    pullArr.push(type);
    let eleStyle = $ele.style,
    s_height = window.screen.height,
    maxThreshold = 'up' === type ? 30 : 40,
    sy = 0,
    diffY,
    pulltips = {
      up: '上拉加载更多',
      down:'下拉刷新页面',
      pullend:'松开开始加载',
      loading:'数据加载中...'
    };
    if(nomore){
      pulltips = {
        up: '暂无更多记录',
        down:'暂无更多记录',
        pullend:'暂无更多记录',
        loading:'暂无更多记录'
      };
    }
    let vueVDom = new vueConstructor({
      data: {
        type: type,
        pulltips: 'up' === type ? pulltips.up : pulltips.down
      }
    }).$mount(),
    pullHtml = vueVDom.$el,
    pullStyle = pullHtml.style;
    if ('up' === type) {
      $ele.parentNode.appendChild(pullHtml);
    } else {
      $ele.parentNode.insertBefore(pullHtml, $ele);
    }

    let touchstart = function(e){
      eleStyle.transition = eleStyle.webkitTransition = pullStyle.transition = pullStyle.webkitTransition = 'none';
      sy = e.targetTouches[0].pageY;
      $ele.addEventListener('touchmove', touchmove, false);
      $ele.addEventListener('touchend', touchend , false);
      $ele.addEventListener('touchcancel', touchcancel, false);
    },
    touchmove = function(e){
      let moveY = e.targetTouches[0].pageY;
      diffY = sy - moveY;  //正up  负down
      if ( 'up' === type && diffY>0 && window.scrollY >= (document.body.clientHeight - window.innerHeight) ) {  //up
        e.preventDefault();
        //set resistance
        let threshold = diffY / ( diffY / s_height + 2.5);
        eleStyle.transform = eleStyle.webkitTransform = 'translate3d(0,'+ (-threshold) +'px,0)';   //上拉偏移
        let pullY = threshold;
        if (threshold > maxThreshold) {
          pullY = maxThreshold;
          vueVDom.pulltips = pulltips.pullend;
        }
        pullStyle.transform = pullStyle.webkitTransform = 'translate3d(0,'+ (-pullY/2) +'px,0)';   //上拉偏移
      } else if ( 'down' === type && diffY<0 && window.scrollY <= 0 ){  //down
        e.preventDefault();
        //set resistance
        let threshold = diffY / ( diffY / s_height - 2.5);
        eleStyle.transform = eleStyle.webkitTransform = 'translate3d(0,'+ threshold +'px,0)';   //下拉偏移
        let pullY = threshold;
        if (threshold > maxThreshold) {
          pullY = maxThreshold;
          vueVDom.pulltips = pulltips.pullend;
        }
        pullStyle.transform = pullStyle.webkitTransform = 'translate3d(0,'+ pullY +'px,0)';   //提示下拉偏移
      }
    },
    touchend = function(e){
      if ( 'up' === type && diffY>0 && window.scrollY >= (document.body.clientHeight - window.innerHeight) ) {  //up
        eleStyle.transition = eleStyle.webkitTransition = pullStyle.transition = pullStyle.webkitTransition = 'all .4s ease';
        eleStyle.transform = eleStyle.webkitTransform = 'translate3d(0,'+ (-maxThreshold) +'px,0)';   //上拉偏移回弹等待...
        vueVDom.pulltips = pulltips.loading;
        if (nomore) {
          eleStyle.transform = eleStyle.webkitTransform = pullStyle.transform = pullStyle.webkitTransform = 'translate3d(0,0,0)';   //上拉偏移回弹结束
          vueVDom.pulltips = pulltips.up;
        } else {
          fns(function(){
            eleStyle.transform = eleStyle.webkitTransform = pullStyle.transform = pullStyle.webkitTransform = 'translate3d(0,0,0)';   //上拉偏移回弹结束
            vueVDom.pulltips = pulltips.up;
          });
        }
      } else if ( 'down' === type && diffY<0 && window.scrollY <= 0 ) { //down
        eleStyle.transition = eleStyle.webkitTransition = pullStyle.transition = pullStyle.webkitTransition = 'all .4s ease';
        eleStyle.transform = eleStyle.webkitTransform = 'translate3d(0,'+ maxThreshold +'px,0)';   //下拉偏移回弹等待...
        pullStyle.transform = pullStyle.webkitTransform = 'translate3d(0,'+ maxThreshold +'px,0)';        //提示下拉偏移等待...
        vueVDom.pulltips = pulltips.loading;
        if (nomore) {
          eleStyle.transform = eleStyle.webkitTransform = pullStyle.transform = pullStyle.webkitTransform = 'translate3d(0,0,0)';   //上拉偏移回弹结束
          vueVDom.pulltips = pulltips.down;
        }else{
          fns(function(){
            eleStyle.transform = eleStyle.webkitTransform = pullStyle.transform = pullStyle.webkitTransform = 'translate3d(0,0,0)';   //上拉偏移回弹结束
            vueVDom.pulltips = pulltips.down;
          });
        }
      }
      $ele.removeEventListener('touchstart', touchmove, false);
      $ele.removeEventListener('touchmove', touchmove, false);
      $ele.removeEventListener('touchend', touchend , false);
      $ele.removeEventListener('touchcancel', touchcancel, false);
    },
    touchcancel = function(e){
      eleStyle.transform = eleStyle.webkitTransform = pullStyle.transform = pullStyle.webkitTransform = 'translate3d(0,0,0)';   //上拉偏移回弹结束
      vueVDom.pulltips = 'up' === type ? pulltips.up : pulltips.down;
      $ele.removeEventListener('touchstart', touchmove, false);
      $ele.removeEventListener('touchmove', touchmove, false);
      $ele.removeEventListener('touchend', touchend , false);
      $ele.removeEventListener('touchcancel', touchcancel, false);
    };
    //touchstart
    $ele.addEventListener('touchstart', touchstart, false);
  };

  Vue.prototype.$pull = pull;
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(pull);
}

export default pull;