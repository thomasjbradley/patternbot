var jsToInject = document.getElementById('inject-js').innerHTML;
var defaultCssToInject = document.getElementById('inject-css').innerHTML;

var injectJs = function (iframe) {
  var script = document.createElement('script');

  script.innerHTML = jsToInject;
  iframe.contentWindow.document.body.appendChild(script);
};

var injectCss = function (iframe) {
  var style = document.createElement('style');

  if (iframe.dataset.injectCss) {
    style.innerHTML = iframe.dataset.injectCss;
    iframe.contentWindow.document.body.classList.add('custom-bg-colors-used');
  } else {
    style.innerHTML = defaultCssToInject;
  }

  iframe.contentWindow.document.head.appendChild(style);
};

var resizeIframe = function (iframe) {
  injectJs(iframe);
  injectCss(iframe);
};

iFrameResize({
  heightCalculationMethod: 'max',
});

/*
  ================================================
  IFRAME RESPONSIVENESS
  ================================================
*/
(function () {
  'use strict';

  var iframes = document.querySelectorAll('iframe');

  [].forEach.call(iframes, function (iframe) {
    var outside = iframe.parentNode;
    var resizeLength = iframe.parentNode.querySelector('.resizeable-pattern-length');

    if (!resizeLength) return;

    interact(resizeLength).resizable({
      edges: {
        left: '.resize-handle-left',
        right: '.resize-handle-right',
        bottom: false,
        top: false,
      },
      onmove: function (e) {
        var width = e.rect.width;
        var availableSpace = outside.parentNode.clientWidth - parseInt(getComputedStyle(outside.parentNode).paddingLeft.replace(/px/), 10) - parseInt(getComputedStyle(outside.parentNode).paddingRight.replace(/px/), 10);

        if (width < 120) width = 120;
        if ((width * 2) > availableSpace) width = availableSpace / 2;

        iframe.style.pointerEvents = 'none';
        outside.style.width = (width * 2) + 'px';
        resizeLength.style.width = (width * 1) + 'px';
        iframe.iFrameResizer.resize();
      },
      onend: function () {
        iframe.style.pointerEvents = 'auto';
        iframe.iFrameResizer.resize();
      },
    });
  });
}());
