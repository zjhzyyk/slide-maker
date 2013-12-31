window.prezi = (function(document, window, undefined){
  var slides = [];
  var present;
  var translate="";
  var slidesNum;
  var canvas;
  var cur;
  var ratio=1.2;
  var option = {
    sidebar: true,
    mousewheel: true,
    slideClick: true
  };
  function next(){
    if (cur+1<slidesNum) {
      moveto(cur+1);
      cur++;
    }
  }
  function prev(){
    if(cur-1>=0) {
      moveto(cur-1);
      cur--;
    }
  }
  function moveto(i){
    if (i<0 || i>=slidesNum) return;
    // console.log("in moveto "+i);
    zoomToRec(slides[i].x, slides[i].y, slides[i].width, slides[i].height);
  }
  function zoomin(event, change) {
    //first unbind all zoom events
    if (change===undefined || change===true || change===null) canvas.scale *= ratio;
    var transform = "scale(" + canvas.scale + ") "+ translate;
    present.style.webkitTransform = transform;
    present.style.MozTransform = transform;
    present.style.msTransform = transform;
    present.style.oTransform = transform;
    present.style.transform = transform;
    //after zooming finishes, bind back all zoom events
  }
  function zoomToRec(x,y,w,h) {
    var wr = 0.85;
    var hr = 0.85;
    var r1 = canvas.width * wr / w / canvas.scale;
    var r2 = canvas.height * hr / h / canvas.scale;
    var r = Math.min(r1,r2);
    canvas.scale *= r;
    var ffx = canvas.ox+(canvas.width-canvas.scale*w)/2;
    var ffy = canvas.oy+(canvas.height-canvas.scale*h)/2;
    ffx -= x * canvas.scale;
    ffy -= y * canvas.scale;
    var tx = (ffx-canvas.ox)/canvas.scale;
    var ty = (ffy-canvas.oy)/canvas.scale;
    translate = "translate("+tx.toFixed(10)+"px,"+ty.toFixed(10)+"px)";
    zoomin(null, false);
  }
  function zoomToPoint(d,cx,cy) {
    var cfx = present.getBoundingClientRect().left;
    var cfy = present.getBoundingClientRect().top;
    var ffx, ffy;
    if (d>0) {
      canvas.scale *= ratio;
      ffx = ratio*(cfx-cx)+cx;
      ffy = ratio*(cfy-cy)+cy;
    }
    else {
      canvas.scale /= ratio;
      ffx = (cfx-cx)/ratio+cx;
      ffy = (cfy-cy)/ratio+cy;
    }
    var tx = (ffx-canvas.ox)/canvas.scale;
    var ty = (ffy-canvas.oy)/canvas.scale;
    translate = "translate("+tx.toFixed(10)+"px,"+ty.toFixed(10)+"px)";
    zoomin(null, false);
  }
  return {
    init: function(opt){
      present = document.getElementById("presentation");
      var slidesElements = document.getElementsByClassName("pslide");
      slidesNum = slidesElements.length;
      var i = 0;
      var Slide = function(x,y,w,h){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
      };
      cur = 0;
      canvas = {
        width: window.innerWidth,
        height: window.innerHeight,
        scale: 1,
        ox: present.getBoundingClientRect().left,
        oy: present.getBoundingClientRect().top
      };
      for (var prop in opt) {
        if (opt.hasOwnProperty(prop)) {
          option[prop] = opt[prop];
        }
      }
      for (;i<slidesNum; i++) {
        slides.push(new Slide(
          parseFloat(slidesElements[i].style.left),
          parseFloat(slidesElements[i].style.top),
          parseFloat(slidesElements[i].style.width),
          parseFloat(slidesElements[i].style.height)
          )
        );
        if (option.slideClick===true) {
          (function(){
            var si = i;
            slidesElements[si].onclick = function(e) {
              e.stopPropagation();
              moveto(si);
            };  
          })();
        }
      }
      document.onkeydown = function(e) {
        if (e.keyCode == 39 ||
            e.keyCode == 13) {
          next();
        } else if (e.keyCode == 37) {
          prev();
        }
      };
      document.onclick = function(e) {
        next();
      }
      if (option.mousewheel===true) {
        document.onmousewheel = function(e){
          zoomToPoint(event.wheelDelta, event.clientX, event.clientY);
        };
      }
      if (option.sidebar===true) {
        document.getElementById("zoomin").onclick = function(e) {
          e.stopPropagation();
          zoomToPoint(1, canvas.ox+canvas.width/2, canvas.oy+canvas.height/2);
        };
        document.getElementById("zoomout").onclick = function(e) {
          e.stopPropagation();
          zoomToPoint(-1, canvas.ox+canvas.width/2, canvas.oy+canvas.height/2);
        };
        document.getElementById("gohome").onclick = function(e) {
          e.stopPropagation();
          if (slidesNum<1) return;
          var minx = slides[0].x, 
              miny = slides[0].y, 
              maxx = minx + slides[0].width, 
              maxy = miny + slides[0].height, 
              width, height;
          for (var it = 1; it<slidesNum; it++) {
            if (minx > slides[it].x)
              minx = slides[it].x;
            if (miny > slides[it].y)
              miny = slides[it].y;
            if (maxx < slides[it].x+slides[it].width)
              maxx = slides[it].x+slides[it].width;
            if (maxy < slides[it].y+slides[it].height)
              maxy = slides[it].y+slides[it].height;
          }
          width = maxx - minx;
          height = maxy - miny;
          zoomToRec(minx, miny, width, height);
        }
      }
      moveto(0);
    }
  };
})(document, window);