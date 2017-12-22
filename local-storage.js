/**
 * Created by yhy on 2017/12/22.
 */

export default class LocalStorage {
  static storage = window.localStorage
  static support() {
    if (!window.localStorage) {
      return false
    }

    return true
  }

  static get(key) {
    if (!this.support()) {
      return
    }
    let item = this.storage.getItem(key)
    if (item) {
      return JSON.parse(this.storage.getItem(key))
    }
    return
  }

  static set(key, val) {
    if (!this.support()) {
      return
    }
    this.storage.setItem(key, JSON.stringify(val))
  }

  static remove(key) {
    if (!this.support()) {
      return
    }

    this.storage.removeItem(key)
  }
}