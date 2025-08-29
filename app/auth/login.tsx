import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Here you would typically make an API call to verify credentials
      // For now, we'll simulate a successful login
      console.log('Logging in with:', { username, password });
      
      // Navigate to the main app
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please check your credentials.');
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
                placeholder="Email or username"
                placeholderTextColor="#a0a0a0"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="email"
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
              >
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              onPress={() => router.push('/auth/signup')}
              style={styles.signupLink}
            >
              <Text style={styles.signupText}>
                Don't have an account? <Text style={styles.signupTextBold}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
}); 