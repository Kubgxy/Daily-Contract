*** Settings ***
Documentation    Test FrontEnd Function For Web Daily Contract
Library    SeleniumLibrary
Resource    KeyWord.robot

*** Test Cases ***
Test Login Employee
    [Tags]    LoginEmployee
    [Documentation]    Test Login For Employee
    Set Screenshot Directory    ${EXECDIR}/Screenshots/Login
    Open Browser    ${BASE_URL}    chrome
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    Login1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240003
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    Login2.png
    Click And Capture    xpath=/html/body/div/div/div/div[2]    Login3.png
    [Teardown]    Sleep    3000

Test Function On ProfilePage
    [Tags]    ProfilePage_Seenotification
    [Documentation]    Test Function On ProfilePage
    Set Screenshot Directory    ${EXECDIR}/Screenshots/ProfilePage
    Open Browser    ${BASE_URL}    chrome
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    ProfilePage1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240003
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    ProfilePage2.png
    Click And Capture    xpath=/html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div[2]/div/div[1]/div/button    ProfilePage3.png
    [Teardown]    Sleep    3000

Test Function On CheckinPage
    [Tags]    CheckinPage
    [Documentation]    Test Function On CheckinPage
    Set Screenshot Directory    ${EXECDIR}/Screenshots/CheckinPage
    Open Browser    ${BASE_URL}    chrome
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    CheckinPage1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240003
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    CheckinPage2.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[1]    CheckinPage3.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[3]/button[1]    CheckinPage4.png
    [Teardown]    Sleep    3000

Test Notification Employee
    [Tags]    NotificationPage
    [Documentation]    Test Notification For See Detail
    Set Screenshot Directory    ${EXECDIR}/Screenshots/Notification
    Open Browser    ${BASE_URL}    chrome
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    Notification1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240003
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    Notification2.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[2]    Notification3.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[1]/button    Notification4.png
    [Teardown]    Sleep    3000

Test WorkInfo Employee 01
    [Tags]    WorkInfoSaveData
    [Documentation]    Test Function Save Data On WorkInfo
    Set Screenshot Directory    ${EXECDIR}/Screenshots/Notification
    Open Browser    ${BASE_URL}    chrome
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfo1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240003
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfo2.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfo3.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select    WorkInfo4.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select/option[2]    WorkInfo5.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[2]/div/input    5
    Input Text    Xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[2]/div/textarea   ตรวจสอบคุณภาพ
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[3]/button[2]    WorkInfo6.png
    [Teardown]    Sleep    3000

Test WorkInfo Employee 02
    [Tags]    WorkInfoHistorySaveData
    [Documentation]    Test Function WorkInfoHistorySaveData On WorkInfo
    Set Screenshot Directory    ${EXECDIR}/Screenshots/Notification
    Open Browser    ${BASE_URL}    chrome
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoHistory1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240003
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoHistory2.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoHistory3.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[1]/button[2]    WorkInfoHistory4.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[2]/div[1]/div[2]/button    WorkInfoHistory5.png
    [Teardown]    Sleep    3000
Test RequestForm Employee
    [Tags]    RequestFormPage
    [Documentation]    Test Function RequestForm
    Set Screenshot Directory    ${EXECDIR}/Screenshots/RequestForm
    Open Browser    ${BASE_URL}    chrome
    Maximize Browser Window
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    RequestForm1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    RequestForm2.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[4]    RequestForm3.png
    Click And Capture    xpath=/html/body/div/div/div/div[2]/div/div[1]/select        RequestForm4.png
    Click And Capture    xpath=/html/body/div/div/div/div[2]/div/div[1]/select/option[2]    RequestForm5.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/select    RequestForm6.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/select/option[3]    RequestForm7.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[1]    03/12/2025
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[2]    03/20/2025
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[3]    ลาไปเที่ยวเว้ยยยยย
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/button    RequestForm8.png
    Click And Capture    xpath=/html/body/div[2]/div/div[6]/button[1]    RequestForm9.png
    Click And Capture    xpath=//html/body/div[2]/div/div[6]/button[1]    RequestForm10.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[1]/button    RequestForm11.png
    Click And Capture    xpath=//button[contains(text(), 'ปิด')]    RequestForm12.png
    Capture Page Screenshot    RequestForm13.png

    [Teardown]    Close All Browsers

