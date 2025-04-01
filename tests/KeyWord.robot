*** Settings ***
Documentation    KeyWords.
Library    SeleniumLibrary

*** Variables ***
${BROWSER}    chrome
${BASE_URL}    http://localhost:5173/

*** Keywords ***
Open Browser And Maximize
    Open Browser    ${BASE_URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.2s

Click And Capture
    [Arguments]    ${locator}    ${filename}
    Wait Until Element Is Visible    ${locator}    timeout=5s
    Capture Page Screenshot    ${filename}
    Click Element    ${locator}
