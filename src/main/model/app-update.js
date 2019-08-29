const { exec } = require('child_process')

class AppUpdate {
  // 自动安装
  static install(cmd) {
    return new Promise((reolve, rejiect) => {
      exec(cmd, err => {
        if (err) {
          return rejiect(err)
        }
        reolve('cmd run ok')
      })
    })
  }
}
export default AppUpdate