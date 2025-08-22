import { db } from "@/utility/fireBaseConfig";
import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

const productCollection = collection(db, "products");

export default {
    // CREATE
    async createProduct(productData) {
        const docRef = await addDoc(productCollection, productData);
        return { id: docRef.id, ...productData };
    },

    // READ ALL
    async getProducts() {
        const snapshot = await getDocs(productCollection); // ← getDocs sobre colección
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() })); // ← data()
    },

    // READ ONE
    async getProductById(id) {
        const ref = doc(db, "products", id); // ← "products", id
        const snapshot = await getDoc(ref);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    },

    // UPDATE
    async updateProduct(id, productData) {
        const ref = doc(db, "products", id); // ← "products", id
        await updateDoc(ref, productData);
        return { id, ...productData };
    },

    // DELETE
    async deleteProduct(id) {
        const ref = doc(db, "products", id);
        await deleteDoc(ref);
    },
};
