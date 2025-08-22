<template>
  <div class="container">
    <div class="row border p-4 my-5 rounded">
      <div class="col-9">
        <form @submit.prevent="handleSubmit">
          <div class="h2 text-center text-success">{{ productIdForUpdate ? 'Update' : 'Create' }} Product</div>
          <hr />

          <div v-if="errorList.length" class="alert alert-danger pb-0">
            Please fix the following errors:
            <ul>
              <li v-for="error in errorList" :key="error">{{ error }}</li>
            </ul>
          </div>

          <div class="mt-3">
            <span class="text-muted">Name</span>
            <input type="text" v-model.trim="productObj.name" class="form-control" />
          </div>

          <div class="mt-3">
            <span class="text-muted">Description</span>
            <textarea v-model="productObj.description" class="form-control"></textarea>
          </div>

          <div class="mt-3">
            <span class="text-muted">Price</span>
            <input type="number" v-model.number="productObj.price" class="form-control" />
          </div>

          <div class="mt-3">
            <span class="text-muted">Sale Price</span>
            <input type="number" v-model.number="productObj.salePrice" class="form-control" />
          </div>

          <div class="mt-3">
            <span class="text-muted">Tags (comma-separated)</span>
            <input
              type="text"
              class="form-control"
              v-model="productObj.tags"
              placeholder="e.g., modern, classic, luxury"
            />
          </div>

          <div class="form-check form-switch pt-3">
            <input class="form-check-input" type="checkbox" role="switch" v-model="productObj.isBestSeller" id="bestseller" />
            <label class="form-check-label" for="bestseller">Bestseller</label>
          </div>

          <div class="mt-3">
            <label class="text-muted">Category</label>
            <select class="form-select" v-model="productObj.category">
              <option v-for="option in PRODUCT_CATEGORIES" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Image</label>
            <div class="input-group">
              <input
                type="file"
                class="form-control"
                accept="image/*"
                @change="handleImageUpload"
                :disabled="isImageLoading"
              />
            </div>
          </div>

          <div class="pt-3">
            <button class="btn btn-success m-2 w-25" :disabled="loading || isImageLoading">
              <span v-if="loading || isImageLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ productIdForUpdate ? 'Update' : 'Create' }} Product
            </button>
            <router-link :to="{ name: APP_ROUTE_NAMES.PRODUCT_LIST }" class="btn btn-secondary m-2 w-25">Cancel</router-link>
          </div>
        </form>
      </div>

      <div class="col-3">
        <img
          :src="productObj.image || 'https://placehold.co/600x400'"
          class="img-fluid w-100 m-3 p-3 rounded"
          alt="Product preview"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PRODUCT_CATEGORIES } from '@/constants/appConstants'
import { useSwal } from '@/utility/useSwal'
import productService from '@/services/productService'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { uploadToCloudinary } from '@/utility/cloudinary'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { showSuccess, showError } = useSwal()

    const loading = ref(false)
    const isImageLoading = ref(false)
    const errorList = ref([])

    const productObj = reactive({
      name: '',
      description: '',
      price: 0,
      salePrice: null,
      tags: '',                 
      isBestSeller: false,     
      category: '',
      image: ''                 
    })

    const productIdForUpdate = route.params.id

    onMounted(async () => {
      if (!productIdForUpdate) return
      loading.value = true
      try {
        const product = await productService.getProductById(productIdForUpdate)
        Object.assign(productObj, {
          ...product,
          tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
        })
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
      }
    })

    const handleSubmit = async () => {
      errorList.value.length = 0
      loading.value = true

      if (productObj.name.length < 3) errorList.value.push('Name should be at least 3 characters long')
      if (productObj.price <= 0) errorList.value.push('Price should be greater than 0')
      if (!productObj.category) errorList.value.push('Please select a category')

      try {
        if (!errorList.value.length) {
          const productData = {
            ...productObj,
            price: Number(productObj.price),
            salePrice: productObj.salePrice ? Number(productObj.salePrice) : null,
            tags: productObj.tags
              ? productObj.tags.split(',').map(t => t.trim()).filter(Boolean)
              : [],
            bestSeller: Boolean(productObj.isBestSeller), 
          }

          if (productIdForUpdate) {
            await productService.updateProduct(productIdForUpdate, productData)
            showSuccess('Product updated successfully')
          } else {
            await productService.createProduct(productData)
            showSuccess('Product created successfully')
          }

          router.push({ name: APP_ROUTE_NAMES.PRODUCT_LIST })
        }
      } catch (e) {
        console.error(e)
        showError?.('Unexpected error creating product')
      } finally {
        loading.value = false
      }
    }

    const handleImageUpload = async (event) => {
      const file = event.target.files?.[0]
      if (!file) return
      try {
        isImageLoading.value = true
        const imageUrl = await uploadToCloudinary(file)
        productObj.image = imageUrl
      } catch (err) {
        console.error(err)
        showError?.('Image upload failed')
      } finally {
        isImageLoading.value = false
      }
    }

    return {
      productObj,
      loading,
      isImageLoading,
      errorList: errorList.value, 
      PRODUCT_CATEGORIES,
      APP_ROUTE_NAMES,
      productIdForUpdate,
      handleSubmit,
      handleImageUpload,
    }
  }
}
</script>
