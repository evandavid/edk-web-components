import React from 'react';
import ReactDOM from 'react-dom';

export class Portal extends React.Component<{ selector: string }> {
  private element: any

  componentDidMount() {
    this.element =
      typeof document !== undefined &&
      document.querySelector(this.props.selector)
    this.forceUpdate()
  }

  render() {
    if (this.element === undefined) {
      return null
    }

    return ReactDOM.createPortal(this.props.children, this.element)
  }
}
