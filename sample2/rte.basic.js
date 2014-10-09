(function($) {

    if(typeof $.fn.basic_rte === "undefined") {
        var defaults = {
			use_toolbar: true,
			event_loaded: rte_basic_callback_loaded,
			event_contextmenu: null,
			event_mouseup: rte_basic_callback_mouseup,
			event_mousedown: null,
			event_keyup: null,
			event_keydown: null,
        };
        
        $.fn.basic_rte = function(options) {
            // build main options before element iteration
            var opts = $.extend(defaults, options);
            // iterate and construct the RTEs
            return this.each(
                function() {
					$(this).rte(opts);
                }
            );
        }
    }
})(jQuery);

function toolbar_button_style(obj, tag, value){
    //this.execCommand('fontsize', value);
	var style_options = {
		'rte_s_h2': {'tag':'h2'},
		'rte_s_h3': {'tag':'h3'},
		'rte_s_pre': {'tag':'pre', 'attr': []},
		'rte_s_pre_code': {'tag':'pre', 'class': ['code']},
		'rte_s_ph' : {'tag':'div', 'class': ['page_header']},
	};
	var s = "";
	var op =style_options[value];
	var flg_replace = false;
	var node = this.getSelectionNodeAny();
	if (!node) return;
	
	var n = null;
	console.log('nodename=' + node.nodeName);
	console.log(node);
	
	var p = ' ';
	if (op.attr) {
		for (i = op.attr.length-1; i >= 0 ; i--) {
			p = p + op.attr[i].name + "='" + op.attr[i].value + "' ";
		}
	}
	if (op.class) {
		p = p + "class='"
		for (i = op.class.length-1; i >= 0 ; i--) {
			p = p + op.class[i] + " ";
		}
		p = p + "' ";
	}
	if (op.css) {
		p = p + "style='"
		for (i = op.css.length-1; i >= 0 ; i--) {
			p = p + op.css[i].name + ": " + op.css[i].value + "; ";
		}
		p = p + "' ";
	}
	
	flg_replace = true;				

	if(node.nodeName == "#text"){
		s = this.getSelectionHTML();
	}else{
		n = $(node);
		if (n.hasClass('rte_textbody')) {
			s = this.getSelectionHTML();
			flg_replace = true;
		
		}else{
			
			var r = ['pre', 'h2', 'h3', 'h4', 'h1', 'p', 'div'];
			if (n.is('font')) {
				if(n.attr('size') == "2") {
						
				}
			
			}
			for (i = 0; i< r.length; i++) {
				if (n.is(r[i])) {
					n.remove();
					break;
				}
			}
			
			s = n.html();
			
		}
	}
	
	s = "<" + op.tag + p + ">" + s + "</" + op.tag + ">";	
	//n = $(s);
	
	
	if(flg_replace){
		this.setSelectionHTML(s);
	}
}

function toolbar_button_size(obj, tag, value){
    this.execCommand('fontsize', value);
}
function toolbar_button_color(obj, tag, value){
    this.execCommand('forecolor', value);
}
function toolbar_button_link(obj, tag, value){
	var s = '';
    var a = {'text':'New Link', 'href':'#'};
	var n = this.current_node;
	
	var ops = {'title' : 'Link', 'show': true};
	ops.buttons = [
		{'text': 'Ok', 'click':rte_basic_callback_link_edit},
		{'text': 'Remove', 'click':rte_basic_callback_link_remove}
		
	];
	
	if (n && n.is('a')) {
		a.text = n.text();
		a.href = n.attr('href');
		
		console.log('added remove');
	}else{
		a.text = this.getSelectionText();
	}
	
	//console.log(a);
	
	
	if(!$('#rte_link_editor').length) {
		s = "<div id='rte_link_editor'>";
		s = s + "<label>Caption:</label> <input type='text' id='rte_link_editor_caption' value='" + a.text + "' size='60'><br>";
		s = s + "<label>HREF:</label> <input type='text' id='rte_link_editor_href' value='" + a.href + "' size='60'><br>";
		s = s + "</div>";
	
		$(s).appendTo(document.body);
	}else{
		$('#rte_link_editor_href').val(a.href);
		$('#rte_link_editor_caption').val(a.text);
	}
	$('#rte_link_editor').data('rte_editor', this);
	
	$('#rte_link_editor').bs_modal(ops);
}
function rte_basic_callback_link_edit(e){
	$(this).data('modal').hide();
	
	var editor = $('#rte_link_editor').data('rte_editor');
	var href = $('#rte_link_editor_href').val();
	var caption = $('#rte_link_editor_caption').val();
	
	var a = '';
	if (!editor) return;
	if (!editor.current_node) return;
	var n = editor.current_node;
	if (n && n.is('a')) {
		//n.text();
		n.attr('href', href);
		n.attr('title', caption);
		
		//self.opt.event_onlink.apply(self, [event, a]);
	}else{
		a = "<a href='" + href + "' title='" + caption + "'>" + editor.getSelectionHTML() + "</a>";
		editor.setSelectionHTML(a);
	}
	
}
function rte_basic_callback_link_remove(e){
	$(this).data('modal').hide();
	
	var editor = $('#rte_link_editor').data('rte_editor');
	var href = $('#rte_link_editor_href').val();
	var caption = $('#rte_link_editor_caption').val();

	if (!editor) return;
	if (!editor.current_node) return;
	var n = editor.current_node;
	if (n && n.is('a')) {
		console.log(n);
		var s = n.text();
		n.remove();
		editor.setSelectionHTML(s);
	}
	
}

