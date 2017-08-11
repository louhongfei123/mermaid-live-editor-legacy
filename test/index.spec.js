/* eslint-env jest */
import { Input } from 'antd'

import App from '../src/App'
import { getWrapper, defaultValue } from './shared'
import state from '../state.json'
import store from './store'

let wrapper = null
beforeEach(() => {
  wrapper = getWrapper(App, state)
})

test('load state', () => {
  return store.whenComplete(() => { // because it is async
    expect(store.actions).toEqual([
      { type: 'LOAD_STATE' },
      { type: 'SET_STATE', state: defaultValue }
    ])
    expect(store.getState()).toEqual(defaultValue)
  })
})

test('edit value', () => {
  const textArea = wrapper.find(Input.TextArea).first()
  const value = 'Hello world'
  textArea.props().onChange({ target: { value } })
  expect(textArea.props().value).toEqual(value)
  expect(store.getState().value).toEqual(value)
})
