import pkg from './package.json'
import rollupConfig from '../../rollup.config'

export default rollupConfig('Node', pkg.name, {
  'ptokens-utils': 'ptokens-utils',
  'ptokens-providers': 'ptokens-providers'
})
