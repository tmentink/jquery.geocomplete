import * as Regex from '../util/regex'
import { lookup } from '../util/lookup'

// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------

const Properties = {
  LONG_NAME: 'long_name',
  SHORT_NAME: 'short_name',
  TYPES: 'types',
}

const Types = {
  ADMINISTRATIVE_AREA_LEVEL_1: 'administrative_area_level_1',
  ADMINISTRATIVE_AREA_LEVEL_2: 'administrative_area_level_2',
  ADMINISTRATIVE_AREA_LEVEL_3: 'administrative_area_level_3',
  ADMINISTRATIVE_AREA_LEVEL_4: 'administrative_area_level_4',
  ADMINISTRATIVE_AREA_LEVEL_5: 'administrative_area_level_5',
  AIRPORT: 'airport',
  COLLOQUIAL_AREA: 'colloquial_area',
  COUNTRY: 'country',
  INTERSECTION: 'intersection',
  LOCALITY: 'locality',
  NATURAL_FEATURE: 'natural_feature',
  NEIGHBORHOOD: 'neighborhood',
  PARK: 'park',
  POINT_OF_INTEREST: 'point_of_interest',
  POLITICAL: 'political',
  POSTAL_CODE: 'postal_code',
  POSTAL_CODE_SUFFIX: 'postal_code_suffix',
  PREMISE: 'premise',
  ROUTE: 'route',
  STREET_NUMBER: 'street_number',
  SUBLOCALITY: 'sublocality',
  SUBPREMISE: 'subpremise',
}

const TypeAliases = {
  CITY: Types.LOCALITY,
  COUNTY: Types.ADMINISTRATIVE_AREA_LEVEL_2,
  STATE: Types.ADMINISTRATIVE_AREA_LEVEL_1,
  STREET: Types.ROUTE,
  ZIP_CODE: Types.POSTAL_CODE,
  ZIP_CODE_SUFFIX: Types.POSTAL_CODE_SUFFIX,
}

// ----------------------------------------------------------------------
// Public Functions
// ----------------------------------------------------------------------

const getName = function(addressType) {
  const formatted = addressType.toLowerCase().replace(Regex.SPACES, '')
  const isShort = formatted.indexOf('short') !== -1

  return isShort ? Properties.SHORT_NAME : Properties.LONG_NAME
}

const getType = function(addressType) {
  const formatted = addressType
    .toLowerCase()
    .replace('short', '')
    .replace(Regex.SPACES_AND_UNDERSCORES, '')

  let value = lookupTypeAlias(formatted)
  if (value == null) value = lookupType(formatted)

  return value
}

// ----------------------------------------------------------------------
// Private Functions
// ----------------------------------------------------------------------

function lookupType(query) {
  return lookup({ obj: Types, query })
}

function lookupTypeAlias(query) {
  return lookup({ obj: TypeAliases, query })
}

export { getName, getType }