Test AboutPage
    [Tags]    AboutPage
    [Documentation]    Test Function AboutPage
    Set Screenshot Directory    ${EXECDIR}/Screenshots/AboutPage
    Open Browser    ${BASE_URL}    chrome
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    AboutPage1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240003
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    AboutPage2.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[5]    AboutPage3.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[1]/div[2]/button    AboutPage4.png
    Click And Capture    xpath=//button[contains(text(), 'ปิด')]    AboutPage5.png
    [Teardown]    Sleep    3000

Test Settings
    [Tags]    Settings
    [Documentation]    Test Function Settings
    Set Screenshot Directory    ${EXECDIR}/Screenshots/Settings
    Open Browser    ${BASE_URL}    chrome
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    Settings1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240003
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    1234567
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    Settings2.png
    Click And Capture    xpath=/html/body/div/div/div/div[1]/nav/div/div/div[3]/div/div/button    Settings3.png
    Click And Capture    xpath=/html/body/div/div/div/div[1]/nav/div/div/div[3]/div/div[2]/a[2]    Settings4.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div[1]/div[3]/div/div/button    Settings5.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div[1]/div[3]/div/div/input    0999999998
    Click And Capture    xpath=/html/body/div/div/div/div[2]/div[1]/div[3]/div/div/button    Settings6.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[1]/input    1234567
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[2]/input    123456
    Wait Until Element Is Visible    xpath=//input[@placeholder="Confirm new password"]    timeout=5s
    Input Text    xpath=//input[@placeholder="Confirm new password"]    123456

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[4]/button    Settings7.png
    Click And Capture    xpath=//button[contains(text(), 'ปิด')]    Settings8.png
    [Teardown]    Sleep    3000
    
Test Logout
    [Tags]    Logout
    [Documentation]    Test Function Logout
    Set Screenshot Directory    ${EXECDIR}/Screenshots/Logout
    Open Browser    ${BASE_URL}    chrome
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    Logout1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240003
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    Logout2.png
    Click And Capture    xpath=/html/body/div/div/div/div[1]/nav/div/div/div[3]/div/div/button    Logout3.png
    Click And Capture    xpath=/html/body/div/div/div/div[1]/nav/div/div/div[3]/div/div[2]/a[3]    Logout4.png

    [Teardown]    Sleep    3000

Test ForgotPassword
    [Tags]    ForgotPassword
    [Documentation]    Test Function ForgotPassword
    Set Screenshot Directory    ${EXECDIR}/Screenshots/ForgotPassword
    Open Browser    ${BASE_URL}    chrome
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[3]/a    ForgotPassword1.png
    Input Text    xpath=/html/body/div/div/div/div/form/div/div[1]/input    20240003
    Input Text    xpath=/html/body/div/div/div/div/form/div/div[2]/input    Prayut
    Input Text    xpath=/html/body/div/div/div/div/form/div/div[3]/input    jan o-cha
    Input Text    xpath=/html/body/div/div/div/div/form/div/div[4]/input    0999999998
    Input Text    xpath=/html/body/div/div/div/div/form/div/div[5]/input    Employee
    Click And Capture    xpath=//*[@id="root"]/div/div/div/form/div/button    ForgotPassword2.png
    Input Text    xpath=/html/body/div/div/div/div/form/div/div[1]/input    123456z
    Input Text    xpath=/html/body/div/div/div/div/form/div/div[2]/input    123456z
    Click And Capture    xpath=//*[@id="root"]/div/div/div/form/div/button    ForgotPassword3.png
    [Teardown]    Sleep    3000

# WorkInfo (Positive Case)
*** Test Cases ***
Test Load WorkInfo Page
    [Tags]    WorkInfoLoadPage
    [Documentation]    ทดสอบการโหลดหน้า Work Info ว่าข้อมูลถูกโหลดสำเร็จ พร้อม Navbar และตำแหน่งผู้ใช้งาน
    Set Screenshot Directory    ${EXECDIR}/Screenshots/WorkInfo/WorkInfoLoadPage

    # Login
    Open Browser    ${BASE_URL}    chrome
    Maximize Browser Window
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoLoadPage1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoLoadPage2.png

    # เช็คหน้าเพจว่าถูกโหลดสําเร็จ
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoLoadPage3.png
    Element Text Should Be    xpath=//*[@id="root"]/div/div/div[2]/header/div[1]/div[2]/div/h1    Work Info

    # รอหน้าเพจแสดง
    Sleep    1s

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot    WorkInfoLoadPage4.png

    [Teardown]    Close All Browsers

