knockout-owlCarousel
====================

KnockoutJS binding for connecting OWL Carousel with an ko.observableArray()

Basic usage
-----------

```HTML
<!-- don't forget to include the owl.carousel.css stylesheet -->
<link href="css/owl.carousel.css" rel="stylesheet" type="text/css">

<script type="text/javascript" src="js/vendor/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="js/vendor/knockout-2.3.0.js"></script>
<script type="text/javascript" src="js/vendor/owl.carousel.js"></script>

<script type="text/javascript" src="js/vendor/knockout-owlCarousel.js"></script>

<!-- ... -->

<div 
  id="myCarousel" 
  class="owl-carousel"
  data-bind="owlCarousel: { data: myItems }">
  
  <img data-bind="attr: { src: url, title: name, alt: name }" />
  
</div>
```
```JavaScript
var MyViewModel = function () {
  this.myItems = ko.observableArray([
    { name: 'Image 1',  url: 'images/image_1.png' },
    { name: 'Image 2',  url: 'images/image_2.png' },
    { name: 'Image 3',  url: 'images/image_3.png' },
  ]);
};
```