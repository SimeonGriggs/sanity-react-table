/* eslint-disable */
import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'
/* eslint-enable */

import artwork from './documents/artwork'
import artist from './documents/artist'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([artwork, artist]),
})
