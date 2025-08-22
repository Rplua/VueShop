    <template>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <img src="../../assets/logo.png" style="width: 40px" class="mx-3" alt="logo" />
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <router-link class="nav-link active" aria-current="page"
                                :to="{ name: APP_ROUTE_NAMES.HOME }">Home</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link active" aria-current="page"
                                :to="{ name: APP_ROUTE_NAMES.PRODUCT_LIST }">Product</router-link>
                        </li>
                        <li class="nav-item" v-if="checkIfAdmin">
                            <router-link class="nav-link active" aria-current="page"
                                :to="{ name: APP_ROUTE_NAMES.PRODUCT_CREATE }">Add Product</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link active" aria-current="page"
                                :to="{ name: APP_ROUTE_NAMES.CONTACT_US }">Contact Us</router-link>
                        </li>
                    </ul>
                    <ul class="d-flex navbar-nav">
                        <li class="nav-link" v-if="authStore.isAuthenticated">
                            Welcome, {{ authStore.user?.email }}
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                <i class="bi bi-laptop"></i>
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <button @click="themeStore.setTheme('light')" class="dropdown-item" href="#">
                                        <i class="bi bi-emoji-sunglasses-fill"></i> Light
                                    </button>
                                </li>
                                <li>
                                    <button @click="themeStore.setTheme('dark')" class="dropdown-item" href="#">
                                        <i class="bi bi-moon-fill"></i> Dark
                                    </button>
                                </li>
                            </ul>
                        </li>
                        <li class="nav-item" v-if="!authStore.isAuthenticated">
                            <router-link class="nav-link active" aria-current="page"
                                :to="{ name: APP_ROUTE_NAMES.SIGN_IN }">Sign in</router-link>
                        </li>
                        <li class="nav-item" v-if="!authStore.isAuthenticated">
                            <router-link class="nav-link active" aria-current="page"
                                :to="{ name: APP_ROUTE_NAMES.SIGN_UP }">Sign up</router-link>
                        </li>
                        <li class="nav-item" v-if="authStore.isAuthenticated">
                            <button @click="handleSignOut" class="nav-link">Sign out</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </template>
<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router' // <-- esto
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'

export default {
    name: 'Header',
    setup() {
        const router = useRouter()
        const themeStore = useThemeStore()
        const authStore = useAuthStore()

        const checkIfAdmin = computed(() => {
            if (!authStore.isAuthenticated) {
                return false
            }
            if (authStore.isAdmin) {
                return true
            }
            return false
        })

        const handleSignOut = async () => {
            try {
                await authStore.signOutUser()
                router.push({ name: APP_ROUTE_NAMES.HOME })
            } catch (e) {
                console.error('Sign out error:', e)
            }
        }

        return { router, APP_ROUTE_NAMES, themeStore, authStore, handleSignOut, checkIfAdmin }
    },
}
</script>
