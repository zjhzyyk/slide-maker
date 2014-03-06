App.InsertImageView = App.View.extend({
	events: {
		'click .submit': 'submit',
		'change .address': 'change',
		'error .img-preview': 'imgError',
		'load .img-preview': 'imgLoad'
	},
	template: "modal",
	title: "Insert image",
	singleton: true,
	render: function(){
		this.$(".modal-body")
			.html('<input type="button" class="browse btn btn-primary pull-right" value="browse">'+
				'<div style="overflow:hidden; padding: 0 10px 0 0;">'+
				'<input type="text" class="address form-control" placeholder="input url or select an image"></div>'+
        		'<img class="img-preview">');
		this.imgPreview = this.$(".img-preview");
		this.submitBtn = this.$(".submit");
		this.address = this.$(".address");
		this.imgPreview.hide();
		this.submitBtn.addClass("disabled").html("Please provide an image");
	},
	submit: function(){
		tinyMCE.execCommand('mceInsertContent',false,'<img src="'+this.imgPreview.attr("src")+'"/>');
	},
	change: function(){
		var url = this.address.val();
		if (App.validator.isURL(url)) {
			this.imgPreview.attr("src", url);
			this.submitBtn.html("Loading image...");
		} else if (!this.isLocal) {
			this.submitBtn.html("Incorrect URL");
		}
	},
	imgError: function(){
		this.imgPreview.hide();
		this.submitBtn.addClass("disabled");
		if (this.address.val()) this.submitBtn.html("Incorrect URL");
		else this.submitBtn.html("Please provide an image");
	},
	imgLoad: function(){
		this.imgPreview.show();
		this.submitBtn.removeClass("disabled").html("Submit");
	}
}, App.Singleton);