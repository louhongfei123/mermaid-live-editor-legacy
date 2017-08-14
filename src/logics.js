import { createLogic } from 'redux-logic'
import axios from 'axios'

import { setState } from './actions'

const loadStateLogic = createLogic({
  type: 'LOAD_STATE',
  latest: true,
  async process ({ getState, action }, dispatch, done) {
    const res = await axios.get('/state.json')
    dispatch(setState(res.data))
    done()
  }
})

const renderMermaidLogic = createLogic({
  type: 'RENDER_MERMAID',
  debounce: 1000,
  latest: true,
  async process ({ getState, action }, dispatch, done) {
    console.log('render mermaid')
    const element = action.mermaidContainer
    element.removeAttribute('data-processed')
    element.innerHTML = getState().value
    window.mermaid.init(undefined, element)
    done()
  }
})

export default [
  loadStateLogic,
  renderMermaidLogic
]
