Sub TestSheet()
    Application.Calculation = xlCalculationAutomatic
    Workbooks("EXAMPLE_CALCULATIONS.xlsm").Activate
    Dim i As Integer
    Dim N As Integer
    N = 29
    Application.ScreenUpdating = False
    For i = 0 To N
        Sheets("testing").Range("B3:B4").Offset(0, i).Copy
        Sheets("model").Select
        Range("B1:B2").Select
        Selection.PasteSpecial Paste:=xlPasteValues

        Sheets("testing").Range("B5:B5").Offset(0, i).Copy
        Sheets("model").Select
        Range("C3:C3").Select
        Selection.PasteSpecial Paste:=xlPasteValues

        
        Sheets("model").Range("D19:D19").Copy
        Sheets("testing").Select
        Range("B7:B7").Offset(0, i).Select
        Selection.PasteSpecial Paste:=xlPasteValues
        
        Sheets("model").Range("E29:E29").Copy
        Sheets("testing").Select
        Range("B8:B8").Offset(0, i).Select
        Selection.PasteSpecial Paste:=xlPasteValues
        
        Sheets("model").Range("D35:D35").Copy
        Sheets("testing").Select
        Range("B9:B9").Offset(0, i).Select
        Selection.PasteSpecial Paste:=xlPasteValues
        
        Sheets("model").Range("E36:E36").Copy
        Sheets("testing").Select
        Range("B10:B10").Offset(0, i).Select
        Selection.PasteSpecial Paste:=xlPasteValues
        
        Sheets("model").Range("D43:D43").Copy
        Sheets("testing").Select
        Range("B11:B11").Offset(0, i).Select
        Selection.PasteSpecial Paste:=xlPasteValues
        
        Sheets("model").Range("D51:D51").Copy
        Sheets("testing").Select
        Range("B12:B12").Offset(0, i).Select
        Selection.PasteSpecial Paste:=xlPasteValues
        
        Sheets("model").Range("C27:C27").Copy
        Sheets("testing").Select
        Range("B13:B13").Offset(0, i).Select
        Selection.PasteSpecial Paste:=xlPasteValues
        
        Sheets("model").Range("B27:B27").Copy
        Sheets("testing").Select
        Range("B14:B14").Offset(0, i).Select
        Selection.PasteSpecial Paste:=xlPasteValues
        
        Sheets("model").Range("D28:D28").Copy
        Sheets("testing").Select
        Range("B15:B15").Offset(0, i).Select
        Selection.PasteSpecial Paste:=xlPasteValues

    Next i
    Application.ScreenUpdating = True
End Sub

