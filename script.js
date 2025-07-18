// Global Variables
let products = [
  {
    id: 1,
    name: "Elegant Silk Saree",
    price: 299.99,
    image: "/placeholder.svg?height=350&width=300",
    category: "silk",
    description:
      "Beautiful handwoven silk saree with intricate golden embroidery and traditional motifs. Perfect for special occasions and celebrations.",
    featured: true,
  },
  {
    id: 2,
    name: "Cotton Handloom Saree",
    price: 149.99,
    image: "/placeholder.svg?height=350&width=300",
    category: "cotton",
    description: "Comfortable cotton saree perfect for daily wear with elegant border design and breathable fabric.",
    featured: false,
  },
  {
    id: 3,
    name: "Designer Party Saree",
    price: 599.99,
    image: "/placeholder.svg?height=350&width=300",
    category: "designer",
    description:
      "Stunning designer saree with contemporary patterns and luxurious fabric. Perfect for parties and events.",
    featured: true,
  },
  {
    id: 4,
    name: "Bridal Banarasi Saree",
    price: 899.99,
    image: "/placeholder.svg?height=350&width=300",
    category: "bridal",
    description: "Exquisite Banarasi saree perfect for weddings with heavy zari work and traditional craftsmanship.",
    featured: true,
  },
  {
    id: 5,
    name: "Pure Silk Kanjivaram",
    price: 749.99,
    image: "/placeholder.svg?height=350&width=300",
    category: "silk",
    description: "Traditional Kanjivaram silk saree with authentic temple border and rich colors.",
    featured: false,
  },
  {
    id: 6,
    name: "Organic Cotton Saree",
    price: 199.99,
    image: "/placeholder.svg?height=350&width=300",
    category: "cotton",
    description: "Eco-friendly organic cotton saree with natural dyes and block prints. Sustainable and stylish.",
    featured: true,
  },
  {
    id: 7,
    name: "Georgette Designer Saree",
    price: 449.99,
    image: "/placeholder.svg?height=350&width=300",
    category: "designer",
    description: "Flowing georgette saree with modern prints and comfortable drape. Perfect for office wear.",
    featured: false,
  },
  {
    id: 8,
    name: "Wedding Silk Saree",
    price: 1299.99,
    image: "/placeholder.svg?height=350&width=300",
    category: "bridal",
    description: "Luxurious wedding silk saree with heavy embellishments and traditional craftsmanship.",
    featured: true,
  },
]

let cart = []
let wishlist = []
let orders = []
let currentFilter = "all"
let isAdminLoggedIn = false
let currentCarouselIndex = 0
let displayedProducts = 6
let heroSlideIndex = 0

// Razorpay configuration
const razorpayConfig = {
  key: "rzp_test_1234567890", // Replace with your actual Razorpay key
  currency: "USD",
  name: "The Saree Room",
  description: "Premium Saree Collection",
  image: "/placeholder.svg?height=100&width=100",
  theme: {
    color: "#d4af37",
  },
}

// Admin credentials
const adminCredentials = {
  username: "admin",
  password: "123",
}

// DOM Elements
const productsGrid = document.getElementById("productsGrid")
const cartBtn = document.getElementById("cartBtn")
const wishlistBtn = document.getElementById("wishlistBtn")
const cartSidebar = document.getElementById("cartSidebar")
const wishlistSidebar = document.getElementById("wishlistSidebar")
const overlay = document.getElementById("overlay")
const cartCount = document.getElementById("cartCount")
const wishlistCount = document.getElementById("wishlistCount")
const cartItems = document.getElementById("cartItems")
const wishlistItems = document.getElementById("wishlistItems")
const cartTotal = document.getElementById("cartTotal")
const checkoutBtn = document.getElementById("checkoutBtn")
const checkoutModal = document.getElementById("checkoutModal")
const productModal = document.getElementById("productModal")
const adminPanel = document.getElementById("adminPanel")
const adminLoginModal = document.getElementById("adminLoginModal")
const adminLoginLink = document.getElementById("adminLoginLink")
const backToTop = document.getElementById("backToTop")
const featuredCarousel = document.getElementById("featuredCarousel")
const loadMoreBtn = document.getElementById("loadMoreBtn")

// Add WhatsApp float button functionality after DOM elements
const whatsappFloat = document.getElementById("whatsappFloat")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  safeExecute(() => {
    loadFromLocalStorage() // Load data first
    loadProducts()
    loadFeaturedProducts()
    setupEventListeners()
    updateCartCount()
    updateWishlistCount()
    updateAdminStats() // Ensure admin stats are updated on load
    startHeroSlideshow()
    setupScrollEffects()
    setupWhatsAppFloat()
    setupImageUpload()
  }, "Failed to initialize application")
})

