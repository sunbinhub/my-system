/**
 * 清除登录信息
 */
export default function clearLoginInfo() {
  sessionStorage.setItem("tokenInfo", "");
  sessionStorage.setItem("menuInfo", "");
  sessionStorage.setItem("userInfo", "");
}
