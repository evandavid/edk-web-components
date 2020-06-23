import { uniqueId } from 'lodash';
import { createElement } from 'react';
import ReactDOM from 'react-dom';

import { IAlertShow, ModAlertWeb } from './platform/web';

interface IAlert {
  show: (params: IAlertShow) => void
}

export const EDKAlert: IAlert = {
  show: (params: IAlertShow) => {
    const getElement: any = () => {
      return createElement(ModAlertWeb, { ...params, key: uniqueId() })
    }

    typeof window !== 'undefined' &&
      ReactDOM.render(getElement(), document.getElementById('alerts'))
  }
}