Test Show Task Options By Position
    [Tags]    WorkInfoDropdown
    [Documentation]    ทดสอบว่าการแสดงรายการงานใน dropdown ตรงกับตำแหน่งของผู้ใช้งาน
    Set Screenshot Directory    ${EXECDIR}/Screenshots/WorkInfo/WorkInfoDropdown

    # Login
    Open Browser    ${BASE_URL}    chrome
    Maximize Browser Window
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoDropdown1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoDropdown2.png

    # รอ dropdown ปรากฏ
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoDropdown3.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select    WorkInfoDropdown4.png

    # เช็ค dropdown ตามตำแหน่งงาน
    Element Text Should Be    xpath=//select/option[2]    ผลิตสินค้า
    Element Text Should Be    xpath=//select/option[3]    ตรวจสอบคุณภาพเบื้องต้น
    Element Text Should Be    xpath=//select/option[4]    จัดเตรียมวัตถุดิบ
    Element Text Should Be    xpath=//select/option[5]    บำรุงรักษาเครื่องจักร
    Element Text Should Be    xpath=//select/option[6]    จัดเก็บสินค้า

    # คลิก dropdown แล้วกดลูกศรลงให้มันโชว์
    Execute JavaScript    document.querySelector('select').setAttribute('size', '6')

    # รอ dropdown แสดง
    Sleep    1s

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot    WorkInfoDropdown5.png

    [Teardown]    Close All Browsers

Test Submit Work Record Successfully
    [Tags]    WorkInfoSubmitPositive
    [Documentation]    ทดสอบการกรอกงานและชั่วโมงทำงานที่ถูกต้อง พร้อมกดบันทึกสำเร็จ
    Set Screenshot Directory    ${EXECDIR}/Screenshots/WorkInfo/WorkInfoSubmitPositive

    # Login
    Open Browser    ${BASE_URL}    chrome
    Maximize Browser Window
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoSubmitPositive1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoSubmitPositive2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoSubmitPositive3.png

    # บันทึกข้อมูลการทำงาน
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select    WorkInfoSubmitPositive4.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select/option[2]    WorkInfoSubmitPositive5.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[2]/div/input    7
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[3]/button[2]    WorkInfoSubmitPositive6.png
    Click And Capture    xpath=/html/body/div[2]/div/div[6]/button[1]    WorkInfoSubmitPositive7.png
    Wait Until Element Contains    xpath=//h2[@class='swal2-title']    บันทึกสำเร็จ!    10s

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot          WorkInfoSubmitPositive8.png

    [Teardown]    Close All Browsers

Test Submit Work With Note
    [Tags]    WorkInfoNoteSubmit
    [Documentation]    ทดสอบการเพิ่มหมายเหตุและตรวจสอบว่าแสดงในประวัติได้ถูกต้อง
    Set Screenshot Directory    ${EXECDIR}/Screenshots/WorkInfo/WorkInfoNoteSubmit

    # Login
    Open Browser    ${BASE_URL}    chrome
    Maximize Browser Window
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoNoteSubmit1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoNoteSubmit2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoNoteSubmit3.png

    # บันทึกข้อมูลการทำงาน
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select    WorkInfoNoteSubmit4.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select/option[2]    WorkInfoNoteSubmit5.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[2]/div/input    7
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[2]/div/textarea    ทดสอบการกรอกงานและชั่วโมงทำงานที่ถูกต้อง
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[3]/button[2]    WorkInfoNoteSubmit6.png
    Click And Capture    xpath=/html/body/div[2]/div/div[6]/button[1]    WorkInfoNoteSubmit7.png
    Wait Until Element Contains    xpath=//h2[@class='swal2-title']    บันทึกสำเร็จ!    10s
    Capture Page Screenshot    WorkInfoNoteSubmit8.png

    # รอให้ Swal หาย
    Sleep    5s

    # เข้าหน้าประวัติการทำงาน
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[1]/button[2]    WorkInfoNoteSubmit9.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[2]/div[1]/div[2]/button    WorkInfoNoteSubmit10.png

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot          WorkInfoNoteSubmit11.png

    [Teardown]    Close All Browsers

