*** Settings ***
Library           SeleniumLibrary
Library    XML
Resource          KeyWord.robot
Suite Setup       Open Browser And Maximize
Suite Teardown    Close Browser


# Test Cases For Login Page
*** Test Cases ***
Test Login Employee
    [Tags]    LoginEmployee
    [Documentation]    Test Login For Employee
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Login

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    Login1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    Login2.png
    Click And Capture    xpath=/html/body/div/div/div/div[2]    Login3.png

# Test Cases For Profile Page
*** Test Cases ***
Test Function On ProfilePage
    [Tags]    ProfilePage_Seenotification
    [Documentation]    Test Function On ProfilePage
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/ProfilePage

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    ProfilePage1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    ProfilePage2.png
    Click And Capture    xpath=/html/body/div/div/div/div[2]/div/div[2]/div[1]/div/div[2]/div/div[1]/div/button    ProfilePage3.png


# Test Case For Check In Page
*** Test Cases ***
Test Check In Page
    [Tags]    CheckIn
    [Documentation]    Test Check In Page
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/CheckInPage

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    CheckInPage1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240002
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    CheckInPage2.png

    # เข้าหน้า CheckIn
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[1]    CheckInPage3.png  

    # เช็คปุ่มกด CheckIn สามารถใช้ได้
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[3]/button[1]    CheckInPage4.png
    Wait Until Element Is Visible    xpath=//button[text()="OK"]    5s
    Click And Capture    xpath=//button[text()="OK"]    CheckInPage5.png
    Sleep    5s

Test Check In Page
    [Tags]    CheckOut
    [Documentation]    Test Check In Page
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/CheckOutPage

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    CheckOutPage1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240002
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    CheckOutPage2.png

    # เข้าหน้า CheckIn
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[1]    CheckOutPage3.png  

    # เช็คปุ่มกด CheckIn สามารถใช้ได้
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[3]/button[2]    CheckOutPage4.png
    Wait Until Element Is Visible    xpath=//button[text()="OK"]    5s
    Click And Capture    xpath=//button[text()="OK"]    CheckOutPage5.png

# Test Cases For Notification Page
*** Test Cases ***
Test Notification Page
    [Tags]    NotificationPage
    [Documentation]    Test Notification Page
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/NotificationPage

    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    NotificationPage1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240010
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    NotificationPage2.png

    # เข้าหน้า Notification
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[2]   NotificationPage3.png

    # เช็คว่ามสามารถกดงปุ่มติ๊กถูกเพื่อกดว่าอ่านแล้วได้
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[2]/div/button    NotificationPage4.png

    # เช็คว่ากดดูรายละเอียดการแจ้งเตือนได้
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[1]/button[text()="ดูเพิ่มเติม..."]   NotificationPage4.png
    Click And Capture    xpath=//button[contains(., "ซ่อนข้อมูล")]    NotificationPage5.png
    Wait Until Page Contains Element    xpath=//button[contains(., "ดูเพิ่มเติม")]    5s

    Capture Page Screenshot    NotificationPage6.png


# WorkInfo (Positive Case)
*** Test Cases ***
Test Load WorkInfo Page
    [Tags]    WorkInfoLoadPage
    [Documentation]    ทดสอบการโหลดหน้า Work Info ว่าข้อมูลถูกโหลดสำเร็จ พร้อม Navbar และตำแหน่งผู้ใช้งาน
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/WorkInfo/WorkInfoLoadPage

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoLoadPage1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoLoadPage2.png

    # เช็คหน้าเพจว่าถูกโหลดสําเร็จ
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoLoadPage3.png
    Element Text Should Be    xpath=//*[@id="root"]/div/div/div[2]/header/div[1]/div[2]/div/h1    Work Info

    # รอหน้าเพจแสดง
    Sleep    1s

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot    WorkInfoLoadPage4.png

Test Show Task Options By Position
    [Tags]    WorkInfoDropdown
    [Documentation]    ทดสอบว่าการแสดงรายการงานใน dropdown ตรงกับตำแหน่งของผู้ใช้งาน
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/WorkInfo/WorkInfoDropdown

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoDropdown1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
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

