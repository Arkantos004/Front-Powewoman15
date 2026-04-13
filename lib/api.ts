import axios, { AxiosInstance } from 'axios';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_BASE = API_URL.replace('/api', ''); // URL base sin /api

console.log('🔗 API URL configurada:', API_URL);
console.log('🔗 API Base URL:', API_BASE);

/**
 * Resuelve URLs de imágenes relativas contra el servidor API
 */
function resolveImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;
  
  // Si ya es una URL absoluta, devolverla tal cual
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Si es una ruta relativa de uploads, resolverla contra el servidor API
  if (imageUrl.startsWith('/uploads/')) {
    return `${API_BASE}${imageUrl}`;
  }
  
  return imageUrl;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
  token?: string;
}

// Crear instancia de axios con configuración
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT automáticamente
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Token agregado a request');
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globales
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response recibida:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Error en response:', error.response?.status, error.message);
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Fetch all products
 */
export async function fetchProducts(): Promise<any[]> {
  try {
    console.log('📡 Fetching products');
    const response = await apiClient.get<ApiResponse>('/products');
    console.log('✅ Productos cargados:', response.data);
    
    // Resolver URLs de imágenes para todos los productos
    const products = response.data.data || response.data || [];
    return products.map((product: any) => ({
      ...product,
      image_url: resolveImageUrl(product.image_url),
    }));
  } catch (error: any) {
    console.error('❌ Error fetching products:', error.message);
    return [];
  }
}

/**
 * Create an order
 */
export async function createOrder(items: any[], token?: string): Promise<ApiResponse> {
  try {
    console.log('📡 Creating order:', items);
    const response = await apiClient.post<ApiResponse>('/orders', { items });
    console.log('✅ Order creada:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error creating order:', error.message);
    throw new Error(error.response?.data?.error || error.message || 'Error al crear orden');
  }
}

/**
 * Register a new user
 */
export async function register(
  email: string,
  fullName: string,
  password: string,
  additionalInfo?: {
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  }
): Promise<ApiResponse> {
  try {
    console.log('📡 Registrando usuario:', email);
    const response = await apiClient.post<ApiResponse>('/users/register', {
      email,
      full_name: fullName,
      password,
      phone: additionalInfo?.phone,
      address: additionalInfo?.address,
      city: additionalInfo?.city,
      country: additionalInfo?.country,
      postal_code: additionalInfo?.postalCode,
    });
    console.log('✅ Usuario registrado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error registering:', error.message);
    const errorMsg = error.response?.data?.error || error.message || 'Error al registrarse';
    throw new Error(errorMsg);
  }
}

/**
 * Login user
 */
