// dashboard.js
import { auth, db } from './firebaseConfig.js';
import { doc, getDoc, updateDoc, increment } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const mainBalance = document.getElementById("mainBalance");
const referralCount = document.getElementById("referralCount");
const refLink = document.getElementById("refLink");
const withdrawBtn = document.getElementById("withdrawBtn");
const withdrawForm = document.getElementById("withdrawForm");
const closeWithdraw = document.getElementById("closeWithdraw");
const withdrawalForm = document.getElementById("withdrawalForm");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      mainBalance.innerText = data.balance || 0;
      referralCount.innerText = data.referrals || 0;
      refLink.value = `${window.location.origin}/?ref=${user.uid}`;
    }
  } else {
    window.location.href = "index.html";
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

withdrawBtn.addEventListener("click", () => {
  withdrawForm.classList.remove("hidden");
});

closeWithdraw.addEventListener("click", () => {
  withdrawForm.classList.add("hidden");
});

withdrawalForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const today = new Date();
  const enableDate = new Date("2025-08-01");
  if (today < enableDate) {
    alert("Withdrawals not available until August 1st, 2025");
    return;
  }

  const bank = document.getElementById("bank").value;
  const accountNumber = document.getElementById("accountNumber").value;
  const amount = parseInt(document.getElementById("amount").value);

  const user = auth.currentUser;
  if (!user) return;

  const userDocRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userDocRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();

    if (amount < 5000) {
      alert("Minimum withdrawal amount is ₦5000");
      return;
    }

    if (userData.balance < amount) {
      alert("Insufficient balance");
      return;
    }

    // Deduct from user balance
    await updateDoc(userDocRef, {
      balance: userData.balance - amount
    });

    alert("Withdrawal submitted. You will be contacted shortly.");
    withdrawForm.classList.add("hidden");
  }
});