function rte_basic_callback_mouseup(event){
    this.current_node = $(this.getSelectionNode());
}


function rte_basic_callback_loaded(){
    
	this.current_node = false;
	
    var item = { tag: 'rte_bttn_bold', execCommand: 'bold', execOptions: null, 'text': 'Bold'};
    this.addToolbarItem(item);
    
    item = { tag: 'rte_bttn_italic', execCommand: 'italic', execOptions: null, 'text': 'Italic'};
    this.addToolbarItem(item);
    
    item = { tag: 'rte_bttn_underline', execCommand: 'underline', execOptions: null, 'text': 'Underline'};
    this.addToolbarItem(item);
    

    var size_options = [
      [4, 'Big'],
      [3, 'Large'],
      [2, 'Regular'],
	  [1, 'Small'],
    ];
    
    item = { tag: 'dosomething', callback: toolbar_button_size, 'class': 'rte_bttn_size', 'options': size_options, 'text': 'Text size...' };
    this.addToolbarItem(item);
    
	var style_options = [
		['rte_s_h2', 'Header'],
		['rte_s_h3', 'Sub Header'],
		['rte_s_pre', 'Preformatted Text'],
		['rte_s_pre_code', 'Preformatted Code'],
		['rte_s_ph', 'Page Header'],
		
    ];
    
    item = { tag: 'styles', callback: toolbar_button_style, 'class': 'rte_bttn_style', 'options': style_options, 'text': 'Text style...' };
    this.addToolbarItem(item);
	
	item = { tag: 'rte_bttn_remove_format', execCommand: 'removeFormat', execOptions: null, 'text': 'Remove text formatting'};
    this.addToolbarItem(item);
	
    var colors = [
		'#000000', '#FFFFFF', '#FF6FCF', '#CD68FF', '#66CCFF', '#CCFF66', '#FFCD69',
		'#FF6868','#FAFA66', '#69FF69', '#69FFFF', '#6666FF', '#FF66FF', '#191919',
		'#E6E6E6','#FF8103','#80FF00','#00FF80','#007FFE','#7F00FD', '#0080FF', '#8000FF', '#FF0080', '#333333',
		'#C8C8C8','#FE0303','#FFFF00','#00FE00','#00FFFF','#0000FF', '#4E4E4E','#B4B4B4',
		'#7F4000', '#407F00', '#007E3F', '#00407F', '#420381', '#034281', '#400080', '#7F0040', '#666666',
		'#989898', '#800000', '#808000', '#038103', '#038181', '#000080', '#7F007F', '#7F7F7F', '#7E7E7E'
	];
    
    options = new Array();
    for (var key in colors){
        var e = new Array();
        e[0] = colors[key];
        e[1] = "<span class='rte_color_entry' style='background-color: " + e[0] + "'></span>";
        options.push(e);
    }
    
    item = { tag: 'cmd_color', callback: toolbar_button_color, 'class': 'rte_bttn_color', 'options': options, 'class_popup': 'rte_color_box', 'text': 'Text color...' };
    this.addToolbarItem(item);
    
    
	item = { tag: 'sep1' };
    this.addToolbarItem(item);
	
	item = { tag: 'link', callback:toolbar_button_link, 'class': 'rte_bttn_link', 'text': 'Create link...'};
    this.addToolbarItem(item);
	
	
   
	
}