export async function login(email: string, password: string): Promise<ApiResponse> {
  try {
    console.log('📡 Login usuario:', email);
    const response = await apiClient.post<ApiResponse>('/users/login', {
      email,
      password,
    });
    console.log('✅ Usuario logueado:', response.data);
    
    // Guardar token en localStorage
    if (response.data.token && typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
      console.log('💾 Token guardado en localStorage');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Error logging in:', error.message);
    const errorMsg = error.response?.data?.error || error.message || 'Usuario o contraseña inválidos';
    throw new Error(errorMsg);
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(): Promise<ApiResponse> {
  try {
    console.log('📡 Fetching user profile');
    const response = await apiClient.get<ApiResponse>('/users/profile');
    console.log('✅ Perfil cargado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching profile:', error.message);
    throw new Error(error.response?.data?.error || error.message);
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: any): Promise<ApiResponse> {
  try {
    console.log('📡 Updating user profile');
    const response = await apiClient.put<ApiResponse>('/users/profile', data);
    console.log('✅ Perfil actualizado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error updating profile:', error.message);
    throw new Error(error.response?.data?.error || error.message);
  }
}

/**
 * Get all users (admin)
 */
export async function getAllUsers(): Promise<ApiResponse> {
  try {
    console.log('📡 Fetching all users');
    const response = await apiClient.get<ApiResponse>('/users');
    console.log('✅ Usuarios cargados:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching users:', error.message);
    throw new Error(error.response?.data?.error || error.message);
  }
}

/**
 * Export apiClient for direct use if needed
 */
export default apiClient;

/**
 * ADMIN FUNCTIONS
 */

/**
 * Create a new product (Admin only)
 */
export async function createProduct(productData: {
  name: string
  description?: string
  category: string
  price_cop: number
  image_url?: string
  stock_quantity?: number
}): Promise<ApiResponse> {
  try {
    console.log('📡 Creando producto:', productData.name)
    const response = await apiClient.post<ApiResponse>('/products', productData)
    console.log('✅ Producto creado:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Error creando producto:', error.message)
    throw new Error(error.response?.data?.error || error.message || 'Error al crear producto')
  }
}

/**
 * Update a product (Admin only)
 */
export async function updateProduct(
  id: number,
  productData: Partial<{
    name: string
    description: string
    category: string
    price_cop: number
    image_url: string
    stock_quantity: number
    is_available: boolean
  }>
): Promise<ApiResponse> {
  try {
    console.log('📡 Actualizando producto:', id)
    const response = await apiClient.put<ApiResponse>(`/products/${id}`, productData)
    console.log('✅ Producto actualizado:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Error actualizando producto:', error.message)
    throw new Error(error.response?.data?.error || error.message || 'Error al actualizar producto')
  }
}

/**
 * Delete a product (Admin only)
 */
export async function deleteProduct(id: number): Promise<ApiResponse> {
  try {
    console.log('📡 Eliminando producto:', id)
    const response = await apiClient.delete<ApiResponse>(`/products/${id}`)
    console.log('✅ Producto eliminado:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Error eliminando producto:', error.message)
    throw new Error(error.response?.data?.error || error.message || 'Error al eliminar producto')
  }
}

/**
 * Get all users (Admin only)
 */
export async function getAllUsersAdmin(): Promise<any[]> {
  try {
    console.log('📡 Obteniendo usuarios')
    const response = await apiClient.get<ApiResponse>('/users/all')
    console.log('✅ Usuarios cargados:', response.data)
    return response.data.data || response.data || []
  } catch (error: any) {
    console.error('❌ Error obteniendo usuarios:', error.message)
    return []
  }
}

/**
 * Update user (Admin only)
 */
export async function updateUser(
  id: number,
  userData: Partial<{
    email: string
    full_name: string
    phone: string
    address: string
    city: string
    country: string
    postal_code: string
    is_admin: boolean
  }>
): Promise<ApiResponse> {
  try {
    console.log('📡 Actualizando usuario:', id)
    const response = await apiClient.put<ApiResponse>(`/users/${id}`, userData)
    console.log('✅ Usuario actualizado:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Error actualizando usuario:', error.message)
    throw new Error(error.response?.data?.error || error.message || 'Error al actualizar usuario')
  }
}

/**
 * Delete user (Admin only)
 */
export async function deleteUser(id: number): Promise<ApiResponse> {
  try {
    console.log('📡 Eliminando usuario:', id)
    const response = await apiClient.delete<ApiResponse>(`/users/${id}`)
    console.log('✅ Usuario eliminado:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Error eliminando usuario:', error.message)
    throw new Error(error.response?.data?.error || error.message || 'Error al eliminar usuario')
  }
}

/**
 * Upload image
 */
export async function uploadImage(file: File): Promise<{ url: string; filename: string }> {
  try {
    console.log('📡 Subiendo imagen:', file.name)
    
    const formData = new FormData()
    formData.append('file', file)
    
    // Usar axios directamente sin el interceptor de application/json
    const response = await axios.post<any>(
      `${API_URL}/upload/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`
        }
      }
    )
    
    console.log('✅ Imagen subida:', response.data)
    return {
      url: response.data.url,
      filename: response.data.filename
    }
  } catch (error: any) {
    console.error('❌ Error subiendo imagen:', error.message)
    throw new Error(error.response?.data?.error || error.message || 'Error al subir imagen')
  }
}

/**
 * Request to become an instructor
 */
export async function requestInstructor(): Promise<ApiResponse> {
  try {
    console.log('📡 Solicitando ser instructora');
    const response = await apiClient.post<ApiResponse>('/users/request-instructor');
    console.log('✅ Solicitud enviada:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error solicitando instructora:', error.message);
    throw new Error(error.response?.data?.error || error.message || 'Error al solicitar ser instructora');
  }
}

/**
 * Get instructor requests (Admin only)
 */
export async function getInstructorRequests(): Promise<any[]> {
  try {
    console.log('📡 Obteniendo solicitudes de instructoras');
    const response = await apiClient.get<ApiResponse>('/users/instructor/requests');
    console.log('✅ Solicitudes obtenidas:', response.data);
    return response.data.data || [];
  } catch (error: any) {
    console.error('❌ Error obteniendo solicitudes:', error.message);
    return [];
  }
}

/**
 * Approve instructor (Admin only)
 */
export async function approveInstructor(userId: number): Promise<ApiResponse> {
  try {
    console.log('📡 Aprobando instructora:', userId);
    const response = await apiClient.patch<ApiResponse>(`/users/${userId}/approve-instructor`);
    console.log('✅ Instructora aprobada:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error aprobando:', error.message);
    throw new Error(error.response?.data?.error || error.message || 'Error al aprobar');
  }
}

/**
 * Reject instructor request (Admin only)
 */
export async function rejectInstructor(userId: number): Promise<ApiResponse> {
  try {
    console.log('📡 Rechazando solicitud de instructora:', userId);
    const response = await apiClient.patch<ApiResponse>(`/users/${userId}/reject-instructor`);
    console.log('✅ Solicitud rechazada:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error rechazando:', error.message);
    throw new Error(error.response?.data?.error || error.message || 'Error al rechazar');
  }
}

/**
 * Get all courses
 */
export async function getCourses(): Promise<any[]> {
  try {
    console.log('📡 Obteniendo cursos');
    const response = await apiClient.get<ApiResponse>('/courses');
    console.log('✅ Cursos obtenidos:', response.data);
    
    const courses = response.data.data || response.data || [];
    return courses.map((course: any) => ({
      ...course,
      image_url: resolveImageUrl(course.image_url),
    }));
  } catch (error: any) {
    console.error('❌ Error obteniendo cursos:', error.message);
    return [];
  }
}

/**
 * Get my courses (Instructor only)
 */
export async function getMyInstructorCourses(): Promise<any[]> {
  try {
    console.log('📡 Obteniendo mis cursos');
    const response = await apiClient.get<ApiResponse>('/courses/instructor/my-courses');
    console.log('✅ Mis cursos obtenidos:', response.data);
    
    const courses = response.data.data || response.data || [];
    return courses.map((course: any) => ({
      ...course,
      image_url: resolveImageUrl(course.image_url),
    }));
  } catch (error: any) {
    console.error('❌ Error obteniendo mis cursos:', error.message);
    return [];
  }
}

/**
 * Get single course with modules and lessons
 */
export async function getCourseDetail(courseId: number): Promise<any> {
  try {
    console.log('📡 Obteniendo detalles del curso:', courseId);
    const response = await apiClient.get<ApiResponse>(`/courses/${courseId}`);
    console.log('✅ Detalles obtenidos:', response.data);
    
    const course = response.data.data || response.data;
    return {
      ...course,
      image_url: resolveImageUrl(course.image_url),
    };
  } catch (error: any) {
    console.error('❌ Error obteniendo detalles:', error.message);
    throw new Error(error.response?.data?.error || error.message || 'Error al obtener curso');
  }
}

/**
 * Create course (Instructor only)
 */
export async function createCourse(courseData: {
  title: string;
  description?: string;
  image_url?: string;
  price_cop?: number;
}): Promise<ApiResponse> {
  try {
    console.log('📡 Creando curso:', courseData);
    const response = await apiClient.post<ApiResponse>('/courses', courseData);
    console.log('✅ Curso creado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error creando curso:', error.message);
    throw new Error(error.response?.data?.error || error.message || 'Error al crear curso');
  }
}

/**
 * Update course (Instructor only)
 */
export async function updateCourse(
  courseId: number,
  courseData: Partial<{
    title: string;
    description: string;
    image_url: string;
    price_cop: number;
    is_published: boolean;
  }>
): Promise<ApiResponse> {
  try {
    console.log('📡 Actualizando curso:', courseId);
    const response = await apiClient.put<ApiResponse>(`/courses/${courseId}`, courseData);
    console.log('✅ Curso actualizado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error actualizando curso:', error.message);
    throw new Error(error.response?.data?.error || error.message || 'Error al actualizar curso');
  }
}

/**
 * Delete course (Instructor only)
 */
export async function deleteCourse(courseId: number): Promise<ApiResponse> {
  try {
    console.log('📡 Eliminando curso:', courseId);
    const response = await apiClient.delete<ApiResponse>(`/courses/${courseId}`);
    console.log('✅ Curso eliminado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error eliminando curso:', error.message);
    throw new Error(error.response?.data?.error || error.message || 'Error al eliminar curso');
  }
}

