using UnityEngine;
using UnityEngine.UI;

public class GuiPanelConvert : MonoBehaviour {
    [SerializeField]
    private Text _valueLeft;
    [SerializeField]
    private Text _valueRight;
    [SerializeField]
    private Slider _slider;

    private void Awake() {
        const int maxValue = 100;
        _slider.wholeNumbers = true;
        _slider.onValueChanged.AddListener(SetLeftToRight);
        _slider.minValue = -maxValue;
        _slider.maxValue = maxValue;
        _slider.value = 0;
    }
    
    private void SetLeftToRight(float value) {
        _valueLeft.text = "" + (-value);
        _valueRight.text = "" + (value);
    }
}