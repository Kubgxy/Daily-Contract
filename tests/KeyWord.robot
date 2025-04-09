*** Settings ***
Documentation    KeyWords.
Library    SeleniumLibrary

*** Variables ***
${BROWSER}    chrome
${BASE_URL}    http://localhost:5173/

*** Keywords ***
Open Browser And Maximize
    Open Browser    ${BASE_URL}    ${BROWSER}
    ...    options=add_argument(--headless)
    ...    options=add_argument(--no-sandbox)
    ...    options=add_argument(--disable-dev-shm-usage)
    ...    options=add_argument(--user-data-dir=/tmp/chrome-user-data)
    Maximize Browser Window
    Set Selenium Speed    0.2s
    
Click And Capture
    [Arguments]    ${locator}    ${filename}
    Wait Until Element Is Visible    ${locator}    timeout=10s
    Capture Page Screenshot    ${filename}
    Click Element    ${locator}
