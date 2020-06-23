import React from 'react';

import NotchedOutline from '@material/react-notched-outline';
import TextField from '@material/react-text-field';

class MDTTextField extends TextField {
  renderNotchedOutline() {
    const { notchedOutlineClassName, required } = this.props
    const { notchedLabelWidth, outlineIsNotched } = this.state
    let maskingWidh = notchedLabelWidth

    if (this.floatingLabelElement.current && typeof window !== undefined) {
      const calculateWidth = (txt: string) => {
        const cnvs = document.createElement('canvas')
        const context: any = cnvs.getContext('2d')
        context.font = '13px Open Sans'
        let textWidth = Math.round(context.measureText(txt).width + 6)

        return required ? textWidth + 6 : textWidth
      }

      const labelElement: any = this.floatingLabelElement.current.labelElement
        .current
      const labelWidth = calculateWidth(labelElement.innerHTML)
      if (labelWidth) maskingWidh = labelWidth
    }
    return (
      <NotchedOutline
        className={notchedOutlineClassName}
        notchWidth={maskingWidh}
        notch={outlineIsNotched}
      >
        {this.labelAdapter.hasLabel() ? this.renderLabel() : null}
      </NotchedOutline>
    )
  }
}

export default React.memo(MDTTextField)
