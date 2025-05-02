// auth.js
import { auth, db } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { doc, setDoc, getDoc, updateDoc, increment } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

// Paystack public key
const paystackKey = "pk_live_b5fa4e730d9baa38f7ff012ad4d263d5d3459c5b";

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signupForm.email.value;
    const password = signupForm.password.value;
    const referral = signupForm.referral.value || null;

    // Start Paystack Payment
    let handler = PaystackPop.setup({
      key: paystackKey,
      email: email,
      amount: 20000, // ₦200 in kobo
      callback: async function(response) {
        try {
          const userCred = await createUserWithEmailAndPassword(auth, email, password);
          const userId = userCred.user.uid;

          await setDoc(doc(db, "users", userId), {
            email,
            balance: 0,
            referrals: 0,
            referralCode: userId,
            referredBy: referral
          });

          if (referral) {
            const refUser = await getDoc(doc(db, "users", referral));
            if (refUser.exists()) {
              await updateDoc(doc(db, "users", referral), {
                balance: increment(50),
                referrals: increment(1)
              });
            }
          }

          window.location.href = "dashboard.html";
        } catch (error) {
          alert("Signup error: " + error.message);
        }
      },
      onClose: function() {
        alert('Transaction was not completed, window closed.');
      }
    });
    handler.openIframe();
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Login error: " + error.message);
    }
  });
}
