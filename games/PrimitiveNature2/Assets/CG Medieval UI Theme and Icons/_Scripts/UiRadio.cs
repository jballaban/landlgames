using System;
using UnityEngine;
using UnityEngine.UI;

[Serializable]
public class UiRadio {
    public GameObject Radio;
    public Button Button { get; private set; }
    public RectTransform Rect { get; private set; }
    public Image Image { get; private set; }

    public virtual void Init() {
        ToolDataIntegrity.CheckNotNull(Radio);

        Button = Radio.GetComponent<Button>();
        ToolDataIntegrity.CheckNotNull(Button);

        Rect = Radio.GetComponent<RectTransform>();
        ToolDataIntegrity.CheckNotNull(Rect);

        Image = Radio.GetComponent<Image>();
        ToolDataIntegrity.CheckNotNull(Image);
    }
}