Test Switch To Work History Tab
    [Tags]    WorkInfoTabSwitchHistory
    [Documentation]    ทดสอบการกดสลับแท็บไปที่ “ประวัติการทำงาน” แล้วข้อมูลแสดงถูกต้อง
    Set Screenshot Directory    ${EXECDIR}/Screenshots/WorkInfo/WorkInfoTabSwitchHistory

    # Login
    Open Browser    ${BASE_URL}    chrome
    Maximize Browser Window
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoTabSwitchHistory1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoTabSwitchHistory2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoTabSwitchHistory3.png

    # เข้าหน้าประวัติการทำงาน
    Sleep    1s
    Click Button    xpath=//button[normalize-space(text())='ประวัติการบันทึก']

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot          WorkInfoTabSwitchHistory4.png

    [Teardown]    Close All Browsers

Test Show Record Details In History
    [Tags]    WorkInfoHistoryDetails
    [Documentation]    ทดสอบการกดปุ่ม “ดูรายละเอียด” ในประวัติแล้วข้อมูลแสดงถูกต้อง
    Set Screenshot Directory    ${EXECDIR}/Screenshots/WorkInfo/WorkInfoHistoryDetails

    # Login
    Open Browser    ${BASE_URL}    chrome
    Maximize Browser Window
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoHistoryDetails1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoHistoryDetails2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoHistoryDetails3.png

    # เข้าหน้าประวัติการทำงาน
    Sleep    1s
    Click Button    xpath=//button[normalize-space(text())='ประวัติการบันทึก']
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[2]/div[1]/div[2]/button    WorkInfoHistoryDetails4.png

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot          WorkInfoHistoryDetails5.png

    [Teardown]    Close All Browsers

Test Show Tooltip Guidance
    [Tags]    WorkInfoTooltipUI
    [Documentation]    ทดสอบการแสดง Tooltip แนะนำเมื่อกดที่ไอคอน และสามารถปิด/เปิดได้
    Set Screenshot Directory    ${EXECDIR}/Screenshots/WorkInfo/WorkInfoTooltipUI

    # Login
    Open Browser    ${BASE_URL}    chrome
    Maximize Browser Window
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoTooltipUI1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoTooltipUI2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoTooltipUI3.png

    # รอ tooltip icon ปรากฏแบบเจาะจง
    Wait Until Element Is Visible    css=svg.lucide.lucide-circle-alert    timeout=10s

    # คลิก icon tooltip
    Click Element    css=svg.lucide.lucide-circle-alert

    # รอผล tooltip แสดง
    Sleep    1s
    Capture Page Screenshot    WorkInfoTooltipUI4.png

    [Teardown]    Close All Browsers

# WorkInfo (Negative Case)
*** Test Cases ***
Test Submit Without Selecting Task
    [Tags]    WorkInfoNegativeTaskEmpty
    [Documentation]    ทดสอบกรณีไม่ได้เลือกงานใน dropdown แล้วกดบันทึก ควรขึ้นแจ้งเตือน
    Set Screenshot Directory    ${EXECDIR}/Screenshots/WorkInfo/Negative/TaskEmpty

    # Login
    Open Browser    ${BASE_URL}    chrome
    Maximize Browser Window
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    TaskEmpty1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    TaskEmpty2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    TaskEmpty3.png

    # ไม่เลือกงาน และกรอกชั่วโมงแล้วกดบันทึก
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[2]/div/input    6
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[3]/button[2]    TaskEmpty4.png

    # ตรวจสอบว่าขึ้นแจ้งเตือน
    Capture Page Screenshot    TaskEmpty5.png

    [Teardown]    Close All Browsers

Test Submit Without Work Hours
    [Tags]    WorkInfoNegativeHourEmpty
    [Documentation]    ทดสอบกรณีไม่ได้กรอกชั่วโมง แล้วกดบันทึก ควรขึ้นแจ้งเตือน
    Set Screenshot Directory    ${EXECDIR}/Screenshots/WorkInfo/Negative/HourEmpty

    # Login
    Open Browser    ${BASE_URL}    chrome
    Maximize Browser Window
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    HourEmpty1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    HourEmpty2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    HourEmpty3.png

    # เลือกงาน แต่ไม่กรอกชั่วโมง แล้วกดบันทึก
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select    HourEmpty4.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select/option[2]    HourEmpty5.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[3]/button[2]    HourEmpty6.png

    # ตรวจสอบว่าแสดงข้อความแจ้งเตือน
    Capture Page Screenshot    HourEmpty7.png

    [Teardown]    Close All Browsers

