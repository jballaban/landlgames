﻿using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.EventSystems;
using UnityEngine.Networking;

/* Resource script created by Oussama Bouanani, SoumiDelRio.
 * This script is part of the Unity RTS Engine */

public class Resource : MonoBehaviour {

	public string Name; //Resource name
	public string Code; //resource type code (many resources who share the same name (for example "wood") can have different codes to refer to different objects (different tree models).

	public bool CollectOutsideBorder = false; //can the player collect this resource outside the borders?
	public bool ShowCollectors = true; //show the collectors in the UI.
	public bool ShowAmount = true; //show the amount in the UI.

	[HideInInspector]
	public int ResourceID;
	[HideInInspector]
	public int ID;
	public int Amount = 1000; //Maximum amount of resource.
	public bool Infinite = false; //Collect this resource infinitely if this var is true.

	public GameObject ResourcePlane; //Shown when the resource is selected.
	public SelectionObj PlayerSelection; //Must be an object that only include this script, a trigger collider and a kinematic rigidbody.
	//the collider represents the boundaries of the object (building or resource) that can be selected by the player.

	[HideInInspector]
	public float FlashTime;

	public bool DestroyOnComplete = true; //Will the resource object be destroyed when the units collects it all.

	public float MaxDistance = 5.0f; //Minimum distance that the unit must stay at to collect his resource:

	public int MaxCollectors = 3; //maximum amount of collectors at same time.
	[HideInInspector]
	public List<Unit> CurrentCollectors;

	//The ID of the faction having borders that include this resource.
	[HideInInspector]
	public int FactionID = -1;

	public float CollectAmountPerSecond = 0.66f; //how much of this resource can a resource collector collect in each second.
	[HideInInspector]
	public float CollectOneUnitTime = 0.0f; //how much time is needed to collect 1 from the resource amount.

	SelectionManager SelectionMgr;
	ResourceManager ResourceMgr;
	void Start ()
	{
		ResourcePlane.gameObject.SetActive (false);

		CollectOneUnitTime = 1 / CollectAmountPerSecond;

		SelectionMgr = GameManager.Instance.SelectionMgr;
		ResourceMgr = GameManager.Instance.ResourceMgr;

		//Set the resource ID:
		ResourceID = ResourceMgr.GetResourceID(Name);

		//Set the selection object if we're using a different collider for player selection:
		if (PlayerSelection != null) {
			//set the player selection object for this building/resource:
			PlayerSelection.MainObj = this.gameObject;
		} else {
			Debug.LogError("Player selection collider is missing!");
		}

		//set the max building distance:
		if (gameObject.GetComponent<BoxCollider> ().size.x > gameObject.GetComponent<BoxCollider> ().size.y) {
			MaxDistance = gameObject.GetComponent<BoxCollider> ().size.x;
		} else {
			MaxDistance = gameObject.GetComponent<BoxCollider> ().size.y;
		}

		ResourceMgr.RegisterResource (this);
	}
		

	void Update ()
	{
		//Selection flash timer:
		if (FlashTime > 0) {
			FlashTime -= Time.deltaTime;
		}
		if (FlashTime < 0) {
			FlashTime = 0.0f;
			CancelInvoke ("SelectionFlash");
			ResourcePlane.gameObject.SetActive (false);
		}

	}

	//Flashing resource selection (when the player sends units to collect the resource, its texture flashes for some time):
	public void SelectionFlash ()
	{
		ResourcePlane.gameObject.SetActive (!ResourcePlane.activeInHierarchy);

	}

	void OnMouseDown ()
	{
		if (PlayerSelection == null) { //If we're not another collider for player selection, then we'll use the same collider for placement.
			if (!EventSystem.current.IsPointerOverGameObject ()) { //Make sure that the mouse is not over any UI element
				if (BuildingPlacement.IsBuilding == false)
					SelectionMgr.SelectResource (this);
			}
		}
	}

	//add a health to the building.
	public void AddResourceAmount (float Value, GatherResource Source)
	{
		//AddHealthLocal (Value, Source);

		if (GameManager.MultiplayerGame == false) {
			AddResourceAmountLocal (Value, Source);
		} else {
			if(GameManager.PlayerFactionID == Source.UnitMvt.FactionID) //if it's the local player.
			{
				//send input action to the MP faction manager if it's a MP game:
				MFactionManager.InputActionsVars NewInputAction = new MFactionManager.InputActionsVars ();
				NewInputAction.Source = gameObject.GetComponent<NetworkIdentity>().netId;
				NewInputAction.Target = Source.UnitMvt.netId;
				NewInputAction.StoppingDistance = Value;

				GameManager.Instance.Factions[Source.UnitMvt.FactionID].MFactionMgr.InputActions.Add (NewInputAction);
			}
		}
	}

