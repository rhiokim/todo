import os from 'os'
import path from 'path'
import low from 'lowdb'
import watch from 'node-watch'

import {CHANGE_STORAGE} from './constants/actionTypes'

const year = new Date().getFullYear()

const getKey = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const date = d.getDate()
  return `${month}/${date}`
}

export const getTodoState = (part = 'tasks') => {
  const db = getStorage()
  return db.get(`${part}/${getKey()}`).value()
}

export const loadState = () => {
  const db = getStorage()
  return db.get('config').value()
}

export const storageFilePath = () => {
  return path.join(os.homedir(), '.haroo', `${year}.json`)
}

export const getStorage = () => {
  return low(storageFilePath())
}

export const setWatcher = store => {
  watch(storageFilePath(), (e, name) => {
    const tasks = getTodoState('tasks')
    store.dispatch({
      type: CHANGE_STORAGE,
      tasks
    })
  })
}
