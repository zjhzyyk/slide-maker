App.InsertImageView = App.View.extend({
	template: "modal",
	title: "Insert image",
	render: function(){
		App.View.prototype.render.call(this);
		this.$(".modal-body").html('<input type="text" placeholder="input url...">'+
        	'<img id="img-preview" class="imgPreview">');
		this.$(".cancel").click(this.cancel);
		this.$(".submit").click(this.submit);
	},
	cancel: function(){

	},
	submit: function(){
		
	}
});