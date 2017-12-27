﻿using UnityEngine;
using System.Collections;
using System.Collections.Generic;

/* Effect Obj Pooling script created by Oussama Bouanani, SoumiDelRio.
 * This script is part of the Unity RTS Engine */

public class EffectObjPooling : MonoBehaviour {

	// Because instantiating and destroying objects uses a lot of memory and we will be spawning and hiding a lot objects during the game.
	// It's better not to destroy them but keep them inactive and re-use when needed.

	//Effect objects types:
	public enum EffectObjTypes {UnitDamageEffect, BuildingDamageEffect, AttackObjEffect};

	//Lists that include all the created (active and inactive) effect objects:
	public List<GameObject> UnitDamageEffects;
	public List<GameObject> BuildingDamageEffects;
	public List<GameObject> AttackObjEffects;

	//This method searches for a hidden effect object with a certain code so that it can be used again.
	public GameObject GetFreeEffectObj (EffectObjTypes Type, string Code)
	{
		//Determine which list of objects the script is going to search depending on the given type:
		List<GameObject> SearchList = new List<GameObject> ();
		switch (Type) {
		case EffectObjTypes.AttackObjEffect:
			SearchList = AttackObjEffects;
			break;
		case EffectObjTypes.BuildingDamageEffect:
			SearchList = BuildingDamageEffects;
			break;
		case EffectObjTypes.UnitDamageEffect:
			SearchList = UnitDamageEffects;
			break;
		default:
			break;
		}

		GameObject Result = null;
		//Loop through all the spawned objects in the target list:
		if (SearchList.Count > 0) {
			int i = 0;

			while (Result == null && i < SearchList.Count) {

				if (SearchList [i] != null) {
					//If the current object's code mathes the one we're looking for:
					if (SearchList [i].gameObject.GetComponent<EffectObj>().Code == Code) {
						//We can re-use non active objects, so we'll check for that as well:
						if (SearchList [i].gameObject.activeInHierarchy == false) {
							//This matches all what we're looking for so make it the result;
							Result = SearchList [i];
						}
					}
				}

				i++;
			}
		}

		//return the result:
		return Result;
	}
}
