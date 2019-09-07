import { remote } from 'electron'
import {
  SEPARATOR,
  NEW_FILE,
  NEW_DIRECTORY,
  COPY,
  CUT,
  PASTE,
  RENAME,
  DELETE,
  SHOW_IN_FOLDER,
  REVIEWED,
  REVIEW_LATER,
  START_REVIEW
} from './menuItems'

const { Menu, MenuItem } = remote

export const showContextMenu = (event, hasPathCache) => {
  const menu = new Menu()
  const win = remote.getCurrentWindow()
  const CONTEXT_ITEMS = [
    NEW_FILE,
    NEW_DIRECTORY,
    SEPARATOR,
    COPY,
    CUT,
    PASTE,
    SEPARATOR,
    RENAME,
    DELETE,
    SEPARATOR,
    SHOW_IN_FOLDER,
    START_REVIEW
  ]

  PASTE.enabled = hasPathCache

  CONTEXT_ITEMS.forEach(item => {
    menu.append(new MenuItem(item))
  })
  menu.popup({ window: win, x: event.clientX, y: event.clientY })
}

export const showReminderMenu = (event) => {
  const menu = new Menu()
  const win = remote.getCurrentWindow()
  const CONTEXT_ITEMS = [
    REVIEWED,
    REVIEW_LATER,
    START_REVIEW
  ]

  CONTEXT_ITEMS.forEach(item => {
    menu.append(new MenuItem(item))
  })
  menu.popup({ window: win, x: event.clientX, y: event.clientY })
}
