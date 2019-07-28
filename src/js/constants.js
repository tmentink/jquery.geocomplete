const NAME = 'geocomplete'
const DATA_KEY = `gmap.${NAME}`
const EVENT_KEY = `.${DATA_KEY}`
const Events = {
  FOCUS: `focus${EVENT_KEY}`,
  PLACE_CHANGED: 'place_changed',
}

export { NAME, DATA_KEY, Events }
