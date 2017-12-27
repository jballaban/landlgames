using UnityEngine;
using UnityEngine.UI;

public class GuiPanelCampaign : MonoBehaviour {
    // === Unity ======================================================================================================
    [SerializeField]
    private Button _btnBack;
    [SerializeField]
    private UiButtonList _episode1;
    [SerializeField]
    private UiButtonList _episode2;
    
    private void Awake() {
        CheckFieldsIsNotNull();

        for (var i = (int)(_episode2.GetLength() * .5f); i < _episode2.GetLength(); i++) {
            _episode2.GetButton(i).interactable = false;
        }
    }

    private void CheckFieldsIsNotNull() {
        ToolDataIntegrity.CheckNotNull(_btnBack);
        ToolDataIntegrity.CheckNotNull(_episode1);
        ToolDataIntegrity.CheckNotNull(_episode2);

        _episode1.CheckFieldsIsNotNull();
        _episode2.CheckFieldsIsNotNull();
    }
}