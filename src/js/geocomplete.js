// ------------------------------------------------------------------------
// Geocomplete: geocomplete.js
// ------------------------------------------------------------------------

!(($) => {
  "use strict"


  // ----------------------------------------------------------------------
  // Constants
  // ----------------------------------------------------------------------

  const NAME      = "geocomplete"
  const DATA_KEY  = `gmap.${NAME}`
  const EVENT_KEY = `.${DATA_KEY}`

  const Settings = {
    appendToParent : true,
    fields         : {},
    geolocate      : false,
    types          : ["geocode"]
  }

  const Event = {
    FOCUS         : `focus${EVENT_KEY}`,
    PLACE_CHANGED : "place_changed"
  }

  const AddressFunctions = {
    city: function (details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "locality"
      })
    },
    country: function (details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "country"
      })
    },
    county: function (details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "administrative_area_level_2"
      })
    },
    formattedaddress: function (details) {
      return details["formatted_address"]
    },
    neighborhood: function (details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "neighborhood"
      })
    },
    state: function (details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "administrative_area_level_1"
      })
    },
    street: function (details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "route"
      })
    },
    streetaddress: function (details, short) {
      const number = _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "street_number"
      })

      const street = _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "route"
      })

      return `${number} ${street}`
    },
    streetnumber: function (details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "street_number"
      })
    },
    zipcode: function (details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "postal_code"
      })
    },
    zipcodesuffix: function (details, short) {
      return _getAddressValue({
        placeAddress: details["address_components"],
        name: short ? "short_name" : "long_name",
        type: "postal_code_suffix"
      })
    }
  }

  const FieldFunctions = {
    clear: {
      INPUT: function($field) {
        $field.val("")
      },
      SELECT: function($field) {
        $field.val("")
      },
      SEMANTIC_DROPDOWN: function($field) {
        $field.dropdown("clear")
      }
    },
    set: {
      INPUT: function($field, value) {
        $field.val(value)
      },
      SELECT: function($field, value) {
        const index = $(`option:contains(${value})`, $field)[0].index
        $field.prop("selectedIndex", index)
      },
      SEMANTIC_DROPDOWN: function($field, value) {
        $field.dropdown("set selected", value)
      }
    }
  }


  // ----------------------------------------------------------------------
  // Global Variables
  // ----------------------------------------------------------------------

  let Index      = -1
  let StyleSheet = _createStyleSheet()


  // ----------------------------------------------------------------------
  // Class Definition
  // ----------------------------------------------------------------------

  class Geocomplete {

    constructor(element, config) {
      if (typeof config === "string") {
        config = {}
      }
      config = $.extend(true, {}, $.fn[NAME].settings, config)

      this.element      = element
      this.fields       = _formatFieldIds(config.fields)
      this.index        = Index += 1
      this.obj          = new google.maps.places.Autocomplete(element, config)
      this.pacContainer = null

      // add event listenter to fill the fields when the place is changed
      this.obj.addListener(Event.PLACE_CHANGED, () => {
        this.fillfields()
      })

      // bias the search results based on the browser's geolocation
      if (config.geolocate) {
        _geoLocate(this.obj)
      }

      if (config.appendToParent) {

        // append the .pac-container to element's parent
        $(element).on(Event.FOCUS, function() {
          const $element = $(this)
          const geo      = $element.data(DATA_KEY)

          if (geo.pacContainer != null) {
            _appendContainer($element, geo.pacContainer)
            $element.off(Event.FOCUS)
          }
        })

        // delay function to ensure pac-container exists in DOM
        setTimeout(() => {
          this.pacContainer = $(".pac-container")[this.index]
        }, 1000)
      }
    }


    // --------------------------------------------------------------------
    // Public Methods
    // --------------------------------------------------------------------

    clearfields() {
      const fields  = this.fields
      for (let id in fields) {
        const $field = $(id)
        FieldFunctions.clear[_getFieldType($field)]($field)
      }

      return $(this.element)
    }

    fillfields() {
      this.clearfields()

      const fields       = this.fields
      const placeDetails = this.obj.getPlace()

      for (let id in fields) {
        let addressType   = fields[id].toLowerCase().replace(/\s+/g, "")
        const short       = addressType.indexOf("short") != -1
        addressType       = addressType.replace("short", "")
        const value       = AddressFunctions[addressType](placeDetails, short)
        const $field      = $(id)
        FieldFunctions.set[_getFieldType($field)]($field, value)
      }

      return $(this.element)
    }

    getbounds() {
      return this.obj.getBounds()
    }

    getplace() {
      return this.obj.getPlace()
    }

    setbounds(parms) {
      this.obj.setBounds(parms)
      return $(this.element)
    }

    setcomponentrestrictions(parms) {
      this.obj.setComponentRestrictions(parms)
      return $(this.element)
    }

    setoptions(parms) {
      this.obj.setOptions(parms)
      return $(this.element)
    }

    settypes(parms) {
      this.obj.setTypes(parms)
      return $(this.element)
    }


    // --------------------------------------------------------------------
    // Static Methods
    // --------------------------------------------------------------------

    static _jQueryInterface(config, parms) {
      const $element = $(this)
      let geo        = $element.data(DATA_KEY)

      if (!geo) {
        geo = new Geocomplete(this[0], config)
        $element.data(DATA_KEY, geo)
      }

      if (typeof config === "string") {
        let method = config.toLowerCase().replace(/\s+/g, "")

        if (geo[method] === undefined) {
          throw new Error(`No method named "${config}"`)
        }
        return geo[method](parms)
      }

      return this
    }

  }


  // ----------------------------------------------------------------------
  // Private Functions
  // ----------------------------------------------------------------------

  function _appendContainer($element, $pacContainer) {
    const left            = `${_calcLeftPosition($element)}px !important`
    const top             = `${_calcTopPosition($element)}px !important`
    $pacContainer.id      = `pac-container_${$element[0].id}`
    StyleSheet.innerHTML += `#${$pacContainer.id}{top:${top}; left:${left};}`

    $element.parent()
      .css({position: "relative"})
      .append($pacContainer)
  }

  function _calcLeftPosition($element) {
    const element_left = $element.offset().left
    const parent_left  = $element.parent().offset().left

    return element_left - parent_left
  }

  function _calcTopPosition($element) {
    const element_top    = $element.offset().top
    const element_height = $element.outerHeight()
    const parent_top     = $element.parent().offset().top

    return element_top - parent_top + element_height
  }

  function _createStyleSheet() {
    const style = document.createElement("style")
    style.type = "text/css"
    $("head")[0].appendChild(style)
    return style
  }

  function _formatFieldIds(fields) {
    for (var id in fields) {
      if (id.substring(0, 1) != "#") {
        fields["#" + id] = fields[id]
        delete fields[id]
      }
    }
    return fields
  }

  function _geoLocate(obj) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const circle = new google.maps.Circle({
          center: { lat: position.coords.latitude, lng: position.coords.longitude },
          radius: position.coords.accuracy
        })

        obj.setBounds(circle.getBounds())
      })
    }
  }

  function _getAddressValue(parms) {
    const placeAddress = parms.placeAddress || []
    const name         = parms.name
    const type         = parms.type

    const i = placeAddress.map(function(address) {
      return address.types[0] == type
    }).indexOf(true)

    return (i != -1) ? placeAddress[i][name] : ""
  }

  function _getFieldType($field) {
    return _isSemanticDropdown($field) ? "SEMANTIC_DROPDOWN" : $field.prop("nodeName")
  }

  function _isSemanticDropdown($field) {
    const $parent = $field.parent()

    if (($field.hasClass("ui") && $field.hasClass("dropdown")) ||
        ($parent.hasClass("ui") && $parent.hasClass("dropdown"))) {
      return true
    }
    return false
  }


  // ------------------------------------------------------------------------
  // jQuery
  // ------------------------------------------------------------------------

  $.fn[NAME]             = Geocomplete._jQueryInterface
  $.fn[NAME].Constructor = Geocomplete
  $.fn[NAME].settings    = Settings


  return $
})(window.jQuery || window.$)
