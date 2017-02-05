var gutterMatcher = document.getElementById('gutter-length-matcher');

var getGutterWidth = function () {
  return getComputedStyle(gutterMatcher).paddingLeft;
};

getGutterWidth();

var resizeIframe = function (iframe) {
  setTimeout(function () {
    var paddingLeft = getGutterWidth();

    iframe.contentWindow.document.body.style.paddingLeft = paddingLeft;
    iframe.contentWindow.document.body.style.paddingRight = paddingLeft;
    iframe.contentWindow.document.body.querySelector(':last-child').style.marginBottom = '0';
    iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
    iframe.contentWindow.document.body.style.overflow = 'hidden';
  }, 100);
};

(function () {
  'use strict';
  var resizeTimeout;

  var resizeAllIframes = function () {
    var iframes = document.querySelectorAll('iframe');
    var paddingLeft = getGutterWidth();

    [].forEach.call(iframes, function (iframe) {
      iframe.contentWindow.document.body.style.paddingLeft = paddingLeft;
      iframe.contentWindow.document.body.style.paddingRight = paddingLeft;
      iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
    });
  };

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeAllIframes, 50);
  });
}());
