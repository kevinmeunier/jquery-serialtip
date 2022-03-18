/*!
 * jQuery serialtip
 * https://github.com/kevinmeunier/jquery-serialtip
 *
 * Copyright 2022 Meunier Kévin
 * https://www.meunierkevin.com
 *
 * Released under the MIT license
 */
(function($){
  'use strict';

  const clickEvent = ( ('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch) )
    ? 'touchstart.serialtip'
    : 'click.serialtip';
  const mouseEnterEvent = 'mouseenter.serialtip';
  const mouseLeaveEvent = 'mouseleave.serialtip';
  const resizeEvent = 'resize.serialtip';
  const $window = $(window);
  const $html = $('html');
  let plugininit = false;
  let $wrapper;
  let $lastTarget;
  let timer;

  $.fn.serialtip = function(options){
    const settings = $.extend({}, $.fn.serialtip.defaults, options);
    const base = this;

    $.extend(this, {
      onload: function(){
        $wrapper = $('<div id="serialtip" />').appendTo('body');
        plugininit = true;
      },

      init: function(){
        if( plugininit == false )
          this.onload();

        // Hide the target on load and bind proper events
        this.each(function(){
          const $trigger = $(this);
          const $target = settings.getTarget($trigger);

          // Store the trigger and hide the target
          $target
            .appendTo($wrapper)
            .data('serialtip', $trigger);

          // Manage click event
          if( settings.event == 'click' ){
            $trigger.off(clickEvent).on(clickEvent, function(){
              const action = base.getAction($trigger);
              base[action ? 'open' : 'close']($target);
              return false;
            });

          // Manage hover event
          } else if( settings.event == 'hover' ){
            $trigger.off(mouseEnterEvent).on(mouseEnterEvent, function(){
              clearTimeout(timer);
              base.open($target);
            });

            $target.off(mouseEnterEvent).on(mouseEnterEvent, function(){
              clearTimeout(timer);
            });

            $trigger.add($target).off(mouseLeaveEvent).on(mouseLeaveEvent, function(){
              timer = setTimeout(function(){
                base.close();
              }, settings.delay);
            });
          }
        });

        // Manage event for close link
        $('.'+settings.closeClass).off(clickEvent).on(clickEvent, function(){
          base.close();
        });

        if( settings.event == 'click' ){
          // Manage click outside the close link
          $html
            .off(clickEvent)
            .on(clickEvent, function(event){
              if( $lastTarget && event.target.id != 'serialtip' && !$wrapper.find(event.target).length )
                base.close();
          });

          // Close the tooltip on resize to avoid any bug
          $window.off(resizeEvent).on(resizeEvent, function(){
            if( $lastTarget )
              setTimeout(function(){
                base.setPosition($lastTarget);
              }, 500);
          });
        }
      },

      getAction: function($trigger){
        return !$trigger.hasClass(settings.activeClass);
      },

      getPosition: function($trigger, offset){
        const position = $trigger.data('serialtip-position') || settings.position;
        return {
          placement: position.split(' ')[0],
          alignment: position.split(' ')[1] || 'center'
        };
      },

      getOffset: function(trigger){
        const clientRect = trigger.getBoundingClientRect();
        const scrollTop = $window.scrollTop();
        const offset = {
          top: clientRect.top + scrollTop,
          right: clientRect.right,
          bottom: clientRect.bottom + scrollTop,
          left: clientRect.left
        };

        // IE8 and below doesn't provide clientRect.width and clientRect.height and crashes while trying to define them
        offset.width = offset.right - offset.left;
        offset.height = offset.bottom - offset.top;

        return offset;
      },

      setCurrent: function($trigger, action){
        $trigger[action ? 'addClass' : 'removeClass'](settings.activeClass);
      },

      setPosition: function($target){
        const $trigger = $target.data('serialtip');
        const offset = base.getOffset($trigger[0]);
        const position = base.getPosition($trigger, offset);
        let style = { top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' };

        // Add position class
        const positionClass = 'is-placement-'+position.placement+' is-alignment-'+position.alignment;
        $target.data('serialtip-class', positionClass).addClass(positionClass);

        // Calculate the placement
        switch( position.placement ){
          case 'top':
            style.bottom = $window.height() - offset.top;
            break;
          case 'right':
            style.left = offset.right;
            break;
          case 'bottom':
            style.top = offset.bottom;
            break;
          case 'left':
            style.right = $window.width() - offset.left;
            break;
        }

        // Calculate the alignment
        switch( position.alignment ){
          case 'top':
            style.bottom = $window.height() - offset.bottom;
            break;
          case 'right':
            style.right = $window.width() - offset.left - offset.width;
            break;
          case 'bottom':
            style.top = offset.top;
            break;
          case 'left':
            style.left = offset.left;
            break;
          case 'center':
            ( position.placement == 'top' || position.placement == 'bottom' )
              ? style.left = offset.left - ( $target.outerWidth(true) - offset.width ) / 2
              : style.top = offset.top - ( $target.outerHeight(true) - offset.height ) / 2;
            break;
        }

        // Fix position in order to fit well with small screens
        for( var attr in style )
          if( style[attr] < 0 )
            style[attr] = 0;

        // Apply final style
        $target.css(style);
      },

      open: function($target){
        // Hide the previous target if exists
        if( $lastTarget && !$lastTarget.is($target) )
          base.close();

        // No behavior if the target is already visible
        if( $target.is(':visible') )
          return;

        // Set absolute positioning
        this.setPosition($target);

        // Show the target
        $target.stop(false, true).fadeIn();

        // Add the current state
        const $trigger = $target.data('serialtip');
        this.setCurrent($trigger, true);

        // Define globally the last target
        $lastTarget = $target;
      },

      close: function(){
        const $target = $lastTarget;
        if( !$target )
          return;

        // Retrieve the trigger from the target
        const $trigger = $target.data('serialtip');

        // Hide the target
        $target.stop(false, true).fadeOut(function(){
          // Remove position class
          const positionClass = $target.data('serialtip-class');
          $target.removeClass(positionClass);
        });

        // Add the current state
        this.setCurrent($trigger, false);

        // Global reset of the last target
        $lastTarget = false;
      }
    });

    // Init and maintain chainability
    this.init();
    return this;
  };

  $.fn.serialtip.defaults = {
    delay: 300,
    event: 'click',
    position: 'bottom center',
    closeClass: 'serialtip-close',
    activeClass: 'is-active',
    getTarget: function($trigger){
      const target = $trigger.data('serialtip');
      return $('[data-serialtip-target="'+ target +'"]');
    }
  };

  /*
  top / left
  top / center
  top / right
  right / top
  right / center
  right / bottom
  bottom / left
  bottom / center
  bottom / right
  left / top
  left / center
  left / bottom
  */
})(jQuery);
