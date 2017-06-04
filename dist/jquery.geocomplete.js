/*!
 * jquery.geocomplete v1.0.1 (https://github.com/tmentink/jquery.geocomplete)
 * Copyright 2017 Trent Mentink
 * Licensed under MIT
 */

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

if (typeof jQuery === "undefined" && typeof $ === "undefined") {
  throw new Error("jQuery is required.");
}

if (typeof google === "undefined" || typeof google.maps === "undefined" || typeof google.maps.places === "undefined") {
  throw new Error("Google Maps JavaScript API v3 with Places libary is required.");
}

!function($) {
  "use strict";
  var NAME = "geocomplete";
  var DATA_KEY = "gmap." + NAME;
  var EVENT_KEY = "." + DATA_KEY;
  var Defaults = {
    appendToParent: true,
    fields: {},
    geolocate: false,
    types: [ "geocode" ]
  };
  var Event = {
    FOCUS: "focus" + EVENT_KEY,
    PLACE_CHANGED: "place_changed"
  };
  var AddressFunctions = {
    city: function city(details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "locality"
      });
    },
    country: function country(details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "country"
      });
    },
    county: function county(details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "administrative_area_level_2"
      });
    },
    formattedaddress: function formattedaddress(details) {
      return details["formatted_address"];
    },
    neighborhood: function neighborhood(details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "neighborhood"
      });
    },
    state: function state(details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "administrative_area_level_1"
      });
    },
    street: function street(details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "route"
      });
    },
    streetaddress: function streetaddress(details, short) {
      var number = _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "street_number"
      });
      var street = _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "route"
      });
      return number + " " + street;
    },
    streetnumber: function streetnumber(details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "street_number"
      });
    },
    zipcode: function zipcode(details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "postal_code"
      });
    },
    zipcodesuffix: function zipcodesuffix(details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "postal_code_suffix"
      });
    }
  };
  var FieldFunctions = {
    clear: {
      INPUT: function INPUT($field) {
        $field.val("");
      },
      SELECT: function SELECT($field) {
        $field.val("");
      },
      SEMANTIC_DROPDOWN: function SEMANTIC_DROPDOWN($field) {
        $field.dropdown("clear");
      }
    },
    set: {
      INPUT: function INPUT($field, value) {
        $field.val(value);
      },
      SELECT: function SELECT($field, value) {
        var index = $("option:contains(" + value + ")", $field)[0].index;
        $field.prop("selectedIndex", index);
      },
      SEMANTIC_DROPDOWN: function SEMANTIC_DROPDOWN($field, value) {
        $field.dropdown("set selected", value);
      }
    }
  };
  var Index = -1;
  var StyleSheet = _createStyleSheet();
  var Autocomplete = function() {
    function Autocomplete(element, config) {
      var _this = this;
      _classCallCheck(this, Autocomplete);
      if (typeof config === "string") {
        config = {};
      }
      config = $.extend(true, {}, $.fn[NAME].Defaults, config);
      this.element = element;
      this.fields = _formatFieldIds(config.fields);
      this.index = Index += 1;
      this.obj = new google.maps.places.Autocomplete(element, config);
      this.pacContainer = null;
      this.obj.addListener(Event.PLACE_CHANGED, function() {
        _this.fillfields();
      });
      if (config.geolocate) {
        _geoLocate(this.obj);
      }
      if (config.appendToParent) {
        $(element).on(Event.FOCUS, function() {
          var $element = $(this);
          var data = $element.data(DATA_KEY);
          if (data.pacContainer != null) {
            _appendContainer($element, data.pacContainer);
            $element.off(Event.FOCUS);
          }
        });
        setTimeout(function() {
          _this.pacContainer = $(".pac-container")[_this.index];
        }, 1e3);
      }
    }
    Autocomplete.prototype.clearfields = function clearfields() {
      var fields = this.fields;
      for (var id in fields) {
        var $field = $(id);
        FieldFunctions.clear[_getFieldType($field)]($field);
      }
      return $(this.element);
    };
    Autocomplete.prototype.fillfields = function fillfields() {
      this.clearfields();
      var fields = this.fields;
      var placeDetails = _getPlaceDetails(this.obj);
      for (var id in fields) {
        var addressType = fields[id].toLowerCase().replace(/\s+/g, "");
        var short = addressType.indexOf("short") != -1;
        addressType = addressType.replace("short", "");
        var value = AddressFunctions[addressType](placeDetails, short);
        var $field = $(id);
        FieldFunctions.set[_getFieldType($field)]($field, value);
      }
      return $(this.element);
    };
    Autocomplete.prototype.getbounds = function getbounds() {
      return this.obj.getBounds();
    };
    Autocomplete.prototype.getplace = function getplace() {
      return this.obj.getPlace();
    };
    Autocomplete.prototype.setbounds = function setbounds(parms) {
      this.obj.setBounds(parms);
      return $(this.element);
    };
    Autocomplete.prototype.setcomponentrestrictions = function setcomponentrestrictions(parms) {
      this.obj.setComponentRestrictions(parms);
      return $(this.element);
    };
    Autocomplete.prototype.setoptions = function setoptions(parms) {
      this.obj.setOptions(parms);
      return $(this.element);
    };
    Autocomplete.prototype.settypes = function settypes(parms) {
      this.obj.setTypes(parms);
      return $(this.element);
    };
    Autocomplete._jQueryInterface = function _jQueryInterface(config, parms) {
      var $element = $(this);
      var data = $element.data(DATA_KEY);
      if (!data) {
        data = new Autocomplete(this[0], config);
        $element.data(DATA_KEY, data);
      }
      if (typeof config === "string") {
        config = config.toLowerCase().replace(/\s+/g, "");
        if (data[config] === undefined) {
          throw new Error('No method named "' + config + '"');
        }
        return data[config](parms);
      }
      return this;
    };
    return Autocomplete;
  }();
  function _appendContainer($element, $pacContainer) {
    var left = _calcLeftPosition($element) + "px !important";
    var top = _calcTopPosition($element) + "px !important";
    $pacContainer.id = "pac-container_" + $element[0].id;
    StyleSheet.innerHTML += "#" + $pacContainer.id + "{top:" + top + "; left:" + left + ";}";
    $element.parent().css({
      position: "relative"
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
    var style = document.createElement("style");
    style.type = "text/css";
    $("head")[0].appendChild(style);
    return style;
  }
  function _formatFieldIds(fields) {
    for (var id in fields) {
      if (id.substring(0, 1) != "#") {
        fields["#" + id] = fields[id];
        delete fields[id];
      }
    }
    return fields;
  }
  function _geoLocate(obj) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
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
    var i = placeAddress.map(function(address) {
      return address.types[0] == type;
    }).indexOf(true);
    return i != -1 ? placeAddress[i][name] : "";
  }
  function _getFieldType($field) {
    return _isSemanticDropdown($field) ? "SEMANTIC_DROPDOWN" : $field.prop("nodeName");
  }
  function _getPlaceDetails(obj) {
    return obj.getPlace();
  }
  function _isSemanticDropdown($field) {
    var $parent = $field.parent();
    if ($field.hasClass("ui") && $field.hasClass("dropdown") || $parent.hasClass("ui") && $parent.hasClass("dropdown")) {
      return true;
    }
    return false;
  }
  $.fn[NAME] = Autocomplete._jQueryInterface;
  $.fn[NAME].Constructor = Autocomplete;
  $.fn[NAME].Defaults = Defaults;
  return $;
}(window.jQuery || window.$);
