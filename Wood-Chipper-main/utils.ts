
export const handleFirebaseError = (err: any) => {
    console.error("Firebase Operation Failed:", err);

    const msg = err.message || JSON.stringify(err);

    if (msg.includes("PERMISSION_DENIED")) {
        alert(
            "❌ PERMISSION DENIED\n\n" +
            "Your Firebase Database Rules are blocking this request.\n" +
            "1. Go to Firebase Console > Realtime Database > Rules\n" +
            "2. Change rules to:\n" +
            '   {\n     "rules": {\n       ".read": true,\n       ".write": true\n     }\n   }'
        );
    } else if (msg.includes("Network Error") || msg.includes("network")) {
        alert("❌ NETWORK ERROR\n\nPlease check your internet connection.");
    } else {
        alert("❌ OPERATION FAILED\n\nError: " + msg + "\n\nCheck console for details.");
    }
};
