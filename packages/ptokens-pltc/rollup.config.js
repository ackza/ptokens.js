import pkg from './package.json'
import rollupConfig from '../../rollup.config'

export default rollupConfig('pLTC', pkg.name, {
  'ptokens-node-selector': 'ptokens-node-selector',
  'ptokens-node': 'ptokens-node',
  'ptokens-utils': 'ptokens-utils'
})
