using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GuiRadioBtn : MonoBehaviour {
    [SerializeField]
    private UiRadio[] _radios;

    private void Awake() {
        if (_radios.Length == 0) {
            Debug.Log("WTF?");
            return;
        }

        for (var i = 0; i < _radios.Length; i++) {
            _radios[i].Init();
            var selectedIndex = i;
            _radios[i].Button.onClick.AddListener(() => { RefreshRadioMusic(_radios, selectedIndex); });
        }

        RefreshRadioMusic(_radios, 0);
    }

    private void RefreshRadioMusic(IList<UiRadio> buttons, int selectedIndex) {
        for (var i = 0; i < buttons.Count; i++) {
            buttons[i].Button.interactable = i != selectedIndex;
        }
    }
}