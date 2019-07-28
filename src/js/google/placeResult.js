import * as Logger from '../logger'
import { lookup } from '../util/lookup'
import { getName, getType } from './addressComponent'
import { getFormats } from '../settings'

// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------

const Properties = {
  ADDRESS_COMPONENTS: 'address_components',
  ADR_ADDRESS: 'adr_address',
  ASPECTS: 'aspects',
  FORMATTED_ADDRESS: 'formatted_address',
  FORMATTED_PHONE_NUMBER: 'formatted_phone_number',
  GEOMETRY: 'geometry',
  HTML_ATTRIBUTIONS: 'html_attributions',
  ICON: 'icon',
  INTERNATIONAL_PHONE_NUMBER: 'international_phone_number',
  NAME: 'name',
  OPENING_HOURS: 'opening_hours',
  PERMANENTLY_CLOSED: 'permanently_closed',
  PHOTOS: 'photos',
  PLACE_ID: 'place_id',
  PLUS_CODE: 'plus_code',
  PRICE_LEVEL: 'price_level',
  RATING: 'rating',
  REVIEWS: 'reviews',
  TYPES: 'types',
  URL: 'url',
  USER_RATINGS_TOTAL: 'user_ratings_total',
  UTC_OFFSET: 'utc_offset',
  VICINITY: 'vicinity',
  WEBSITE: 'website',
}

// ----------------------------------------------------------------------
// Class Definition
// ----------------------------------------------------------------------

class PlaceResult {
  constructor(placeResult) {
    this.isEmpty = isEmptyResult(placeResult)
    this.timestamp = new Date().toString()

    if (!this.isEmpty)
      Object.values(Properties).forEach(prop => {
        this[prop] = placeResult[prop]
      })
  }

  // --------------------------------------------------------------------
  // Public Methods
  // --------------------------------------------------------------------

  getComponentValue(query) {
    const name = getName(query)
    const type = getType(query)

    const component = findAddressComponent({
      components: this[Properties.ADDRESS_COMPONENTS],
      type,
    })

    if (component == null) {
      Logger.logError(`${query} was not found in the results`)
      return ''
    }

    return component[name]
  }

  getFormatValue(query) {
    const format = lookupFormat(query)
    if (format != null) return format(this)
  }

  getPropertyValue(query) {
    const prop = lookupProperty(query)
    if (prop != null) return this[prop]
  }

  getLocation() {
    const geometry = this[Properties.GEOMETRY] || {}
    return geometry.location
  }

  getValue(query) {
    const format = lookupFormat(query)
    if (format != null) return format(this)

    const prop = lookupProperty(query)
    if (prop != null) return this[prop]

    return this.getComponentValue(query)
  }

  getViewport() {
    const geometry = this[Properties.GEOMETRY] || {}
    return geometry.viewport
  }
}

// ----------------------------------------------------------------------
// Private Functions
// ----------------------------------------------------------------------

function findAddressComponent({ components, type }) {
  return components.find(c => c.types[0] === type)
}

function isEmptyResult(placeResult) {
  return Object.keys(placeResult).length <= 1
}

function lookupFormat(query) {
  return lookup({ obj: getFormats(), query })
}

function lookupProperty(query) {
  return lookup({ obj: Properties, query })
}

export { PlaceResult }
