# 사용법
1. git clone 으로 생성된 프로젝트 디렉토리로 이동

  cd ebiz-mobp

## 모듈 인스톨
1. 프로젝트 관련 node모듈 설치를 위해 다음을 실행한다.

  npm install

node_modules 폴더가 생성될 것이다.

이상태로 브라우저에서 실행이 가능하다.

	ionic serve --lab


2. 바코드, NFC 플러그인을 설치한다.

	cordova plugin add https://github.com/wildabeast/BarcodeScanner.git
	
	cordova plugin add https://github.com/chariotsolutions/phonegap-nfc
	
plugins 폴더가 생성될 것이다.


3. 안드로이드 플랫폼을 설치한다.

	ionic platform add android

platforms 폴더가 생성될 것이다.


## 브라우저에서 실행하기

	ionic serve --lab

## 디바이스에서 실행하기
사전에 android SDK 가 실행될 수 있는 환경을 갖춰야 한다.

	ionic run android
	
