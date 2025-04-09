*** Settings ***
Documentation    KeyWords.
Library    SeleniumLibrary

*** Variables ***
${BROWSER}    chrome
${BASE_URL}    http://localhost:5173/

*** Keywords ***
Open Browser And Maximize
    Open Browser    ${BASE_URL}    chrome
    ...    options=--headless
    ...    options=--no-sandbox
    ...    options=--disable-dev-shm-usage
    ...    options=--user-data-dir=/tmp/chrome-user-data
    Maximize Browser Window

Click And Capture
    [Arguments]    ${locator}    ${filename}
    Wait Until Element Is Visible    ${locator}    timeout=10s
    Capture Page Screenshot    ${filename}
    Click Element    ${locator}