Test Submit Work Record Successfully
    [Tags]    WorkInfoSubmitPositive
    [Documentation]    ทดสอบการกรอกงานและชั่วโมงทำงานที่ถูกต้อง พร้อมกดบันทึกสำเร็จ
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/WorkInfo/WorkInfoSubmitPositive

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoSubmitPositive1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoSubmitPositive2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoSubmitPositive3.png

    # บันทึกข้อมูลการทำงาน
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select    WorkInfoSubmitPositive4.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select/option[2]    WorkInfoSubmitPositive5.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[2]/div/input    7
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[4]/button[2]    WorkInfoSubmitPositive6.png
    Click And Capture    xpath=/html/body/div[2]/div/div[6]/button[1]    WorkInfoSubmitPositive7.png
    Wait Until Element Contains    xpath=//h2[@class='swal2-title']    บันทึกสำเร็จ    10s

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot          WorkInfoSubmitPositive8.png

Test Submit Work With Note
    [Tags]    WorkInfoNoteSubmit
    [Documentation]    ทดสอบการเพิ่มหมายเหตุและตรวจสอบว่าแสดงในประวัติได้ถูกต้อง
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/WorkInfo/WorkInfoNoteSubmit

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoNoteSubmit1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoNoteSubmit2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoNoteSubmit3.png

    # บันทึกข้อมูลการทำงาน
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select    WorkInfoNoteSubmit4.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[1]/div/select/option[2]    WorkInfoNoteSubmit5.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[1]/div[2]/div/input    7
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[2]/div/textarea    ทดสอบการกรอกงานและชั่วโมงทำงานที่ถูกต้อง
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/form/div[4]/button[2]    WorkInfoNoteSubmit6.png
    Click And Capture    xpath=/html/body/div[2]/div/div[6]/button[1]    WorkInfoNoteSubmit7.png
    Wait Until Element Contains    xpath=//h2[@class='swal2-title']    บันทึกสำเร็จ    10s
    Capture Page Screenshot    WorkInfoNoteSubmit8.png

    # รอให้ Swal หาย
    Sleep    5s

    # เข้าหน้าประวัติการทำงาน
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[1]/button[2]    WorkInfoNoteSubmit9.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[2]/div[1]/div[2]/button    WorkInfoNoteSubmit10.png

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot          WorkInfoNoteSubmit11.png

Test Switch To Work History Tab
    [Tags]    WorkInfoTabSwitchHistory
    [Documentation]    ทดสอบการกดสลับแท็บไปที่ “ประวัติการทำงาน” แล้วข้อมูลแสดงถูกต้อง
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/WorkInfo/WorkInfoTabSwitchHistory

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoTabSwitchHistory1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoTabSwitchHistory2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoTabSwitchHistory3.png

    # เข้าหน้าประวัติการทำงาน
    Sleep    1s
    Click Button    xpath=//button[normalize-space(text())='ประวัติการบันทึก']

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot          WorkInfoTabSwitchHistory4.png

Test Show Record Details In History
    [Tags]    WorkInfoHistoryDetails
    [Documentation]    ทดสอบการกดปุ่ม “ดูรายละเอียด” ในประวัติแล้วข้อมูลแสดงถูกต้อง
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/WorkInfo/WorkInfoHistoryDetails

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoHistoryDetails1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    WorkInfoHistoryDetails2.png

    # เข้าหน้า WorkInfo
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[3]    WorkInfoHistoryDetails3.png

    # เข้าหน้าประวัติการทำงาน
    Sleep    1s
    Click Button    xpath=//button[normalize-space(text())='ประวัติการบันทึก']
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[2]/div[1]/div[2]/button    WorkInfoHistoryDetails4.png

    # ถ่ายภาพทั้งหน้า
    Capture Page Screenshot          WorkInfoHistoryDetails5.png

Test Show Tooltip Guidance
    [Tags]    WorkInfoTooltipUI
    [Documentation]    ทดสอบการแสดง Tooltip แนะนำเมื่อกดที่ไอคอน และสามารถปิด/เปิดได้
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/WorkInfo/WorkInfoTooltipUI

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    WorkInfoTooltipUI1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
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


# Test Cases For Request Page
*** Test Cases ***
Test Sent Request On Request Page
    [Tags]    RequestSentLeaveRequest
    [Documentation]    ทดสอบการส่งคำขอลาหยุดในหน้า Request ว่าสามารถส่งได้สำเร็จ
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Request/leaveRequest

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    RequestSent1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    RequestSent2.png

    # เข้าหน้า Request
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[4]    RequestSent3.png

    # เทสการส่งคำขอแบบฟอร์มขอลาหยุด
    Click And Capture    xpath=//*[@id="formType"]    RequestSent4.png
    Click And Capture    xpath=//*[@id="formType"]/option[2]    RequestSent5.png

    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/select    RequestSent6.png
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/select/option[2]    RequestSent7.png
    
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[1]    RequestSent8.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[1]    04/16/2025
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[2]    RequestSent9.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[2]    04/20/2025
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[3]    RequestSent10.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[3]    กูจะนอน
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div/form/button    RequestSent11.png
    Click And Capture    xpath=/html/body/div[2]/div/div[6]/button[1]    RequestSent12.png
    Click And Capture    xpath=/html/body/div[2]/div/div[6]/button[1]     RequestSent13.png 
    Capture Page Screenshot    RequestSent14.png

