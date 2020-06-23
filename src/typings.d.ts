/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.json' {
  const value: any
  export default value
}

interface SvgrComponent
  extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module '*.svg' {
  const svgUrl: string
  const svgComponent: SvgrComponent
  export default svgUrl
  export { svgComponent as ReactComponent }
}

declare module '@material/menu'
declare module '@material/react-material-icon'
declare module 'd3-shape'
declare module 'd3-scale'
declare module 'window'
declare module 'svg-path-properties'
declare module 'react-spring'
declare module 'react-resize-detector'
declare module 'flubber'
declare module 'react-spring/web.cjs'
declare module 'lottie-web'
declare module 'fuse.js'
declare module 'mime-types'
declare module 'dot-object'
