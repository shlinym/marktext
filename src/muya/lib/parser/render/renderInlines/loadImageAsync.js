import { getUniqueId, loadImage } from '../../../utils'
import { insertAfter, operateClassName } from '../../../utils/domManipulate'
import { CLASS_OR_ID } from '../../../config'

export default function loadImageAsync (imageInfo, alt, className, imageClass) {
  var { src } = imageInfo
  const { isUnknownType } = imageInfo
  let id
  let isSuccess
  var nodeConsole = require('console')
  var myConsole = new nodeConsole.Console(process.stdout, process.stderr)

  myConsole.log('0000' + this.muya.options.imageFoldPath)
  if (!this.loadImageMap.has(src)) {
    myConsole.log('aaload without path + ' + src)
    id = getUniqueId()
    loadImage(src, isUnknownType)
      .then(url => {
        const imageText = document.querySelector(`#${id}`)
        const img = document.createElement('img')
        img.src = url
        if (alt) img.alt = alt.replace(/[`*{}[\]()#+\-.!_>~:|<>$]/g, '')
        if (imageClass) {
          img.classList.add(imageClass)
        }

        if (imageText) {
          if (imageText.classList.contains('ag-inline-image')) {
            const imageContainer = imageText.querySelector('.ag-image-container')
            const oldImage = imageContainer.querySelector('img')
            if (oldImage) {
              oldImage.remove()
            }
            imageContainer.appendChild(img)
            imageText.classList.remove('ag-image-loading')
            imageText.classList.add('ag-image-success')
          } else {
            insertAfter(img, imageText)
            operateClassName(imageText, 'add', className)
          }
        }
        if (this.urlMap.has(src)) {
          this.urlMap.delete(src)
        }
        this.loadImageMap.set(src, {
          id,
          isSuccess: true
        })
      })
      .catch(() => {
        const imageText = document.querySelector(`#${id}`)
        if (imageText) {
          operateClassName(imageText, 'remove', CLASS_OR_ID.AG_IMAGE_LOADING)
          operateClassName(imageText, 'add', CLASS_OR_ID.AG_IMAGE_FAIL)
          const image = imageText.querySelector('img')
          if (image) {
            image.remove()
          }
        }
        if (this.urlMap.has(src)) {
          this.urlMap.delete(src)
        }
        this.loadImageMap.set(src, {
          id,
          isSuccess: false
        })
      })
  } else {
    // src = 'file:///Users/lin/tmp/test/assert/' + src
    // src = 'file:///Users/shlin/tmp/test/assert/2019-09-10-00-37-52-image.png'
    myConsole.log('load without path + ' + src)
    const imageInfo = this.loadImageMap.get(src)
    myConsole.log(imageInfo)
    id = imageInfo.id
    isSuccess = imageInfo.isSuccess
  }

  return { id, isSuccess }
}
