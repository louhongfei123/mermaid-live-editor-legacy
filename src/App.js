import React from 'react'
import { Row, Col, Input, Button } from 'antd'
import { connect } from 'react-redux'
import R from 'ramda'
import 'mermaid'
import 'mermaid/dist/mermaid.forest.css'
import moment from 'moment'

import { loadState, setProp, renderMermaid } from './actions'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.onDownloadSVG = this.onDownloadSVG.bind(this)
    this.onLinkToEdit = this.onLinkToEdit.bind(this)
    this.onLinkToView = this.onLinkToView.bind(this)
  }
  onDownloadSVG (event) {
    event.target.href = `data:image/png;base64,${window.btoa(this.mermaidContainer.innerHTML)}`
    event.target.download = `mermaid-diagram-${moment().format('YYYYMMDDHHmmss')}.svg`
  }
  onLinkToEdit (event) {
    event.target.href = `#${window.btoa(this.props.value)}`
  }
  onLinkToView (event) {
    event.target.href = `#/view/${window.btoa(this.props.value)}`
  }
  componentDidMount () {
    let hash = window.location.hash.substr(1)
    let value = false
    let view = false
    if (hash.length > 0) {
      if (hash.startsWith('/view/')) {
        hash = hash.substr(6)
        view = true
      }
      try {
        value = window.atob(hash)
      } catch (err) {
        console.error('The hash in URL is an invalid base64 string')
        value = ''
      }
    }
    this.props.loadState(value, view)
  }
  render () {
    console.log(`render App`)
    const { value, error, view, setProp } = this.props
    let content = ''
    if (error) {
      content = <pre>{error}</pre>
    } else {
      content = view ? null : <div>
        <div className='separator' />
        <Button><a href='' target='_blank' onClick={this.onLinkToView}>LINK TO VIEW</a></Button>
        <Button><a href='' onClick={this.onLinkToEdit}>LINK TO EDIT</a></Button>
        <Button><a href='' download='' onClick={this.onDownloadSVG}>DOWNLOAD SVG</a></Button>
      </div>
    }
    return view ? content : (
      <Row gutter={16}>
        <Col span={6}>
          <Input.TextArea rows={16} value={value} onChange={event => setProp('value', event.target.value)} />
        </Col>
        <Col span={18}>
          <div ref={div => { this.mermaidContainer = div }} className={error ? 'hidden' : null} />
          {content}
        </Col>
      </Row>
    )
  }
  componentDidUpdate () {
    this.props.renderMermaid(this.mermaidContainer)
  }
}

export default connect(R.pick(['value', 'error', 'view']), { loadState, setProp, renderMermaid })(App)