Test Sent Request On Request Page 
    [Tags]    RequestSentOvertime
    [Documentation]    ทดสอบการส่งคำขอทำงานล่วงเวลาในหน้า Request ว่าสามารถส่งได้สำเร็จ
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Request/OvertimeRequest

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    OvertimeRequest1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    OvertimeRequest2.png

    # เข้าหน้า Request
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[4]    OvertimeRequest3.png

    # เทสการส่งคำขอแบบฟอร์มขอทำงานล่วงเวลา
    Click And Capture     xpath=//*[@id="formType"]    OvertimeRequest4.png
    Click And Capture     xpath=//*[@id="formType"]/option[3]    OvertimeRequest5.png

    Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[1]    OvertimeRequest6.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[1]    17/04/2025

    Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[2]    OvertimeRequest7.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[2]    09:00
    Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[3]    OvertimeRequest8.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[3]    17:00

    Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[4]    OvertimeRequest9.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[4]    ระบบมีปัญหา

    Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div/form/button    OvertimeRequest10.png
    Click And Capture     xpath=/html/body/div[2]/div/div[6]/button[1]    OvertimeRequest11.png
    Click And Capture     xpath=/html/body/div[2]/div/div[6]/button[1]    OvertimeRequest12.png
    Capture Page Screenshot    OvertimeRequest13.png

Test Sent Request On Request Page 
    [Tags]    RequestSentEditdatawork
    [Documentation]    ทดสอบการส่งคำขอแก้ไขข้อมูลการทำงานในหน้า Request ว่าสามารถส่งได้สำเร็จ
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Request/Editdatawork

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    Editdatawork1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    Editdatawork2.png

    # เข้าหน้า Request
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[4]    Editdatawork3.png

    # เทสการส่งคำขอแบบฟอร์มขอแก้ไขข้อมูลการทำงาน
    Click And Capture     xpath=//*[@id="formType"]    Editdatawork4.png
    Click And Capture     xpath=//*[@id="formType"]/option[4]    Editdatawork5.png

    Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[1]    Editdatawork6.png
    Execute JavaScript    var input = document.querySelectorAll('input')[0]; var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; nativeSetter.call(input, '2025-04-17T09:00'); input.dispatchEvent(new Event('input', { bubbles: true }));
    
    
    Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[2]    Editdatawork7.png
    Execute JavaScript    var input = document.querySelectorAll('input')[1]; var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; nativeSetter.call(input, '2025-04-17T17:00'); input.dispatchEvent(new Event('input', { bubbles: true }));
    
    Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[3]    Editdatawork8.png
    Execute JavaScript    var input = document.querySelectorAll('input')[2]; var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; nativeSetter.call(input, '2025-04-17T09:50'); input.dispatchEvent(new Event('input', { bubbles: true }));   
    
    Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[4]    Editdatawork9.png
    Execute JavaScript    var input = document.querySelectorAll('input')[3]; var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; nativeSetter.call(input, '2025-04-17T17:50'); input.dispatchEvent(new Event('input', { bubbles: true }))

    Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[5]    Editdatawork10.png
    Input Text    xpath=//*[@id="root"]/div/div/div[2]/div/form/div/input[5]    ระบบมเช็คอินมีปัญหา

    Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div/form/button    Editdatawork11.png
    Click And Capture     xpath=/html/body/div[2]/div/div[6]/button[1]    Editdatawork12.png
    Click And Capture     xpath=/html/body/div[2]/div/div[6]/button[1]    Editdatawork13.png
    Capture Page Screenshot    OvertimeRequest14.png

Test Click To See Details Request
    [Tags]    RequestClickSeeDetails
    [Documentation]    ทดสอบการกดปุ่ม “ดูรายละเอียด” ในประวัติแล้วข้อมูลแสดงถูกต้อง
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Request/ClickSeeDetails

    # Login
    Go To         ${BASE_URL}
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    ClickSeeDetails1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    ClickSeeDetails2.png

    # เข้าหน้า Request
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[4]    ClickSeeDetails3.png

    # กดปุ่มดูรายละเอียดการส่งคำขอ
    Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div/div[2]/div[1]/button    ClickSeeDetails4.png
    Wait Until Element Is Visible    xpath=//button[text()="ปิด"]    5s
    Click And Capture     xpath=//button[text()="ปิด"]    ClickSeeDetails5.png

    Capture Page Screenshot    ClickSeeDetails6.png

