import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getDatabase, ref, get, set, remove } from "firebase/database";
import { v4 as uuid } from "uuid";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const database = getDatabase(app);
export const login = () => {
  signInWithPopup(auth, provider).catch((error) => {
    console.error(error);
  });
};

export const logout = () => {
  signOut(auth).catch((error) => {
    console.error(error);
  });
};

export const onUserStateChange = (callback) => {
  onAuthStateChanged(auth, async (user) => {
    const updateUser = user ? await adminUser(user) : null;
    callback(updateUser);
  });
};

function adminUser(user) {
  return get(ref(database, "admins")) //
    .then((snap) => {
      if (snap.exists()) {
        const admins = snap.val();
        const isAdmin = admins.includes(user.uid);
        return { ...user, isAdmin };
      }
      return user;
    });
}

export const addNewProduct = (prodcut, imageURL) => {
  const id = uuid();
  return set(ref(database, `products/${id}`), {
    ...prodcut,
    id,
    price: parseInt(prodcut.price),
    image: imageURL,
    options: prodcut.options.split(","),
  });
};

export const getProducts = async () => {
  return get(ref(database, "products")).then((snap) => {
    if (snap.exists()) {
      return Object.values(snap.val());
    } else {
      return [];
    }
  });
};

export const getCart = async (userId) => {
  return get(ref(database, `carts/${userId}`)) //
    .then((snap) => {
      const items = snap.val() || {};
      return Object.values(items);
    });
};

export const addOrUpdateToCart = async (userId, product) => {
  return set(ref(database, `carts/${userId}/${product.id}`), product);
};

export const removeFromCart = async (userId, productId) => {
  return remove(ref(database, `carts/${userId}/${productId}`));
};