// Setup Event Listeners
function setupEventListeners() {
  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
      currentFilter = this.dataset.filter
      displayedProducts = 6
      loadProducts()
    })
  })

  // View options
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".view-btn").forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
      // Add view switching logic here if needed
    })
  })

  // Cart sidebar
  cartBtn.addEventListener("click", () => openSidebar("cart"))
  document.getElementById("closeCart").addEventListener("click", () => closeSidebar("cart"))

  // Wishlist sidebar
  wishlistBtn.addEventListener("click", () => openSidebar("wishlist"))
  document.getElementById("closeWishlist").addEventListener("click", () => closeSidebar("wishlist"))

  // Checkout
  checkoutBtn.addEventListener("click", openCheckout)
  document.getElementById("closeCheckout").addEventListener("click", closeCheckout)

  // Product modal
  document.getElementById("closeModal").addEventListener("click", closeProductModal)

  // Admin login
  adminLoginLink.addEventListener("click", (e) => {
    e.preventDefault()
    openAdminLogin()
  })
  document.getElementById("closeAdminLogin").addEventListener("click", closeAdminLogin)
  document.getElementById("adminLoginForm").addEventListener("submit", handleAdminLogin)
  document.getElementById("adminLogout").addEventListener("click", handleAdminLogout)

  // Forms
  document.getElementById("checkoutForm").addEventListener("submit", handleCheckout)
  document.getElementById("addProductForm").addEventListener("submit", handleAddProduct)
  document.getElementById("newsletterForm").addEventListener("submit", handleNewsletter)

  // Overlay
  overlay.addEventListener("click", closeAllModals)

  // Category cards
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", function () {
      const category = this.dataset.category
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"))
      const filterBtn = document.querySelector(`[data-filter="${category}"]`)
      if (filterBtn) {
        filterBtn.classList.add("active")
        currentFilter = category
        displayedProducts = 6
        loadProducts()
        document.getElementById("collection").scrollIntoView({ behavior: "smooth" })
      }
    })
  })


  // Load more button
  loadMoreBtn.addEventListener("click", loadMoreProducts)

  // Carousel controls
  document.getElementById("carouselPrev").addEventListener("click", () => moveCarousel(-1))
  document.getElementById("carouselNext").addEventListener("click", () => moveCarousel(1))

  // Back to top button
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })
}

// Hero Slideshow
function startHeroSlideshow() {
  const slides = document.querySelectorAll(".hero-slide")

  setInterval(() => {
    slides[heroSlideIndex].classList.remove("active")
    heroSlideIndex = (heroSlideIndex + 1) % slides.length
    slides[heroSlideIndex].classList.add("active")
  }, 6000)
}

// Scroll Effects
function setupScrollEffects() {
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset

    // Back to top button
    if (scrollTop > 300) {
      backToTop.classList.add("show")
    } else {
      backToTop.classList.remove("show")
    }

    // Parallax effect for hero
    const hero = document.querySelector(".hero")
    if (hero) {
      const heroHeight = hero.offsetHeight
      if (scrollTop < heroHeight) {
        hero.style.transform = `translateY(${scrollTop * 0.5}px)`
      }
    }
  })

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in")
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".category-card, .product-card, .feature-card, .testimonial-card").forEach((el) => {
    observer.observe(el)
  })
}

// Featured Products Carousel
function loadFeaturedProducts() {
  const featuredProducts = products.filter((product) => product.featured)
  featuredCarousel.innerHTML = ""

  featuredProducts.forEach((product) => {
    const productCard = createProductCard(product)
    productCard.style.minWidth = "300px"
    featuredCarousel.appendChild(productCard)
  })
}

function moveCarousel(direction) {
  const cardWidth = 330 // 300px + 30px gap
  const maxIndex = Math.max(0, products.filter((p) => p.featured).length - 3)

  currentCarouselIndex += direction
  currentCarouselIndex = Math.max(0, Math.min(currentCarouselIndex, maxIndex))

  featuredCarousel.style.transform = `translateX(-${currentCarouselIndex * cardWidth}px)`
}

// Load Products
function loadProducts() {
  const filteredProducts =
    currentFilter === "all" ? products : products.filter((product) => product.category === currentFilter)

  const productsToShow = filteredProducts.slice(0, displayedProducts)
  productsGrid.innerHTML = ""

  if (productsToShow.length === 0) {
    productsGrid.innerHTML =
      '<p style="text-align: center; grid-column: 1/-1; font-size: 18px; color: #666;">No sarees found in this category.</p>'
    loadMoreBtn.style.display = "none"
    return
  }

  productsToShow.forEach((product, index) => {
    const productCard = createProductCard(product)
    productCard.style.animationDelay = `${index * 0.1}s`
    productsGrid.appendChild(productCard)
  })

  // Show/hide load more button
  if (displayedProducts >= filteredProducts.length) {
    loadMoreBtn.style.display = "none"
  } else {
    loadMoreBtn.style.display = "flex"
  }
}

