exc-rte
=======

A lightweight Rich Text Editor plugin for jquery

Events
------
The widgets provides a set of events for which you can register callbacks. 

event_loaded( )
------
Called when a RTE widget is created and ready. Use this event to add toolbars, etc. This function receives the instance of the RTE widget as argument. The variable "this" points to the RTE widget instance.

event_contextmenu
------
Called on a contextual menu click. The variable "this" points to the RTE widget instance.

event_mouseup, event_mousedown
------
Equivalent to their respective JQuery Events. The variable "this" points to the RTE widget instance. First argument is the event object.
event_keyup, event_keydown
------
Equivalent to their respective JQuery Events. The variable "this" points to the RTE widget instance. First argument is the event object.

Toolbars
------
Enable the use of toolbars by setting the option `use_toolbar` to true.

Toolbars items are created with the function `addToolbarItem(item)`. This function takes as argument a toolbar item definition.

A toolbar item definition is a literal object with the following properties:

|Property|Description|
|---|---|
|tag|A unique string identifier for the item.|
|class|A class name for the element, else the string provided in "tag" will be used.|
|execCommand|Optionally a valid string command for document.execCommand that will be executed when the button is clicked. See: https://developer.mozilla.org/en/Rich-Text_Editing_in_Mozilla#Executing_Commands|
|execOptions|When using execCommand you may provide additional arguments here.|
|callback|Optionally a function to be executed when the button is clicked.|
|init|Optionally a function called to generate the toolbar item html. This function must return a string with valid html. If not provided a basic anchor element is created.|
|html|Optionally a string with the html of the toolbar item.|
|options|Optionally an array of value pairs to display in a popup menu. Usefull for fonts, colors, etc. Each item in the options array is an array itself of two elements. The first is the bound value and the second is the caption or html to display. When using options you must use callbacks to handle the option selection.| 
|class_popup|Optionally when using options you can provide a class name to be added to the popup items.|

```javascript
var item = { tag: 'bold', execCommand: 'bold', execOptions: null, };
rte.addToolbarItem(item);
```

Example using a Callback:
```javascript
item = { tag: 'dosomething', callback: my_toolbar_button, 'class': 'style_bttn'};
rte.addToolbarItem(item);
```

Credits
------
Images from Mark James, http://www.famfamfam.com/lab/icons/silk/
Inspired by RTE Light Plugin, http://code.google.com/p/rte-light/


Reference
------
https://developer.mozilla.org/en/Rich-Text_Editing_in_Mozilla#Executing_Commands
