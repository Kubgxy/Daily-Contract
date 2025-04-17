*** Settings ***
Library           SeleniumLibrary
Library    XML
Resource          KeyWord.robot
Suite Setup       Open Browser And Maximize
Suite Teardown    Close Browser

# Test Case For Login Page Negative
*** Test Cases ***
Test Login With Invalid Credentials
    [Tags]    LoginNegative
    [Documentation]    ตรวจสอบการแสดงผลเมื่อใส่ชื่อผู้ใช้หรือรหัสผ่านผิด
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Login/Negative

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    InvalidLogin1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240010
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click Element    xpath=//*[@id="root"]/div/div/div/div[2]/form/button

    Wait Until Element Is Visible    xpath=//div[contains(@class, "bg-red-50")]//p[contains(text(), "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")]    timeout=10s
    Capture Page Screenshot    InvalidLogin2.png

*** Test Cases ***
Test Checkin Outside Allowed Radius
    [Tags]    CheckinNegative
    [Documentation]    ทดสอบการเช็คอินเมื่อตำแหน่งอยู่นอกพื้นที่ที่กำหนด
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Checkin/Negative

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    CheckIn1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240010
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    1234567
    Click Element    xpath=//*[@id="root"]/div/div/div/div[2]/form/button

    #เข้าหน้าระบบบันทึกเวลาทำงาน
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[1]    Checkin2.png

    Set Geolocation    ${GEO_LAT}    ${GEO_LNG}
    Reload Page
    Wait Until Page Contains    ระบบบันทึกเวลาทำงาน    timeout=5s

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[3]/button[1]    Checkin3.png
    Capture Page Screenshot






