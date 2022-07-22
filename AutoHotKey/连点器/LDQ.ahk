#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
#SingleInstance FORCE
#Persistent
#HotkeyInterval 100
#MaxHotkeysPerInterval 1000
#InstallMouseHook
#InstallKeybdHook

bTestVer := True

Stop := 0
Delay := 0
DelayT := 0
Hold_old := 0
Hotkey := F8
Hotkey_old = F8
Mode := "Event"
Mode_old := "Event"
First := True

clickState := false
L_old := 0
M_old := 0
R_old := 0

SetTimer , OnClick, 0

Hotkey, %Hotkey_old%, HK_Trig

;系统任务菜单
if (bTestVer)
{
	menu, tray, add
	menu, Tray, add, Event, MenuHandler
	menu, Tray, add, Input, MenuHandler
	menu, Tray, add, InputThenPlay , MenuHandler
	menu, Tray, add, Play, MenuHandler
	menu, tray, add
}
else
{
	menu, tray, NoStandard
}
Menu, tray, Add, 设置, MenuHandler
Menu, tray, Default, 设置
menu, tray, add
if (not A_IsCompiled)
{
	menu, tray, add, 编辑, MenuHandler
	menu, tray, add, 重载, MenuHandler
	menu, tray, add, 测试, MenuHandler
	menu, tray, add 
}
menu, tray, add, 退出, MenuHandler

;设置界面
Gui, Add, GroupBox, w255 r1.4 section, 连击键
Gui, Add, Checkbox, vLButton r1.1 xp+18 yp+21, 左键
Gui, Add, Checkbox, vMButton r1.1 xp+88, 中键
Gui, Add, Checkbox, vRButton r1.1 xp+88, 右键
Gui, Add, GroupBox, w255 r1.4 xs section, 连点间隔
Gui, Add, Text, r1.1 xp+18 yp+21, 点击间隔
Gui, Add, DDL, vDelay w48 R19 xp+52 yp-4, 0||0.01|0.02|0.03|0.04|0.05|0.1|0.3|0.5|1|2|3|4|5|6|7|8|9|10
Gui, Add, Text, r1.1 xp+53 yp+4, 秒
Gui, Add, Checkbox, vRandom r1.1 xp+44 yp-1, 间隔内随机
Gui, Add, GroupBox, w255 r1.4 xs section, 鼠标连点热键
Gui, Add, Text, r1.1 xp+18 yp+21, 热键
;Gui, Add, Hotkey, vHotkey r1.1 w120 xp+25 yp-5
Gui, Add, DDL, vHotkey w48 r12 xp+35 yp-5, F1|F2|F3|F4|F5|F6|F7|F8||F9|F10|F11|F12
Gui, Add, Checkbox, vHold r1.1 xp+125 yp+4, 按住触发
Gui, Add, GroupBox, w255 r1.4 xs section, 键盘按住连点
Gui, Add, Checkbox, vNum r1.1 xp+18 yp+21, 0-9
Gui, Add, Checkbox, vLetter r1.1 xp+90 , a-z
Gui, Add, Checkbox, vDirection r1.1 xp+70 , ↑↓←→
Gui, Add, GroupBox, w255 r1.4 xs section, 设置
Gui, Add, Text, r1.1 xp+18 yp+21, 发送模式
Gui, Add, DDL, vMode w102 R4 xp+52 yp-4, Event||Input|InputThenPlay|Play
Gui, Add, Checkbox, vFirst r1.1 xp+109 yp+4, 首发间隔

Gui, +AlwaysOnTop
OnMessage(0x111, "WM_COMMAND")
GuiControl, , LButton, 1
GuiControl, , First, 1
Menu, Tray, Icon, ico/0100.ico
Gui, Show, xCenter, 连点器

return

