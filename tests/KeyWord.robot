*** Settings ***
Documentation    KeyWords.
Library    SeleniumLibrary

*** Variables ***
${BASE_URL}                http://localhost:5173/

*** Keywords ***
Click And Capture
    [Arguments]    ${locator}    ${filename}
    Wait Until Element Is Visible    ${locator}    timeout=5s
    Capture Page Screenshot    ${filename}
    Click Element    ${locator}
