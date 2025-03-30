export const setAuthToken = (token) => {
  if (token) {
    // เก็บ token และเวลาหมดอายุ (1 ชั่วโมงนับจากตอนนี้)
    localStorage.setItem("token", token)
    const expirationTime = new Date(new Date().getTime() + 60 * 60 * 1000) // 1 hour
    localStorage.setItem("tokenExpiration", expirationTime.toISOString())
  } else {
    // ถ้าไม่มี token ให้ลบข้อมูลออก
    localStorage.removeItem("token")
    localStorage.removeItem("tokenExpiration")
  }
}

export const checkTokenExpiration = () => {
  const token = localStorage.getItem("token")
  const expirationTime = localStorage.getItem("tokenExpiration")

  if (!token || !expirationTime) {
    return false
  }

  // ตรวจสอบว่า token หมดอายุหรือยัง
  const isExpired = new Date() > new Date(expirationTime)
  if (isExpired) {
    // ถ้าหมดอายุให้ลบข้อมูลออก
    localStorage.removeItem("token")
    localStorage.removeItem("tokenExpiration")
    return false
  }

  return true
}

