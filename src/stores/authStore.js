import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth, db, firebaseApp } from '@/utility/fireBaseConfig'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { ROLE_ADMIN, ROLE_USER } from '@/constants/appConstants'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref(null)
  const error = ref(null)
  const isLoading = ref(false)
  const role = ref(null)
  const initialized = ref(false)
  const isAuthenticated = computed(() => user.value != null)
  const isAdmin = computed(() => role.value === ROLE_ADMIN)

  const initializedAuth = async () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        user.value = firebaseUser
        await fetchUserRole(firebaseUser.uid)
        initialized.value = true
      }
      if (!firebaseUser) {
        clearUser()
      }
    })
  }

  const fetchUserRole = async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid))
    role.value = userDoc.exists ? userDoc.data().role : ''
  }

  const signUpUser = async (email, password) => {
    isLoading.value = true
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', userCredentials.user.uid), {
        email: userCredentials.user.email,
        role: ROLE_USER,
        createdAt: new Date(),
      })

      clearUser()
      error.value = null
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const clearUser = () => {
    user.value = null
    role.value = null
  }

  const signInUser = async (email, password) => {
    isLoading.value = true
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredentials.user
      error.value = null
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const signOutUser = async () => {
    isLoading.value = true
    try {
      await signOut(auth)
      clearUser()
      error.value = null
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    error,
    isLoading,
    role,
    isAuthenticated,
    isAdmin,
    initialized,
    signUpUser,
    signInUser,
    initializedAuth,
    signOutUser,
  }
})
