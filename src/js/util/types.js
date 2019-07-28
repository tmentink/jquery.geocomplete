import { PlaceResult } from '../google/placeResult'

const isGoogleMap = function(val) {
  return val instanceof window.google.maps.Map
}
const isLatLng = function(val) {
  return val instanceof window.google.maps.LatLng
}
const isLatLngBounds = function(val) {
  return val instanceof window.google.maps.LatLngBounds
}
const isPlaceResult = function(val) {
  return val instanceof PlaceResult
}

export { isGoogleMap, isLatLng, isLatLngBounds, isPlaceResult }
