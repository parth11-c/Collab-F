import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Here you would typically make an API call to your backend
    // For now, we'll simulate a successful signup
    try {
      // Simulate API call
      console.log('Signing up with:', { fullName, email, password });
      
      // On successful signup, navigate to the main app
      router.push('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign up. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f0f7f4', '#e3f0e8', '#d6e9dc']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Join Collab</Text>
          <Text style={styles.subtitle}>Create your account</Text>
          
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#3a6b33"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#3a6b33"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#3a6b33"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2d5a27',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#3a6b33',
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.9,
    fontFamily: 'Poppins-Regular',
  },
  form: {
    width: '100%',
    maxWidth: 300,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d6e9dc',
    fontFamily: 'Poppins-Regular',
  },
  button: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#3a6b33',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});