App.EditorView = App.View.extend({
	events: {
		
	}
	id: "editor",
	blankSlide: "<div class='slide'>"+
				"<h1>slide title</h1>"+
				"<p>slide content</p>"+
				"<i class='fa fa-times-circle delete-slide-icon'></i>"+
				"</div>",
	empty: "<h1>title</h1>"+
			"<p>some text</p>"+
			this.blankSlide+
			"<p>text</p>",
	afterCreate: function(){
		this.tinymceInit();
	},
	delegateEvents: function(){
		App.View.prototype.delegateEvents.call(this);
		this.$el.on("click", ".delete-slide-icon", function(){
			$(this).parent().remove();
		});
	},
	tinymceInit: function(){
		var self = this;
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
					self.$el.html(localStorage.getItem("content") || self.empty);
					impressplus.init();
				});
				ed.on('ExecCommand', function (e) {
					// ed.save();
					localStorage.setItem("content", self.$el.html());
				});
				ed.on('KeyUp', function (e) {
					// ed.save();
					localStorage.setItem("content", self.$el.html());
				});
			}
		});
	},
	present: function(){
		var present = window.open("presentation.html");
		present.onload = function(){
			var node = $('.wrapper').clone();
			node.children("#editor").addClass("initial");
			node.children("#editor")[0].setAttribute("contentEditable", false);
			(present.document.getElementsByTagName("body")[0]).innerHTML = node[0].innerHTML + 
			"<script type='text/javascript'>impressplus.init('present');</script>" + 
			"<script type='text/javascript'>impressplus.resetInPresent();</script>";
			present.impressplus.init("present");
			present.impressplus.resetInPresent();
		};
	},
	insertSlide: function(e){
		var sel = getSelection();
		if (sel.rangeCount==0) return;
		var range = sel.getRangeAt(sel.rangeCount-1);
		var node = range.endContainer.parentNode;
		if (node.tagName.toLowerCase()=="html") return;
		while ((node.tagName.toLowerCase()!="p" && !node.classList.contains("slide")) || node.parentElement.id!="editor")
			node = node.parentNode;
		while (node.nextSibling && node.nextSibling.classList && node.nextSibling.classList.contains("slide"))
			node = node.nextSibling;
		$(node).after(blankSlide);
		if ($("#editor *:last-child").prop("tagName").toLowerCase()=="p")
			$("#editor").append("<p>&nbsp;</p>");
		localStorage.setItem("content", document.getElementById("editor").innerHTML);
	},
	registerToolbar: function(){
		var self = this;
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
		$("#insert-image").click(function(){
			var insertImageModal = App.InsertImageView.getInstance();
			$('body').append(insertImageModal.$el);
			insertImageModal.$el.modal("show");
		});
		$("#clear").click(function(){
			localStorage.setItem("content", empty);
			self.$el.html(empty);
		});
		$("#insert-slide").click(self.insertSlide);
		$("#reset").click(function(){
			impressplus.reset();
		});
		$("#present").click(self.present);
	}
});