function loadMoreProducts() {
  displayedProducts += 6
  loadProducts()
}

// Create Product Card
function createProductCard(product) {
  const card = document.createElement("div")
  card.className = "product-card"
  card.innerHTML = `
      <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-actions">
              <button class="action-icon" onclick="toggleWishlist(${product.id})" title="Add to Wishlist">
                  <i class="fas fa-heart ${isInWishlist(product.id) ? "text-red-500" : ""}"></i>
              </button>
              <button class="action-icon" onclick="openProductModal(${product.id})" title="Quick View">
                  <i class="fas fa-eye"></i>
              </button>
          </div>
      </div>
      <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">$${product.price}</p>
          <button class="add-to-cart" onclick="addToCart(${product.id})">
              Add to Cart
          </button>
      </div>
  `
  return card
}

// Cart Functions
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  updateCartCount()
  updateCartDisplay()
  saveToLocalStorage()
  showNotification("Saree added to cart!", "success")
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCartCount()
  updateCartDisplay()
  saveToLocalStorage()
  updateAdminStats()
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId)
  if (item) {
    item.quantity += change
    if (item.quantity <= 0) {
      removeFromCart(productId)
    } else {
      updateCartCount()
      updateCartDisplay()
      saveToLocalStorage()
    }
  }
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0)
  cartCount.textContent = count
}

function updateCartDisplay() {
  cartItems.innerHTML = ""
  let total = 0

  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Your cart is empty</p>'
    cartTotal.textContent = "0.00"
    return
  }

  cart.forEach((item) => {
    total += item.price * item.quantity
    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"
    cartItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="item-details">
              <div class="item-name">${item.name}</div>
              <div class="item-price">$${item.price}</div>
              <div class="quantity-controls">
                  <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                  <span>${item.quantity}</span>
                  <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                  <button class="qty-btn" onclick="removeFromCart(${item.id})" style="margin-left: 10px; background: #dc3545; color: white;" title="Remove from cart">
                      <i class="fas fa-trash"></i>
                  </button>
              </div>
          </div>
      `
    cartItems.appendChild(cartItem)
  })

  cartTotal.textContent = total.toFixed(2)
}

// Wishlist Functions
function toggleWishlist(productId) {
  const product = products.find((p) => p.id === productId)
  const existingIndex = wishlist.findIndex((item) => item.id === productId)

  if (existingIndex > -1) {
    wishlist.splice(existingIndex, 1)
    showNotification("Removed from wishlist", "success")
  } else {
    wishlist.push(product)
    showNotification("Added to wishlist!", "success")
  }

  updateWishlistCount()
  updateWishlistDisplay()
  saveToLocalStorage()
  loadProducts() // Refresh to update heart icons
  loadFeaturedProducts() // Refresh featured products too
}

function isInWishlist(productId) {
  return wishlist.some((item) => item.id === productId)
}

function updateWishlistCount() {
  wishlistCount.textContent = wishlist.length
}

function updateWishlistDisplay() {
  wishlistItems.innerHTML = ""

  if (wishlist.length === 0) {
    wishlistItems.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Your wishlist is empty</p>'
    return
  }

  wishlist.forEach((item) => {
    const wishlistItem = document.createElement("div")
    wishlistItem.className = "wishlist-item"
    wishlistItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="item-details">
              <div class="item-name">${item.name}</div>
              <div class="item-price">$${item.price}</div>
              <button class="add-to-cart" onclick="addToCart(${item.id})" style="margin-top: 10px;">
                  Add to Cart
              </button>
              <button class="qty-btn" onclick="toggleWishlist(${item.id})" style="margin-top: 10px; background: #dc3545; color: white;">
                  Remove
              </button>
          </div>
      `
    wishlistItems.appendChild(wishlistItem)
  })
}

// Modal Functions
function openSidebar(type) {
  if (type === "cart") {
    updateCartDisplay()
    cartSidebar.classList.add("open")
  } else if (type === "wishlist") {
    updateWishlistDisplay()
    wishlistSidebar.classList.add("open")
  }
  overlay.classList.add("active")
}

function closeSidebar(type) {
  if (type === "cart") {
    cartSidebar.classList.remove("open")
  } else if (type === "wishlist") {
    wishlistSidebar.classList.remove("open")
  }
  overlay.classList.remove("active")
}