	public void AddResourceAmountLocal (float Value, GatherResource Source)
	{
		Amount += Mathf.FloorToInt(Value);

		//if it's a multiplayer game and the unit belongs to the local player or a single player game.
		if (GameManager.MultiplayerGame == false || (GameManager.MultiplayerGame == true && Source.UnitMvt.FactionID == GameManager.PlayerFactionID)) {
			if (ResourceMgr.AutoCollect == true) { //if resources are automatically collected
				ResourceMgr.AddResource (Source.UnitMvt.FactionID, Name, -Mathf.FloorToInt (Value)); //then add the resource to the faction
			} else {
				//if we need to drop off resources
				if (Source.DropOff [ResourceID].CurrentQuantity >= Source.MaxHoldQuantity) { //make sure that we have the max quantity.
					Source.GoingToDropOffBuilding = false; //start as stating the unit is not going to the drop off building yet.
					Source.DroppingOff = true; //but is actually at the phase at picking the drop off building.
					Source.UnitMvt.SetAnimState (Unit.UnitAnimState.Idle);
					Source.SendUnitToDropOffResources (); //send the player to drop off resources
					AudioManager.StopAudio (gameObject); //stop the collection audio.

					//hide the collection obj:
					if (Source.CurrentCollectionObj != null) {
						Source.CurrentCollectionObj.SetActive (false);
					}
					//activate the drop off object:
					if (Source.DropOffObj != null) {
						Source.DropOffObj.SetActive (true);
					}
				} else {
					Source.DropOff [Source.TargetResource.ResourceID].CurrentQuantity += -Mathf.FloorToInt (Value); //if we haven't reached the max amount to drop off, keep collecting
				}
			}

			if (Amount <= 0) { //if the resource is empty
				DestroyResource (Source);
			}
		}

		//If the target resource is the one that's selected:
		if (SelectionMgr.SelectedResource == this) {
			//Update the resource UI:

			SelectionMgr.UIMgr.UpdateResourceUI (this);
		}
	}

	public void DestroyResource (GatherResource Source)
	{
		//custom event:
		Source.UnitMvt.GameMgr.Events.OnResourceEmpty(this);

		Source.UnitMvt.CancelCollecting();
		//stop collecting
		Source.UnitMvt.CancelCollecting();

		if (DestroyOnComplete == true) { //if the resource is meant to be destroyed when it has 0 amount
			if (gameObject.GetComponent<Treasure> ()) {
				Treasure Treasure = gameObject.GetComponent<Treasure> ();
				if (Treasure.Resources.Length > 0) {
					for (int i = 0; i < Treasure.Resources.Length; i++) { //go through all the resources to reward
						ResourceMgr.AddResource(Source.UnitMvt.FactionID,Treasure.Resources[i].Name, Treasure.Resources[i].Amount);
					}

					//play the claimed reward sound:
					if (GameManager.PlayerFactionID == Source.UnitMvt.FactionID && Treasure.ClaimedAudio != null) { //only if the unit is the local player's faction:
						AudioManager.PlayAudio (Source.UnitMvt.GameMgr.GeneralAudioSource.gameObject, Treasure.ClaimedAudio, false);
					}
					//create the effect
					if (Treasure.ClaimedEffect != null) {
						Instantiate (Treasure.ClaimedEffect, transform.position, Treasure.ClaimedEffect.transform.rotation);
					}
				}
			}

			//remove resource from list:
			GameManager.Instance.ResourceMgr.AllResources.Remove(this);

			//if it's a single player game:
			if (GameManager.MultiplayerGame == false) {
				//automatically destroy the resource object.
				Destroy (gameObject);
			}
			//multiplayer game:
			else {
				//if this is the local player that is gathering the resource:
				if (GameManager.PlayerFactionID == Source.UnitMvt.FactionID) {
					//ask the server to destroy it then:
					Source.UnitMvt.MFactionMgr.TryToDestroyResource(gameObject.GetComponent<NetworkIdentity>().netId);
				}
			}
		}
	}
}
