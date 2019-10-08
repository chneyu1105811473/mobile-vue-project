/**
 * author chenyu
 * Reference zepto event.js
 * /
 
 /** usage: 
 * 1.import this in main.js
 * 2.use directive(v-touch:longTap||v-touch:longtap,v-touch:swipeLeft etc.)
 */ 
 
import Vue from 'vue'
// create directive
Vue.directive('touch', {
  //mode: swiperight swipeleft swipetop swipedown tap longtap doubletap
  bind: function (el, binding, vnode) {
    vnode = vnode || {}
    //eg: v-touch:swipeRight
    let touchType = binding.arg.toLowerCase()
    //variables for handle swipe
    var now
    var delta
    var deltaX = 0
    var deltaY = 0
    var touch = {}
    //timer
    var longTapTimeout
    var touchTimeout
    var tapTimeout
    var swipeTimeout

    //return swipexx
    function swipeDirection(x1, x2, y1, y2) {
      return Math.abs(x1 - x2) >=
        Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'left' : 'right') : (y1 - y2 > 0 ? 'up' : 'down')
    }

    function cancelLongTap() {
      if (longTapTimeout) clearTimeout(longTapTimeout)
      longTapTimeout = null
    }

    function cancelAll() {
      if (touchTimeout) clearTimeout(touchTimeout)
      if (tapTimeout) clearTimeout(tapTimeout)
      if (swipeTimeout) clearTimeout(swipeTimeout)
      if (longTapTimeout) clearTimeout(longTapTimeout)
      touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
      touch = {}
    }

    el.addEventListener('touchstart', function (ev) {
      touch.x1 = ev.touches[0].pageX
      touch.y1 = ev.touches[0].pageY
      now = Date.now()
      delta = now - (touch.last || now)
      if (delta > 0 && delta <= 250) touch.isDoubleTap = true
      touch.last = now
      longTapTimeout = setTimeout(() => {
        longTapTimeout = 0
        if (touchType === 'longtap') {
          binding.value(vnode)
        }
      }, 750)
    }, false)

    el.addEventListener('touchmove', function (ev) {
      cancelLongTap()
    })

    el.addEventListener('touchend', function (ev) {
      cancelLongTap()
      touch.x2 = ev.changedTouches[0].pageX
      touch.y2 = ev.changedTouches[0].pageY
      deltaX += Math.abs(touch.x1 - touch.x2)
      deltaY += Math.abs(touch.y1 - touch.y2)
      if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
        (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))
        swipeTimeout = setTimeout(function () {
          let type = 'swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2))
          if (binding.value && touchType === type) {
            binding.value(vnode)
          }
          touch = {}
        }, 0)

      // normal tap
      else if ('last' in touch) {
        // don't fire tap when delta position changed by more than 30 pixels,
        // for instance when moving to a point and back to origin
        if (deltaX < 30 && deltaY < 30) {
          // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
          // ('tap' fires before 'scroll')
          tapTimeout = setTimeout(function () {
            clearTimeout(touchTimeout)
            // trigger universal 'tap' with the option to cancelTouch()
            // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
            if (touchType === 'tap') {
              ev.cancelTouch = cancelAll
            }
            //   // [by paper] fix -> "TypeError: 'undefined' is not an object (evaluating 'touch.el.trigger'), when double tap
            //   if (touch.el) touch.el.trigger(event)
            // trigger double tap immediately
            if (touch.isDoubleTap) {
              if (binding.value && touchType === 'doubletap') {
                binding.value(vnode)
              }
              touch = {}
            }

            // trigger single tap after 250ms of inactivity
            else {
              touchTimeout = setTimeout(function () {
                touchTimeout = null
                if (binding.value && touchType === 'tap') {
                  binding.value(vnode)
                }
                touch = {}
              }, 250)
            }
          }, 0)
        } else {
          touch = {}
        }
        deltaX = deltaY = 0
      }
    }, false)
  }
})
