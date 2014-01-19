window.impressplus = (function(document, window, undefined){
  var slides = [];
  var present;
  var slidesNum;
  var canvas;
  var body;
  var inZooming = false;
  var inSetting = false;
  var ptx = 0, pty = 0;
  var eps = 1e-2;
  function zoomToRec(x,y,w,h) {
    if (inZooming) {
      console.log("exit because other zooming is taking place.")
      return;
    }
    $(present).removeClass("initial");
    var wr = 0.85;
    var hr = 0.85;
    // w = w * canvas.scale;
    // h = h * canvas.scale;
    var r1 = canvas.width * wr / w;
    var r2 = canvas.height * hr / h;
    var r = Math.min(r1,r2);
    var canvasOffset = {
      left: present.getBoundingClientRect().left,
      top: present.getBoundingClientRect().top
    };
    x = (x - canvasOffset.left)/canvas.scale;
    y = (y - canvasOffset.top)/canvas.scale;
    canvas.scale *= r;
    if (canvas.scale!=1)
      body.addClass("zoomed");
    else
      body.removeClass("zoomed");
    var sx = (canvas.width-r*w)/2;
    var sy = (canvas.height-r*h)/2;
    var cx = sx-x*canvas.scale;
    var cy = sy-y*canvas.scale;
    var tx = cx - canvas.x;
    var ty = cy - canvas.y;
    tx = tx/canvas.scale;
    ty = ty/canvas.scale;
    if (Math.abs(tx-ptx)<eps && Math.abs(ty-pty)<eps && Math.abs(r-1)<eps) {
      console.log("exit because change is slight");
      return;
    }
    inZooming = true;
    var translate = "translate("+tx.toFixed(10)+"px,"+ty.toFixed(10)+"px)";
    var transform = "scale(" + canvas.scale + ") "+ translate;
    setTransform(transform);
    ptx = tx;
    pty = ty;
  }
  function moveto(i){
    if (i<0 || i>=slidesNum) return;
    console.log("in moveto "+i);
    var position = slides[i].offset();
    // zoomToRec(position.left, position.top, parseFloat(slides[i].css("width")), parseFloat(slides[i].css("height")));
    //TODO: use getBoundingClientRect instead.
  }
  function setTransform(transform){
    console.log("set transform", transform);
    present.style.webkitTransform = transform;
    present.style.MozTransform = transform;
    present.style.msTransform = transform;
    present.style.oTransform = transform;
    present.style.transform = transform;
  }
  function removeTransition(){
    $(present).addClass("no-transition")
  }
  function addTransition(){
    $(present).removeClass("no-transition")   
  }
  function reset() {
    console.log("start resetting");
    // addTransition();
    $(present).addClass("initial").removeClass("zoomed");
    canvas.scale = 140/800;
  }
  function resetInPresent() {
    $(present).removeClass("initial").width("auto");
    var wr = 0.85;
    var hr = 0.85;
    var w = present.getBoundingClientRect().width;
    var h = present.getBoundingClientRect().height;
    var r = canvas.width * wr / w;
    var cx = canvas.width * (1-wr) / 2;
    var cy;
    if (h<canvas.height*hr)
      cy = (canvas.height-h)/2;
    else
      cy = 0;
    var tx = cx - canvas.x;
    var ty = cy - canvas.y;
    canvas.scale *= r;
    tx /= canvas.scale;
    ty /= canvas.scale;
    var transform = "scale("+canvas.scale+") translate("+tx.toFixed(10)+"px,"+ty.toFixed(10)+"px)";
    setTransform(transform);
  }
  return {
    init: function(opt){
      present = document.getElementById('editor');
      present.spellcheck = false;
      body = $("body");
      // var editorOffset = $(present).offset();
      $(present).bind("transitionend", function(){
        console.log("transtion ends.");
        // removeTransition();
        inZooming = false;
      });
      canvas = {
        width: $(window).width(),
        height: $(window).height(),
        scale: 140/800,
        // x: editorOffset.left,
        // y: editorOffset.top
        x: present.getBoundingClientRect().left,
        y: present.getBoundingClientRect().top
      };
      console.log(canvas.width);
      console.log(canvas.height);
      $(".slide").each(function(item){
        slides.push(item);
      });
      slidesNum = slides.length;
      $("body").on("click", ".slide", function(){
        console.log("get clicked");
        // var position = $(this).offset();
        var left = this.getBoundingClientRect().left;
        var top  = this.getBoundingClientRect().top;
        var width = this.getBoundingClientRect().width;
        var height = this.getBoundingClientRect().height;
        zoomToRec(left, top, width, height);
      });
      $("body").mousewheel(function(event){
        $("#editor").removeClass("initial");
        var distance = event.deltaY * event.deltaFactor;
        console.log(distance);
        var translate = impressplus.getTranslate();
        console.log(translate);
        impressplus.setTranslate(translate.left, translate.top+distance);
      });
    },
    go: moveto,
    reset: reset,
    resetInPresent: resetInPresent,
    home: function(){
      setTransform("");
    },
    getTranslate: function(){
      return {
        left: ptx,
        top: pty
      };
    },
    setTranslate: function(tx, ty){
      if (inSetting) return;
      inSetting = true;
      // removeTransition();
      var transform = "scale("+canvas.scale+") translate("+tx.toFixed(10)+"px,"+ty.toFixed(10)+"px)";
      ptx = tx;
      pty = ty;
      setTransform(transform);
      // addTransition();
      inSetting = false;
    }
  };
})(document, window);