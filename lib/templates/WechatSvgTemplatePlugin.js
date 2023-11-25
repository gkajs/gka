/**
 * GKA (generate keyframes animation)
 * author: joeyguo
 * HomePage: https://github.com/joeyguo/gka
 * MIT Licensed.
 *
 * gka wechat-svg template (Writtien by Frankie)
 */

const gkaUtils = require('../packages/gka-utils')

module.exports = class SvgTemplatePlugin {
  constructor() {}
  apply(compiler) {
    compiler.hooks.on('templateOptions', (context, next) => {
      // wechat-svg template do not support split/diff/crop/ratio/minirate
      context.options.split = false
      context.options.diff = false
      context.options.crop = false
      context.options.ratio = false
      context.options.minirate = false

      // 只支持 top-down 模式，left-right 模式有可能导致图片上传公众号后被压缩
      if (context.options.sprites) context.options.algorithm = 'top-down'

      next(context)
    })

    compiler.hooks.on('template', (context, next) => {
      const { options, data } = context

      function run(data, opts, key) {
        const name = (key ? key + '-' : '') + 'gka'
        const htmlName = name + '.html'
        context.assets[htmlName] = html(data, opts)
      }

      run(data[0], options)

      // 对每个子目录都进行处理
      gkaUtils._.effectSubFolderSync(run, data[0], options)

      next(context)
    })
  }
}

function html(data, opts) {
  const width = data.frames[0].sourceW || data.frames[0].width
  const height = data.frames[0].sourceH || data.frames[0].height
  const html = gkaUtils.html.getHtmlWrap(opts)

  html.includeBodyContent(`
    ${gkaUtils.html.getChangeWidthHTML('    ', width)}
    <svg id="container" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="width: ${width}px">
        ${opts.sprites ? createAnimateTransformBySprites(data, opts) : createAnimateTransform(data, opts)}
    </svg>`)

  return html + ''
}

function createAnimateTransform(data, opts) {
  const { frames } = data
  const { frameduration } = opts

  const duration = (frameduration * frames.length).toFixed(6)
  const repeatIndexs = []
  let prevKeyTime = 0 // 作为下一个的起点，以适配 --unique true 的情况

  const getValues = (frames, index) => {
    if (index === 0) return '1; 0; 0'
    if (index === frames.length - 1) return '0; 1; 0'
    return '0; 1; 0; 0'
  }

  const getKeyTimes = (frames, index) => {
    const keyTime = ((index * frameduration) / duration).toFixed(6)
    const nextKeyTime = (((index + 1) * frameduration) / duration).toFixed(6)

    if (index === 0) {
      prevKeyTime = nextKeyTime
      return `0; ${nextKeyTime}; 1`
    }

    if (index === frames.length - 1) {
      prevKeyTime = nextKeyTime
      return `0; ${keyTime}; 1`
    }

    let keyTimes = `0; ${prevKeyTime}; ${nextKeyTime}; 1`
    prevKeyTime = nextKeyTime
    return keyTimes
  }

  const foreignObjectList = frames
    .map((frame, index) => {
      if (index > 0 && frame.file === frames[index - 1].file) repeatIndexs.push(index)
      return frame
    })
    .map((frame, index) => {
      if (repeatIndexs.includes(index)) return ''

      const width = frame.sourceW || frame.width
      const height = frame.sourceH || frame.height
      const imgPath = './img/' + frame.file

      const values = getValues(frames, index)
      const keyTimes = getKeyTimes(frames, index)

      return `
        <foreignObject x="0" y="0" width="${width}" height="${height}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMin meet" style="width: 100%; opacity: 0; background-size: cover; background-position: left top; background-repeat: no-repeat; background-image: url(${imgPath})">
                <animate attributeName="opacity" begin="0s" dur="${duration}s" values="${values}" keyTimes="${keyTimes}" calcMode="discrete" repeatCount="indefinite" fill="freeze" restart="always" />
            </svg>
        </foreignObject>`
    })

  return foreignObjectList.join('').trim()
}

function createAnimateTransformBySprites(data, opts) {
  const { frames } = data
  const { frameduration } = opts

  const width = frames[0].sourceW || frames[0].width
  const duration = (frameduration * frames.length).toFixed(6)
  const imgName = gkaUtils.data.getImageNames(data)[0]
  const imgPath = './img/' + imgName
  const spriteImgHeight = frames[0].h

  const repeatIndexs = []

  const values = frames
    .map((frame, index) => {
      if (index === 0) return '0 0'
      const value = `0 -${frame.y}`
      if (index === frames.length - 1) return [value, value]
      return value
    })
    .flat()
    .filter((value, index, arr) => {
      if (index === 0 || index === arr.length - 1) return true
      if (value === arr[index - 1]) {
        // 针对启用 --unique 时过滤重复项
        repeatIndexs.push(index)
        return false
      }
      return true
    })
    .join('; ')

  const keyTimes = frames
    .map((_, index) => {
      const keyTime = ((index * frameduration) / duration).toFixed(6)
      if (index === frames.length - 1) return [keyTime, 1]
      return keyTime
    })
    .flat()
    .filter((_, index) => !repeatIndexs.includes(index))
    .join('; ')

  // prettier-ignore
  return `
        <g transform="translate(0 0)">
            <animateTransform
                attributeName="transform"
                type="translate"
                begin="0s"
                dur="${duration}s"
                values="${values}"
                keyTimes="${keyTimes}"
                calcMode="discrete"
                repeatCount="indefinite"
                fill="freeze"
                restart="never"
            />
            <foreignObject x="0" y="0" width="${width}" height="${spriteImgHeight}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${spriteImgHeight}" preserveAspectRatio="xMidYMin meet" style="width: 100%; background-size: cover; background-position: left top; background-repeat: no-repeat; background-image: url(${imgPath})"></svg>
            </foreignObject>
        </g>
    `.trim();
}