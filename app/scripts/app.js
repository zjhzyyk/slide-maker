var App = window.App = {};

require("app/scripts/impressplus");
require("app/scripts/validator");
require("app/scripts/framework");
require("app/scripts/templates");
require("app/scripts/views/*");

App.editorView = new App.EditorView();