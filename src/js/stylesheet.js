// ----------------------------------------------------------------------
// Class Definition
// ----------------------------------------------------------------------

class StyleSheet {
  constructor() {
    this.styleSheet = document.createElement('style')
    this.styleSheet.type = 'text/css'
    document.head.appendChild(this.styleSheet)
  }

  // --------------------------------------------------------------------
  // Public Methods
  // --------------------------------------------------------------------

  addCSS(css) {
    this.styleSheet.innerHTML += css
  }
}

export { StyleSheet }
