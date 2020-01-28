import createStore from 'unistore';

const Store = createStore({
  wateredTrees: [],
  includedTrees: {},
  adoptedTrees: [],
  data: null,
  local: false,
  selectedTree: null,
  endpoints: {
    local: 'http://localhost:3000/',
    prod: 'https://trees-express-now.fabiandinklage.now.sh',
  },
  tabActive: 'id-0',
  selectedTree: false,
  selectedTreeState: false,
  isLoading: true,
  hoveredObject: false,
  viewport: {
    latitude: 52.500869,
    longitude: 13.419047,
    zoom: 16,
    maxZoom: 19,
    minZoom: 9,
    pitch: 45,
    bearing: 0
  },
})

export default Store;