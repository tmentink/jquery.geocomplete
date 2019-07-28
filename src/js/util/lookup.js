import * as Regex from './regex'

const lookup = function({ obj, query }) {
  query = query.toLowerCase().replace(Regex.SPACES_AND_UNDERSCORES, '')

  const key = Object.keys(obj).find(k => {
    k = k.toLowerCase().replace(Regex.SPACES_AND_UNDERSCORES, '')
    return k === query
  })

  return obj[key]
}

export { lookup }
