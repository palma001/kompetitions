export default {
  /**
   * Token session
   * @type {String} token
   */
  token: localStorage.getItem('TOKEN') || null,
  /**
   * Name user
   * @type {String}
   */
  name: localStorage.getItem('name') || null,
  /**
   * Lastname user
   * @type {String}
   */
  lastName: localStorage.getItem('lastname') || null,
  /**
   * Rols user
   * @type {String}
   */
  rols: (localStorage.getItem('rols')) ? localStorage.getItem('rols').toLowerCase() : null
}
