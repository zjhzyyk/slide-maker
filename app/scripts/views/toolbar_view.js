App.ToolbarView = App.View.extend({
	template: "toolbar",
	render: function(){
		App.View.prototype.render.call(this);
		this.$("#bold").click(function(){
			tinymce.activeEditor.execCommand('bold');
		});
		this.$("#italic").click(function(){
			tinymce.activeEditor.execCommand('italic');
		});
		this.$("#underline").click(function(){
			tinymce.activeEditor.execCommand('underline');
		});
		this.$("#h1").click(function(){
			tinymce.activeEditor.execCommand("formatBlock", false, "h1");
		});
		this.$("#p").click(function(){
			tinymce.activeEditor.execCommand("formatBlock", false, "p");
		});
		this.$("#insert-image").click(function(){
			var insertImageModal = new App.InsertImageModal();
			$('body').append(insertImageModal.el);
			insertImageModal.el.modal("show");
		});
		this.$("#clear").click(function(){
			localStorage.setItem("content", empty);
			document.getElementById("editor").innerHTML = empty;
		});
		this.$("#insert-slide").click(App.editorView.insertSlide);
		this.$("#reset").click(function(){
			impressplus.reset();
		});
		this.$("#present").click(App.editorView.present);
	}
});