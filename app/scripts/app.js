$(function(){
	var blankSlide = "<div class='slide'>"+
		"<h1>slide title</h1>"+
		"<p>slide content</p>"+
		"<i class='fa fa-times-circle delete-slide-icon'></i>"+
		"</div>";
	var empty = "<h1>title</h1>"+
		"<p>some text</p>"+
		blankSlide+
		"<p>text</p>";
	tinymce.init({
		selector: "#editor",
		inline: true,
		plugins: [
			"advlist autolink lists link image charmap print preview anchor",
			"searchreplace visualblocks code fullscreen",
			"insertdatetime media table contextmenu paste"
		],
		toolbar: false,
		menubar:false, 
		statusbar: false,
		setup: function (ed) {
			ed.on('init', function(args) {
				document.getElementById("editor").innerHTML = (localStorage.getItem("content") || empty);
				impressplus.init();
			});
			ed.on('ExecCommand', function (e) {
				// ed.save();
				localStorage.setItem("content", document.getElementById("editor").innerHTML);
			});
			ed.on('KeyUp', function (e) {
				// ed.save();
				localStorage.setItem("content", document.getElementById("editor").innerHTML);
			});
		}
	});
	$("#bold").click(function(){
		tinymce.activeEditor.execCommand('bold');
	});
	$("#italic").click(function(){
		tinymce.activeEditor.execCommand('italic');
	});
	$("#underline").click(function(){
		tinymce.activeEditor.execCommand('underline');
	});
	$("#h1").click(function(){
		tinymce.activeEditor.execCommand("formatBlock", false, "h1");
	});
	$("#p").click(function(){
		tinymce.activeEditor.execCommand("formatBlock", false, "p");
	});
	$("#clear").click(function(){
		localStorage.setItem("content", empty);
		document.getElementById("editor").innerHTML = empty;
	});
	$("#insert-slide").click(function(e){
		var sel = getSelection();
		if (sel.rangeCount==0) return;
		var range = sel.getRangeAt(sel.rangeCount-1);
		var node = range.endContainer.parentNode;
		if (node.tagName.toLowerCase()=="html") return;
		while ((node.tagName.toLowerCase()!="p" && !node.classList.contains("slide")) || node.parentElement.id!="editor")
			node = node.parentNode;
		while (node.nextSibling && node.nextSibling.classList.contains("slide"))
			node = node.nextSibling;
		$(node).after(blankSlide);
		localStorage.setItem("content", document.getElementById("editor").innerHTML);
	});
	$("#reset").click(function(){
		impressplus.reset();
	});
	$("#editor").on("click", ".delete-slide-icon", function(){
		$(this).parent().remove();
	});
	$("#present").click(function(){
		var present = window.open("presentation.html");
		present.onload = function(){
			(present.document.getElementsByTagName("body")[0]).innerHTML = $('.wrapper')[0].innerHTML + 
			"<script type='text/javascript'>impressplus.init();</script>" + 
			"<script type='text/javascript'>impressplus.resetInPresent();</script>";
			present.impressplus.init();
			present.impressplus.resetInPresent();
		};
	});
});