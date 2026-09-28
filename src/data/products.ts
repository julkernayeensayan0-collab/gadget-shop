import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'aerosound-pro-max',
    name: 'AeroSound Pro Max Studio Headphones',
    category: 'Audio',
    tagline: 'Flagship Active Noise Cancellation with Spatial Acoustic Driver',
    priceUSD: 249,
    originalPriceUSD: 299,
    priceBDT: 29500,
    originalPriceBDT: 34500,
    rating: 4.9,
    reviewsCount: 312,
    image: '/src/assets/images/hero_gadgets_showcase_1790571976516.jpg',
    brand: 'Eshan Audio Labs',
    inStock: true,
    stockCount: 18,
    warranty: '2 Years Official Replacement Warranty',
    badge: 'Flagship',
    colors: ['Space Gray', 'Matte Black', 'Silver Frost'],
    specs: [
      { label: 'Driver Size', value: '45mm Custom Dynamic Neodymium' },
      { label: 'Battery Life', value: '55 Hours (ANC Off) / 42 Hours (ANC On)' },
      { label: 'Noise Reduction', value: 'Up to -48dB Adaptive Hybrid ANC' },
      { label: 'Connectivity', value: 'Bluetooth 5.4, Multipoint, 3.5mm Hi-Res' },
      { label: 'Audio Codecs', value: 'LDAC, aptX Adaptive, AAC, SBC' },
      { label: 'Weight', value: '265 grams' }
    ],
    features: [
      'Industry-leading 48dB adaptive hybrid noise isolation',
      'Lossless 24-bit/96kHz high-resolution wireless streaming',
      'Dual-beamforming microphones with AI wind noise cancellation',
      'Ultra-comfortable memory foam ear cushions wrapped in breathable protein leather',
      'Instant fast charge: 10 minutes gives 6 hours of playtime'
    ],
    inTheBox: [
      'AeroSound Pro Max Headphones',
      'Hard Shell Protective Travel Case',
      'Braided USB-C to USB-C High-Speed Cable',
      '3.5mm Gold-Plated Audio Cable',
      'Airline Flight Adapter',
      'User Manual & Warranty Card'
    ],
    description: 'Designed for audiophiles and power creators, the AeroSound Pro Max delivers unmatched sonic depth, crisp mids, and earth-shaking sub-bass. With adaptive real-time acoustic tuning, you can isolate yourself anywhere.'
  },
  {
    id: 'apex-chrono-ultra',
    name: 'Apex Chrono Ultra Titanium Smartwatch',
    category: 'Wearables',
    tagline: 'Aerospace-Grade Titanium Case with Dual-Frequency GPS & ECG',
    priceUSD: 189,
    originalPriceUSD: 229,
    priceBDT: 22500,
    originalPriceBDT: 26900,
    rating: 4.8,
    reviewsCount: 248,
    image: '/src/assets/images/gadget_smartwatch_ultra_1790571994448.jpg',
    brand: 'Apex Tech',
    inStock: true,
    stockCount: 24,
    warranty: '1 Year Official Warranty',
    badge: 'Best Seller',
    colors: ['Titanium Gray', 'Tactical Stealth', 'Ocean Blue'],
    specs: [
      { label: 'Display', value: '1.96-inch LTPO AMOLED (2000 nits peak)' },
      { label: 'Chassis Material', value: 'Grade 5 Titanium & Sapphire Crystal' },
      { label: 'Water Resistance', value: '5ATM + IP68 (50m dive rated)' },
      { label: 'Battery Runtime', value: 'Up to 14 Days Typical Use' },
      { label: 'Sensors', value: 'ECG, PPG SpO2, Skin Temp, Dual GPS' },
      { label: 'OS Support', value: 'iOS 14+ & Android 9.0+' }
    ],
    features: [
      'Continuous 24/7 cardiovascular & SpO2 blood oxygen tracking',
      'Multi-band GNSS satellite positioning for pinpoint route mapping',
      'Always-on crystal sapphire display readable in blinding outdoor sunlight',
      'Over 120 professional fitness modes with automatic stride detection',
      'Bluetooth calling with noise-canceling dual speakerphone'
    ],
    inTheBox: [
      'Apex Chrono Ultra Smartwatch',
      'Hypoallergenic Silicone Sports Strap',
      'Magnetic Fast-Charging Puck',
      'Screen Guard Pre-Applied',
      'Quick Start Guide'
    ],
    description: 'Engineered for extreme endurance and executive elegance. Built from aerospace titanium, it withstands shocks, high pressure, and deep dives while tracking biometric precision around the clock.'
  },
  {
    id: 'pulsepods-anc-pro',
    name: 'PulsePods ANC Flagship True Wireless Earbuds',
    category: 'Audio',
    tagline: 'Lossless Spatial Audio with Smart Transparency & Ceramic Casing',
    priceUSD: 119,
    originalPriceUSD: 149,
    priceBDT: 14200,
    originalPriceBDT: 17500,
    rating: 4.8,
    reviewsCount: 184,
    image: '/src/assets/images/gadget_wireless_earbuds_1790572010262.jpg',
    brand: 'Pulse Audio',
    inStock: true,
    stockCount: 35,
    warranty: '1 Year Replacement Warranty',
    badge: 'Popular',
    colors: ['Ceramic White', 'Obsidian Black', 'Graphite Mint'],
    specs: [
      { label: 'Transducer', value: '11mm Graphene Coated Diaphragm' },
      { label: 'Battery Life', value: '9h Earbuds + 36h Wireless Case' },
      { label: 'ANC Depth', value: '-42dB Intelligent Active Cancellation' },
      { label: 'Latency', value: '38ms Ultra-Low Gaming Mode' },
      { label: 'Charging', value: 'Qi Wireless Charging & USB-C' },
      { label: 'Water Rating', value: 'IPX5 Sweat & Rain Proof' }
    ],
    features: [
      'Dynamic head-tracking spatial audio for concert-hall immersion',
      '6 studio-grade mics with AI bone-conduction voice clarity',
      'Seamless multi-device dual pairing across laptop and phone',
      'Ergonomic pressure-relief acoustic vents for zero fatigue',
      'Touch capacitive controls with haptic click feedback'
    ],
    inTheBox: [
      'PulsePods ANC Earbuds (L/R)',
      'Smart Wireless Charging Case',
      '4 Sizes of Liquid Silicone Ear Tips (XS, S, M, L)',
      'Braided Type-C Fast Cable',
      'Warranty Document'
    ],
    description: 'Pocket-sized sonic powerhouse. The PulsePods ANC Pro deliver crystal-clear highs and punchy bass, paired with seamless wireless charging and class-leading noise cancellation.'
  },
  {
    id: 'hypercharge-100w-gan',
    name: 'HyperCharge 100W GaN Pro Fast Charger & MagDock',
    category: 'Power',
    tagline: 'Ultra-Compact Gallium Nitride 4-Port Fast Charging Hub',
    priceUSD: 69,
    originalPriceUSD: 89,
    priceBDT: 7900,
    originalPriceBDT: 9900,
    rating: 4.9,
    reviewsCount: 156,
    image: '/src/assets/images/gadget_gan_charger_1790572022511.jpg',
    brand: 'VoltGrid Pro',
    inStock: true,
    stockCount: 42,
    warranty: '18 Months Official Warranty',
    badge: 'High Demand',
    colors: ['Space Slate', 'Arctic White'],
    specs: [
      { label: 'Power Output', value: '100W Max Shared Dynamic Power' },
      { label: 'Ports', value: '3x USB-C (PD 3.0/PPS) + 1x USB-A (QC 4.0)' },
      { label: 'Technology', value: 'GaN III Semiconductor Efficiency' },
      { label: 'Protection', value: 'Overvoltage, Overheat, Short-Circuit' },
      { label: 'Dimensions', value: '62 x 60 x 30 mm (Foldable Pins)' },
      { label: 'Weight', value: '188 grams' }
    ],
    features: [
      'Powers a MacBook Pro 16", iPhone 16 Pro, iPad, and Watch simultaneously',
      'Gallium Nitride III chips maintain 40% cooler operating temperatures',
      'Intelligent Power Distribution adapts wattage based on connected gadgets',
      'Travel ready with fold-out prongs and worldwide 100-240V compatibility',
      'Fire-retardant PC casing with matte smudge-proof finish'
    ],
    inTheBox: [
      'HyperCharge 100W GaN Charger',
      '100W 1.5m Braided E-Marker Type-C Cable',
      'Interchangeable UK / EU Travel Plugs',
      'Welcome Guide & Safety Manual'
    ],
    description: 'Say goodbye to charging brick clutter. One sleek palm-sized GaN III charger capable of fast-fueling your laptop, tablet, phone, and wireless accessories at maximum certified speed.'
  },
  {
    id: 'lumina-ring-tracker',
    name: 'Lumina Smart Health Ring Gen 3',
    category: 'Wearables',
    tagline: 'Precision Titanium Biometric & Sleep Stage Tracking Ring',
    priceUSD: 159,
    originalPriceUSD: 199,
    priceBDT: 18900,
    originalPriceBDT: 23500,
    rating: 4.7,
    reviewsCount: 94,
    image: '/src/assets/images/gadget_smartwatch_ultra_1790571994448.jpg',
    brand: 'Lumina Tech',
    inStock: true,
    stockCount: 15,
    warranty: '1 Year Warranty',
    badge: 'Trending',
    colors: ['Mirror Gold', 'Matte Black', 'Brushed Silver'],
    specs: [
      { label: 'Material', value: 'Medical-Grade Titanium with Resin Inner' },
      { label: 'Sensors', value: 'Infrared PPG, NTC Temp, 3D Accelerometer' },
      { label: 'Battery', value: '7 Days Continuous Tracking on 1 Charge' },
      { label: 'Waterproof', value: '100m (10ATM) Swim & Shower Safe' },
      { label: 'Weight', value: 'Under 4 grams' }
    ],
    features: [
      'Comprehensive sleep architecture: REM, Deep, Light, and Sleep Score',
      'Continuous HRV (Heart Rate Variability) stress and recovery calculation',
      'Zero monthly subscription fee; full lifetime companion app access',
      'Wireless magnetic charging dock holds ring securely'
    ],
    inTheBox: [
      'Lumina Smart Ring',
      'Magnetic Jewel Charging Stand',
      'USB-C Braided Cable',
      'Sizing Kit Confirmation'
    ],
    description: 'Subtle, screen-free biometric tracking crafted from lightweight titanium. It tracks your sleep stages, body temperature variations, and cardiac recovery seamlessly without bulk on your wrist.'
  },
  {
    id: 'cyberkey-pro-keyboard',
    name: 'CyberKey 75% Tri-Mode Mechanical Keyboard',
    category: 'Gaming & Desk',
    tagline: 'Hot-Swappable Gasket Mounted Keyboard with Smart OLED Display',
    priceUSD: 129,
    originalPriceUSD: 159,
    priceBDT: 15400,
    originalPriceBDT: 18900,
    rating: 4.9,
    reviewsCount: 128,
    image: '/src/assets/images/hero_gadgets_showcase_1790571976516.jpg',
    brand: 'CyberKey Studio',
    inStock: true,
    stockCount: 20,
    warranty: '1 Year Official Warranty',
    badge: 'Creator Choice',
    colors: ['Cyber Gray', 'Retro White', 'Midnight Blue'],
    specs: [
      { label: 'Layout', value: '75% Compact (81 Keys + Volume Knob)' },
      { label: 'Connectivity', value: 'Bluetooth 5.3, 2.4GHz Wireless, USB-C' },
      { label: 'Switches', value: 'Factory Lubed Linear Cream Switches' },
      { label: 'Keycaps', value: 'Double-Shot PBT Cherry Profile' },
      { label: 'Battery', value: '4000mAh (Up to 200h with RGB Off)' }
    ],
    features: [
      'Customizable 0.85" OLED screen for custom GIFs, time, and battery level',
      '5-layer sound-dampening acoustic foams for deep creamy typing sound',
      'CNC aluminum multi-function rotary knob for instant volume control',
      'South-facing per-key RGB backlighting with 22 dynamic animations'
    ],
    inTheBox: [
      'CyberKey 75% Mechanical Keyboard',
      '2.4GHz Magnetic Dongle',
      '2-in-1 Keycap & Switch Puller',
      '4 Extra Replacement Switches',
      'Custom Coiled Aviator USB Cable'
    ],
    description: 'The ultimate typing feel for developers, writers, and gamers. Built with a gasket suspension mount and 5-layer acoustic dampening for that sought-after thocky, creamy keystroke.'
  },
  {
    id: 'magvault-powerbank-10k',
    name: 'MagVault 10,000mAh Magnetic Wireless Power Bank',
    category: 'Power',
    tagline: 'Kickstand MagSafe Battery Pack with 15W Qi2 Fast Wireless',
    priceUSD: 49,
    originalPriceUSD: 65,
    priceBDT: 5900,
    originalPriceBDT: 7800,
    rating: 4.8,
    reviewsCount: 110,
    image: '/src/assets/images/gadget_gan_charger_1790572022511.jpg',
    brand: 'VoltGrid Pro',
    inStock: true,
    stockCount: 50,
    warranty: '1 Year Warranty',
    badge: 'Essential',
    colors: ['Graphite Black', 'Titanium Gray'],
    specs: [
      { label: 'Capacity', value: '10,000mAh / 38.5Wh Li-Polymer' },
      { label: 'Wireless Output', value: '15W Qi2 Certified Magnetic' },
      { label: 'Wired Output', value: '20W PD Type-C Bidirectional' },
      { label: 'Kickstand', value: 'Zinc Alloy Foldable Multi-Angle' },
      { label: 'Weight', value: '195g Ultra-Slim' }
    ],
    features: [
      'Snaps firmly onto iPhone 12–16 models and MagSafe compatible cases',
      'Foldable kickstand supports both portrait FaceTime and landscape movies',
      'Pass-through charging allows simultaneous battery and phone charging',
      'Aero-aluminum frame keeps thermal transfer minimal and safe'
    ],
    inTheBox: [
      'MagVault 10,000mAh Battery Pack',
      '0.3m Braided USB-C Cable',
      'Magnetic Alignment Ring for Android Devices',
      'Instruction Guide'
    ],
    description: 'Compact magnetic power when you need it most. Strong N52 neodymium magnets latch onto your phone while the foldable metal kickstand turns it into an instant desktop cinema stand.'
  },
  {
    id: 'aerodrone-4k-mini',
    name: 'AeroDrone 4K Pro Foldable Gimbal Drone',
    category: 'Gaming & Desk',
    tagline: 'Under 249g Sub-Compact Drone with 3-Axis Gimbal & 4K60 HDR',
    priceUSD: 299,
    originalPriceUSD: 369,
    priceBDT: 35500,
    originalPriceBDT: 43000,
    rating: 4.9,
    reviewsCount: 78,
    image: '/src/assets/images/gadget_wireless_earbuds_1790572010262.jpg',
    brand: 'AeroSky Robotics',
    inStock: true,
    stockCount: 12,
    warranty: '1 Year Official Warranty',
    badge: 'Pro Gear',
    colors: ['Arctic Gray'],
    specs: [
      { label: 'Takeoff Weight', value: '246g (No Registration Required)' },
      { label: 'Camera Sensor', value: '1/1.3-inch CMOS, f/1.7 Aperture, 48MP' },
      { label: 'Video Specs', value: '4K/60fps HDR, 10-bit D-Log M' },
      { label: 'Flight Time', value: '38 Minutes Max per Battery' },
      { label: 'Transmission', value: '12km FHD Digital Video Transmission' },
      { label: 'Obstacle Sensing', value: 'Tri-Directional Infrared & Vision' }
    ],
    features: [
      'True Vertical Shooting mode for direct TikTok and Reels export',
      'Level 5 wind resistance holds position in up to 38 km/h gusts',
      'Smart Return-to-Home failsafe when signal drops or battery hits 15%',
      'ActiveTrack 4.0 follows runners, cyclists, and vehicles automatically'
    ],
    inTheBox: [
      'AeroDrone 4K Pro Aircraft',
      'RC Smart Controller with High-Bright Display',
      '2x Intelligent Flight Batteries',
      'Multi-Battery Charging Hub',
      'Shoulder Carrying Case',
      '3 Pairs of Low-Noise Spare Propellers'
    ],
    description: 'Pro aerial cinema in an ultra-light body that fits into your coat pocket. With dual native ISO and 3-axis mechanical gimbal stabilization, capture cinematic footage everywhere.'
  }
];

export const PROMO_CODES: Record<string, { discountPercent: number; description: string }> = {
  'ESHAN10': { discountPercent: 10, description: '10% Launch Special Discount' },
  'TECHVIP': { discountPercent: 15, description: '15% VIP Gadget Enthusiast Discount' },
  'FREESHIP': { discountPercent: 5, description: 'Special Delivery Rebate (5% off)' }
};