function openProductModal(productId) {
  const product = products.find((p) => p.id === productId)
  const modalBody = document.getElementById("modalBody")

  modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; padding: 50px;">
          <div>
              <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 15px; box-shadow: 0 15px 35px rgba(0,0,0,0.1);">
          </div>
          <div>
              <h2 style="font-family: 'Playfair Display', serif; font-size: 32px; margin-bottom: 20px; color: #000;">${product.name}</h2>
              <p style="font-size: 28px; color: #d4af37; font-weight: 600; margin-bottom: 25px;">$${product.price}</p>
              <p style="color: #666; line-height: 1.7; margin-bottom: 35px; font-size: 16px;">${product.description}</p>
              <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                  <button onclick="addToCart(${product.id}); closeProductModal();" style="flex: 1; background: linear-gradient(135deg, #000 0%, #333 100%); color: white; border: none; padding: 18px; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 16px;">
                      Add to Cart
                  </button>
                  <button onclick="toggleWishlist(${product.id}); loadProducts(); loadFeaturedProducts();" style="background: ${isInWishlist(product.id) ? "#dc3545" : "#f5f5f5"}; color: ${isInWishlist(product.id) ? "white" : "#000"}; border: none; padding: 18px; border-radius: 10px; cursor: pointer; width: 60px;">
                      <i class="fas fa-heart"></i>
                  </button>
              </div>
              <div style="display: flex; gap: 15px; font-size: 14px; color: #666;">
                  <span><i class="fas fa-shipping-fast" style="color: #d4af37; margin-right: 5px;"></i> Free Shipping</span>
                  <span><i class="fas fa-undo" style="color: #d4af37; margin-right: 5px;"></i> Easy Returns</span>
                  <span><i class="fas fa-certificate" style="color: #d4af37; margin-right: 5px;"></i> Authentic</span>
              </div>
          </div>
      </div>
  `

  productModal.classList.add("open")
  overlay.classList.add("active")
}

function closeProductModal() {
  productModal.classList.remove("open")
  overlay.classList.remove("active")
}

function openCheckout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!", "error")
    return
  }

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  document.getElementById("checkoutSubtotal").textContent = `$${subtotal.toFixed(2)}`
  document.getElementById("checkoutTotal").textContent = `$${subtotal.toFixed(2)}`

  // Update checkout items display
  const checkoutItems = document.getElementById("checkoutItems")
  checkoutItems.innerHTML = ""
  cart.forEach((item) => {
    const itemDiv = document.createElement("div")
    itemDiv.className = "summary-item"
    itemDiv.innerHTML = `
          <span>${item.name} x${item.quantity}</span>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
      `
    checkoutItems.appendChild(itemDiv)
  })

  checkoutModal.classList.add("open")
  overlay.classList.add("active")
  closeSidebar("cart")
}

function closeCheckout() {
  checkoutModal.classList.remove("open")
  overlay.classList.remove("active")
}

function handleCheckout(e) {
  e.preventDefault()

  // Get form data
  const customerInfo = {
    firstName: e.target[0].value,
    lastName: e.target[1].value,
    email: e.target[2].value,
    phone: e.target[3].value,
    address: {
      line1: e.target[4].value,
      line2: e.target[5].value || "",
      city: e.target[6].value,
      state: e.target[7].value,
      postalCode: e.target[8].value,
    },
    notes: e.target[9].value || "",
  }

  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value
  const total = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  // Create order object with payment details
  const order = {
    id: Date.now(),
    items: [...cart],
    total: total,
    date: new Date().toISOString(),
    status: paymentMethod === "cod" ? "Confirmed - Cash on Delivery" : "Payment Pending",
    customer: customerInfo,
    payment: {
      method: paymentMethod === "cod" ? "Cash on Delivery" : "Google Pay",
      status: paymentMethod === "cod" ? "Pending" : "Processing",
      amount: total,
      transactionId: paymentMethod === "cod" ? null : null, // Will be updated after payment
    },
  }

  if (paymentMethod === "cod") {
    // Handle Cash on Delivery
    orders.push(order)
    cart = []
    updateCartCount()
    updateCartDisplay()
    closeCheckout()
    saveToLocalStorage()
    updateAdminStats()
    loadAdminOrders() // Ensure admin orders are reloaded
    showNotification("Order placed successfully! You will pay cash on delivery.", "success")
    e.target.reset()
  } else {
    // Handle Google Pay via Razorpay
    const options = {
      ...razorpayConfig,
      amount: Math.round(total * 100), // Razorpay expects amount in paise
      order_id: `order_${order.id}`,
      prefill: {
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        email: customerInfo.email,
        contact: customerInfo.phone,
      },
      handler: (response) => {
        // Payment successful
        order.payment.status = "Completed"
        order.payment.transactionId = response.razorpay_payment_id
        order.status = "Payment Completed"

        orders.push(order)
        cart = []
        updateCartCount()
        updateCartDisplay()
        closeCheckout()
        saveToLocalStorage()
        updateAdminStats()
        loadAdminOrders() // Ensure admin orders are reloaded
        showNotification("Payment successful! Your order has been placed.", "success")
        e.target.reset()
      },
      modal: {
        ondismiss: () => {
          showNotification("Payment cancelled. Please try again.", "error")
        },
      },
    }

    const Razorpay = window.Razorpay // Declare Razorpay variable
    try {
      const rzp = new Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("Razorpay error:", error)
      showNotification("Payment service unavailable. Please try Cash on Delivery.", "error")
    }
  }
}

// Admin Functions
function openAdminLogin() {
  adminLoginModal.classList.add("open")
  overlay.classList.add("active")
}

function closeAdminLogin() {
  adminLoginModal.classList.remove("open")
  overlay.classList.remove("active")
}

function handleAdminLogin(e) {
  e.preventDefault()

  const username = document.getElementById("adminUsername").value
  const password = document.getElementById("adminPassword").value

  if (username === adminCredentials.username && password === adminCredentials.password) {
    isAdminLoggedIn = true
    closeAdminLogin()
    openAdminPanel()
    showNotification("Welcome to Admin Dashboard!", "success")
  } else {
    showNotification("Invalid credentials. Please try again.", "error")
  }

  // Reset form
  e.target.reset()
}

function handleAdminLogout() {
  isAdminLoggedIn = false
  closeAdminPanel()
  showNotification("Logged out successfully", "success")
}

function openAdminPanel() {
  if (!isAdminLoggedIn) {
    openAdminLogin()
    return
  }

  adminPanel.style.display = "block"
  loadAdminProducts()
  loadAdminOrders()
  updateAdminStats()
}

function closeAdminPanel() {
  adminPanel.style.display = "none"
}

// Image Upload Functionality
function setupImageUpload() {
  const fileInput = document.getElementById("productImageFile")
  const urlInput = document.getElementById("productImageUrl")
  const fileName = document.getElementById("fileName")
  const imagePreview = document.getElementById("imagePreview")
  const previewImg = document.getElementById("previewImg")

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (file) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          showNotification("Please select a valid image file.", "error")
          fileInput.value = "" // Clear input
          fileName.textContent = ""
          imagePreview.style.display = "none"
          return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          showNotification("Image size should be less than 5MB.", "error")
          fileInput.value = "" // Clear input
          fileName.textContent = ""
          imagePreview.style.display = "none"
          return
        }

        fileName.textContent = file.name

        // Read and preview the file
        const reader = new FileReader()
        reader.onload = (e) => {
          previewImg.src = e.target.result
          imagePreview.style.display = "block"
          urlInput.value = "" // Clear URL input when file is selected
        }
        reader.readAsDataURL(file)
      } else {
        fileName.textContent = ""
        if (!urlInput.value) {
          imagePreview.style.display = "none"
        }
      }
    })
  }

  if (urlInput) {
    urlInput.addEventListener("input", (e) => {
      const url = e.target.value
      if (url) {
        previewImg.src = url
        imagePreview.style.display = "block"
        fileInput.value = "" // Clear file input when URL is entered
        fileName.textContent = ""
      } else {
        if (!fileInput.files[0]) {
          imagePreview.style.display = "none"
        }
      }
    })
  }
}

// Edit Product Functionality
function editProduct(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) {
    showNotification("Product not found for editing.", "error")
    return
  }

  // Populate form with product data
  document.getElementById("editProductId").value = product.id
  document.getElementById("productName").value = product.name
  document.getElementById("productPrice").value = product.price
  document.getElementById("productImageUrl").value = product.image
  document.getElementById("productCategory").value = product.category
  document.getElementById("productDescription").value = product.description

  // Show image preview
  const imagePreview = document.getElementById("imagePreview")
  const previewImg = document.getElementById("previewImg")
  previewImg.src = product.image
  imagePreview.style.display = "block"
  document.getElementById("fileName").textContent = "" // Clear file name as it's from URL/existing

  // Update form UI
  document.getElementById("formTitle").textContent = "Edit Saree"
  document.getElementById("submitText").textContent = "Update Saree"
  document.getElementById("submitBtn").innerHTML = '<i class="fas fa-save"></i><span>Update Saree</span>'
  document.getElementById("cancelBtn").style.display = "inline-flex"

  // Scroll to form
  document.getElementById("addProductForm").scrollIntoView({ behavior: "smooth" })
}

function cancelEdit() {
  // Reset form
  document.getElementById("addProductForm").reset()
  document.getElementById("editProductId").value = ""
  document.getElementById("fileName").textContent = ""
  document.getElementById("imagePreview").style.display = "none"
  document.getElementById("productImageFile").value = "" // Clear file input

  // Reset form UI
  document.getElementById("formTitle").textContent = "Add New Saree"
  document.getElementById("submitText").textContent = "Add Saree"
  document.getElementById("submitBtn").innerHTML = '<i class="fas fa-plus"></i><span>Add Saree</span>'
  document.getElementById("cancelBtn").style.display = "none"
}

// Validate Product Form
function validateProductForm() {
  const name = document.getElementById("productName").value.trim()
  const price = document.getElementById("productPrice").value
  const category = document.getElementById("productCategory").value
  const description = document.getElementById("productDescription").value.trim()
  const imageUrl = document.getElementById("productImageUrl").value.trim()
  const imageFile = document.getElementById("productImageFile").files[0]

  if (!name) {
    showNotification("Please enter a saree name.", "error")
    return false
  }

  if (!price || Number.parseFloat(price) <= 0) {
    showNotification("Please enter a valid price.", "error")
    return false
  }

  if (!category) {
    showNotification("Please select a category.", "error")
    return false
  }

  if (!description) {
    showNotification("Please enter a description.", "error")
    return false
  }

  if (!imageUrl && !imageFile) {
    showNotification("Please provide an image URL or upload an image file.", "error")
    return false
  }

  return true
}

// Update the handleAddProduct function to handle both add and edit
function handleAddProduct(e) {
  e.preventDefault()

  if (!validateProductForm()) {
    return
  }

  const editId = document.getElementById("editProductId").value
  const fileInput = document.getElementById("productImageFile")
  const urlInput = document.getElementById("productImageUrl")

  let imageUrl = urlInput.value || "/placeholder.svg?height=350&width=300"

  // If file is selected, use the file data
  if (fileInput.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageUrl = e.target.result
      saveProduct(editId, imageUrl)
    }
    reader.onerror = () => {
      showNotification("Error reading image file. Please try again.", "error")
    }
    reader.readAsDataURL(fileInput.files[0])
  } else {
    saveProduct(editId, imageUrl)
  }
}

function saveProduct(editId, imageUrl) {
  const productData = {
    name: document.getElementById("productName").value,
    price: Number.parseFloat(document.getElementById("productPrice").value),
    image: imageUrl,
    category: document.getElementById("productCategory").value,
    description: document.getElementById("productDescription").value,
  }

  if (editId) {
    // Update existing product
    const productIndex = products.findIndex((p) => p.id == editId)
    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...productData }
      showNotification("Saree updated successfully!", "success")
    } else {
      showNotification("Error: Product to edit not found.", "error")
    }
  } else {
    // Add new product
    const newProduct = {
      id: Date.now(),
      ...productData,
      featured: false,
    }
    products.push(newProduct)
    showNotification("Saree added successfully!", "success")
  }

  // Refresh displays
  loadProducts()
  loadFeaturedProducts()
  loadAdminProducts()
  saveToLocalStorage()
  updateAdminStats()

  // Reset form
  cancelEdit()
}

// Update loadAdminProducts to include edit buttons
function loadAdminProducts() {
  const adminProductsList = document.getElementById("adminProductsList")
  adminProductsList.innerHTML = ""

  if (products.length === 0) {
    adminProductsList.innerHTML = '<p style="text-align: center; color: #666;">No sarees added yet.</p>'
    return
  }

  products.forEach((product) => {
    const productItem = document.createElement("div")
    productItem.className = "admin-product-item"
    productItem.innerHTML = `
        <div>
            <strong>${product.name}</strong><br>
            <span style="color: #d4af37; font-weight: 600;">$${product.price}</span> - 
            <span style="color: #666; text-transform: capitalize;">${product.category} Saree</span>
            ${product.featured ? '<span style="color: #28a745; font-weight: 600; margin-left: 10px;">Featured</span>' : ""}
        </div>
        <div>
            <button class="edit-btn" onclick="editProduct(${product.id})">Edit</button>
            <button onclick="toggleFeatured(${product.id})" style="background: ${product.featured ? "#28a745" : "#6c757d"}; color: white; border: none; padding: 8px 15px; border-radius: 3px; cursor: pointer; font-size: 12px; margin-right: 5px;">
                ${product.featured ? "Unfeature" : "Feature"}
            </button>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
        </div>
    `
    adminProductsList.appendChild(productItem)
  })
}

function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    // Remove product from products array
    products = products.filter((p) => p.id !== productId)
    
    // Remove product from cart if present
    cart = cart.filter((item) => item.id !== productId)
    
    // Remove product from wishlist if present
    wishlist = wishlist.filter((item) => item.id !== productId)
    
    // Update displays
    loadProducts()
    loadFeaturedProducts()
    loadAdminProducts()
    updateCartCount()
    updateCartDisplay()
    updateWishlistCount()
    updateWishlistDisplay()
    saveToLocalStorage()
    updateAdminStats()
    
    showNotification("Product deleted successfully!", "success")
  }
}

function toggleFeatured(productId) {
  const product = products.find((p) => p.id === productId)
  if (product) {
    product.featured = !product.featured
    loadFeaturedProducts()
    loadAdminProducts()
    saveToLocalStorage()
    showNotification(`Product ${product.featured ? "featured" : "unfeatured"} successfully!`, "success")
  }
}

function loadAdminOrders() {
  const adminOrdersList = document.getElementById("adminOrdersList")
  adminOrdersList.innerHTML = ""

  if (orders.length === 0) {
    adminOrdersList.innerHTML = '<p style="text-align: center; color: #666;">No orders yet.</p>'
    return
  }

  orders.forEach((order) => {
    const orderItem = document.createElement("div")
    orderItem.className = "admin-order-item"
    orderItem.innerHTML = `
        <div>
            <strong>Order #${order.id}</strong><br>
            <span style="color: #000; font-weight: 600;">${order.customer.firstName} ${order.customer.lastName}</span> - 
            <span style="color: #d4af37; font-weight: 600;">$${order.total.toFixed(2)}</span><br>
            <small style="color: #666;">${new Date(order.date).toLocaleDateString()} - ${order.status}</small><br>
            <small style="color: #007bff;"><i class="fas fa-credit-card"></i> ${order.payment.method} - ${order.payment.status}</small>
            ${order.payment.transactionId ? `<br><small style="color: #28a745;">Transaction ID: ${order.payment.transactionId}</small>` : ""}
        </div>
        <div>
            <button onclick="viewOrderDetails(${order.id})" style="background: #007bff; color: white; border: none; padding: 8px 15px; border-radius: 3px; cursor: pointer; font-size: 12px; margin-right: 5px;">
                View Details
            </button>
            <button class="delete-btn" onclick="deleteOrder(${order.id})">Delete</button>
        </div>
    `
    adminOrdersList.appendChild(orderItem)
  })
}

function deleteOrder(orderId) {
  if (confirm("Are you sure you want to delete this order?")) {
    orders = orders.filter((o) => o.id !== orderId)
    loadAdminOrders()
    saveToLocalStorage()
    updateAdminStats()
    showNotification("Order deleted successfully!", "success")
  }
}

function viewOrderDetails(orderId) {
  const order = orders.find((o) => o.id === orderId)
  if (!order) return

  let details = `Order #${order.id}\n`
  details += `Date: ${new Date(order.date).toLocaleDateString()}\n`
  details += `Status: ${order.status}\n\n`
  details += `Customer: ${order.customer.firstName} ${order.customer.lastName}\n`
  details += `Email: ${order.customer.email}\n`
  details += `Phone: ${order.customer.phone}\n\n`
  details += `Address:\n${order.customer.address.line1}\n`
  if (order.customer.address.line2) details += `${order.customer.address.line2}\n`
  details += `${order.customer.address.city}, ${order.customer.address.state} ${order.customer.address.postalCode}\n\n`
  details += `Payment Method: ${order.payment.method}\n`
  details += `Payment Status: ${order.payment.status}\n`
  if (order.payment.transactionId) {
    details += `Transaction ID: ${order.payment.transactionId}\n`
  }
  details += `\nItems:\n`
  order.items.forEach((item) => {
    details += `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`
  })
  details += `\nTotal: $${order.total.toFixed(2)}`

  if (order.customer.notes) {
    details += `\n\nNotes: ${order.customer.notes}`
  }

  alert(details)
}

