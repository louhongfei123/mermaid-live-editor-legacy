import { createLogic } from 'redux-logic'
import axios from 'axios'

import { setState, setProp } from './actions'

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
    let mermaidError = null
    window.mermaid.parseError = (error, hash) => {
      mermaidError = error
    }
    const value = getState().value
    if (window.mermaid.parse(value) || mermaidError === null) {
      dispatch(setProp('error', false))
      const element = action.mermaidContainer
      element.removeAttribute('data-processed')
      element.innerHTML = value
      window.mermaid.init(undefined, element)
    } else {
      dispatch(setProp('error', mermaidError))
    }
    done()
  }
})

export default [
  loadStateLogic,
  renderMermaidLogic
]
