var injectScript = document.querySelector('#iframe-resizer-content-window').innerHTML;

var resizeIframe = function (iframe) {
  var script = document.createElement('script');

  script.innerHTML = injectScript;
  iframe.contentWindow.document.body.appendChild(script);
};

iFrameResize();

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
