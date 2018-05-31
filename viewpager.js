/*
    jquery-viewpager
    Copyright (C) 2018  PublicStaticVoid2014
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
if (window.jQuery) {
    (function($) {
        var viewpagers = [];
        $.fn.viewpager = function(selector){
            var width = this.width();
            var items = this.find(selector);
            var children = items.children();
            var my_page = 0;
            var offset_px = 0;
            var isDragging = false;
            var isFirstMove = true;
            var isHorizontal = false;
            var drag_start_x = 0;
            var drag_start_y = 0;
            var drag_start_time = 0;
            var hasTouch = 'ontouchstart' in window;
            var guid = viewpagers.push(this) - 1;
            var that = this;

            items.css('width', (children.length * 100) + "%").css('transition', '0.3s ease-in-out');
            children.css("width", (100/children.length) + "%").css('display', 'inline-block').css('float', 'left').css('overflow-y', 'scroll');
            this.css('overflow-x', 'hidden');
            this.goToPage = function(i) {
                if (i < 0 || i > children.length) {
                    console.warn("out of range!");
                    return false;
                } else {
                    offset_px = -width * i;
                    items.css('transform', 'translateX(%spx)'.replace('%s', offset_px));
                    if (my_page != i) {
                        my_page = i;
                        that.trigger('pagechange', [i, that]);
                    }
                    return true;
                }
            }
            this.getMyPage = function() {
                return my_page;
            }
            this.getChildAt = function (i) {
                return children[i];
            }
            // start
            this.on(hasTouch ? 'touchstart' : 'mousedown', function(e) {
                isDragging = true;
                isHorizontal = false;
                isFirstMove = true;
                var pt = getPoint(e);
                drag_start_y = pt[1];
                drag_start_x = pt[0];
                drag_start_time = pt[2]
            })
            // move
            this.on(hasTouch ? 'touchmove' : 'mousemove', function(e) {
                var pt = getPoint(e);
                var dx = pt[0] - drag_start_x;
                var dy = pt[1] - drag_start_y;
                if (isFirstMove) {
                    // determine if is horizontal
                    isHorizontal = Math.abs(dy / dx) < 0.5;
                    isFirstMove = false;
                }
                if (isHorizontal && isDragging) {
                    // move along
                    disable_animation();
                    if ((my_page == 0 && dx > 0) || (my_page == children.length - 1 && dx < 0)) {
                        dx /= 4;
                        var anim = true;
                        // loop thru the path see if there are viewpagers
                        for (i in e.originalEvent.path) {
                            if (i < 3) continue;
                            for (j in viewpagers) {
                                if (e.originalEvent.path[i] == viewpagers[j][0]) {
                                    anim = false;
                                    break;
                                }
                                if (!anim) break;
                            }
                        }
                        if (anim) {
                            // no more viewpagers to propagate so show my animation
                            offset_px = -width * my_page + dx;
                            items.css('transform', 'translateX(%spx)'.replace('%s', offset_px));
                        }
                    } else {
                        offset_px = -width * my_page + dx;
                        items.css('transform', 'translateX(%spx)'.replace('%s', offset_px));
                        e.stopImmediatePropagation();
                    }
                }
            })
            // end
            this.on(hasTouch ? 'touchend touchcancel' : 'mouseup mousecancel', function(e) {
                enable_animation();
                if (!isHorizontal) return;
                var pt = getPoint(e);
                var dx = pt[0] - drag_start_x;
                var x_vel = dx / (pt[2] - drag_start_time);
                if (x_vel < -0.4 && my_page < children.length - 1) {
                    that.goToPage(my_page + 1);
                    e.stopImmediatePropagation();
                    return;
                }
                if (x_vel > 0.4 && my_page > 0) {
                    that.goToPage(my_page - 1);
                    e.stopImmediatePropagation();
                    return;
                }
                my_page = -Math.round(offset_px / width);
                if (my_page < 0) my_page = 0;
                if (my_page > children.length - 1) my_page = children.length - 1;
                that.goToPage(my_page);
                isDragging = false;
                isHorizontal = false;
            });

            function getPoint(e) {
                if (hasTouch) {
                    var t = (e.touches && e.touches.length) ? e.touches : e.changedTouches;
                    return [t[0].screenX, t[0].screenY, e.timeStamp];
                } else {
                    return [e.screenX, e.screenY, e.timeStamp];
                }
            }

            function disable_animation() {
                items.css('transition', '');
            }

            function enable_animation() {
                items.css('transition', '0.3s ease-in-out');
            }
            return this;
        }
    })(jQuery);
}
