import { ipcMain } from 'electron'
import sqlite3 from 'sqlite3'
const usb = require('usb')
const serail = require('serialport')
console.log(serail)
console.log('sqlite', sqlite3)

ipcMain.on('get-usb-list', (event, data) => {
  var list = usb.getDeviceList()
  console.log('sub list', list)
  event.sender.send('get-usb-list-cb', list)
})


// - sudo apt-get install build-essential libudev-dev -y
// 

/**
osx_image: xcode8.3
sudo: required
dist: trusty
language: c

matrix:
  include:
  - os: osx
  - os: linux
    env: CC=clang CXX=clang++ npm_config_clang=1
    compiler: clang
  - os: windows
addons:
  apt:
    packages:
    - libgnome-keyring-dev
    - icnsutils
before_install:
- mkdir -p /tmp/git-lfs && curl -L https://github.com/github/git-lfs/releases/download/v1.2.1/git-lfs-$([
    "$TRAVIS_OS_NAME" == "linux" ] && echo "linux" || echo "darwin")-amd64-1.2.1.tar.gz
    | tar -xz -C /tmp/git-lfs --strip-components 1 && /tmp/git-lfs/git-lfs pull
- if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then sudo apt-get install --no-install-recommends -y icnsutils graphicsmagick xz-utils; fi
install:
- nvm install 10
- curl -o- -L https://yarnpkg.com/install.sh | bash
- source ~/.bashrc
- npm install -g xvfb-maybe
- yarn
script:
- yarn run build
- npm run publish
branches:
  only:
  - master
   

 */