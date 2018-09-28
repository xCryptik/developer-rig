@ECHO OFF
SETLOCAL

REM Check if configuration is required.  If the configure command file
REM installed the prerequisites, these are their default paths.
PATH %PATH%;%SystemDrive%\Python27;%ProgramFiles%\nodejs;%ProgramFiles(x86)%\Yarn\bin
CALL "%~dp0check-configure.cmd"
IF ERRORLEVEL 1 (
	ECHO Configuration did not complete properly.  You will need to correct the
	ECHO problems and re-run the "configure.cmd" command file.
	EXIT /B
)

REM Ensure the dependencies are up to date.
CALL "%~dp0do-yarn.cmd"
IF ERRORLEVEL 1 EXIT /B

REM Start the Developer Rig.
CD /D "%~dp0.."
yarn start
