import { ipcRenderer } from 'electron'
import { isSamePathSync } from 'common/filesystem/paths'
import bus from '../bus'
import { showReminderMenu } from '../contextMenu/sideBar'

export const tabsMixins = {
  methods: {
    selectFile (file) {
      if (file.id !== this.currentFile.id) {
        this.$store.dispatch('UPDATE_CURRENT_FILE', file)
      }
    },
    removeFileInTab (file) {
      const { isSaved } = file
      if (isSaved) {
        this.$store.dispatch('FORCE_CLOSE_TAB', file)
      } else {
        this.$store.dispatch('CLOSE_UNSAVED_TAB', file)
      }
    }
  }
}

export const loadingPageMixins = {
  methods: {
    hideLoadingPage () {
      const loadingPage = document.querySelector('#loading-page')
      if (loadingPage) {
        loadingPage.remove()
      }
    }
  }
}

export const fileMixins = {
  methods: {
    handleSearchResultClick (searchMatch) {
      const { range } = searchMatch
      const { filePath } = this.searchResult

      const openedTab = this.tabs.find(file => isSamePathSync(file.pathname, filePath))
      const cursor = {
        isCollapsed: range[0][0] !== range[1][0],
        anchor: {
          line: range[0][0],
          ch: range[0][1]
        },
        focus: {
          line: range[1][0],
          ch: range[1][1]
        }
      }

      var nodeConsole = require('console')
      var myConsole = new nodeConsole.Console(process.stdout, process.stderr)
      if (openedTab) {
        openedTab.cursor = cursor
        if (this.currentFile !== openedTab) {
          myConsole.log(openedTab.markdown)
          this.$store.dispatch('UPDATE_CURRENT_FILE', openedTab)
        } else {
          myConsole.log(this.currentFile.markdown)
          const { id, markdown, cursor, history } = this.currentFile
          bus.$emit('file-changed', { id, markdown, cursor, renderCursor: true, history })
        }
      } else {
        myConsole.log('fsfs')
        myConsole.log(this.currentFile.markdown)
        ipcRenderer.send('mt::open-file', filePath, {
          cursor
        })
        myConsole.log(this.currentFile.markdown)
      }
    },
    handleSearchResultMenu (event) {
      this.$store.dispatch('CHANGE_ACTIVE_ITEM', this.searchResult)
      // var { filename, matchCount } = this.searchResult
      showReminderMenu(event)
      var nodeConsole = require('console')
      var myConsole = new nodeConsole.Console(process.stdout, process.stderr)
      // myConsole.log(this.searchResult.matches.length)
      // this.searchResultatches.length = 'R'
      myConsole.log(this.searchResult.filePath)
      this.$nextTick(() => {
        // bus.$emit('SIDEBAR::refresh-review-result')
        // myConsole.log(this.searchResultInfo)
      })
    },
    handleFileClick () {
      const { isMarkdown, pathname } = this.file
      if (!isMarkdown) return
      const openedTab = this.tabs.find(file => isSamePathSync(file.pathname, pathname))
      if (openedTab) {
        if (this.currentFile === openedTab) {
          return
        }
        this.$store.dispatch('UPDATE_CURRENT_FILE', openedTab)
      } else {
        ipcRenderer.send('mt::open-file', pathname, {})
      }
    }
  }
}

export const createFileOrDirectoryMixins = {
  methods: {
    handleInputFocus () {
      this.$nextTick(() => {
        if (this.$refs.input) {
          this.$refs.input.focus()
          this.createName = ''
          if (this.folder) {
            this.folder.isCollapsed = false
          }
        }
      })
    },
    handleInputEnter () {
      const { createName } = this
      this.$store.dispatch('CREATE_FILE_DIRECTORY', createName)
    }
  }
}
