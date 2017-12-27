using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Audio : audio
{

	// Use this for initialization
	public override void Start()
	{
		base.Start();
		playMainMenu();
	}

	// Update is called once per frame
	public override void Update()
	{
		base.Update();
	}

	public void playMainMenu()
	{
		base.forceIntro();
	}
}
