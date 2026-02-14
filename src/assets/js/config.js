/**
 * ============================================
 * LIPEK FASHION - SITE CONFIGURATION
 * Central configuration for the entire website
 * USA Location: Houston, Texas
 * ============================================
 */

const LIPEK_CONFIG = {
  // Site Information
  site: {
    name: 'Lipek Fashion',
    tagline: 'Premium Custom Tailoring & African Fashion',
    description: 'Lipek Fashion offers premium custom tailoring, African fashion, alterations, and laundry services in Houston, Texas.',
    url: 'https://lipekfashion.com',
    logo: '/assets/images/logo.svg',
    favicon: '/assets/images/favicon.ico',
    language: 'en',
    currency: 'USD',
    timezone: 'America/Chicago',
  },

  // USA Location - Houston, Texas
  location: {
    country: 'USA',
    city: 'Houston',
    state: 'Texas',
    address: '1234 Westheimer Road, Suite 100, Houston, TX 77098',
    coordinates: {
      lat: 29.7427,
      lng: -95.4189
    },
    phone: '+1 (346) 505-4596',
    email: 'info@lipekfashion.com',
    hours: [
      { day: 'Monday - Friday', hours: '10:00 AM - 7:00 PM' },
      { day: 'Saturday', hours: '10:00 AM - 6:00 PM' },
      { day: 'Sunday', hours: '12:00 PM - 5:00 PM' }
    ],
    mapUrl: 'https://maps.google.com/?q=Houston+TX',
  },

  // Contact Information
  contact: {
    primary: {
      phone: '+1 (346) 505-4596',
      email: 'info@lipekfashion.com',
      whatsapp: '+13465054596',
    },
    support: {
      phone: '+1 (346) 505-4596',
      email: 'support@lipekfashion.com',
    },
    bookings: {
      phone: '+1 (346) 505-4596',
      email: 'bookings@lipekfashion.com',
    },
    social: {
      facebook: 'https://facebook.com/lipekfashion',
      instagram: 'https://instagram.com/lipekfashion',
      twitter: 'https://twitter.com/lipekfashion',
      pinterest: 'https://pinterest.com/lipekfashion',
      youtube: 'https://youtube.com/lipekfashion',
      tiktok: 'https://tiktok.com/@lipekfashion',
    }
  },

  // Business Information
  business: {
    name: 'Lipek Fashion LLC',
    legalName: 'Lipek Fashion LLC',
    taxId: 'XX-XXXXXXX',
    founded: '2020',
    employees: '5-10',
    categories: ['Custom Tailoring', 'African Fashion', 'Alterations', 'Laundry Services'],
    keywords: [
      'custom tailoring Houston',
      'African fashion Houston',
      'bespoke suits Houston',
      'agbada Houston',
      'ankara styles Houston',
      'alterations Houston',
      'laundry service Houston'
    ],
  },

  // Services
  services: {
    customTailoring: {
      name: 'Custom Tailoring',
      slug: 'custom-tailoring',
      categories: [
        'african-fashion',
        'suits-formal',
        'shirts-tops',
        'trousers-bottoms',
        'womens-tailoring',
        'special-occasion',
        'casual-modern'
      ]
    },
    alterations: {
      name: 'Alterations',
      slug: 'alterations',
      types: [
        'suit-alterations',
        'dress-alterations',
        'trouser-alterations',
        'shirt-alterations'
      ]
    },
    laundry: {
      name: 'Laundry Services',
      slug: 'laundry',
      types: [
        'dry-cleaning',
        'wash-fold',
        'steam-pressing',
        'stain-removal'
      ]
    }
  },

  // Navigation
  navigation: {
    main: [
      { name: 'Home', url: '/', icon: 'home' },
      { 
        name: 'Services', 
        url: '/services/',
        icon: 'services',
        megaMenu: true,
        children: [
          {
            category: 'Custom Tailoring',
            items: [
              { name: 'African Fashion', url: '/services/custom-tailoring/african-fashion/', icon: 'african' },
              { name: 'Suits & Formal', url: '/services/custom-tailoring/suits-formal/', icon: 'suit' },
              { name: 'Shirts & Tops', url: '/services/custom-tailoring/shirts-tops/', icon: 'shirt' },
              { name: 'Trousers & Bottoms', url: '/services/custom-tailoring/trousers-bottoms/', icon: 'trousers' },
              { name: "Women's Tailoring", url: '/services/custom-tailoring/womens-tailoring/', icon: 'women' },
              { name: 'Special Occasion', url: '/services/custom-tailoring/special-occasion/', icon: 'occasion' },
              { name: 'Casual & Modern', url: '/services/custom-tailoring/casual-modern/', icon: 'casual' },
            ]
          },
          {
            category: 'Other Services',
            items: [
              { name: 'Alterations', url: '/services/alterations/', icon: 'alterations' },
              { name: 'Laundry', url: '/services/laundry/', icon: 'laundry' },
            ]
          }
        ]
      },
      { name: 'Gallery', url: '/gallery/', icon: 'gallery' },
      { name: 'Book Fitting', url: '/book-fitting/', icon: 'calendar' },
      { name: 'Blog', url: '/blog/', icon: 'blog' },
      { name: 'About', url: '/about/', icon: 'about' },
      { name: 'Contact', url: '/contact/', icon: 'contact' },
    ],
    footer: {
      services: [
        { name: 'African Fashion', url: '/services/custom-tailoring/african-fashion/' },
        { name: 'Custom Suits', url: '/services/custom-tailoring/suits-formal/' },
        { name: "Women's Tailoring", url: '/services/custom-tailoring/womens-tailoring/' },
        { name: 'Alterations', url: '/services/alterations/' },
        { name: 'Laundry', url: '/services/laundry/' },
      ],
      company: [
        { name: 'About Us', url: '/about/' },
        { name: 'Our Team', url: '/about/team/' },
        { name: 'Careers', url: '/careers/' },
        { name: 'Press', url: '/press/' },
      ],
      support: [
        { name: 'Contact', url: '/contact/' },
        { name: 'FAQ', url: '/faq/' },
        { name: 'Privacy Policy', url: '/legal/privacy-policy/' },
        { name: 'Terms of Service', url: '/legal/terms-of-service/' },
        { name: 'Refund Policy', url: '/legal/refund-policy/' },
      ]
    }
  },

  // Booking Settings
  booking: {
    duration: 60, // minutes per appointment
    leadTime: 24, // hours advance booking required
    cancellationWindow: 24, // hours before appointment
    depositRequired: false,
    depositAmount: 0,
    maxPartySize: 5,
    allowedDays: [1, 2, 3, 4, 5, 6], // 0 = Sunday, 1 = Monday, etc.
    timeSlots: {
      morning: ['09:00', '10:00', '11:00', '12:00'],
      afternoon: ['13:00', '14:00', '15:00', '16:00'],
      evening: ['17:00', '18:00', '19:00'],
    },
  },

  // Gallery Settings
  gallery: {
    itemsPerPage: 24,
    defaultView: 'grid', // grid, masonry, list, compact
    lightbox: true,
    lazyLoad: true,
    imageSizes: {
      thumbnail: { width: 150, height: 150 },
      small: { width: 300, height: 300 },
      medium: { width: 600, height: 600 },
      large: { width: 1200, height: 1200 },
    }
  },

  // Blog Settings
  blog: {
    postsPerPage: 12,
    excerptLength: 160,
    showAuthor: true,
    showDate: true,
    showCategories: true,
    showTags: true,
    enableComments: true,
  },

  // SEO Defaults
  seo: {
    titleSeparator: '|',
    homeTitle: 'Lipek Fashion - Premium Custom Tailoring in Houston',
    description: 'Lipek Fashion offers expert custom tailoring, African fashion, alterations, and laundry services in Houston, Texas. Book your fitting today!',
    ogImage: '/assets/images/og-image.jpg',
    twitterCard: 'summary_large_image',
    robots: 'index, follow',
  },

  // Theme Settings
  theme: {
    defaultMode: 'light', // light, dark
    allowToggle: true,
    localStorageKey: 'lipek-theme',
  },

  // Analytics
  analytics: {
    google: 'G-XXXXXXXXXX', // Replace with actual GA ID
    facebook: 'XXXXXXXXXX', // Replace with actual FB pixel ID
    hotjar: XXXXXX, // Replace with actual Hotjar ID
  },

  // API Endpoints
  api: {
    baseUrl: 'https://api.lipekfashion.com/v1',
    booking: '/bookings',
    contact: '/contact',
    newsletter: '/newsletter',
    gallery: '/gallery',
    blog: '/blog',
  },

  // Features Flags
  features: {
    pwa: true,
    offlineMode: true,
    pushNotifications: true,
    darkMode: true,
    quickView: true,
    virtualTryOn: false,
    appointmentReminders: true,
    liveChat: true,
  },

  // Error Messages
  messages: {
    generic: 'Something went wrong. Please try again.',
    network: 'Network error. Please check your connection.',
    form: {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number',
      success: 'Thank you! We\'ll be in touch soon.',
    },
    booking: {
      success: 'Your appointment has been booked successfully!',
      conflict: 'This time slot is no longer available. Please choose another.',
      reminder: 'Reminder: You have an appointment tomorrow at {time}',
    }
  },

  // Phone Number Formatting
  phone: {
    display: '+1 (346) 505-4596',
    link: '+13465054596',
    sms: '+13465054596',
    whatsapp: '13465054596',
  },
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LIPEK_CONFIG;
}