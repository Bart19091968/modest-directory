export type UserCoordinates = {
  latitude: number
  longitude: number
}

export type GeolocationError =
  | 'permission_denied'
  | 'position_unavailable'
  | 'timeout'
  | 'not_supported'

export function getUserCoordinates(): Promise<UserCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('not_supported' satisfies GeolocationError)
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      error => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject('permission_denied' satisfies GeolocationError)
            break
          case error.POSITION_UNAVAILABLE:
            reject('position_unavailable' satisfies GeolocationError)
            break
          case error.TIMEOUT:
            reject('timeout' satisfies GeolocationError)
            break
          default:
            reject('position_unavailable' satisfies GeolocationError)
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    )
  })
}
