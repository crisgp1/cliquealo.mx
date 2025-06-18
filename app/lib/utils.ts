/**
 * Capitaliza correctamente las marcas de autos en un título
 * Maneja casos especiales como BMW, Mercedes-Benz, etc.
 */
export function capitalizeBrandInTitle(title: string): string {
  if (!title) return title;

  // Mapa de marcas con su capitalización correcta
  const brandCapitalization: Record<string, string> = {
    'bmw': 'BMW',
    'mercedes-benz': 'Mercedes-Benz',
    'mercedes': 'Mercedes-Benz',
    'volkswagen': 'Volkswagen',
    'nissan': 'Nissan',
    'toyota': 'Toyota',
    'honda': 'Honda',
    'ford': 'Ford',
    'chevrolet': 'Chevrolet',
    'hyundai': 'Hyundai',
    'kia': 'Kia',
    'mazda': 'Mazda',
    'suzuki': 'Suzuki',
    'audi': 'Audi',
    'seat': 'SEAT',
    'renault': 'Renault',
    'peugeot': 'Peugeot',
    'mitsubishi': 'Mitsubishi',
    'jeep': 'Jeep',
    'subaru': 'Subaru',
    'volvo': 'Volvo',
    'lexus': 'Lexus',
    'infiniti': 'Infiniti',
    'acura': 'Acura',
    'cadillac': 'Cadillac',
    'lincoln': 'Lincoln',
    'buick': 'Buick',
    'gmc': 'GMC',
    'dodge': 'Dodge',
    'chrysler': 'Chrysler',
    'ram': 'RAM',
    'fiat': 'FIAT',
    'alfa romeo': 'Alfa Romeo',
    'maserati': 'Maserati',
    'ferrari': 'Ferrari',
    'lamborghini': 'Lamborghini',
    'porsche': 'Porsche',
    'bentley': 'Bentley',
    'rolls-royce': 'Rolls-Royce',
    'jaguar': 'Jaguar',
    'land rover': 'Land Rover',
    'mini': 'MINI',
    'smart': 'smart',
    'tesla': 'Tesla',
    'genesis': 'Genesis',
    'mg': 'MG',
    'byd': 'BYD',
    'chery': 'Chery',
    'geely': 'Geely',
    'great wall': 'Great Wall',
    'haval': 'Haval',
    'jac': 'JAC',
    'dongfeng': 'Dongfeng',
    'foton': 'Foton',
    'isuzu': 'Isuzu',
    'hino': 'Hino',
    'freightliner': 'Freightliner',
    'kenworth': 'Kenworth',
    'peterbilt': 'Peterbilt',
    'mack': 'Mack',
    'international': 'International'
  };

  // Dividir el título en palabras
  const words = title.split(' ');
  
  // Procesar cada palabra
  const processedWords = words.map((word, index) => {
    const lowerWord = word.toLowerCase();
    
    // Si es la primera palabra después del año (posición 1), probablemente es la marca
    if (index === 1) {
      // Buscar coincidencia exacta primero
      if (brandCapitalization[lowerWord]) {
        return brandCapitalization[lowerWord];
      }
      
      // Buscar coincidencias parciales para marcas compuestas
      for (const [key, value] of Object.entries(brandCapitalization)) {
        if (lowerWord.includes(key) || key.includes(lowerWord)) {
          return value;
        }
      }
      
      // Si no se encuentra, capitalizar la primera letra
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    
    // Para otras palabras, mantener como están pero capitalizar primera letra si es necesario
    if (word.length > 0 && /^[a-z]/.test(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    
    return word;
  });
  
  return processedWords.join(' ');
}

/**
 * Capitaliza correctamente una marca de auto
 */
export function capitalizeBrand(brand: string): string {
  if (!brand) return brand;

  const brandCapitalization: Record<string, string> = {
    'bmw': 'BMW',
    'mercedes-benz': 'Mercedes-Benz',
    'mercedes': 'Mercedes-Benz',
    'volkswagen': 'Volkswagen',
    'nissan': 'Nissan',
    'toyota': 'Toyota',
    'honda': 'Honda',
    'ford': 'Ford',
    'chevrolet': 'Chevrolet',
    'hyundai': 'Hyundai',
    'kia': 'Kia',
    'mazda': 'Mazda',
    'suzuki': 'Suzuki',
    'audi': 'Audi',
    'seat': 'SEAT',
    'renault': 'Renault',
    'peugeot': 'Peugeot',
    'mitsubishi': 'Mitsubishi',
    'jeep': 'Jeep'
  };

  const lowerBrand = brand.toLowerCase();
  return brandCapitalization[lowerBrand] || brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
}