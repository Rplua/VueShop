<template>
  <div class="d-flex flex-column min-vh-100">
      <Header />
    <div class="flex-grow-1">
      <RouterView />
    </div>
      <Footer />
  </div>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

export default {
  name: 'App',
  components: { Header, Footer },
}
</script>


