using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Audio : MonoBehaviour
{
	private float bpm = 150.0F;
	private int beatsPerMeasure = 4;
	Object[] AudioArray_intro;
	Object[] AudioArray_battle1;
	Object[] AudioArray_battle2;
	Object[] AudioArray_battle3;
	Object[] AudioArray_trans;
	private double singleMeasureTime;
	private double delayEvent;
	private AudioSource audio_explorationA;
	private AudioSource audio_explorationB;
	private AudioSource audio_battleA;
	private AudioSource audio_battleB;
	private AudioSource audio_melody;
	private AudioSource audio_trans;
	private AudioSource audio_start_end;

	// Use this for initialization
	public void Start()
	{
		audio_explorationA = (AudioSource)gameObject.AddComponent<AudioSource>();
		audio_explorationB = (AudioSource)gameObject.AddComponent<AudioSource>();
		audio_melody = (AudioSource)gameObject.AddComponent<AudioSource>();
		audio_battleA = (AudioSource)gameObject.AddComponent<AudioSource>();
		audio_battleB = (AudioSource)gameObject.AddComponent<AudioSource>();
		audio_trans = (AudioSource)gameObject.AddComponent<AudioSource>();
		audio_start_end = (AudioSource)gameObject.AddComponent<AudioSource>();
		AudioArray_intro = Resources.LoadAll("epic_battle/intro", typeof(AudioClip));
		AudioArray_battle1 = Resources.LoadAll("epic_battle/battle1", typeof(AudioClip));
		AudioArray_battle2 = Resources.LoadAll("epic_battle/battle2", typeof(AudioClip));
		AudioArray_battle3 = Resources.LoadAll("epic_battle/battle3", typeof(AudioClip));
		AudioArray_trans = Resources.LoadAll("epic_battle/trans", typeof(AudioClip));
	}

	// Update is called once per frame
	public void Update()
	{

	}
}
