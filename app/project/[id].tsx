import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useTheme, themeColors } from '../../context/ThemeContext';
import { useProjects } from '../../context/ProjectContext';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { theme, isDarkMode } = useTheme();
  const colors = themeColors[theme];
  const { getProjectById, deleteProject } = useProjects();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const result = await getProjectById(id as string);
      if (!result) {
        throw new Error('Project not found');
      }
      setProject(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Project",
      "Are you sure you want to delete this project? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await deleteProject(id as string);
              if (success) {
                Alert.alert("Success", "Project deleted successfully", [
                  { text: "OK", onPress: () => router.back() }
                ]);
              } else {
                throw new Error('Failed to delete project');
              }
            } catch (err) {
              Alert.alert("Error", err instanceof Error ? err.message : "Failed to delete project");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <ActivityIndicator size="large" color={colors.text} />
      </SafeAreaView>
    );
  }

  if (error || !project) {
    return (
      <SafeAreaView style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <Text style={[styles.errorText, { color: colors.text }]}>{error || 'Project not found'}</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: colors.buttonBackground }]}
          onPress={loadProject}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]] as [string, string]}
        style={styles.gradient}
      >
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push(`/project/edit/${id}`)}
              >
                <Ionicons name="create-outline" size={24} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={24} color="#ff3b30" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.content}>
              <Text style={[styles.title, { color: colors.text }]}>{project.name}</Text>
              <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
                  <Text style={[styles.sectionContent, { color: colors.secondaryText }]}>
                    {project.description}
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Details</Text>
                  <View style={styles.grid}>
                    <View style={styles.gridItem}>
                      <Text style={[styles.label, { color: colors.secondaryText }]}>Category</Text>
                      <Text style={[styles.value, { color: colors.text }]}>{project.category}</Text>
                    </View>
                    <View style={styles.gridItem}>
                      <Text style={[styles.label, { color: colors.secondaryText }]}>Type</Text>
                      <Text style={[styles.value, { color: colors.text }]}>{project.type}</Text>
                    </View>
                    <View style={styles.gridItem}>
                      <Text style={[styles.label, { color: colors.secondaryText }]}>Duration</Text>
                      <Text style={[styles.value, { color: colors.text }]}>{project.duration}</Text>
                    </View>
                    <View style={styles.gridItem}>
                      <Text style={[styles.label, { color: colors.secondaryText }]}>Status</Text>
                      <Text style={[styles.value, { color: colors.text }]}>{project.status}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Technologies</Text>
                  <View style={styles.tags}>
                    {project.technologies.map((tech: string, index: number) => (
                      <View 
                        key={index}
                        style={[styles.tag, { backgroundColor: colors.tagBackground }]}
                      >
                        <Text style={[styles.tagText, { color: colors.text }]}>{tech}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Languages</Text>
                  <View style={styles.tags}>
                    {project.languages.map((lang: string, index: number) => (
                      <View 
                        key={index}
                        style={[styles.tag, { backgroundColor: colors.tagBackground }]}
                      >
                        <Text style={[styles.tagText, { color: colors.text }]}>{lang}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Team Members</Text>
                  <View style={styles.tags}>
                    {project.group_members.map((member: string, index: number) => (
                      <View 
                        key={index}
                        style={[styles.tag, { backgroundColor: colors.tagBackground }]}
                      >
                        <Text style={[styles.tagText, { color: colors.text }]}>{member}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  tag: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  tagText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});