function updateAdminStats() {
  const totalRevenue = orders.reduce((sum, order) => {
    return order.payment.status === "Completed" ? sum + order.total : sum
  }, 0)

  document.getElementById("totalProducts").textContent = products.length
  document.getElementById("totalOrders").textContent = orders.length
  document.getElementById("totalRevenue").textContent = `$${totalRevenue.toFixed(2)}`
}

// Newsletter Function
function handleNewsletter(e) {
  e.preventDefault()
  const email = e.target[0].value
  showNotification("Thank you for subscribing to our newsletter!", "success")
  e.target.reset()
}

// Search Function
function handleSearch() {
  const searchTerm = prompt("Search for sarees:")
  if (searchTerm) {
    const filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    productsGrid.innerHTML = ""

    if (filteredProducts.length === 0) {
      productsGrid.innerHTML =
        '<p style="text-align: center; grid-column: 1/-1; font-size: 18px; color: #666;">No sarees found matching your search.</p>'
    } else {
      filteredProducts.forEach((product, index) => {
        const productCard = createProductCard(product)
        productCard.style.animationDelay = `${index * 0.1}s`
        productsGrid.appendChild(productCard)
      })
    }

    // Reset filter
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"))
    document.querySelector('[data-filter="all"]').classList.add("active")
    currentFilter = "all"
    displayedProducts = filteredProducts.length
    loadMoreBtn.style.display = "none"
  }
}

