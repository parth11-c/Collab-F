import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../../lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^\+?[\d\s-]{10,}$/.test(phone)) newErrors.phone = 'Invalid phone number';
    
    if (!password) newErrors.password = 'Password is required';
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      
      // ✅ Only sign up user — no manual insert into profiles
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            username,
            phone,
          }
        }
      });

      if (signUpError) throw signUpError;

      // Show success message
      Alert.alert(
        'Success',
        'Please check your email for verification link',
        [{ text: 'OK', onPress: () => router.push('/auth/login') }]
      );
      
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to sign up. Please try again.');
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
              <Text style={styles.title}>Join Collab</Text>
              <Text style={styles.subtitle}>Create your account</Text>
            </View>
            
            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <TextInput
                    style={[styles.input, errors.firstName && styles.inputError]}
                    placeholder="First Name"
                    placeholderTextColor="#a0a0a0"
                    value={firstName}
                    onChangeText={setFirstName}
                    editable={!loading}
                  />
                  {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                </View>
                <View style={styles.halfInput}>
                  <TextInput
                    style={[styles.input, errors.lastName && styles.inputError]}
                    placeholder="Last Name"
                    placeholderTextColor="#a0a0a0"
                    value={lastName}
                    onChangeText={setLastName}
                    editable={!loading}
                  />
                  {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                </View>
              </View>

              <TextInput
                style={[styles.input, errors.username && styles.inputError]}
                placeholder="Username"
                placeholderTextColor="#a0a0a0"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!loading}
              />
              {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email"
                placeholderTextColor="#a0a0a0"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="Phone Number"
                placeholderTextColor="#a0a0a0"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                editable={!loading}
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                placeholderTextColor="#a0a0a0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder="Confirm Password"
                placeholderTextColor="#a0a0a0"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

              <TouchableOpacity 
                style={styles.signupButton}
                onPress={handleSignup}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.signupButtonText}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              onPress={() => router.push('/auth/login')}
              style={styles.loginLink}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginTextBold}>Sign in</Text>
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
    maxWidth: 400,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -6,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#333333',
    fontFamily: 'Poppins-Regular',
  },
  inputError: {
    borderColor: '#ff6b6b',
    borderWidth: 1,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -4,
    fontFamily: 'Poppins-Regular',
  },
  signupButton: {
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
  signupButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'Poppins-SemiBold',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#666666',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  loginTextBold: {
    color: '#4CAF50',
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});