# Test Case For About Page
*** Test Cases ***
Test About Page
    [Tags]   AboutPage
    [Documentation]    ทดสอบการโหลดหน้า About ว่าข้อมูลถูกโหลดสำเร็จ พร้อม Navbar และตำแหน่งผู้ใช้งาน
    Set Screenshot Directory    ${EXECDIR}/results/Screenshots/About/AboutPage

    # ✅ Login
    Go To         ${BASE_URL}    
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    AboutPageLoadPage1.png
    Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240008
    Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
    Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    AboutPageLoadPage2.png

    # ✅ เข้าหน้า Request
    Click And Capture    xpath=//*[@id="root"]/div/div/div[1]/nav/div/div/div[2]/a[5]    AboutPageLoadPage3.png

    # ✅ เปิด Modal About
    Click And Capture    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[1]/div[2]/button    AboutPageLoadPage4.png

    # ✅ รอปุ่ม "ปิด" แล้วคลิกแบบ JS กันพลาด
    Wait Until Element Is Visible    xpath=//button[text()="ปิด"]    5s
    Execute JavaScript    [...document.querySelectorAll("button")].find(b => b.textContent.includes("ปิด")).scrollIntoView({block: 'center'})
    Execute JavaScript    [...document.querySelectorAll("button")].find(b => b.textContent.includes("ปิด")).click()

    # ✅ ถ่าย screenshot หลังปิด
    Capture Page Screenshot    AboutPageLoadPage5.png


# # Test Case For Setting Page
# # *** Test Cases ***
# Test Case Setting Page
#     [Tags]   SettingPage
#     [Documentation]    ทดสอบการโหลดหน้า Setting ว่าข้อมูลถูกโหลดสำเร็จ พร้อม Navbar และตำแหน่งผู้ใช้งาน
#     Set Screenshot Directory    ${EXECDIR}/results/Screenshots/Setting/SettingPage

#     # Login
#     Go To         ${BASE_URL}
#     Click And Capture    xpath=//*[@id="root"]/div/div/div/div/div[1]    SettingPageLoadPage1.png
#     Input Text    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[1]/div/input    20240001
#     Input Password    xpath=//*[@id="root"]/div/div/div/div[2]/form/div[2]/div/input    123456
#     Click And Capture    xpath=//*[@id="root"]/div/div/div/div[2]/form/button    SettingPageLoadPage2.png

#     # เข้าหน้า Setting
#     Click And Capture     xpath=/html/body/div/div/div/div[1]/nav/div/div/div[3]/div/div[1]/button    SettingPageLoadPage3.png
#     Click And Capture     xpath=/html/body/div/div/div/div[1]/nav/div/div/div[3]/div/div[2]/a[2]    SettingPageLoadPage4.png

#     # เช็คว่าสามรถแก้ไขข้อมูลได้
#     Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div[1]/div[3]/div/div/button    SettingPageLoadPage5.png
#     Input Text    xpath=//*[@id="root"]/div/div/div[2]/div[1]/div[3]/div/div/input    0823615465
#     Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div[1]/div[3]/div/div/button    SettingPageLoadPage6.png

#     Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div[1]/div[4]/div/div/button    SettingPageLoadPage7.png
#     Input Text    xpath=//*[@id="root"]/div/div/div[2]/div[1]/div[4]/div/div/input    80 หมู่ 28 ถ.แหยมศิริ บางดี จ.สตูล 69924
#     Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div[1]/div[4]/div/div/button    SettingPageLoadPage8.png

#     Wait Until Element Is Not Visible    css=.swal2-container    5s

#     Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[1]/input    SettingPageLoadPage9.png
#     Input Password    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[1]/input    123456
#     Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[1]/button    SettingPageLoadPage10.png

#     Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[2]/input    SettingPageLoadPage11.png
#     Input Password    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[2]/input    1234567890

#     Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[3]/input    SettingPageLoadPage12.png
#     Input Password    xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[3]/input    1234567890

#     Click And Capture     xpath=//*[@id="root"]/div/div/div[2]/div[2]/div[4]/button    SettingPageLoadPage13.png

#     Capture Page Screenshot    SettingPageLoadPage3.png

#     Sleep    3000