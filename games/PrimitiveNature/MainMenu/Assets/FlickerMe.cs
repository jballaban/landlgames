using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FlickerMe : MonoBehaviour
{

	private Light firelight;

	// Use this for initialization
	void Start()
	{
		this.firelight = this.GetComponent<Light>();
	}

	// Update is called once per frame
	void Update()
	{
		this.firelight.intensity = 1 + 0.1f * Mathf.Sin(Time.time * 100);
	}
}
