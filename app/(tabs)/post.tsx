import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useTheme, themeColors } from '../../context/ThemeContext';
import { useProjects } from '../../context/ProjectContext';
import { useNotifications } from '../../context/NotificationContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: 1, name: 'AI & ML', icon: 'analytics' as const },
  { id: 2, name: 'Cloud', icon: 'cloud' as const },
  { id: 3, name: 'Web Dev', icon: 'globe' as const },
  { id: 4, name: 'Mobile', icon: 'phone-portrait' as const },
  { id: 5, name: 'Data Science', icon: 'bar-chart' as const },
  { id: 6, name: 'DevOps', icon: 'code' as const }
];

export default function CreateScreen() {
  const { theme, isDarkMode } = useTheme();
  const colors = themeColors[theme];
  const { addProject } = useProjects();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const [projectName, setProjectName] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [techStack, setTechStack] = useState('');
  const [languages, setLanguages] = useState('');
  const [groupMembers, setGroupMembers] = useState('');
  const [projectDuration, setProjectDuration] = useState('');
  const [projectType, setProjectType] = useState('');
  const [category, setCategory] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handlePost = () => {
    if (!projectName.trim() || !projectDetails.trim() || !category) return;
    
    // Add the project
    addProject({
      name: projectName.trim(),
      description: projectDetails.trim(),
      status: 'active',
      technologies: technologies.trim().split(',').map(tech => tech.trim()),
      techStack: techStack.trim().split(',').map(stack => stack.trim()),
      languages: languages.trim().split(',').map(lang => lang.trim()),
      groupMembers: groupMembers.trim().split(',').map(member => member.trim()),
      duration: projectDuration.trim(),
      type: projectType.trim(),
      category: category,
      tags: ['React Native', 'Expo'],
    });

    // Add a notification
    addNotification({
      type: 'project',
      title: 'New Project Created',
      message: `You have created a new project: ${projectName.trim()}`,
      time: 'Just now',
    });
    
    // Reset form
    setProjectName('');
    setProjectDetails('');
    setTechnologies('');
    setTechStack('');
    setLanguages('');
    setGroupMembers('');
    setProjectDuration('');
    setProjectType('');
    setCategory('');
    
    // Navigate back to home
    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]] as [string, string]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.headerContainer}>
              <Text style={[styles.title, { color: colors.text }]}>Create Project Post</Text>
              <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Share your project with the community</Text>
            </View>

            <View style={styles.form}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  borderColor: isDarkMode ? '#2A3A2A' : '#e0e0e0',
                  color: colors.text
                }]}
                placeholder="Project Name"
                placeholderTextColor={colors.secondaryText}
                value={projectName}
                onChangeText={setProjectName}
              />

              <TouchableOpacity
                style={[styles.categoryButton, { 
                  backgroundColor: colors.background,
                  borderColor: isDarkMode ? '#2A3A2A' : '#e0e0e0',
                }]}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={[styles.categoryButtonText, { color: category ? colors.text : colors.secondaryText }]}>
                  {category || 'Select Project Category'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.secondaryText} />
              </TouchableOpacity>

              <Modal
                visible={showCategoryModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCategoryModal(false)}
              >
                <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                  <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
                    <View style={styles.modalHeader}>
                      <Text style={[styles.modalTitle, { color: colors.text }]}>Select Category</Text>
                      <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                        <Ionicons name="close" size={24} color={colors.text} />
                      </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.categoryList}>
                      {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                          key={cat.id}
                          style={[
                            styles.categoryItem,
                            category === cat.name && { backgroundColor: isDarkMode ? '#2A3A2A' : '#E0E0E0' }
                          ]}
                          onPress={() => {
                            setCategory(cat.name);
                            setShowCategoryModal(false);
                          }}
                        >
                          <Ionicons name={cat.icon} size={24} color={colors.text} />
                          <Text style={[styles.categoryItemText, { color: colors.text }]}>{cat.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </Modal>

              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  borderColor: isDarkMode ? '#2A3A2A' : '#e0e0e0',
                  color: colors.text
                }]}
                placeholder="Project Type (e.g., Web, Mobile, Desktop)"
                placeholderTextColor={colors.secondaryText}
                value={projectType}
                onChangeText={setProjectType}
              />

              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  borderColor: isDarkMode ? '#2A3A2A' : '#e0e0e0',
                  color: colors.text
                }]}
                placeholder="Technologies Used (comma separated)"
                placeholderTextColor={colors.secondaryText}
                value={technologies}
                onChangeText={setTechnologies}
              />

              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  borderColor: isDarkMode ? '#2A3A2A' : '#e0e0e0',
                  color: colors.text
                }]}
                placeholder="Tech Stack (comma separated)"
                placeholderTextColor={colors.secondaryText}
                value={techStack}
                onChangeText={setTechStack}
              />

              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  borderColor: isDarkMode ? '#2A3A2A' : '#e0e0e0',
                  color: colors.text
                }]}
                placeholder="Programming Languages (comma separated)"
                placeholderTextColor={colors.secondaryText}
                value={languages}
                onChangeText={setLanguages}
              />

              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  borderColor: isDarkMode ? '#2A3A2A' : '#e0e0e0',
                  color: colors.text
                }]}
                placeholder="Group Members (comma separated)"
                placeholderTextColor={colors.secondaryText}
                value={groupMembers}
                onChangeText={setGroupMembers}
              />

              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  borderColor: isDarkMode ? '#2A3A2A' : '#e0e0e0',
                  color: colors.text
                }]}
                placeholder="Project Duration (e.g., 3 months)"
                placeholderTextColor={colors.secondaryText}
                value={projectDuration}
                onChangeText={setProjectDuration}
              />

              <TextInput
                style={[styles.input, styles.textArea, { 
                  backgroundColor: colors.background,
                  borderColor: isDarkMode ? '#2A3A2A' : '#e0e0e0',
                  color: colors.text
                }]}
                placeholder="Project Details"
                placeholderTextColor={colors.secondaryText}
                value={projectDetails}
                onChangeText={setProjectDetails}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <TouchableOpacity 
                style={styles.postButton}
                onPress={handlePost}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.buttonBackground, colors.buttonBackground]}
                  style={styles.buttonGradient}
                >
                  <Text style={[styles.buttonText, { color: colors.buttonText }]}>Create Post</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
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
    padding: 20,
  },
  card: {
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
    marginBottom: 6,
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.9,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  postButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 14,
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
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
  },
  categoryButtonText: {
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoryList: {
    maxHeight: 300,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryItemText: {
    marginLeft: 10,
    fontSize: 16,
  },
}); 