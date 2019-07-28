import { $ } from './jquery'

// ----------------------------------------------------------------------
// Class Definition
// ----------------------------------------------------------------------

class Input {
  constructor({ element, form }) {
    const { inputDataKey } = form

    this.$element = $(element)
    this.dataKey = this.$element.data(inputDataKey)
    this.element = element
    this.form = form
    this.type = getType(element)
    this.value = null
  }

  // --------------------------------------------------------------------
  // Public Methods
  // --------------------------------------------------------------------

  clear() {
    const Types = {
      INPUT: () => {
        this.$element.val('')
      },
      SELECT: () => {
        this.$element.val('')
      },
      SEMANTIC_DROPDOWN: () => {
        this.$element.dropdown('clear')
      },
    }

    this.value = null
    return Types[this.type]()
  }

  setValue(value) {
    const Types = {
      INPUT: value => {
        this.$element.val(value)
      },
      SELECT: value => {
        const index = $(`option:contains(${value})`, this.$element)[0].index
        this.$element.prop('selectedIndex', index)
      },
      SEMANTIC_DROPDOWN: value => {
        this.$element.dropdown('set selected', value)
      },
    }

    this.value = value
    return Types[this.type](value)
  }
}

// ----------------------------------------------------------------------
// Private Functions
// ----------------------------------------------------------------------

function getType(element) {
  return isSemanticDropdown(element) ? 'SEMANTIC_DROPDOWN' : element.nodeName
}

function isSemanticDropdown(element) {
  const eClasses = element.classList
  const pClasses = element.parentElement.classList

  return (
    (eClasses.contains('ui') && eClasses.contains('dropdown')) ||
    (pClasses.contains('ui') && pClasses.contains('dropdown'))
  )
}

export { Input }
