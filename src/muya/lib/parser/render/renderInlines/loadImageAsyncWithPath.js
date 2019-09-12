import { getUniqueId, loadImage } from '../../../utils'
import { insertAfter, operateClassName } from '../../../utils/domManipulate'
// import { CLASS_OR_ID } from '../../../config'

export default function loadImageAsyncWithPath (imageFolderPath, imageInfo, alt, className, imageClass) {
  var { src } = imageInfo
  const { isUnknownType } = imageInfo
  let id
  let isSuccess
  var nodeConsole = require('console')
  var myConsole = new nodeConsole.Console(process.stdout, process.stderr)

  myConsole.log('fuck0000' + imageFolderPath)
  var patt = /\/\d.*\.png/
  var imageName
  if (patt.test(src)) {
    imageName = patt.exec(src)[0].substring(1)
    // src = imageName.substring(1)
    src = 'file://' + imageFolderPath + '/' + imageName
    myConsole.log('image name :' + src)
  } else {
    imageName = src
    src = 'file://' + imageFolderPath + '/' + src
  }
  // src = 'file://' + imageFolderPath + '/' + src

  if (!this.loadImageMap.has(src)) {
    id = getUniqueId()
    myConsole.log('try to load iamge: ' + id)
    // loadImage('file://' + imageFolderPath + '/' + src, isUnknownType)
    loadImage(src, isUnknownType)
      .then(url => {
        const imageText = document.querySelector(`#${id}`)
        const img = document.createElement('img')
        img.src = url
        if (alt) img.alt = alt.replace(/[`*{}[\]()#+\-.!_>~:|<>$]/g, '')
        if (imageClass) {
          img.classList.add(imageClass)
        }

        myConsole.log('stage1')
        if (imageText) {
          myConsole.log('stage2')
          if (imageText.classList.contains('ag-inline-image')) {
            myConsole.log('stage3')
            const imageContainer = imageText.querySelector('.ag-image-container')
            const oldImage = imageContainer.querySelector('img')
            if (oldImage) {
              oldImage.remove()
            }
            imageContainer.appendChild(img)
            imageText.classList.remove('ag-image-loading')
            imageText.classList.add('ag-image-success')

            this.urlMap.set(imageName, src)
          } else {
            myConsole.log('stage4')
            insertAfter(img, imageText)
            operateClassName(imageText, 'add', className)
          }
        }
        if (this.urlMap.has(src)) {
          myConsole.log('try to delete urlmap')
          this.urlMap.delete(src)
        }
        this.loadImageMap.set(src, {
          id,
          isSuccess: true
        })
      })
      .catch((error) => {
        // const imageText = document.querySelector(`#${id}`)
        myConsole.log('stage5' + error)
        // if (imageText) {
        //   operateClassName(imageText, 'remove', CLASS_OR_ID.AG_IMAGE_LOADING)
        //   operateClassName(imageText, 'add', CLASS_OR_ID.AG_IMAGE_FAIL)
        //   const image = imageText.querySelector('img')
        //   if (image) {
        //     image.remove()
        //   }
        // }
        // if (this.urlMap.has(src)) {
        //   this.urlMap.delete(src)
        // }
        // this.loadImageMap.set(src, {
        //   id,
        //   isSuccess: false
        // })
      })
  } else {
    myConsole.log('stage6 : ' + src)
    myConsole.log('load image map:' + [...this.loadImageMap.keys()])
    myConsole.log('load map:' + [...this.urlMap.keys()])
    const imageInfo = this.loadImageMap.get(src)
    myConsole.log(imageInfo)
    id = imageInfo.id
    isSuccess = imageInfo.isSuccess
  }

  myConsole.log('id ' + id)
  myConsole.log('succ ' + isSuccess)
  return { id, isSuccess }
}
