// Pig of the Month BBQ Product Data

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  featured: boolean;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  image: string;
  backgroundColor?: string;
}

export const products: Product[] = [
  {
    id: '1',
    title: 'Bacon of the Month Club',
    price: 150.0,
    description: 'Small-Batch Bacon, delivered Bacon & monthly. Premium artisan bacon from select farms across America.',
    rating: 4.9,
    reviewCount: 74,
    image: 'https://images.unsplash.com/photo-1606851091851-e8c8c0fca5ba?w=400&q=80',
    category: 'Subscriptions',
    featured: true,
  },
  {
    id: '2',
    title: 'BBQ Sauce of the Month Club',
    price: 25.0,
    description: 'Discover new flavors every month with our curated BBQ sauce selection from pitmasters nationwide.',
    rating: 4.8,
    reviewCount: 56,
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=80',
    category: 'Subscriptions',
    featured: true,
  },
  {
    id: '3',
    title: 'Giant Bacon Cinnamon Roll',
    price: 25.0,
    description: 'Sweet meets savory in this indulgent treat. Fresh-baked cinnamon roll topped with crispy bacon.',
    rating: 4.7,
    reviewCount: 42,
    image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&q=80',
    category: 'Treats',
    featured: true,
  },
  {
    id: '4',
    title: 'Smoked Ham Holiday Pack',
    price: 89.0,
    description: 'Perfectly smoked ham ideal for holiday gatherings. Serves 8-10 people.',
    rating: 4.9,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    category: 'Holiday',
    featured: true,
  },
  {
    id: '5',
    title: 'Premium Pulled Pork',
    price: 45.0,
    description: 'Slow-smoked for 12 hours. Tender, juicy, and full of authentic BBQ flavor.',
    rating: 4.8,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80',
    category: 'BBQ',
    featured: true,
  },
  {
    id: '6',
    title: 'BBQ Dry Rub Collection',
    price: 35.0,
    description: 'Set of 4 signature dry rubs for beef, pork, chicken, and seafood.',
    rating: 4.6,
    reviewCount: 67,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
    category: 'Seasonings',
    featured: false,
  },
  {
    id: '7',
    title: 'Artisan Sausage Sampler',
    price: 55.0,
    description: 'Variety pack featuring 6 different handcrafted sausage flavors.',
    rating: 4.7,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
    category: 'BBQ',
    featured: true,
  },
  {
    id: '8',
    title: 'Honey Glazed Ribs',
    price: 65.0,
    description: 'Fall-off-the-bone tender ribs with our signature honey glaze.',
    rating: 4.9,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    category: 'BBQ',
    featured: true,
  },
];

export const heroBanners: HeroBanner[] = [
  {
    id: '1',
    title: 'CHRISTMAS\nMEAL\nESSENTIALS',
    buttonText: 'SHOP NOW',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
  },
  {
    id: '2',
    title: 'BACON OF\nTHE MONTH\nCLUB',
    subtitle: 'Premium Artisan Bacon',
    buttonText: 'JOIN NOW',
    image: 'https://images.unsplash.com/photo-1606851091851-e8c8c0fca5ba?w=800&q=80',
  },
  {
    id: '3',
    title: 'HOLIDAY\nGIFT\nBOXES',
    subtitle: 'Perfect for any BBQ lover',
    buttonText: 'SHOP GIFTS',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80',
  },
];

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product) => product.category === category);
};
