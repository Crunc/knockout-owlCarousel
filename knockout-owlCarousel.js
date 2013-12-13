/*
 * ****************************************************************************************************
 * This file contains custom KnockoutJS bindings for OWL Carousel (http://owlgraphic.com/owlcarousel/).
 * It is a wrapper for the built in 'template' binding.
 *
 * @author Hauke Jaeger, hauke.jaeger@googlemail.com
 * ****************************************************************************************************
 */

/**
 * Helper function that refreshes the items of the given owl instance.
 *
 * @param {{ $owlWrapper: jQuery, $owlItems: jQuery, $userItems: jQuery, itemsAmount: number }} owl
 *          The owl carousel instance that should be refreshed
 */
function refreshOwl (owl) {
    // find all owl items that are currently wrapped in the owl wrapper element
    owl.$owlItems = owl.$owlWrapper.children(".owl-item");

    // extract the elements that are wrapped in the owl items
    owl.$userItems = owl.$owlItems.children();
    owl.itemsAmount = owl.$userItems.length;

    // TODO: check if items have been removed and adjust owl's internal current position

    // recalculate internal values
    owl.calculateAll();
};

/**
 * Helper function for creating an options object that can be passed to ko.bindingHandlers.template.init as a value for
 * the 'valueAccessor' parameter.
 *
 * @param {{data: *, as: string, afterRender: function, afterAdd: function, beforeRemove: function}} options
 * @param {function} afterRender
 * @returns {{foreach: *, as: string, afterRender: function, afterAdd: function, beforeRemove: function}}
 */
function makeTemplateBindingOptions (options, afterRender) {
    var templateOptions = {
        foreach: options.data,
        as: options.as,
        afterRender: afterRender,
        afterAdd: options.afterAdd,
        beforeRemove: options.beforeRemove
    };

    if (options.afterRender) {
        var userAfterRender = options.afterRender;

        templateOptions.afterRender = function (element, data) {
            if (afterRender) {
                afterRender.call(data, element, data);
            }

            userAfterRender(data, element, data);
        };
    }

    return templateOptions;
};

ko.bindingHandlers.owlCarousel = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // the options that have been configured with the owlCarousel binding
        var options = ko.utils.unwrapObservable(valueAccessor());

        // the bound element as a jQuery object
        var $elem = $(element);

        // a dummy <div> element
        var $dummy = null;

        // check whether the owlCarousel binding has beeing initialized on an empty container element
        if ($elem.children().length === 0) {
            // create a dummy element and add it to the owlContainer element
            // this is necessary for initializing OWL Carousel without errors.
            $dummy = $('<div class="knockout-owlCarousel-dummy"></div>');
            $elem.append($dummy);
        }

        // initialize owl carousel
        // TODO: add support for options
        $elem.owlCarousel({
            singleItem: true
        });

        // the owl instance that has just been created
        var owl = $elem.data("owlCarousel");

        // remove the dummy element if it was required
        if ($dummy !== null) {
            owl.removeItem(0);
        }

        // register a callback that is being executed when the element is removed
        // in that case the carousel is no longer required and can be destroyed
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            if (owl) {
                console.log("destroyed owl");
                owl.destroy();
            }
        });

        var templateOptions = makeTemplateBindingOptions(options, function () {
            refreshOwl(owl);
        });

        return ko.bindingHandlers.template.init(owl.$owlWrapper[0], function() { return templateOptions; }, allBindingsAccessor, viewModel, bindingContext);
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        console.log("update owl");
        var options = ko.utils.unwrapObservable(valueAccessor());
        var $elem = $(element);
        var owl = $elem.data("owlCarousel");

        var templateOptions = makeTemplateBindingOptions(options, function (element, data) {
            refreshOwl(owl);
        });

        ko.bindingHandlers.template.update(owl.$owlWrapper[0], function() { return templateOptions; }, allBindingsAccessor, viewModel, bindingContext);
    }
};

/*
 {

 // Most important owl features
 items : 5,
 itemsCustom : false,
 itemsDesktop : [1199,4],
 itemsDesktopSmall : [980,3],
 itemsTablet: [768,2],
 itemsTabletSmall: false,
 itemsMobile : [479,1],
 singleItem : false,
 itemsScaleUp : false,

 //Basic Speeds
 slideSpeed : 200,
 paginationSpeed : 800,
 rewindSpeed : 1000,

 //Autoplay
 autoPlay : false,
 stopOnHover : false,

 // Navigation
 navigation : false,
 navigationText : ["prev","next"],
 rewindNav : true,
 scrollPerPage : false,

 //Pagination
 pagination : true,
 paginationNumbers: false,

 // Responsive
 responsive: true,
 responsiveRefreshRate : 200,
 responsiveBaseWidth: window,

 // CSS Styles
 baseClass : "owl-carousel",
 theme : "owl-theme",

 //Lazy load
 lazyLoad : false,
 lazyFollow : true,
 lazyEffect : "fade",

 //Auto height
 autoHeight : false,

 //JSON
 jsonPath : false,
 jsonSuccess : false,

 //Mouse Events
 dragBeforeAnimFinish : true,
 mouseDrag : true,
 touchDrag : true,

 //Transitions
 transitionStyle : false,

 // Other
 addClassActive : false,

 //Callbacks
 beforeUpdate : false,
 afterUpdate : false,
 beforeInit: false,
 afterInit: false,
 beforeMove: false,
 afterMove: false,
 afterAction: false,
 startDragging : false
 afterLazyLoad : false

 }
 */
