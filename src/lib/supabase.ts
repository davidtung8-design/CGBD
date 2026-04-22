import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Use environment variables for security.
// Define these in your Settings -> Secrets in AI Studio.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 邮箱/密码登录
export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })
  
  if (error) {
    console.error('登录失败:', error.message)
    throw error
  }
  
  console.log('登录成功:', data.user)
  return data.user
}

// 注册新账号
export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  })
  
  if (error) {
    console.error('注册失败:', error.message)
    throw error
  }
  
  console.log('注册成功，请查收验证邮件:', data.user)
  return data.user
}

// Google 登录（推荐，最简单）
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin  // 登录后跳回的地址
    }
  })
  
  if (error) {
    console.error('Google登录失败:', error.message)
    throw error
  }
}

// 登出
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('登出失败:', error.message)
    throw error
  }
}
