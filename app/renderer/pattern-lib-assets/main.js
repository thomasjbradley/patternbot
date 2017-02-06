var resizeIframe = function (iframe) {
  setTimeout(function () {
    iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
    iframe.contentWindow.document.body.style.overflow = 'hidden';
  }, 100);
};

(function () {
  'use strict';
  var resizeTimeout;

  var resizeAllIframes = function () {
    var iframes = document.querySelectorAll('iframe');

    [].forEach.call(iframes, function (iframe) {
      iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
    });
  };

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeAllIframes, 50);
  });
}());
