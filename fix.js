import fs from 'fs';
import path from 'path';

const srcDir = './src';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace useState(() => get*(...)) with useState([]) and useEffect
  // Examples:
  // const [allProducts] = useState(() => getManagedProducts(defaultProducts));
  // const [products, setProducts] = useState(() => getManagedProducts(defaultProducts));

  // A very common pattern is useEffect(() => { set*(get*()) })
  content = content.replace(/setOrders\(getOrders\(\)\);/g, 'getOrders().then(setOrders);');
  content = content.replace(/setProducts\(getManagedProducts\(defaultProducts\)\);/g, 'getManagedProducts(defaultProducts).then(setProducts);');
  content = content.replace(/setUsers\(getAllUsers\(\)\);/g, 'getAllUsers().then(setUsers);');
  content = content.replace(/setMessages\(getMessages\(\)\);/g, 'getMessages().then(setMessages);');
  content = content.replace(/setSlides\(getCarousel\(\)\);/g, 'getCarousel().then(setSlides);');

  // For Products.tsx:
  // const [allProducts] = useState(() => getManagedProducts(defaultProducts));
  if (content.includes('const [allProducts] = useState(() => getManagedProducts(defaultProducts));')) {
    content = content.replace(
      'const [allProducts] = useState(() => getManagedProducts(defaultProducts));',
      'const [allProducts, setAllProducts] = useState<typeof defaultProducts>([]);\n  useEffect(() => { getManagedProducts(defaultProducts).then(setAllProducts) }, []);'
    );
  }

  // Wishlist in Products.tsx
  // setWishlistIds(new Set(allProducts.filter(p => isInWishlist(p.id)).map(p => p.id)));
  // Actually we have async getWishlist.
  if (content.includes('isInWishlist(p.id)')) {
    content = content.replace(
      /setWishlistIds\(new Set\([\s\S]*?isInWishlist\([\s\S]*?\)\);/g,
      `getWishlist().then(list => setWishlistIds(new Set(list)));`
    );
  }

  // handleWishlist async toggle
  if (content.includes('const handleWishlist = (productId: string, e: React.MouseEvent) => {') || content.includes('const handleWishlist = (id: string) => {')) {
    content = content.replace(
      /const handleWishlist = \((.*?)\) => {([\s\S]*?)const now = toggleWishlist\((.*?)\);/g,
      `const handleWishlist = async ($1) => {$2const now = await toggleWishlist($3);`
    );
  }

  // getOrders in UserOrders
  content = content.replace(/setOrders\(getUserOrders\(user\.id\)\);/g, 'getUserOrders(user.id).then(setOrders);');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walk(srcDir);
