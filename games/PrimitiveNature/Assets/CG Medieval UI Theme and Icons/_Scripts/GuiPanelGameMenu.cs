using UnityEngine;
using UnityEngine.UI;

public class GuiPanelGameMenu : MonoBehaviour
{
	// === Unity ======================================================================================================
	[SerializeField]
	private Button _btnResume;
	[SerializeField]
	private Button _btnOptions;
	[SerializeField]
	private Button _btnHelp;
	[SerializeField]
	private Button _btnExitGame;

	private void Awake()
	{
		CheckFieldsIsNotNull();

		_btnOptions.interactable = false;
		_btnHelp.interactable = false;
	}

	private void CheckFieldsIsNotNull()
	{
		ToolDataIntegrity.CheckNotNull(_btnResume);
		ToolDataIntegrity.CheckNotNull(_btnOptions);
		ToolDataIntegrity.CheckNotNull(_btnHelp);
		ToolDataIntegrity.CheckNotNull(_btnExitGame);
	}
}