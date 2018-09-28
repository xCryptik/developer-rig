@ECHO OFF
SETLOCAL

PATH %PATH%;%SystemDrive%\Python27;%ProgramFiles%\nodejs;%ProgramFiles(x86)%\Yarn\bin
CD /D "%~dp0.."
SET NEEDS_YARN_INSTALL=no
IF NOT EXIST node_modules (
	SET NEEDS_YARN_INSTALL=yes
) ELSE IF NOT EXIST .configured (
	SET NEEDS_YARN_INSTALL=yes
) ELSE (
	PowerShell -Command "If ((Get-Item .configured).LastWriteTime -lt (Get-Item package.json).LastWriteTime) { Exit 1 }"
	IF ERRORLEVEL 1 SET NEEDS_YARN_INSTALL=yes
)
IF %NEEDS_YARN_INSTALL% == yes (
	CMD /C yarn install
	IF ERRORLEVEL 1 (
		ECHO Cannot install Developer Rig run-time dependencies.
		EXIT /B
	)
	ECHO. > .configured
)
