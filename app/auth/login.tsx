import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme, themeColors } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const { signIn } = useAuth();
  const { setUserProfile } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      
      // Sign in using Supabase auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else if (profile) {
          setUserProfile(profile);
        }
      }

      // AuthContext will handle navigation
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <LinearGradient
        colors={['#f0f7f4', '#e3f0e8', '#d6e9dc']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>Sign in to continue your journey</Text>
            </View>
            
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#a0a0a0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
              
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={[styles.buttonGradient, loading && styles.buttonDisabled]}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={styles.loginButtonText}>Sign In</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            <View style={styles.linkContainer}>
              <TouchableOpacity 
                onPress={() => router.push('/auth/signup')}
                style={styles.signupLink}
              >
                <Text style={styles.signupText}>
                  Don't have an account? <Text style={styles.signupTextBold}>Sign up</Text>
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={async () => {
                  if (!email) {
                    Alert.alert('Error', 'Please enter your email address');
                    return;
                  }
                  try {
                    setLoading(true);
                    await supabase.auth.resend({
                      type: 'signup',
                      email: email,
                    });
                    Alert.alert('Success', 'Verification email has been resent');
                  } catch (error: any) {
                    Alert.alert('Error', error?.message || 'Failed to resend verification email');
                  } finally {
                    setLoading(false);
                  }
                }}
                style={styles.verifyLink}
              >
                <Text style={styles.verifyText}>
                  Need verification email? <Text style={styles.verifyTextBold}>Resend</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  buttonDisabled: {
    opacity: 0.7,
  },
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d5a27',
    marginBottom: 6,
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#3a6b33',
    opacity: 0.9,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#333333',
    fontFamily: 'Poppins-Regular',
  },
  loginButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 6,
    shadowColor: '#27ae60',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonGradient: {
    padding: 14,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'Poppins-SemiBold',
  },
  signupLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    color: '#666666',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  signupTextBold: {
    color: '#4CAF50',
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
    gap: 12,
  },
  verifyLink: {
    alignItems: 'center',
  },
  verifyText: {
    color: '#666666',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  verifyTextBold: {
    color: '#3498db',
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});