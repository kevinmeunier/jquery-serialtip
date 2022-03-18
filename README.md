# jQuery serialtip - Easy to use and customisable tooltip

## About jQuery serialtip
The tooltip can be used to provide additional information or display a dropdown menu. The positionning of the dropdown is fully configurable. Note that jQuery serialtip is shared for inspirational and development purpose.


## Demonstration
See the [project page](https://github.meunierkevin.com/jquery-serialtip/) for a demonstration.


## Compatibility
jQuery serialtip has been tested in: IE, Edge, Chrome (mobile included), Firefox (mobile included), and Safari (mobile included).


## Self-Hosted
[Download](https://github.com/kevinmeunier/jquery-serialtip/archive/master.zip) and save one of two available files to include serialtip to your page, either the [development](https://github.com/kevinmeunier/jquery-serialtip/blob/main/dist/jquery.serialtip.js) or the [minified](https://github.com/kevinmeunier/jquery-serialtip/blob/main/dist/jquery.serialtip.min.js) version. Also, you can visit the [project page](https://github.meunierkevin.com/jquery-serialtip/) to copy what you need.
```HTML
<script src="jquery.serialtip.min.js"></script>
<link href="jquery.serialtip.css" rel="stylesheet">
```
Due to the lightweight CSS code, it's recommended to copy/paste the CSS code into your general stylesheet.

Make sure [jQuery](http://jquery.com) is properly loaded before using jQuery serialtip. 


## Basic Usage
The basic usage of serialtip is pretty easy, just start using jQuery serialtip by calling it after page load.
```HTML
<p><span data-serialtip="example-1">Show the tooltip</span></p>
<div data-serialtip-target="example-1">
  // Your content
</div>
```
```JS
$(document).ready(function(){
  // jquery.serialtip initialisation
  $('[data-serialtip]').serialtip();
});
```

  
## Configuration Parameters
The following configurations is available by default:

Name               | Type       | Default                             | Description
------------------ | ---------- | ----------------------------------- | -----------
delay              | *integer*  | *300*                               | XXX 
event              | *string*   | *'click'*                           | Triggering event of the dropdown: 'click' || 'hover
position           | *string*   | *'bottom center'*                   | Placement (top/right/bottom/left) and alignment (top/right/bottom/left/center)
closeClass         | *string*   | *'serialtip-close'*                 | Class name when an HTML tag has been manually added in a tooltip 
activeClass        | *string*   | *'is-active'*                       | Active class on the trigger element 
getTarget          | *function* | *function($trigger){...}*           | The function to get the target based on the trigger element 


## Bugs / Feature request
Please [report](http://github.com/kevinmeunier/jquery-serialtip/issues) bugs and feel free to [ask](http://github.com/kevinmeunier/jquery-serialtip/issues) for new features directly on GitHub.


## License
jQuery serialtip is licensed under [MIT](http://www.opensource.org/licenses/mit-license.php) license.
