using System;
using UnityEngine;
using UnityEngine.UI;

public class UiButtonList : MonoBehaviour {
    [SerializeField]
    private Button[] _buttons;

    public int GetLength() {
        return _buttons.Length;
    }

    public Button GetButton(int index) {
        if (index >= GetLength()) {
            throw new ArgumentOutOfRangeException(index + " out of max " + GetLength());
        }
        return _buttons[index];
    }

    public void CheckFieldsIsNotNull() {
        for (var i = 0; i < _buttons.Length; i++) {
            ToolDataIntegrity.CheckNotNull(_buttons[i]);
        }
    }
}