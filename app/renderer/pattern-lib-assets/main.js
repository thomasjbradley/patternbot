/*
  ================================================
  IFRAME CSS & JS INJECTION
  ================================================
*/
(function () {
  var jsToInject = document.querySelectorAll('.injectable-js');
  var defaultCssToInject = document.getElementById('inject-css').innerHTML;

  var injectJs = function (iframe) {
    var script;

    if (!jsToInject) return;

    [].forEach.call(jsToInject, function (js) {
      script = document.createElement('script');
      script.innerHTML = js.innerHTML;
      iframe.contentWindow.document.body.appendChild(script);
    });
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

  window.resizeIframe = resizeIframe;
}());

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

/*
  ================================================
  NAVIGATION TABS
  ================================================
*/
(function () {
  'use strict';

  var tablist = document.querySelectorAll('[role="tablist"] a');
  var showAllBtn = document.getElementById('nav-show-all');
  var possibleInitialTab;

  var areAllPatternsShowing = function () {
    return (showAllBtn.getAttribute('aria-pressed') == 'true');
  }

  var loadAllVisibleIframes = function () {
    var visibleIframes = document.querySelectorAll('[role="tabpanel"]:not([hidden]) iframe');

    if (!visibleIframes) return;

    [].forEach.call(visibleIframes, function (iframe) {
      if (!iframe.src) {
        iframe.src = iframe.dataset.src;

        iFrameResize({
          heightCalculationMethod: 'lowestElement',
          // autoResize: false,
          minHeight: (iframe.dataset.minHeight) ? parseInt(iframe.dataset.minHeight, 10) : 0,
          resizedCallback: function (opts) {
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                opts.iframe.previousElementSibling.setAttribute('hidden', true);
                opts.iframe.style.opacity = 1;
              });
            });
          },
        }, iframe);
      }
    });
  };

  var switchTabs = function (link) {
    var openLinks = document.querySelectorAll('[role="tab"][aria-selected="true"');
    var openTabs = document.querySelectorAll('[role="tabpanel"]:not([hidden])');
    var newTab = document.getElementById(link.getAttribute('aria-controls'));

    if (openTabs) {
      [].forEach.call(openTabs, function (openTab) {
        openTab.setAttribute('hidden', true);
        openTab.setAttribute('aria-hidden', true);
      });
    }

    if (openLinks) {
      [].forEach.call(openLinks, function (openLink) {
        openLink.setAttribute('aria-selected', false);
      });
    }

    newTab.removeAttribute('hidden');
    newTab.setAttribute('aria-hidden', false);
    link.setAttribute('aria-selected', true);
    window.location.hash = link.getAttribute('href');

    loadAllVisibleIframes();
  };

  var switchToFirstTab = function () {
    var firstATag = document.querySelector('[role="tablist"] > li:first-child [role="tab"]');

    if (firstATag) switchTabs(firstATag);
  };

  var showAllTabs = function () {
    var allTabs = document.querySelectorAll('[role="tabpanel"]');
    var allLinks = document.querySelectorAll('[role="tab"]');

    if (!allTabs) return;

    [].forEach.call(allTabs, function (tab) {
      tab.removeAttribute('hidden');
      tab.setAttribute('aria-hidden', false);
    });

    [].forEach.call(allLinks, function (link) {
      link.setAttribute('aria-selected', false);
    });

    loadAllVisibleIframes();
  };

  if (!tablist || !showAllBtn) return;

  [].forEach.call(tablist, function (link) {
    link.addEventListener('click', function (e) {
      if (areAllPatternsShowing()) return true;

      switchTabs(link);
    });
  });

  showAllBtn.addEventListener('click', function (e) {
    if (areAllPatternsShowing()) {
      this.setAttribute('aria-pressed', false);
      localStorage.setItem('show-all-patterns', false);
      switchToFirstTab();
    } else {
      this.setAttribute('aria-pressed', true);
      localStorage.setItem('show-all-patterns', true);
      showAllTabs();
    }
  });

  if (localStorage.getItem('show-all-patterns') == 'true') {
    showAllBtn.setAttribute('aria-pressed', true);
    showAllTabs();
  } else {
    if (window.location.hash) {
      possibleInitialTab = document.querySelector('[role="tab"][href="' + window.location.hash + '"]');

      if (possibleInitialTab) {
        switchTabs(possibleInitialTab);
      } else {
        switchToFirstTab();
      }
    } else {
      switchToFirstTab();
    }
  }
}());

/*
  ================================================
  CODE TOGGLE BUTTON
  ================================================
*/
(function () {
  'use strict';

  var codeBtns = document.querySelectorAll('.pattern-code-btn');

  var toggleCodeSample = function (e) {
    var theId, theCodeBlock;

    e.preventDefault();

    theId = this.getAttribute('aria-controls');
    theCodeBlock = document.getElementById(theId);

    if (this.getAttribute('aria-pressed') == 'true') {
      this.setAttribute('aria-pressed', false);
      theCodeBlock.setAttribute('hidden', true);
      theCodeBlock.setAttribute('aria-hidden', true);
    } else {
      this.setAttribute('aria-pressed', true);
      theCodeBlock.removeAttribute('hidden');
      theCodeBlock.setAttribute('aria-hidden', false);
      theCodeBlock.focus();
    }
  };

  if (!codeBtns) return;

  [].forEach.call(codeBtns, function (btn) {
    btn.addEventListener('click', toggleCodeSample);
  });
}());
