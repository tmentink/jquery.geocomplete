(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  !function ($) {
    // ----------------------------------------------------------------------
    // Constants
    // ----------------------------------------------------------------------
    var NAME = 'geocomplete';
    var DATA_KEY = "gmap.".concat(NAME);
    var EVENT_KEY = ".".concat(DATA_KEY);
    var AutocompleteOptions = ['bounds', 'componentRestrictions', 'placeIdOnly', 'strictBounds', 'types'];
    var Settings = {
      appendToParent: true,
      fields: null,
      geolocate: false,
      map: null,
      types: ['geocode'],
      // Callbacks
      onChange: function onChange() {},
      onNoResult: function onNoResult() {}
    };
    var Event = {
      FOCUS: "focus".concat(EVENT_KEY),
      PLACE_CHANGED: 'place_changed'
    };
    var AddressFunctions = {
      city: function city(details, short) {
        return _getAddressValue({
          placeAddress: details.address_components,
          name: short ? 'short_name' : 'long_name',
          type: 'locality'
        });
      },
      country: function country(details, short) {
        return _getAddressValue({
          placeAddress: details.address_components,
          name: short ? 'short_name' : 'long_name',
          type: 'country'
        });
      },
      county: function county(details, short) {
        return _getAddressValue({
          placeAddress: details.address_components,
          name: short ? 'short_name' : 'long_name',
          type: 'administrative_area_level_2'
        });
      },
      formattedaddress: function formattedaddress(details) {
        return details.formatted_address;
      },
      neighborhood: function neighborhood(details, short) {
        return _getAddressValue({
          placeAddress: details.address_components,
          name: short ? 'short_name' : 'long_name',
          type: 'neighborhood'
        });
      },
      state: function state(details, short) {
        return _getAddressValue({
          placeAddress: details.address_components,
          name: short ? 'short_name' : 'long_name',
          type: 'administrative_area_level_1'
        });
      },
      street: function street(details, short) {
        return _getAddressValue({
          placeAddress: details.address_components,
          name: short ? 'short_name' : 'long_name',
          type: 'route'
        });
      },
      streetaddress: function streetaddress(details, short) {
        var number = _getAddressValue({
          placeAddress: details.address_components,
          name: short ? 'short_name' : 'long_name',
          type: 'street_number'
        });

        var street = _getAddressValue({
          placeAddress: details.address_components,
          name: short ? 'short_name' : 'long_name',
          type: 'route'
        });

        return "".concat(number, " ").concat(street);
      },
      streetnumber: function streetnumber(details, short) {
        return _getAddressValue({
          placeAddress: details.address_components,
          name: short ? 'short_name' : 'long_name',
          type: 'street_number'
        });
      },
      zipcode: function zipcode(details, short) {
        return _getAddressValue({
          placeAddress: details.address_components,
          name: short ? 'short_name' : 'long_name',
          type: 'postal_code'
        });
      },
      zipcodesuffix: function zipcodesuffix(details, short) {
        return _getAddressValue({
          placeAddress: details.address_components,
          name: short ? 'short_name' : 'long_name',
          type: 'postal_code_suffix'
        });
      }
    };
    var FieldFunctions = {
      clear: {
        INPUT: function INPUT($field) {
          $field.val('');
        },
        SELECT: function SELECT($field) {
          $field.val('');
        },
        SEMANTIC_DROPDOWN: function SEMANTIC_DROPDOWN($field) {
          $field.dropdown('clear');
        }
      },
      set: {
        INPUT: function INPUT($field, value) {
          $field.val(value);
        },
        SELECT: function SELECT($field, value) {
          var index = $("option:contains(".concat(value, ")"), $field)[0].index;
          $field.prop('selectedIndex', index);
        },
        SEMANTIC_DROPDOWN: function SEMANTIC_DROPDOWN($field, value) {
          $field.dropdown('set selected', value);
        }
      } // ----------------------------------------------------------------------
      // Global Variables
      // ----------------------------------------------------------------------

    };
    var Index = -1;

    var StyleSheet = _createStyleSheet(); // ----------------------------------------------------------------------
    // Class Definition
    // ----------------------------------------------------------------------


    var Geocomplete =
    /*#__PURE__*/
    function () {
      function Geocomplete(element, settings) {
        var _this = this;

        _classCallCheck(this, Geocomplete);

        if (typeof settings === 'string') {
          settings = {};
        }

        settings = $.extend(true, {}, $.fn[NAME].settings, settings); // only copy over autocomplete options to avoid conflicts with google maps

        var options = {};
        Object.keys(settings).forEach(function (key) {
          if (AutocompleteOptions.indexOf(key) !== -1) {
            options[key] = settings[key];
          }
        });
        this.element = element;
        this.fields = settings.fields;
        this.index = Index += 1;
        this.map = settings.map;
        this.obj = new google.maps.places.Autocomplete(element, options);
        this.pacContainer = null; // add event listenter when the place is changed

        this.obj.addListener(Event.PLACE_CHANGED, function () {
          var $element = $(_this.element);

          var placeDetails = _this.getplace();

          if (_isEmptyResult(placeDetails)) {
            settings.onNoResult.call($element, placeDetails.name);
          } else {
            settings.onChange.call($element, placeDetails.name, placeDetails);

            if (_this.fields != null) {
              _this.fillfields();
            }

            if (_this.map != null) {
              var location = placeDetails.geometry.location;
              var viewport = placeDetails.geometry.viewport;

              _this.centermap(location || viewport);
            }
          }
        }); // bias the search results based on the browser's geolocation

        if (settings.geolocate) {
          _geoLocate(this.obj);
        }

        if (settings.appendToParent) {
          // append the .pac-container to element's parent
          $(element).on(Event.FOCUS, function () {
            var $element = $(this);
            var geo = $element.data(DATA_KEY);

            if (geo.pacContainer != null) {
              _appendContainer($element, geo.pacContainer);

              $element.off(Event.FOCUS);
            }
          }); // delay function to ensure pac-container exists in DOM

          setTimeout(function () {
            _this.pacContainer = $('.pac-container')[_this.index];
          }, 1000);
        }
      } // --------------------------------------------------------------------
      // Public Methods
      // --------------------------------------------------------------------


      _createClass(Geocomplete, [{
        key: "centermap",
        value: function centermap(bounds) {
          if (bounds == null) {
            var details = this.getplace();
            var location = details.geometry.location;
            var viewport = details.geometry.viewport;
            bounds = viewport || location;
          }

          if (bounds instanceof google.maps.LatLngBounds) {
            this.map.fitBounds(bounds);
          } else if (bounds instanceof google.maps.LatLng) {
            this.map.setCenter(bounds);
          }

          return $(this.element);
        }
      }, {
        key: "clearfields",
        value: function clearfields() {
          var fields = this.fields;

          if ($.type(fields) === 'string') {
            $("[data-".concat(NAME, "]"), $(this.fields)).each(function () {
              var $field = $(this);

              FieldFunctions.clear[_getFieldType($field)]($field);
            });
          } else if ($.type(fields) === 'object') {
            for (var id in fields) {
              var $field = $(id);

              if ($field.length === 0) {
                _throwError("".concat(id, " was not found in DOM"));

                continue;
              }

              FieldFunctions.clear[_getFieldType($field)]($field);
            }
          }

          return $(this.element);
        }
      }, {
        key: "fillfields",
        value: function fillfields() {
          this.clearfields();
          var fields = this.fields;
          var placeDetails = this.obj.getPlace();

          if ($.type(fields) === 'string') {
            $("[data-".concat(NAME, "]"), $(this.fields)).each(function () {
              var $field = $(this);
              var addressType = $field.data(NAME);

              _setFieldValue($field, addressType, placeDetails);
            });
          } else if ($.type(fields) === 'object') {
            for (var id in fields) {
              var $field = $(id);
              var addressType = fields[id];

              if ($field.length === 0) {
                _throwError("".concat(id, " was not found in DOM"));

                continue;
              }

              _setFieldValue($field, addressType, placeDetails);
            }
          }

          return $(this.element);
        }
      }, {
        key: "getbounds",
        value: function getbounds() {
          return this.obj.getBounds();
        }
      }, {
        key: "getplace",
        value: function getplace() {
          return this.obj.getPlace();
        }
      }, {
        key: "setbounds",
        value: function setbounds(parms) {
          this.obj.setBounds(parms);
          return $(this.element);
        }
      }, {
        key: "setcomponentrestrictions",
        value: function setcomponentrestrictions(parms) {
          this.obj.setComponentRestrictions(parms);
          return $(this.element);
        }
      }, {
        key: "setoptions",
        value: function setoptions(parms) {
          this.obj.setOptions(parms);
          return $(this.element);
        }
      }, {
        key: "settypes",
        value: function settypes(parms) {
          this.obj.setTypes(parms);
          return $(this.element);
        } // --------------------------------------------------------------------
        // Static Methods
        // --------------------------------------------------------------------

      }], [{
        key: "_jQueryInterface",
        value: function _jQueryInterface(settings, parms) {
          var $element = $(this);
          var geo = $element.data(DATA_KEY);

          if (!geo) {
            geo = new Geocomplete(this[0], settings);
            $element.data(DATA_KEY, geo);
          }

          if (typeof settings === 'string') {
            var method = settings.toLowerCase().replace(/\s+/g, '');

            if (geo[method]) {
              return geo[method](parms);
            }

            _throwError("\"".concat(settings, "\" is not a valid method"));
          }

          return this;
        }
      }]);

      return Geocomplete;
    }(); // ----------------------------------------------------------------------
    // Private Functions
    // ----------------------------------------------------------------------


    function _appendContainer($element, $pacContainer) {
      var left = "".concat(_calcLeftPosition($element), "px !important");
      var top = "".concat(_calcTopPosition($element), "px !important");
      $pacContainer.id = "pac-container_".concat($element[0].id);
      StyleSheet.innerHTML += "#".concat($pacContainer.id, "{top:").concat(top, "; left:").concat(left, ";}");
      $element.parent().css({
        position: 'relative'
      }).append($pacContainer);
    }

    function _calcLeftPosition($element) {
      var element_left = $element.offset().left;
      var parent_left = $element.parent().offset().left;
      return element_left - parent_left;
    }

    function _calcTopPosition($element) {
      var element_top = $element.offset().top;
      var element_height = $element.outerHeight();
      var parent_top = $element.parent().offset().top;
      return element_top - parent_top + element_height;
    }

    function _createStyleSheet() {
      var style = document.createElement('style');
      style.type = 'text/css';
      $('head')[0].appendChild(style);
      return style;
    }

    function _geoLocate(obj) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var circle = new google.maps.Circle({
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            radius: position.coords.accuracy
          });
          obj.setBounds(circle.getBounds());
        });
      }
    }

    function _getAddressValue(parms) {
      var placeAddress = parms.placeAddress || [];
      var name = parms.name;
      var type = parms.type;
      var i = placeAddress.map(function (address) {
        return address.types[0] === type;
      }).indexOf(true);
      return i !== -1 ? placeAddress[i][name] : '';
    }

    function _getFieldType($field) {
      return _isSemanticDropdown($field) ? 'SEMANTIC_DROPDOWN' : $field.prop('nodeName');
    }

    function _isEmptyResult(placeDetails) {
      return Object.keys(placeDetails).length <= 1;
    }

    function _isSemanticDropdown($field) {
      var $parent = $field.parent();

      if ($field.hasClass('ui') && $field.hasClass('dropdown') || $parent.hasClass('ui') && $parent.hasClass('dropdown')) {
        return true;
      }

      return false;
    }

    function _setFieldValue($field, addressType, placeDetails) {
      addressType = addressType.toLowerCase().replace(/\s+/g, '');
      var short = addressType.indexOf('short') !== -1;
      addressType = addressType.replace('short', '');

      if (AddressFunctions[addressType]) {
        var value = AddressFunctions[addressType](placeDetails, short);

        FieldFunctions.set[_getFieldType($field)]($field, value);
      } else {
        _throwError("".concat(addressType, " is not a valid address type"));
      }
    }

    function _throwError(message) {
      /* eslint-disable no-console */
      console.error(message);
    } // ------------------------------------------------------------------------
    // jQuery
    // ------------------------------------------------------------------------


    $.fn[NAME] = Geocomplete._jQueryInterface;
    $.fn[NAME].Constructor = Geocomplete;
    $.fn[NAME].settings = Settings;
    return $;
  }(window.jQuery || window.$);

}));
