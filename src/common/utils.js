export const logout = () => {
  window.localStorage.removeItem('user_token')
  window.location.href = '/manager/login'
}
