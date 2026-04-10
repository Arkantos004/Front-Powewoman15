// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://postilioned-symmetrically-margarita.ngrok-free.dev/api';

console.log('🔗 API URL configurada:', API_URL);

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Headers por defecto para todas las peticiones
const defaultHeaders = {
  'Content-Type': 'application/json',
};

export async function fetchProducts() {
  try {
    const url = `${API_URL}/products`;
    console.log('📡 Fetching products desde:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: defaultHeaders,
      mode: 'cors',
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Productos cargados:', data);
    return data.data || data;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    // Retornar array vacío para no romper la UI
    return [];
  }
}

export async function createOrder(items: any[], token: string) {
  try {
    const url = `${API_URL}/orders`;
    console.log('📡 Creating order:', url, items);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${token}`,
      },
      mode: 'cors',
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Order creada:', data);
    return data;
  } catch (error) {
    console.error('❌ Error creating order:', error);
    throw error;
  }
}

export async function register(email: string, fullName: string, password: string) {
  try {
    const url = `${API_URL}/users/register`;
    console.log('📡 Registrando usuario:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: defaultHeaders,
      mode: 'cors',
      body: JSON.stringify({ email, full_name: fullName, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Usuario registrado:', data);
    return data;
  } catch (error) {
    console.error('❌ Error registering:', error);
    throw error;
  }
}

export async function login(email: string, password: string) {
  try {
    const url = `${API_URL}/users/login`;
    console.log('📡 Login usuario:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: defaultHeaders,
      mode: 'cors',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Usuario logueado:', data);
    return data;
  } catch (error) {
    console.error('❌ Error logging in:', error);
    throw error;
  }
}