// Utility Functions
function closeAllModals() {
  cartSidebar.classList.remove("open")
  wishlistSidebar.classList.remove("open")
  productModal.classList.remove("open")
  checkoutModal.classList.remove("open")
  adminLoginModal.classList.remove("open")
  overlay.classList.remove("active")
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `${type}-message`
  notification.textContent = message
  notification.style.position = "fixed"
  notification.style.top = "20px"
  notification.style.right = "20px"
  notification.style.zIndex = "5000"
  notification.style.maxWidth = "350px"
  notification.style.padding = "15px 20px"
  notification.style.borderRadius = "10px"
  notification.style.fontWeight = "500"
  notification.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)"
  notification.style.transform = "translateX(100%)"
  notification.style.transition = "transform 0.3s ease"

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Animate out and remove
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Local Storage Functions
function saveToLocalStorage() {
  localStorage.setItem("sareeRoomCart", JSON.stringify(cart))
  localStorage.setItem("sareeRoomWishlist", JSON.stringify(wishlist))
  localStorage.setItem("sareeRoomProducts", JSON.stringify(products))
  localStorage.setItem("sareeRoomOrders", JSON.stringify(orders))
}

function loadFromLocalStorage() {
  const savedCart = localStorage.getItem("sareeRoomCart")
  const savedWishlist = localStorage.getItem("sareeRoomWishlist")
  const savedProducts = localStorage.getItem("sareeRoomProducts")
  const savedOrders = localStorage.getItem("sareeRoomOrders")

  if (savedCart) {
    cart = JSON.parse(savedCart)
  }

  if (savedWishlist) {
    wishlist = JSON.parse(savedWishlist)
  }

  if (savedProducts) {
    // Always load products from local storage if available
    products = JSON.parse(savedProducts)
  }

  if (savedOrders) {
    orders = JSON.parse(savedOrders)
  }
}

