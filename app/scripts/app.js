$(function(){
	var blankSlide = "<div class='slide'>"+
		"<h1>slide title</h1>"+
		"<p>slide content</p>"+
		"<i class='fa fa-times-circle delete-slide-icon'></i>"+
		"</div>";
	YUI().use('editor-inline', function(Y){
		var editor = new Y.InlineEditor({
			content: "<h1>title</h1>"+
			"<p>some text</p>"+
			blankSlide+
			"<p>text</p>"
		});
		editor.render('#editor');
		$("#bold").click(function(){
			editor.execCommand('bold');
		});
		impressplus.init();
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