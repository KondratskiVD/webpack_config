import * as $ from 'jquery';

function createAnalytics() {
  let counter = 0;
  let isDestroy = false;

  const listenerClick = () => counter++;

  $(document).on('click', listenerClick)

  return {
    destroy() {
      $(document).off('click', listenerClick);
      isDestroy = true;
    },
    getCounter() {
      if(isDestroy) {
        return 'Analytics is destroyed'
      }
      return `${counter} clicks was on this page`
    }
  }
}

window.analytics = createAnalytics()