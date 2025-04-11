import React, { useState, useEffect, useRef } from "react";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [showCard, setShowCard] = useState(false);
  const [userData, setUserData] = useState({});
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const cardRef = useRef();

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  const fetchUserData = async () => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setUserData(snap.data());
      }
      try {
        const imageRef = ref(storage, `profileImages/${user.uid}.jpg`);
        const url = await getDownloadURL(imageRef);
        setProfileImgUrl(url);
      } catch (e) {
        setProfileImgUrl(""); // no image
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setShowCard(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header style={{
      width: "100%",
      backgroundColor: "#007bff",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white",
    }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: "bold" }}>Expense Tracker</h1>

      <div style={{ position: "relative" }} ref={cardRef}>
        <FaUserCircle
          size={32}
          onClick={() => setShowCard((prev) => !prev)}
          style={{ cursor: "pointer" }}
          title="Profile"
        />

        {showCard && (
          <div style={{
            position: "absolute",
            right: 0,
            top: "40px",
            background: "white",
            color: "#333",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            padding: "1rem",
            minWidth: "260px",
            zIndex: 999,
            animation: "fadeIn 0.3s ease-out",
          }}>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              {profileImgUrl ? (
                <img
                  src={profileImgUrl}
                  alt="Profile"
                  style={{ width: 64, height: 64, borderRadius: "50%" }}
                />
              ) : (
                <FaUserCircle size={64} color="#ccc" />
              )}
              <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>{userData.name || "No name"}</p>
            </div>

            <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem" }}><strong>Email:</strong> {user?.email}</p>
            <p style={{ fontSize: "0.85rem", marginBottom: "1rem" }}><strong>Phone:</strong> {userData.phone || "—"}</p>

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                width: "100%",
              }}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
};

export default Header;
