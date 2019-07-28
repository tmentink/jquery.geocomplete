import { Settings } from '../settings'
import { Events } from '../constants'

// ----------------------------------------------------------------------
// Class Definition
// ----------------------------------------------------------------------

class PacContainer {
  constructor(geocomplete, settings) {
    this.element = null
    this.geocomplete = geocomplete
    this.styleSheet = geocomplete.styleSheet

    if (settings[Settings.APPEND_TO_PARENT]) {
      const { $element: $geo, index } = this.geocomplete

      $geo.on(Events.FOCUS, () => {
        this.element = document.getElementsByClassName('pac-container')[index]

        if (this.element != null) {
          appendToParent({
            $geo,
            element: this.element,
            styleSheet: this.styleSheet,
          })

          $geo.off(Events.FOCUS)
        }
      })
    }
  }
}

// ----------------------------------------------------------------------
// Private Functions
// ----------------------------------------------------------------------

function appendToParent({ $geo, element, styleSheet }) {
  const left = `${calcLeftPosition($geo)}px !important`
  const top = `${calcTopPosition($geo)}px !important`
  element.id = `pac-container_${$geo[0].id}`

  styleSheet.addCSS(`#${element.id}{top:${top}; left:${left};}`)
  $geo
    .parent()
    .css({ position: 'relative' })
    .append(element)
}

function calcLeftPosition($geo) {
  const element_left = $geo.offset().left
  const parent_left = $geo.parent().offset().left

  return element_left - parent_left
}

function calcTopPosition($geo) {
  const element_top = $geo.offset().top
  const element_height = $geo.outerHeight()
  const parent_top = $geo.parent().offset().top

  return element_top - parent_top + element_height
}

export { PacContainer }
