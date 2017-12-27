using UnityEngine;
using UnityEngine.UI;

public class GuiProgressBar : MonoBehaviour {
    [SerializeField]
    private Scrollbar _progressBar;
    [SerializeField]
    private Text _value;
    [SerializeField]
    private float _speed = 1;
    //
    private bool _isInc;
    private float _size;

    private void Awake() {
        _size = 0;
        _isInc = true;
        UpdateProgressBar();
    }

    private void Update() {
        var offset = Time.deltaTime * _speed;
        if (_isInc) {
            _size += offset;
            if (_size > 1f) {
                _size = 1f;
                _isInc = !_isInc;
            }
        } else {
            _size -= offset;
            if (_size < 0f) {
                _size = 0f;
                _isInc = !_isInc;
            }
        }
        UpdateProgressBar();
    }

    private void UpdateProgressBar() {
        _progressBar.size = _size;

        if(_value == null) { return; }

        var result = "" + (int) (_size * 100);
        _value.text = result;
    }
}