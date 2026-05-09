(function () {
  'use strict';

  var CONFIG = [
    { prefix: 'small',  media: '(max-width: 740px)' },
    { prefix: 'medium', media: '(min-width: 741px) and (max-width: 1080px)' },
    { prefix: 'large',  media: '(min-width: 1081px)' }
  ];

  function buildResolvers(config, onAnyChange) {
    var resolvers = new Map();
    var unsubscribers = [];

    config.forEach(function (entry) {
      if (entry.media) {
        var mq = window.matchMedia(entry.media);
        resolvers.set(entry.prefix, function () { return mq.matches; });
        var h = function () { onAnyChange(); };
        mq.addEventListener('change', h);
        unsubscribers.push(function () { mq.removeEventListener('change', h); });

      } else if (entry.attr) {
        var selector = entry.attr.selector;
        var attrName = entry.attr.name;
        var attrValue = entry.attr.value;
        var target = document.querySelector(selector) || document.documentElement;
        resolvers.set(entry.prefix, function () {
          return target.getAttribute(attrName) === attrValue;
        });
        var obs = new MutationObserver(function () { onAnyChange(); });
        obs.observe(target, { attributes: true, attributeFilter: [attrName] });
        unsubscribers.push(function () { obs.disconnect(); });

      } else if (entry.fn) {
        resolvers.set(entry.prefix, entry.fn);
      }
    });

    return { resolvers: resolvers, unsubscribers: unsubscribers };
  }

  function buildSelector(prefixes) {
    return prefixes.map(function (p) { return '[class*="' + p + ':"]'; }).join(',');
  }

  function applyToElement(el, resolvers) {
    if (!(el instanceof Element)) return;
    var classes = Array.prototype.slice.call(el.classList);
    classes.forEach(function (cls) {
      var i = cls.indexOf(':');
      if (i === -1) return;
      var prefix = cls.slice(0, i);
      var resolver = resolvers.get(prefix);
      if (!resolver) return;
      var name = cls.slice(i + 1);
      if (!name) return;
      el.classList.toggle(name, resolver());
    });
  }

  var state = null;

  function init() {
    var config = window.__classPrefixConfig || CONFIG;
    var prefixes = config.map(function (e) { return e.prefix; });
    var selector = buildSelector(prefixes);

    function applyToSubtree(root) {
      if (root instanceof Element) applyToElement(root, state.resolvers);
      if (root.querySelectorAll) {
        var els = root.querySelectorAll(selector);
        for (var i = 0; i < els.length; i++) applyToElement(els[i], state.resolvers);
      }
    }

    function applyAll() {
      if (document.body) applyToSubtree(document.body);
    }

    var built = buildResolvers(config, applyAll);

    var bodyObserver = new MutationObserver(function (mutations) {
      for (var mi = 0; mi < mutations.length; mi++) {
        var m = mutations[mi];
        if (m.type === 'childList') {
          for (var ni = 0; ni < m.addedNodes.length; ni++) {
            applyToSubtree(m.addedNodes[ni]);
          }
        } else if (m.type === 'attributes') {
          var el = m.target;
          var oldSet = new Set((m.oldValue || '').split(/\s+/).filter(Boolean));
          var hasNew = false;
          var classes = Array.prototype.slice.call(el.classList);
          for (var ci = 0; ci < classes.length; ci++) {
            var cls = classes[ci];
            var idx = cls.indexOf(':');
            if (idx !== -1 && state.resolvers.has(cls.slice(0, idx)) && !oldSet.has(cls)) {
              hasNew = true;
              break;
            }
          }
          if (hasNew) applyToElement(el, state.resolvers);
        }
      }
    });

    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true,
    });

    state = {
      resolvers: built.resolvers,
      unsubscribers: built.unsubscribers,
      bodyObserver: bodyObserver,
      applyAll: applyAll,
    };

    applyAll();
  }

  function cleanup() {
    if (!state) return;
    state.bodyObserver.disconnect();
    state.unsubscribers.forEach(function (unsub) { unsub(); });
    state = null;
  }

  init();

  window.__classPrefixApply   = function () { if (state) state.applyAll(); };
  window.__classPrefixCleanup = cleanup;
  window.__classPrefixReinit  = function () { cleanup(); init(); };
})();
