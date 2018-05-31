# jquery-viewpager
A jQuery plugin which replicates Android's ViewPager, works on touch-enabled devices.

## Usage:

```
<script src="path/to/jquery.js"></script>
<script src="path/to/jquery-viewpager.js"></script>
<style>
  .pager_items, .item {
    height: 100%;
  }
</style>
<div id="pager">
  <div class="pager_items">
    <div class="item">page 0</div>
    <div class="item">page 1</div>
    <div class="item">page 2</div>
    <div class="item">page 3</div>
    <div class="item">page 4</div>
    <div class="item">page 5</div>
    <div class="item">page 6</div>
    <div class="item">page 7</div>
    <div class="item">page 8</div>
    <div class="item">page 9</div>
    <div class="item">page 10</div>
    <div class="item">page 11</div>
    <div class="item">page 12</div>
    <div class="item">page 13</div>
    <div class="item">page 14</div>
  </div>
</div>

<script>
  $('#pager').viewpager(".pager_items");
</script>
```
