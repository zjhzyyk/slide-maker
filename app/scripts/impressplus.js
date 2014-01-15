window.impressplus = (function(document, window, undefined){
  var slides = [];
  var present;
  var slidesNum;
  var canvas;
  var body;
  var inZooming = false;
  var ptx, pty;
  var eps = 1e-5;
  function zoomToRec(x,y,w,h) {
    if (inZooming) {
      console.log("exit because other zooming takes place")
      return;
    }
    var wr = 0.85;
    var hr = 0.85;
    w = w * canvas.scale;
    h = h * canvas.scale;
    var r1 = canvas.width * wr / w;
    var r2 = canvas.height * hr / h;
    console.log("r1")
    var r = Math.min(r1,r2);
    var canvasOffset = $(present).offset();
    x = (x - canvasOffset.left)/canvas.scale;
    y = (y - canvasOffset.top)/canvas.scale;
    canvas.scale *= r;
    if (canvas.scale!=1)
      body.addClass("zoomed");
    else
      body.removeClass("zoomed");
    console.log("x", x, "y", y, "w", w, "h", h);
    console.log("canvas.x", canvas.x, "canvas.y", canvas.y);
    console.log("scale",canvas.scale);
    var sx = (canvas.width-r*w)/2;
    var sy = (canvas.height-r*h)/2;
    console.log("sx",sx,"sy", sy);
    var cx = sx-x*canvas.scale;
    var cy = sy-y*canvas.scale;
    console.log("cx",cx,"cy", cy);
    var tx = cx - canvas.x;
    var ty = cy - canvas.y;
    console.log("tx",tx,"ty", ty);
    tx = tx/canvas.scale;
    ty = ty/canvas.scale;
    console.log("tx",tx,"ty", ty);
    if (Math.abs(tx-ptx)<eps && Math.abs(ty-pty)<eps && Math.abs(r-1)<eps) {
      console.log("exit because change is slight");
      return;
    }
    inZooming = true;
    var translate = "translate("+tx.toFixed(10)+"px,"+ty.toFixed(10)+"px)";
    var transform = "scale(" + canvas.scale + ") "+ translate;
    console.log(transform);
    setTransform(transform);
    ptx = tx;
    pty = ty;
  }
  function moveto(i){
    if (i<0 || i>=slidesNum) return;
    console.log("in moveto "+i);
    var position = slides[i].offset();
    zoomToRec(position.left, position.top, parseFloat(slides[i].css("width")), parseFloat(slides[i].css("height")));
  }
  function setTransform(transform){
    present.style.webkitTransform = transform;
    present.style.MozTransform = transform;
    present.style.msTransform = transform;
    present.style.oTransform = transform;
    present.style.transform = transform;
  }
  return {
    init: function(opt){
      present = document.getElementById('editor');
      present.spellcheck = false;
      body = $("body");
      var editorOffset = $(present).offset();
      $(present).bind("transitionend", function(){
        console.log("transtion ends.");
        inZooming = false;
      });
      canvas = {
        width: $(window).width(),
        height: $(window).height(),
        scale: 1.0,
        x: editorOffset.left,
        y: editorOffset.top
      };
      console.log(canvas.width);
      console.log(canvas.height);
      $(".slide").each(function(item){
        slides.push(item);
      });
      slidesNum = slides.length;
      $("body").on("click", ".slide", function(){
        console.log("get clicked");
        var position = $(this).offset();
        zoomToRec(position.left, position.top, parseFloat($(this).css("width")), parseFloat($(this).css("height")));
      });
    },
    go: moveto,
    home: function(){
      setTransform("");
    }
  };
})(document, window);