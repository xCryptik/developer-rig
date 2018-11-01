@ECHO OFF
SETLOCAL

REM Check for elevation.
CALL "%~dp0check-install.cmd"
IF NOT ERRORLEVEL 2 EXIT /B
net file > NUL 2> NUL
IF ERRORLEVEL 1 (
	ECHO Installation will continue in an elevated command prompt.
	cscript //nologo "%~dp0elevate.vbs" "%~f0 %~1"
	EXIT /B
) ELSE IF "%~1" == "" (
	SET PAUSE=PAUSE
) ELSE (
	SET PAUSE=
)

REM Create the temporary directory.
SET T=%TEMP%\ins%RANDOM%
MD "%T%"

REM Download and unzip OpenSSL.
SET OPENSSL_PATH=%ProgramFiles%\openssl
openssl version 2> NUL > NUL
IF ERRORLEVEL 1 PATH %PATH%;%OPENSSL_PATH%;%ProgramFiles%\Git\mingw64\bin
openssl version 2> NUL > NUL
IF NOT ERRORLEVEL 1 (
	ECHO OpenSSL is already installed.
	GOTO skip_openssl
)
SET OPENSSL_ZIP=openssl-1.0.2p-x64_86-win64.zip
CALL :download OpenSSL "https://indy.fulgan.com/SSL/%OPENSSL_ZIP%" "%T%\%OPENSSL_ZIP%"
IF ERRORLEVEL 1 GOTO done
powershell -Command "& Expand-Archive -Path '%T%\%OPENSSL_ZIP%' -DestinationPath '%OPENSSL_PATH%'"
IF ERRORLEVEL 1 GOTO done
:skip_openssl

REM Download and invoke the installers for Node, Python 2, and Yarn.
node -v > NUL 2> NUL
IF NOT ERRORLEVEL 1 (
	ECHO Node is already installed.
	GOTO skip_node
)
CALL :doit Node "https://nodejs.org/dist/v8.11.3/node-v8.11.3-x64.msi"
IF ERRORLEVEL 1 GOTO done
:skip_node
python --version > NUL 2> NUL
IF NOT ERRORLEVEL 1 (
	ECHO Python is already installed.
	GOTO skip_python
)
CALL :doit "Python 2" "https://www.python.org/ftp/python/2.7.15/python-2.7.15.amd64.msi" "ADDLOCAL=DefaultFeature,SharedCRT,Extensions,TclTk,Documentation,Tools,pip_feature,PrependPath"
IF ERRORLEVEL 1 GOTO done
:skip_python
CALL yarn --version > NUL 2> NUL
IF NOT ERRORLEVEL 1 (
	ECHO Yarn is already installed.
	GOTO skip_yarn
)
CALL :doit Yarn "https://yarnpkg.com/latest.msi"
IF ERRORLEVEL 1 GOTO done
:skip_yarn

REM Clean up, report results, and exit.
:done
SET EXIT_CODE=%ERRORLEVEL%
RD /Q /S %T%
IF NOT %EXIT_CODE% == 0 ECHO Installation failed
%PAUSE%
EXIT /B %EXIT_CODE%

REM Download and invoke an installer.
:doit
SET I="%T%\installer.msi"
IF EXIST %I% DEL /F /Q %I%
CALL :download %1 %2 %I%
IF NOT ERRORLEVEL 1 (
	ECHO Installing %~1...
	msiexec /i %I% /quiet /qn /norestart %~3
)
EXIT /B

REM Download a file.
:download
ECHO Downloading %~1...
SET DL="%T%\dl.ps1"
SET PS=powershell
ECHO $address = "%~2" >> %DL%
ECHO $fileName = "%~3" >> %DL%
ECHO [Net.ServicePointManager]::SecurityProtocol = "tls12, tls11, tls" >> %DL%
ECHO $client = new-object System.Net.WebClient >> %DL%
ECHO $client.DownloadFile^($address, $fileName^) >> %DL%
TYPE %DL% | %PS% -NoProfile -
