import { NAME } from './constants'
import { $ } from './jquery'

// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------

const Settings = {
  APPEND_TO_PARENT: 'appendToParent',
  FORMATS: 'formats',
  FORM_ID: 'formId',
  GEOLOCATE: 'geolocate',
  INPUT_DATA_KEY: 'inputDataKey',
  MAP: 'map',
  ON_CHANGE: 'onChange',
  ON_NO_RESULT: 'onNoResult',
}

const Formats = {
  LAT(placeResult) {
    const location = placeResult.getLocation()
    return location.lat()
  },
  LAT_LNG(placeResult) {
    const location = placeResult.getLocation()
    return location.toUrlValue()
  },
  LNG(placeResult) {
    const location = placeResult.getLocation()
    return location.lng()
  },
  STREET_ADDRESS(placeResult) {
    const streetNumber = placeResult.getComponentValue('street number')
    const street = placeResult.getComponentValue('street')

    return `${streetNumber} ${street}`
  },
}

const Defaults = {
  [Settings.APPEND_TO_PARENT]: true,
  [Settings.FORMATS]: Formats,
  [Settings.FORM_ID]: null,
  [Settings.GEOLOCATE]: false,
  [Settings.INPUT_DATA_KEY]: 'geocomplete',
  [Settings.MAP]: null,

  // Callbacks
  [Settings.ON_CHANGE]() {},
  [Settings.ON_NO_RESULT]() {},
}

// ----------------------------------------------------------------------
// Public Functions
// ----------------------------------------------------------------------

const getExtendedSettings = function(userSettings) {
  const localSettings = $.fn[NAME].settings

  if (typeof userSettings === 'string') userSettings = {}

  return $.extend(true, {}, Defaults, localSettings, userSettings)
}

const getFormats = function() {
  return $.fn[NAME].settings[Settings.FORMATS]
}

export { Settings, Defaults, getExtendedSettings, getFormats }
