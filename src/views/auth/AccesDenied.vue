<template>
  <div class="container d-flex flex-column align-items-center justify-content-center vh-100">
    <div class="text-center">
      <h1 class="display-4 text-danger">
        <i class="bi bi-shield-lock-fill"></i> Access Denied
      </h1>
      <p class="lead">You do not have permission to view this page.</p>
      <router-link :to="{ name: APP_ROUTE_NAMES.HOME }" class="btn btn-primary mt-3">
        <i class="bi bi-house-door-fill"></i> Go Home
      </router-link>
    </div>
  </div>
</template>

<script>
import { APP_ROUTE_NAMES } from "@/constants/routeNames"

export default {
  name: "AccessDenied",
  setup() {
    return { APP_ROUTE_NAMES }
  }
}
</script>