WM_COMMAND(wParam, lParam, msg, hwnd)
{
	global
	if (A_Gui = 1 and msg = 273)
	{
		GuiControlGet, LButton
		GuiControlGet, MButton
		GuiControlGet, RButton
		GuiControlGet, Delay
		GuiControlGet, Random
		GuiControlGet, Hotkey
		GuiControlGet, Hold
		GuiControlGet, Mode
		GuiControlGet, First
		
		GuiControlGet, Direction
		
		;tempText = LButton`t`t%LButton%`nMButton`t%MButton%`nRButton`t`t%RButton%`nDelay`t`t%Delay%`nRandom`t%Random%`nHotkey`t`t%Hotkey%`nHold`t`t%Hold%`nMode`t`t%Mode%`nFirst`t`t%First%
		;ToolTip %tempText%
		DelayT := Delay * 1000
		if (Hotkey != Hotkey_old)
		{
			Hotkey, %Hotkey_old%, Off
			Hotkey_old := Hotkey
			if Hotkey
			{
				Hotkey, %Hotkey%, HK_Trig
			}
		}
		if (Hold_old != Hold)
		{
			clickState := False
			if Hold
			{
				Hotkey, %Hotkey%, Off
			}
			else
			{
				Hotkey, %Hotkey%, On
			}
			Hold_old := Hold
		}
		if (Mode_old != Mode)
		{
			SendMode %Mode%
			Mode_old := Mode
		}
		;IconNumber := Hold * 8 + LButton * 4 + MButton * 2 + RButton * 1 + 1
		;Menu, Tray, Icon, LDQ.dll, %IconNumber%
		IconName := Hold . LButton . MButton . RButton
		;Traytip, , %IconName%
		Menu, Tray, Icon, ico/%IconName%.ico
	}
}

MenuHandler:
{
	if (A_ThisMenuItem == "设置")
	{
		Gui, Show
	}
	else if (A_ThisMenuItem="编辑")
	{
		Edit
	}
	else if (A_ThisMenuItem="重载")
	{
		Reload
	}
	else if (A_ThisMenuItem="测试")
	{
		return
	}
	else if (A_ThisMenuItem="退出")
	{
		ExitApp
	}
	else if (A_ThisMenuItem="Event")
	{
		SendMode Event
	}
	else if (A_ThisMenuItem="Input")
	{
		SendMode Input
	}
	else if (A_ThisMenuItem="InputThenPlay")
	{
		SendMode InputThenPlay
	}
	else if (A_ThisMenuItem="Play")
	{
		SendMode Play
	}
}
return

OnClick1:
{
	if clickState
		Click
	GetKeyState, Var1, LButton
	GetKeyState, Var2, LButton, P
	GetKeyState, Var3, LButton, T
	TrayTip, , D:%Var1%`nP:%Var2%`nT:%Var3%
}
return


OnClick:
{
	if Stop
	{
		return
	}
	
	if Hold
	{
		L := GetKeyState("LButton", "P")
		M := GetKeyState("MButton", "P")
		R := GetKeyState("RButton", "P")
		;TrayTip, , %L%`n%M%`n%R%
		if (First and ((L and Not L_old) or (M and Not M_old) or (R and Not R_old)))
		{
			sleep, 300
		}
		else
		{
			SendClick(L, M, R)
		}
		L_old := L
		M_old := M
		R_old := R
	}
	else
	{
		if clickState
		{
			SendClick(1, 1, 1)
		}
	}
	Up := GetKeyState("Up", "P")
	Down := GetKeyState("Down", "P")
	Left := GetKeyState("Left", "P")
	Right := GetKeyState("Right", "P")
	if Direction
	{
		if Up
			Send {Up}
		if Down
			Send {Down}
		if Left
			Send {Left}
		if Right
			Send {Right}
	}
}
return

SendClick(L, M, R)
{
	global
	if LButton and L
	{
		Click
		Click up
	}
	if MButton and M
	{
		Click Middle
		Click Up Middle
	}
	if RButton and R
	{
		Click Right
		Click Up Right
	}
	if Random and DelayT
	{
		Random, t, , DelayT
	}
	else
		t := DelayT
	sleep, t
}

ClickButton:
{
	Click
	sleep, DelayT
}
return

;全局暂停
`::
{
	Stop := Not Stop
;	Suspend, On
;	Pause, On
}
return

HK_Trig:
{
	clickState := Not clickState
}
return

