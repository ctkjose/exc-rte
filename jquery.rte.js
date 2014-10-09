/*
* jQuery ExC RTE plugin 0.0.1 - create a rich text form for Mozilla, Opera, Safari. (Internet Explorer not supported)
*
* Copyright (c) 2012 Jose Cuevas
* Based on original work of Batiste Bieler
* Distributed under the GPL Licenses.
* Distributed under the MIT License.
*/

//Define the plugin
(function($) {

    if(typeof $.fn.rte === "undefined") {
        var defaults = {
            use_toolbar : false,
            event_loaded: null,
            event_contextmenu: null,
            event_mouseup: null,
            event_mousedown: null,
            event_keyup: null,
            event_keydown: null,
        };
        
        $.fn.rte = function(options) {
            // build main options before element iteration
            var opts = $.extend(defaults, options);
            // iterate and construct the RTEs
            return this.each(
                function() {
                    var h = rte_create( $(this), opts);
                }
            );
        }
    }
})(jQuery);

function rte_create(obj, ops){
    var rte = new Object;
    rte.textarea = obj;
    rte.opt = ops;
    rte.saved_selection = null;
    rte.textbox = null;
    rte.element_id = obj.attr("id");
    rte.toolbar = null;
    rte.flg_ctrl_key = false;
    rte.addToolbarItem = function(item_def){
        if(!this.toolbar) return;
        var self = this;
        var item = null;
        var s = '';
        
        var css = item_def.tag;
        if(item_def.class) css = item_def.class;
        
        var css_popup = '';
        if(item_def.class_popup) css_popup = ' ' + item_def.class_popup;
        
        if(item_def.html){
            item = $(item_def.html);
        }else if(item_def.init){
            item = $(item_def.init(this));
        }else{
            s = "<a href='#' class='rte_bttn " + css + "' tag='" + item_def.tag + "'></a>";
            item = $(s);
            s = '';
        }
        
        var event_handler = null;
        var nevent = 'click';
        
		
		if (item_def.text) {
			item.attr('title', item_def.text);
		}
        if(item.prop("nodeName") == 'SELECT'){
            nevent = 'change';
        }
        
        if(item_def.callback){
            var exec = item_def.callback;
            event_handler = function(e, values){
				e.stopPropagation();
				e.preventDefault();
				self.saveSelection();
                //console.log("@handler " + item_def.tag + "exec:" + exec);
                exec.apply(self, [$(e.target), item_def.tag, values]);
                return false;
            };
        }else if(item_def.execCommand){
            var exec = item_def.execCommand;
            var options = item_def.execOptions;
            event_handler = function(){
                self.execCommand(exec, options);
                return false;
            };
        }else{
			if(!item_def.html && !item_def.init) item.addClass('rte_bttn_noaction');
		}
        
        if(item_def.options){
            //console.log("here with options");
            var options = item_def.options;
             item.on('click',
                function(e){
                    e.preventDefault();
                    var o = $(e.target);
                    var tag = o.attr('tag');
                    var s = "<div class='rte_popupmnu'>";
                    for (var key in options){
                        s+= "<a class='cmd_" + tag + "_item" + css_popup + "' href='#' tag='" + tag + "' value='" + options[key][0] + "'>" + options[key][1] + "</a>";
                    }
                    s+= "</div>";
                    //console.log(s);
                    var popup = $(s);
                    
                    o.after(popup);
                    var p = o.position();
                    popup.css({'left': (p.left + 10) + 'px', 'top': (p.top + 16) + 'px' } )
                    popup.show();
                    popup.focus();
                    
                    $(document).on('keyup.' + tag, function(e){
                        if(e.which == 27){
                           popup.remove();
                           $(document).unbind('keyup.' + tag);
                        }
                         
                    });
                    popup.children('a').click(
                        function(e){
                            
                            e.preventDefault();
                            var o = $(e.target);
                            if(o.prop('nodeName') != 'A'){
                                o = o.parent('a');
                            }
                            
                            var v = o.attr('value');
                            //console.log("at mnu click=" + v);
                            event_handler(e, v);
                            
                            o.parent('.rte_popupmnu').remove();
                        }
                    );
                    return false;
                }
            );
            
        }else{
            //console.log("here without options=" + nevent );
            item.on(nevent, event_handler);    
        }
        
        this.toolbar.append(item);
       
    
    }
    rte.toolbar_initialize = function(){
        var stb = "<div class='rte_toolbar' id='"+ this.element_id +"_toolbar'>";
        stb+= "</div>";
            
        this.toolbar = $(stb);
            
            
    }
    rte.execCommand = function(command, option){
        this.focus();
        try{
            document.execCommand(command, false, option);
        }catch(e){
            //console.log(e)
        }
        this.focus();
    }
    rte.focus = function(){
        if(!this.textbox) return;
        this.textbox.focus();
		this.restoreSelection();
    }
	rte.saveSelection = function() {
		
        var sel = window.getSelection(), ranges = [];
        if (sel.rangeCount) {
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                ranges.push(sel.getRangeAt(i));
            }
        }
		this.saved_selection = ranges;
        //return ranges;
    };

    rte.restoreSelection = function() {
		if(this.saved_selection == null) return;
        var sel = window.getSelection();
        sel.removeAllRanges();
        for (var i = 0, len = this.saved_selection.length; i < len; ++i) {
            sel.addRange(this.saved_selection[i]);
        }
		this.saved_selection = null;
    };
    rte.setSelectionHTML = function(html){
        this.focus();
        this.execCommand('insertHTML', html);
    }
    rte.getSource = function(){
        if(!this.textbox) return '';
        return this.textbox.html();
    }
    rte.getSelectionNode = function() {
        var selection = window.getSelection();
        var node = selection.anchorNode;
		if (node) {
			return (node.nodeName == "#text" ? node.parentNode : node);
		}
		
		return null;
    }
	rte.getSelectionNodeAny = function() {
        var selection = window.getSelection();
        var node = selection.anchorNode;
		if(node && (node.nodeName == "#text")){
			if($(node.parentNode).hasClass('rte_textbody') ) return node;
			return node.parentNode;
		}
		return node;
    }
    rte.getSelectionText = function(){
        var selection = window.getSelection();
        if (selection.rangeCount > 0){
            return selection.toString();
        }
        return '';
    }
    rte.getSelectionHTML = function(){
        var html = null;
        var rng	= this.getSelectionRange();

        if(rng) {
            var e = document.createElement('div');
			e.appendChild(rng.cloneContents());
			html = e.innerHTML;
        }
    
        return html;
    }
    rte.getSelectionRange = function() {
        var rng	= null;
        
        this.focus();
        
        var selection = window.getSelection();
        if (selection.rangeCount > 0){
            rng = selection.getRangeAt(0);
        }
        
        return rng;
    }
	rte.handleKeyShortcuts = function(event){
		//console.log(event.which);
		if(!this.flg_ctrl_key) return;
		
		if((event.which == 66)) {
			event.preventDefault();
			this.execCommand('bold', null);		
		}
		if((event.which == 73)) {
			event.preventDefault();
			this.execCommand('italic', null);		
		}
		if((event.which == 85)) {
			event.preventDefault();
			this.execCommand('underline', null);		
		}
	}
    rte.enableDesignMode = function(){
		console.log('@enableDesignMode');
        var content = this.textarea.val();

        // Mozilla needs this to display caret
        if($.trim(content)=='') {
            content = '<br />';
        }

        // already created? show/hide
        if(this.textbox) return;

        // for compatibility reasons, need to be created this way
        this.textbox = $("<div class='rte_textbody' contenteditable='true'>" + content + "</div>");
        if(!this.textbox) return;
        
        var w = 300;
        var h = 200;
        if(this.textarea.attr('width')){
            w = eval(this.textarea.attr('width'));
        }else if(this.textarea.attr('cols')){
            w = 10 * eval(this.textarea.attr('cols'));
        }
        
        if(this.textarea.attr('height')){
            h = eval(this.textarea.attr('height'));
        }else if(this.textarea.attr('rows')){
            h = 16 * eval(this.textarea.attr('rows'));
        }
        
        this.textbox.css({'width' : w + 'px', 'height': h + 'px'});
        
        if(this.textarea.attr('class')){
            this.textbox.addClass( this.textarea.attr('class') );
        }
        
        if(this.textarea.attr('id')){
            this.textbox.attr('id', this.element_id + '_frame' );
        }
        
        var sframe = "<div class='rte_widget' id='"+ this.element_id +"_widget'></div>";
        this.widget = $(sframe);
        this.widget.css({'width': (w + 4) + 'px'});
        
        this.textarea.after(this.widget);
        
        if(this.toolbar) this.widget.append(this.toolbar);
        this.widget.append(this.textbox);
            
        var css = "";
        if(this.opt.content_css_url) {
            css = "<link type='text/css' rel='stylesheet' href='" + this.opt.content_css_url + "' />";
        }

        var designModeOk = true;
        
        if(!designModeOk) return;
        //console.log("created");
        //add toolbar
        
        var self = this;
		$(document).keydown(
			function(e){
				self.flg_ctrl_key = (e.metaKey || e.ctrlKey) ? true : false;;
			}
		)
		$(document).keyup(
			function(e){
				self.flg_ctrl_key = false;
			}
		)
        this.textbox.keydown(
			function(e){
				self.handleKeyShortcuts(e);
				return true;
			}
		);
        this.widget.mouseleave(
            function(e){
                //self.toolbar.slideUp();
				self.textarea.val(self.textbox.html());
            }
        );
        this.widget.mouseenter(
            function(e){
                //self.toolbar.slideDown();
            }
        );
        
        if(this.opt.event_mouseup != null) {
            this.textbox.mouseup(
                function(event){
                    self.opt.event_mouseup.apply(self, [event]);
                    return true;
                }
            );
        }
        
        if(this.opt.event_mousedown != null) {
            this.textbox.mousedown(
                function(event){
                    self.opt.event_mousedown.apply(self, [event]);
                    return true;
                }
            );
        }
        if(this.opt.event_mousedown != null) {
            this.textbox.mousedown(
                function(event){
                    self.opt.event_mousedown.apply(self, [event]);
                    return true;
                }
            );
        }
        if(this.opt.event_keyup != null) {
            this.textbox.keyup(
                function(e){
                    self.opt.event_keyup.apply(self, [e]);
                    return true;
                }
            );
        }
		
        if(this.opt.event_keydown != null) {
            this.textbox.keydown(
                function(){
                    self.opt.event_keydown.apply(self, [e]);
                    return true;
                }
            );
        }
        if(this.opt.event_contextmenu != null) {
            this.textbox.on('contextmenu',
                function(){
                    self.opt.event_contextmenu.apply(self, [event]);
                    return true;
                }
            );
        }
        
        this.textarea.parents('form').submit( 
            function() { self.destory_widget(true); }
        );
        rte.textarea.hide();
    }
    rte.destory_widget = function(){
        var content = this.textbox.html();
		this.textarea.val(content);
    }
    rte.initialize = function(){
        if(this.opt.use_toolbar){
            this.toolbar_initialize();
        }
        
        this.enableDesignMode();
        
        if(this.opt.event_loaded != null) this.opt.event_loaded.apply(this);
    }
    
    rte.initialize();
    return rte;
}