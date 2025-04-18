*** Settings ***
Documentation    KeyWords.
Library    SeleniumLibrary


*** Variables ***
${BROWSER}    chrome
${BASE_URL}    http://localhost:5173/
${GEO_LAT}    14.123456
${GEO_LNG}    100.987654

*** Keywords ***
Open Browser And Maximize
    Open Browser    ${BASE_URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.2s

Click And Capture
    [Arguments]    ${locator}    ${filename}
    Wait Until Element Is Visible    ${locator}    timeout=10s
    Capture Page Screenshot    ${filename}
    Click Element    ${locator}

Set Geolocation
    [Arguments]    ${lat}    ${lng}
    ${params}=    Create Dictionary
    ...    latitude=${lat}
    ...    longitude=${lng}
    ...    accuracy=100

Should Field Be Invalid
    [Arguments]    ${locator}
    ${is_valid}=   Execute Javascript    return document.querySelector(`${locator}`).checkValidity();
    Should Be Equal    ${is_valid}    ${False}




