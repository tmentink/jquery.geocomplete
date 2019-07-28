import { Input } from './input'
import { Settings } from './settings'
import { isPlaceResult } from './util/types'
import { PlaceResult } from './google/placeResult'

// ----------------------------------------------------------------------
// Class Definition
// ----------------------------------------------------------------------

class Form {
  constructor(geocomplete, settings) {
    this.id = settings[Settings.FORM_ID]
    this.element = document.getElementById(this.id.replace('#', ''))
    this.geocomplete = geocomplete
    this.inputDataKey = settings[Settings.INPUT_DATA_KEY]
    this.inputs = []

    this.createInputs()
  }

  // --------------------------------------------------------------------
  // Public Methods
  // --------------------------------------------------------------------

  createInputs() {
    this.inputs = []

    const query = `[data-${this.inputDataKey}]`
    const inputElements = this.element.querySelectorAll(query)
    inputElements.forEach(element => {
      this.inputs.push(new Input({ element, form: this }))
    })
  }

  clear() {
    this.inputs.forEach(input => input.clear())
    return this.geocomplete.$element
  }

  fill(placeResult) {
    this.clear()

    if (!isPlaceResult(placeResult)) {
      placeResult = new PlaceResult(placeResult)
    }

    this.inputs.forEach(input => {
      const value = placeResult.getValue(input.dataKey)
      input.setValue(value)
    })

    return this.geocomplete.$element
  }

  getValues(query) {
    const values = {}
    this.inputs.forEach(input => {
      values[input.dataKey] = input.value
    })

    return query ? values[query] : values
  }
}

export { Form }
