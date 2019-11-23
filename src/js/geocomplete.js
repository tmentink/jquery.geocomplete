import * as Logger from './logger'
import * as Regex from './util/regex'
import { $ } from './jquery'
import { NAME, DATA_KEY, Events } from './constants'
import { Settings, Defaults, getExtendedSettings } from './settings'
import { isGoogleMap, isLatLng, isLatLngBounds } from './util/types'
import { Form } from './form'
import { StyleSheet } from './stylesheet'
import { Autocomplete } from './google/autocomplete'
import { PacContainer } from './google/pacContainer'
import { PlaceResult } from './google/placeResult'

// ----------------------------------------------------------------------
// Global Variables
// ----------------------------------------------------------------------

let Index = -1
const GlobalStyleSheet = new StyleSheet()

// ----------------------------------------------------------------------
// Class Definition
// ----------------------------------------------------------------------

class Geocomplete {
  constructor($element, userSettings) {
    const settings = getExtendedSettings(userSettings)

    this.$element = $element
    this.form = null
    this.index = Index += 1
    this.map = settings[Settings.MAP]
    this.placeResult = null
    this.styleSheet = GlobalStyleSheet

    // these need to be executed after the other props
    this.autocomplete = new Autocomplete(this, settings)
    this.pacContainer = new PacContainer(this, settings)
    if (settings[Settings.FORM_ID]) this.form = new Form(this, settings)

    // listen to place changed event
    this.autocomplete.addListener(Events.PLACE_CHANGED, () => {
      const { $element } = this
      const rawResult = this.getplace()

      if (this.placeResult.isEmpty)
        return settings[Settings.ON_NO_RESULT].call($element, rawResult.name)

      settings[Settings.ON_CHANGE].call($element, rawResult.name, rawResult)

      this.centermap()
      this.fillform()
    })

    // bias the search results based on the browser's geolocation
    if (settings[Settings.GEOLOCATE]) this.geolocate()
  }

  // --------------------------------------------------------------------
  // Public Methods
  // --------------------------------------------------------------------

  centermap(bounds) {
    if (this.map == null || !isGoogleMap(this.map)) return

    if (bounds == null) {
      if (this.placeResult == null) this.getplace()

      const location = this.placeResult.getLocation()
      const viewport = this.placeResult.getViewport()
      bounds = viewport || location
    }

    if (isLatLngBounds(bounds)) {
      this.map.fitBounds(bounds)
      return this.$element
    }

    if (isLatLng(bounds)) {
      this.map.setCenter(bounds)
      return this.$element
    }
  }

  clearform() {
    if (this.form == null) return

    return this.form.clear()
  }

  destroy() {
    this.$element.removeData(DATA_KEY)
    this.autocomplete.removeListeners()
  }

  fillform(placeResult) {
    if (this.form == null) return

    placeResult = placeResult || this.placeResult
    return this.form.fill(placeResult)
  }

  geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const circle = new window.google.maps.Circle({
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          radius: position.coords.accuracy,
        })

        this.autocomplete.setBounds(circle.getBounds())
      })
    }
  }

  getcachedplace() {
    return this.placeResult
  }

  getformvalues(query) {
    if (this.form == null) return

    return this.form.getValues(query)
  }

  // --------------------------------------------------------------------
  // Google Autocomplete Methods
  // --------------------------------------------------------------------

  getbounds() {
    return this.autocomplete.getBounds()
  }

  getfields() {
    return this.autocomplete.getFields()
  }

  getplace() {
    const rawResult = this.autocomplete.getPlace()
    this.placeResult = new PlaceResult(rawResult)
    return rawResult
  }

  setbounds(parms) {
    return this.autocomplete.setBounds(parms)
  }

  setcomponentrestrictions(parms) {
    return this.autocomplete.setComponentRestrictions(parms)
  }

  setfields(parms) {
    return this.autocomplete.setFields(parms)
  }

  setoptions(parms) {
    return this.autocomplete.setOptions(parms)
  }

  settypes(parms) {
    return this.autocomplete.setTypes(parms)
  }

  // --------------------------------------------------------------------
  // Static Methods
  // --------------------------------------------------------------------

  static _jQueryInterface(userSettings, parms) {
    const $element = $(this)
    let geo = $element.data(DATA_KEY)

    if (!geo) {
      geo = new Geocomplete($element, userSettings)
      $element.data(DATA_KEY, geo)
    }

    if (typeof userSettings === 'string') {
      const method = userSettings.toLowerCase().replace(Regex.SPACES, '')
      if (geo[method]) return geo[method](parms)

      Logger.logError(`"${userSettings}" is not a valid method`)
    }

    return this
  }
}

// ------------------------------------------------------------------------
// jQuery
// ------------------------------------------------------------------------

$.fn[NAME] = Geocomplete._jQueryInterface
$.fn[NAME].Constructor = Geocomplete
$.fn[NAME].settings = Defaults