// Smooth Scrolling for Navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
  // ESC key to close modals
  if (e.key === "Escape") {
    closeAllModals()
    closeAdminPanel()
  }

  // Ctrl+Shift+A to open admin login
  if (e.ctrlKey && e.shiftKey && e.key === "A") {
    e.preventDefault()
    openAdminLogin()
  }
})

// Auto-save cart and wishlist on page unload
window.addEventListener("beforeunload", () => {
  saveToLocalStorage()
})

// Initialize tooltips and additional interactions
document.addEventListener("DOMContentLoaded", () => {
  // Add hover effects to buttons
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("mouseenter", function () {
      if (!this.style.transform.includes("translateY")) {
        this.style.transform = "translateY(-2px)"
      }
    })

    button.addEventListener("mouseleave", function () {
      if (this.style.transform.includes("translateY(-2px)")) {
        this.style.transform = "translateY(0)"
      }
    })
  })

  // Add loading states to forms
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", function () {
      const submitBtn = this.querySelector('button[type="submit"]')
      if (submitBtn && !submitBtn.disabled) {
        const originalHTML = submitBtn.innerHTML
        submitBtn.innerHTML = '<span class="loading"></span> Processing...'
        submitBtn.disabled = true

        setTimeout(() => {
          submitBtn.innerHTML = originalHTML
          submitBtn.disabled = false
        }, 2000)
      }
    })
  })
})

// Setup WhatsApp float button
function setupWhatsAppFloat() {
  whatsappFloat.addEventListener("click", () => {
    const phoneNumber = "1234567890" // Replace with your WhatsApp business number
    const message = encodeURIComponent("Hi! I'm interested in your saree collection. Can you help me?")
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappURL, "_blank")
  })
}

// Add error handling for all critical functions
function safeExecute(func, errorMessage = "An error occurred") {
  try {
    return func()
  } catch (error) {
    console.error(error)
    showNotification(errorMessage, "error")
    return null
  }
}
