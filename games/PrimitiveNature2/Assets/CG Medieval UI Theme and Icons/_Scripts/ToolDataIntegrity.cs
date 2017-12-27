using UnityEngine;

public delegate string DataIntegrityDelegate();

public class ToolDataIntegrity {
    public static void CheckArgumentNullException(object arg, DataIntegrityDelegate dlg = null) {
        if (arg == null) {
            LogError("ArgumentNullException", dlg);
        }
    }

    public static void CheckNull(object arg, DataIntegrityDelegate dlg = null) {
        if (arg != null) {
            LogError(arg + " is not null", dlg);
        }
    }

    public static void CheckNotNull(object arg, DataIntegrityDelegate dlg = null) {
        if (arg == null) {
            LogError("NullReferenceException", dlg);
        }
    }

    private static void LogError(string msg, DataIntegrityDelegate dlg = null) {
        if (dlg == null) {
            Debug.LogError(msg);
        } else {
            Debug.LogError(msg + ". " + dlg());
        }
    }
}