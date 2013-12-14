/*
 * ****************************************************************************************************
 * This file contains custom KnockoutJS bindings for OWL Carousel (http://owlgraphic.com/owlcarousel/).
 * It is a wrapper for the built in 'template' binding.
 *
 * @author Hauke Jaeger, hauke.jaeger@googlemail.com
 * ****************************************************************************************************
 */
;(function(factory) {
    if (typeof define === "function" && define.amd) {
        define(["knockout", "jquery", "jquery.ui.sortable"], factory);
    } else {
        factory(window.ko, jQuery);
    }
})(function(ko, $, undefined) {
    /**
     * Helper function that refreshes the items of the given owl instance.
     *
     * @param {{ $owlWrapper: jQuery, $owlItems: jQuery, $userItems: jQuery, itemsAmount: number }} owl
     *          The owl carousel instance that should be refreshed
     */
    var refreshOwl = function (owl) {
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
    var makeTemplateBindingOptions = function (options, afterRender) {
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
            var owlOptions = options.owlOptions || {};
            $elem.owlCarousel(owlOptions);

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
                    owl.destroy();
                }
            });

            // create options for the template binding with a afterRender event hook
            // that causes the carousel to refresh its internal state
            var templateOptions = makeTemplateBindingOptions(options, function () {
                refreshOwl(owl);
            });

            return ko.bindingHandlers.template.init(owl.$owlWrapper[0], function() { return templateOptions; }, allBindingsAccessor, viewModel, bindingContext);
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            // the options that have been configured with the owlCarousel binding
            var options = ko.utils.unwrapObservable(valueAccessor());
            
            // the bound element as a jQuery object
            var $elem = $(element);

            // the owl instance that has been associated with the element
            var owl = $elem.data("owlCarousel");

            // create options for the template binding with a afterRender event hook
            // that causes the carousel to refresh its internal state
            var templateOptions = makeTemplateBindingOptions(options, function (element, data) {
                refreshOwl(owl);
            });

            ko.bindingHandlers.template.update(owl.$owlWrapper[0], function() { return templateOptions; }, allBindingsAccessor, viewModel, bindingContext);
        }
    };
});