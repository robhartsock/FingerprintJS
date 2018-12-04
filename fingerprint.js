/**
 * FingerprintJS v 1.0.0
 * Anonymous Digital Fingerprint
 */
(function() {
  var FingerPrint = {};
  FingerPrint.DEBUG = false;

  // cache mainly for mobile safari, can be slow
  FingerPrint.cache = {};
  FingerPrint.clearCache = function() {
    this.cache = {};
  };

  // build unique id
  FingerPrint.id = function() {
    var data = this.data();
    return MD5(data.canvasFingerprint + ':' + MD5(data.fonts.join(':')) + ':' + JSON.stringify(data.screen) + ':' + JSON.stringify(data.browser) + ':' + JSON.stringify(data.localstorage) + ':' + JSON.stringify(data.seshstorage) + ':' + JSON.stringify(data.indexdb) + ':' + JSON.stringify(data.platform) + ':' + JSON.stringify(data.hardwareConcurrency) + ':' + JSON.stringify(data.webgl));
  };
  FingerPrint.match = function(id) {
    return FingerPrint.id() === id;
  };
  FingerPrint.data = function() {
    return {
      canvasFingerprint: FingerPrint.canvas(),
      fonts: FingerPrint.fonts(),
      browser: FingerPrint.browser(),
      localstorage: FingerPrint.localstorage(),
      seshstorage: FingerPrint.seshstorage(),
      indexdb: FingerPrint.indexdb(),
      platform: FingerPrint.platform(),
      hardwareconcur: FingerPrint.hardwareconcurrency(),
      screen: FingerPrint.screen(),
      webgl: FingerPrint.webgl()
    };
  };
  FingerPrint.screen = function() {
    return {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth
    };
  };
  FingerPrint.browser = function() {
    return {
      userAgent: navigator.userAgent,
      cookies: navigator.cookieEnabled,
      dnt: navigator.doNotTrack,
      lang: navigator.language
    };
  };
  FingerPrint.localstorage = function() {
    try {
      return !!window.localStorage;
    } catch(e) {
      return true;
    }
  };
  FingerPrint.seshstorage = function() {
    try {
      return !!window.sessionStorage;
    } catch(e) {
      return true;
    }
  };
  FingerPrint.indexdb = function() {
    try {
      return !!window.indexedDB;
    } catch(e) {
      return true;
    }
  };
  FingerPrint.platform = function() {
    if (navigator.platform) {
      return navigator.platform;
    } else {
      return 'unknown';
    }
  };
  FingerPrint.hardwareconcurrency = function() {
    if (navigator.hardwareConcurrency) {
      return navigator.hardwareConcurrency;
    }
    return 'unknown';
  };
  FingerPrint.canvas = function() {
    if (FingerPrint.cache.canvas !== undefined) {
      return FingerPrint.cache.canvas;
    }
    var canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 60;
    canvas.id = 'fingerprint-canvas';
    if (!this.DEBUG) canvas.style.display = 'none';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var txt = 'https://www.verve.com';
    ctx.textBaseline = 'top';
    ctx.font = '14px "Arial"';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125,1,62,20);
    ctx.fillStyle = '#069';
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText(txt, 4, 17);
    var imageData = ctx.getImageData(0, 0, 280, 60);
    if (!this.DEBUG) document.body.removeChild(canvas);
    return imageData;
  };
  FingerPrint.matchCanvas = function(string) {
    return string === FingerPrint.canvas();
  };

  // TODO: increase # of fonts
  FingerPrint.fonts = function(customFonts) {
    if (this.cache.fonts !== undefined) {
      return this.cache.fonts;
    }
    var fonts = ['Andale Mono', 'Arial', 'Arial Black', 'Arial Hebrew', 'Arial MT', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS', 'Bitstream Vera Sans Mono', 'Book Antiqua', 'Bookman Old Style', 'Calibri', 'Cambria', 'Cambria Math', 'Century', 'Century Gothic', 'Century Schoolbook', 'Comic Sans', 'Comic Sans MS', 'Consolas', 'Courier', 'Courier New', 'Garamond', 'Geneva', 'Georgia', 'Helvetica', 'Helvetica Neue', 'Impact', 'Lucida Bright', 'Lucida Calligraphy', 'Lucida Console', 'Lucida Fax', 'LUCIDA GRANDE', 'Lucida Handwriting', 'Lucida Sans', 'Lucida Sans Typewriter', 'Lucida Sans Unicode', 'Microsoft Sans Serif', 'Monaco', 'Monotype Corsiva', 'MS Gothic', 'MS Outlook', 'MS PGothic', 'MS Reference Sans Serif', 'MS Sans Serif', 'MS Serif', 'MYRIAD', 'MYRIAD PRO', 'Palatino', 'Palatino Linotype', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Light', 'Segoe UI Semibold', 'Segoe UI Symbol', 'Tahoma', 'Times', 'Times New Roman', 'Times New Roman PS', 'Trebuchet MS', 'Verdana', 'Wingdings', 'Wingdings 2', 'Wingdings 3'];
    if (typeof customFonts !== 'undefined') {
      fonts = customFonts;
    }
    var STRING = 'mwmwmwmwmwmwmwmwmwmwlli!~&*#@';
    var defaults = [{
      name: 'serif'
    }, {
      name: 'sans-serif'
    }, {
      name: 'monospace'
    }];
    var s = document.createElement('span');
    s.style.fontSize = '92px';
    s.style.position = 'absolute';
    s.style.left = '-9999px';
    s.style.lineHeight = 'normal';
    s.innerHTML = STRING;
    defaults.forEach(function(font) {
      s.style.fontFamily = font.name;
      document.body.appendChild(s);
      font.width = s.offsetWidth;
      font.height = s.offsetHeight;
      document.body.removeChild(s);
    });
    if (this.DEBUG) console.log(defaults);
    var foundFonts = [];
    fonts.forEach(function(font) {
      var found = false;
      defaults.forEach(function(defaultFont) {
        s.style.fontFamily = font + ',' + defaultFont.name;
        document.body.appendChild(s);
        if (s.offsetWidth !== defaultFont.width || s.offsetHeight !== defaultFont.height) {
          found = true;
        }
        document.body.removeChild(s);
      });
      if (found) {
        if (FingerPrint.DEBUG) console.log('found font:', font);
        foundFonts.push(font);
      }
    });
    if (FingerPrint.DEBUG) console.log('found', foundFonts.length, 'fonts');
    var output = foundFonts.sort();
    this.cache.fonts = output;
    return output;
  };
  FingerPrint.matchFonts = function(fonts) {
    var foundFonts = this.fonts();
    var doNotMatch = false;
    fonts.forEach(function(font) {
      if (foundFonts.indexOf(font) === -1) {
        doNotMatch = true;
      }
    });
    return !doNotMatch;
  };
  FingerPrint.WEBGL_PARAMETERS = ['VENDOR', 'RENDERER', 'MAX_COMBINED_TEXTURE_IMAGE_UNITS', 'MAX_CUBE_MAP_TEXTURE_SIZE', 'MAX_FRAGMENT_UNIFORM_VECTORS', 'MAX_RENDERBUFFER_SIZE', 'MAX_TEXTURE_IMAGE_UNITS', 'MAX_TEXTURE_SIZE', 'MAX_VARYING_VECTORS', 'MAX_VERTEX_ATTRIBS', 'MAX_VERTEX_TEXTURE_IMAGE_UNITS', 'MAX_VERTEX_UNIFORM_VECTORS', 'RED_BITS', 'GREEN_BITS', 'BLUE_BITS', 'ALPHA_BITS', 'DEPTH_BITS', 'STENCIL_BITS'];
  FingerPrint.webgl = function() {
    var output = {};
    var canvas = document.createElement('canvas');
    var gl = function getGlContext(canvas) {
      if (!window.WebGLRenderingContext) {
        return null;
      }
      var context = null;
      try {
        context = canvas.getContext('webgl') || canvas.getContext('moz-webgl') || canvas.getContext('experimental-webgl') || canvas.getContext('webkit-3d');
      } catch (err) {}
      return context;
    }(canvas);
    if (gl === null) {
      return null;
    }
    output.parameters = {};
    this.WEBGL_PARAMETERS.forEach(function(param) {
      if (gl[param.toUpperCase()] !== undefined) output.parameters[param.toLowerCase()] = gl.getParameter(gl[param.toUpperCase()]);
    });
    output.extensions = gl.getSupportedExtensions();
    return output;
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = FingerPrint;
  } else {
    window.FingerPrint = FingerPrint;
  }

  // TODO: run more tests on this for accuracy
  var MD5;
  (function() {
    var add32 = function(a, b) {
      return a + b & 4294967295;
    },
    cmn = function(q, a, b, x, s, t) {
      a = add32(add32(a, q), add32(x, t));
      return add32(a << s | a >>> 32 - s, b);
    },
    ff = function(a, b, c, d, x, s, t) {
      return cmn(b & c | ~b & d, a, b, x, s, t);
    },
    gg = function(a, b, c, d, x, s, t) {
      return cmn(b & d | c & ~d, a, b, x, s, t);
    },
    hh = function(a, b, c, d, x, s, t) {
      return cmn(b ^ c ^ d, a, b, x, s, t);
    },
    ii = function(a, b, c, d, x, s, t) {
      return cmn(c ^ (b | ~d), a, b, x, s, t);
    },
    md5cycle = function(x, k) {
      var a = x[0], b = x[1], c = x[2], d = x[3];
      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22, 1236535329);
      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);
      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);
      d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520);
      b = hh(b, c, d, a, k[2], 23, -995338651);
      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);
      x[0] = add32(a, x[0]);
      x[1] = add32(b, x[1]);
      x[2] = add32(c, x[2]);
      x[3] = add32(d, x[3]);
    },
    md5blk = function(s) {
      var md5blks = [],
        i;
      for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
      }
      return md5blks;
    },
    md5blk_array = function(a) {
      var md5blks = [],
        i;
      for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
      }
      return md5blks;
    },
    md51 = function(s) {
      var n = s.length,
        state = [1732584193, -271733879, -1732584194, 271733878],
        i, length, tail, tmp, lo, hi;
      for (i = 64; i <= n; i += 64) {
        md5cycle(state, md5blk(s.substring(i - 64, i)));
      }
      s = s.substring(i - 64);
      length = s.length;
      tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (i = 0; i < length; i += 1) {
        tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
      }
      tail[i >> 2] |= 128 << (i % 4 << 3);
      if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i += 1) {
          tail[i] = 0;
        }
      }
      tmp = n * 8;
      tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
      lo = parseInt(tmp[2], 16);
      hi = parseInt(tmp[1], 16) || 0;
      tail[14] = lo;
      tail[15] = hi;
      md5cycle(state, tail);
      return state;
    },
    md51_array = function(a) {
      var n = a.length,
        state = [1732584193, -271733879, -1732584194, 271733878],
        i, length, tail, tmp, lo, hi;
      for (i = 64; i <= n; i += 64) {
        md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
      }
      a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0);
      length = a.length;
      tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (i = 0; i < length; i += 1) {
        tail[i >> 2] |= a[i] << (i % 4 << 3);
      }
      tail[i >> 2] |= 128 << (i % 4 << 3);
      if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i += 1) {
          tail[i] = 0;
        }
      }
      tmp = n * 8;
      tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
      lo = parseInt(tmp[2], 16);
      hi = parseInt(tmp[1], 16) || 0;
      tail[14] = lo;
      tail[15] = hi;
      md5cycle(state, tail);
      return state;
    },
    hex_chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'],
    rhex = function(n) {
      var s = '',
        j;
      for (j = 0; j < 4; j += 1) {
        s += hex_chr[n >> j * 8 + 4 & 15] + hex_chr[n >> j * 8 & 15];
      }
      return s;
    },
    hex = function(x) {
      var i;
      for (i = 0; i < x.length; i += 1) {
        x[i] = rhex(x[i]);
      }
      return x.join('');
    },
    md5 = function(s) {
      return hex(md51(s));
    };
    add32 = function(x, y) {
      var lsw = (x & 65535) + (y & 65535),
        msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return msw << 16 | lsw & 65535;
    };
    MD5 = function(str, raw) {
      if (/[\u0080-\uFFFF]/.test(str)) {
        str = unescape(encodeURIComponent(str));
      }
      var hash = md51(str);
      return !!raw ? hash : hex(hash);
    };
  })();

  // log
  console.log('My Fingerprint is: ' + FingerPrint.id());
})();