Test Submit With Invalid Hour
    [Tags]    WorkInfoNegativeInvalidHour
    [Documentation]    ทดสอบกรณีกรอกจำนวนชั่วโมงผิด (เช่นน้อยกว่า 0.5 หรือมากกว่า 7) ระบบควรแจ้งเตือน
    Set Screenshot Directory    ${EXECDIR}/Screenshots/WorkInfo/Negative/InvalidHour

    # Login
    Open Browser    ${BASE_URL}    chrome
    Maximize Browser Window
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    InvalidHour1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    InvalidHour2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    InvalidHour3.png

    # เลือกงาน และกรอกชั่วโมงไม่ถูกต้อง เช่น 0.2
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select    InvalidHour4.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select/option[2]    InvalidHour5.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[2]/div/input    0.2
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[3]/button[2]    InvalidHour6.png

    # ตรวจสอบว่าแสดงข้อความแจ้งเตือน
    Capture Page Screenshot    InvalidHour7.png

    [Teardown]    Close All Browsers

Test Submit With Long Note
    [Tags]    WorkInfoNegativeLongNote
    [Documentation]    ทดสอบกรณีกรอกหมายเหตุเกิน 300 ตัวอักษร ระบบควรแจ้งเตือนว่าหมายเหตุต้องไม่เกิน 300 ตัวอักษร
    Set Screenshot Directory    ${EXECDIR}/Screenshots/WorkInfo/Negative/LongNote

    # Login
    Open Browser    ${BASE_URL}    chrome
    Maximize Browser Window
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    LongNote1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    LongNote2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    LongNote3.png

    # กรอกข้อมูลพร้อม Note เกิน 300 ตัว
    Click Element    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select
    Click Element    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select/option[2]
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[2]/div/input    4
    ${LONG_NOTE}=    Evaluate    "x"*301
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[2]/div/textarea    ${LONG_NOTE}
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[3]/button[2]    LongNote4.png

    # ตรวจสอบว่าระบบแจ้งเตือน
    Capture Page Screenshot    LongNote5.png

    [Teardown]    Close All Browsers

Test Submit With Expired Token
    [Tags]    WorkInfoNegativeTokenExpired
    [Documentation]    ทดสอบกรณี token หมดอายุ หรือ session หมด ระบบควร redirect หรือแจ้ง error
    Set Screenshot Directory    ${EXECDIR}/Screenshots/WorkInfo/Negative/TokenExpired

    # Login แล้วลบ token ทิ้ง
    Open Browser    ${BASE_URL}    chrome
    Maximize Browser Window
    Click Element    xpath=//*[@id="root"]/div/div/div/div/div[1]
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click Element    xpath=//*[@id="root"]/div/div/div/div[2]/form/button

    # ลบ cookie หรือ localStorage (จำลอง token หมดอายุ)
    Execute JavaScript    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    # เข้าหน้า WorkInfo
    Go To    ${BASE_URL}/workinfo
    Capture Page Screenshot    TokenExpired1.png

    [Teardown]    Close All Browsers

Test Cancel Then Form Reset
    [Tags]    WorkInfoNegativeCancelReset
    [Documentation]    ทดสอบกรณีกดยกเลิกแล้วกลับเข้ามาใหม่ ข้อมูลควรถูก reset ทั้งหมด
    Set Screenshot Directory    ${EXECDIR}/Screenshots/WorkInfo/Negative/CancelReset

    # Login
    Open Browser    ${BASE_URL}    chrome
    Maximize Browser Window
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    CancelReset1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    Admin
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    2209Tnkoak
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    CancelReset2.png

    # เข้าหน้า WorkInfo และกรอกข้อมูล
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    CancelReset3.png
    Select From List By Index    xpath=//select    2
    Input Text    xpath=//input[@type='number']    5
    Input Text    xpath=//textarea    บันทึกก่อนยกเลิก

    # กดยกเลิก
    Click And Capture    xpath=//button[contains(text(), 'ยกเลิก')]    CancelReset4.png
    Sleep    1s

    # กลับเข้าหน้าฟอร์มใหม่
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    CancelReset5.png
    Capture Page Screenshot    CancelReset6.png

    [Teardown]    Close All Browsers
