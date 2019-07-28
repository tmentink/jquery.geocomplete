// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------

const Options = {
  BOUNDS: 'bounds',
  COMPONENT_RESTRICTIONS: 'componentRestrictions',
  FIELDS: 'fields',
  PLACE_ID_ONLY: 'placeIdOnly',
  STRICT_BOUNDS: 'strictBounds',
  TYPES: 'types',
}

// ----------------------------------------------------------------------
// Class Definition
// ----------------------------------------------------------------------

class Autocomplete {
  constructor(geocomplete, settings) {
    const options = getOptions(settings)

    this.$element = geocomplete.$element
    this.eventListeners = []
    this.geocomplete = geocomplete
    this.obj = new window.google.maps.places.Autocomplete(
      this.$element[0],
      options
    )
  }

  // --------------------------------------------------------------------
  // Public Methods
  // --------------------------------------------------------------------

  addListener(eventName, handler) {
    const listener = this.obj.addListener(eventName, handler)
    this.eventListeners.push(listener)
    return listener
  }

  getBounds() {
    return this.obj.getBounds()
  }

  getFields() {
    return this.obj.getFields()
  }

  getPlace() {
    return this.obj.getPlace()
  }

  removeListeners() {
    this.eventListeners.forEach(e => e.remove())
    return this.$element
  }

  setBounds(parms) {
    this.obj.setBounds(parms)
    return this.$element
  }

  setComponentRestrictions(parms) {
    this.obj.setComponentRestrictions(parms)
    return this.$element
  }

  setFields(parms) {
    this.obj.setFields(parms)
    return this.$element
  }

  setOptions(parms) {
    this.obj.setOptions(parms)
    return this.$element
  }

  setTypes(parms) {
    this.obj.setTypes(parms)
    return this.$element
  }
}

// ----------------------------------------------------------------------
// Private Functions
// ----------------------------------------------------------------------

function getOptions(settings) {
  const options = {}
  const AutocompleteOptions = Object.values(Options)

  Object.keys(settings).forEach(key => {
    if (AutocompleteOptions.indexOf(key) !== -1) {
      options[key] = settings[key]
    }
  })

  return options
}

export { Autocomplete }
