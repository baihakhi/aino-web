import axios from 'axios'

import { Http } from './http.init'
import { ResponseWrapper, ErrorWrapper } from './util'
import $store from '../store'
import $router from '../router'

import { API_AUTH } from '../.env'

let BEARER = ''

export class AuthService {
  /**
   ******************************
   * @API
   ******************************
   */

  static async makeRegister ({ nama, mail, pass }) {
    try {
      const customConfig = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const user = JSON.stringify({ name: nama, email: mail, password: pass })
      const response = await axios.post(`${API_AUTH}/auth/register`, user, customConfig)
      return new ResponseWrapper(response, response.data)
    } catch (error) {
      throw new ErrorWrapper(error)
    }
  }

  static async makeLogin ({ email, password }) {
    try {
      const response = await axios.post(`${API_AUTH}/auth/login`,
        { email, password })
      _setAuthData({
        accessToken: response.data.data.token,
        exp: response.data.data.expired_at
      })
      const user = { id: '1', email: email }
      $store.commit('user/SET_CURRENT_USER', user)

      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      throw new ErrorWrapper(error)
    }
  }

  static async makeLogout () {
    try {
      const response = await new Http({ auth: true }).post('auth/logout', {}, { withCredentials: true })
      _resetAuthData()
      $router.push({ name: 'login' }).catch(() => {})
      return new ResponseWrapper(response, response.data.data)
    } catch (error) {
      throw new ErrorWrapper(error)
    }
  }

  /**
   ******************************
   * @METHODS
   ******************************
   */

  static isAccessTokenExpired () {
    const accessTokenExpDate = $store.state.auth.accessTokenExpDate - 10
    const nowTime = Math.floor(new Date().getTime() / 1000)

    return accessTokenExpDate <= nowTime
  }

  static hasRefreshToken () {
    return Boolean(localStorage.getItem('refreshToken'))
  }

  static setRefreshToken (status) {
    if (!['', 'true'].includes(status)) {
      throw new Error(`setRefreshToken: invalid value ${status}; Expect one of ['', 'true']`)
    }

    localStorage.setItem('refreshToken', status)
  }

  static getBearer () {
    return BEARER
  }

  static setBearer (accessToken) {
    BEARER = `Bearer ${accessToken}`
  }

  /**
   * https://stackoverflow.com/questions/35228052/debounce-function-implemented-with-promises
   * @param inner
   * @param ms
   * @returns {function(...[*]): Promise<unknown>}
   * @private
   */
  static _debounce (inner, ms = 0) {
    let timer = null
    let resolves = []

    return function () {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const result = inner()
        resolves.forEach(r => r(result))
        resolves = []
      }, ms)

      return new Promise(resolve => resolves.push(resolve))
    }
  }
}

/**
 ******************************
 * @private_methods
 ******************************
 */

function _resetAuthData () {
  // reset userData in store
  $store.commit('auth/SET_ATOKEN_EXP_DATE', null)
  // reset tokens
  AuthService.setRefreshToken('')
  AuthService.setBearer('')
}

function _setAuthData ({ accessToken, exp } = {}) {
  AuthService.setBearer(accessToken)
  $store.commit('auth/SET_ATOKEN_EXP_DATE', exp)
}
