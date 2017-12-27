using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Volume : MonoBehaviour
{
	public Slider volumeSlider;

	public void OnValueChanged()
	{
		AudioListener.volume = volumeSlider.value;


	}
}
