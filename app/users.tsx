import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, themeColors } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

export default function UsersScreen() {
  const { theme, isDarkMode } = useTheme();
  const colors = themeColors[theme];
  const router = useRouter();

  // Mock data for users - replace with actual data from your backend
  const users = [
    { id: 1, name: 'John Doe', role: 'Full Stack Developer', skills: ['React', 'Node.js', 'Python'] },
    { id: 2, name: 'Jane Smith', role: 'UI/UX Designer', skills: ['Figma', 'Photoshop', 'Illustrator'] },
    { id: 3, name: 'Mike Johnson', role: 'Data Scientist', skills: ['Python', 'TensorFlow', 'SQL'] },
    { id: 4, name: 'Sarah Williams', role: 'DevOps Engineer', skills: ['AWS', 'Docker', 'Kubernetes'] },
    { id: 5, name: 'David Brown', role: 'Mobile Developer', skills: ['React Native', 'Swift', 'Kotlin'] },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Collaborators</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {users.map((user) => (
            <TouchableOpacity 
              key={user.id} 
              style={[styles.userCard, { 
                backgroundColor: isDarkMode ? 'rgba(42, 58, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                borderColor: isDarkMode ? '#2A3A2A' : '#E0E0E0',
                borderWidth: 1,
              }]}
              activeOpacity={0.9}
            >
              <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                  <Text style={[styles.userRole, { color: colors.secondaryText }]}>{user.role}</Text>
                </View>
              </View>
              <View style={styles.skillsContainer}>
                {user.skills.map((skill, index) => (
                  <View 
                    key={index} 
                    style={[styles.skillTag, { 
                      backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(46, 125, 50, 0.1)',
                    }]}
                  >
                    <Text style={[styles.skillText, { 
                      color: isDarkMode ? '#4CAF50' : '#2E7D32',
                    }]}>{skill}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  userCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
}); 