import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProjects } from '../../context/ProjectContext';
import { useTheme, themeColors } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

type ProjectFormData = {
  name: string;
  description: string;
  category: string;
  type: string;
  duration: string;
  tags: string[];
  technologies: string[];
  tech_stack: string[];
  languages: string[];
  group_members: string[];
  status: 'active' | 'completed';
};

const initialFormData: ProjectFormData = {
  name: '',
  description: '',
  category: '',
  type: '',
  duration: '',
  tags: [],
  technologies: [],
  tech_stack: [],
  languages: [],
  group_members: [],
  status: 'active',
};

export default function NewProjectScreen() {
  const { theme, isDarkMode } = useTheme();
  const colors = themeColors[theme];
  const router = useRouter();
  const { addProject } = useProjects();
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: keyof ProjectFormData, value: string) => {
    if (value.trim() === '') return;
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()],
    }));
    setCurrentTag('');
  };

  const removeArrayItem = (field: keyof ProjectFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      Alert.alert('Error', 'Name and description are required');
      return;
    }

    setLoading(true);
    try {
      const result = await addProject(formData);
      if (result) {
        Alert.alert('Success', 'Project created successfully', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderArrayInput = (
    field: keyof ProjectFormData,
    placeholder: string,
    label: string
  ) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.tagInputContainer}>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.cardBackground }]}
          placeholder={placeholder}
          placeholderTextColor={colors.secondaryText}
          value={currentTag}
          onChangeText={setCurrentTag}
          onSubmitEditing={() => handleArrayInput(field, currentTag)}
        />
        <TouchableOpacity
          style={[styles.addTagButton, { backgroundColor: colors.buttonBackground }]}
          onPress={() => handleArrayInput(field, currentTag)}
        >
          <Ionicons name="add" size={24} color={colors.buttonText} />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tagsContainer}
      >
        {(formData[field] as string[]).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tag, { backgroundColor: colors.tagBackground }]}
            onPress={() => removeArrayItem(field, index)}
          >
            <Text style={[styles.tagText, { color: colors.text }]}>{item}</Text>
            <Ionicons name="close-circle" size={16} color={colors.text} style={styles.tagIcon} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>New Project</Text>
            <View style={styles.backButton} />
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Project Name</Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.cardBackground }]}
                placeholder="Enter project name"
                placeholderTextColor={colors.secondaryText}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Description</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { color: colors.text, backgroundColor: colors.cardBackground },
                ]}
                placeholder="Enter project description"
                placeholderTextColor={colors.secondaryText}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Category</Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.cardBackground }]}
                placeholder="Enter project category"
                placeholderTextColor={colors.secondaryText}
                value={formData.category}
                onChangeText={(value) => handleInputChange('category', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Type</Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.cardBackground }]}
                placeholder="Enter project type"
                placeholderTextColor={colors.secondaryText}
                value={formData.type}
                onChangeText={(value) => handleInputChange('type', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Duration</Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.cardBackground }]}
                placeholder="Enter project duration"
                placeholderTextColor={colors.secondaryText}
                value={formData.duration}
                onChangeText={(value) => handleInputChange('duration', value)}
              />
            </View>

            {renderArrayInput('tags', 'Add a tag', 'Tags')}
            {renderArrayInput('technologies', 'Add a technology', 'Technologies')}
            {renderArrayInput('tech_stack', 'Add to tech stack', 'Tech Stack')}
            {renderArrayInput('languages', 'Add a language', 'Languages')}
            {renderArrayInput('group_members', 'Add a member', 'Group Members')}

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.buttonBackground }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.buttonText} />
              ) : (
                <Text style={[styles.submitButtonText, { color: colors.buttonText }]}>
                  Create Project
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addTagButton: {
    marginLeft: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  tagText: {
    fontSize: 14,
    marginRight: 4,
  },
  tagIcon: {
    marginLeft: 4,
  },
  submitButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
